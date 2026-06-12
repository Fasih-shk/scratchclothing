'use client';

import React from 'react';
import GooglePayButton from '@google-pay/button-react';
import Swal from 'sweetalert2';

export default function MyGooglePayButton({ totalPrice }) {
  // Ensure we format the price correctly (must be a string for Google Pay)
  const formattedPrice = Number(totalPrice).toFixed(2).toString();

  const isLive = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live');
  
  // To avoid OR_BIBED_11 on localhost, Google Pay requires 'TEST' environment. 
  // However, Stripe Live keys will reject TEST tokens. 
  // For actual live testing, you must test on your verified production domain.
  const environment = isLive && typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'PRODUCTION' 
    : 'TEST';

  return (
    <GooglePayButton
      environment={environment}
      buttonColor="black"
      buttonType="buy"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'stripe',
                'stripe:version': '2023-10-16',
                'stripe:publishableKey': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY',
              },
            },
          },
        ],
        merchantInfo: {
          // You must use your actual Merchant ID in production.
          merchantId: 'BCR2DN7T7C277ZC6', 
          merchantName: 'Scratch Clothing',
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: formattedPrice,
          currencyCode: 'GBP', // Using GBP as you are in the UK, change if needed
          countryCode: 'GB',
        },
      }}
      onLoadPaymentData={async (paymentRequest) => {
        console.log('Payment data loaded:', paymentRequest);
        
        try {
          // Google Pay returns the Stripe token as a JSON string inside the tokenizationData
          const tokenJson = JSON.parse(paymentRequest.paymentMethodData.tokenizationData.token);
          
          // Send the token to your Next.js backend
          const response = await fetch('/api/checkout/google-pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: tokenJson.id,
              amount: totalPrice,
              currency: 'GBP',
            }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            Swal.fire({
              title: 'Good job!',
              text: 'Payment Successfully Processed via Stripe!',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#6366f1' // Modern indigo to match button
            });
          } else {
            Swal.fire({
              title: 'Payment Failed',
              text: result.error || 'The payment could not be processed.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#ef4444' // Red for error
            });
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          Swal.fire({
            title: 'Oops...',
            text: 'An unexpected error occurred during checkout.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
          });
        }
      }}
      buttonSizeMode="fill"
      className="w-full h-full"
    />
  );
}
