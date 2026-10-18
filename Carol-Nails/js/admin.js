/* Panel de reservas: lee y actualiza el registro a través de DB */
const peso = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const ESTADOS = ["pendiente", "confirmada", "realizada", "cancelada"];

function celda(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

async function cargar() {
  const reservas = await DB.listarReservas();
  const filas = document.getElementById("filas");
  filas.textContent = "";

  const activas = reservas.filter((r) => r.estado !== "cancelada");
  const ingresos = activas.reduce((a, r) => a + r.total, 0);
  document.getElementById("resumen").textContent =
    reservas.length === 0
      ? "Todavía no hay reservas. Cuando una clienta reserve desde la página, aparecerá aquí."
      : `${reservas.length} reservas registradas. Total estimado (sin canceladas): ${peso.format(ingresos)}.`;

  reservas.forEach((r) => {
    const tr = document.createElement("tr");
    tr.appendChild(celda(`${r.fecha} ${r.hora}`));
    tr.appendChild(celda(`${r.nombre}\n${r.telefono}`));
    tr.appendChild(celda(r.servicios.map((s) => `${s.nombre} x${s.cantidad}`).join(", ")));
    tr.appendChild(celda(r.lugar === "domicilio" ? "Domicilio: " + r.direccion : "Local"));
    tr.appendChild(celda(peso.format(r.total)));

    const tdEstado = document.createElement("td");
    const sel = document.createElement("select");
    sel.setAttribute("aria-label", "Estado de la reserva de " + r.nombre);
    ESTADOS.forEach((e) => {
      const op = document.createElement("option");
      op.value = e;
      op.textContent = e;
      op.selected = e === r.estado;
      sel.appendChild(op);
    });
    sel.addEventListener("change", async () => { await DB.cambiarEstado(r.id, sel.value); cargar(); });
    tdEstado.appendChild(sel);
    tr.appendChild(tdEstado);

    const tdAccion = document.createElement("td");
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn-sec";
    del.textContent = "Eliminar";
    del.addEventListener("click", async () => {
      if (confirm("¿Eliminar la reserva de " + r.nombre + "?")) {
        await DB.eliminarReserva(r.id);
        cargar();
      }
    });
    tdAccion.appendChild(del);
    tr.appendChild(tdAccion);

    filas.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", cargar);
