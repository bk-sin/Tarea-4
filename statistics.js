const partiobj = {
  D: 'Democrats',
  R: 'Republicans',
  ID: 'Independents'
}

function renderTablaGlance (array, id, parties) {
  const repsTotal = array.map(x => x.votes_with_party_pct)
  const tablaGlance = document.querySelector(`#${id} tbody `)
  tablaGlance.innerHTML = ''

  for (let i = 0; i < parties.length; i++) {
    const reps = array.filter(x => x.party === parties[i]).map(x => x.votes_with_party_pct)
    const votesSum = reps.reduce((a, b) => a + b, 0)

    tablaGlance.innerHTML += `
    <tr>
      <td>${partiobj[parties[i]]}</td>
      <td>${reps.length}</td>
      <td>${(votesSum / reps.length).toFixed(2)}%</td> 
    </tr>`
  }
  if (array.filter(x => x.party === 'ID').length === 0) {
    tablaGlance.innerHTML +=
    `<tr>
      <td>Independents</td>
      <td>0</td>
      <td>0%</td> 
    </tr>`
  }
  tablaGlance.innerHTML += `
    <tr>
      <td>Total</td>
      <td>${repsTotal.length}</td>
      <td>${(repsTotal.reduce((a, b) => a + b, 0) / repsTotal.length).toFixed(2)}%</td> 
    </tr>`
}

function sorteador (array, type) {
  return array
    .filter((e) => e.total_votes > 0)
    .sort(function (a, b) {
      return type === 'el'
        ? b.missed_votes_pct - a.missed_votes_pct
        : type === 'em'
          ? a.missed_votes_pct - b.missed_votes_pct
          : type === 'll'
            ? a.votes_with_party_pct - b.votes_with_party_pct
            : type === 'lm'
              ? b.votes_with_party_pct - a.votes_with_party_pct
              : 'error'
    })
    .slice(0, (array.length * 0.1) - 1)
}

function renderTabla (array, id, type) {
  const tabla = document.querySelector(`#${id} tbody`)
  tabla.innerHTML = ''
  array.forEach((e) => {
    tabla.innerHTML += `
    <tr>
      <td>${e.last_name} ${e.first_name} ${e.middle_name ? e.middle_name : ' '}</td>
      <td>${type === 'eng' ? e.missed_votes : (e.total_votes * e.votes_with_party_pct / 100).toFixed()}</td>
      <td>${type === 'eng' ? e.missed_votes_pct : e.votes_with_party_pct}%</td> 
    </tr>
    `
  })
}

const chamber = document.querySelector('#senate') ? 'senate' : 'house'

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
    const part = new Set(members.map(x => x.party))
    const parties = [...part]

    if (window.location.href.indexOf('attendance') > -1) {
      renderTabla(sorteador(members, 'el'), 'leastEng', 'eng')
      renderTabla(sorteador(members, 'em'), 'mostEng', 'eng')
    } else if (window.location.href.indexOf('loyalty') > -1) {
      renderTabla(sorteador(members, 'll'), 'leastLoyal', 'loy')
      renderTabla(sorteador(members, 'lm'), 'mostLoyal', 'loy')
    }
    renderTablaGlance(members, 'glance', parties)
  })
  .catch(err => console.error(err.message))
