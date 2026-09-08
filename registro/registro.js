

const validarForm = () => {
    const validadorMail = (mail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return mail && regex.test(mail);
    };
    const validadorNombre = (nombre) => nombre && nombre.length > 4;
    const validadorTexto = (texto) => texto && texto.length > 4;
    const validadorRegion = (region) => region != "";
    const validadorContraseña = (pswd) => pswd && pswd.length > 8;


    let nombreInput = document.getElementById("nombre");
    let regionSelect = document.getElementById("region");
    let comunaInput = document.getElementById("comuna");
    let direccionInput = document.getElementById("direccion");
    let emailInput = document.getElementById("email");
    let pswdInput = document.getElementById("contraseña");

    let isValid = false;
    let msg = "";

    if (!validadorNombre(nombreInput.value)) {
        msg += "Nombre inválido\n";
        nombreInput.style.borderColor = "red";
    } else {
        nombreInput.style.borderColor = "";
    }

    if (!validadorRegion(regionSelect.value)) {
        msg += "Debes seleccionar una región\n";
        regionSelect.style.borderColor = "red";
    } else {
        regionSelect.style.borderColor = "";
    }

    if (!validadorTexto(comunaInput.value)) {
        msg += "Comuna inválida\n";
        comunaInput.style.borderColor = "red";
    } else {
        comunaInput.style.borderColor = "";
    }

    if (!validadorTexto(direccionInput.value)) {
        msg += "Dirección inválida\n";
        direccionInput.style.borderColor = "red";
    } else {
        direccionInput.style.borderColor = "";
    }

    if (!validadorMail(emailInput.value)) {
        msg += "Mail inválido\n";
        emailInput.style.borderColor = "red";
    } else {
        emailInput.style.borderColor = "";
    }

    if (!validadorContraseña(pswdInput.value)) {
        msg += "Contraseña inválida\n";
        pswdInput.style.borderColor = "red";
    } else {
        pswdInput.style.borderColor = "";
    }

  if (msg === "") {
    msg = "Registro exitoso";
    isValid = true;
}

alert(msg);

if (isValid) {
    sessionStorage.setItem("usuarioRegistrado", "true");

    const contenedor = document.getElementById("exitoContainer");

    contenedor.innerHTML = `
        <a href="../inicio.html" id="volverInicio">Volver al inicio</a>
        <a href="../avistamientos/nuevoAvistamientos.html" id="agregarAve">agregar avistamiento</a>
    `;
    document.querySelector(".datos").style.display = "none";
}

return isValid;

  }

const comunasPorRegion = {
  "arica-parinacota": [
    "Arica", "Camarones", "General Lagos", "Putre"
  ],
  "tarapaca": [
    "Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"
  ],
  "antofagasta": [
    "Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe",
    "San Pedro de Atacama", "Tocopilla", "María Elena"
  ],
  "atacama": [
    "Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro",
    "Vallenar", "Freirina", "Huasco", "Alto del Carmen"
  ],
  "coquimbo": [
    "La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña",
    "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá",
    "Monte Patria", "Punitaqui", "Río Hurtado"
  ],
  "valparaiso": [
    "Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero",
    "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada",
    "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar",
    "Quillota", "La Cruz", "La Calera", "Hijuelas", "Nogales", "San Antonio",
    "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo",
    "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María",
    "Quilpué", "Limache", "Olmué", "Villa Alemana"
  ],
  "metropolitana": [
    "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central",
    "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja",
    "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado",
    "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia",
    "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín",
    "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo",
    "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine",
    "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante",
    "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"
  ],
  "ohiggins": [
    "Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras",
    "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua",
    "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu",
    "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando",
    "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo",
    "Placilla", "Pumanque", "Santa Cruz"
  ],
  "maule": [
    "Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue",
    "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue",
    "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia",
    "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro",
    "San Javier", "Villa Alegre", "Yerbas Buenas"
  ],
  "nuble": [
    "Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón",
    "San Ignacio", "Yungay", "San Carlos", "Coihueco", "Ñiquén", "San Fabián",
    "San Nicolás", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue",
    "Ránquil", "Trehuaco"
  ],
  "biobio": [
    "Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco",
    "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu",
    "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa",
    "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete",
    "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel",
    "Alto Biobío"
  ],
  "araucania": [
    "Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea",
    "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas",
    "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén",
    "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín",
    "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén",
    "Victoria"
  ],
  "los-rios": [
    "Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco",
    "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"
  ],
  "los-lagos": [
    "Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos",
    "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi",
    "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi",
    "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro",
    "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué",
    "Palena"
  ],
  "aysen": [
    "Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane",
    "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"
  ],
  "magallanes": [
    "Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos",
    "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"
  ],
};

const poblarComunas = () => {
  let regionSelect = document.getElementById("region");
  let comunaSelect = document.getElementById("comuna");

  comunaSelect.innerHTML = '<option value="">Selecciona tu comuna</option>';

  const region = regionSelect.value;
  if (region && comunasPorRegion[region]) {
    comunasPorRegion[region].forEach((comuna) => {
      let option = document.createElement("option");
      option.value = comuna.toLowerCase().replace(/\s+/g, "-");
      option.text = comuna;
      comunaSelect.appendChild(option);
    });
  }
};

document.getElementById("region").addEventListener("change", poblarComunas);


let submitBtn = document.getElementById("envio");
submitBtn.addEventListener("click", validarForm);
