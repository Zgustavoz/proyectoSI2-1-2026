#!/usr/bin/env bash
set -o errexit

echo "Instalando dependencias..."
pip install -r requirements.txt

echo "Recolectando archivos estáticos..."
python manage.py collectstatic --no-input

echo "Aplicando migraciones..."
python manage.py migrate

echo "Build completado!"
```

---

**`Backend/Procfile`**
```
web: gunicorn TU_CARPETA_CONFIG.wsgi:application --bind 0.0.0.0:$PORT