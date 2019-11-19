var d2gsi = require('dota2-gsi');
var server = new d2gsi({port:1339,token:null,ip:"127.0.0.1"});
var ipc = require('electron').ipcRenderer;
var path = require('path');

const { webFrame } = require('electron')
webFrame.setZoomFactor(0.637)

var TeamLogosUrl = path.join(__dirname,'../../TeamLogos/');
TeamLogosUrl = TeamLogosUrl.replace(/\\/g, "/");

var leftPoint = 0;
var rightPoint = 0;
//投掷物
var grenadePanelCount = {};
for(let i = 0;i<10;i++){
  grenadePanelCount[i] = {'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0};
}
var leftGrenadeCount = {'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0};
var rightGrenadeCount = {'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0};

var playerRoundKill = {  0:0,  1:0,  2:0,  3:0,  4:0,  5:0,  6:0,  7:0,  8:0,  9:0};
// var grenadePanelCount = {
//   0:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   1:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   2:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   3:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   4:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   5:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   6:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   7:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   8:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
//   9:{'weapon_smokegrenade':0,'weapon_flashbang':0,'weapon_hegrenade':0,'weapon_incgrenade':0,'weapon_molotov':0},
// };

//炸弹爆炸视频
// var player_bomb = videojs('bomb-video',{
//   muted: false,
//   controls : false,      
//   height:1920, 
//   width:1080,
//   loop : false,
//   preload:true
// });
// player_bomb.on('ended',function(){
//   $(".video-bomb-show").hide();
// })
// player_bomb.hide()
//拆除成功视频
// var player_defused = videojs('defused-video',{
//   muted: true,
//   controls : false,      
//   height:1920, 
//   width:1080,
//   loop : false,
//   preload:true
// });
// player_defused.on('ended',function(){
//   $(".video-defused-show").hide();
// })
// player_defused.hide();


server.events.on('newclient', function(client) {
  client.setMaxListeners(11);
  playerSteamIdBySlot = playersStatusRefresh();

  function playersStatusRefresh(){
    //更新选手信息，根据ob_slot位置
    if (client.gamestate.allplayers != null) {
      if (Object.keys(client.gamestate.allplayers).length != 0) {
        allplayersAry = client.gamestate.allplayers;
        playerSteamIdBySlot = new Array();
        for(var i in allplayersAry){
          playerSteamIdBySlot[allplayersAry[i].observer_slot] = i;
        }
        return playerSteamIdBySlot;
      } 
    }
    else {
      var playerSteamIdBySlot = [];
      return playerSteamIdBySlot;
    }
  }

  function grenadeCountPanel(weapons,num){
    grenadePanelCount[num]['weapon_smokegrenade'] = 0;
    grenadePanelCount[num]['weapon_flashbang'] = 0;
    grenadePanelCount[num]['weapon_hegrenade'] = 0;
    grenadePanelCount[num]['weapon_incgrenade'] = 0;
    grenadePanelCount[num]['weapon_molotov'] = 0;
    if (weapons != '') {
      for(var i in weapons){
        if(weapons[i].type == 'Grenade'){
          grenadePanelCount[num][weapons[i].name] = weapons[i].ammo_reserve;
        }
      }
    }
    //left:1,2,3,4,5
    for(let i in leftGrenadeCount){
      leftGrenadeCount[i] = 0;
      for(let j = 1;j<=5;j++){
        leftGrenadeCount[i] += grenadePanelCount[j][i];
      }
    }
    //right:6,7,8,9,0
    for(let i in rightGrenadeCount){
      rightGrenadeCount[i] = 0;
      for(let j = 6;j<=9;j++){
        rightGrenadeCount[i] += grenadePanelCount[j][i];
      }
      rightGrenadeCount[i] += grenadePanelCount[0][i];
    }

    $("#l1").html('x'+leftGrenadeCount.weapon_smokegrenade);
    $("#l2").html('x'+leftGrenadeCount.weapon_flashbang);
    $("#l3").html('x'+leftGrenadeCount.weapon_hegrenade);
    $("#l4").html('x'+leftGrenadeCount.weapon_incgrenade);
    $("#r1").html('x'+rightGrenadeCount.weapon_smokegrenade);
    $("#r2").html('x'+rightGrenadeCount.weapon_flashbang);
    $("#r3").html('x'+rightGrenadeCount.weapon_hegrenade);
    $("#r4").html('x'+rightGrenadeCount.weapon_molotov);

    // console.log('----------------LEFT----------------');
    // console.log(leftGrenadeCount);
    // console.log('------------------------------------');
    //console.log(rightGrenadeCount);
    
  }

  function specSidePanelPlayerTeam(isFirst){
    setTimeout(()=>{
      console.log(client.gamestate.map.team_ct.name+":"+client.gamestate.map.team_t.name);
      if (client.gamestate.allplayers[playerSteamIdBySlot[1]].team == 'CT') {
        //ct 在左
        leftPoint = client.gamestate.map.team_ct.score;
        rightPoint = client.gamestate.map.team_t.score;
        if(isFirst){
          $("#team_logo_L").attr('src','gifLogo/'+client.gamestate.map.team_ct.name+'.gif');
          $("#team_logo_R").attr('src','gifLogo/'+client.gamestate.map.team_t.name+'.gif');
        }        
        console.log(leftPoint+":"+rightPoint);
      }else{
        leftPoint = client.gamestate.map.team_t.score;
        rightPoint = client.gamestate.map.team_ct.score;
        console.log(leftPoint+":"+rightPoint);
        if(isFirst){
          $("#team_logo_L").attr('src','gifLogo/'+client.gamestate.map.team_t.name+'.gif');
          $("#team_logo_R").attr('src','gifLogo/'+client.gamestate.map.team_ct.name+'.gif');
        }
      }
      
      $('#l_score').html(leftPoint);
      $('#r_score').html(rightPoint);
    },2000);    
    
  }

  function healthBarListener(health,num){
    if (health == 0) {
      client.emit('allplayers:' + playerSteamIdBySlot[num] + ':weapons','');
    }
    /////////血条监听中当血量为0时更新血条死亡样式，并更新一遍KDA及回合击杀
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
  ///////////开局交换阵营//////////////
  /////////////////////////////

  for(let ind=0;ind < 10;ind++){
    // client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:health',(health)=>{
    //     healthBarListener(health,ind);
    // });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':weapons',(weapons)=>{
      grenadeCountPanel(weapons,ind);     
    });
    client.on('allplayers:' + playerSteamIdBySlot[ind] + ':state:round_kills',(round_kills)=>{
      playerRoundKill[ind] = round_kills;
    });
  }
  client.on('allplayers:' + playerSteamIdBySlot[1] + ':team',(team)=>{
    //specSidePanelPlayerTeam(false)
    if (team == 'CT') {
      //ct 在左
      console.log("ct 在左");
    }else{
      console.log("ct 在右");
    } 
  });

  var last_state = '';
  var is_send = false;
  var is_planted = false;
  client.on('bomb:state',(state)=>{
      if(state == 'planted' && last_state =='planting'){
        //埋下
        console.log('触发埋包midi');
        ipc.send('sendmidi','planted');
        is_planted = true;
      }
      // if(state == 'exploded'){
      //   
      //   console.log('booo');
      //   is_show = true;
      //   ipc.send('sendmidi',state);
      //   $(".video-bomb-show").show();
      //   player_bomb.play();
        
      // }
      // if(state == 'defused'){
      //   
      //   console.log('defused');
      //   is_show = true;
      //   ipc.send('sendmidi',state);
      //   $(".video-defused-show").show();
      //   player_defused.play();
      // }
      last_state = state;

        //bomb 安装
        //specTopPanelBombPlanted(state);
    })

    client.on('round:win_team',(win_team)=>{
      console.log(client.gamestate);
      console.log(playerRoundKill);    

      if(client.gamestate.bomb.state == 'exploded'){//爆炸 结束小局
        console.log('exploded');
        ipc.send('sendmidi','exploded');
        bomb_show();
        // $(".video-bomb-show").show();
        // player_bomb.play();
      }else if (client.gamestate.bomb.state == 'defused'){//拆除 结束小局
        console.log('defused');
        ipc.send('sendmidi','defused');
        defused_show()
        // $(".video-defused-show").show();
        // player_defused.play();
      }else{
        for(let i in playerRoundKill){
          if(playerRoundKill[i] >= 4 && client.gamestate.allplayers[playerSteamIdBySlot[i]].team == win_team){            
            console.log(client.gamestate.allplayers[playerSteamIdBySlot[i]]);
            ipc.send('sendmidi','multikill');
            console.log('multikill');

            is_send = true;

            //显示四杀 五杀
            console.log('击杀：'+playerRoundKill[i]);
            if(playerRoundKill[i] == 4){
              $(".k_bot").removeClass('five_k');
              $(".k_bot").addClass('four_k');
            }else{
              $(".k_bot").removeClass('four_k');
              $(".k_bot").addClass('five_k');
            }
            $(".kill_img").attr('src','photo/'+client.gamestate.allplayers[playerSteamIdBySlot[i]].name+'.png');
            $(".kill_name").html(client.gamestate.allplayers[playerSteamIdBySlot[i]].name);

            multikill_show();
            console.log('选手：'+client.gamestate.allplayers[playerSteamIdBySlot[i]].name);
            ///////////////
            //////////////
            ///////////////////////
            //需内容

          }
        }
        if(!is_send && is_planted){
          ipc.send('sendmidi','endgame');//小局结束，但并无爆炸或拆除或多杀
          console.log('endgame');
        }
      }
      specSidePanelPlayerTeam(false);//  更换比分
      is_planted = false;
      is_send = false;
      
    })
  }
}
  


  function uiIni(){
    
    if (playerSteamIdBySlot != null) {
      if (playerSteamIdBySlot.length == 0) {
        client.playerAmount = 0;
      }
    }else {
      client.playerAmount = 0;
    };    
    specSidePanelPlayerTeam(true);
    for (var i = 0; i < playerSteamIdBySlot.length; i++) {
      if (playerSteamIdBySlot != null) {
        if (client.gamestate.allplayers[playerSteamIdBySlot[i]] != null) {
          var tmp = client.gamestate.allplayers[playerSteamIdBySlot[i]];
          grenadeCountPanel(tmp.weapons,i);
        }
      }
    }


    client.removeAllListeners();
    client.on('playerAmount',
      function playerAmountOn(playerAmount){
              playerSteamIdBySlot = playersStatusRefresh();
              uiIni();
              
    })
    clientOnStart();
  }

  uiIni();

  ipc.on('uiRefresh',()=>{
    playerSteamIdBySlot = playersStatusRefresh();
    uiIni();
  })
  client.on('playerAmount',()=>{
    playerSteamIdBySlot = playersStatusRefresh();
    uiIni();
  })
});
