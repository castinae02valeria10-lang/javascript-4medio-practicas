function evaluarNota() {
    // Obatener el valor ingresado y transformarlo a número flotante
    const input = document.getElementById('notaInput').value;
    const nota = parseFloat(input);

    // 1. Validar si el campo está vacío o no es un número válido
    if (isNaN(nota)) {
        alert("Por favor, introduce una nota valida.");
        return;
    }

    // 2. Validar que la nota esté estrictamente dentro del rango 1.0 a 7.0
    if (nota < 1.0 || nota > 7.0) {
        alert("Error: La nota debe estar en el rango de 1.0 a 7.0.");
        return;
    }

    // 3. Evaluar el rendimiento académico según los rangos establecidos
    if (nota < 4.0) {
        alert("Reprobado");
    } else if (nota < 6.0) {
        alert("Aprobado");
    } else {
        alert("Aprobado con Distincion");
    }
}