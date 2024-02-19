import axios from 'axios';

// Asume que has configurado las variables de entorno en Netlify para SHOPIFY_API_KEY, SHOPIFY_API_PASSWORD, y SHOPIFY_SHOP_NAME
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME;

export default async (req, context) => {
  // Parsea el cuerpo de la solicitud (asumiendo que es JSON)
  const { dni, celular } = await req.json();
console.log("shop",SHOPIFY_SHOP_NAME)
  try {
    const response = await axios.post(`https://${SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2023-01/metafields.json`, {
      metafield: {
        namespace: 'custom_form',
        key: 'customer_info',
        value: JSON.stringify({ dni, celular }),
        value_type: 'json_string',
        owner_resource: 'product',
        owner_id: 'el_id_del_recurso' // Asegúrate de reemplazar esto con el ID real del recurso al que quieres asociar el metafield
      }
    }, {
      auth: {
        username: SHOPIFY_API_KEY,
        password: SHOPIFY_API_PASSWORD
      }
    });

    // Retorna una respuesta exitosa con los datos de la respuesta de Shopify
    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error al actualizar metafield:', error);
    // Retorna una respuesta de error
    return new Response(JSON.stringify({ error: 'Failed to update metafield' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};
