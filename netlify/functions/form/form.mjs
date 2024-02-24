const admin = require('firebase-admin');

const serviceAccount = require('../../../creden/credencial.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  // Encabezados para permitir solicitudes CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://isatexhome.com/', // Cambia esto por tu dominio de Shopify
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Responder a solicitudes de preflight (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Asegúrate de que el método HTTP sea POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { documento, celular,aceptopoliticas,documentselected } = JSON.parse(event.body);

    // Añadir documento a Firestore
    await db.collection('clientes').add({
      documento,
      celular,
      fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
      aceptopoliticas:aceptopoliticas==true&&"acepto",
      documentselected:documentselected
    });

    return { statusCode: 200, headers, body: 'Datos guardados correctamente' };
  } catch (error) {
    console.error('Error guardando los datos:', error);
    return { statusCode: 500, headers, body: 'Error interno del servidor' };
  }
};
