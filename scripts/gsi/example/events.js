var d2gsi = require('../index.js');
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
  ////////////
////////////
////////////
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    
    console.log(request.method + ': ' + request.url);
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'application/json'});
    // 将HTTP响应的HTML内容写入response:
    response.end(
        JSON.stringify(client.gamestate, null, 2)
    );
    
});

// 让服务器监听8080端口:
server.listen(8088);

console.log('Server is running at http://127.0.0.1:8088/');
////////////
////////////
////////////
});

