'use strict';

define([
  'require',
  'jquery',
  // 'init',
  // 'config'
], function(require, $) {
  var layerObj = {
    'modelLayers': {},
    'cameraLayers': {},
    'respObj': null
  };
  /**
   * 添加移除图层
   * @method pickCall
   * @author jg
   * @param { Number } x 屏幕x坐标
   * @param { Number } y 屏幕y坐标
   * @return { Null }
   * @version V1.0.0
   */
  var pickCall = function(x, y) {
    /*jshint maxcomplexity:2 */
    var str = layerObj.respObj.GetResponserResult().
      GetConfigValueByKey("PickPointList");
    var indexCode = layerObj.respObj.GetResponserResult().
      GetConfigValueByKey("PickName");
    if(indexCode !== null && indexCode !== undefined && indexCode !== '') {
      // TODO 放到页面上
      $('#indexCode').html(indexCode);
    }
  };
  /**
   * 添加移除图层
   * @method showHide
   * @author jg
   * @param { Object } event 事件对象
   * @param { Number } treeId  操作的节点domid
   * @param { Object } treeNode 操作的ztree节点对象
   * @return { Null }
   * @version V1.0.0
   */
  var showHide = function(event, treeId, treeNode) {
    /*jshint maxcomplexity:5 */
    var curNodeId = null;
    var url = '';
    var layers = [];
    if(treeNode.modelUrl !== null && treeNode.modelUrl !== "" &&
      treeNode.modelUrl !== undefined ){
      curNodeId = treeNode.sid;
      require([
        'config',
        'init'
      ], function(config, init) {
        url  = config.util.cmsUrl + '/' + treeNode.modelUrl;
        if(treeNode.checked === true){
          layerObj.modelLayers['model'+curNodeId] = init.map.mapObj.loadC3S(url);
        }else{
          init.map.mapObj.removelayer(layerObj.modelLayers['model' + curNodeId]);
          delete layerObj.modelLayers['model' + curNodeId];
        }
      });
      
    }
    if(treeNode.cameraUrl !== null && treeNode.cameraUrl !== "" &&
      treeNode.cameraUrl !== undefined ){
      curNodeId = treeNode.sid;
      require([
        'config',
        'init'
      ], function(config, init) {
        url  = config.util.cmsUrl + '/' + treeNode.cameraUrl;
        if(treeNode.checked === true){
          layerObj.cameraLayers['cam'+curNodeId] = init.map.mapObj.loadC3S(url);
          for(var key in layerObj.cameraLayers) {
            var layer = layerObj.cameraLayers['' + key];
            if(layer !== null) {
              layers.push(layer);
            }
          }
          layerObj.respObj = init.map.mapObj.pickLineOpen(layers);
          // 重新添加监听事件
          init.map.mapObj.delEvent('FireOnResponserNotify', pickCall);
          init.map.mapObj.addEvent('FireOnResponserNotify', pickCall);
        }else{
          init.map.mapObj.removelayer(layerObj.cameraLayers['cam' + curNodeId]);
          delete layerObj.cameraLayers['cam' + curNodeId];
        }
      });
      
    }
  };
  
  /**
   * 图层定位
   * @method flyToLayer
   * @author jg
   * @param { Object } event 事件对象
   * @param { Number } treeId  操作的节点domid
   * @param { Object } treeNode 操作的ztree节点对象
   * @return { Null }
   * @version V1.0.0
   */
  var flyToLayer = function(event, treeId, treeNode) {
    /*jshint maxcomplexity:2  */
    var curNodeId = treeNode.sid;
    if(treeNode.checked === true && layerObj.modelLayers['model'+curNodeId]) {
      layerObj.modelLayers['model'+curNodeId].Locate();
    }
  };

  return {
    layerObj: layerObj,
    showHide: showHide,
    flyToLayer: flyToLayer,
    pickCall: pickCall
  };
  
});