'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function MyShopifyButton({ totalPrice, cartItems }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'scratchclothing.myshopify.com';
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

  const handleShopifyCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!storefrontToken) {
      Swal.fire({
        title: 'Configuration Error',
        text: 'Shopify Storefront Access Token is not set in environment variables.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    setIsProcessing(true);

    Swal.fire({
      title: 'Connecting to Shopify...',
      text: 'Please wait while we prepare your secure checkout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const lineItems = [];

      for (const item of cartItems) {
        // Step 1: Query Shopify Storefront API for the product by handle (slug) or name (fallback)
        const productHandle = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        let shopifyProduct = await fetchShopifyProduct(productHandle);

        // Fallback: If not found by handle, search for product by title
        if (!shopifyProduct) {
          shopifyProduct = await searchShopifyProduct(item.name);
        }

        if (!shopifyProduct || !shopifyProduct.variants?.edges?.length) {
          throw new Error(`Product "${item.name}" was not found on Shopify. Please ensure products are synced between databases.`);
        }

        // Step 2: Match the variant (by SKU or by size/title)
        const variants = shopifyProduct.variants.edges.map((e) => e.node);
        let matchedVariant = null;

        // Try SKU matching
        if (item.sku) {
          matchedVariant = variants.find(
            (v) => v.sku?.toLowerCase() === item.sku.toLowerCase()
          );
        }

        // Try Size/Option matching (case-insensitive)
        if (!matchedVariant && item.variant) {
          const selectedOption = item.variant.trim().toLowerCase();
          matchedVariant = variants.find((v) => {
            const title = v.title.toLowerCase();
            return (
              title === selectedOption ||
              title.includes(`size ${selectedOption}`) ||
              title.includes(selectedOption)
            );
          });
        }

        // Final Fallback: use first variant
        if (!matchedVariant) {
          matchedVariant = variants[0];
        }

        lineItems.push({
          merchandiseId: matchedVariant.id,
          quantity: item.quantity,
        });
      }

      // Step 3: Create Shopify Cart session with resolved variant line items
      const checkoutUrl = await createShopifyCartAndGetUrl(lineItems);

      if (!checkoutUrl) {
        throw new Error('Failed to retrieve the Shopify checkout URL.');
      }

      // Step 4: Redirect user to Shopify Checkout
      Swal.fire({
        title: 'Redirecting...',
        text: 'Sending you to Shopify secure checkout.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 1200);

    } catch (error) {
      console.error('Shopify checkout creation failed:', error);
      setIsProcessing(false);
      Swal.fire({
        title: 'Checkout Failed',
        text: error.message || 'An unexpected error occurred during Shopify checkout.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  // Helper: Fetch product from Shopify Storefront API by handle
  const fetchShopifyProduct = async (handle) => {
    const query = `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          variants(first: 20) {
            edges {
              node {
                id
                title
                sku
              }
            }
          }
        }
      }
    `;

    const response = await callShopifyStorefrontApi(query, { handle });
    return response?.data?.product;
  };

  // Helper: Search products on Shopify Storefront API by name/title
  const searchShopifyProduct = async (name) => {
    const query = `
      query searchProduct($query: String!) {
        products(first: 5, query: $query) {
          edges {
            node {
              id
              title
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    sku
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await callShopifyStorefrontApi(query, { query: name });
    const edge = response?.data?.products?.edges?.[0];
    return edge?.node;
  };

  // Helper: Create Shopify Cart and get checkout URL
  const createShopifyCartAndGetUrl = async (lines) => {
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await callShopifyStorefrontApi(query, { input: { lines } });
    
    if (response?.errors && response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }

    const cartResult = response?.data?.cartCreate;
    if (cartResult?.userErrors && cartResult.userErrors.length > 0) {
      throw new Error(cartResult.userErrors[0].message);
    }

    return cartResult?.cart?.checkoutUrl;
  };

  // Helper: Generic Storefront API Caller
  const callShopifyStorefrontApi = async (query, variables = {}) => {
    try {
      const url = `https://${shopifyDomain}/api/2024-01/graphql.json`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Your Shopify Storefront Access Token is invalid or missing.');
        } else if (response.status === 404) {
          throw new Error('Not Found: The Shopify domain is incorrect or the API endpoint is invalid.');
        }
        throw new Error(`Shopify API responded with status ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Shopify API connection error:', err);
      if (err.message.includes('Unauthorized') || err.message.includes('Not Found') || err.message.includes('status')) {
        throw err;
      }
      throw new Error('Could not connect to Shopify Storefront API. Please check internet connection and domain settings.');
    }
  };

  return (
    <button
      onClick={handleShopifyCheckout}
      disabled={isProcessing || cartItems.length === 0}
      style={{
        width: '100%',
        height: '48px',
        background: 'linear-gradient(135deg, #95bf47 0%, #7da236 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
        boxShadow: '0 4px 12px rgba(149, 191, 71, 0.25)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isProcessing ? 0.75 : 1,
      }}
      onMouseOver={(e) => {
        if (!isProcessing) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(149, 191, 71, 0.4)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(149, 191, 71, 0.25)';
      }}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          background: '#ffffff',
          borderRadius: '4px',
          color: '#95bf47',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.75rem',
        }}
      >
        S
      </span>
      {isProcessing ? 'Connecting...' : 'Pay with Shopify'}
    </button>
  );
}
