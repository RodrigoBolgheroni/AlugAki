import ApiClient from '../utils/api.js';

const api = new ApiClient();

export async function initIndice() {
  const data = await api.get('/api/bcb/igpm');
  console.log(data);
}
