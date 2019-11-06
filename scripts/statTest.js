var d2gsi = require('dota2-gsi');
var server = new d2gsi();
var http = require('http');
server.events.on('newclient', function(client) {
    console.log(client.gamestate);
 //   console.log("New client connection, IP address: " + client.ip + ", Auth token: " + client.auth);

//    client.on('player:activity', function(activity) {
 //       if (activity == 'playing') console.log("Game started!");
 //   });
 //   client.on('hero:level', function(level) {
  //      console.log("Now level " + level);
 //   });
  //  client.on('abilities:ability0:can_cast', function(can_cast) {
  //      if (can_cast) console.log("Ability0 off cooldown!");
  //  });
  //////////////////
  /////////////////
  ///////////////////
  ////////////////



  //////////////
  ///////////////////
  ///////////////////
  //////////////////
  function playersStatusRefresh(){
    allplayersAry = client.gamestate.allplayers;
    playerNum = Object.keys(client.gamestate.allplayers).length;
    playerSteamId = new Array();
     playerSteamIdBySlot = new Array();
    for (var i = playerNum; i > 0; i--) {
         playerSteamId[i - 1] = Object.keys(allplayersAry)[i - 1];
         observerSlot = allplayersAry[playerSteamId[i - 1]].observer_slot;
        if (observerSlot != 0) {
          playerSteamIdBySlot[observerSlot - 1] = playerSteamId[i - 1];
        }
        else {
          playerSteamIdBySlot[9] = playerSteamId[i - 1];
        }
    };
    // for (var i = 1; i <= playerNum; i++) {
    //     $(".health" + i).html(allplayersAry[playerSteamIdBySlot[i - 1]].name + '</br>');
        
    // };
    return playerSteamIdBySlot;

    
  }
  var playerSteamIdBySlot = playersStatusRefresh();

client.on('allplayers:76561198278650159:weapons',
      function grenadeCheck(allWeapons){
        var weaponNum = Object.keys(client.gamestate.allplayers['76561198278650159'].weapons).length;
        var GrenadeCount = 0;
        for (var i = 0; i < weaponNum; i++) {
          if (allWeapons['weapon_' + i].type == 'Grenade') {
            if (GrenadeCount == 0) {
              if (allWeapons['weapon_' + i].ammo_reserve == 2) {
                $(".health1").html(allWeapons['weapon_' + i].name + '</br>' + allWeapons['weapon_' + i].name + '</br>')
              }
              else {
                $(".health1").html(allWeapons['weapon_' + i].name + '</br>')
              }
            }
            else {
              if (allWeapons['weapon_' + i].ammo_reserve == 2) {
                $(".health1").append(allWeapons['weapon_' + i].name + '</br>')
              }
              $(".health1").append(allWeapons['weapon_' + i].name + '</br>')
            };
            GrenadeCount++;
          }

        }
        if (GrenadeCount == 0) {
          $(".health1").empty();
        }
      }
  )
//   client.on('allplayers:' + playerNum + ':state:health',
//     function test1(state){
//             playervalue = state;
//             $(".statTest1").html(playervalue);
//   })
//   client.on('phase_countdowns:phase_ends_in',
//     function specSidePanelHealthBar(state){
//             statevalue = state;
//             $(".statTest2").html(statevalue);
//   })

 });

