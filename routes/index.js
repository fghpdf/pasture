var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var model = require('../database/model');
var url = require('url');
var asc = {
    '30': '0',
    '31': '1',
    '32': '2',
    '33': '3',
    '34': '4',
    '35': '5',
    '36': '6',
    '37': '7',
    '38': '8',
    '39': '9',
    '2e': '.'
};

//牛进栏api,period为时间段，1为上午，2为下午，3傍晚
router.post('/cattleEnter', function(req, res, next) {
    //对接时做字符串解析
    var data = req.body.data;
    console.log(data);
    getEPC(data, function (EPC) {
        var cattleCoding = EPC;
        var pastureId = EPC.substring(0, 6);
        var nowTime = new Date();
        getNowPeriod(nowTime, function (err, period) {
            if (err) {
                res.json({success: false, errorMessage: err});
            } else if(period !== -1 || period !== '-1' || EPC !== '') {
                //牛查重
                var enterPromise = new model.Cattle({cattleCoding: cattleCoding}).fetch();
                enterPromise.then(function (model_fetch) {
                    if (model_fetch) {
                        var enterPeriod = model_fetch.get('period');
                        //判断牛是否在一个时间段内重复进入，一个时间段内则为卡门上了
                        if (period === enterPeriod) {
                            res.json({success: false, errorMessage: '此牛重复！未写入数据库！'});
                        } else if(period !== -1 || period !== '-1') {
                            new model.Cattle({
                                cattleCoding: cattleCoding,
                                enterDate: nowTime,
                                period: period,
                                today: nowTime.getDate(),
                                month: nowTime.getMonth() + 1,
                                pastureId: pastureId
                            }).save().then(function (model_save) {
                                res.json({success: true});
                            });
                        }
                    } else {
                        new model.Cattle({
                            cattleCoding: cattleCoding,
                            enterDate: nowTime,
                            period: period,
                            today: nowTime.getDate(),
                            month: nowTime.getMonth() + 1,
                            pastureId: pastureId
                        }).save().then(function (model_save) {
                            res.json({success: true});
                        });
                    }
                });
            }
        });
    });
    //var cattleCoding = req.body.cattleCoding;
    //var pastureId = req.body.pastureId;
});

//牛出栏api
router.post('/cattleLeave', function(req, res, next) {
    var data = req.body.data;
    //var cattleCoding = req.body.cattleCoding;
    //var pastureId = req.body.pastureId;
    getEPC(data, function(EPC) {
        var cattleCoding = EPC;
        var pastureId = EPC.substring(0, 6);
        var nowTime = new Date();
        getNowPeriod(nowTime, function (err, period) {
            if (err) {
                res.json({success: false, errorMessage: err});
            } else  if(period !== -1 || period !== '-1') {
                //牛出入栏异常检测
                var enterPromise = model.Cattle.query({
                    where: {
                        today: nowTime.getDate(),
                        cattleCoding: cattleCoding,
                        pastureId: pastureId,
                        period: period
                    }
                }).fetch();
                enterPromise.then(function (model_fetch) {
                    console.log(model_fetch);
                    if (model_fetch) {
                        var cattleId = model_fetch.get('id');
                        var enterDate = model_fetch.get('enterDate');
                        var duration = nowTime.getMinutes() - enterDate.getMinutes();
                        new model.Cattle({id: cattleId}).save({
                            leaveDate: nowTime,
                            duration: duration
                        }).then(function (model_save) {
                            new model.Cattle().where({
                                cattleCoding: cattleCoding,
                                period: period
                            }).save({
                                leaveDate: nowTime,
                                duration: duration
                            }, {patch: true}).then(function (model_save) {
                                res.json({success: true});
                            }).catch(function(err) {
                                res.json({success: false, errorMessage: err.message});
                            });
                        })
                    } else {
                        res.json({success: false, errorMessage: '这牛没进来，飞来的？'});
                    }
                });
            }
        });
    });
});

router.post('/milkUpload', function(req, res, next) {
    var data = req.body.data;
    console.log(data);
    getEPC(data, function(EPC, production) {
        console.log(production);
        var pastureId = EPC.substring(0, 6);
        var uploadDate = new Date();
        var month = uploadDate.getMonth() + 1;
        var day = uploadDate.getDate();
        //计算一年中的第几个星期
        getWeek(uploadDate, function(week) {
            new model.Milk().save({
                production: production,
                pastureID: pastureId,
                uploadDate: uploadDate,
                month: month,
                day: day,
                week: week
            }).then(function(model_fetch) {
                res.json({ success: true});
            });
        });
    });
    //var production = req.body.production;
    //var pastureId = req.body.pastureId;
});

//获取页面
router.get('/', function(req, res, next) {
    res.redirect(303, '/showCattle');
});

router.get('/showCattle', function(req, res, next) {
    var pastureId = '';
    var month;
    var day;
    var period;
    if(url.parse(req.url, true).query.pastureId === undefined) {
        pastureId = '019067';
    } else {
        pastureId = url.parse(req.url, true).query.pastureId;
    }
    if(url.parse(req.url, true).query.month === undefined) {
        month = new Date().getMonth() + 1;
    } else {
        month = url.parse(req.url, true).query.month
    }
    if(url.parse(req.url, true).query.day === undefined) {
        day = new Date().getDate();
    } else {
        day = url.parse(req.url, true).query.day
    }
    if(url.parse(req.url, true).query.period === undefined) {
        period = '1';
    } else {
        period = url.parse(req.url, true).query.period
    }
    var queryPromise = model.knex('cattle').where({
        pastureId: pastureId,
        month: month,
        today: day,
        period: period
    }).distinct('cattleCoding').select('id', 'enterDate', 'leaveDate', 'duration', 'period', 'today', 'month', 'pastureId');
    queryPromise.then(function(model_query) {
        console.log(model_query);
        if(model_query[0] !== undefined) {
            console.log(model_query);
            res.render('showCattle', { title: 'demo', info: 'noInfo',cattleList: model_query});
        } else {
            console.log('111');
            res.render('showCattle', { title: 'demo', info: '牧场或者这个日子或者这个时间段没有牛耶'});
        }
    });
});

router.get('/milkProduction', function(req, res, next) {
    var pastureId = '';
    var month;
    var day;
    var week;
    var token;
    if(url.parse(req.url, true).query.pastureId === undefined) {
        pastureId = '019067';
    } else {
        pastureId = url.parse(req.url, true).query.pastureId;
    }
    if(url.parse(req.url, true).query.month === undefined) {
        month = new Date().getMonth() + 1;
    } else {
        month = url.parse(req.url, true).query.month;
        token = 1;
    }
    if(url.parse(req.url, true).query.week === undefined) {
        getWeek(new Date(), function(Week) {
            week = Week;
        })
    } else {
        week = url.parse(req.url, true).query.week;
        token = 2;
    }
    if(url.parse(req.url, true).query.day === undefined) {
        day = new Date().getDate();
    } else {
        day = url.parse(req.url, true).query.day;
        token = 3;
    }
    if(token === 1) {
        var queryPromise = model.Milk.query({ where: { month: month,pastureId: pastureId}}).query();
        queryPromise.then(function(model_query) {
            if(model_query[0] !== undefined) {
                console.log(model_query);
                res.render('production', { title: 'demo', info: 'noInfo', productionList: model_query, token: token});
            } else {
                res.render('production', { title: 'demo', info: '暂无数据', token: token});
            }
        });
    } else if(token === 2) {
        var queryPromise = model.Milk.query({ where: { week: week,pastureId: pastureId}}).query();
        queryPromise.then(function(model_query) {
            if(model_query[0] !== undefined) {
                console.log(model_query);
                res.render('production', { title: 'demo', info: 'noInfo', productionList: model_query, token: token});
            } else {
                res.render('production', { title: 'demo', info: '暂无数据', token: token});
            }
        });
    } else if(token === 3) {
        var queryPromise = model.Milk.query({ where: { day: day,month: month,pastureId: pastureId}}).query();
        queryPromise.then(function(model_query) {
            if(model_query[0] !== undefined) {
                console.log(model_query);
                res.render('production', { title: 'demo', info: 'noInfo', productionList: model_query, token: token});
            } else {
                res.render('production', { title: 'demo', info: '暂无数据', token: token});
            }
        });
    } else {
        var queryPromise = model.Milk.query({ where: { day: day, week: week,month: month,pastureId: pastureId}}).query();
        queryPromise.then(function(model_query) {
            if(model_query[0] !== undefined) {
                console.log(model_query);
                res.render('production', { title: 'demo', info: 'noInfo', productionList: model_query, token: token});
            } else {
                res.render('production', { title: 'demo', info: '暂无数据', token: token});
            }
        });
    }
});

//按指定日期查询奶量
router.get('/milkProductionCustomize', function(req, res, next) {
    var pastureId = '';
    var dateStart = new Date(url.parse(req.url, true).query.dateStart);
    var dateEnd = new Date(url.parse(req.url, true).query.dateEnd);
    var token = 3;
    if(url.parse(req.url, true).query.pastureId === undefined) {
        pastureId = '019067';
    } else {
        pastureId = url.parse(req.url, true).query.pastureId;
    }
    dateStart.setHours(dateStart.getHours() + dateStart.getTimezoneOffset() / 60);//消除时区不同带来的8小时时差
    dateEnd.setHours(dateEnd.getHours() + dateEnd.getTimezoneOffset() / 60);
    model.Milk.query(function(qb) {
        qb.where('uploadDate', '<', dateEnd).andWhere('uploadDate', '>', dateStart).andWhere('pastureId', '=', pastureId);
    }).query().then(function(model_query) {
        if(model_query[0] !== undefined) {
            console.log(model_query);
            res.render('production', { title: 'demo', info: 'noInfo', productionList: model_query, token: token});
        } else {
            res.render('production', { title: 'demo', info: '暂无数据', token: token});
        }
    });
});

function getNowPeriod(nowTime, callback) {
    var nowHours = nowTime.getHours();
    var period = '0';
    if(nowHours >= 4 && nowHours <= 12) {
        period = '1';
        callback(null, period);
    } else if(nowHours >= 14 && nowHours <= 20) {
        period = '2';
        callback(null, period);
    } else if(nowHours >= 22 && nowHours <= 24) {
        period = '3';
        callback(null, period);
    } else if(nowHours >= 0 && nowHours <= 2) {
        period = '3';
        callback(null, period);
    } else {
        period = '-1';
        callback('非正常时间！请检查牛棚！', period);
    }
}

function getWeek(date, callback) {
    var time,week,checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    week=Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    callback(week);
}

function getEPC(data, callback) {
    var length_16 = data.substring(10, 14);
    var length_10 = parseInt(length_16, 16);
    var EPC = data.substring(14, 14 + length_10 * 2);
    var production_16 = EPC.substring(6);
    getProduction(production_16, function(production) {
        callback(EPC, production);
    });
}

function getProduction(production_16, callback) {
    var char = '';
    var production = '';
    for(var num = 0; num < production_16.length; num = num + 2) {
        char = production_16[num] + production_16[num+1];
        production += asc[char];
    }
    callback(production);
}

module.exports = router;
