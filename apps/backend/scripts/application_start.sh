Copy#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/mlm-backend/deploy.log

# Charger les variables d'environnement et le PATH
source /home/ec2-user/.bashrc
export PATH=$PATH:/home/ec2-user/.local/share/pnpm

cd /home/ec2-user/mlm-backend

echo 'docker-compose up -d' >> /home/ec2-user/mlm-backend/deploy.log
docker-compose up -d

echo 'pnpm prisma migrate deploy' >> /home/ec2-user/mlm-backend/deploy.log
pnpm dlx prisma migrate deploy

echo 'pnpm prisma generate' >> /home/ec2-user/mlm-backend/deploy.log
pnpm dlx prisma generate

echo 'pnpm run start:dev' >> /home/ec2-user/mlm-backend/deploy.log
pnpm start:dev