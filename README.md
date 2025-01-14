# Shopify NodeJS App

This is a simple app that communicates with Shopify's Admin GraphQL app to gather and display your product information.  
It takes a product name as the input, searches your products, and outputs matching products with their variants sorted by price.

# Directions:

Use git clone to clone the project to your local machine.

Open the app within your preferred IDE (I prefer VSCode).

Either configure a `.env` file to contain the `DOMAIN` AND `ADMIN_TOKEN` for your store, or you can hard code the variables:  
- Replace domain with your store domain, (ex: your-shopify-store.myshopify.com)  
- Replace admin token with your Shopify admin token.

Once this is complete you can run the app by opening a terminal, navigating to the project directory, and entering `node app.js`.  
*Note: Running `node app.js` will take you to CLI which asks to input a product name. However you can bypass this by adding a product name argument when running the script (ex: `node app.js -shirt`).
