const URL_DIAS = "/api/estadisticas/avistamientos-por-dia";
const URL_AVES = "/api/estadisticas/avistamientos-por-ave";
const URL_COMUNAS = "/api/estadisticas/voluntarios-por-comuna";

const escaparHtml = (texto) =>
    String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const mostrarMensaje = (idContenedor, mensaje) => {
    const contenedor = document.getElementById(idContenedor);
    contenedor.textContent = mensaje;
    contenedor.classList.add("sin-datos");
};

// Pide datos al servidor; si algo falla, muestra un mensaje dentro del gráfico
const cargarDatos = (url, idContenedor, dibujar) => {
    fetch(url)
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("Respuesta " + respuesta.status);
            }
            return respuesta.json();
        })
        .then((datos) => {
            if (datos.length === 0) {
                mostrarMensaje(idContenedor, "Aún no hay datos para mostrar.");
            } else {
                dibujar(datos);
            }
        })
        .catch(() => {
            mostrarMensaje(idContenedor, "No se pudieron cargar los datos del gráfico.");
        });
};

// 1) Gráfico de líneas
const dibujarDias = (datos) => {
    const serie = datos.map((fila) => {
        const [anio, mes, dia] = fila.fecha.split("-").map(Number);
        return [Date.UTC(anio, mes - 1, dia), fila.total];
    });

    $.plot("#graficoDias", [{ data: serie, label: "Avistamientos" }], {
        series: {
            lines: { show: true },
            points: { show: true }
        },
        xaxis: {
            mode: "time",
            timeformat: "%d/%m/%Y",
            minTickSize: [1, "day"]
        },
        yaxis: {
            min: 0,
            minTickSize: 1,
            tickDecimals: 0
        },
        legend: { show: false },
        grid: { borderWidth: 1 }
    });
};

// 2) Gráfico de torta
const dibujarAves = (datos) => {
    const serie = datos.map((fila) => ({
        label: escaparHtml(fila.ave),
        data: fila.total
    }));

    $.plot("#graficoAves", serie, {
        series: {
            pie: {
                show: true,
                radius: 1,
                combine: { threshold: 0.05, label: "Otras" }
            }
        },
        legend: {
            show: true,
            labelFormatter: (etiqueta, s) =>
                etiqueta + " (" + Math.round(s.data[0][1]) + " - " + s.percent.toFixed(1) + "%)"
        }
    });
};

// 3) Gráfico de barras
const dibujarComunas = (datos) => {
    const serie = datos.map((fila) => [escaparHtml(fila.comuna), fila.total]);

    $.plot("#graficoComunas", [{ data: serie }], {
        series: {
            bars: {
                show: true,
                barWidth: 0.6,
                align: "center",
                fill: 0.8
            }
        },
        xaxis: {
            mode: "categories",
            tickLength: 0
        },
        yaxis: {
            min: 0,
            minTickSize: 1,
            tickDecimals: 0
        },
        grid: { borderWidth: 1 }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    cargarDatos(URL_DIAS, "graficoDias", dibujarDias);
    cargarDatos(URL_AVES, "graficoAves", dibujarAves);
    cargarDatos(URL_COMUNAS, "graficoComunas", dibujarComunas);
});