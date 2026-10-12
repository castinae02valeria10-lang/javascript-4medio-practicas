// ===== 1. Datos: cada producto es un objeto =====
const productos = [
  { id: 1, nombre: "Polera básica", precio: 9990, categoria: "Poleras", emoji: "👕" },
  { id: 2, nombre: "Jeans clásico", precio: 24990, categoria: "Pantalones", emoji: "👖" },
  { id: 3, nombre: "Polerón con capucha", precio: 29990, categoria: "Polerones", emoji: "🧥" },
  { id: 4, nombre: "Vestido primavera", precio: 27990, categoria: "Vestidos", emoji: "👗" },
  { id: 5, nombre: "Zapatillas urbanas", precio: 39990, categoria: "Calzado", emoji: "👟" },
  { id: 6, nombre: "Gorro deportivo", precio: 7990, categoria: "Accesorios", emoji: "🧢" }
];

// ===== 2. Estado: el carrito se recupera de localStorage =====
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.getElementById("lista-productos");
const contador = document.getElementById("contador-carrito");

// ===== 3. Funciones =====
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

function mostrarProductos() {
  if (!contenedor) return; // esta página no tiene catálogo
  contenedor.innerHTML = "";

  productos.forEach(function (p) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <div class="tarjeta-imagen" aria-hidden="true">${p.emoji}</div>
      <h2>${p.nombre}</h2>
      <p class="categoria">${p.categoria}</p>
      <p class="precio">${formatearPrecio(p.precio)}</p>
      <button class="btn" data-id="${p.id}">Agregar al carrito</button>
    `;
    contenedor.appendChild(tarjeta);
  });
}

function agregarAlCarrito(id) {
  const existente = carrito.find(function (item) {
    return item.id === id;
  });

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  if (!contador) return;
  contador.textContent = carrito.reduce(function (total, item) {
    return total + item.cantidad;
  }, 0);
}

// ===== 4. Eventos =====
if (contenedor) {
  contenedor.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-id]");
    if (!boton) return;
    agregarAlCarrito(Number(boton.dataset.id));
  });
}

// ===== 5. Inicio =====
mostrarProductos();
actualizarContador();s