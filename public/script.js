const btnBuscar = document.getElementById('btnBuscar');
const searchInput = document.getElementById('search');

if (btnBuscar) {
  btnBuscar.addEventListener('click', buscarSucursal);
}

if (searchInput) {
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      buscarSucursal();
    }
  });
}

function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function buscarSucursal() {
  const searchElement = document.getElementById('search');
  if (!searchElement) {
    mostrarError('Error: elemento de búsqueda no encontrado');
    return;
  }
  
  const direccion = searchElement.value.trim();
  
  if (!direccion) {
    mostrarError('Escribe un fraccionamiento o dirección');
    return;
  }

  try {
    const response = await fetch('/buscar-sucursal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ direccion })
    });

    const data = await response.json();

    if (response.ok) {
      mostrarResultado(data);
    } else {
      mostrarError(data.message || 'Error desconocido');
    }
  } catch (error) {
    mostrarError('Error de conexión');
  }
}

function mostrarResultado(sucursal) {
  if (!sucursal || typeof sucursal !== 'object') {
    mostrarError('Datos inválidos recibidos');
    return;
  }

  // Ocultar error
  const errorElement = document.getElementById('error');
  if (errorElement) {
    errorElement.classList.add('hidden');
  }
  
  // Mostrar resultado
  const resultado = document.getElementById('resultado');
  if (!resultado) {
    mostrarError('Error: elemento de resultado no encontrado');
    return;
  }
  resultado.classList.remove('hidden');
  
  // Llenar datos con sanitización
  const nombreElement = document.getElementById('nombreSucursal');
  const telefonoElement = document.getElementById('telefono');
  
  if (nombreElement) {
    nombreElement.textContent = sucursal.nombre || 'Sin nombre';
  }
  if (telefonoElement) {
    telefonoElement.textContent = sucursal.telefono || 'Sin teléfono';
  }
  
  // Enlaces de acción
  const btnWhatsapp = document.getElementById('btnWhatsapp');
  const btnLlamar = document.getElementById('btnLlamar');
  
  if (btnWhatsapp && sucursal.whatsapp) {
    btnWhatsapp.href = `https://wa.me/52${encodeURIComponent(sucursal.whatsapp)}?text=${encodeURIComponent('Hola, quiero hacer un pedido')}`;
  }
  
  if (btnLlamar && sucursal.telefono) {
    btnLlamar.href = `tel:${encodeURIComponent(sucursal.telefono)}`;
  }
  
  // Lista de fraccionamientos
  const lista = document.getElementById('listaZonas');
  if (lista && Array.isArray(sucursal.fraccionamientos)) {
    lista.innerHTML = '';
    sucursal.fraccionamientos.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f || 'Sin nombre';
      lista.appendChild(li);
    });
  }
}

function mostrarError(mensaje) {
  // Ocultar resultado
  const resultado = document.getElementById('resultado');
  if (resultado) {
    resultado.classList.add('hidden');
  }
  
  // Mostrar error
  const error = document.getElementById('error');
  if (error) {
    error.textContent = mensaje || 'Error desconocido';
    error.classList.remove('hidden');
  }
}