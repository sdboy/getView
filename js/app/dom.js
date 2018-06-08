'use strict';

define([
  'config',
  'init'
], function(config, init) {
  var domObj = {
    'domLayer': null,
    'domState': true
  };

  var loadDom = function(mapObj, domUrl, range, minLevel, maxLevel) {
    domObj.domLayer = mapObj.loadDOM(domUrl, range, minLevel, maxLevel);
  };

  var removeDom = function(mapObj, layer) {
    if(layer) {
      mapObj.removelayer(layer);
      domObj.domLayer = null;
    }
  };

  var showHide = function(mapObj) {
    if(domObj.domState) {
      mapObj.hidelayer(domObj.domLayer);
      domObj.domState = false;
    }else {
      mapObj.showlayer(domObj.domLayer);
      domObj.domState = true;
    }
  };

  return {
    loadDom: loadDom,
    removeDom: removeDom,
    showHide: showHide
  };
  
});