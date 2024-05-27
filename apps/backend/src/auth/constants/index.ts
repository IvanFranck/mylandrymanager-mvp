import * as fs from 'fs';
const PUBLIC_KEY = fs.readFileSync('public-key.pem', 'utf8');
const PRIVATE_KEY = fs.readFileSync('private-key.pem', 'utf8');

export const JWT_CONSTANT = {
  PUBLIC_KEY,
  PRIVATE_KEY,
};

export const ACCESS_TOKEN_COOKIE_NAME = 'Authentication';

export const ACCESS_TOKEN_STRATEGY_NAME = 'jwt';
