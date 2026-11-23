# Aplicación de Avistamiento de Aves - Tarea 4

Módulo desarrollado en Spring Boot que se integra con la aplicación previa en Flask. Permite buscar avistamientos de aves en tiempo real con resaltado dinámico de coincidencias y registrar evaluaciones (notas enteras del 1 al 7) con actualización asíncrona del promedio.

## Decisiones de diseño

* **Busquede por lugar en vez de por comuna: se decidio que en vez de mostrar la comuna al momento de buscar un avisitamiento mostrar el lugar de avistamiento declarado, principalmente porque al momento de ingresar un nuevo avistamiento no se pedia comuna.

