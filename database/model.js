var db = require('./db').db.bookshelf;
var knex = require('./db').db.knex;

var Cattle = db.Model.extend({
    tableName:'cattle',
    idAttribute:'id'
});

var Milk = db.Model.extend({
    tableName:'milk',
    idAttribute:'id'
});

/*Cattle.query({where: {cattleCoding: '123456789012345', pastureId: '12345', period: '3'}}).fetch().then(function(model) {
        console.log(model);
    var time = model.get('enterDate');
    var now = new Date();
    console.log(now.getMinutes() - time.getMinutes());
    });*/
/*Cattle.query({ where: { today: '1', period: '1', pastureId: '12345'}}).query().then(function(model) {
    console.log(model);
});*/

//knex('cattle').distinct('cattleCoding').select().then(function(row) {
//    console.log(row);
//});
/*var nowTime = new Date();

new Cattle().where({
    cattleCoding: '019067000000000002',
    period: '1'
}).save({
    enterDate: nowTime,
    today: nowTime.getDate(),
    month: nowTime.getMonth() + 1,
    pastureId: '019067'
}, {patch: true}).then(function (model_save) {
    console.log(model_save);
}).catch(function(err) {
    console.log(err.message);
});*/

/*
var startDate = new Date();
var endDate = new Date('Wed Apr 06 2016 18:49:44 GMT+0800 (中国标准时间)');
console.log(endDate);

Milk.query(function(qb) {
    qb.where('uploadDate', '<', endDate).andWhere('uploadDate', '>', startDate).andWhere('pastureId', '=', '019067');
}).query().then(function(model) {
        console.log(model);
    });
*/
//var qiniu = require("qiniu");
//
////需要填写你的 Access Key 和 Secret Key
//qiniu.conf.ACCESS_KEY = 'kh1a0eotWq6YMyTrgAsEHbpl-OlT-s3e2suAFjL9';
//qiniu.conf.SECRET_KEY = 'j5JLmgcLi6ppdFWu0nWKrwaWCNvoY5OHrzVnmGjn';
//
////要上传的空间
//bucket = 'yaojiachen';
//
////上传到七牛后保存的文件名
//key = 'my-nodejs-logo.png';
//
////构建上传策略函数
//function uptoken(bucket, key) {
//    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
//    return putPolicy.token();
//}
//
////生成上传 Token
//token = uptoken(bucket, key);
//console.log(token);

module.exports = {
    Cattle: Cattle,
    Milk: Milk,
    knex: knex
};