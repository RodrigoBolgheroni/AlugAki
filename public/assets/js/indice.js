const api = new ApiClient();
let cache = {};

const radios = document.querySelectorAll('input[name="indice"]');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('table-search');

async function carregarIndice(indice) {
  if (!cache[indice]) {
    cache[indice] = await api.get(`/api/bcb/${indice}`);
  }

  renderTable(cache[indice]);
}

function renderTable(rows) {
  if (!rows || rows.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3">Sem dados</td></tr>';
    return;
  }

  tableBody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.data}</td>
      <td>${r.valor}%</td>
      <td>-</td>
    </tr>
  `).join('');
}

radios.forEach(radio => {
  radio.addEventListener('change', e => {
    if (e.target.checked) {
      carregarIndice(e.target.value);
    }
  });
});

searchInput.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('#table-body tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term)
      ? ''
      : 'none';
  });
});

// inicial
carregarIndice("igpm");
