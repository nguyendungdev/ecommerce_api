#!/bin/bash -x
npm install

docker-compose up -d    

cd ./db/

# Variables
DB_CONTAINER_NAME="ecommerce_api-postgres-1"    
DB_USER="yuki"                 
DB_NAME="ecommerce"            
SQL_FILE="001-init-db.sql"      
SQL_CREATEINDEX="002-create-index.sql"
SQL_INSERT_DATA="003-insert-sample-data.sql"

sleep 20
docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS ecommerce"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -c "CREATE DATABASE ecommerce"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SQL_FILE"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SQL_CREATEINDEX"

cd ..

npm run seed:run