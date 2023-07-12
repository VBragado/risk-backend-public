const sequelize = require('sequelize');
const { Op } = require('sequelize');
const db = require('../models');
const { Region } = require('../models');
const {
  Game, Player, Territory,
  Border, User, Turn} = db;

const red_flag = "redFlag";

const black_flag = "blackFlag";

const blue_flag = 'blueFlag';


const { 
  territories, resources,
  initialIron, initialOil,
  initialWheat } = require('../parameters/params');

// POST /game/join
const joinGame = async (ctx) => {
    const data = ctx.request.body;
  
    // Busca el juego
    let gameToJoin = await Game.findOne({
      where: { status: "pending",
                  name: "1v1" }
    });

    let color = "black";
  
    if (!gameToJoin) {
         gameToJoin = await Game.create({
            name: "1v1",
            status: 'pending',
            player1: data.username,
            current_turn: '1',
          });
        color = "red";
    } else {
        // Update the attribute value
    gameToJoin.player2 = data.username,
    gameToJoin.status = 'playing';
    // Save the changes
    await gameToJoin.save();
    }
  
    //crea el jugador
    await addPlayerToGame(data.username, color, gameToJoin.id);
    console.log("passed addPlayerToGame");
    console.log(color);
    ctx.body = JSON.stringify({status: "joined", gameId: gameToJoin.id, gameType: gameToJoin.name});
  };

  // POST /game/join
const joinGameThree = async (ctx) => {
  const data = ctx.request.body;

  // Busca el juego
  let gameToJoin = await Game.findOne({
    where: { status: "pending",
              name: "three"}
  });

  let color = "black";

  if (!gameToJoin) {
       gameToJoin = await Game.create({
          name: "three",
          status: 'pending',
          player1: data.username,
          current_turn: '1',
        });
      color = "red";
  } else {
  
    if (gameToJoin.player2 === null) {
      // Update the attribute value
  gameToJoin.player2 = data.username,
  gameToJoin.status = 'pending';
  // Save the changes
  await gameToJoin.save();
    } else {
      gameToJoin.player3 = data.username,
      gameToJoin.status = 'playing';
      color = "blue";
      // Save the changes
      await gameToJoin.save();
    }
  }

  //crea el jugador
  await addPlayerToGame(data.username, color, gameToJoin.id);
  console.log("passed addPlayerToGame");
  console.log(color);
  ctx.body = JSON.stringify({status: "joined", gameId: gameToJoin.id, gameType: gameToJoin.name});
};


  const addPlayerToGame = async (username, playerColor, newGameId) => {
    const playerUser = await User.findOne({
      where: { username: username, },
    });
    
    if (playerUser) {
    await Player.create({
      color: playerColor,
      status: 'pregame',
      turnSoldiers: 5,
      number_of_territories: 0,
      iron: initialIron,
      wheat: initialWheat,
      oil: initialOil,
      gameId: newGameId,
      userId: playerUser.id,
      username: username
    });
    console.log("created player instance");
}
  };


  // GET /leftinfobar
  const getLeftInfobar = async (ctx) => {
    const { username } = ctx.request.query;
  
    console.log("getting LeftInfobar info");
    console.log(username);
  
    let enemyTerritories = [];
    let myTerritories = [];
    // let allTerritories = [];

    const allTerritoriesData = await Region.findAll();
    console.log("All Territories data: ");

    const allTerritories = allTerritoriesData.map((territory) => territory.name);

    console.log("All Territories: ", allTerritories);
    // Busca el juego
    let currentGame = await Game.findOne({
      where: {
        status: 'playing',
        [Op.or]: [
          { player1: username },
          { player2: username },
          { player3: username },
        ],
      },
    });
  
    console.log(currentGame);
    if (!currentGame) {
      currentGame = await Game.findOne({
        where: {
          status: 'pending',
          [Op.or]: [
            { player1: username },
            { player2: username },
            { player3: username },
          ],
        },
      });
      if (currentGame) {
        console.log("Found game");
      }
    }
  
    console.log(currentGame.id);
    // Busca el juego
    const playerData = await Player.findOne({
      where: {
        gameId: currentGame.id,
        username: username,
      },
    });
  
    ctx.status = 200;
    ctx.body = {
      status: playerData.status,
      color: playerData.color,
      turnSoldiers: playerData.turnSoldiers,
      myTerritories: myTerritories,
      enemyTerritories: enemyTerritories,
      allTerritories: allTerritories,
    };
  };

  // GET /rightinfobar
  const getRightInfobar = async (ctx) => {
    const { username } = ctx.request.query;
  
    console.log("getting RightInfobar info");
    console.log(username);
  
    // Busca el juego
    let currentGame = await Game.findOne({
      where: {
        status: 'playing',
        [Op.or]: [
          { player1: username },
          { player2: username },
          { player3: username },

        ],
      },
    });
  
    console.log(currentGame);
    if (!currentGame) {
      currentGame = await Game.findOne({
        where: {
          status: 'pending',
          [Op.or]: [
            { player1: username },
            { player2: username },
            { player3: username },

          ],
        },
      });
      if (currentGame) {
        console.log("Found game");
      }
    }
  
    console.log(currentGame.id);
    // Busca el juego
    const player1Data = await Player.findOne({
      where: {
        gameId: currentGame.id,
        username: currentGame.player1,
      },
    });

    let username2 = 'waiting';
    let color2 = 'waiting';
    let iron2 = 0;
    let wheat2 = 0;
    let oil2 = 0;


    const player2Data = await Player.findOne({
        where: {
          gameId: currentGame.id,
          username: currentGame.player2,
        },
      });

    if (player2Data) {
        username2 = player2Data.username;
        color2 = player2Data.color;
        iron2 = player2Data.iron;
        wheat2 = player2Data.wheat;
        oil2 = player2Data.oil;
    }

    let username3 = 'waiting';
    let color3 = 'waiting';
    let iron3 = 0;
    let wheat3 = 0;
    let oil3 = 0;


    const player3Data = await Player.findOne({
        where: {
          gameId: currentGame.id,
          username: currentGame.player3,
        },
      });

    if (player3Data) {
        username3 = player3Data.username;
        color3 = player3Data.color;
        iron3 = player3Data.iron;
        wheat3 = player3Data.wheat;
        oil3 = player3Data.oil;
    }
  
    ctx.status = 200;
    ctx.body = {
      gameType: currentGame.name,
      username1: player1Data.username,
      color1: player1Data.color,
      iron1: player1Data.iron,
      wheat1: player1Data.wheat,
      oil1: player1Data.oil,

      username2: username2,
      color2: color2,
      iron2: iron2,
      wheat2: wheat2,
      oil2: oil2,

      username3: username3,
      color3: color3,
      iron3: iron3,
      wheat3: wheat3,
      oil3: oil3,
    };
  };

// POST /selectTerritory, para pregame
const selectTerritory = async (ctx) => {
    const data = ctx.request.body;

    let result = 'failed';
    let gameStart = 'false';


    const username = data.username;

    const userID = data.userId; //CAMBIAR 

    const territorioElejido = data.territory;

    console.log("EN SELECTTERRITORY");
    console.log(territorioElejido);
    console.log(username);
    console.log(userID);

    // Busca el juego
    let currentGame = await Game.findOne({
        where: {
          status: 'playing',
          [Op.or]: [
            { player1: username },
            { player2: username },
            { player3: username },
          ],
        },
      });

      console.log("CurrentgameID: " + currentGame.id);

    if (territorioElejido != 'none') {
        // buscamos en Territory si ya se eligió para ese juego
        const alreadyTaken = await Territory.findOne({
            where: {
              gameId: currentGame.id,
              name: territorioElejido
            },
          });
        if (!alreadyTaken) {
            console.log("territorio liibre");
            const instanced = await instanciarTerritorio(userID, currentGame, territorioElejido);
            if (instanced) {
            gameStart = checkIfReadyToStart(currentGame);
            ctx.body = JSON.stringify({result: "successful", gameStart: gameStart});
            console.log("successful");
            return;
            }
        }
    }
    gameStart = checkIfReadyToStart(currentGame);
    ctx.body = JSON.stringify({result: result, gameStart: gameStart});
    return;
  };

  const instanciarTerritorio = async (userID, currentGame, territoryName) => {
    const gameID = currentGame.id;
    const gameType = currentGame.name;
    let result = false;
    const territoryData = await Region.findOne({
      where: { name: territoryName, },
    });

    const player = await Player.findOne({
        where: { userId: userID, 
              gameId: gameID}, //
      });

    let limit = 4;
    if (gameType === 'three') {
      limit = 3;
    }

    if (player.number_of_territories < limit) {
        console.log(territoryName);
        console.log(3);
        console.log(territoryData.resource);
        console.log(gameID);
        try {
            createdInstance = await Territory.create({
                name: territoryName,
                troops: 3,
                resource: territoryData.resource,
                currentOwner: player.id,
                gameId: gameID,
              });

              if (createdInstance) {
                
              if (territoryData.resource === 'wheat') {
                player.wheat = player.wheat+territoryData.resourceamount;
            } else if (territoryData.resource === 'iron') {
                player.iron = player.iron+territoryData.resourceamount;
            } else {
                player.oil = player.oil+territoryData.resourceamount;
            }
        
            player.number_of_territories = player.number_of_territories+1;}
            await player.save();

          } catch (error) {
            console.error('Error DEBUG:', error.message);
          }


    
    
    
    result = true;
    }
    return result;
   
  };

  const checkIfReadyToStart = async (gameInstance) => {
    let result = "false";

    const gameID = gameInstance.id;
    const player1Username = gameInstance.player1; 
    const player2Username = gameInstance.player2; 
    const player3Username = gameInstance.player3;    
   
   
    const player1 = await Player.findOne({
      where: { username: player1Username, 
               gameId: gameID},
    });

    const player2 = await Player.findOne({
        where: { username: player2Username, 
                 gameId: gameID},
      });

      const player3 = await Player.findOne({
        where: { username: player3Username, 
                 gameId: gameID},
      });

      let p3dummy = 0;
      if (gameInstance.name === 'three') {
        p3dummy = player3.number_of_territories;
      }

      let testvars = player1.number_of_territories + player2.number_of_territories + p3dummy;

      console.log("DEBUG READYTOSTART SUM: ", testvars);
    if (player1.number_of_territories + player2.number_of_territories + p3dummy === 8) {
        player1.status = "inTurn";
        await player1.save();
        player2.status = "wait";
        await player2.save();
        if (gameInstance.name === 'three') {
          player3.status = "wait";
          await player3.save();
        }
        result = "true";
    }
    return result;
   
  };

    // GET /updateboard
    const updateBoard = async (ctx) => {
        const { username } = ctx.request.query;
        console.log("UPDATING BOARD"); // debug
        // Busca el juego
        let currentGame = await Game.findOne({
          where: {
            status: 'playing',
            [Op.or]: [
              { player1: username },
              { player2: username },
              { player3: username },
            ],
          },
        });
        console.log("UBGAMEID", currentGame.id); // debug
        const player1Username = currentGame.player1;
        const player1 = await Player.findOne({
            where: { username: player1Username, 
                     gameId: currentGame.id},
          });
          
        const player2Username = currentGame.player2;
        const player2 = await Player.findOne({
            where: { username: player2Username, 
                     gameId: currentGame.id},
          });


        // definimos flags y values para cada region/terr
        ///////////////////////////////////// 
        let northAmericaFlag = 'none';
        let northAmericaValue = null;
        // buscamos northAmerica
        let northAmerica = await Territory.findOne({
            where: {
              name: 'NorthAmerica',
              gameId: currentGame.id
            },
          });
        if (northAmerica) {
            if (northAmerica.currentOwner === player1.id) {
                northAmericaFlag = red_flag;
                northAmericaValue = northAmerica.troops;
            } else if (northAmerica.currentOwner === player2.id) {
                northAmericaFlag = black_flag;
                northAmericaValue = northAmerica.troops;
            } else {
              northAmericaFlag = blue_flag;
                northAmericaValue = northAmerica.troops;
            }
        }
        ///////////////////////////////////// 
        // repetir codigo de arriba para cada territorio

        ///////////////////////////////////// 
        let centralAmericaFlag = 'none';
        let centralAmericaValue = null;
        // buscamos centralamerica
        let centralAmerica = await Territory.findOne({
            where: {
              name: 'CentralAmerica',
              gameId: currentGame.id
            },
          });
        if (centralAmerica) {
            if (centralAmerica.currentOwner === player1.id) {
                centralAmericaFlag = red_flag;
                centralAmericaValue = centralAmerica.troops;
            } else if (centralAmerica.currentOwner === player2.id) {
              centralAmericaFlag = black_flag;
              centralAmericaValue = centralAmerica.troops;
          } else {
            centralAmericaFlag = blue_flag;
            centralAmericaValue = centralAmerica.troops;
          }
        }
        ///////////////////////////////////// 

        ///////////////////////////////////// 
        let southAmericaFlag = 'none';
        let southAmericaValue = null;
        // buscamos souuthamerica
        let southAmerica = await Territory.findOne({
            where: {
              name: 'SouthAmerica',
              gameId: currentGame.id
            },
          });
        if (southAmerica) {
            if (southAmerica.currentOwner === player1.id) {
                southAmericaFlag = red_flag;
                southAmericaValue = southAmerica.troops;
            } else if (southAmerica.currentOwner === player2.id) {
              southAmericaFlag = black_flag;
              southAmericaValue = southAmerica.troops;
          } else {
            southAmericaFlag = blue_flag;
            southAmericaValue = southAmerica.troops;
          }
        }
        ///////////////////////////////////// 

        ///////////////////////////////////// 
        let europeFlag = 'none';
        let europeValue = null;
        // buscamos europe
        let europe = await Territory.findOne({
            where: {
              name: 'Europe',
              gameId: currentGame.id
            },
          });
        if (europe) {
            if (europe.currentOwner === player1.id) {
                europeFlag = red_flag;
                europeValue = europe.troops;
            } else if (europe.currentOwner === player2.id) {
              europeFlag = black_flag;
              europeValue = europe.troops;
          } else {
            europeFlag = blue_flag;
            europeValue = europe.troops;
          }
        }
        ///////////////////////////////////// 

        ///////////////////////////////////// 
        let africaFlag = 'none';
        let africaValue = null;
        // buscamos africa
        let africa = await Territory.findOne({
            where: {
              name: 'Africa',
              gameId: currentGame.id
            },
          });
        if (africa) {
            if (africa.currentOwner === player1.id) {
                africaFlag = red_flag;
                africaValue = africa.troops;
            } else if (africa.currentOwner === player2.id) {
              africaFlag = black_flag;
              africaValue = africa.troops;
          } else {
            africaFlag = blue_flag;
            africaValue = africa.troops;
          }
        }
        ///////////////////////////////////// 

        ///////////////////////////////////// 
        let rusiaFlag = 'none';
        let rusiaValue = null;
        // buscamos rusia
        let rusia = await Territory.findOne({
            where: {
              name: 'Russia',
              gameId: currentGame.id
            },
          });
        if (rusia) {
            if (rusia.currentOwner === player1.id) {
                rusiaFlag = red_flag;
                rusiaValue = rusia.troops;
            } else if (rusia.currentOwner === player2.id) {
              rusiaFlag = black_flag;
              rusiaValue = rusia.troops;
          } else {
            rusiaFlag = blue_flag;
            rusiaValue = rusia.troops;
          }
        }
        /////////////////////////////////////

        ///////////////////////////////////// 
        let asiaFlag = 'none';
        let asiaValue = null;
        // buscamos asia
        let asia = await Territory.findOne({
            where: {
              name: 'Asia',
              gameId: currentGame.id
            },
          });
        if (asia) {
            if (asia.currentOwner === player1.id) {
                asiaFlag = red_flag;
                asiaValue = asia.troops;
            } else if (asia.currentOwner === player2.id) {
              asiaFlag = black_flag;
              asiaValue = asia.troops;
          } else {
            asiaFlag = blue_flag;
            asiaValue = asia.troops;
          }
        }
        /////////////////////////////////////

        ///////////////////////////////////// 
        let australiaFlag = 'none';
        let australiaValue = null;
        // buscamos australia
        let australia = await Territory.findOne({
            where: {
              name: 'Australia',
              gameId: currentGame.id
            },
          });
        if (australia) {
            if (australia.currentOwner === player1.id) {
                australiaFlag = red_flag;
                australiaValue = australia.troops;
            } else if (australia.currentOwner === player2.id) {
              australiaFlag = black_flag;
              australiaValue = australia.troops;
          } else {
            australiaFlag = blue_flag;
            australiaValue = australia.troops;
          }
        }
        /////////////////////////////////////

        
      
        //console.log("NORTHAMERICA FLAG", northAmericaFlag);
        //console.log("NORTHAMERICA VALUE", northAmericaValue);

    
        let flags = [northAmericaFlag, centralAmericaFlag, southAmericaFlag, europeFlag, africaFlag, rusiaFlag, asiaFlag, australiaFlag]; // modificar
        let values = [northAmericaValue, centralAmericaValue, southAmericaValue, europeValue, africaValue, rusiaValue, asiaValue, australiaValue]; // modificar
      
        ctx.status = 200;
        ctx.body = {
            flags: flags,
          soldiers: values,
        };
      };


      // GET /ingameplayerinfo (parecida a getleftinfobar)
  const inGamePlayerInfo = async (ctx) => {
    const { username } = ctx.request.query;
  
    // Busca el juego
    let currentGame = await Game.findOne({
      where: {
        status: 'playing',
        [Op.or]: [
          { player1: username },
          { player2: username },
          { player3: username },
        ],
      },
    });

    // Buusca player data
    const playerData = await Player.findOne({
      where: {
        gameId: currentGame.id,
        username: username,
      },
    });

    const myTerritoriesData = await Territory.findAll({
        where: {
          gameId: currentGame.id,
          currentOwner: playerData.id
        }
      });

    const myTerritories = myTerritoriesData.map((territory) => territory.name);

    const enemyTerritoriesData = await Territory.findAll({
        where: {
          gameId: currentGame.id,
          currentOwner: {
            [Op.not]: playerData.id
          }
        }
      });

      const enemyTerritories = enemyTerritoriesData.map((territory) => territory.name);

  
    ctx.status = 200;
    ctx.body = {
      status: playerData.status,
      turnSoldiers: playerData.turnSoldiers,
      myTerritories: myTerritories,
      enemyTerritories: enemyTerritories,
    };
  };

  // POST /addSoldier
const addSoldier = async (ctx) => {
    const data = ctx.request.body;

    const username = data.username;
    const userId = data.userId;
    const territorySelected = data.territory;

    // Busca el juego
    const currentGame = await Game.findOne({
        where: {
          status: 'playing',
          [Op.or]: [
            { player1: username },
            { player2: username },
            { player3: username },
          ],
        },
      });

      // Busca al jugador
    const player = await Player.findOne({
        where: {
          gameId: currentGame.id,
          userId: userId
        },
      });

        // Busca al territorio
    const territoryInstance = await Territory.findOne({
        where: {
          gameId: currentGame.id,
          currentOwner: player.id,
          name: territorySelected
        },
      });

    if (player.turnSoldiers > 0 && territoryInstance) {
        territoryInstance.troops = territoryInstance.troops+1;
        await territoryInstance.save();
        player.turnSoldiers = player.turnSoldiers-1;
        await player.save();
        ctx.body = JSON.stringify({result: "successful"});
        return;
    }
  
    ctx.body = JSON.stringify({result: "failed"});
  };

    // POST /attack
const attack = async (ctx) => {
    const data = ctx.request.body;

    console.log('attack!!!!');

    const username = data.username;
    const userId = data.userId;
    const attackingTerritoryName = data.myTerritory;
    const enemyTerritoryName = data.enemyTerritory;

    // Busca el juego
    const currentGame = await Game.findOne({
        where: {
          status: 'playing',
          [Op.or]: [
            { player1: username },
            { player2: username },
            { player3: username },
          ],
        },
      });

      // Busca al jugador
    const player = await Player.findOne({
        where: {
          gameId: currentGame.id,
          userId: userId
        },
      });

    // Buscar al territorio enemigo
    const enemyTerritory = await Territory.findOne({
      where: {
        gameId: currentGame.id,
        name: enemyTerritoryName
      },
    });

    // Buscar al enemigo
      const enemy = await Player.findOne({
        where: {
          gameId: currentGame.id,
          id: enemyTerritory.currentOwner
        }
      });

        // Buscar al territorio nuestro
    const ourTerritory = await Territory.findOne({
        where: {
          gameId: currentGame.id,
          currentOwner: player.id,
          name: attackingTerritoryName
        },
      });



    const bordering1 = await Border.findOne({
        where: {
            territory1_name: attackingTerritoryName,
            neighboring2_name: enemyTerritoryName,
        },
      });

      const bordering2 = await Border.findOne({
        where: {
            territory1_name: enemyTerritoryName,
            neighboring2_name: attackingTerritoryName,
        },
      });

    console.log("ENEMY TERRITORYDEBUG: " + enemyTerritory.name);
    console.log("MY TERRITORYDEBUG: " + ourTerritory.name);
    console.log("MY PLAYERDEBUG: " + player.username);
    console.log("MY ENEMYDEBUG: " + enemy.username);


    if (bordering1 || bordering2) {
        const ourTroops = ourTerritory.troops;
        const enemyTroops = enemyTerritory.troops;
        const sumOfTroops = ourTroops + enemyTroops;
        // Calculate the probability
        const probability = ourTroops / sumOfTroops;
        console.log('Chance of winning: ' + probability);
        // Generate a random number between 0 and 1
        const randomNumber = Math.random();
        if (randomNumber < probability) {
            console.log("Ganado");
            enemyTerritory.currentOwner = player.id;
            await enemyTerritory.save();
            player.number_of_territories = player.number_of_territories + 1;
            await player.save();
            enemy.number_of_territories = enemy.number_of_territories - 1;
            await enemy.save();
            await changeTurn(currentGame, player, enemy);


          } else {
            console.log("Perdido");
            ourTerritory.currentOwner = enemy.id;
            await ourTerritory.save();
            player.number_of_territories = player.number_of_territories - 1;
            await player.save();
            enemy.number_of_territories = enemy.number_of_territories + 1;
            await enemy.save();
            await changeTurn(currentGame, player, enemy);
          }

        await checkWinner(currentGame);
        ctx.body = JSON.stringify({result: "successful"});
        return;
    }
  
    ctx.body = JSON.stringify({result: "failed"});
  };

  const changeTurn = async (gameInstance, playerInTurn, enemy) => {
    const gameType = gameInstance.name;
    let currentTurn = gameInstance.current_turn;

    if (gameType === "three") {
    if (currentTurn === 3) { 
      gameInstance.current_turn = 1;
      await gameInstance.save();

      let player1 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player1
        },
      });
      player1.status = 'inTurn';
      player1.turnSoldiers = 5;
      await player1.save();

      let player2 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player2
        },
      });
      player2.status = 'wait';
      player2.turnSoldiers = 5;
      await player2.save();

      let player3 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player3
        },
      });
      player3.status = 'wait';
      player3.turnSoldiers = 5;
      await player3.save();

    } else if (currentTurn === 2) {
      gameInstance.current_turn = 3;
      await gameInstance.save();

      let player1 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player1
        },
      });
      player1.status = 'wait';
      player1.turnSoldiers = 5;
      await player1.save();

      let player2 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player2
        },
      });
      player2.status = 'wait';
      player2.turnSoldiers = 5;
      await player2.save();

      let player3 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player3
        },
      });
      player3.status = 'inTurn';
      player3.turnSoldiers = 5;
      await player3.save();


    } else {
      gameInstance.current_turn = 2;
      await gameInstance.save();

      let player1 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player1
        },
      });
      player1.status = 'wait';
      player1.turnSoldiers = 5;
      await player1.save();

      let player2 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player2
        },
      });
      player2.status = 'inTurn';
      player2.turnSoldiers = 5;
      await player2.save();

      let player3 = await Player.findOne({
        where: {
          gameId: gameInstance.id,
          username: gameInstance.player3
        },
      });
      player3.status = 'wait';
      player3.turnSoldiers = 5;
      await player3.save();
    }
  } else {
    playerInTurn.status = 'wait';
    playerInTurn.turnSoldiers = 5;
    await playerInTurn.save();

    enemy.status = 'inTurn';
    await enemy.save();
  }

    return;
  }

  const checkWinner = async (gameInstance) => {
    let result = false;

    const gameID = gameInstance.id;
    const player1Username = gameInstance.player1; 
    const player2Username = gameInstance.player2;
    const player3Username = gameInstance.player3;    
    
   
    const player1 = await Player.findOne({
      where: { username: player1Username, 
               gameId: gameID},
    });

    const player2 = await Player.findOne({
      where: { username: player2Username, 
               gameId: gameID},
    });

    const player3 = await Player.findOne({
      where: { username: player3Username, 
               gameId: gameID},
    });

    if (player1.number_of_territories === 8) {
        // gana p1
        player1.status = 'winner';
        player2.status = 'loser';
        await player1.save();
        await player2.save();

        if (player3) {
          player3.status = 'loser';
          await player3.save();
        }
        

        gameInstance.status = 'finished';
      await gameInstance.save();
      result = true;
    return result;

    } else if (player2.number_of_territories === 8) {
      // gana p2
      player1.status = 'loser';
        player2.status = 'winner';
        await player1.save();
        await player2.save();

        if (player3) {
          player3.status = 'loser';
          await player3.save();
        }

        gameInstance.status = 'finished';
      await gameInstance.save();
      result = true;
    return result;

    } else {
      if (player3) {
      if (player3.number_of_territories === 8) {
        // gana p3
        player1.status = 'loser';
        player2.status = 'loser';
        await player1.save();
        await player2.save();

        
          player3.status = 'winner';
          await player3.save();
        

        gameInstance.status = 'finished';
        await gameInstance.save();

        result = true;
        return result;
      }
    }
    }

    return result;


   
  };




  module.exports = {
    joinGame,
    getLeftInfobar,
    getRightInfobar,
    selectTerritory,
    updateBoard,
    inGamePlayerInfo,
    addSoldier,
    attack,
    joinGameThree


    
  };
  