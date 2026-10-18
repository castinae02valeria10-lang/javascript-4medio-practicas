/* ============================================================
   DATOS DEL NEGOCIO  (edita aquí; la tía te entrega esta info)
   Los precios son EJEMPLOS. Reemplázalos por los reales.
   ============================================================ */
const NEGOCIO = {
  nombre: "Carol Nails",
  whatsapp: "56900000000",          // sin + ni espacios. PONER EL REAL
  whatsappVisible: "+56 9 0000 0000",
  iva: 0.19
};

// Si la tía tiene fotos, ponlas en /img y escribe el nombre en "imagen"
const SERVICIOS = [
  { id: 1, nombre: "Esmaltado semipermanente", categoria: "manos", precio: 15000, duracion: "60 min", color: "#5b1a2b", imagen: "", descripcion: "Color liso o francés, con brillo que dura semanas." },
  { id: 2, nombre: "Esmaltado con diseño", categoria: "manos", precio: 20000, duracion: "90 min", color: "#d9a79b", imagen: "", descripcion: "Flores, dorados, animal print y más." },
  { id: 3, nombre: "Uñas acrílicas", categoria: "manos", precio: 30000, duracion: "2 h 30", color: "#8a6a1f", imagen: "", descripcion: "Extensión y forma a elección: almendra, ovalada, cuadrada." },
  { id: 4, nombre: "Mantención de acrílicas", categoria: "manos", precio: 20000, duracion: "90 min", color: "#3b6b8c", imagen: "", descripcion: "Relleno y renovación del color." },
  { id: 5, nombre: "Esmaltado de pies", categoria: "pies", precio: 12000, duracion: "60 min", color: "#a63d57", imagen: "", descripcion: "Esmaltado semipermanente en pies." },
  { id: 6, nombre: "Pedicure completo", categoria: "pies", precio: 18000, duracion: "90 min", color: "#7a8f6a", imagen: "", descripcion: "Limpieza, hidratación y esmaltado." }
];

const OFERTAS = [
  { id: 1, titulo: "Manos + pies", texto: "Esmaltado de manos y pies juntos con descuento.", etiqueta: "Pack" },
  { id: 2, titulo: "Primera vez", texto: "Si es tu primera cita, pregunta por tu regalo de bienvenida.", etiqueta: "Nueva clienta" },
  { id: 3, titulo: "Trae a una amiga", texto: "Reserven juntas y las atendemos una después de la otra.", etiqueta: "En pareja" }
];

const ESMALTES = [
  { nombre: "Vino", hex: "#5b1a2b" },
  { nombre: "Nude rosado", hex: "#d9a79b" },
  { nombre: "Azul petróleo", hex: "#1f5f73" },
  { nombre: "Mostaza", hex: "#b8860b" },
  { nombre: "Verde oliva", hex: "#5f6f3f" },
  { nombre: "Negro", hex: "#1b1416" }
];
