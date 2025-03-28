#!/bin/bash

set -e

echo "Waiting for postgres..."

while ! nc -z database 5432; do
  sleep 1
done

echo "PostgreSQL started"

# Générez d'abord les clients Prisma
npx prisma generate

# Ensuite, appliquez les migrations
npx prisma migrate deploy

echo "Prisma migrations deployed"

exec "$@" 