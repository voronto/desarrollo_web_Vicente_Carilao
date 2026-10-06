import re
from datetime import datetime, timedelta

import filetype

from database import db

EXTENSIONES_PERMITIDAS = {"jpg", "png", "gif", "webp", "mp4", "webm"}
MAX_ARCHIVOS = 5


def es_entero(valor):
    return bool(valor) and re.fullmatch(r"[0-9]{1,10}", valor) is not None


def validate_nombre(nombre):
    nombre = (nombre or "").strip()
    return 4 < len(nombre) <= 255


def validate_email(email):
    email = (email or "").strip()
    return len(email) <= 80 and re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email) is not None


def validate_telefono(telefono):
    telefono = (telefono or "").strip()
    return re.fullmatch(r"\+?[0-9]{8,14}", telefono) is not None


def validate_lugar(lugar):
    lugar = (lugar or "").strip()
    return 2 < len(lugar) <= 200


def validate_fecha_hora(fecha, hora):
    
    if not fecha or not hora:
        return False, "Debes ingresar una fecha y hora adecuadas."
    try:
        fecha_hora = datetime.strptime(f"{fecha} {hora[:5]}", "%Y-%m-%d %H:%M")
    except ValueError:
        return False, "Fecha u hora inválida."
    ahora = datetime.now()
    if fecha_hora > ahora:
        return False, "La fecha no puede ser futura."
    if fecha_hora < ahora - timedelta(days=730):
        return False, "La fecha es demasiado antigua (máximo 2 años)."
    return True, ""



def detect_file_type(archivo):
    cabecera = archivo.stream.read(2048)
    archivo.stream.seek(0)
    return filetype.guess(cabecera)


def validate_archivos(archivos):
    if not archivos:
        return "Debes subir al menos una foto o video."
    if len(archivos) > MAX_ARCHIVOS:
        return f"Puedes subir como máximo {MAX_ARCHIVOS} archivos."
    for archivo in archivos:
        tipo = detect_file_type(archivo)
        if tipo is None or tipo.extension not in EXTENSIONES_PERMITIDAS:
            return "Solo se permiten imágenes (jpg, png, gif, webp) o videos (mp4, webm)."
    return None

def validate_voluntario(form):
    errores = {}

    if not validate_nombre(form.get("nombre")):
        errores["nombre"] = "Nombre inválido (entre 5 y 255 caracteres)."
    if not validate_email(form.get("email")):
        errores["email"] = "Email inválido."
    if not validate_telefono(form.get("telefono")):
        errores["telefono"] = "Teléfono inválido (8 a 14 dígitos, puede partir con +)."

    comuna = form.get("comuna")
    if not comuna or str(comuna).strip() == "":
        errores["comuna"] = "Debes seleccionar una comuna válida."

    return errores


def validate_avistamiento(form, archivos):
    errores = {}

    voluntario_id = form.get("voluntario_id")
    if not es_entero(voluntario_id) or db.get_voluntario_by_id(int(voluntario_id)) is None:
        errores["voluntario_id"] = "Debes seleccionar un voluntario válido."

    ave_id = form.get("ave_id")
    if not es_entero(ave_id) or db.get_ave_by_id(int(ave_id)) is None:
        errores["ave_id"] = "Debes seleccionar un ave válida."

    if not validate_lugar(form.get("lugar")):
        errores["lugar"] = "Ingresa un lugar válido (entre 3 y 200 caracteres)."

    ok, mensaje = validate_fecha_hora(form.get("fecha"), form.get("hora"))
    if not ok:
        errores["fecha"] = mensaje

    if len((form.get("descripcion") or "").strip()) > 500:
        errores["descripcion"] = "La descripción no puede superar los 500 caracteres."

    error_archivos = validate_archivos(archivos)
    if error_archivos:
        errores["archivos"] = error_archivos

    return errores