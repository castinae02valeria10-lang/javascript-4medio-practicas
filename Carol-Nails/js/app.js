/* ============================================================
   Carol Nails - lógica de la página
   ============================================================ */
const $ = (sel) => document.querySelector(sel);
const peso = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

/* ---------- Esmaltes (cambia el color de acento) ---------- */
function esTexturaClara(hex) {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150;
}

function elegirEsmalte(esmalte) {
  const raiz = document.documentElement.style;
  raiz.setProperty("--esmalte", esmalte.hex);
  raiz.setProperty("--esmalte-texto", esTexturaClara(esmalte.hex) ? "#1b1416" : "#ffffff");
  $("#esmalte-nombre").textContent = esmalte.nombre;
  document.querySelectorAll(".uña").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.hex === esmalte.hex));
  });
}

function pintarPaleta() {
  const cont = $("#paleta");
  ESMALTES.forEach((e) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "uña";
    b.dataset.hex = e.hex;
    b.style.setProperty("--c", e.hex);
    b.setAttribute("aria-label", e.nombre);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => elegirEsmalte(e));
    cont.appendChild(b);
  });
  elegirEsmalte(ESMALTES[0]);
}

/* ---------- Catálogo ---------- */
let carrito = []; // [{ id, cantidad }]

function pintarCatalogo(filtro = "todos") {
  const grilla = $("#grilla");
  grilla.textContent = "";
  SERVICIOS.filter((s) => filtro === "todos" || s.categoria === filtro).forEach((s) => {
    const art = document.createElement("article");
    art.className = "tarjeta";

    const foto = document.createElement("div");
    foto.className = "tarjeta-foto";
    foto.style.setProperty("--c", s.color);
    if (s.imagen) {
      const img = document.createElement("img");
      img.src = "img/" + s.imagen;
      img.alt = s.nombre;
      img.loading = "lazy";
      foto.appendChild(img);
    }

    const cuerpo = document.createElement("div");
    cuerpo.className = "tarjeta-cuerpo";
    const h3 = document.createElement("h3");
    h3.textContent = s.nombre;
    const p = document.createElement("p");
    p.textContent = s.descripcion;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = peso.format(s.precio) + " · " + s.duracion;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-comprar";
    btn.textContent = "Agregar a mi reserva";
    btn.addEventListener("click", () => agregar(s.id));

    cuerpo.append(h3, p, meta, btn);
    art.append(foto, cuerpo);
    grilla.appendChild(art);
  });
}

function iniciarFiltros() {
  document.querySelectorAll(".filtro").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".filtro").forEach((x) => x.classList.remove("activo"));
      b.classList.add("activo");
      pintarCatalogo(b.dataset.filtro);
    });
  });
}

/* ---------- Carrusel de ofertas ---------- */
let slide = 0;
let timer = null;

function pintarCarrusel() {
  const vista = $("#car-vista");
  const puntos = $("#car-puntos");
  OFERTAS.forEach((o, i) => {
    const art = document.createElement("article");
    art.className = "slide";
    art.hidden = i !== 0;
    const et = document.createElement("span");
    et.className = "etiqueta";
    et.textContent = o.etiqueta;
    const h3 = document.createElement("h3");
    h3.textContent = o.titulo;
    const p = document.createElement("p");
    p.textContent = o.texto;
    art.append(et, h3, p);
    vista.appendChild(art);

    const pt = document.createElement("button");
    pt.type = "button";
    pt.className = "punto" + (i === 0 ? " activo" : "");
    pt.setAttribute("aria-label", "Ir a la oferta " + (i + 1));
    pt.addEventListener("click", () => { irASlide(i); reiniciarTimer(); });
    puntos.appendChild(pt);
  });
  $("#car-prev").addEventListener("click", () => { irASlide(slide - 1); reiniciarTimer(); });
  $("#car-next").addEventListener("click", () => { irASlide(slide + 1); reiniciarTimer(); });
  reiniciarTimer();
}

function irASlide(n) {
  const slides = document.querySelectorAll(".slide");
  const puntos = document.querySelectorAll(".punto");
  slide = (n + slides.length) % slides.length;
  slides.forEach((s, i) => (s.hidden = i !== slide));
  puntos.forEach((p, i) => p.classList.toggle("activo", i === slide));
}

function reiniciarTimer() {
  clearInterval(timer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => irASlide(slide + 1), 5000);
}

/* ---------- Carrito ---------- */
function agregar(id) {
  const item = carrito.find((c) => c.id === id);
  if (item) item.cantidad++;
  else carrito.push({ id, cantidad: 1 });
  pintarCarrito();
}

function quitar(id) {
  carrito = carrito.filter((c) => c.id !== id);
  pintarCarrito();
}

function cambiarCantidad(id, delta) {
  const item = carrito.find((c) => c.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) return quitar(id);
  pintarCarrito();
}

function calcularTotales() {
  const subtotal = carrito.reduce((acc, c) => {
    const s = SERVICIOS.find((x) => x.id === c.id);
    return acc + s.precio * c.cantidad;
  }, 0);
  const iva = Math.round(subtotal * NEGOCIO.iva);
  return { subtotal, iva, total: subtotal + iva };
}

function pintarCarrito() {
  const lista = $("#carrito-lista");
  lista.textContent = "";
  carrito.forEach((c) => {
    const s = SERVICIOS.find((x) => x.id === c.id);
    const li = document.createElement("li");
    li.className = "carrito-item";

    const nombre = document.createElement("span");
    nombre.className = "ci-nombre";
    nombre.textContent = s.nombre;

    const ctrl = document.createElement("span");
    ctrl.className = "ci-ctrl";
    const menos = document.createElement("button");
    menos.type = "button";
    menos.textContent = "−";
    menos.setAttribute("aria-label", "Quitar uno de " + s.nombre);
    menos.addEventListener("click", () => cambiarCantidad(c.id, -1));
    const cant = document.createElement("span");
    cant.textContent = c.cantidad;
    const mas = document.createElement("button");
    mas.type = "button";
    mas.textContent = "+";
    mas.setAttribute("aria-label", "Agregar uno de " + s.nombre);
    mas.addEventListener("click", () => cambiarCantidad(c.id, 1));
    ctrl.append(menos, cant, mas);

    const precio = document.createElement("span");
    precio.className = "ci-precio";
    precio.textContent = peso.format(s.precio * c.cantidad);

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.className = "ci-eliminar";
    eliminar.textContent = "Eliminar";
    eliminar.setAttribute("aria-label", "Eliminar " + s.nombre + " de la reserva");
    eliminar.addEventListener("click", () => quitar(c.id));

    li.append(nombre, ctrl, precio, eliminar);
    lista.appendChild(li);
  });

  const t = calcularTotales();
  $("#t-subtotal").textContent = peso.format(t.subtotal);
  $("#t-iva").textContent = peso.format(t.iva);
  $("#t-total").textContent = peso.format(t.total);
  $("#carrito-vacio").hidden = carrito.length > 0;
  $("#contador").textContent = carrito.reduce((a, c) => a + c.cantidad, 0);
}

/* ---------- Formulario de reserva ---------- */
function mostrarMensaje(texto) {
  const m = $("#mensaje-form");
  m.textContent = texto;
  m.hidden = !texto;
}

function iniciarFormulario() {
  const form = $("#form-reserva");
  const fecha = $("#fecha");
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  fecha.min = hoy.toISOString().slice(0, 10);

  // Dirección solo si es a domicilio
  form.querySelectorAll("input[name='lugar']").forEach((r) => {
    r.addEventListener("change", () => {
      const dom = form.lugar.value === "domicilio";
      $("#bloque-direccion").hidden = !dom;
      $("#direccion").required = dom;
    });
  });

  $("#btn-vaciar").addEventListener("click", () => { carrito = []; pintarCarrito(); });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    mostrarMensaje("");
    if (carrito.length === 0) {
      mostrarMensaje("Agrega al menos un servicio desde el catálogo.");
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const t = calcularTotales();
    const datos = {
      nombre: form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      email: form.email.value.trim(),
      fecha: form.fecha.value,
      hora: form.hora.value,
      lugar: form.lugar.value,
      direccion: form.lugar.value === "domicilio" ? form.direccion.value.trim() : "",
      pago: form.pago.value,
      notas: form.notas.value.trim(),
      servicios: carrito.map((c) => {
        const s = SERVICIOS.find((x) => x.id === c.id);
        return { id: s.id, nombre: s.nombre, precio: s.precio, cantidad: c.cantidad };
      }),
      subtotal: t.subtotal,
      iva: t.iva,
      total: t.total
    };
    try {
      const guardada = await DB.guardarReserva(datos);
      mostrarConfirmacion(guardada);
      carrito = [];
      pintarCarrito();
      form.reset();
      $("#bloque-direccion").hidden = true;
    } catch (e) {
      mostrarMensaje("No pudimos guardar la reserva. Inténtalo de nuevo.");
    }
  });
}

function mostrarConfirmacion(r) {
  const box = $("#confirmacion");
  box.textContent = "";
  const h = document.createElement("h3");
  h.textContent = "Reserva guardada";
  const p = document.createElement("p");
  p.textContent = `${r.nombre}, tu reserva para el ${r.fecha} a las ${r.hora} quedó registrada. Total: ${peso.format(r.total)}.`;

  const lineas = r.servicios.map((s) => `- ${s.nombre} x${s.cantidad}`).join("\n");
  const msg =
    `Hola, soy ${r.nombre}. Quiero confirmar mi reserva:\n${lineas}\n` +
    `Fecha: ${r.fecha} ${r.hora}\nLugar: ${r.lugar === "domicilio" ? "A domicilio (" + r.direccion + ")" : "En el local"}\n` +
    `Pago: ${r.pago}\nTotal: ${peso.format(r.total)}`;
  const a = document.createElement("a");
  a.className = "btn";
  a.href = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = "Enviar por WhatsApp";

  box.append(h, p, a);
  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ---------- Inicio ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#pie-fono").textContent = NEGOCIO.whatsappVisible;
  pintarPaleta();
  pintarCatalogo();
  iniciarFiltros();
  pintarCarrusel();
  pintarCarrito();
  iniciarFormulario();
});
