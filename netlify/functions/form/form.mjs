const admin = require('firebase-admin');

const serviceAccount = require('../../../creden/credencial.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { dni, celular } = JSON.parse(event.body);

    // Añadir documento a Firestore
    await db.collection('clientes').add({
      dni,
      celular,
      fechaRegistro: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { statusCode: 200, body: 'Datos guardados correctamente' };
  } catch (error) {
    console.error('Error guardando los datos:', error);
    return { statusCode: 500, body: 'Error interno del servidor' };
  }
};
