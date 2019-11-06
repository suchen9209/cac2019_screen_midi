var d2gsi = require('dota2-gsi');
var server = new d2gsi({port:1339,token:null,ip:"127.0.0.1"});
var http = require('http');
var ipc = require('electron').ipcRenderer;
var fs = require('fs');
var path = require('path');
var videojs = require('video.js');
var playerAvatarUrl = path.join(__dirname,'../../PlayerAvatars/');
var TeamLogosUrl = path.join(__dirname,'../../TeamLogos/');
TeamLogosUrl = TeamLogosUrl.replace(/\\/g, "/");
var FlagUrl = path.join(__dirname,'../../Flag/');
var previousWeaponName = '';
var previousWeaponPaintkit = '';
var previousWeaponAmmo = 0;
var defuseStartTime = 0;
var tacPauseStartTime = 0;
var lossEconomy = new Array();
  lossEconomy = [1400,1900,2400,2900,3400];
var teamCheck = new Array();
var grenadePanelCount = {
  '0':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '1':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '2':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '3':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '4':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '5':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '6':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '7':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '8':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
  '9':{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
};
var teamEco = {
  '0':{'Money':0,'EQvalue':0},
  '1':{'Money':0,'EQvalue':0},
  '2':{'Money':0,'EQvalue':0},
  '3':{'Money':0,'EQvalue':0},
  '4':{'Money':0,'EQvalue':0},
  '5':{'Money':0,'EQvalue':0},
  '6':{'Money':0,'EQvalue':0},
  '7':{'Money':0,'EQvalue':0},
  '8':{'Money':0,'EQvalue':0},
  '9':{'Money':0,'EQvalue':0},
};
var playerRoundStartMoney = {
  '0':0,
  '1':0,
  '2':0,
  '3':0,
  '4':0,
  '5':0,
  '6':0,
  '7':0,
  '8':0,
  '9':0,
};
var playerRoundKill = {
  '0':0,
  '1':0,
  '2':0,
  '3':0,
  '4':0,
  '5':0,
  '6':0,
  '7':0,
  '8':0,
  '9':0,
};

var player_bomb = videojs('bomb-video',{
  muted: true,
  controls : false,      
  height:1920, 
  width:1080,
  loop : false,
  preload:true
});
player_bomb.on('ended',function(){
  $(".video-bomb-show").hide();
})
player_bomb.hide()
var player_defused = videojs('defused-video',{
  muted: true,
  controls : false,      
  height:1920, 
  width:1080,
  loop : false,
  preload:true
});
player_defused.on('ended',function(){
  $(".video-defused-show").hide();
})
player_defused.hide();


server.events.on('newclient', function(client) {
  //   console.log(client);
  //   var server = http.createServer(function (request, response) {
  //       // 回调函数接收request和response对象,
  //       // 获得HTTP请求的method和url:
        
  //       console.log(request.method + ': ' + request.url);
  //       // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
  //       response.writeHead(200, {'Content-Type': 'application/json'});
  //       // 将HTTP响应的HTML内容写入response:
  //       response.end(
  //           JSON.stringify(client, null, 2)
  //       );
        
  //   });
  //   // 让服务器监听8080端口:
  // server.listen(8088);
  console.log('Server is running at http://127.0.0.1:8088/');
  client.setMaxListeners(11);
  function playersStatusRefresh(){
    if (client.gamestate.allplayers != null) {
      if (Object.values(client.gamestate.allplayers).length != 0) {
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
        for (var i = 0; i < playerNum; i++) {
          if (allplayersAry[playerSteamIdBySlot[i]] != null) {
            $("#specSidePanel-"+ i +" .specSidePanel-nameText").html(allplayersAry[playerSteamIdBySlot[i]].name);
          }  
        };
        return playerSteamIdBySlot;
      } 
    }
    else {
      var playerSteamIdBySlot = [];
      return playerSteamIdBySlot;
     }
      
  }
  playerSteamIdBySlot = playersStatusRefresh();


  function specSidePanelMatchStats(title,stats,num){
      $("#specSidePanel-"+ num +" .specSidePanel-Stats-Content-" + title).html(stats);
  }


  function specSidePanelGrenades(weapons,num){
    var weaponNum = Object.keys(weapons).length;
    var GrenadeCount = 0;
    var mainWeapon = 0;
    var pistol = 0;
    var weaponActive = -1;
    var c4Check = 0;
    var hudSpecSidePanelNades = "#specSidePanel-"+ num +" .specSidePanel-nades";
    grenadePanelCount[num]['weapon_smokegrenade'] = 0;
    grenadePanelCount[num]['weapon_flashbang'] = 0;
    grenadePanelCount[num]['weapon_hegrenade'] = 0;
    grenadePanelCount[num]['weapon_incgrenade'] = 0;
    grenadePanelCount[num]['weapon_molotov'] = 0;
        if (weapons != '') {
          for (var i = weaponNum - 1; i >= 0; i--) {
            var weaponName = weapons['weapon_' + i].name;
            if (weapons['weapon_' + i].type == 'Grenade') {
              if (GrenadeCount == 0) {
                if (weapons['weapon_' + i].ammo_reserve == 2) {
                  $(hudSpecSidePanelNades).html("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-nades-icon specSidePanel-"+ num + "-"+ weaponName +"' alt=''>" + "<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-nades-icon' alt=''>")
                  grenadePanelCount[num][weaponName] = 2;
                }
                else {
                  $(hudSpecSidePanelNades).html("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-nades-icon specSidePanel-"+ num + "-"+ weaponName +"' alt=''>")
                  grenadePanelCount[num][weaponName] = 1;
                }
              }
              else {
                if (weapons['weapon_' + i].ammo_reserve == 2) {
                  $(hudSpecSidePanelNades).append("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-nades-icon specSidePanel-"+ num + "-"+ weaponName +"' alt=''>")
                  grenadePanelCount[num][weaponName]++;
                }
                $(hudSpecSidePanelNades).append("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-nades-icon specSidePanel-"+ num + "-"+ weaponName +"' alt=''>")
                grenadePanelCount[num][weaponName]++;
              };
              GrenadeCount++;
            }
            else if(weapons['weapon_' + i].name == "weapon_c4"){
              $("#specSidePanel-"+ num +" .specSidePanel-specialIteam").html("<img src='iCons/svg_normal/weapon_c4.svg' class='specSidePanel-specialIteam-icon specSidePanel-"+ num + "-"+ weaponName +"' id='specSidePanel-" + num + "-c4' alt=''>");
              c4Check = 1;
            }
            else if (weapons['weapon_' + i].name == "weapon_taser"){
              $("#specSidePanel-"+ num +" .specSidePanel-pistal").html("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-pistal-icon specSidePanel-"+ num + "-"+ weaponName +"' alt=''>");
              pistol = -1;
            }
            else if (mainWeapon == 0) {
              $("#specSidePanel-"+ num +" .specSidePanel-mainWeapon").html("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-mainGun-icon specSidePanel-"+ num + "-"+ weaponName +" specSidePanel-mainGun-icon-Left' alt=''>")
              mainWeapon = 1;
              if ((weapons['weapon_' + i].type == 'Knife') || (weapons['weapon_' + i].type == 'Pistol')) {
                $("#specSidePanel-"+ num +" .specSidePanel-pistal").empty();
                pistol = -1;
              }
            }
            else if (mainWeapon != 0 & pistol == 0) {
              $("#specSidePanel-"+ num +" .specSidePanel-pistal").html("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-pistal-icon specSidePanel-"+ num + "-"+ weaponName +"' alt=''>");
              pistol = -1;
            }
            else if (mainWeapon != 0 & (weapons['weapon_' + i].type == 'Shotgun' || weapons['weapon_' + i].type == 'Machine Gun' || weapons['weapon_' + i].type == 'Submachine Gun' || weapons['weapon_' + i].type == 'Rifle' || weapons['weapon_' + i].type == 'SniperRifle')) {
              var wrongWeaponOrderFix = $("#specSidePanel-"+ num +" .specSidePanel-mainWeapon").html();
              $("#specSidePanel-"+ num +" .specSidePanel-mainWeapon").html("<img src='iCons/svg_normal/" + weaponName + ".svg' class='specSidePanel-mainGun-icon specSidePanel-"+ num + "-"+ weaponName +" specSidePanel-mainGun-icon-Left' alt=''>");
              $("#specSidePanel-"+ num +" .specSidePanel-pistal").html(wrongWeaponOrderFix);
              $("#specSidePanel-"+ num +" .specSidePanel-pistal img").removeClass('specSidePanel-mainGun-icon specSidePanel-mainGun-icon-Left').addClass('specSidePanel-pistal-icon');
            }
            if (weapons['weapon_' + i].state == 'active') {
              weaponActive = i;
            }
          }
          if (weaponActive != -1) {
            $("#specSidePanel-"+ num +" .specSidePanel-nades-icon").attr("style","");
            $("#specSidePanel-"+ num +" .specSidePanel-mainGun-icon").attr("style","");
            $("#specSidePanel-"+ num +" .specSidePanel-pistal-icon").attr("style","");
            $(".specSidePanel-"+ num + "-"+ weapons['weapon_' + weaponActive].name).attr('style','filter: brightness(200%);');
          }
          

          
          if (GrenadeCount == 0) {
            $(hudSpecSidePanelNades).empty();
          }
          if (c4Check == 0) {
            $("#specSidePanel-"+ num +"-c4").remove();
          }
        }
        else{
          $("#specSidePanel-"+ num +" .specSidePanel-mainWeapon").empty();
          $("#specSidePanel-"+ num +" .specSidePanel-pistal").empty();
        }
          
  }

  function grenadeCountPanel(){
    var smokeLeft = grenadePanelCount['0']['weapon_smokegrenade']+grenadePanelCount['1']['weapon_smokegrenade']+grenadePanelCount['2']['weapon_smokegrenade']+grenadePanelCount['3']['weapon_smokegrenade']+grenadePanelCount['4']['weapon_smokegrenade'];
    var flashLeft = grenadePanelCount['0']['weapon_flashbang']+grenadePanelCount['1']['weapon_flashbang']+grenadePanelCount['2']['weapon_flashbang']+grenadePanelCount['3']['weapon_flashbang']+grenadePanelCount['4']['weapon_flashbang'];
    var nadeLeft = grenadePanelCount['0']['weapon_hegrenade']+grenadePanelCount['1']['weapon_hegrenade']+grenadePanelCount['2']['weapon_hegrenade']+grenadePanelCount['3']['weapon_hegrenade']+grenadePanelCount['4']['weapon_hegrenade'];
    var molotovLeft = grenadePanelCount['0']['weapon_molotov']+grenadePanelCount['1']['weapon_molotov']+grenadePanelCount['2']['weapon_molotov']+grenadePanelCount['3']['weapon_molotov']+grenadePanelCount['4']['weapon_molotov']+grenadePanelCount['0']['weapon_incgrenade']+grenadePanelCount['1']['weapon_incgrenade']+grenadePanelCount['2']['weapon_incgrenade']+grenadePanelCount['3']['weapon_incgrenade']+grenadePanelCount['4']['weapon_incgrenade'];
    var smokeRight = grenadePanelCount['5']['weapon_smokegrenade']+grenadePanelCount['6']['weapon_smokegrenade']+grenadePanelCount['7']['weapon_smokegrenade']+grenadePanelCount['8']['weapon_smokegrenade']+grenadePanelCount['9']['weapon_smokegrenade'];
    var flashRight = grenadePanelCount['5']['weapon_flashbang']+grenadePanelCount['6']['weapon_flashbang']+grenadePanelCount['7']['weapon_flashbang']+grenadePanelCount['8']['weapon_flashbang']+grenadePanelCount['9']['weapon_flashbang'];
    var nadeRight = grenadePanelCount['5']['weapon_hegrenade']+grenadePanelCount['6']['weapon_hegrenade']+grenadePanelCount['7']['weapon_hegrenade']+grenadePanelCount['8']['weapon_hegrenade']+grenadePanelCount['9']['weapon_hegrenade'];
    var molotovRight = grenadePanelCount['5']['weapon_molotov']+grenadePanelCount['6']['weapon_molotov']+grenadePanelCount['7']['weapon_molotov']+grenadePanelCount['8']['weapon_molotov']+grenadePanelCount['9']['weapon_molotov']+grenadePanelCount['5']['weapon_incgrenade']+grenadePanelCount['6']['weapon_incgrenade']+grenadePanelCount['7']['weapon_incgrenade']+grenadePanelCount['8']['weapon_incgrenade']+grenadePanelCount['9']['weapon_incgrenade'];
    $('#nadesEx-L .grenadeCountPanel-Content-smoke').html(smokeLeft);
    $('#nadesEx-L .grenadeCountPanel-Content-flash').html(flashLeft);
    $('#nadesEx-L .grenadeCountPanel-Content-hegrenade').html(nadeLeft);
    $('#nadesEx-L .grenadeCountPanel-Content-molotove').html(molotovLeft);
    $('#nadesEx-R .grenadeCountPanel-Content-smoke').html(smokeRight);
    $('#nadesEx-R .grenadeCountPanel-Content-flash').html(flashRight);
    $('#nadesEx-R .grenadeCountPanel-Content-hegrenade').html(nadeRight);
    $('#nadesEx-R .grenadeCountPanel-Content-molotove').html(molotovRight);
  }

  function specSidePanelRoundKill(stats,num){
    if (stats == 0) {
      $("#specSidePanel-"+ num +" .specSidePanel-roundKillInfo").attr('style','display:none');
    }
    else if (stats > 0) {
      $("#specSidePanel-"+ num +" .specSidePanel-roundKillInfo").attr('style','display:inline-block');
      $("#specSidePanel-"+ num +" .specSidePanel-roundKillText").html(stats);
    }
  }

  function specSidePanelPlayerTeam(stats,num){
    if (stats == 'CT') {
      $("#specSidePanel-"+ num +" .specSidePanel-Single").addClass('specSidePanel-border-CT').removeClass('specSidePanel-border-T');
      $("#specSidePanel-"+ num +" .specSidePanel-healthBar").addClass('specSidePanel-healthBar-CT').removeClass('specSidePanel-healthBar-T');    
    }
    else if (stats == 'T') {
      $("#specSidePanel-"+ num +" .specSidePanel-Single").addClass('specSidePanel-border-T').removeClass('specSidePanel-border-CT');
      $("#specSidePanel-"+ num +" .specSidePanel-healthBar").addClass('specSidePanel-healthBar-T').removeClass('specSidePanel-healthBar-CT');
      specSidePanelDefuseKitCheck(false,num);
    }
    if (client.gamestate.allplayers[playerSteamIdBySlot[1]].team == 'CT') {
      teamCheck.ct = 'L';
      teamCheck.t = 'R';
    }
    else if (client.gamestate.allplayers[playerSteamIdBySlot[1]].team == 'T') {
      teamCheck.ct = 'R';
      teamCheck.t = 'L';
    }

    //投掷物数量
    $("#nadesEx-" + teamCheck['ct']).attr("style","background-image: url('./styles/images/grenadeCount-CT.svg');");
    $("#nadesEx-" + teamCheck['t']).attr("style","background-image: url('./styles/images/grenadeCount-T.svg');");

    $("#teamSquare-" + teamCheck['ct'] + " .specTopPanelMainContainer-Bo3Score-Square").addClass('topSquareBorder-CT').removeClass('topSquareBorder-T');
    $("#teamSquare-" + teamCheck['t'] + " .specTopPanelMainContainer-Bo3Score-Square").addClass('topSquareBorder-T').removeClass('topSquareBorder-CT');
    $(".rdlslvl-" + teamCheck['ct']).addClass('rdlslvl-CT').removeClass('rdlslvl-T');
    $(".rdlslvl-" + teamCheck['t']).addClass('rdlslvl-T').removeClass('rdlslvl-CT');

  }

  function specSidePanelArmorCheck(armor,helmet,num){
    if (helmet == true) {
      $("#specSidePanel-"+ num +" .specSidePanel-Armor").html("<img src='iCons/svg_normal/item_assaultsuit.svg' class='specSidePanel-Armor-icon' alt=''>");
    }
    else if ((armor > 0) & (helmet == false)) {
      $("#specSidePanel-"+ num +" .specSidePanel-Armor").html("<img src='iCons/svg_normal/item_armorOnly.svg' class='specSidePanel-Armor-icon' alt=''>");
    }
    else if(armor == 0) {
      $("#specSidePanel-"+ num +" .specSidePanel-Armor").empty();
    }
  }

  function specSidePanelHelmetCheck(armor,helmet,num){
    if (helmet == true) {
      $("#specSidePanel-"+ num +" .specSidePanel-Armor").html("<img src='iCons/svg_normal/item_assaultsuit.svg' class='specSidePanel-Armor-icon' alt=''>");
    }
    else if ((armor > 0) & (helmet == false)) {
      $("#specSidePanel-"+ num +" .specSidePanel-Armor").html("<img src='iCons/svg_normal/item_armorOnly.svg' class='specSidePanel-Armor-icon' alt=''>");
    }
    else if(armor == 0) {
      $("#specSidePanel-"+ num +" .specSidePanel-Armor").empty();
    }
  }

  function specSidePanelDefuseKitCheck(defusekit,num){

    if (defusekit == true) {
      $("#specSidePanel-"+ num +" .specSidePanel-specialIteam").html("<img src='iCons/svg_normal/item_defusekit.svg' class='specSidePanel-specialIteam-icon specSidePanel-defuseKit' style='filter: brightness(180%);transform: scale(0.8);' id='specSidePanel-"+ num +"-defuseKit' alt=''>");
    }
    else{
      $("#specSidePanel-"+ num +" .specSidePanel-defuseKit").remove();
    }
  }

  function specSidePanelMoney(stats,num){
    teamEco[num]['Money'] = stats;
    $('.teamEconomyPanel-Content-Left .teamEconomyPanel-Content-teamEco-Value').html('$'+(teamEco['0']['Money']+teamEco['1']['Money']+teamEco['2']['Money']+teamEco['3']['Money']+teamEco['4']['Money']));
    $('.teamEconomyPanel-Content-Right .teamEconomyPanel-Content-teamEco-Value').html('$'+(teamEco['5']['Money']+teamEco['6']['Money']+teamEco['7']['Money']+teamEco['8']['Money']+teamEco['9']['Money']))
    $("#specSidePanel-"+ num +" .specSidePanel-extraPanel-Money-contents").html(stats);
    if (stats < playerRoundStartMoney[num]) {
      $("#specSidePanel-"+ num +" .specSidePanel-extraPanel-payMoney-contents").html(playerRoundStartMoney[num]-stats);
    }
    else {
      $("#specSidePanel-"+ num +" .specSidePanel-extraPanel-payMoney-contents").html('0');
    }
  }

  function specSidePanelEQvalue(stats,num){
    teamEco[num]['EQvalue'] = stats;
    $('.teamEconomyPanel-Content-Left .teamEconomyPanel-Content-teamEQEco-Value').html('$'+(teamEco['0']['EQvalue']+teamEco['1']['EQvalue']+teamEco['2']['EQvalue']+teamEco['3']['EQvalue']+teamEco['4']['EQvalue']));
    $('.teamEconomyPanel-Content-Right .teamEconomyPanel-Content-teamEQEco-Value').html('$'+(teamEco['5']['EQvalue']+teamEco['6']['EQvalue']+teamEco['7']['EQvalue']+teamEco['8']['EQvalue']+teamEco['9']['EQvalue']))
  }

  function healthBarListener(health,num){
    healthValue = health;
    redWarnValue = healthValue;
    healthBarValue = 300*healthValue/100;
    $("#specSidePanel-"+ num +" .specSidePanel-healthBar").attr("style","width:" + healthBarValue + "px");
    $("#specSidePanel-"+ num +" .specSidePanel-healthBar-redWarn").attr("style","width:" + redWarnValue + "%");
    $("#specSidePanel-"+ num +" .specSidePanel-healthText").html(healthValue);
    $("#specSidePanel-"+ num +" .specSidePanel-healthText").attr("style","");
    $("#specSidePanel-"+ num +" .specSidePanel-infoBar").attr("style","");
    $("#specSidePanel-"+ num +" .specSidePanel-healthBar-BgShadow").attr("style","");
    $("#specSidePanel-"+ num +" .specSidePanel-Single").attr("style","");
    if (health == 0) {
      $("#specSidePanel-"+ num +" .specSidePanel-healthBar-redWarn").attr("style","background-color: 0;background:0;");
      $("#specSidePanel-"+ num +" .specSidePanel-healthText").html("<img src='./iCons/svg_normal/dead.svg' alt='' >");
      $("#specSidePanel-"+ num +" .specSidePanel-infoBar").attr("style","background:0;");
      $("#specSidePanel-"+ num +" .specSidePanel-healthBar-BgShadow").attr("style","background:0;");
      $("#specSidePanel-"+ num +" .specSidePanel-Single").attr("style","border-right: 0;background: linear-gradient(to right,rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0));opacity: 0.6;");
      $("#specSidePanel-"+ num +"-defuseKit").remove();
      client.emit('allplayers:' + playerSteamIdBySlot[num] + ':weapons','');
    }
    else if (health <= 20) {
      $("#specSidePanel-"+ num +" .specSidePanel-healthText").attr("style", "text-shadow:0 0 0.4em #ff1212,-0 -0 0.4em #ff1212;color:#fce8e8");
    } 

    /////////血条监听中当血量为0时更新血条死亡样式，并更新一遍KDA及回合击杀
  }

  function specSidePanelLossCount(team,stats){  
    if (client.playerAmount != 0) {
      if (client.gamestate.allplayers[playerSteamIdBySlot[1]].team == 'CT') {
        teamCheck.ct = 'L';
        teamCheck.t = 'R';
      }
      else if (client.gamestate.allplayers[playerSteamIdBySlot[1]].team == 'T') {
        teamCheck.ct = 'R';
        teamCheck.t = 'L';
      }
      if (stats > 4) {
        stats = 4;
      }
      $('#rdlsEco-' + teamCheck[team]).html('$' + lossEconomy[stats]);
      if (team == 'ct') {
        anotherTeam = 'T';
      }
      else {
        anotherTeam = 'CT';
      }
      $('.rdlslvl-' + teamCheck[team]).removeClass('roundLossCount-CT').removeClass('roundLossCount-T');
      $('.rdlslvl-' + teamCheck[team] +':lt(' + stats + ')').addClass('roundLossCount-' + team.toUpperCase()).removeClass('roundLossCount-' + anotherTeam);
    }
    
  }

///////////构造监听函数/////
  function clientOnStart(){
  if (playerSteamIdBySlot != null) {
    client.on('allplayers:' + playerSteamIdBySlot[0] + ':name',
      function uiTeamsChange(name){
              playersStatusRefresh();
              uiIni();
    })
    client.on('allplayers:' + playerSteamIdBySlot[0] + ':team',
      function uiTeamsChange(team){
              playersStatusRefresh();
              uiIni();
    })
    client.on('player0Team',
      function uiTeamsChange(name){
              playersStatusRefresh();
              uiIni();
    });
    client.on('player0Slot',
      function uiTeamsChange(name){
              playersStatusRefresh();
              uiIni();
    });
  ///////////开局交换阵营//////////////
  /////////////////////////////
  
  for(let ind=0;ind < 10;ind++){
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:health',(health)=>{
        healthBarListener(health,ind);
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':match_stats:kills',(kills)=>{
        specSidePanelMatchStats('K',kills,ind);      
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':match_stats:assists',(assists)=>{
      specSidePanelMatchStats('A',assists,ind);      
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':match_stats:deaths',(deaths)=>{
      specSidePanelMatchStats('D',deaths,ind);      
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':weapons',(weapons)=>{
        specSidePanelGrenades(weapons,ind);
        grenadeCountPanel();      
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:round_kills',(round_kills)=>{
      playerRoundKill[ind] = round_kills;
      specSidePanelRoundKill(round_kills,ind);
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':team',(team)=>{
      specSidePanelPlayerTeam(team,ind);
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:armor',(armor)=>{
      if(armor,client.gamestate.allplayers[playerSteamIdBySlot[ind]].state.helmet){
        specSidePanelArmorCheck(armor,client.gamestate.allplayers[playerSteamIdBySlot[ind]].state.helmet,ind);
      }      
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:helmet',(helmet)=>{
      if(client.gamestate.allplayers[playerSteamIdBySlot[ind]].state.armor){
        specSidePanelHelmetCheck(client.gamestate.allplayers[playerSteamIdBySlot[ind]].state.armor,helmet,ind);
      }
      
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:defusekit',(defusekit)=>{
      specSidePanelDefuseKitCheck(defusekit,ind);
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:money',(money)=>{
      specSidePanelMoney(money,ind);
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:equip_value',(equip_value)=>{
      specSidePanelEQvalue(equip_value,ind);
    });
  }

  
  client.on('map:team_ct:consecutive_round_losses',(consecutive_round_losses)=>{
    specSidePanelLossCount('ct',consecutive_round_losses);
    specSidePanelLossCount('t',client.gamestate.map.team_t.consecutive_round_losses);
  })
  client.on('map:team_t:consecutive_round_losses',(consecutive_round_losses)=>{
    specSidePanelLossCount('t',consecutive_round_losses);
    specSidePanelLossCount('ct',client.gamestate.map.team_ct.consecutive_round_losses);
  })
  //////bomb
  // dropped
  // carried
  // planting
  // planted
  // exploded
  // defusing
  // defused
  ///////round over
  // "round": {
  //   "phase": "over",
  //   "win_team": "CT",
  //   "bomb": "defused"
  //   },
  var last_state = '';
  var is_show = false;
  client.on('bomb:state',(state)=>{
      if(state == 'planted' && last_state =='planting'){
        //埋下
        console.log('触发埋包midi');
        ipc.send('sendmidi',state);
      }
      if(state == 'exploded'){
        //爆炸
        console.log('booo');
        is_show = true;
        ipc.send('sendmidi',state);
        $(".video-bomb-show").show();
        player_bomb.play();
        
      }
      if(state == 'defused'){
        //拆除
        console.log('defused');
        is_show = true;
        ipc.send('sendmidi',state);
        $(".video-defused-show").show();
        player_defused.play();
      }
      last_state = state;

        //bomb 安装
        //specTopPanelBombPlanted(state);
    })


    client.on('round:win_team',(win_team)=>{
      console.log(playerRoundKill);
      if(!is_show){
        for(let i in playerRoundKill){
          if(playerRoundKill[i] >= 4 && client.gamestate.allplayers[playerSteamIdBySlot[i]].team == win_team){            
            console.log(client.gamestate.allplayers[playerSteamIdBySlot[i]]);
            ipc.send('sendmidi','multikill');
            $(".video-defused-show").show();
            player_defused.play();
          }
        }
        is_show = true;
      }
      console.log(win_team);

      is_show = false;
    })
  }}
  


  function uiIni(){
   
    if (playerSteamIdBySlot != null) {
      if (playerSteamIdBySlot.length == 0) {
        client.playerAmount = 0;
      }
    }else {
      client.playerAmount = 0;
    };    
    for (var i = playerSteamIdBySlot.length; i <= 9 ; i++) {
      $('#specSidePanel-' + i).addClass('unconnected');
    }
    for (var i = 0; i < playerSteamIdBySlot.length; i++) {
      $('#specSidePanel-' + i).removeClass('unconnected');
      if (playerSteamIdBySlot != null) {
        if (client.gamestate.allplayers[playerSteamIdBySlot[i]] != null) {
          var tmp = client.gamestate.allplayers[playerSteamIdBySlot[i]];
          healthBarListener(tmp.state.health,i);
          specSidePanelMatchStats('K',tmp.match_stats.kills,i);
          specSidePanelMatchStats('A',tmp.match_stats.assists,i);
          specSidePanelMatchStats('D',tmp.match_stats.deaths,i);
          specSidePanelGrenades(tmp.weapons,i);
          specSidePanelRoundKill(tmp.state.round_kills,i);
          specSidePanelPlayerTeam(tmp.team,i);
          specSidePanelArmorCheck(tmp.state.armor,tmp.state.helmet,i);
          specSidePanelDefuseKitCheck(tmp.state.defusekit,i);
          specSidePanelMoney(tmp.state.money,i);
          specSidePanelEQvalue(tmp.state.equip_value,i)
          grenadeCountPanel();
        }
      }
    }

    
    if (client.gamestate.player.activity != 'menu') {
      specSidePanelLossCount('ct',client.gamestate.map.team_ct.consecutive_round_losses);
      specSidePanelLossCount('t',client.gamestate.map.team_t.consecutive_round_losses);
    }  

    client.removeAllListeners();
    client.on('playerAmount',
      function playerAmountOn(playerAmount){
              playerSteamIdBySlot = playersStatusRefresh();
              uiIni();
              
    })
    clientOnStart();
  }
  client.on('playerAmount',(playerAmount)=>{
    playerSteamIdBySlot = playersStatusRefresh();
    uiIni();
  })

  uiIni();
  ipc.on('uiRefresh',function shortCutUiRefresh(test){
    playerSteamIdBySlot = playersStatusRefresh();
    uiIni();
  })
});
