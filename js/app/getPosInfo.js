'use strict';

define([
  'init',
], function(init) {

  var labelObj = {
    'position': null,
    'pick': false,
    'eventFun': false,
    'labelType': '',
    'labelProperties': {}
  };

  /**
   * 获取视角信息
   * @method addViewAngle
   * @author jg
   * @return { Object } 视角对象
   * @date 2018/5/19 21:36
   * @version V1.0.0
   */
  var addViewAngle = function () {
    var viewPoint = init.map.mapObj.getViewPoint();
    var viewArr = viewPoint.split(';');
    viewArr.pop();
    var viewAngle = {
      'viewLon': Number(Number(viewArr[0].split(':')[1].split(',')[0]).
      toFixed(8)),
      'viewLat': Number(Number(viewArr[0].split(':')[1].split(',')[1]).
      toFixed(8)),
      'viewHeight': Number(Number(viewArr[0].split(':')[1].split(',')[2]).
      toFixed(4)),
      'viewAzimuth': Number(Number(viewArr[2].split(':')[1]).toFixed(5)),
      'viewPitch': Number(Number(viewArr[3].split(':')[1]).toFixed(5)),
      'viewRange': Number(Number(viewArr[4].split(':')[1]).toFixed(4))
    };
    return viewAngle;
  };

  /**
   * 添加位置信息
   * @method addPosition
   * @author jg
   * @param { Number } x 屏幕x坐标
   * @param { Number } y 屏幕y坐标
   * @return { Null }
   * @date 2018/5/19 21:35
   * @version V1.0.0
   */
  var addPosition = function (x, y) {
    var labelPosition = {};
    labelObj.position = null;
    var pos = init.map.mapObj.coordTransformation(3, {screenX: x, screenY: y});
    var labelArr = pos.split(',');
    if('model' === labelObj.labelType) {
      // TODO 要获取位置参数
      labelPosition['labelLon'] = Number(Number(labelArr[0]).toFixed(8));
      labelPosition['labelLat'] = Number(Number(labelArr[1]).toFixed(8));
      labelPosition['labelHeight'] = Number(Number(labelArr[2]).toFixed(4));
      // labelPosition['labelYaw'] = 0;
      // labelPosition['labelRoll'] = 0;
      // labelPosition['labelPitch'] = 0;
    }else if('image' === labelObj.labelType) {
      labelPosition['labelLon'] = Number(Number(labelArr[0]).toFixed(8));
      labelPosition['labelLat'] = Number(Number(labelArr[1]).toFixed(8));
      labelPosition['labelHeight'] = Number(Number(labelArr[2]).toFixed(4));
    }else if('text' === labelObj.labelType) {
      labelPosition['labelLon'] = Number(Number(labelArr[0]).toFixed(8));
      labelPosition['labelLat'] = Number(Number(labelArr[1]).toFixed(8));
      labelPosition['labelHeight'] = Number(Number(labelArr[2]).toFixed(4));
    }
    labelObj.position = labelPosition;
  };

  /**
   * 添加标注
   * @method editLabel
   * @author jg
   * @param { String } operate 操作类型，update为更新，add为添加
   * @param { Boolean } getPosition true时会获取标注位置，false不会获取
   * @param { Boolean } getViewAngle true时会获取视角，false不会获取
   * @return { Null }
   * @date 2018/5/19 21:34
   * @version V1.0.0
   */
  var editLabel = function (operate, getPosition, getViewAngle) {
    var data = {};
    if(getViewAngle) {
      var viewAngle = addViewAngle();
      for(var key in viewAngle) {
        // TODO 展示到页面
        if(viewAngle['' + key] !== null && viewAngle['' + key] !== '' &&
          viewAngle['' + key] !== undefined) {
          $('#' + key).html(viewAngle['' + key]);
        }
      }
    }
    if(getPosition) {
      var position = labelObj.position;
      for(var item in position) {
        // 展示到页面
        if(position['' + item] !== null && position['' + item] !== '' &&
          position['' + item] !== undefined) {
            $('#' + item).html(position['' + item]);
        }
      }
    }

    init.map.mapObj.delEvent('FireOnLButtonUp', addPosition);
    labelObj.eventFun = false;
    labelObj.labelType = '';
  };
  /**
   * 添加获取坐标点事件
   * @method getPointInfo
   * @author jg
   * @param { String } type 获取数据类型，model为模型，text为文字，image为图片
   * @return { Null }
   * @date 2018/5/19 21:34
   * @version V1.0.0
   */
  var getPointInfo = function (type) {
    /*
     * 如果labelManage.labelObj.eventFun为true，
     * 说明左键点击监听已经开启，不需要再开启
     */
    if(!labelObj.eventFun) {
      init.map.mapObj.addEvent('FireOnLButtonUp', addPosition);
      labelObj.eventFun = true;
    }
    labelObj.labelType = type;
  };

  return {
    labelObj: labelObj,
    addViewAngle: addViewAngle,
    addPosition: addPosition,
    getPointInfo: getPointInfo,
    editLabel: editLabel
  };
  
});