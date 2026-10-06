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


let paginaActual = 1;
const elementosPorPagina = 4;

const cuerpoTabla = document.getElementById("cuerpoTabla");
const contenedorPaginacion = document.querySelector(".paginacion");
const filtroTipo = document.getElementById("filtroTipo");
const ordenarPor = document.getElementById("ordenarPor");

const renderTabla = () => {
    let datosProcesados = avistamientosData.filter(ave => {
        if (filtroTipo.value === "todos") return true;
        return ave.tipo === filtroTipo.value;
    });

    datosProcesados.sort((a, b) => {
        const valorOrden = ordenarPor.value;
        if (valorOrden === "fechaDesc") {
            return new Date(b.fecha) - new Date(a.fecha); 
        } else if (valorOrden === "fechaAsc") {
            return new Date(a.fecha) - new Date(b.fecha); 
        } else if (valorOrden === "lugarAsc") {
            return a.lugar.localeCompare(b.lugar); 
        } else if (valorOrden === "lugarDesc") {
            return b.lugar.localeCompare(a.lugar); 
        }
    });

    const totalPaginas = Math.ceil(datosProcesados.length / elementosPorPagina);
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const datosPaginados = datosProcesados.slice(inicio, fin);
    
    cuerpoTabla.innerHTML = ""; 
    
    if (datosPaginados.length === 0) {
        cuerpoTabla.innerHTML = "<tr><td colspan='5'>No se encontraron aves con este filtro.</td></tr>";
    } else {
        datosPaginados.forEach(ave => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="celda-foto"><img src="${ave.foto}" alt="${ave.nombre}" class="img-tabla"></td>
                <td>${ave.nombre}</td>
                <td>${ave.tipo}</td>
                <td>${ave.lugar}</td>
                <td>${ave.fecha}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }
    dibujarPaginacion(totalPaginas);
};

const dibujarPaginacion = (totalPaginas) => {
    contenedorPaginacion.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
        let btn = document.createElement("a");
        btn.href = "#";
        btn.textContent = i;
        btn.className = "pag-btn" + (i === paginaActual ? " activo" : "");
        
        btn.addEventListener("click", (e) => {
            e.preventDefault(); 
            paginaActual = i; 
            renderTabla(); 
        });

        contenedorPaginacion.appendChild(btn);
    }
};

filtroTipo.addEventListener("change", () => {
    paginaActual = 1; 
    renderTabla();
});

ordenarPor.addEventListener("change", () => {
    paginaActual = 1; 
    renderTabla();
});

renderTabla();