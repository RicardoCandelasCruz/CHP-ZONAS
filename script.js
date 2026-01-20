const btnBuscar = document.getElementById('btnBuscar');
const btnSeleccionar = document.getElementById('btnSeleccionar');
const searchInput = document.getElementById('search');
const sucursalSelect = document.getElementById('sucursalSelect');

async function cargarSucursales() {
  try {
    const response = await fetch('sucursales.json');
    const sucursales = await response.json();
    
    sucursales.forEach(sucursal => {
      const option = document.createElement('option');
      option.value = sucursal.nombre;
      option.textContent = sucursal.nombre;
      sucursalSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

if (btnBuscar) {
  btnBuscar.addEventListener('click', buscarSucursal);
}

if (btnSeleccionar) {
  btnSeleccionar.addEventListener('click', seleccionarSucursal);
}

if (searchInput) {
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      buscarSucursal();
    }
  });
}

if (sucursalSelect) {
  sucursalSelect.addEventListener('change', function() {
    if (this.value) {
      seleccionarSucursal();
    }
  });
}

async function buscarSucursal() {
  const direccion = document.getElementById('search').value.trim();
  
  if (!direccion) {
    mostrarError('Escribe un fraccionamiento');
    return;
  }

  try {
    const response = await fetch('buscar-sucursal.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direccion })
    });

    const data = await response.json();
    
    if (response.ok) {
      mostrarResultado(data);
    } else {
      mostrarError(data.message);
    }
  } catch (error) {
    mostrarError('Error de conexión');
  }
}

function mostrarResultado(sucursal) {
  document.getElementById('error').classList.add('hidden');
  document.getElementById('resultado').classList.remove('hidden');
  
  document.getElementById('nombreSucursal').textContent = sucursal.nombre;
  document.getElementById('telefono').textContent = sucursal.telefono;
  
  document.getElementById('btnWhatsapp').href = `https://wa.me/52${sucursal.whatsapp}?text=Hola, quiero hacer un pedido`;
  document.getElementById('btnLlamar').href = `tel:${sucursal.telefono}`;
  
  const lista = document.getElementById('listaZonas');
  lista.innerHTML = '';
  sucursal.fraccionamientos.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    lista.appendChild(li);
  });
}

function mostrarError(mensaje) {
  document.getElementById('resultado').classList.add('hidden');
  document.getElementById('error').textContent = mensaje;
  document.getElementById('error').classList.remove('hidden');
}

async function seleccionarSucursal() {
  const sucursalNombre = sucursalSelect.value;
  
  if (!sucursalNombre) {
    mostrarError('Selecciona una sucursal');
    return;
  }

  try {
    const response = await fetch('sucursales.json');
    const sucursales = await response.json();
    const sucursal = sucursales.find(s => s.nombre === sucursalNombre);
    
    if (sucursal) {
      mostrarResultado(sucursal);
    } else {
      mostrarError('Sucursal no encontrada');
    }
  } catch (error) {
    mostrarError('Error de conexión');
  }
}

window.addEventListener('load', cargarSucursales);