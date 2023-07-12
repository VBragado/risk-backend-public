## Documentación de los Endpoints

## Login
POST url/login
- Body
{
    mail: vb@uc.cl,
    password: abc123
}

- Reponse
{
    "access_token": absb112222b12,
    "token_type": "Bearer",
    "expires_in": 100000,
    "username": VB,
    "userId": 1,
    }


## Signup
POST url/signup
- Body
{
    mail: vb@uc.cl,
    username: VB,
    password: abc123
}

- Response
{
        username: VB,
        email: vb@uc.cl
    }

## Join Game (1v1)
POST url/joingame
- Body
{
    username: VB
}

- Response
{
    status: "joined", 
    gameId: 1, 
    gameType: "1v1"
}

## Join Game (1v1v1)
POST url/joingamethree
- Body
{
    username: VB
}

- Response
{
    status: "joined", 
    gameId: 2, 
    gameType: "three"
}

## Actualizar left infobar 
GET url/leftinfobar?username=${username}

- Response
{
      status: "pregame",
      color: "red",
      turnSoldiers: 5,
      myTerritories: [],
      enemyTerritories: [],
      allTerritories: ['NorthAmerica', 'CentralAmerica' 'SouthAmerica'],
    }

## Actualizar right infobar 
GET url/rightinfobar?username=${username}

- Response
{
      gameType: "three",
      username1: "VB",
      color1: "red",
      iron1: 5,
      wheat1: 1,
      oil1: 8,

      username2: "Manuel",
      color2: "black",
      iron2: 10,
      wheat2: 12,
      oil2: 6,

      username3: "Camila",
      color3: "blue",
      iron3: 6,
      wheat3: 7,
      oil3: 8,
    }

## Actualizar tablero 
GET url/udpateboard?username=${username}

- Response
{
            flags: ['redFlag', 'blueFlag', 'blueFlag'],
          soldiers: [3, 3, 5],
        }

## Seleccionar Territorio en pregame 
POST url/selectterritory
- Body
{
        username: "VB",
        userId: 1,
        territory: "SouthAmerica"
      }

- Response
{
      gameType: "1v1",
      username1: "VB",
      color1: "red",
      iron1: 5,
      wheat1: 1,
      oil1: 8,

      username2: "Manuel",
      color2: "black",
      iron2: 10,
      wheat2: 12,
      oil2: 6,

      username3: "Camila",
      color3: "blue",
      iron3: 6,
      wheat3: 7,
      oil3: 8,
    }

## Actualizar informacion de jugador (parecido a leftinfobar) 
GET url/playerinfo?username=${username}

- Response
{
      status: "inTurn",
      turnSoldiers: 3,
      myTerritories: ["SouthAmerica"],
      enemyTerritories: ["NorthAmerica", "CentralAmerica"],
    }

## Agregar soldado a territorio
POST url/addsoldier
- Body
{
        username: "VB",
        userId: 1,
        territory: ["SouthAmerica"]
      }

- Response
{
    result: "successful"
}

## Atacar territorio rival
POST url/attack
- Body
{
        username: "VB",
        userId: 1,
        myTerritory: "SouthAmerica",
        enemyTerritory: "CentralAmerica"
      }

- Response
{
    result: "successful"
}


