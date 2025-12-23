class ApiClient {
  async get(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Erro na requisição");
    }

    return res.json();
  }
}

window.ApiClient = ApiClient;
