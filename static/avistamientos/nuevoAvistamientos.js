const validarForm = () => {
    const validadorSeleccion = (valor) => valor !== "";
    const validadorTexto = (texto) => texto.trim().length > 2;
    const validadorDescripcion = (texto) => texto.length <= 500;
    const validadorArchivos = (archivos) => archivos.length >= 1 && archivos.length <= 5;
    const validadorFechaHora = (fecha, hora) => {
        if (fecha === "" || hora === "") {
            return { valido: false, mensaje: "Debes ingresar una fecha y hora adecuadas." };
        }

        const fechaHoraAvistamiento = new Date(`${fecha}T${hora}`);
        const fechaActual = new Date();
        const fechaMinima = new Date();
        fechaMinima.setFullYear(fechaActual.getFullYear() - 2);

        if (fechaHoraAvistamiento > fechaActual) {
            return { valido: false, mensaje: "La fecha no puede ser futura." };
        }
        if (fechaHoraAvistamiento < fechaMinima) {
            return { valido: false, mensaje: "La fecha es demasiado antigua (máximo 2 años)." };
        }
        return { valido: true, mensaje: "" };
    };

    const marcar = (input, esValido) => {
        input.style.borderColor = esValido ? "" : "red";
    };

    const voluntarioInput = document.getElementById("voluntario");
    const aveInput = document.getElementById("ave");
    const lugarInput = document.getElementById("lugarAvistamiento");
    const fechaInput = document.getElementById("fechaAvistamiento");
    const horaInput = document.getElementById("horaAvistamiento");
    const descripcionInput = document.getElementById("descripcion");
    const pruebaInput = document.getElementById("pruebaAvistamiento");

    let msg = "";

    const voluntarioOk = validadorSeleccion(voluntarioInput.value);
    marcar(voluntarioInput, voluntarioOk);
    if (!voluntarioOk) msg += "Selecciona un voluntario\n";

    const aveOk = validadorSeleccion(aveInput.value);
    marcar(aveInput, aveOk);
    if (!aveOk) msg += "Selecciona un ave\n";

    const lugarOk = validadorTexto(lugarInput.value);
    marcar(lugarInput, lugarOk);
    if (!lugarOk) msg += "Ingresa un lugar válido\n";

    const resultadoFecha = validadorFechaHora(fechaInput.value, horaInput.value);
    marcar(fechaInput, resultadoFecha.valido);
    marcar(horaInput, resultadoFecha.valido);
    if (!resultadoFecha.valido) msg += resultadoFecha.mensaje + "\n";

    const descripcionOk = validadorDescripcion(descripcionInput.value);
    marcar(descripcionInput, descripcionOk);
    if (!descripcionOk) msg += "La descripción no puede superar los 500 caracteres\n";

    const archivosOk = validadorArchivos(pruebaInput.files);
    marcar(pruebaInput, archivosOk);
    if (!archivosOk) msg += "Sube entre 1 y 5 fotos o videos\n";

    if (msg !== "") {
        alert(msg);
        return false;
    }
    return true;
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAvistamiento");
    form.addEventListener("submit", (evento) => {
        if (!validarForm()) {
            evento.preventDefault();
        }
    });
});