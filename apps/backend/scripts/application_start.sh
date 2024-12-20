#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/mlm-backend/deploy.log
echo 'docker-compose up -d' >> /home/ec2-user/mlm-backend/deploy.log
docker-compose up -d

echo 'pnpm start:dev' >> /home/ec2-user/mlm-backend/deploy.log
pnpm start:dev