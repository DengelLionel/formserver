// Ejemplo de cómo podría lucir tu función proxy
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { scriptUrl, ...scriptData } = JSON.parse(event.body);

    const response = await axios.post(scriptUrl, JSON.stringify(scriptData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { 
      statusCode: response.status, 
      body: JSON.stringify(response.data) 
    };
  } catch (error) {
    console.error('Error en la solicitud al script de Google Apps Script:', error);
    return { statusCode: 500, body: 'Error interno del servidor' };
  }
};
