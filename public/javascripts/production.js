$(document).ready(function() {

  // 初始化
  //-------

  // 获取元素
  var $timeRange = $('#timeRange');
    var $pasture = $('#pasture');
    var $datetimepickerStart = $('#datetimepickerStart');
    var $datetimepickerEnd = $('#datetimepickerEnd');
    var $timeLabels = $('[data-value = "time"]');

  // 前端补零函数
  var fillZero = function(number) {
    return number.toString().length < 2 ? '0' + number : number;
  };


  // 获取一年中的第几周
  function getWeek() {
    var time,week,checkDate = new Date();
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    week=Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    return week;
  }

  // 时间范围选择
  //-------------

  // 初始化时间范围选择的选中项
  if(window.dateStart != null && window.dateEnd != null) {
      $timeRange.children().eq(4).attr('selected', 'selected');
      $timeLabels.show();
      $datetimepickerStart.show();
      $datetimepickerEnd.show();
  } else if(window.week != null) {
    $timeRange.children().eq(2).attr('selected', 'selected');
  } else if(window.month != null) {
    $timeRange.children().eq(3).attr('selected', 'selected');
  } else if(window.day != null){
    $timeRange.children().eq(1).attr('selected', 'selected');
  } else {
      $timeRange.children().eq(0).attr('selected', 'selected');
  }

  // 监听时间范围选择框的值
  $timeRange.on('change', function() {
    var val = $timeRange.val();
      var pastureId = $pasture.val();
    // 如果选择到 **自定义时间**，则显示日期选择框
    if(val === 'custom') {
        $timeLabels.show();
        $datetimepickerStart.show();
        $datetimepickerEnd.show();
    } else {
      switch(val) {
        case 'tody':
          window.location.href = window.url + '?pastureId=' + pastureId +
            '&day=' + (new Date()).getDate();
          break;
        case 'week':
          window.location.href = window.url + '?pastureId=' + pastureId +
            '&week=' + getWeek();
          break;
        case 'month':
          window.location.href = window.url + '?pastureId=' + pastureId +
            '&month=' + ((new Date()).getMonth() + 1);
          break;
      }
        $timeLabels.hide();
        $datetimepickerStart.hide();
        $datetimepickerEnd.hide();
    }
  });

    // 牧场选择
    //---------

    // 显示后台提供的牧场信息
    var pasture = window.pastureId;
    switch(pasture) {
        case '019067':
            $pasture.children().eq(1).attr('selected', 'selected');
            break;
        case '016533':
            $pasture.children().eq(2).attr('selected', 'selected');
            break;
        case '017104':
            $pasture.children().eq(3).attr('selected', 'selected');
            break;
        case '020678':
            $pasture.children().eq(4).attr('selected', 'selected');
            break;
        case '024447':
            $pasture.children().eq(5).attr('selected', 'selected');
            break;
        default:
            $pasture.children().eq(0).attr('selected', 'selected');
            break;
    }

    // 监听牧场选择的值
    $pasture.on('change', function() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var url = window.url;
        var pastureId = $pasture.val();

        window.location.href = url + '?pastureId=' + pastureId
            + '&month=' + month;
    });


    // 日期选择
    //---------

    // 获取当前日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var initValueStart;
    var initValueEnd;

    // 初始化日期选择框的值为当前时间
    if(window.dateStart === null) {
        initValueStart = '' + year + '-' + fillZero(month) + '-' + fillZero(day);
    } else {
        var dateStart = new Date(window.dateStart);
        initValueStart = '' + dateStart.getFullYear() + '-' + fillZero(dateStart.getMonth()+1) + '-' + fillZero(dateStart.getDate());
    }
    if(window.dateEnd  === null) {
        initValueEnd = '' + year + '-' + fillZero(month) + '-' + fillZero(day);
    } else {
        var dateEnd = new Date(window.dateEnd);
        initValueEnd = '' + dateEnd.getFullYear() + '-' + fillZero(dateEnd.getMonth()+1) + '-' + fillZero(dateEnd.getDate()-1);
    }

    $datetimepickerStart.val(initValueStart);
    $datetimepickerEnd.val(initValueEnd);

    // 实例化日期选择器
    $datetimepickerStart.datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: 2,
        maxView: 3,
        endDate: new Date()
    });
    $datetimepickerEnd.datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: 2,
        maxView: 3,
        endDate: new Date()
    });

    // 监听日期选择的值
    /*$datetimepickerStart.on('change', function() {
        var valueStart = $datetimepickerStart.val();
        var valueEnd = $datetimepickerEnd.val();
        var dateStart = new Date(valueStart);
        var monthStart = dateStart.getMonth() + 1;
        var dayStart = dateStart.getDate();

        var dateEnd = new Date(valueEnd);
        var monthEnd = dateEnd.getMonth() + 1;
        var dayEnd = dateEnd.getDate();

        var url = window.url;
        var pastureId = window.pastureId;

        window.location.href = url + 'Customize' + '?dateStart=' + dateStart +
                '&dateEnd=' + dateEnd + '&pastureId=' + pastureId;
    });*/
    $datetimepickerEnd.on('change', function() {
        var valueStart = $datetimepickerStart.val();
        var valueEnd = $datetimepickerEnd.val();
        var dateStart = new Date(valueStart);

        var dateEnd = new Date(valueEnd);
	dateEnd.setDate(dateEnd.getDate() + 1);

        var url = window.url;
        var pastureId = window.pastureId;

        window.location.href = url + 'Customize' + '?dateStart=' + dateStart +
            '&dateEnd=' + dateEnd + '&pastureId=' + pastureId;
    });


  // 画图
  //-----
    if(window.token === '1') {
        var myChart = echarts.init(document.getElementById('chart'));
        var option = {
            legend: {
                data:['最近一月产奶量与时间变化关系']
            },
            toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
            },
            calculable : true,
            tooltip : {
                trigger: 'axis'
                //formatter: "产奶量：{c} 千克时间: {b} 号"
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine : {onZero: false},
                    axisLabel : {
                        formatter: '{value}'
                    },
                    boundaryGap : false,

                    // 横坐标的值，时间
                    data : window.uploadDate
                }
            ],
            yAxis : [
                {
                    type : 'value',
		    name: '单位：千克',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:'产奶量',
                    // 纵坐标的值，产奶量
                    data: window.production,
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                shadowColor : 'rgba(0,0,0,0.4)'
                            }
                        }
                    }
                }
            ]
        };
    }
    else if(window.token === '2') {
        var myChart = echarts.init(document.getElementById('chart'));
        var option = {
            legend: {
                data:['最近一周产奶量与时间变化关系']
            },
            toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
            },
            calculable : true,
            tooltip : {
                trigger: 'axis'
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine : {onZero: false},
                    axisLabel : {
                        formatter: '{value}'
                    },
                    boundaryGap : false,

                    // 横坐标的值，时间
                    data : window.uploadDate
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name: '单位：千克',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:'产奶量',
                    // 纵坐标的值，产奶量
                    data: window.production,
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                shadowColor : 'rgba(0,0,0,0.4)'
                            }
                        }
                    }
                }
            ]
        };
    }
    else if(window.token === '3') {
        var myChart = echarts.init(document.getElementById('chart'));
        var option = {
            legend: {
                data:['产奶量与自选时间变化关系']
            },
            toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
            },
            calculable : true,
            tooltip : {
                trigger: 'axis'
            },
            xAxis : [
                {
                    type : 'category',
                    axisLine : {onZero: false},
                    axisLabel : {
                        formatter: '{value}'
                    },
                    boundaryGap : false,

                    // 横坐标的值，时间
                    data : window.uploadDate
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name: '单位：千克',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:'产奶量',
                    // 纵坐标的值，产奶量
                    data: window.production,
                    type:'line',
                    smooth:true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                shadowColor : 'rgba(0,0,0,0.4)'
                            }
                        }
                    }
                }
            ]
        };
    }
  myChart.setOption(option);

  // 当 window 尺寸改变的时候，图表尺寸也改变
  $(window).resize(function() {
    myChart.resize();
  });


    $('#refreshData').click(function() {
        var url = document.URL;
        window.location.href = url;
    })

});
