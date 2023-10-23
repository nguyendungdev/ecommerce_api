#!/bin/bash -x
cd ./db/

docker-compose up -d

# Variables
DB_CONTAINER_NAME="db-db-1"    
DB_USER="yuki"                 
DB_NAME="ecommerce"            
SQL_FILE="001-init-db.sql"      
SQL_CREATEINDEX="002-create-index.sql"

sleep 10
#create database and table
docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SQL_FILE"

docker exec -i "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$SQL_CREATEINDEX"

docker exec -it "$DB_CONTAINER_NAME" psql -U "$DB_USER" -l

docker exec -it "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "\dt"

cd ..

docker-compose up -d    