if (sessionStorage.getItem("usuarioRegistrado") !== "true") {
    alert("Debes registrarte antes de informar un avistamiento.");
    window.location.href = "../registro/registro.html";
}

const validarForm = () => {

    const validadorAve = (ave) => ave != "";
    const validadorTexto = (texto) => texto && texto.length > 2;
    const validadorPrueba = (prueba) => prueba 
    const validadorFechaHora = (fecha,hora) => {

        if (fecha === "" ||hora ==="" ) {
        return { valido: false, mensaje: "Debes ingresar una fecha y hora adecuadas.\n" };
        };

        const fechaHoraAvistamiento = new Date(`${fecha}T${hora}`);

        const fechaActual = new Date();

        const fechaMinima = new Date();
        fechaMinima.setFullYear(fechaActual.getFullYear() - 2);

        if (fechaHoraAvistamiento > fechaActual) {
        return { valido: false, mensaje: "Poner fecha valida\n" };
        };
        if (fechaHoraAvistamiento < fechaMinima) {
        return { valido: false, mensaje: "La fecha es demasiado antigua (máximo 2 años).\n" };
        };
        return {valido: true, mensaje:""};

    };

    let aveInput = document.getElementById("tipoAve");
    let nombreInput = document.getElementById("nombre");
    let lugarInput = document.getElementById("lugarAvistamiento");
    let fechaInput = document.getElementById("fechaAvistamiento");
    let horaInput = document.getElementById("horaAvistamiento");
    let pruebaInput = document.getElementById("pruebaAvistamiento");

    let isValid = false;
    let msg = "";

    if (!validadorAve(aveInput.value)) {
        msg += "Selecicone algun tipo!\n";
        nombreInput.style.borderColor = "red";
    } else {
        nombreInput.style.borderColor = "";
    }

    if(!validadorFechaHora(fechaInput.value, horaInput.value)){
        msg += validadorFechaHora(fechaInput.value, horaInput.value).mensaje;
        fechaInput.style.borderColor = "red";
        horaInput.style.borderColor = "red";
    } else {
        fechaInput.style.borderColor = "";
        horaInput.style.borderColor = "";
    }
    if (!validadorTexto(lugarInput)){
        msg += "De un lugar valido\n";
        lugarInput.style.borderColor ="red";
    } else {
        lugarInput.style.borderColor ="";
    }
    if(!validadorPrueba(pruebaInput)){
        msg += "Suba una imagen o video";
        pruebaInput.style.borderBlockColor ="red";
    } else {
        pruebaInput.style.borderBlockColor = "";
    }

    if (msg === "") {
        msg = "Registro exitoso";
        isValid = true;
    }

alert(msg);

let submitBtn = document.getElementById("envio");
submitBtn.addEventListener("click", validarForm);





}