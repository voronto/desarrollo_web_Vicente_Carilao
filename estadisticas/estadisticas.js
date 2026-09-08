const avistamientosData = [
    { foto: "../imagenes/condor.png", nombre: "Cóndor Andino", tipo: "rapaz", lugar: "San José de Maipo, Metropolitana", fecha: "2026-08-15 14:30" },
    { foto: "../imagenes/cisne coscorona.jpg", nombre: "cisne coscorona", tipo: "acuatica", lugar: "Valdivia, Los Ríos", fecha: "2026-08-14 09:15" },
    { foto: "../imagenes/zorzal.jpg", nombre: "Zorzal", tipo: "paseriforme", lugar: "El Bosque, Metropolitana", fecha: "2026-08-12 18:45" },
    { foto: "../imagenes/loica.jpg", nombre: "Loica", tipo: "paseriforme", lugar: "Rancagua, O'Higgins", fecha: "2026-08-10 11:30" },
    { foto: "../imagenes/carpinterito.jpg", nombre: "Carpinterito", tipo: "piciformes", lugar: "Punta Arenas, Magallanes", fecha: "2026-08-05 16:20" },
    { foto: "../imagenes/pinguinos.jpg", nombre: "Pingüino de Humboldt", tipo: "acuatica", lugar: "La Higuera, Coquimbo", fecha: "2026-08-01 10:00" },
    { foto: "../imagenes/picaflor.jpg", nombre: "Picaflor Chico", tipo: "picaflor", lugar: "Temuco, Araucanía", fecha: "2026-07-28 13:10" },
    { foto: "../imagenes/ñandu.jpg", nombre: "ñandu", tipo: "terrestre", lugar: "Parque nacional Torres del paine", fecha: "2026-07-25 12:23"}
];

const calcularEstadisticas = () => {
    //Total de Avistamientos
    document.getElementById("totalAvistamientos").textContent = avistamientosData.length;

    //Distribución por Tipo
    const conteoTipos = {};
    avistamientosData.forEach(ave => {
        if (conteoTipos[ave.tipo]) {
            conteoTipos[ave.tipo]++;
        } else {
            conteoTipos[ave.tipo] = 1;
        }
    });

    let htmlTipos = "";
    for (let tipo in conteoTipos) {
        let tipoFormateado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        htmlTipos += `
            <div class="item-estadistica">
                <span>${tipoFormateado}:</span>
                <strong>${conteoTipos[tipo]}</strong>
            </div>
        `;
    }
    document.getElementById("resultadoTipos").innerHTML = htmlTipos;

    // Último Avistamiento
    if (avistamientosData.length > 0) {
        const ordenados = [...avistamientosData].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const ultimo = ordenados[0]; 
        
        document.getElementById("ultimoAvistamiento").innerHTML = `
            <p><strong>${ultimo.nombre}</strong></p>
            <p>📍 ${ultimo.lugar}</p>
            <p>📅 ${ultimo.fecha}</p>
        `;
    }
};

calcularEstadisticas();