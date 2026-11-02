# Aplicación de Avistamiento de Aves - Tarea 3

Esta es una aplicación web desarrollada con Flask y MySQL que permite a los usuarios registrar, visualizar y comentar sobre avistamientos de aves en Chile.

## Características principales

* **Sistema de Comentarios Asíncrono:** Los usuarios pueden dejar comentarios en los avistamientos. La inserción y carga de comentarios se realiza en segundo plano mediante `fetch` (AJAX), sin recargar la página.

* **Panel de Estadísticas (Flot.js):** Gráficos interactivos que muestran los avistamientos por día (gráfico de líneas), distribución por tipo de ave (gráfico de torta) y voluntarios por comuna (gráfico de barras).

## Tecnologías utilizadas

* **Librerías externas:** Flot.js  para la renderización de gráficos.

## Decisiones Técnicas

### 1. Sanitización contra ataques XSS

En el sistema de comentarios, los textos ingresados por los usuarios se insertan directamente en el DOM mediante JavaScript. Para evitar la inyección de código malicioso (XSS). Esta función convierte caracteres sensibles (como `<`, `>`, `&`) en sus respectivas entidades HTML, asegurando que cualquier script ingresado se lea como texto plano.



1. Clonar el repositorio.

2. Crear y activar el entorno virtual (`python -m venv venv`).

3. Instalar las dependencias (`pip install -r requirements.txt`).

4. Configurar la base de datos MySQL usando los scripts SQL proporcionados.

5. Ejecutar la aplicación: `flask run`.
