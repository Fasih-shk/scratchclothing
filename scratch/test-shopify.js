const testShopify = async (domain, ver) => {
  const url = `https://${domain}/api/${ver}/graphql.json`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': 'f18651cd3976f6e104ea64caf8ecf562'
      },
      body: JSON.stringify({ query: '{ shop { name } }' })
    });
    console.log(`[${domain}] [${ver}] status:`, res.status);
    const data = await res.text();
    console.log(`[${domain}] [${ver}] response:`, data);
  } catch (err) {
    console.error(`[${domain}] [${ver}] error:`, err);
  }
};

testShopify('scratchclothing.myshopify.com', '2023-10');
testShopify('scratchclothing.myshopify.com', '2024-04');
testShopify('scratchclothing.myshopify.com', '2024-07');
testShopify('scratchclothing.myshopify.com', '2024-10');
testShopify('scratchclothing.myshopify.com', 'unstable');
