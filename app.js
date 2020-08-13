const fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'drdshbgat0jpsx9rpublic.drds.aliyuncs.com',
  user     : 'nikki4cnanni',
  password : 'HbpsgJdP8oKg0lwA',
  database : 'nikki4cnanni'
});

var csvArr = []

const redis = require("redis");
const client = redis.createClient({
  // host: '208.167.233.104',
  // port: 15001,
  // password: '123456',
});

fs.readFile('list.csv', function (err, data) {
  var table = new Array();
  if (err) {
    console.log(err.stack);
    return;
  }

  data = data.toString();
  var table = new Array();
  var rows = new Array();
  rows = data.split("\r\n");
  console.log('rows split');
  
  // 700万数组rows
  // 1万轮询跑
  // var max = rows.length;
  var max = 10000;
  var init = 1;
  
  // 查询数据库然后 插入redis
  // for (var i = init; i < 100000; i++) {
  //   var x = rows[i]
  //   getDataStr(x)
  // }

  while(max > 0) {
    max--
    getDataStr(rows[max], max)
  }
});
 
connection.connect();

function getDataStr(roleid, indent = 0) {
  connection.query(`SELECT * FROM nikki4cn WHERE vroleid = ${roleid || 0}`, function (error, results, fields) {
    if (error) throw error;
    var str = JSON.stringify(results[0] || '')
    client.set(roleid, str);
    console.log(indent)
    // client.get(roleid, redis.print);
  });
}
