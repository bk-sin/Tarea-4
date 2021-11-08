const select = document.querySelector('#selector')

function mostrarStates (array) {
  const estados = []
  for (let i = 0; i < array.length; i++) {
    estados.push(array[i].state)
  }
  const result = estados.filter((item, index) => {
    return estados.indexOf(item) === index
  })
  const opcionesEstados = document.querySelector('#selector')
  opcionesEstados.innerHTML = '<option selected>Select State</option>'
  result.sort().forEach((e) => {
    opcionesEstados.innerHTML += `<option>${e}</option>`
  })
}

function filtroState (array, state) {
  if (select.value === 'Select State') {
    return array
  }
  const estadoFiltrado = array.filter((estado) => estado.state === state)

  return estadoFiltrado
}

function filtroParty (array, party) {
  let filtrado = []
  for (let i = 0; i < party.length; i++) {
    filtrado = filtrado.concat(array.filter((e) => e.party === party[i]))
  }
  return filtrado
}

function partySel () {
  const checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  const checked = []
  checkboxes.forEach((checkbox) => checked.push(checkbox.value))
  return checked
}

function renderTablaMiembros (array, id) {
  const tablaMiembros = document.querySelector(`#${id} tbody`)
  tablaMiembros.innerHTML = ''
  if (filtroParty(filtroState(array, select.value), partySel()).length > 0) {
    array.forEach((miem) => {
      tablaMiembros.innerHTML += `
    <tr>
      <td>
        <a class="text-light " href="${miem.url}" target="_blank">
          ${miem.last_name} ${miem.first_name} ${miem.middle_name ? miem.middle_name : ' '}
        </a>
      </td>
      <td>${miem.party}</td>
      <td>${miem.state}</td>
      <td>${miem.seniority}</td>
      <td>${miem.votes_with_party_pct}%</td>
    </tr>`
    })
  } else {
    tablaMiembros.innerHTML += `
    <td colspan="5">
      <div class = "alert alert-danger text-center" role = "alert" >
        No hay informacion que mostrar! 
      </div>
    </td>`
  }
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
    const barraDesplegable = document.querySelector('#selector')
    const inputs = document.querySelectorAll('input[type=checkbox]')

    renderTablaMiembros(members, `table-${chamber}`)
    mostrarStates(members)

    function update () {
      renderTablaMiembros(
        filtroParty(filtroState(members, select.value), partySel()).sort((a, b) => a.last_name > b.last_name ? 1 : -1
        ),
        `table-${chamber}`)
    }
    update()

    inputs.forEach(input => input.addEventListener('change', update))
    barraDesplegable.addEventListener('change', update)
  })
  .catch(err => console.error(err.message))
