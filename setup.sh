#!/bin/bash -x
npm install

docker-compose --env-file ./config/development.env up -d

# Variables
ENV_FILE="./config/development.env"
DB_CONTAINER_NAME="db"    
DB_USER="postgres"                 
DB_NAME="ecommerce"            
SQL_FILE="./db/001-init-db.sql"      
SQL_CREATEINDEX="./db/002-create-index.sql"

sleep 10
docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS ecommerce"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -c "CREATE DATABASE ecommerce"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SQL_FILE"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SQL_CREATEINDEX"

npm run seed:run