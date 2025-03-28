#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/mlm-backend/deploy.log

# Charger les variables d'environnement et le PATH
source /home/ec2-user/.bashrc
export PATH=$PATH:/home/ec2-user/.local/share/pnpm

echo 'cd /home/ec2-user/mlm-backend' >> /home/ec2-user/mlm-backend/deploy.log
cd /home/ec2-user/mlm-backend >> /home/ec2-user/mlm-backend/deploy.log

echo 'pnpm install' >> /home/ec2-user/mlm-backend/deploy.log 
pnpm install >> /home/ec2-user/mlm-backend/deploy.log

echo 'openssl genrsa -out ./private-key.pem 4096' >> /home/ec2-user/mlm-backend/deploy.log
openssl genrsa -out ./private-key.pem 4096 >> /home/ec2-user/mlm-backend/deploy.log

echo 'openssl rsa -in private-key.pem -pubout -outform PEM -out public-key.pem' >> /home/ec2-user/mlm-backend/deploy.log
openssl rsa -in private-key.pem -pubout -outform PEM -out public-key.pem >> /home/ec2-user/mlm-backend/deploy.log