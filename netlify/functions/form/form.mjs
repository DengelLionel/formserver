const axios = require('axios');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Ajusta para producción
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No body in the request' })
    };
  }

  try {
    const { dni, celular } = JSON.parse(event.body);
    const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
    const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
    const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME;

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

    return { statusCode: 200, headers, body: JSON.stringify(response.data) };
  } catch (error) {
    console.error('Shopify API error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to update metafield' }) };
  }
};
