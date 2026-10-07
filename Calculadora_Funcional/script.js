let expresion = "";
let hayResultado = false;

const pantalla = document.getElementById("pantalla");
const historial = document.getElementById("historial");
const OPERADORES = "+-*/";

function mostrar() {
    pantalla.classList.remove("error");
    const t = expresion.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
    pantalla.textContent = t === "" ? "0" : t;
}

function mostrarError(msg) {
    pantalla.classList.add("error");
    pantalla.textContent = msg;
    expresion = "";
    hayResultado = false;
}

function agregar(valor) {
    const ultimo = expresion.slice(-1);
    const esOperador = OPERADORES.includes(valor);

    // Después de un resultado: un número empieza de cero, un operador continúa
    if (hayResultado && !esOperador) { expresion = ""; historial.textContent = ""; }
    hayResultado = false;

    if (esOperador) {
        if (expresion === "" && valor !== "-") return;          // no empezar con + × ÷
        if (expresion === "-") return;                          // solo un signo menos
        if (OPERADORES.includes(ultimo)) expresion = expresion.slice(0, -1); // reemplaza operador
    }
    if (valor === ".") {
        const numeroActual = expresion.split(/[+\-*/]/).pop();
        if (numeroActual.includes(".")) return;                 // un solo punto por número
        if (numeroActual === "") valor = "0.";                  // ".5" -> "0.5"
    }
    expresion += valor;
    mostrar();
}

function borrarTodo() {
    expresion = ""; hayResultado = false;
    historial.textContent = "";
    mostrar();
}

function borrarUltimo() {
    if (hayResultado) { borrarTodo(); return; }
    expresion = expresion.slice(0, -1);
    mostrar();
}

// Evaluador propio (respeta el orden: primero × ÷, luego + −)
function evaluar(texto) {
    const tokens = texto.match(/\d+\.?\d*|[+\-*/]/g) || [];
    let i = 0;
    function factor() {
        const t = tokens[i++];
        if (t === "-") return -factor();
        if (t === undefined || OPERADORES.includes(t)) throw new Error("formato");
        return parseFloat(t);
    }
    function termino() {
        let v = factor();
        while (tokens[i] === "*" || tokens[i] === "/") {
            const op = tokens[i++];
            const d = factor();
            if (op === "/" && d === 0) throw new Error("div0");
            v = op === "*" ? v * d : v / d;
        }
        return v;
    }
    function suma() {
        let v = termino();
        while (tokens[i] === "+" || tokens[i] === "-") {
            const op = tokens[i++];
            const d = termino();
            v = op === "+" ? v + d : v - d;
        }
        return v;
    }
    const r = suma();
    if (i < tokens.length) throw new Error("formato");
    return r;
}

function calcular() {
    // Si termina en operador, se ignora
    while (expresion !== "" && OPERADORES.includes(expresion.slice(-1))) {
        expresion = expresion.slice(0, -1);
    }
    if (expresion === "") return;
    const original = pantalla.textContent;
    try {
        const r = Math.round(evaluar(expresion) * 1e10) / 1e10;
        historial.textContent = original + " =";
        expresion = String(r);
        hayResultado = true;
        mostrar();
    } catch (e) {
        mostrarError(e.message === "div0" ? "No se puede dividir por 0" : "Operación inválida");
    }
}

// Botones
document.getElementById("botones").addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.valor) agregar(b.dataset.valor);
    else if (b.dataset.accion === "limpiar") borrarTodo();
    else if (b.dataset.accion === "atras") borrarUltimo();
    else if (b.dataset.accion === "igual") calcular();
});

// Teclado
document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key) || OPERADORES.includes(e.key)) agregar(e.key);
    else if (e.key === ".") agregar(".");
    else if (e.key === "," ) agregar(".");
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calcular(); }
    else if (e.key === "Backspace") borrarUltimo();
    else if (e.key === "Escape") borrarTodo();
});