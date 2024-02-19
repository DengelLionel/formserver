const axios = require('axios');

exports.handler = async (event, context) => {
  // Verificar si event.body tiene contenido
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No data provided' })
    };
  }

  let dni, celular;

  try {
    // Intentar analizar el cuerpo de la solicitud
    const data = JSON.parse(event.body);
    dni = data.dni;
    celular = data.celular;
  } catch (error) {
    // Manejar el error si el JSON no se puede analizar
    console.error('Error parsing JSON:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON input' })
    };
  }

  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
  const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
  const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME;

  try {
    const response = await axios.post(`https://${SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2023-01/metafields.json`, {
      metafield: {
        namespace: 'custom_form',
        key: 'customer_info',
        value: JSON.stringify({ dni, celular }),
        value_type: 'json_string',
        owner_resource: 'product',
        owner_id: 'el_id_del_recurso' // Asegúrate de reemplazar esto con el ID real del recurso.
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
    console.error('Shopify API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update metafield' })
    };
  }
};
