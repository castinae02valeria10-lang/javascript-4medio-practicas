/* ============================================================
   productos.js — Catálogo
   Aquí el dueño agrega, edita o quita productos.
   Para agregar uno: copia un bloque { ... }, cambia el id (único) y los datos.
   Los precios son de EJEMPLO: confírmalos con el cliente.
   Para usar foto: guarda la imagen en la carpeta img/ y escribe
   imagen: "img/nombre-de-la-foto.jpg". Si queda vacío (o la foto no existe),
   se muestra una ilustración según "ilustracion": "audifonos" o "cargador".
   ============================================================ */
const productos = [
  {
    id: 1,
    nombre: "AirPods Blancos",
    categoria: "Audífonos",
    descripcion: "Disfruta de la mejor calidad de sonido con los AirPods Blancos. Con envío a todo Chile.",
    caracteristicas: [
      "Calidad de sonido premium",
      "Conectividad Bluetooth 5.0",
      "Duración de batería de hasta 5 horas",
      "Carga rápida con estuche de carga"
    ],
    precioDetalle: 17990,
    precioMayor: 15990,
    ilustracion: "audifonos",
    imagen: ""
  },
  {
    id: 2,
    nombre: "AirPods 2ª generación",
    categoria: "Audífonos",
    descripcion: "Audífonos inalámbricos con estuche de carga. Consulta disponibilidad por WhatsApp.",
    caracteristicas: [
      "Consulta los detalles por WhatsApp"
    ],
    precioDetalle: 20000,
    precioMayor: 15990,
    ilustracion: "audifonos",
    imagen: ""
  },
  {
    id: 3,
    nombre: "Cargador iPhone",
    categoria: "Cargadores",
    descripcion: "Cargador para iPhone. Consulta modelos y disponibilidad por WhatsApp.",
    caracteristicas: [
      "Consulta los detalles por WhatsApp"
    ],
    precioDetalle: 9990,
    precioMayor: 7990,
    ilustracion: "cargador",
    imagen: ""
  }
];
