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
    'Access-Control-Allow-Methods': 'POST,GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { nombre, nombreempresa, celular, aceptopoliticas,mensaje } = JSON.parse(event.body);

    // Añadir documento a Firestore
    const docRef = await db.collection('clientes_form').add({
      nombre: nombre,
      nombreempresa:nombreempresa,
      celular: celular.toString(),
      mensaje:mensaje,
      aceptopoliticas: aceptopoliticas,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // URL del script de Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxhy9OWlCclF0b2hbsO0-eZ470M0vNEg8Nn0HVDg8HW79bjB6Zj6G_0RoqKuc9YWsDh/exec';

    // Datos a enviar al script de Google Apps Script
    const scriptData = {
      nombre: nombre,
      nombreempresa:nombreempresa,
      celular: celular.toString(),
      mensaje:mensaje,
      aceptopoliticas: aceptopoliticas
    };

    // Realizar solicitud POST al script de Google Apps Script
    const response = await axios.post(scriptUrl, JSON.stringify(scriptData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verifica la respuesta del script de Google Apps Script
    if (response.status === 200) {
      console.log('Datos enviados al script de Google Apps Script con éxito:', response.data);
      return { statusCode: 200, headers, body: 'Datos guardados correctamente y enviados al script de Google Apps Script' };
    } else {
      throw new Error('Error al enviar datos al script de Google Apps Script');
    }
  } catch (error) {
    console.error('Error guardando los datos o enviando al script de Google Apps Script:', error);
    return { statusCode: 500, headers, body: 'Error interno del servidor' };
  }
};
