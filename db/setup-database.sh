#!/bin/bash -x
docker-compose up

sleep 10


docker exec -i db-db-1 psql -U yuki -d postgres < 001-init-db.sql


docker exec -it db-db-1  psql -U yuki -d postgres -c "\l"
