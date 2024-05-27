# Introduction

Cette application est un MVP d'un Sass dédié à la gestion des services de blanchisserie et de pressing (Nettoyage de vêtements).

# Pour commencer

## 1: Configuration

La configuration du serveur peut être fournie via l'utilisation de variables d'environnement. Celles-ci peuvent être transmises à l'application par le biais du fichier `apps/back/.env` situé dans le répertoire `apps/back`. Vous trouverez un exemple de dans le fichier `apps/back/.env.example` Ci-dessous, vous trouverez un tableau qui montre les différentes variables qui peuvent être transmises.

| Variable             | Description                                             | Valeur                                                              |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| DATABASE_URL         | l'url de connection à la base de donnée                 | [db-provider]://[username]:[password]@localhost:[db-port]/[db-name] |
| PORT                 | le port sur lequel tourne le serve                      | 3000                                                                |
| DB_PORT              | le numéro de port utilisé par la BD                     | [db-port]                                                           |
| DB_USER              | le nom d'utilisateur utilisé pour se connecter à la BD  | [username]                                                          |
| DB_PASSWORD          | Le mot de passe utilisé pour se connecter à la BD       | [password]                                                          |
| DB_NAME              | Le nom de BD                                            | [service-name] / [project-name]                                     |

