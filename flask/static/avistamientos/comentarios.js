document.addEventListener("DOMContentLoaded", () => {
    const avistamientoId = document.getElementById("avistamiento_id").value;
    const listaComentarios = document.getElementById("lista-comentarios");
    const formComentario = document.getElementById("form-comentario");
    const mensajeError = document.getElementById("mensaje-error");

    // XSS
    const escaparHtml = (texto) => 
        String(texto).replace(/[&<>"']/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[match]);

    // cargar comentarios
    const cargarComentarios = () => {
        fetch(`/api/avistamientos/${avistamientoId}/comentarios`)
            .then(res => res.json())
            .then(datos => {
                listaComentarios.innerHTML = "";
                if (datos.length === 0) {
                    listaComentarios.innerHTML = "<li>No hay comentarios aún.</li>";
                    return;
                }
                datos.forEach(c => {
                    const li = document.createElement("li");
                    li.style.marginBottom = "10px";
                    li.innerHTML = `<strong>${escaparHtml(c.nombre)}</strong> <em>(${c.fecha})</em>:<br> ${escaparHtml(c.texto)}`;
                    listaComentarios.appendChild(li);
                });
            })
            .catch(() => {
                listaComentarios.innerHTML = "<li style='color:red;'>Error al cargar los comentarios.</li>";
            });
    };

    // nuevo comentario 
    formComentario.addEventListener("submit", (e) => {
        e.preventDefault(); 
        mensajeError.style.display = "none";
        
        const nombre = document.getElementById("nombre").value;
        const texto = document.getElementById("texto").value;

        fetch(`/api/avistamientos/${avistamientoId}/comentarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, texto })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detalles ? data.detalles.join(" | ") : data.error);
            }
            formComentario.reset(); 
            cargarComentarios();   
        })
        .catch(err => {
            mensajeError.textContent = err.message;
            mensajeError.style.display = "block"; 
        });
    });

    cargarComentarios();
});