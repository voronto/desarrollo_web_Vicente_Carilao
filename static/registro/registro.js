document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (!form) return; 

    const comunaTexto = document.getElementById("comunaTexto");
    const comunaId = document.getElementById("comuna");
    const opciones = Array.from(document.querySelectorAll("#listaComunas option"));

    const sincronizarComuna = () => {
        const op = opciones.find(o => o.value === comunaTexto.value.trim());
        comunaId.value = op ? op.dataset.id : "";
        comunaTexto.style.borderColor = op ? "" : "red";
        return Boolean(op);
    };

    comunaTexto.addEventListener("input", sincronizarComuna);

    if (comunaTexto.value) sincronizarComuna();

    form.addEventListener("submit", (evento) => {
        if (!sincronizarComuna()) {
            evento.preventDefault();
            alert("Selecciona una comuna de la lista");
        }
    });
});