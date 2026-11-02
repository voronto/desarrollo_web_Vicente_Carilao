import math
import os
import re
import uuid
from datetime import datetime

from flask import (Flask, abort, flash, jsonify, redirect, render_template,
                   request, url_for)
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename

from database import db
from utils.validacion import (detect_file_type, es_entero,
                               validate_avistamiento, validate_voluntario)

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y" 
app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "static", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 50 * 1000 * 1000 
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

PAGE_SIZE = 5
EXTENSIONES_VIDEO = {"mp4", "webm"}


def es_video(ruta):
    return bool(ruta) and ruta.rsplit(".", 1)[-1].lower() in EXTENSIONES_VIDEO


app.jinja_env.globals["es_video"] = es_video

@app.errorhandler(413)
def archivo_muy_grande(_error):
    return "Los archivos son demasiado grandes (máximo 50 MB en total).", 413


@app.route("/", methods=["GET"])
def inicio():
    ultimos = db.get_ultimos_avistamientos(2)
    return render_template("inicio.html", ultimos=ultimos)


def _ctx_registro(datos, errores):
    comunas = db.get_todas_las_comunas()
    return {"comunas":comunas, "datos": datos, "errores": errores}


@app.route("/registro", methods=["GET", "POST"])
def registro():
    if request.method == "POST":
        datos = request.form
        errores = validate_voluntario(datos)
        if not errores:
            try:
                voluntario_id = db.create_voluntario(
                    datos["nombre"].strip(), datos["email"].strip(),
                    datos["telefono"].strip(), int(datos["comuna"]))
                return redirect(url_for("registro", exito=voluntario_id))
            except SQLAlchemyError:
                errores["general"] = "No se pudo guardar el registro. Intenta nuevamente."
        return render_template("registro.html", exito=None, **_ctx_registro(datos, errores))
    exito = request.args.get("exito", type=int)
    if exito is not None and db.get_voluntario_by_id(exito) is None:
        exito = None
    return render_template("registro.html", exito=exito, **_ctx_registro({}, {}))


@app.route("/api/regiones/<int:region_id>/comunas", methods=["GET"])
def api_comunas(region_id):
    return jsonify(db.get_comunas_by_region(region_id))


# --- Registro de avistamientos ---
def _ctx_avistamiento(datos, errores):
    return {"aves": db.get_aves(), "voluntarios": db.get_voluntarios(),
            "datos": datos, "errores": errores}


@app.route("/avistamientos/nuevo", methods=["GET", "POST"])
def nuevo_avistamiento():
    if request.method == "POST":
        datos = request.form
        archivos = [a for a in request.files.getlist("archivos") if a.filename]
        errores = validate_avistamiento(datos, archivos)

        if not errores:
            guardados = []       
            rutas_fisicas = []    
            try:
                for archivo in archivos:
                    extension = detect_file_type(archivo).extension
                    nombre_original = secure_filename(archivo.filename) or f"archivo.{extension}"
                    nombre_unico = f"{uuid.uuid4().hex}.{extension}"
                    ruta_fisica = os.path.join(app.config["UPLOAD_FOLDER"], nombre_unico)
                    archivo.save(ruta_fisica)
                    rutas_fisicas.append(ruta_fisica)
                    guardados.append((f"uploads/{nombre_unico}", nombre_original[:300]))

                fecha_hora = datetime.strptime(f"{datos['fecha']} {datos['hora'][:5]}",
                                               "%Y-%m-%d %H:%M")
                db.create_avistamiento(
                    int(datos["voluntario_id"]), int(datos["ave_id"]), fecha_hora,
                    datos["lugar"].strip(),
                    datos.get("descripcion", "").strip() or None,
                    guardados)

                flash("¡Avistamiento registrado correctamente!")
                return redirect(url_for("inicio"))
            except (SQLAlchemyError, OSError):
                for ruta in rutas_fisicas:
                    if os.path.exists(ruta):
                        os.remove(ruta)
                errores["general"] = "No se pudo guardar el avistamiento. Intenta nuevamente."

        return render_template("nuevoAvistamientos.html", **_ctx_avistamiento(datos, errores))

    datos = {"voluntario_id": request.args.get("voluntario_id", "")}
    return render_template("nuevoAvistamientos.html", **_ctx_avistamiento(datos, {}))


@app.route("/avistamientos", methods=["GET"])
def listado_avistamientos():
    total = db.count_avistamientos()
    total_paginas = max(1, math.ceil(total / PAGE_SIZE))
    pagina = request.args.get("pagina", 1, type=int)
    pagina = min(max(pagina, 1), total_paginas)  

    avistamientos = db.get_avistamientos_page(PAGE_SIZE, (pagina - 1) * PAGE_SIZE)
    return render_template("avistamientos.html", avistamientos=avistamientos,
                           pagina=pagina, total_paginas=total_paginas)


@app.route("/avistamientos/<int:avistamiento_id>", methods=["GET"])
def detalle_avistamiento(avistamiento_id):
    avistamiento = db.get_avistamiento_by_id(avistamiento_id)
    if avistamiento is None:
        abort(404)
    archivos = db.get_registros_by_avistamiento(avistamiento_id)
    return render_template("detalleAvistamiento.html",
                           avistamiento=avistamiento, archivos=archivos)


@app.route("/api/avistamientos/<int:avistamiento_id>/comentarios", methods=["GET"])
def comentarios_avistamiento(avistamiento_id):
    comentarios = db.get_comentarios_by_avistamiento(avistamiento_id)
    for comentario in comentarios:
        comentario["fecha"] = str(comentario["fecha"])
    return jsonify(comentarios)

@app.route("/api/avistamientos/<int:avistamiento_id>/comentarios", methods=["POST"])
def crear_comentario(avistamiento_id):
    datos = request.get_json()
    if not datos:
        return jsonify({"error": "No se enviaron datos"}), 400

    nombre = datos.get("nombre", "").strip()
    texto = datos.get("texto", "").strip()

    #validacion
    errores = []
    if len(nombre) < 3 or len(nombre) > 50:
        errores.append("El nombre debe tener entre 3 y 50 caracteres.")
    if len(texto) < 5:
        errores.append("El comentario debe tener al menos 5 caracteres.")
    if errores:
        return jsonify({"errores": errores}), 400
    try:
        db.create_comentario(nombre, texto, avistamiento_id)
        return jsonify({"mensaje": "Comentario agregado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": "Error interno del servidor"}), 500

# --- Estadísticas ---
@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/api/estadisticas/avistamientos-por-dia", methods=["GET"])
def api_avistamientos_por_dia():
    filas = db.get_avistamientos_por_dia()
    return jsonify([{"fecha": f["dia"].isoformat(), "total": f["cantidad_avistamientos"]} for f in filas])

@app.route("/api/estadisticas/avistamientos-por-ave", methods=["GET"])
def api_avistamientos_por_ave():
    filas = db.get_avistamientos_por_ave()
    return jsonify([{"ave": f["nombre_ave"], "total": f["cantidad_avistamientos"]} for f in filas])


@app.route("/api/estadisticas/voluntarios-por-comuna", methods=["GET"])
def api_voluntarios_por_comuna():
    filas = db.get_voluntarios_por_comuna()
    return jsonify([{"comuna": f["nombre_comuna"], "total": f["cantidad_voluntarios"]} for f in filas])

if __name__ == "__main__":
    app.run(debug=True)