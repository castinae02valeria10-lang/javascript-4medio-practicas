/* ============================================================
   config.js — Datos del negocio
   Para usar esta plataforma con otro cliente, cambia SOLO este
   archivo y productos.js. El resto del código no se toca.
   ============================================================ */
const CONFIG = {
  nombre: "MiTienda",                       // Nombre del negocio (sale en el menú y el footer)
  slogan: "Audífonos y cargadores · Por mayor y detalle · Envíos a todo Chile",
  whatsapp: "982235479",                  // Código de país + número, sin + ni espacios (ej: 56912345678)
  instagram: "https://www.instagram.com/MiTienda/",
  cantidadMayor: 3,                         // Desde cuántas unidades de un producto aplica el precio por mayor
  iva: 0.19,                                // IVA en Chile: 19%
  preciosIncluyenIva: false                 // false: se suma el IVA al subtotal | true: los precios ya lo incluyen
};
