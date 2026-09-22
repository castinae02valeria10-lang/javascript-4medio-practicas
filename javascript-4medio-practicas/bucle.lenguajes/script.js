const lenguajes = ["JavaScript", "Python", "Java", "C++", "PHP"];

console.log("---Lenguajes de programación---:");

const lista = document.getElementById("listaLenguajes");

for (let i = 0; i < lenguajes.length; i++) {

    //Se suma 1 a 'i' para que la salida sea más legible, ya que los índices de los arreglos comienzan en 0.
    //Y su visualizacion del usuario.
    console.log("Posición " + (i + 1) + ": " + lenguajes[i]);

    // Crear un <li> por cada lenguaje y agregarlo a la lista visual
    const item = document.createElement("li");
    item.textContent = "Posición " + (i + 1) + ": " + lenguajes[i];
    lista.appendChild(item);
}