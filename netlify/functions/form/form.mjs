const admin = require('firebase-admin');
const axios = require('axios'); // Asegúrate de importar axios

const serviceAccount = require('../../../creden/credencial.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' https://apis.google.com; object-src 'none';"
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { documento, celular, aceptopoliticas, documentselected } = JSON.parse(event.body);

    // Añadir documento a Firestore
    const docRef = await db.collection('clientes_form').add({
      documentselected: documentselected,
      documento: documento.toString(),
      celular: celular.toString(),
      aceptopoliticas: aceptopoliticas,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // URL del script de Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxEy7FCeGx4zWJMDzmA2xVQQM012kFVxBfIc2582laLQVqI3--0c3jyZDXBDBD-U7kE/exec';

    // Datos a enviar al script de Google Apps Script
    const scriptData = {
      documento: documento.toString(),
      celular: celular.toString(),
      aceptopoliticas,
      documentselected,
    };

    // Realizar solicitud POST al script de Google Apps Script a través de un proxy
    // Cambia 'tu-url-de-proxy' a la URL de tu función serverless de Netlify que actúa como proxy
    const proxyUrl = 'https://remarkable-hummingbird-2f0c09.netlify.app/.netlify/functions/proxy'; // Esta debería ser la URL de tu función serverless diseñada para actuar como proxy
    const response = await axios.post(proxyUrl, JSON.stringify(scriptData), {
      headers: {
        'Content-Type': 'application/json',
        // Agrega cualquier cabecera adicional requerida por tu proxy o el destino
      },
    });

    // Verifica la respuesta del proxy (que a su vez es la del script de Google Apps Script)
    if (response.status === 200) {
      console.log('Datos reenviados a través del proxy y al script de Google Apps Script con éxito:', response.data);
      return { statusCode: 200, headers, body: 'Datos guardados correctamente y reenviados a través del proxy al script de Google Apps Script' };
    } else {
      throw new Error('Error al reenviar datos a través del proxy al script de Google Apps Script');
    }
  } catch (error) {
    console.error('Error guardando los datos o reenviándolos a través del proxy:', error);
    return { statusCode: 500, headers, body: 'Error interno del servidor' };
  }
};
