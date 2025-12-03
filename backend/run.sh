#!/bin/bash

COMMAND=$1

echo "Gestor de entorno Docker para el proyecto Cats Backend"

case "$COMMAND" in
  up)
    echo "Construyendo y levantando contenedores..."
    docker compose up --build -d
    echo "Contenedores levantados correctamente."
    ;;

  down)
    echo "Deteniendo contenedores..."
    docker compose down
    echo "Contenedores detenidos."
    ;;

  restart)
    echo "Reiniciando entorno Docker..."
    docker compose down
    docker compose up --build -d
    echo "Entorno reiniciado."
    ;;

  logs)
    echo "Mostrando logs del backend..."
    docker compose logs -f backend
    ;;

  clean)
    echo "Eliminando contenedores, volúmenes e imágenes huérfanas..."
    docker compose down -v
    docker system prune -f
    echo "Limpieza completada."
    ;;

  *)
    echo "Comando no reconocido."
    echo "Uso: ./run.sh {up|down|restart|logs|clean}"
    exit 1
    ;;
esac
