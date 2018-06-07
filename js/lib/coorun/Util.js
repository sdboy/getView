"use strict";
var Util = ({
  "getRkey" : function(){
    return "CODEID_" + (this._CLASS_CODE_++).toString(24);
  },
  "each" : function(FunArray, Fun) {
    /*jshint maxcomplexity:8 */
    if (typeof Fun !== "function") {
      return FunArray;
    }
    if (FunArray) {
      if (FunArray.length === undefined) {
        for (var i in FunArray) {
          //xinyu.li,加入返回false跳出循环
          if(Fun.call(FunArray[i], FunArray[i], i) === false){break;};
        }
      } else {
        for (var j = 0, ak = FunArray.length; j < ak; j++) {
          //xinyu.li,加入返回false跳出循环
          if(Fun.call(FunArray[j], FunArray[j], j) === false){
            break;
          }
        }
      }
    }
    return FunArray;
  },
  "inherit" : function(basic, applyClass, className) {
    /*jshint maxcomplexity:3 */
    var tempObject = basic.prototype;
    var fun = function() {};
    fun.prototype = applyClass.prototype;
    var proClass = basic.prototype = new fun();
    if (typeof className === "string") {
        proClass._className = className;
    }
    for (var i in tempObject) {
        proClass[i] = tempObject[i];
    }
    basic.prototype.constructor = tempObject.constructor;
    tempObject = null;
    return proClass;
  },

  "copy" : function(dest) {
    /*jshint maxcomplexity:4 */
    //获取除第一项外的参数数组
    var sources = Array.prototype.slice.call(arguments, 1);
    //循环继承对象
    for (var j = 0, len = sources.length, src; j < len; j++) {
      src = sources[j] || {};
      for (var i in src) {
        //写入（含覆盖）目标对象
        dest[i] = src[i];
      }
    }
    //返回目标对象
    return dest;
  },
  // merge src properties into dest
  "extend" : function ( dest)  {	
    //获取除第一项外的参数数组
    var sources = Array.prototype.slice.call(arguments, 1);
    //循环继承对象
    for (var j = 0, len = sources.length, src; j < len; j++) {
      src = sources[j] || {};
      for (var i in src) {
        //如果含有非继承对象属性
        if (src.hasOwnProperty(i)) {
          //写入（含覆盖）目标对象
          dest[i] = src[i];
        }
      }
    }
    //返回目标对象
    return dest;
  },
  // (Function, Object) -> Function
  "bind": function (fn, obj) { 
    var args = arguments.length > 2 ? 
      Array.prototype.slice.call(arguments, 2) : null;
    return function () {
      /*jshint maxcomplexity:2 */
      return fn.apply(obj, args || arguments);
    };
  },
  "splitWords": function (str) {
    return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
  },
  "toString" :  function(){
    return "Util";
  },
  "classkey": (function () {
    //_mapClass_id
    var lastId = 0, key = 'id'; 
    return function (obj) {
      /*jshint maxcomplexity:2 */
        obj[key] = obj[key] || Util.getRkey();
        return obj[key];
    };
  }()),
  "pageSize":function(obj){
    /*jshint maxcomplexity:5 */
    return new CooMap["Size"](obj.clientWidth || document.body.clientWidth,
        (obj.clientHeight || (CooMap.Browser.ie ? 
          (document.compatMode === "CSS1Compat" ? 
            document.documentElement.clientHeight : 
            document.body.clientHeight) : obj.innerHeight))
    );
  },
  "userSelect":function(node){
    /*jshint maxcomplexity:8 */
    //webkit[chrome,safari]
    if('WebkitUserSelect' in document.documentElement.style){
      node.style.WebkitUserSelect = "none";
      //moz
    }else if('MozUserSelect' in document.documentElement.style){
      node.style.MozUserSelect = "none";
      //opera
    }else if('OUserSelect' in document.documentElement.style){
      node.style.OUserSelect = "none";
      //ie9
    }else if('msUserSelect' in document.documentElement.style){
      node.style.msUserSelect = "none";
    }else{//not support transform
      node.unselectable = "on";
    }
  },

  "$" : function() {
    /*jshint maxcomplexity:8 */
    for (var i = [], args = arguments.length - 1; args > -1; args--) {
      var object = arguments[args];
      i[args] = null;
      if (typeof object === "object" && object && object.dom) {
        i[args] = object.dom;
      } else {
        if ((typeof object === "object" && object && object.tagName) || 
          object === window || object === document) {
          i[args] = object;
        } else {
          if (typeof object === "string" && 
            (object = document.getElementById(object))) {
            i[args] = object;
          }
        }
      }
    }
    return i.length < 2 ? i[0] :i;
  },

  "createDom" : function(eleType, eleName) {
    /*jshint maxcomplexity:3 */
    if (CooMap.Browser.ie && eleName && eleName.name) {
      eleType = "<" + eleType + ' name="' + 
        String.escapeHTML(eleName.name) + '">';
    }
    var ele = document.createElement(eleType);
    if (eleName) {
      CooMap.Util.setProperties(ele, eleName);
    }
    return ele;
  },

  "setProperties" : function(ele, eleName) {
    CooMap.Util.each(eleName,  function(ak, aj) {
      CooMap.Util._setProperty(ele, aj, ak);
    });
  },

  _setProperty : function(ele, eleName, name) {
    if (eleName === "style") {
      ele.style.cssText = name;
    } else {
      if (eleName === "class") {
        ele.className = name;
      } else {
        if (eleName === "for") {
          ele.htmlFor = name;
        } else {
          if (eleName in CooMap.Util._DIRECT_ATTRIBUTE_MAP) {
            ele.setAttribute(CooMap.Util._DIRECT_ATTRIBUTE_MAP[eleName], name);
          } else {
            ele[eleName] = name;
          }
        }
      }
    }
  },

  "getOwnerDocument" : function(ele) {
    /*jshint maxcomplexity:3 */
    return ele.nodeType === 9 ? ele: ele.ownerDocument || ele.document;
  },

  "getOffset" : function(ele) {
    /*jshint maxcomplexity:14 */
    var doc = Util.getOwnerDocument(ele);
    var absPostion = CooMap.Browser.gecko > 0 && doc.getBoxObjectFor && 
      Util.getStyle(ele, "position") === "absolute" && (ele.style.top === "" || 
      ele.style.left === "");
    var location = {
      left: 0,
      top: 0
    };
    var boxDoc = (CooMap.Browser.ie && !CooMap.Browser.isStrict) ? 
      doc.body: doc.documentElement;
    if (ele === boxDoc) {
      return location;
    }
    var object = null;
    var boundRect;
    if (ele.getBoundingClientRect) {
      boundRect = ele.getBoundingClientRect();
      location.left = boundRect.left + 
        Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
      location.top = boundRect.top + 
        Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
      location.left -= doc.documentElement.clientLeft;
      location.top -= doc.documentElement.clientTop;
      if (CooMap.Browser.ie && !CooMap.Browser.isStrict) {
        location.left -= 2;
        location.top -= 2;
      }
    } else {
      if (doc.getBoxObjectFor && !absPostion) {
        boundRect = doc.getBoxObjectFor(ele);
        var boxScreen = doc.getBoxObjectFor(boxDoc);
        location.left = boundRect.screenX - boxScreen.screenX;
        location.top  = boundRect.screenY - boxScreen.screenY;
      } else {
        object = ele;
        do {
          location.left += object.offsetLeft;
          location.top += object.offsetTop;
          if (CooMap.Browser.webkit > 0 && 
            Util.getStyle(object, "position") === "fixed") {
            location.left += doc.body.scrollLeft;
            location.top += doc.body.scrollTop;
            break;
          }
          object = object.offsetParent;
        } while ( object && object !== ele );
        if (CooMap.Browser.oprea > 0 || (CooMap.Browser.webkit > 0 && 
          Util.getStyle(ele, "position") === "absolute")) {
          location.top -= doc.body.offsetTop;
        }
        object = ele.offsetParent;
        while (object && object !== doc.body) {
          location.left -= object.scrollLeft;
          if (!CooMap.Browser.oprea || object.tagName !== "TR") {
            location.top -= object.scrollTop;
          }
          object = object.offsetParent;
        }
      }
    }
    location.offsetX = location.left;
    location.offsetY = location.top;
    return location;
  },
  "addClass" : function(objects, styleName) {
    /*jshint maxcomplexity:8 */
    if (! (objects = Util.$(objects))) {
      return;
    }
    styleName = Util.trim(styleName);
    if (!new RegExp("(^| )" + styleName.replace(/(\W)/g, "\\$1") + 
      "( |$)").test(objects.className)) {
      objects.className = objects.className.split(/\s+/).concat(styleName).
        join(" ");
    }
  },

  "removeClass" : function(obj, styleName) {
    /*jshint maxcomplexity:3 */
    if (! (obj = Util.$(obj))) {
      return;
    }
    styleName = Util.trim(styleName);
    var style = obj.className.replace(new RegExp("(^| +)" + 
      styleName.replace(/(\W)/g, "\\$1") + "( +|$)", "g"), "$2");
    if (obj.className != style) {
      obj.className = style;
    }
  },

  "trim" : function(string) {
    return string.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "");
  },

  "show" : function() {
    Util.each(arguments, function(target) {
      /*jshint maxcomplexity:2 */
      if (target = Util.$(target)) {
        target.style.display = "";
      }
    });
  },

  "hide" : function() {
    Util.each(arguments, function(target) {
      /*jshint maxcomplexity:8 */
      if (target = Util.$(target)) {
        target.style.display = "none";
      }
    });
  },
  "isArray": function (obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
  }
});
CooMap["Util"] = Util;
CooMap["extend"] = Util["extend"];