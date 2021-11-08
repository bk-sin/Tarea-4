
function drawTable (array, id) {
  const table = document.querySelector(`#${id} tbody`)
  array.forEach(member => {
    const row = document.createElement('tr')
    row.innerHTML = `
    <td>${member.last_name}, ${member.first_name} ${member.middle_name || ''}</td>
    <td>${member.party}</td>
    `
    table.appendChild(row)
  })
}

const chamber = document.querySelector('#table-senate') ? 'senate' : 'house'
const endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

const init = {
  method: 'GET',
  headers: {
    'X-API-Key': 'sVZqS5o2t19Xlawt8xjv1zs1WuH03qfOL9KUGZqT'
  }
}

fetch(endpoint, init)
  .then(res => res.json())
  .then(data => {
    const members = data.results[0].members
    drawTable(members, `table-${chamber}`)
  })
  .catch(err => console.error(err.message))
