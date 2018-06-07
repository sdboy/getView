'use strict';

define([
  'jquery',
  'slimScroll'
], function($) {
  /**
   * 设置dom容器滚动
   * @method setScroll
   * @author jg
   * @param { String } domId 要设置滚动的dom的id
   * @param { Number } height dom的高度
   * @param { Number } width dom的宽度
   * @return { Null }
   * @version V1.0.0
   */
  var setScroll = function(domId, height, width) {
    $('#' + domId).slimscroll({
      height: height + 'px',
      width: width + 'px'
    });
  };
  return {
    setScroll: setScroll
  };
});