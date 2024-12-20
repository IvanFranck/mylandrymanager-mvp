#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/mlm-backend/deploy.log
echo 'docker-compose up -d' >> /home/ec2-user/mlm-backend/deploy.log
docker-compose up -d

echo 'npx prisma migrate deploy' >> /home/ec2-user/mlm-backend/deploy.log
npx prisma migrate deploy

echo 'npx prisma generate' >> /home/ec2-user/mlm-backend/deploy.log
npx prisma generate

echo 'npm run start:dev' >> /home/ec2-user/mlm-backend/deploy.log
npm run start:dev