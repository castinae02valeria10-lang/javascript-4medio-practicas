function verificarParidad() {
    let inputNumero = document.getElementById("txtNumero").value;
    let divResultado = document.getElementById("resParidad");

    let numero = parseInt(inputNumero);

    if (isNaN(numero)) {
        divResultado.innerHTML = "Por favor, ingrese un número válido.";
        return;
    }

    if (numero % 2 === 0) {
        divResultado.innerHTML = "El número " + numero + " es <b>PAR</b>.";
    } else {
        divResultado.innerHTML = "El número " + numero + " es <b>IMPAR</b>.";
    }
}