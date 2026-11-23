const form = document.getElementById("busquedaForm");
const searchInput = document.getElementById("searchInput");
const resultadosBody = document.getElementById("resultadosBody");
const mensajeEstado = document.getElementById("mensajeEstado");

let ultimaBusqueda = "";

form.addEventListener("submit", (e) => {
    e.preventDefault();
});

// Seguridad contra ataques
function seguridadHtml(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Destaca coincidencias
function destacarTexto(texto, patron) {
    if (!patron) return seguridadHtml(texto);
    const patronSeguro = patron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${patronSeguro})`, "gi");

    return String(texto)
        .split(regex)
        .map((parte, indice) =>
            indice % 2 === 1
                ? `<span class="highlight">${seguridadHtml(parte)}</span>`
                : seguridadHtml(parte)
        )
        .join("");
}

//Busqueda asincronica
searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    ultimaBusqueda = query;

    if (query.length === 0) {
        resultadosBody.innerHTML = "";
        mensajeEstado.textContent = "";
        return;
    }

    try {
        const response = await fetch(`/api/avistamientos/buscar?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Error al consultar avistamientos");
        }

        const datos = await response.json();

        if (query !== ultimaBusqueda) return;

        renderizarResultados(datos, query);
    } catch (error) {
        console.error(error);
        mensajeEstado.textContent = "Ocurrió un error al buscar avistamientos.";
        resultadosBody.innerHTML = "";
    }
});

function renderizarResultados(avistamientos, query) {
    resultadosBody.innerHTML = "";

    if (avistamientos.length === 0) {
        mensajeEstado.textContent = "No se encontraron avistamientos para la búsqueda ingresada.";
        return;
    }

    mensajeEstado.textContent = "";

    avistamientos.forEach((item) => {
        const fila = document.createElement("tr");

        const voluntario = destacarTexto(item.nombreVoluntario, query);
        const ave = destacarTexto(item.nombreAve, query);
        const lugar = destacarTexto(item.lugar, query);
        const fecha = seguridadHtml(item.fechaAvistamiento);
        const notaTexto = item.promedio !== null ? item.promedio : "-";

        // Detalles del avistamiento
        const tdDetalles = document.createElement("td");
        tdDetalles.innerHTML = `
            <strong>Ave:</strong> ${ave}<br>
            <strong>Voluntario:</strong> ${voluntario}<br>
            <strong>Lugar:</strong> ${lugar}<br>
            <strong>Día:</strong> ${fecha}
        `;

        // Nota promedio
        const tdNota = document.createElement("td");
        tdNota.className = "nota-cell";
        tdNota.id = `nota-${item.id}`;
        tdNota.textContent = notaTexto;

        // Botón
        const tdAccion = document.createElement("td");
        const btnEvaluar = document.createElement("button");
        btnEvaluar.type = "button";
        btnEvaluar.className = "evaluar-btn";
        btnEvaluar.textContent = "Evaluar";

        const selectNota = document.createElement("select");
        selectNota.className = "nota-select";
        selectNota.hidden = true;

        const opcionDefault = document.createElement("option");
        opcionDefault.value = "";
        opcionDefault.textContent = "Nota (1-7)";
        selectNota.appendChild(opcionDefault);

        for (let n = 1; n <= 7; n++) {
            const opcion = document.createElement("option");
            opcion.value = String(n);
            opcion.textContent = String(n);
            selectNota.appendChild(opcion);
        }

        btnEvaluar.addEventListener("click", () => {
            selectNota.hidden = !selectNota.hidden;
            selectNota.value = "";
        });

        selectNota.addEventListener("change", async () => {
            const notaInt = Number(selectNota.value);
            if (!Number.isInteger(notaInt) || notaInt < 1 || notaInt > 7) {
                return;
            }
            await enviarEvaluacion(item.id, notaInt, tdNota, selectNota);
        });

        tdAccion.appendChild(btnEvaluar);
        tdAccion.appendChild(selectNota);

        fila.appendChild(tdDetalles);
        fila.appendChild(tdNota);
        fila.appendChild(tdAccion);
        resultadosBody.appendChild(fila);
    });
}

// Envio asincrono de la nota
async function enviarEvaluacion(avistamientoId, nota, celdaNota, selectNota) {
    try {
        const response = await fetch(`/api/avistamientos/${avistamientoId}/evaluar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota: nota })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "No se pudo guardar la nota.");
            return;
        }

        celdaNota.textContent = data.nuevoPromedio;
        selectNota.hidden = true;
        selectNota.value = "";
    } catch (error) {
        console.error(error);
        alert("Error de conexión al guardar la nota.");
    }
}