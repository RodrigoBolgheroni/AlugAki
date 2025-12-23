export async function getSerie(codigo) {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados?formato=json`;

  const response = await fetch(url);
  return response.json();
}
