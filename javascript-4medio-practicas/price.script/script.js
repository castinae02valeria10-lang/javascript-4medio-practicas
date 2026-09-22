// Declaración de variables y captura de datos
let precioOriginal = parseFloat(prompt("Ingrese el precio original:"));
let porcentajeDescuento = parseFloat(prompt("Ingrese el % de descuento:"));

// Procesamiento de datos
let descuento = precioOriginal * (porcentajeDescuento / 100);
let precioFinal = precioOriginal - descuento;

// Salida de resultados
document.getElementById("resultado").innerHTML= 
"<strong>--- RESUMEN DE COMPRA ---</strong><br>" +
"Precio Original: $" + precioOriginal + "<br>" +
"Descuento Aplicado: $" + descuento + "<br>" +
"Total Neto a Pagar: $" + precioFinal;