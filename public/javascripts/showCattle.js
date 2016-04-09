$(document).ready(function() {

  // 初始化
  //-------

  // 获取元素
  var $datetimepicker = $('#datetimepicker');
  var $period = $('#period');
  var $pasture = $('#pasture');

  // 页面跳转函数
  var go = function() {
    var value = $datetimepicker.val();
    var date = new Date(value);
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var url = window.url;
    var pastureId = $pasture.val();
    var period = $period.val();

    if(period === '请选择时间段'){
      window.location.href = url + '?pastureId=' + pastureId
          + '&month=' + month + '&day=' + day + '&period=' + '1';
    } else {
      window.location.href = url + '?pastureId=' + pastureId
          + '&month=' + month + '&day=' + day + '&period=' + period;
    }

  };

  // 前端补零函数
  var fillZero = function(number) {
    return number.toString().length < 2 ? '0' + number : number;
  };

  $('#refreshData').click(function() {
    var url = document.URL;
    window.location.href = url;
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
   $pasture.on('change', go);

  // 日期选择
  //---------

  // 获取日期
  var date = new Date();
  var year = date.getFullYear();
  var month = window.month || date.getMonth() + 1;
  var day = window.day || date.getDate();

  // 初始化日期选择框的值
  var initValue = '' + year + '-' + fillZero(month) + '-' + fillZero(day);
  $datetimepicker.val(initValue);

  // 实例化日期选择器
  $datetimepicker.datetimepicker({
    language: 'zh-CN',
    format: 'yyyy-mm-dd',
    autoclose: true,
    minView: 2,
    maxView: 3,
    endDate: new Date()
  });

  // 监听日期选择的值
 // $datetimepicker.on('change', go);


  // 时间段选择
  //-----------

  // 显示后台提供的时间段信息
  var period = parseInt(window.period, 10);
  switch(period) {
    case 0:
      $period.children().eq(0).attr('selected', 'selected');
      break;
    case 1:
      $period.children().eq(1).attr('selected', 'selected');
      break;
    case 2:
      $period.children().eq(2).attr('selected', 'selected');
      break;
    case 3:
      $period.children().eq(3).attr('selected', 'selected');
      break;
    default:
      $period.children().eq(0).attr('selected', 'selected');
      break;
  }

  // 监听时间选择的值
  $period.on('change', go);

  var $exportLink = document.getElementById('export');
        $exportLink.addEventListener('click', function(e){
          e.preventDefault();
            tableExport('cattleList', '导出数据', e.target.getAttribute('data-type'));
        }, false);

});
