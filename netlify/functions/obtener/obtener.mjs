const admin = require('firebase-admin');

// Suponiendo que firebase-admin ya está inicializado anteriormente
// Si no, necesitarías inicializarlo aquí como se mostró anteriormente

exports.handler = async (event, context) => {
  // Solo permitir solicitudes GET
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const datos = [];
    const snapshot = await admin.firestore().collection('clientes_form').get();

    snapshot.forEach(doc => {
      datos.push({ id: doc.id, ...doc.data() });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(datos),
      headers: {
        'Content-Type': 'application/json',
        // Configura los CORS si es necesario
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET, OPTIONS'
      },
    };
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
