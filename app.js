require('dotenv').config();
const request = require('request');
//When running without env file, replace domain with url, excluding https:// and any trailing /'s
const domain = process.env.DOMAIN;
//When running without env file replace admin_token with token string
const admin_token = process.env.ADMIN_TOKEN;

const queryString = `
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          variants(first: 20) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
  }
`;

function getProducts() {
    const options = {
      url: `https://${domain}/admin/api/2025-01/graphql.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': admin_token
      },
      body: JSON.stringify({
        query: queryString,
      })
    };
    request(options, (error, body) => {
        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        const result = JSON.parse(body.body);

        if (result.errors) {
          console.error('GraphQL Errors:', result.errors);
        } else {
          const products = result.data.products.edges.map(edge => {
            const product = edge.node;
            const variants = product.variants.edges.map(variantEdge => variantEdge.node);
            variants.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            return {
              ...product,
              variants
            };
          });

          console.log('Retrieved Products and Variants:', JSON.stringify(products, null, 2));
        }
      });
    }

getProducts();