var request = require('request');
var net = require('net');

var HOST = '0.0.0.0';
var PORT = 3030;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
net.createServer(function(sock) {

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);

    // 为这个socket实例添加一个"data"事件处理函数
    sock.on('data', function(data) {
        console.log("enterData:", data);
        var dataPromise_1 = JSON.stringify(data);
        var dataPromise_2 = JSON.parse(dataPromise_1);
        var array = dataPromise_2.data;
        var str = '';
        for(var num = 0; num < array.length; num++) {
            if(array[num] < 16) {
                str += '0' + array[num].toString(16);
            } else {
                str +=  array[num].toString(16);
            }
        }
        var options = {
            url: 'http://115.159.79.110:6060/cattleEnter',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            form: {
                data: str
            }
        };
        console.log("myEnterData:", options.form.data);
        if(options.form.data[0] === 'a' && options.form.data[1] === 'a') {
            request.post(options, callback);
        }
    });

    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log("info:", info);
    }
}

