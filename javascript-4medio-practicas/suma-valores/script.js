 function realizarSuma() {
        // 1. Obtener los valores de los inputs de texto
        const valor1 = document.getElementById('num1').value;
        const valor2 = document.getElementById('num2').value;

        // 2. Convertir los textos a números usando parseFloat para permitir decimales
        const numero1 = parseFloat(valor1);
        const numero2 = parseFloat(valor2);

        // 3. Validar si el usuario realmente ingresó números válidos
        if (isNaN(numero1) || !valor2) {
            document.getElementById('resultadoTexto').innerText = "Por favor, ingresa ambos números.";
            return;
        }

        // 4. Calcular el resultado
        const suma = numero1 + numero2;

        // 5. Mostrar el resultado por pantalla cambiando el texto del div
        document.getElementById('resultadoTexto').innerText = "Resultado: " + suma;
    }