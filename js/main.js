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
    layerScroll: 'app/layerScroll'
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
  'init'
  ], function($, require, doc, init) {
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
    // 生成图层树结构
    require([
      'config',
      'zTree'
    ], function(config) {
      config.util.zTreeObj = $.fn.zTree.init($("#layerTree"), config.setting, 
        config.cmsLayer.nodes);
    });
});