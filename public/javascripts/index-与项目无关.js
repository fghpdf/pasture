$(document).ready(function() {

// 初始化
//-------

// 获取牧场编号
var pastureId = window.pastureId || 19067;

// 获取奶牛进出站信息链接
var showCattleUrl = 'http://115.159.79.110:6060/showCattle';

// 切换标签页
$('#tabs a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});


// 奶牛数量界面
//-------------

// 获取奶牛进出站信息
var showCattle = function(period) {
  period = period || "1";

  // 获取当前月份和日期
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  // 获取数据
  $.ajax({
    type: 'GET',
    url: showCattleUrl,
    data: {
      pastureId: pastureId,
      month: month,
      day: day,
      period: period
    },
    crossDomain: true,
    dataType: 'json',
    seccess: function(data, textStatus, jqXHR) {
      console.log(data);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
showCattle();


// 产奶量界面
//-----------
var myChart = echarts.init(document.getElementById('chart'));
var option = {
  legend: {
      data:['时间与产奶量变化关系']
  },
  toolbox: {
      show : false
  },
  calculable : true,
  tooltip : {
      trigger: 'axis',
      formatter: "Temperature : <br/>{b}km : {c}°C"
  },
  xAxis : [
    {
        type : 'category',
        axisLine : {onZero: false},
        axisLabel : {
            formatter: '{value} 时'
        },
        boundaryGap : false,
        data : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    }
  ],
  yAxis : [
    {
        type : 'value',
        axisLabel : {
            formatter: '{value} °C'
        }
    }
  ],
  series : [
      {
          name:'时间与产奶量变化关系',
          type:'line',
          smooth:true,
          itemStyle: {
              normal: {
                  lineStyle: {
                      shadowColor : 'rgba(0,0,0,0.4)'
                  }
              }
          },
          data:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
      }
  ]
}
myChart.setOption(option);

});
