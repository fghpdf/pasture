var request = require('request');


var options = {
    url: 'http://120.193.154.66:6060/cattleLeave',
    //url: 'http://115.159.79.110:6060/cattleLeave',
    //url: 'http://localhost:6060/cattleLeave',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    form: {
        data: 'aa1200000f0008016533000000002502000010100a587'
    }
};
console.log("myLeaveData:", options.form.data);
if(options.form.data[0] === 'a' && options.form.data[1] === 'a') {
    request.post(options, callback);
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log("info:", info);
    }
}