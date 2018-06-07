"use strict";
/**
 * 地图初始化模块，初始化三维地图
 */
define([
  'config',
  'Map3D'
],function(config) {
    var map = {
      mapObj : null
      // SDKevent : null
    };
    /**
     * 初始化三维地图
     * @method initialize
     * @author jg
     * @param { String } contentId 三维容器dom的id
     * @return { Null }
     * @version V1.0.0
     */
    var initialize = function(contentId) {
      map.mapObj = new CooMap.Map3D({
        id : contentId,
        width: '100%',
			  height: '100%'
      });
      map.mapObj.getLicence(config.util.licenceIP);
      // 获取SDK路径
      var path = map.mapObj.getSDKPath(); 
      config.util.SDKpath = path.substring(0, path.length - 4).
        replace(/\\/g, "\\\\");
    };
    return {
      initialize : initialize,
      map : map
    };
  }
);