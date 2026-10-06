import json
import os

from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8mb4"

_QUERYS_PATH = os.path.join(os.path.dirname(__file__), "querys.json")
with open(_QUERYS_PATH, "r", encoding="utf-8") as querys:
    QUERY_DICT = json.load(querys)


engine = create_engine(
    URL.create(
        "mysql+pymysql",
        username=DB_USERNAME,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        query={"charset": DB_CHARSET},
    ),
    pool_pre_ping=True,
)



def _all(nombre_query, params=None):
    """Ejecuta un SELECT y devuelve una lista de diccionarios."""
    with engine.connect() as conn:
        result = conn.execute(text(QUERY_DICT[nombre_query]), params or {})
        return [dict(row) for row in result.mappings().all()]


def _one(nombre_query, params=None):
    """Ejecuta un SELECT y devuelve un diccionario (o None si no hay filas)."""
    with engine.connect() as conn:
        result = conn.execute(text(QUERY_DICT[nombre_query]), params or {})
        row = result.mappings().first()
        return dict(row) if row else None



def get_regiones():
    return _all("get_regiones")


def get_comunas_by_region(region_id):
    return _all("get_comunas_by_region", {"region_id": region_id})


def comuna_pertenece_a_region(comuna_id, region_id):
    return _one("comuna_pertenece_a_region",
                {"comuna_id": comuna_id, "region_id": region_id}) is not None


def get_aves():
    return _all("get_aves")


def get_ave_by_id(ave_id):
    return _one("get_ave_by_id", {"ave_id": ave_id})

def get_todas_las_comunas():
    return _all("get_todas_las_comunas")


def get_voluntarios():
    return _all("get_voluntarios")


def get_voluntario_by_id(voluntario_id):
    return _one("get_voluntario_by_id", {"voluntario_id": voluntario_id})


def create_voluntario(nombre, email, telefono, comuna_id):
    with engine.begin() as conn:
        result = conn.execute(
            text(QUERY_DICT["create_voluntario"]),
            {"nombre": nombre, "email": email,
             "telefono": telefono, "comuna_id": comuna_id},
        )
        return result.lastrowid



def create_avistamiento(voluntario_id, ave_id, fecha_hora, lugar, descripcion, archivos):
    """
    Inserta el avistamiento y todos sus registros (fotos/videos) en UNA transacción:
    si falla cualquier insert, no queda nada guardado.
    archivos: lista de tuplas (ruta_archivo, nombre_archivo)
    """
    with engine.begin() as conn:
        result = conn.execute(
            text(QUERY_DICT["create_avistamiento"]),
            {"voluntario_id": voluntario_id, "ave_id": ave_id,
             "fecha_hora": fecha_hora, "lugar": lugar, "descripcion": descripcion},
        )
        avistamiento_id = result.lastrowid
        for ruta_archivo, nombre_archivo in archivos:
            conn.execute(
                text(QUERY_DICT["create_registro"]),
                {"ruta_archivo": ruta_archivo, "nombre_archivo": nombre_archivo,
                 "avistamiento_id": avistamiento_id},
            )
        return avistamiento_id


def get_ultimos_avistamientos(limite):
    return _all("get_ultimos_avistamientos", {"limite": limite})


def get_avistamientos_page(limite, desplazamiento):
    return _all("get_avistamientos_page",
                {"limite": limite, "desplazamiento": desplazamiento})


def count_avistamientos():
    with engine.connect() as conn:
        return conn.execute(text(QUERY_DICT["count_avistamientos"])).scalar()


def get_avistamiento_by_id(avistamiento_id):
    return _one("get_avistamiento_by_id", {"avistamiento_id": avistamiento_id})


def get_registros_by_avistamiento(avistamiento_id):
    return _all("get_registros_by_avistamiento", {"avistamiento_id": avistamiento_id})