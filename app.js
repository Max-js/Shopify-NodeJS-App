//Suppress error for tough-cookie dependancy deprecation
process.noDeprecation = true;
require('dotenv').config();
const readline = require('node:readline');
const request = require('request');
//When running without env file, replace domain with url, excluding https:// and any trailing /'s
const domain = process.env.DOMAIN;
//When running without env file replace admin_token with token string
const admin_token = process.env.ADMIN_TOKEN;

function getProducts(productName) {
  const query = `
    query {
      products(first: 10${productName ? `, query: "title:${productName}"` : ''}) {
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

  const options = {
    url: `https://${domain}/admin/api/2025-01/graphql.json`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': admin_token
    },
    body: JSON.stringify({
      query: query,
    })
  };

  request(options, (error, response) => {
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    const result = JSON.parse(response.body);

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
      askSearchAgain();
    }
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askSearchAgain() {
  rl.question('Would you like to search another product? (y/n): ', input => {
    if (input.toLowerCase() === 'y') {
      runSearch();
    } else if (input.toLowerCase() === 'n') {
      rl.close();
    } else {
      console.log('Invalid input, please enter "y" or "n".');
      askSearchAgain(); 
    }
  })
}

function runSearch() {
  rl.question('Enter a product name to search or leave this field blank if you want to display all products: ', productName => {
    getProducts(productName);
  })
}

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length > 0) {
  const productName = commandLineArgs.join(' ');
  getProducts(productName);
} else {
  console.log('Welcome to the Shopify product search tool!');
  runSearch();
}
