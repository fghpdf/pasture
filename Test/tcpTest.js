var net = require('net');
var HOST = '127.0.0.1';
//var HOST = '115.159.79.110';
var PORT = 5050;
var data = new Buffer(['170', '34', '0', '0', '16', '0', '12', '1', '144', '103', '50', '51', '52', '53', '54','46', '55', '56']);

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
    client.write(data);

});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {

    console.log('DATA: ' + data);
    // 完全关闭连接
    client.destroy();

});

// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

