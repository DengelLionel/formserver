const axios = require('axios');

exports.handler = async (event, context) => {
  const { dni, celular } = JSON.parse(event.body); // Asegúrate de que estos campos coincidan con los nombres de tus inputs en el formulario.
  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY; // Configura estas variables en tu entorno serverless.
  const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
  const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME; // Asegúrate de incluir solo el nombre de tu tienda, sin ".myshopify.com".

  try {
    const response = await axios.post(`https://${SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2023-01/metafields.json`, {
      metafield: {
        namespace: 'custom_form',
        key: 'customer_info',
        value: JSON.stringify({ dni, celular }),
        value_type: 'json_string',
        owner_resource: 'product',
        owner_id: 'el_id_del_recurso'
      }
    }, {
      auth: {
        username: SHOPIFY_API_KEY,
        password: SHOPIFY_API_PASSWORD
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update metafield' })
    };
  }
};
