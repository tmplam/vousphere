#!/bin/sh

# Ensure the script exits on any error
set -e

# Define the container names and database names
declare -A containers
containers=(
    ["eventdb"]="EventDb"
    ["gamedb"]="GameDb"
)

# Loop through each container and seed the database
for container in "${!containers[@]}"; do
    database=${containers[$container]}
    echo "Seeding Quartz tables in $database..."

    # Copy the SQL file into the container
    docker cp ./quartz_tables_postgres.sql $container:/quartz_tables_postgres.sql

    # Execute the psql command using docker exec
    docker exec -it $container psql -U postgres -d $database -f /quartz_tables_postgres.sql

    # Optionally, remove the SQL file from the container after execution
    docker exec -it $container rm /quartz_tables_postgres.sql
done