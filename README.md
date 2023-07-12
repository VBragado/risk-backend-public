# RISK 115 E3 WEB BACKEND

## Enlace al backend en render: 
- https://gamerisk115-api.onrender.com

## Instrucciones para la base de datos:

- ``CREATE USER g115 WITH PASSWORD '123456789'``;
- ``CREATE DATABASE devdbe2``;
- ``GRANT ALL PRIVILEGES ON DATABASE devdbe2 TO g115``;

- ``psql -U g115 -d devdbe2``

## Para hacer rollback migrations:
- `npx sequelize-cli db:migrate:undo:all`
- `npx sequelize-cli db:migrate`

## Seeders:
- Para correr el juego, se necesitan instancias de "Regions" y "Borders"
- `npx sequelize-cli db:seed:all`

## Para correr programa:

- Primero seguir instrucciones de base de datos
- `npm install`
- `npm start`

## Consideraciones para jugar juego:
- El juego consiste en un juego 1v1 entre dos usuarios de la plataforma (no hay simulacion, para jugar partida completa debes jugar por ambos lados)
- Para que un jugador pueda jugar, este debe haber iniciado sesión
- Las jugadas que realiza un jugador se ven automaticamente renderizadas en el front del usuario que las realizó. Este no es el caso para las jugadas de un oponente.

## Modelo de relaciones:

1. Users: Quienes participan en los juegos. 

- id (primary key) 

- username 

- mail

- password 

2. Games: Partidas del juego. 

- id (primary key) 

- name 

- status: estado de la partida; in-progress o completed.

- player1

- player2

- current_turn: numero del turno actual. 

3. Players Usuarios que juegan en una partida. 

- id (primary key) 

- game_id (foreign key referenciando Games) 

- user_id (foreign key referenciando Users) 

- username

- color: asignado a un jugador para diferenciarlos. 

- status: estado del jugador en la partida; active, lost o winner. 

- number_of_territories: número de territorios que controla. 

- iron (Cantidad de hierro que posee el jugador) 

- wheat (Cantidad de trigo que posee el jugador) 

- oil (Cantidad de petróleo que posee el jugador) 

4. Territories: Territorios del tablero de juego. 

- id (primary key) 

- name 

- game_id (foreign key de Games) 

- current_owner_id (foreign key de Players): jugador que actualmente controla el territorio. 

- troops: número de tropas; fuerza del territorio para atacar o defenderse.  

- resource: recurso que recibe el jugador que controla este territorio. 

5. Regions: instancias fijas de territorios 

- name

- resource

- resourceamount

6. Borders: Territorios que comparten una frontera (se pueden atacar). 

- id (primary key) 

- territory1_name 

- neighboring2_name 


## Referencias:

Lógica de generación de mapa:
- https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
- https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

Modelos:
- chatgpt como herramienta

Sesiones/auth:
- codigo de ejemplo ayudantes. (capsula 8)

Otros:
- codigo de ejemplo ayudantes. (capsula 7)