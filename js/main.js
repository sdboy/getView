'use strict';

require.config({
  baseUrl : './js',
  paths : {
    init : 'app/init',
    async : 'lib/require/async',
    domReady : 'lib/require/domReady',
    text : 'lib/require/text',
    jquery : 'lib/jquery/jquery-1.11.3',
    Map3D : 'lib/coorun/Map3D',
    CooMap : 'lib/coorun/Class',
    Util : 'lib/coorun/Util',
    zTree : 'lib/ztree/jquery.ztree.all',
    underscore : 'lib/underscore/underscore',
    jqueryUI : 'lib/jquery_ui/jquery-ui',
    slimScroll : 'lib/jquery_slimScroll/jquery.slimscroll',
    config : 'app/config',
    layerScroll: 'app/layerScroll',
    layerManage: 'app/layerMange',
    getPosInfo: 'app/getPosInfo',
    dom: 'app/dom'
  },
  shim: {
    'Map3D': {
      deps: ['CooMap', 'Util'],
      exports: 'Map3D'
    },
    'zTree': {
      deps: ['jquery']
    },
    'jqueryUI': {
      deps: ['jquery']
    },
    'slimScroll': {
      deps: ['jquery']
    }
  }
    
});
require([
  'jquery',
  'require',
  'domReady!',
  'init',
  'config',
  'getPosInfo'
  ], function($, require, doc, init, config, getPosInfo) {
    // 给地图图层列表配置滚动效果
    require([
      'layerScroll'
    ], function(layerScroll) {
      var toolBarHeight = $('#toolBar').height();
      var scrollWidth = $('#mapTree').width();
      var scrollHeight = document.body.offsetHeight - toolBarHeight;
      layerScroll.setScroll('mapTree', scrollHeight, scrollWidth);
    });
    // 初始化地图
    init.initialize("map");
    var map = init.map.mapObj;
    require([
      'dom'
    ], function(dom) {
      var domUrl = config.util.cmsUrl + config.dom.domUrl;
      dom.loadDom(map, domUrl, config.dom.range, config.dom.minLevel, 
        config.dom.maxLevel);
      map.flyPosition(config.fullMap.lon, config.fullMap.lat, 
        config.fullMap.height, config.fullMap.azimuth, 
        config.fullMap.pitch, config.fullMap.range, 
        config.fullMap.time);
      $('#operateDom').click(function() {
        dom.showHide(map);
      });
    });
    
    $('#flyPosition').click(function() {
      map.flyPosition(config.fullMap.lon, config.fullMap.lat, 
        config.fullMap.height, config.fullMap.azimuth, 
        config.fullMap.pitch, config.fullMap.range, 
        config.fullMap.time);
        // map.flyPosition(120.31791641,31.54163971,0.2,3.6475,-0.71366,26.8669,2);
    });

    $('#position').click(function() {
      if($(this)[0].checked) {
        getPosInfo.getPointInfo('model');
      }else {
        getPosInfo.cancleGetPoint();
      }
    });
    $('#getLabelInfo').click(function() {
      var viewState = $('#view')[0].checked;
      var posState = $('#position')[0].checked;
      getPosInfo.editLabel(posState, viewState);
    });

    $('#cancleGet').click(function() {
      getPosInfo.cancleGetPoint();
      $('#position')[0].checked = false;
      $('#view')[0].checked = false;
    });
    $('#clearTable').click(function() {
      var tdArr = $('#resultList').children('td');
      for(var i = 0; i < tdArr.length; i++) {
        $(tdArr[i]).html('');
      }
    });
    // 生成图层树结构
    require([
      'config',
      'zTree'
    ], function(config) {
      config.util.zTreeObj = $.fn.zTree.init($("#layerTree"), config.setting, 
        config.cmsLayer.nodes);
    });
});