/* ============================================================
   CAPA DE BASE DE DATOS
   Hoy guarda en el navegador (localStorage) para que la
   página funcione sola. Todas las funciones devuelven Promesas
   a propósito: así, para conectar una base de datos real
   (MySQL, SQLite, Firebase, etc.) solo se cambia ESTE archivo
   por llamadas fetch() a la API, y app.js / admin.js no cambian.
   ============================================================ */
const DB = (() => {
  const CLAVE = "carolnails_reservas";

  const leer = () => {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
    catch (e) { return []; }
  };
  const escribir = (lista) => localStorage.setItem(CLAVE, JSON.stringify(lista));

  return {
    // Crea una reserva y devuelve el registro guardado (con id y fecha de creación)
    guardarReserva(reserva) {
      const lista = leer();
      const nueva = {
        ...reserva,
        id: Date.now(),
        estado: "pendiente",
        creada: new Date().toISOString()
      };
      lista.push(nueva);
      escribir(lista);
      return Promise.resolve(nueva);
    },
    listarReservas() {
      return Promise.resolve(leer().sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)));
    },
    cambiarEstado(id, estado) {
      const lista = leer();
      const r = lista.find(x => x.id === id);
      if (r) r.estado = estado;
      escribir(lista);
      return Promise.resolve(r || null);
    },
    eliminarReserva(id) {
      escribir(leer().filter(x => x.id !== id));
      return Promise.resolve(true);
    }
  };
})();
