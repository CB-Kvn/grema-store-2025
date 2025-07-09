
let API_URL = null;
const INTERVAL = 5 * 60 * 1000; // 5 minutos
let timer = null;

async function fetchApi() {
  if (!API_URL) return;
  console.log('Consultando API:', API_URL);
  try {
    const response = await fetch(API_URL);
    // Maneja la respuesta si lo necesitas
  } catch (error) {
    // console.error('Error al consultar el API:', error);
  }
}

function startPolling() {
  if (timer) clearInterval(timer);
  timer = setInterval(fetchApi, INTERVAL);
  fetchApi();
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_API_URL') {
    API_URL = event.data.url;
    startPolling();
  }
  if (event.data === 'STOP_API_POLLING' && timer) {
    clearInterval(timer);
    timer = null;
  }
});