// Se guarda el string que se va armando
let expresion = "";

// Referencia a la pantalla
const pantalla = document.getElementById("pantalla");

// Se llama cada vez que se aprieta un botón
function agregar(valor) {
    expresion += valor;
    pantalla.innerText = expresion;
}

function borrarTodo() {
    expresion = "";
    pantalla.innerText = "0";
}

function borrarUltimo() {
    expresion = expresion.slice(0, -1);
    pantalla.innerText = expresion === "" ? "0" : expresion;
}

function calcular() {
    try {
        const resultado = eval(expresion);
        pantalla.innerText = resultado;
        expresion = resultado.toString();
    } catch (error) {
        pantalla.innerText = "Error";
        expresion = "";
    }
}