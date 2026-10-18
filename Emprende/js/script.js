/* ============================================================
   script.js — Lógica de la plataforma (JavaScript nativo)
   Orden de carga en el HTML: config.js → productos.js → script.js
   ============================================================ */

/* ===== 1. Estado: el pedido se guarda en localStorage ===== */
let carrito = leerCarrito();

function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem("carrito"));
    if (!Array.isArray(guardado)) return [];
    // Solo dejamos productos que todavía existen en productos.js
    return guardado.filter(function (item) {
      return buscarProducto(item.id) && item.cantidad > 0;
    });
  } catch (e) {
    return [];
  }
}

function guardarCarrito() {
  try {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } catch (e) {
    // Si el navegador bloquea el almacenamiento, el pedido sigue funcionando en esta visita
  }
  actualizarContador();
}

/* ===== 2. Utilidades ===== */
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

function buscarProducto(id) {
  return productos.find(function (p) {
    return p.id === id;
  });
}

// Regla del negocio: desde CONFIG.cantidadMayor unidades se aplica el precio por mayor
function precioUnitario(producto, cantidad) {
  return cantidad >= CONFIG.cantidadMayor ? producto.precioMayor : producto.precioDetalle;
}

/* Ilustraciones de respaldo: se usan cuando un producto no tiene foto (o la foto no existe) */
const ILUSTRACIONES = {
  audifonos:
    '<svg class="ilustracion" viewBox="0 0 400 400" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
    '<g class="sombra"><rect x="122" y="212" width="156" height="118" rx="44" fill="#fff"/></g>' +
    '<path d="M122 262H278" stroke="#d3e3d9" stroke-width="3" fill="none"/>' +
    '<circle cx="200" cy="262" r="5" fill="#bcd3c5"/>' +
    '<circle cx="200" cy="304" r="5" fill="#2f9e5f"/>' +
    '<g class="sombra" transform="rotate(-12 118 130)"><circle cx="118" cy="100" r="38" fill="#fff"/><rect x="130" y="110" width="18" height="96" rx="9" fill="#fff"/></g>' +
    '<g class="sombra" transform="rotate(12 282 130)"><circle cx="282" cy="100" r="38" fill="#fff"/><rect x="252" y="110" width="18" height="96" rx="9" fill="#fff"/></g>' +
    "</svg>",
  cargador:
    '<svg class="ilustracion" viewBox="0 0 400 400" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
    '<g class="sombra"><rect x="140" y="150" width="120" height="124" rx="26" fill="#fff"/></g>' +
    '<rect x="172" y="112" width="14" height="42" rx="5" fill="#bcd3c5"/>' +
    '<rect x="214" y="112" width="14" height="42" rx="5" fill="#bcd3c5"/>' +
    '<circle cx="200" cy="212" r="10" fill="#2f9e5f"/>' +
    '<path class="sombra" d="M200 274C200 330 130 322 140 360S250 376 280 338" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>' +
    "</svg>"
};

function htmlIlustracion(tipo) {
  return ILUSTRACIONES[tipo] || ILUSTRACIONES.audifonos;
}

function htmlImagen(p) {
  if (p.imagen) {
    return '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy" data-respaldo="' + p.ilustracion + '">';
  }
  return htmlIlustracion(p.ilustracion);
}

// Si una foto no carga, la cambiamos por la ilustración para que nunca se vea una imagen rota
function activarRespaldoImagenes(raiz) {
  if (!raiz) return;
  raiz.querySelectorAll("img[data-respaldo]").forEach(function (img) {
    function cambiar() {
      const caja = document.createElement("div");
      caja.innerHTML = htmlIlustracion(img.dataset.respaldo);
      img.replaceWith(caja.firstElementChild);
    }
    img.addEventListener("error", cambiar);
    if (img.complete && img.naturalWidth === 0) cambiar();
  });
}

function calcularTotales() {
  let subtotal = 0;
  carrito.forEach(function (item) {
    const p = buscarProducto(item.id);
    if (p) subtotal += precioUnitario(p, item.cantidad) * item.cantidad;
  });

  let neto, iva, total;
  if (CONFIG.preciosIncluyenIva) {
    total = subtotal;
    neto = Math.round(total / (1 + CONFIG.iva));
    iva = total - neto;
  } else {
    neto = subtotal;
    iva = Math.round(neto * CONFIG.iva);
    total = neto + iva;
  }
  return { neto: neto, iva: iva, total: total };
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;
  contador.textContent = carrito.reduce(function (total, item) {
    return total + item.cantidad;
  }, 0);
}

/* ===== 3. Avisos y WhatsApp ===== */
let temporizadorAviso = null;

function mostrarAviso(texto) {
  let aviso = document.getElementById("aviso");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = "aviso";
    aviso.className = "aviso";
    aviso.setAttribute("role", "status");
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("visible");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    aviso.classList.remove("visible");
  }, 2500);
}

function numeroWhatsappValido() {
  return /^\d{8,15}$/.test(CONFIG.whatsapp);
}

function abrirWhatsapp(texto) {
  if (!numeroWhatsappValido()) {
    mostrarAviso("Falta configurar el número de WhatsApp en config.js");
    return;
  }
  const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
  window.open(url, "_blank", "noopener");
}

/* ===== 4. Marca: nombre, footer y enlaces ===== */
function aplicarMarca() {
  document.querySelectorAll(".logo, .nombre-tienda").forEach(function (el) {
    el.textContent = CONFIG.nombre;
  });

  document.querySelectorAll("#enlace-whatsapp, #enlace-whatsapp-contacto").forEach(function (el) {
    el.href = "https://wa.me/" + CONFIG.whatsapp;
  });

  document.querySelectorAll("#enlace-instagram, #enlace-instagram-contacto").forEach(function (el) {
    el.href = CONFIG.instagram;
  });

  document.querySelectorAll("#slogan, .slogan-texto").forEach(function (el) {
    el.textContent = CONFIG.slogan;
  });
}

/* ===== 4b. Portada: precio más bajo por mayor y foto con respaldo ===== */
function iniciarHero() {
  const precio = document.getElementById("hero-precio");
  if (!precio) return;

  const minimo = Math.min.apply(null, productos.map(function (p) {
    return p.precioMayor;
  }));
  precio.textContent = formatearPrecio(minimo);

  const cantidad = document.getElementById("hero-cantidad");
  if (cantidad) cantidad.textContent = CONFIG.cantidadMayor;

  activarRespaldoImagenes(document.getElementById("hero-visual"));
}

/* ===== 5. Carrusel de ofertas (index) ===== */
function iniciarCarrusel() {
  const carrusel = document.getElementById("ofertas");
  if (!carrusel) return;

  const slides = carrusel.querySelectorAll(".slide");
  let actual = 0;
  let temporizador = null;

  function mostrar(n) {
    slides[actual].classList.remove("activa");
    actual = (n + slides.length) % slides.length;
    slides[actual].classList.add("activa");
  }

  function iniciar() {
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducirMovimiento || temporizador) return;
    temporizador = setInterval(function () {
      mostrar(actual + 1);
    }, 4000);
  }

  function detener() {
    clearInterval(temporizador);
    temporizador = null;
  }

  document.getElementById("carrusel-prev").addEventListener("click", function () {
    mostrar(actual - 1);
  });
  document.getElementById("carrusel-next").addEventListener("click", function () {
    mostrar(actual + 1);
  });

  // Se pausa si la persona pasa el mouse o usa el teclado dentro del carrusel
  carrusel.addEventListener("mouseenter", detener);
  carrusel.addEventListener("mouseleave", iniciar);
  carrusel.addEventListener("focusin", detener);
  carrusel.addEventListener("focusout", iniciar);

  iniciar();
}

/* ===== 6. Catálogo con buscador y filtro (index) ===== */
function dibujarProductos(contenedor, lista) {
  contenedor.innerHTML = "";

  lista.forEach(function (p) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML =
      '<div class="tarjeta-imagen">' + htmlImagen(p) +
      '<span class="insignia">Por mayor desde ' + CONFIG.cantidadMayor + " u.</span></div>" +
      '<div class="tarjeta-cuerpo">' +
      '<p class="categoria">' + p.categoria + "</p>" +
      "<h3>" + p.nombre + "</h3>" +
      '<p class="precio">' + formatearPrecio(p.precioDetalle) + " <span>c/u</span></p>" +
      '<p class="precio-mayor">' + CONFIG.cantidadMayor + " o más: <strong>" + formatearPrecio(p.precioMayor) + "</strong> c/u</p>" +
      '<div class="acciones">' +
      '<button type="button" class="btn" data-agregar="' + p.id + '">Agregar al pedido</button>' +
      '<a class="enlace-detalle" href="producto.html?id=' + p.id + '">Ver detalle</a>' +
      "</div></div>";
    contenedor.appendChild(tarjeta);
  });

  activarRespaldoImagenes(contenedor);
}

function iniciarCatalogo() {
  const contenedor = document.getElementById("lista-productos");
  if (!contenedor) return;

  const buscador = document.getElementById("buscador");
  const selector = document.getElementById("filtro-categoria");
  const sinResultados = document.getElementById("sin-resultados");

  // Llenamos el filtro con las categorías que existen en productos.js
  const categorias = [];
  productos.forEach(function (p) {
    if (!categorias.includes(p.categoria)) categorias.push(p.categoria);
  });
  categorias.forEach(function (c) {
    const opcion = document.createElement("option");
    opcion.value = c;
    opcion.textContent = c;
    selector.appendChild(opcion);
  });

  function actualizar() {
    const texto = buscador.value.trim().toLowerCase();
    const categoria = selector.value;

    const filtrados = productos.filter(function (p) {
      const coincideTexto = p.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === "todas" || p.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });

    dibujarProductos(contenedor, filtrados);
    sinResultados.hidden = filtrados.length > 0;
  }

  buscador.addEventListener("input", actualizar);
  selector.addEventListener("change", actualizar);

  // Un solo listener para todos los botones "Agregar" (delegación de eventos)
  contenedor.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-agregar]");
    if (!boton) return;
    const producto = buscarProducto(Number(boton.dataset.agregar));
    agregarAlCarrito(producto.id, 1);
    mostrarAviso(producto.nombre + " agregado a tu pedido");
  });

  actualizar();
}

/* ===== 7. Operaciones del pedido ===== */
function agregarAlCarrito(id, cantidad) {
  const unidades = cantidad || 1;
  const existente = carrito.find(function (item) {
    return item.id === id;
  });

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + unidades, 999);
  } else {
    carrito.push({ id: id, cantidad: Math.min(unidades, 999) });
  }
  guardarCarrito();
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(function (i) {
    return i.id === id;
  });
  if (!item) return;

  item.cantidad = Math.min(item.cantidad + cambio, 999);
  if (item.cantidad <= 0) quitarDelCarrito(id);
  else guardarCarrito();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(function (item) {
    return item.id !== id;
  });
  guardarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

/* ===== 8. Página de producto (producto.html?id=1) ===== */
function iniciarDetalle() {
  const titulo = document.getElementById("detalle-nombre");
  if (!titulo) return;

  const articulo = document.getElementById("detalle-producto");
  const error = document.getElementById("detalle-error");
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const p = buscarProducto(id);

  if (!p) {
    articulo.hidden = true;
    error.hidden = false;
    return;
  }

  document.title = p.nombre + " | " + CONFIG.nombre;
  document.getElementById("miga-nombre").textContent = p.nombre;
  const cajaImagen = document.getElementById("detalle-imagen");
  cajaImagen.innerHTML = htmlImagen(p);
  activarRespaldoImagenes(cajaImagen);
  titulo.textContent = p.nombre;
  document.getElementById("detalle-categoria").textContent = p.categoria;
  document.getElementById("detalle-descripcion").textContent = p.descripcion;
  document.getElementById("detalle-precio").textContent = formatearPrecio(p.precioDetalle) + " c/u";
  document.getElementById("detalle-mayor").textContent =
    "Desde " + CONFIG.cantidadMayor + " unidades: " + formatearPrecio(p.precioMayor) + " c/u";

  const lista = document.getElementById("detalle-caracteristicas");
  lista.innerHTML = "";
  p.caracteristicas.forEach(function (texto) {
    const li = document.createElement("li");
    li.textContent = texto;
    lista.appendChild(li);
  });

  const campoCantidad = document.getElementById("cantidad");

  document.getElementById("btn-agregar").addEventListener("click", function () {
    const cantidad = Number(campoCantidad.value);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 999) {
      mostrarAviso("Escribe una cantidad entre 1 y 999");
      campoCantidad.focus();
      return;
    }
    agregarAlCarrito(p.id, cantidad);
    mostrarAviso(cantidad + " x " + p.nombre + " agregado a tu pedido");
  });

  document.getElementById("btn-consultar").addEventListener("click", function () {
    abrirWhatsapp("Hola, quiero consultar por: " + p.nombre);
  });
}

/* ===== 9. Página "Mi pedido" ===== */
function construirMensajePedido(nombre, ciudad) {
  const t = calcularTotales();
  const lineas = ["Hola, quiero hacer este pedido:", ""];

  carrito.forEach(function (item) {
    const p = buscarProducto(item.id);
    const unitario = precioUnitario(p, item.cantidad);
    lineas.push(
      "• " + item.cantidad + " x " + p.nombre +
      " (" + formatearPrecio(unitario) + " c/u) = " + formatearPrecio(unitario * item.cantidad)
    );
  });

  lineas.push("");
  lineas.push("Subtotal: " + formatearPrecio(t.neto));
  lineas.push("IVA (" + Math.round(CONFIG.iva * 100) + "%): " + formatearPrecio(t.iva));
  lineas.push("Total: " + formatearPrecio(t.total));
  lineas.push("");
  lineas.push("Nombre: " + nombre);
  lineas.push("Ciudad de envío: " + ciudad);
  return lineas.join("\n");
}

function mostrarPedido() {
  const lista = document.getElementById("lista-pedido");
  if (!lista) return;

  const vacio = document.getElementById("pedido-vacio");
  const contenido = document.getElementById("pedido-contenido");

  if (carrito.length === 0) {
    vacio.hidden = false;
    contenido.hidden = true;
    return;
  }
  vacio.hidden = true;
  contenido.hidden = false;

  lista.innerHTML = "";
  carrito.forEach(function (item) {
    const p = buscarProducto(item.id);
    const unitario = precioUnitario(p, item.cantidad);
    const esMayor = item.cantidad >= CONFIG.cantidadMayor;

    const li = document.createElement("li");
    li.className = "item-pedido";
    li.innerHTML =
      '<div class="item-info">' +
      "<strong>" + p.nombre + "</strong>" +
      "<span>" + formatearPrecio(unitario) + " c/u" + (esMayor ? " (precio por mayor)" : "") + "</span>" +
      "</div>" +
      '<div class="item-cantidad">' +
      '<button type="button" data-accion="menos" data-id="' + p.id + '" aria-label="Disminuir cantidad de ' + p.nombre + '">−</button>' +
      '<span class="cantidad-numero">' + item.cantidad + "</span>" +
      '<button type="button" data-accion="mas" data-id="' + p.id + '" aria-label="Aumentar cantidad de ' + p.nombre + '">+</button>' +
      "</div>" +
      '<p class="item-total">' + formatearPrecio(unitario * item.cantidad) + "</p>" +
      '<button type="button" class="btn-quitar" data-accion="quitar" data-id="' + p.id + '" aria-label="Quitar ' + p.nombre + ' del pedido">Quitar</button>';
    lista.appendChild(li);
  });

  const t = calcularTotales();
  document.getElementById("etiqueta-iva").textContent = "IVA (" + Math.round(CONFIG.iva * 100) + "%)";
  document.getElementById("total-neto").textContent = formatearPrecio(t.neto);
  document.getElementById("total-iva").textContent = formatearPrecio(t.iva);
  document.getElementById("total-final").textContent = formatearPrecio(t.total);
}

function iniciarPedido() {
  const lista = document.getElementById("lista-pedido");
  if (!lista) return;

  lista.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;
    const id = Number(boton.dataset.id);

    if (boton.dataset.accion === "mas") cambiarCantidad(id, 1);
    if (boton.dataset.accion === "menos") cambiarCantidad(id, -1);
    if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
    mostrarPedido();
  });

  document.getElementById("btn-vaciar").addEventListener("click", function () {
    vaciarCarrito();
    mostrarPedido();
  });

  // La validación nativa (required, minlength) corre antes de este evento
  document.getElementById("form-pedido").addEventListener("submit", function (e) {
    e.preventDefault();
    if (carrito.length === 0) {
      mostrarAviso("Tu pedido está vacío");
      return;
    }
    const nombre = document.getElementById("pedido-nombre").value.trim();
    const ciudad = document.getElementById("pedido-ciudad").value.trim();
    abrirWhatsapp(construirMensajePedido(nombre, ciudad));
  });

  mostrarPedido();
}

/* ===== 10. Formulario de contacto ===== */
function iniciarContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const datos = new FormData(form);
    const texto = [
      "Hola, te escribo desde la web.",
      "",
      "Nombre: " + datos.get("nombre"),
      "Correo: " + datos.get("correo"),
      "Teléfono: " + (datos.get("telefono") || "No indicado"),
      "Asunto: " + datos.get("asunto"),
      "",
      "Mensaje: " + datos.get("mensaje")
    ].join("\n");
    abrirWhatsapp(texto);
  });
}

/* ===== 11. Inicio: cada función solo actúa si encuentra su página ===== */
aplicarMarca();
actualizarContador();
iniciarHero();
iniciarCarrusel();
iniciarCatalogo();
iniciarDetalle();
iniciarPedido();
iniciarContacto();
