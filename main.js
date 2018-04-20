(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ArkMainDialog, TAG_ASSETS, TAG_DEPOSIT, TAG_LONG_LOAN, TAG_RECEIVABLE, TAG_RETAINED_PROFITS, TAG_SHORT_LOAN, eventManager, eventNames;

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

TAG_ASSETS = "totalAssets";

TAG_RECEIVABLE = "receivables";

TAG_DEPOSIT = "depositReceived";

TAG_RETAINED_PROFITS = "retainedProfits";

TAG_SHORT_LOAN = "shortLoan";

TAG_LONG_LOAN = "longLoan";

ArkMainDialog = (function() {
  function ArkMainDialog() {}

  ArkMainDialog.prototype.onDidLoadFromCCB = function() {
    this._datTable = [];
    return this.init();
  };

  ArkMainDialog.prototype.init = function() {
    this._stockCodeEditBox = this._createEditBox(this.ccb_textField_1);
    this.rootNode.addChild(this._stockCodeEditBox);
    this._yearsEditBox = this._createEditBox(this.ccb_textField_2);
    this.rootNode.addChild(this._yearsEditBox);
    this._initData();
  };

  ArkMainDialog.prototype._initData = function() {
    this._stockCodeEditBox.setString("000001");
    return this._yearsEditBox.setString("6");
  };

  ArkMainDialog.prototype._createEditBox = function(node) {
    var editBox;
    editBox = new cc.EditBox(cc.size(200, 50));
    editBox.setPosition(node.getPosition());
    editBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
    editBox.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
    editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE);
    editBox.setMaxLength(13);
    editBox.setFont("Arial", 26);
    editBox.setFontColor(cc.color(100, 100, 255, 255));
    return editBox;
  };

  ArkMainDialog.prototype.showResult = function(result) {
    var contentSize;
    this.ccb_result.setString(result);
    contentSize = this.ccb_result.getContentSize();
    return this.ccb_result_bg.setContentSize(cc.size(contentSize.width + 50, contentSize.height + 100));
  };

  ArkMainDialog.prototype.onCalc = function() {
    var stockCode, years;
    stockCode = this._stockCodeEditBox.getString();
    years = this._yearsEditBox.getString();
    return cc.loader.loadJson("res/300_json/" + stockCode + ".json", (function(_this) {
      return function(error, data) {
        _this.showResult("");
        return eventManager.send(eventNames.GAME_GET_RESULT, {
          data: data,
          years: years,
          callback: function(str) {
            return _this.showResult(str);
          }
        });
      };
    })(this));
  };

  cc.BuilderReader.registerController("ArkMainDialog", new ArkMainDialog());

  return ArkMainDialog;

})();

module.exports = cc.BuilderReader.load("res/main.ccbi");


},{"../event/ArkEventManager.coffee":3,"../event/ArkEventNames.coffee":4}],2:[function(require,module,exports){
var ARK_NET_ASSETS, ARK_RETAIN_PROFITS, ARK_RETAIN_PROFITS_ADD_RATE, ARK_ROE, GameLogic, UserData, eventManager, eventNames, g_log_table, g_maxStatisticsYears, g_statisticsYears, needCalcItem, sceneManager,
  hasProp = {}.hasOwnProperty;

sceneManager = require('../tools/ArkSceneManager.coffee');

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

UserData = require('../model/ArkUserData.coffee');

g_statisticsYears = 5;

g_maxStatisticsYears = 6;

needCalcItem = {
  "receivables": "应收账款(元)",
  "depositReceived": "预收账款(元)",
  "shortLoan": "短期借款(元)",
  "longLoan": "长期借款(元)"
};

ARK_RETAIN_PROFITS = "归属于母公司股东的综合收益总额(元)";

ARK_NET_ASSETS = "归属于母公司股东权益合计(元)";

ARK_ROE = "净资产收益率";

ARK_RETAIN_PROFITS_ADD_RATE = "净利润同比增长率";

g_log_table = [];

GameLogic = (function() {
  function GameLogic() {}

  GameLogic.prototype.init = function() {
    return this._registerEvents();
  };

  GameLogic.prototype._registerEvents = function() {
    return eventManager.listen(eventNames.GAME_GET_RESULT, (function(_this) {
      return function(obj) {
        g_log_table = [];
        g_maxStatisticsYears = obj.years;
        return typeof obj.callback === "function" ? obj.callback(_this._getResult(obj.data)) : void 0;
      };
    })(this));
  };

  GameLogic.prototype._getResult = function(data) {
    var calcItem, totalAssetsIndex, totalScore, value;
    totalScore = 0;
    totalAssetsIndex = this._getTypeRowNum(data, ARK_NET_ASSETS);
    g_statisticsYears = this._getStatisticsYears(data, totalAssetsIndex);
    g_log_table.push("总资产 " + (this._getShowNumber(data[totalAssetsIndex][1])) + ", 统计时间:" + g_statisticsYears + "年");
    for (calcItem in needCalcItem) {
      if (!hasProp.call(needCalcItem, calcItem)) continue;
      value = needCalcItem[calcItem];
      totalScore += this._calcScore(data, calcItem, value, totalAssetsIndex);
    }
    totalScore += this._getRetainedProfitsScore(data);
    totalScore += this._getRoeScore(data);
    totalScore = Math.ceil(totalScore);
    g_log_table.push("总分: " + totalScore);
    return JSON.stringify(g_log_table, null, "\t");
  };

  GameLogic.prototype._getReceiveScore = function(percent) {
    return -percent;
  };

  GameLogic.prototype._getScore = function(type, percent) {
    var score;
    score = 0;
    switch (type) {
      case "receivables":
        score = this._getReceiveScore(percent);
        break;
      case "depositReceived":
        score = percent;
    }
    if (type === "shortLoan" || type === "longLoan") {
      score = 40 - percent;
    }
    return score;
  };

  GameLogic.prototype._getValidNumber = function(numberStr) {
    var num;
    if (typeof numberStr === "number") {
      return numberStr;
    }
    num = numberStr.toLowerCase();
    return Number(num);
  };

  GameLogic.prototype._getTypeRowNum = function(data, typeStr) {
    var i, index, len, row, typeNum;
    typeNum = 0;
    for (index = i = 0, len = data.length; i < len; index = ++i) {
      row = data[index];
      if (row[0].indexOf(typeStr) !== -1) {
        typeNum = index;
        break;
      }
    }
    return typeNum;
  };

  GameLogic.prototype._getCompoundRate = function(addRate, time) {
    return Math.exp(1 / time * Math.log(addRate));
  };

  GameLogic.prototype._calcScore = function(data, type, typeStr, totalAssetsIndex) {
    var averagePercent, i, ref, score, totalPercent, typeNum, yearIndex;
    typeNum = this._getTypeRowNum(data, typeStr);
    g_log_table.push(data[typeNum][0] + ", " + (this._getShowNumber(this._getValidNumber(data[typeNum][1]))));
    totalPercent = 0;
    for (yearIndex = i = 1, ref = g_statisticsYears; 1 <= ref ? i <= ref : i >= ref; yearIndex = 1 <= ref ? ++i : --i) {
      if (data[typeNum][yearIndex] == null) {
        break;
      }
      totalPercent += this._getValidNumber(data[typeNum][yearIndex]) / this._getValidNumber(data[totalAssetsIndex][yearIndex]) * 100;
    }
    averagePercent = totalPercent / g_statisticsYears;
    score = this._getScore(type, averagePercent);
    g_log_table.push(needCalcItem[type] + " 比例:" + (averagePercent.toFixed(2)) + "%, 分数 :" + (score.toFixed(2)));
    return score;
  };

  GameLogic.prototype._getStatisticsYears = function(data, totalAssetsIndex) {
    var length, totalAssets;
    totalAssets = data[totalAssetsIndex].filter(function(a) {
      return a > 0;
    });
    length = 0;
    if (totalAssets.length > g_maxStatisticsYears) {
      length = g_maxStatisticsYears;
    } else {
      length = totalAssets.length;
    }
    return length;
  };

  GameLogic.prototype._getTableByName = function(data, name) {
    var rowNum, table;
    rowNum = this._getTypeRowNum(data, name);
    table = data[rowNum].filter(function(a) {
      return a > 0;
    });
    return table.slice(0, g_maxStatisticsYears);
  };

  GameLogic.prototype._getRetainedProfitsScore = function(data) {
    var addRetainedProfits, allRetainedProfits, averagePercent;
    this._getRetainedProfitsAddRate(data);
    allRetainedProfits = this._getTableByName(data, ARK_RETAIN_PROFITS);
    g_log_table.push("初始净利润：" + (this._getShowNumber(allRetainedProfits[allRetainedProfits.length - 1])) + ",当前净利润:" + (this._getShowNumber(allRetainedProfits[0])));
    addRetainedProfits = allRetainedProfits[0] / allRetainedProfits[allRetainedProfits.length - 1];
    averagePercent = (this._getCompoundRate(addRetainedProfits, g_statisticsYears) - 1) * 100;
    g_log_table.push(g_statisticsYears + "年,净利润复合增长速度:" + (averagePercent.toFixed(2)) + "%");
    return averagePercent;
  };

  GameLogic.prototype._getRetainedProfitsAddRate = function(data) {
    var i, rateAddTable, rateIndex, ref, rowNum;
    rowNum = this._getTypeRowNum(data, ARK_RETAIN_PROFITS_ADD_RATE);
    rateAddTable = [];
    for (rateIndex = i = 1, ref = g_statisticsYears; 1 <= ref ? i <= ref : i >= ref; rateIndex = 1 <= ref ? ++i : --i) {
      rateAddTable.push(data[rowNum][rateIndex]);
    }
    return g_log_table.push(ARK_RETAIN_PROFITS_ADD_RATE + ":" + rateAddTable);
  };

  GameLogic.prototype._getRoeScore = function(data) {
    var averageRoe, count, i, ref, roe, roeRowNum, roeTable, roeValue, totalRoe;
    roeRowNum = this._getTypeRowNum(data, ARK_ROE);
    totalRoe = 0;
    count = 0;
    roeTable = [];
    for (roeValue = i = 1, ref = g_statisticsYears; 1 <= ref ? i <= ref : i >= ref; roeValue = 1 <= ref ? ++i : --i) {
      if (typeof data[roeRowNum][roeValue] !== "string") {
        continue;
      }
      roe = data[roeRowNum][roeValue];
      roeTable.push(roe);
      roe = Number(roe.replace("%", ""));
      totalRoe += roe;
      count++;
    }
    g_log_table.push("ROE:" + roeTable);
    averageRoe = totalRoe / count;
    g_log_table.push("平均ROE:" + (averageRoe.toFixed(2)));
    return averageRoe;
  };

  GameLogic.prototype._getShowNumber = function(number) {
    return ((number / 100000000).toFixed(2)) + " 亿";
  };

  return GameLogic;

})();

module.exports = GameLogic;


},{"../event/ArkEventManager.coffee":3,"../event/ArkEventNames.coffee":4,"../model/ArkUserData.coffee":6,"../tools/ArkSceneManager.coffee":7}],3:[function(require,module,exports){
var EventManager;

EventManager = {
  send: function(eventName, data) {
    var event;
    event = new cc.EventCustom(eventName);
    if (data !== null) {
      event.setUserData(data);
    }
    return cc.eventManager.dispatchEvent(event);
  },
  listen: function(eventName, listenFunc, nodeOrPriority) {
    var ccListener;
    if (nodeOrPriority == null) {
      nodeOrPriority = 1;
    }
    ccListener = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: eventName,
      callback: function(event) {
        return listenFunc(event.getUserData(), event);
      }
    });
    return cc.eventManager.addListener(ccListener, nodeOrPriority);
  }
};

module.exports = EventManager;


},{}],4:[function(require,module,exports){
var EventNames;

EventNames = {
  GAME_START: "game.start",
  GAME_END: "game.end",
  GAME_NEXT_LEVEL: "game.next.level",
  GAME_GET_RESULT: "game.get.result"
};

module.exports = EventNames;


},{}],5:[function(require,module,exports){
cc.game.onStart = function() {
  var GameLogic, gameDialog, gameLogicObj, sceneManager;
  cc.view.adjustViewPort(true);
  cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL);
  cc.view.resizeWithBrowserSize(true);
  cc.BuilderReader.setResourcePath("res/");
  sceneManager = require("./tools/ArkSceneManager.coffee");
  sceneManager.init();
  gameDialog = require('./ccbView/ArkMainDialog.coffee');
  sceneManager.addLayerToScene(gameDialog);
  GameLogic = require('./control/ArkGameLogic.coffee');
  gameLogicObj = new GameLogic();
  return gameLogicObj.init();
};

cc.game.run();


},{"./ccbView/ArkMainDialog.coffee":1,"./control/ArkGameLogic.coffee":2,"./tools/ArkSceneManager.coffee":7}],6:[function(require,module,exports){
var UserData;

UserData = (function() {
  function UserData() {
    this._score = 0;
    this._count = 0;
  }

  UserData.prototype.setScore = function(_score) {
    this._score = _score;
  };

  UserData.prototype.getScore = function() {
    return this._score;
  };

  UserData.prototype.setCount = function(_count) {
    this._count = _count;
  };

  UserData.prototype.getCount = function() {
    return this._count;
  };

  return UserData;

})();

module.exports = UserData;


},{}],7:[function(require,module,exports){
var LayerManager, Loader;

LayerManager = {
  init: function() {
    this.layerStack = [];
    this.scene = new cc.Scene();
    return cc.director.runScene(this.scene);
  },
  clearLayer: function() {
    this.scene.removeAllChildren();
    return this.layerStack.length = 0;
  },
  addLayerToScene: function(ccbLayer, zOrder) {
    var layout, node;
    if (zOrder == null) {
      zOrder = 0;
    }
    layout = new ccui.Layout();
    layout.setContentSize(cc.size(1136, 640));
    layout.setTouchEnabled(true);
    node = new cc.Node();
    node.addChild(layout);
    node.addChild(ccbLayer);
    this.scene.addChild(node, zOrder);
    return this.layerStack.push(node);
  },
  removeTopLayer: function() {
    var topLayer;
    topLayer = this.layerStack.pop();
    return this.scene.removeChild(topLayer, true);
  }
};

Loader = (function() {
  function Loader(ccbFile1, controllerName1) {
    this.ccbFile = ccbFile1;
    this.controllerName = controllerName1;
  }

  Loader.prototype.showDialog = function() {
    return cc.BuilderReader.load(this.ccbFile);
  };

  return Loader;

})();

LayerManager.defineDialog = function(ccbFile, controllerName, controllerClass) {
  cc.BuilderReader.registerController(controllerName, new controllerClass());
  return new Loader(ccbFile, controllerName);
};

module.exports = LayerManager;


},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9tYWluLmNvZmZlZSIsInNyYy9tb2RlbC9BcmtVc2VyRGF0YS5jb2ZmZWUiLCJzcmMvdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgVEFHX0FTU0VUUywgVEFHX0RFUE9TSVQsIFRBR19MT05HX0xPQU4sIFRBR19SRUNFSVZBQkxFLCBUQUdfUkVUQUlORURfUFJPRklUUywgVEFHX1NIT1JUX0xPQU4sIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcztcblxuZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZScpO1xuXG5ldmVudE5hbWVzID0gcmVxdWlyZSgnLi4vZXZlbnQvQXJrRXZlbnROYW1lcy5jb2ZmZWUnKTtcblxuVEFHX0FTU0VUUyA9IFwidG90YWxBc3NldHNcIjtcblxuVEFHX1JFQ0VJVkFCTEUgPSBcInJlY2VpdmFibGVzXCI7XG5cblRBR19ERVBPU0lUID0gXCJkZXBvc2l0UmVjZWl2ZWRcIjtcblxuVEFHX1JFVEFJTkVEX1BST0ZJVFMgPSBcInJldGFpbmVkUHJvZml0c1wiO1xuXG5UQUdfU0hPUlRfTE9BTiA9IFwic2hvcnRMb2FuXCI7XG5cblRBR19MT05HX0xPQU4gPSBcImxvbmdMb2FuXCI7XG5cbkFya01haW5EaWFsb2cgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEFya01haW5EaWFsb2coKSB7fVxuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLm9uRGlkTG9hZEZyb21DQ0IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9kYXRUYWJsZSA9IFtdO1xuICAgIHJldHVybiB0aGlzLmluaXQoKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fc3RvY2tDb2RlRWRpdEJveCA9IHRoaXMuX2NyZWF0ZUVkaXRCb3godGhpcy5jY2JfdGV4dEZpZWxkXzEpO1xuICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQodGhpcy5fc3RvY2tDb2RlRWRpdEJveCk7XG4gICAgdGhpcy5feWVhcnNFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMik7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl95ZWFyc0VkaXRCb3gpO1xuICAgIHRoaXMuX2luaXREYXRhKCk7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2luaXREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fc3RvY2tDb2RlRWRpdEJveC5zZXRTdHJpbmcoXCIwMDAwMDFcIik7XG4gICAgcmV0dXJuIHRoaXMuX3llYXJzRWRpdEJveC5zZXRTdHJpbmcoXCI2XCIpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9jcmVhdGVFZGl0Qm94ID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBlZGl0Qm94O1xuICAgIGVkaXRCb3ggPSBuZXcgY2MuRWRpdEJveChjYy5zaXplKDIwMCwgNTApKTtcbiAgICBlZGl0Qm94LnNldFBvc2l0aW9uKG5vZGUuZ2V0UG9zaXRpb24oKSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dE1vZGUoY2MuRURJVEJPWF9JTlBVVF9NT0RFX1NJTkdMRUxJTkUpO1xuICAgIGVkaXRCb3guc2V0UmV0dXJuVHlwZShjYy5LRVlCT0FSRF9SRVRVUk5UWVBFX0RPTkUpO1xuICAgIGVkaXRCb3guc2V0SW5wdXRGbGFnKGNjLkVESVRCT1hfSU5QVVRfRkxBR19JTklUSUFMX0NBUFNfU0VOVEVOQ0UpO1xuICAgIGVkaXRCb3guc2V0TWF4TGVuZ3RoKDEzKTtcbiAgICBlZGl0Qm94LnNldEZvbnQoXCJBcmlhbFwiLCAyNik7XG4gICAgZWRpdEJveC5zZXRGb250Q29sb3IoY2MuY29sb3IoMTAwLCAxMDAsIDI1NSwgMjU1KSk7XG4gICAgcmV0dXJuIGVkaXRCb3g7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuc2hvd1Jlc3VsdCA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHZhciBjb250ZW50U2l6ZTtcbiAgICB0aGlzLmNjYl9yZXN1bHQuc2V0U3RyaW5nKHJlc3VsdCk7XG4gICAgY29udGVudFNpemUgPSB0aGlzLmNjYl9yZXN1bHQuZ2V0Q29udGVudFNpemUoKTtcbiAgICByZXR1cm4gdGhpcy5jY2JfcmVzdWx0X2JnLnNldENvbnRlbnRTaXplKGNjLnNpemUoY29udGVudFNpemUud2lkdGggKyA1MCwgY29udGVudFNpemUuaGVpZ2h0ICsgMTAwKSk7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25DYWxjID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0b2NrQ29kZSwgeWVhcnM7XG4gICAgc3RvY2tDb2RlID0gdGhpcy5fc3RvY2tDb2RlRWRpdEJveC5nZXRTdHJpbmcoKTtcbiAgICB5ZWFycyA9IHRoaXMuX3llYXJzRWRpdEJveC5nZXRTdHJpbmcoKTtcbiAgICByZXR1cm4gY2MubG9hZGVyLmxvYWRKc29uKFwicmVzLzMwMF9qc29uL1wiICsgc3RvY2tDb2RlICsgXCIuanNvblwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICBfdGhpcy5zaG93UmVzdWx0KFwiXCIpO1xuICAgICAgICByZXR1cm4gZXZlbnRNYW5hZ2VyLnNlbmQoZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHllYXJzOiB5ZWFycyxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2hvd1Jlc3VsdChzdHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBjYy5CdWlsZGVyUmVhZGVyLnJlZ2lzdGVyQ29udHJvbGxlcihcIkFya01haW5EaWFsb2dcIiwgbmV3IEFya01haW5EaWFsb2coKSk7XG5cbiAgcmV0dXJuIEFya01haW5EaWFsb2c7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQnVpbGRlclJlYWRlci5sb2FkKFwicmVzL21haW4uY2NiaVwiKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTJOaVZtbGxkeTlCY210TllXbHVSR2xoYkc5bkxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMk5qWWxacFpYY3ZRWEpyVFdGcGJrUnBZV3h2Wnk1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlFXVXNUMEZCUVN4RFFVRlJMR2xEUVVGU096dEJRVU5tTEZWQlFVRXNSMEZCWVN4UFFVRkJMRU5CUVZFc0swSkJRVkk3TzBGQlJXSXNWVUZCUVN4SFFVRmhPenRCUVVOaUxHTkJRVUVzUjBGQmFVSTdPMEZCUTJwQ0xGZEJRVUVzUjBGQll6czdRVUZEWkN4dlFrRkJRU3hIUVVGMVFqczdRVUZEZGtJc1kwRkJRU3hIUVVGcFFqczdRVUZEYWtJc1lVRkJRU3hIUVVGblFqczdRVUZGVmpzN096QkNRVU5HTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVUU3U1VGRFpDeEpRVUZETEVOQlFVRXNVMEZCUkN4SFFVRmhPMWRCUTJJc1NVRkJReXhEUVVGQkxFbEJRVVFzUTBGQlFUdEZRVVpqT3pzd1FrRkpiRUlzU1VGQlFTeEhRVUZOTEZOQlFVRTdTVUZEUml4SlFVRkRMRU5CUVVFc2FVSkJRVVFzUjBGQmNVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTNKQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzYVVKQlFYQkNPMGxCUlVFc1NVRkJReXhEUVVGQkxHRkJRVVFzUjBGQmFVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTJwQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzWVVGQmNFSTdTVUZGUVN4SlFVRkRMRU5CUVVFc1UwRkJSQ3hEUVVGQk8wVkJVRVU3T3pCQ1FWVk9MRk5CUVVFc1IwRkJWeXhUUVVGQk8wbEJRMUFzU1VGQlF5eERRVUZCTEdsQ1FVRnBRaXhEUVVGRExGTkJRVzVDTEVOQlFUWkNMRkZCUVRkQ08xZEJRMEVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVhsQ0xFZEJRWHBDTzBWQlJrODdPekJDUVVsWUxHTkJRVUVzUjBGQlowSXNVMEZCUXl4SlFVRkVPMEZCUTFvc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZTeEpRVUZKTEVWQlFVVXNRMEZCUXl4UFFVRlFMRU5CUVdVc1JVRkJSU3hEUVVGRExFbEJRVWdzUTBGQlVTeEhRVUZTTEVWQlFXRXNSVUZCWWl4RFFVRm1PMGxCUTFZc1QwRkJUeXhEUVVGRExGZEJRVklzUTBGQmIwSXNTVUZCU1N4RFFVRkRMRmRCUVV3c1EwRkJRU3hEUVVGd1FqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5dzJRa0ZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zWVVGQlVpeERRVUZ6UWl4RlFVRkZMRU5CUVVNc2QwSkJRWHBDTzBsQlEwRXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzUlVGQlJTeERRVUZETEhkRFFVRjRRanRKUVVOQkxFOUJRVThzUTBGQlF5eFpRVUZTTEVOQlFYRkNMRVZCUVhKQ08wbEJRMEVzVDBGQlR5eERRVUZETEU5QlFWSXNRMEZCWjBJc1QwRkJhRUlzUlVGQmVVSXNSVUZCZWtJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRkZMRU5CUVVNc1MwRkJTQ3hEUVVGVExFZEJRVlFzUlVGQll5eEhRVUZrTEVWQlFXMUNMRWRCUVc1Q0xFVkJRWGRDTEVkQlFYaENMRU5CUVhKQ08wRkJRMEVzVjBGQlR6dEZRVlJMT3pzd1FrRlhhRUlzVlVGQlFTeEhRVUZaTEZOQlFVTXNUVUZCUkR0QlFVTlNMRkZCUVVFN1NVRkJRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEZOQlFWb3NRMEZCYzBJc1RVRkJkRUk3U1VGRFFTeFhRVUZCTEVkQlFXTXNTVUZCUXl4RFFVRkJMRlZCUVZVc1EwRkJReXhqUVVGYUxFTkJRVUU3VjBGRFpDeEpRVUZETEVOQlFVRXNZVUZCWVN4RFFVRkRMR05CUVdZc1EwRkJPRUlzUlVGQlJTeERRVUZETEVsQlFVZ3NRMEZCVVN4WFFVRlhMRU5CUVVNc1MwRkJXaXhIUVVGdlFpeEZRVUUxUWl4RlFVRm5ReXhYUVVGWExFTkJRVU1zVFVGQldpeEhRVUZ4UWl4SFFVRnlSQ3hEUVVFNVFqdEZRVWhST3pzd1FrRkxXaXhOUVVGQkxFZEJRVkVzVTBGQlFUdEJRVU5LTEZGQlFVRTdTVUZCUVN4VFFVRkJMRWRCUVZrc1NVRkJReXhEUVVGQkxHbENRVUZwUWl4RFFVRkRMRk5CUVc1Q0xFTkJRVUU3U1VGRFdpeExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMR0ZCUVdFc1EwRkJReXhUUVVGbUxFTkJRVUU3VjBGRFVpeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZZc1EwRkJiVUlzWlVGQlFTeEhRVUZuUWl4VFFVRm9RaXhIUVVFd1FpeFBRVUUzUXl4RlFVRnhSQ3hEUVVGQkxGTkJRVUVzUzBGQlFUdGhRVUZCTEZOQlFVTXNTMEZCUkN4RlFVRlJMRWxCUVZJN1VVRkRha1FzUzBGQlF5eERRVUZCTEZWQlFVUXNRMEZCV1N4RlFVRmFPMlZCUTBFc1dVRkJXU3hEUVVGRExFbEJRV0lzUTBGQmEwSXNWVUZCVlN4RFFVRkRMR1ZCUVRkQ0xFVkJRMGs3VlVGQlFTeEpRVUZCTEVWQlFVMHNTVUZCVGp0VlFVTkJMRXRCUVVFc1JVRkJVU3hMUVVSU08xVkJSVUVzVVVGQlFTeEZRVUZWTEZOQlFVTXNSMEZCUkR0dFFrRkRUaXhMUVVGRExFTkJRVUVzVlVGQlJDeERRVUZaTEVkQlFWbzdWVUZFVFN4RFFVWldPMU5CUkVvN1RVRkdhVVE3U1VGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJMRU5CUVhKRU8wVkJTRWs3TzBWQllWSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhyUWtGQmFrSXNRMEZEU1N4bFFVUktMRVZCUlVrc1NVRkJTU3hoUVVGS0xFTkJRVUVzUTBGR1NqczdPenM3TzBGQlMwb3NUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRnFRaXhEUVVGelFpeGxRVUYwUWlKOVxuIiwidmFyIEFSS19ORVRfQVNTRVRTLCBBUktfUkVUQUlOX1BST0ZJVFMsIEFSS19SRVRBSU5fUFJPRklUU19BRERfUkFURSwgQVJLX1JPRSwgR2FtZUxvZ2ljLCBVc2VyRGF0YSwgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2xvZ190YWJsZSwgZ19tYXhTdGF0aXN0aWNzWWVhcnMsIGdfc3RhdGlzdGljc1llYXJzLCBuZWVkQ2FsY0l0ZW0sIHNjZW5lTWFuYWdlcixcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbmdfc3RhdGlzdGljc1llYXJzID0gNTtcblxuZ19tYXhTdGF0aXN0aWNzWWVhcnMgPSA2O1xuXG5uZWVkQ2FsY0l0ZW0gPSB7XG4gIFwicmVjZWl2YWJsZXNcIjogXCLlupTmlLbotKbmrL4o5YWDKVwiLFxuICBcImRlcG9zaXRSZWNlaXZlZFwiOiBcIumihOaUtui0puasvijlhYMpXCIsXG4gIFwic2hvcnRMb2FuXCI6IFwi55+t5pyf5YCf5qy+KOWFgylcIixcbiAgXCJsb25nTG9hblwiOiBcIumVv+acn+WAn+asvijlhYMpXCJcbn07XG5cbkFSS19SRVRBSU5fUFJPRklUUyA9IFwi5b2S5bGe5LqO5q+N5YWs5Y+46IKh5Lic55qE57u85ZCI5pS255uK5oC76aKdKOWFgylcIjtcblxuQVJLX05FVF9BU1NFVFMgPSBcIuW9kuWxnuS6juavjeWFrOWPuOiCoeS4nOadg+ebiuWQiOiuoSjlhYMpXCI7XG5cbkFSS19ST0UgPSBcIuWHgOi1hOS6p+aUtuebiueOh1wiO1xuXG5BUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUgPSBcIuWHgOWIqea2puWQjOavlOWinumVv+eOh1wiO1xuXG5nX2xvZ190YWJsZSA9IFtdO1xuXG5HYW1lTG9naWMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEdhbWVMb2dpYygpIHt9XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fcmVnaXN0ZXJFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZXZlbnRNYW5hZ2VyLmxpc3RlbihldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGdfbG9nX3RhYmxlID0gW107XG4gICAgICAgIGdfbWF4U3RhdGlzdGljc1llYXJzID0gb2JqLnllYXJzO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iai5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gb2JqLmNhbGxiYWNrKF90aGlzLl9nZXRSZXN1bHQob2JqLmRhdGEpKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJlc3VsdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgY2FsY0l0ZW0sIHRvdGFsQXNzZXRzSW5kZXgsIHRvdGFsU2NvcmUsIHZhbHVlO1xuICAgIHRvdGFsU2NvcmUgPSAwO1xuICAgIHRvdGFsQXNzZXRzSW5kZXggPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIEFSS19ORVRfQVNTRVRTKTtcbiAgICBnX3N0YXRpc3RpY3NZZWFycyA9IHRoaXMuX2dldFN0YXRpc3RpY3NZZWFycyhkYXRhLCB0b3RhbEFzc2V0c0luZGV4KTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5oC76LWE5LqnIFwiICsgKHRoaXMuX2dldFNob3dOdW1iZXIoZGF0YVt0b3RhbEFzc2V0c0luZGV4XVsxXSkpICsgXCIsIOe7n+iuoeaXtumXtDpcIiArIGdfc3RhdGlzdGljc1llYXJzICsgXCLlubRcIik7XG4gICAgZm9yIChjYWxjSXRlbSBpbiBuZWVkQ2FsY0l0ZW0pIHtcbiAgICAgIGlmICghaGFzUHJvcC5jYWxsKG5lZWRDYWxjSXRlbSwgY2FsY0l0ZW0pKSBjb250aW51ZTtcbiAgICAgIHZhbHVlID0gbmVlZENhbGNJdGVtW2NhbGNJdGVtXTtcbiAgICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fY2FsY1Njb3JlKGRhdGEsIGNhbGNJdGVtLCB2YWx1ZSwgdG90YWxBc3NldHNJbmRleCk7XG4gICAgfVxuICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fZ2V0UmV0YWluZWRQcm9maXRzU2NvcmUoZGF0YSk7XG4gICAgdG90YWxTY29yZSArPSB0aGlzLl9nZXRSb2VTY29yZShkYXRhKTtcbiAgICB0b3RhbFNjb3JlID0gTWF0aC5jZWlsKHRvdGFsU2NvcmUpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCLmgLvliIY6IFwiICsgdG90YWxTY29yZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGdfbG9nX3RhYmxlLCBudWxsLCBcIlxcdFwiKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZWNlaXZlU2NvcmUgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gICAgcmV0dXJuIC1wZXJjZW50O1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFNjb3JlID0gZnVuY3Rpb24odHlwZSwgcGVyY2VudCkge1xuICAgIHZhciBzY29yZTtcbiAgICBzY29yZSA9IDA7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwicmVjZWl2YWJsZXNcIjpcbiAgICAgICAgc2NvcmUgPSB0aGlzLl9nZXRSZWNlaXZlU2NvcmUocGVyY2VudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlcG9zaXRSZWNlaXZlZFwiOlxuICAgICAgICBzY29yZSA9IHBlcmNlbnQ7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSBcInNob3J0TG9hblwiIHx8IHR5cGUgPT09IFwibG9uZ0xvYW5cIikge1xuICAgICAgc2NvcmUgPSA0MCAtIHBlcmNlbnQ7XG4gICAgfVxuICAgIHJldHVybiBzY29yZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRWYWxpZE51bWJlciA9IGZ1bmN0aW9uKG51bWJlclN0cikge1xuICAgIHZhciBudW07XG4gICAgaWYgKHR5cGVvZiBudW1iZXJTdHIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJldHVybiBudW1iZXJTdHI7XG4gICAgfVxuICAgIG51bSA9IG51bWJlclN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBOdW1iZXIobnVtKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRUeXBlUm93TnVtID0gZnVuY3Rpb24oZGF0YSwgdHlwZVN0cikge1xuICAgIHZhciBpLCBpbmRleCwgbGVuLCByb3csIHR5cGVOdW07XG4gICAgdHlwZU51bSA9IDA7XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIHJvdyA9IGRhdGFbaW5kZXhdO1xuICAgICAgaWYgKHJvd1swXS5pbmRleE9mKHR5cGVTdHIpICE9PSAtMSkge1xuICAgICAgICB0eXBlTnVtID0gaW5kZXg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHlwZU51bTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRDb21wb3VuZFJhdGUgPSBmdW5jdGlvbihhZGRSYXRlLCB0aW1lKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKDEgLyB0aW1lICogTWF0aC5sb2coYWRkUmF0ZSkpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2NhbGNTY29yZSA9IGZ1bmN0aW9uKGRhdGEsIHR5cGUsIHR5cGVTdHIsIHRvdGFsQXNzZXRzSW5kZXgpIHtcbiAgICB2YXIgYXZlcmFnZVBlcmNlbnQsIGksIHJlZiwgc2NvcmUsIHRvdGFsUGVyY2VudCwgdHlwZU51bSwgeWVhckluZGV4O1xuICAgIHR5cGVOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIHR5cGVTdHIpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goZGF0YVt0eXBlTnVtXVswXSArIFwiLCBcIiArICh0aGlzLl9nZXRTaG93TnVtYmVyKHRoaXMuX2dldFZhbGlkTnVtYmVyKGRhdGFbdHlwZU51bV1bMV0pKSkpO1xuICAgIHRvdGFsUGVyY2VudCA9IDA7XG4gICAgZm9yICh5ZWFySW5kZXggPSBpID0gMSwgcmVmID0gZ19zdGF0aXN0aWNzWWVhcnM7IDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZjsgeWVhckluZGV4ID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIGlmIChkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0gPT0gbnVsbCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRvdGFsUGVyY2VudCArPSB0aGlzLl9nZXRWYWxpZE51bWJlcihkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0pIC8gdGhpcy5fZ2V0VmFsaWROdW1iZXIoZGF0YVt0b3RhbEFzc2V0c0luZGV4XVt5ZWFySW5kZXhdKSAqIDEwMDtcbiAgICB9XG4gICAgYXZlcmFnZVBlcmNlbnQgPSB0b3RhbFBlcmNlbnQgLyBnX3N0YXRpc3RpY3NZZWFycztcbiAgICBzY29yZSA9IHRoaXMuX2dldFNjb3JlKHR5cGUsIGF2ZXJhZ2VQZXJjZW50KTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKG5lZWRDYWxjSXRlbVt0eXBlXSArIFwiIOavlOS+izpcIiArIChhdmVyYWdlUGVyY2VudC50b0ZpeGVkKDIpKSArIFwiJSwg5YiG5pWwIDpcIiArIChzY29yZS50b0ZpeGVkKDIpKSk7XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFN0YXRpc3RpY3NZZWFycyA9IGZ1bmN0aW9uKGRhdGEsIHRvdGFsQXNzZXRzSW5kZXgpIHtcbiAgICB2YXIgbGVuZ3RoLCB0b3RhbEFzc2V0cztcbiAgICB0b3RhbEFzc2V0cyA9IGRhdGFbdG90YWxBc3NldHNJbmRleF0uZmlsdGVyKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhID4gMDtcbiAgICB9KTtcbiAgICBsZW5ndGggPSAwO1xuICAgIGlmICh0b3RhbEFzc2V0cy5sZW5ndGggPiBnX21heFN0YXRpc3RpY3NZZWFycykge1xuICAgICAgbGVuZ3RoID0gZ19tYXhTdGF0aXN0aWNzWWVhcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvdGFsQXNzZXRzLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRUYWJsZUJ5TmFtZSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUpIHtcbiAgICB2YXIgcm93TnVtLCB0YWJsZTtcbiAgICByb3dOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIG5hbWUpO1xuICAgIHRhYmxlID0gZGF0YVtyb3dOdW1dLmZpbHRlcihmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gYSA+IDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhYmxlLnNsaWNlKDAsIGdfbWF4U3RhdGlzdGljc1llYXJzKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZXRhaW5lZFByb2ZpdHNTY29yZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgYWRkUmV0YWluZWRQcm9maXRzLCBhbGxSZXRhaW5lZFByb2ZpdHMsIGF2ZXJhZ2VQZXJjZW50O1xuICAgIHRoaXMuX2dldFJldGFpbmVkUHJvZml0c0FkZFJhdGUoZGF0YSk7XG4gICAgYWxsUmV0YWluZWRQcm9maXRzID0gdGhpcy5fZ2V0VGFibGVCeU5hbWUoZGF0YSwgQVJLX1JFVEFJTl9QUk9GSVRTKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5Yid5aeL5YeA5Yip5ram77yaXCIgKyAodGhpcy5fZ2V0U2hvd051bWJlcihhbGxSZXRhaW5lZFByb2ZpdHNbYWxsUmV0YWluZWRQcm9maXRzLmxlbmd0aCAtIDFdKSkgKyBcIizlvZPliY3lh4DliKnmtqY6XCIgKyAodGhpcy5fZ2V0U2hvd051bWJlcihhbGxSZXRhaW5lZFByb2ZpdHNbMF0pKSk7XG4gICAgYWRkUmV0YWluZWRQcm9maXRzID0gYWxsUmV0YWluZWRQcm9maXRzWzBdIC8gYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXTtcbiAgICBhdmVyYWdlUGVyY2VudCA9ICh0aGlzLl9nZXRDb21wb3VuZFJhdGUoYWRkUmV0YWluZWRQcm9maXRzLCBnX3N0YXRpc3RpY3NZZWFycykgLSAxKSAqIDEwMDtcbiAgICBnX2xvZ190YWJsZS5wdXNoKGdfc3RhdGlzdGljc1llYXJzICsgXCLlubQs5YeA5Yip5ram5aSN5ZCI5aKe6ZW/6YCf5bqmOlwiICsgKGF2ZXJhZ2VQZXJjZW50LnRvRml4ZWQoMikpICsgXCIlXCIpO1xuICAgIHJldHVybiBhdmVyYWdlUGVyY2VudDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZXRhaW5lZFByb2ZpdHNBZGRSYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBpLCByYXRlQWRkVGFibGUsIHJhdGVJbmRleCwgcmVmLCByb3dOdW07XG4gICAgcm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBBUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUpO1xuICAgIHJhdGVBZGRUYWJsZSA9IFtdO1xuICAgIGZvciAocmF0ZUluZGV4ID0gaSA9IDEsIHJlZiA9IGdfc3RhdGlzdGljc1llYXJzOyAxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWY7IHJhdGVJbmRleCA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICByYXRlQWRkVGFibGUucHVzaChkYXRhW3Jvd051bV1bcmF0ZUluZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiBnX2xvZ190YWJsZS5wdXNoKEFSS19SRVRBSU5fUFJPRklUU19BRERfUkFURSArIFwiOlwiICsgcmF0ZUFkZFRhYmxlKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSb2VTY29yZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgYXZlcmFnZVJvZSwgY291bnQsIGksIHJlZiwgcm9lLCByb2VSb3dOdW0sIHJvZVRhYmxlLCByb2VWYWx1ZSwgdG90YWxSb2U7XG4gICAgcm9lUm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBBUktfUk9FKTtcbiAgICB0b3RhbFJvZSA9IDA7XG4gICAgY291bnQgPSAwO1xuICAgIHJvZVRhYmxlID0gW107XG4gICAgZm9yIChyb2VWYWx1ZSA9IGkgPSAxLCByZWYgPSBnX3N0YXRpc3RpY3NZZWFyczsgMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyByb2VWYWx1ZSA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFbcm9lUm93TnVtXVtyb2VWYWx1ZV0gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByb2UgPSBkYXRhW3JvZVJvd051bV1bcm9lVmFsdWVdO1xuICAgICAgcm9lVGFibGUucHVzaChyb2UpO1xuICAgICAgcm9lID0gTnVtYmVyKHJvZS5yZXBsYWNlKFwiJVwiLCBcIlwiKSk7XG4gICAgICB0b3RhbFJvZSArPSByb2U7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgICBnX2xvZ190YWJsZS5wdXNoKFwiUk9FOlwiICsgcm9lVGFibGUpO1xuICAgIGF2ZXJhZ2VSb2UgPSB0b3RhbFJvZSAvIGNvdW50O1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCLlubPlnYdST0U6XCIgKyAoYXZlcmFnZVJvZS50b0ZpeGVkKDIpKSk7XG4gICAgcmV0dXJuIGF2ZXJhZ2VSb2U7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0U2hvd051bWJlciA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgIHJldHVybiAoKG51bWJlciAvIDEwMDAwMDAwMCkudG9GaXhlZCgyKSkgKyBcIiDkur9cIjtcbiAgfTtcblxuICByZXR1cm4gR2FtZUxvZ2ljO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMb2dpYztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTI5dWRISnZiQzlCY210SFlXMWxURzluYVdNdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMjl1ZEhKdmJDOUJjbXRIWVcxbFRHOW5hV011WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRXNlVTFCUVVFN1JVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlFXdENMRTlCUVVFc1EwRkJVU3hwUTBGQlVqczdRVUZEYkVJc1dVRkJRU3hIUVVGclFpeFBRVUZCTEVOQlFWRXNhVU5CUVZJN08wRkJRMnhDTEZWQlFVRXNSMEZCYTBJc1QwRkJRU3hEUVVGUkxDdENRVUZTT3p0QlFVTnNRaXhSUVVGQkxFZEJRV3RDTEU5QlFVRXNRMEZCVVN3MlFrRkJVanM3UVVGRmJFSXNhVUpCUVVFc1IwRkJiMEk3TzBGQlEzQkNMRzlDUVVGQkxFZEJRWFZDT3p0QlFVVjJRaXhaUVVGQkxFZEJRV1U3UlVGRFdDeGhRVUZCTEVWQlFXVXNVMEZFU2p0RlFVVllMR2xDUVVGQkxFVkJRVzlDTEZOQlJsUTdSVUZIV0N4WFFVRkJMRVZCUVdNc1UwRklTRHRGUVVsWUxGVkJRVUVzUlVGQllTeFRRVXBHT3pzN1FVRlBaaXhyUWtGQlFTeEhRVUZ4UWpzN1FVRkRja0lzWTBGQlFTeEhRVUZyUWpzN1FVRkRiRUlzVDBGQlFTeEhRVUZWT3p0QlFVTldMREpDUVVGQkxFZEJRVGhDT3p0QlFVVTVRaXhYUVVGQkxFZEJRV003TzBGQlIxSTdPenR6UWtGRFJpeEpRVUZCTEVkQlFVMHNVMEZCUVR0WFFVTkdMRWxCUVVNc1EwRkJRU3hsUVVGRUxFTkJRVUU3UlVGRVJUczdjMEpCUjA0c1pVRkJRU3hIUVVGcFFpeFRRVUZCTzFkQlEySXNXVUZCV1N4RFFVRkRMRTFCUVdJc1EwRkJiMElzVlVGQlZTeERRVUZETEdWQlFTOUNMRVZCUVdkRUxFTkJRVUVzVTBGQlFTeExRVUZCTzJGQlFVRXNVMEZCUXl4SFFVRkVPMUZCUXpWRExGZEJRVUVzUjBGQll6dFJRVU5rTEc5Q1FVRkJMRWRCUVhWQ0xFZEJRVWNzUTBGQlF6dHZSRUZETTBJc1IwRkJSeXhEUVVGRExGTkJRVlVzUzBGQlF5eERRVUZCTEZWQlFVUXNRMEZCV1N4SFFVRkhMRU5CUVVNc1NVRkJhRUk3VFVGSU9FSTdTVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQkxFTkJRV2hFTzBWQlJHRTdPM05DUVU5cVFpeFZRVUZCTEVkQlFWa3NVMEZCUXl4SlFVRkVPMEZCUTFJc1VVRkJRVHRKUVVGQkxGVkJRVUVzUjBGQllUdEpRVU5pTEdkQ1FVRkJMRWRCUVcxQ0xFbEJRVU1zUTBGQlFTeGpRVUZFTEVOQlFXZENMRWxCUVdoQ0xFVkJRWE5DTEdOQlFYUkNPMGxCUTI1Q0xHbENRVUZCTEVkQlFXOUNMRWxCUVVNc1EwRkJRU3h0UWtGQlJDeERRVUZ4UWl4SlFVRnlRaXhGUVVFeVFpeG5Ra0ZCTTBJN1NVRkRjRUlzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc1RVRkJRU3hIUVVGTkxFTkJRVU1zU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJTeXhEUVVGQkxHZENRVUZCTEVOQlFXdENMRU5CUVVFc1EwRkJRU3hEUVVGMlF5eERRVUZFTEVOQlFVNHNSMEZCYTBRc1UwRkJiRVFzUjBGQk1rUXNhVUpCUVRORUxFZEJRVFpGTEVkQlFUbEdPMEZCUTBFc1UwRkJRU3gzUWtGQlFUczdPMDFCUTBrc1ZVRkJRU3hKUVVGakxFbEJRVU1zUTBGQlFTeFZRVUZFTEVOQlFWa3NTVUZCV2l4RlFVRnJRaXhSUVVGc1FpeEZRVUUwUWl4TFFVRTFRaXhGUVVGdFF5eG5Ra0ZCYmtNN1FVRkViRUk3U1VGSFFTeFZRVUZCTEVsQlFXTXNTVUZCUXl4RFFVRkJMSGRDUVVGRUxFTkJRVEJDTEVsQlFURkNPMGxCUTJRc1ZVRkJRU3hKUVVGakxFbEJRVU1zUTBGQlFTeFpRVUZFTEVOQlFXTXNTVUZCWkR0SlFVTmtMRlZCUVVFc1IwRkJZU3hKUVVGSkxFTkJRVU1zU1VGQlRDeERRVUZWTEZWQlFWWTdTVUZEWWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeE5RVUZCTEVkQlFVOHNWVUZCZUVJN1FVRkRRU3hYUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNWMEZCWml4RlFVRTBRaXhKUVVFMVFpeEZRVUZyUXl4SlFVRnNRenRGUVZwRE96dHpRa0ZqV2l4blFrRkJRU3hIUVVGclFpeFRRVUZETEU5QlFVUTdRVUZEWkN4WFFVRlBMRU5CUVVNN1JVRkVUVHM3YzBKQlIyeENMRk5CUVVFc1IwRkJXU3hUUVVGRExFbEJRVVFzUlVGQlR5eFBRVUZRTzBGQlExSXNVVUZCUVR0SlFVRkJMRXRCUVVFc1IwRkJVVHRCUVVOU0xGbEJRVThzU1VGQlVEdEJRVUZCTEZkQlExTXNZVUZFVkR0UlFVVlJMRXRCUVVFc1IwRkJVU3hKUVVGRExFTkJRVUVzWjBKQlFVUXNRMEZCYTBJc1QwRkJiRUk3UVVGRVVEdEJRVVJVTEZkQlIxTXNhVUpCU0ZRN1VVRkpVU3hMUVVGQkxFZEJRVkU3UVVGS2FFSTdTVUZOUVN4SlFVRkhMRWxCUVVFc1MwRkJVU3hYUVVGU0xFbEJRWFZDTEVsQlFVRXNTMEZCVVN4VlFVRnNRenROUVVOSkxFdEJRVUVzUjBGQlVTeEZRVUZCTEVkQlFVc3NVVUZFYWtJN08wRkJSVUVzVjBGQlR6dEZRVlpET3p0elFrRlpXaXhsUVVGQkxFZEJRV3RDTEZOQlFVTXNVMEZCUkR0QlFVTmtMRkZCUVVFN1NVRkJRU3hKUVVGdlFpeFBRVUZQTEZOQlFWQXNTMEZCY1VJc1VVRkJla003UVVGQlFTeGhRVUZQTEZWQlFWQTdPMGxCUTBFc1IwRkJRU3hIUVVGTkxGTkJRVk1zUTBGQlF5eFhRVUZXTEVOQlFVRTdRVUZEVGl4WFFVRlBMRTFCUVVFc1EwRkJUeXhIUVVGUU8wVkJTRTg3TzNOQ1FVdHNRaXhqUVVGQkxFZEJRV2xDTEZOQlFVTXNTVUZCUkN4RlFVRlBMRTlCUVZBN1FVRkRZaXhSUVVGQk8wbEJRVUVzVDBGQlFTeEhRVUZWTzBGQlExWXNVMEZCUVN4elJFRkJRVHM3VFVGRFNTeEpRVUZITEVkQlFVa3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhQUVVGUUxFTkJRV1VzVDBGQlppeERRVUZCTEV0QlFUWkNMRU5CUVVNc1EwRkJha003VVVGRFNTeFBRVUZCTEVkQlFWVTdRVUZEVml4alFVWktPenRCUVVSS08wRkJTVUVzVjBGQlR6dEZRVTVOT3p0elFrRlJha0lzWjBKQlFVRXNSMEZCYTBJc1UwRkJReXhQUVVGRUxFVkJRVlVzU1VGQlZqdEJRVU5rTEZkQlFVOHNTVUZCU1N4RFFVRkRMRWRCUVV3c1EwRkJVeXhEUVVGQkxFZEJRVWtzU1VGQlNpeEhRVUZYTEVsQlFVa3NRMEZCUXl4SFFVRk1MRU5CUVZNc1QwRkJWQ3hEUVVGd1FqdEZRVVJQT3p0elFrRkpiRUlzVlVGQlFTeEhRVUZoTEZOQlFVTXNTVUZCUkN4RlFVRlBMRWxCUVZBc1JVRkJZU3hQUVVGaUxFVkJRWE5DTEdkQ1FVRjBRanRCUVVOVUxGRkJRVUU3U1VGQlFTeFBRVUZCTEVkQlFWVXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQmFFSXNSVUZCYzBJc1QwRkJkRUk3U1VGRFZpeFhRVUZYTEVOQlFVTXNTVUZCV2l4RFFVRnZRaXhKUVVGTExFTkJRVUVzVDBGQlFTeERRVUZUTEVOQlFVRXNRMEZCUVN4RFFVRm1MRWRCUVd0Q0xFbEJRV3hDTEVkQlFYRkNMRU5CUVVNc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCUXl4RFFVRkJMR1ZCUVVRc1EwRkJhVUlzU1VGQlN5eERRVUZCTEU5QlFVRXNRMEZCVXl4RFFVRkJMRU5CUVVFc1EwRkJMMElzUTBGQmFFSXNRMEZCUkN4RFFVRjRRenRKUVVOQkxGbEJRVUVzUjBGQlpUdEJRVU5tTEZOQlFXbENMRFJIUVVGcVFqdE5RVU5KTEVsQlFXRXNaME5CUVdJN1FVRkJRU3hqUVVGQk96dE5RVU5CTEZsQlFVRXNTVUZCWjBJc1NVRkJReXhEUVVGQkxHVkJRVVFzUTBGQmFVSXNTVUZCU3l4RFFVRkJMRTlCUVVFc1EwRkJVeXhEUVVGQkxGTkJRVUVzUTBGQkwwSXNRMEZCUVN4SFFVRTJReXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4SlFVRkxMRU5CUVVFc1owSkJRVUVzUTBGQmEwSXNRMEZCUVN4VFFVRkJMRU5CUVhoRExFTkJRVGRETEVkQlFXMUhPMEZCUm5aSU8wbEJSMEVzWTBGQlFTeEhRVUZwUWl4WlFVRkJMRWRCUVdVN1NVRkRhRU1zUzBGQlFTeEhRVUZSTEVsQlFVTXNRMEZCUVN4VFFVRkVMRU5CUVZjc1NVRkJXQ3hGUVVGcFFpeGpRVUZxUWp0SlFVTlNMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRVzlDTEZsQlFXRXNRMEZCUVN4SlFVRkJMRU5CUVdRc1IwRkJiMElzVFVGQmNFSXNSMEZCZVVJc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlppeERRVUYxUWl4RFFVRjJRaXhEUVVGRUxFTkJRWHBDTEVkQlFXOUVMRk5CUVhCRUxFZEJRVFJFTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU0c1EwRkJZeXhEUVVGa0xFTkJRVVFzUTBGQkwwVTdRVUZEUVN4WFFVRlBPMFZCVmtVN08zTkNRVmxpTEcxQ1FVRkJMRWRCUVhOQ0xGTkJRVU1zU1VGQlJDeEZRVUZQTEdkQ1FVRlFPMEZCUTJ4Q0xGRkJRVUU3U1VGQlFTeFhRVUZCTEVkQlFXTXNTVUZCU3l4RFFVRkJMR2RDUVVGQkxFTkJRV2xDTEVOQlFVTXNUVUZCZGtJc1EwRkJPRUlzVTBGQlF5eERRVUZFTzJGQlFVMHNRMEZCUVN4SFFVRkpPMGxCUVZZc1EwRkJPVUk3U1VGRFpDeE5RVUZCTEVkQlFWTTdTVUZEVkN4SlFVRkhMRmRCUVZjc1EwRkJReXhOUVVGYUxFZEJRWEZDTEc5Q1FVRjRRanROUVVOSkxFMUJRVUVzUjBGQlV5eHhRa0ZFWWp0TFFVRkJMRTFCUVVFN1RVRkhTU3hOUVVGQkxFZEJRVk1zVjBGQlZ5eERRVUZETEU5QlNIcENPenRCUVVsQkxGZEJRVTg3UlVGUVZ6czdjMEpCVTNSQ0xHVkJRVUVzUjBGQmFVSXNVMEZCUXl4SlFVRkVMRVZCUVU4c1NVRkJVRHRCUVVOaUxGRkJRVUU3U1VGQlFTeE5RVUZCTEVkQlFWTXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQmFFSXNSVUZCYzBJc1NVRkJkRUk3U1VGRFZDeExRVUZCTEVkQlFWRXNTVUZCU3l4RFFVRkJMRTFCUVVFc1EwRkJUeXhEUVVGRExFMUJRV0lzUTBGQmIwSXNVMEZCUXl4RFFVRkVPMkZCUVUwc1EwRkJRU3hIUVVGSk8wbEJRVllzUTBGQmNFSTdWMEZEVWl4TFFVRkxMRU5CUVVNc1MwRkJUaXhEUVVGWkxFTkJRVm9zUlVGQlpTeHZRa0ZCWmp0RlFVaGhPenR6UWtGTmFrSXNkMEpCUVVFc1IwRkJNa0lzVTBGQlF5eEpRVUZFTzBGQlEzWkNMRkZCUVVFN1NVRkJRU3hKUVVGRExFTkJRVUVzTUVKQlFVUXNRMEZCTkVJc1NVRkJOVUk3U1VGRFFTeHJRa0ZCUVN4SFFVRnhRaXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4SlFVRnFRaXhGUVVGMVFpeHJRa0ZCZGtJN1NVRkRja0lzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc1VVRkJRU3hIUVVGUkxFTkJRVU1zU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc2EwSkJRVzFDTEVOQlFVRXNhMEpCUVd0Q0xFTkJRVU1zVFVGQmJrSXNSMEZCTkVJc1EwRkJOVUlzUTBGQmJrTXNRMEZCUkN4RFFVRlNMRWRCUVRSRkxGTkJRVFZGTEVkQlFXOUdMRU5CUVVNc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNhMEpCUVcxQ0xFTkJRVUVzUTBGQlFTeERRVUZ1UXl4RFFVRkVMRU5CUVhKSE8wbEJRMEVzYTBKQlFVRXNSMEZCY1VJc2EwSkJRVzFDTEVOQlFVRXNRMEZCUVN4RFFVRnVRaXhIUVVGM1FpeHJRa0ZCYlVJc1EwRkJRU3hyUWtGQmEwSXNRMEZCUXl4TlFVRnVRaXhIUVVFMFFpeERRVUUxUWp0SlFVTm9SU3hqUVVGQkxFZEJRV2xDTEVOQlFVTXNTVUZCUXl4RFFVRkJMR2RDUVVGRUxFTkJRV3RDTEd0Q1FVRnNRaXhGUVVGelF5eHBRa0ZCZEVNc1EwRkJRU3hIUVVFeVJDeERRVUUxUkN4RFFVRkJMRWRCUVdsRk8wbEJRMnhHTEZkQlFWY3NRMEZCUXl4SlFVRmFMRU5CUVc5Q0xHbENRVUZFTEVkQlFXMUNMR05CUVc1Q0xFZEJRV2RETEVOQlFVTXNZMEZCWXl4RFFVRkRMRTlCUVdZc1EwRkJkVUlzUTBGQmRrSXNRMEZCUkN4RFFVRm9ReXhIUVVFeVJDeEhRVUU1UlR0QlFVTkJMRmRCUVU4N1JVRlFaMEk3TzNOQ1FWTXpRaXd3UWtGQlFTeEhRVUV5UWl4VFFVRkRMRWxCUVVRN1FVRkRka0lzVVVGQlFUdEpRVUZCTEUxQlFVRXNSMEZCVXl4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeEpRVUZvUWl4RlFVRnpRaXd5UWtGQmRFSTdTVUZEVkN4WlFVRkJMRWRCUVdVN1FVRkRaaXhUUVVGcFFpdzBSMEZCYWtJN1RVRkRTU3haUVVGWkxFTkJRVU1zU1VGQllpeERRVUZyUWl4SlFVRkxMRU5CUVVFc1RVRkJRU3hEUVVGUkxFTkJRVUVzVTBGQlFTeERRVUV2UWp0QlFVUktPMWRCUlVFc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmIwSXNNa0pCUVVRc1IwRkJOa0lzUjBGQk4wSXNSMEZCWjBNc1dVRkJia1E3UlVGTWRVSTdPM05DUVZFelFpeFpRVUZCTEVkQlFXVXNVMEZCUXl4SlFVRkVPMEZCUTFnc1VVRkJRVHRKUVVGQkxGTkJRVUVzUjBGQldTeEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4UFFVRjBRanRKUVVOYUxGRkJRVUVzUjBGQlZ6dEpRVU5ZTEV0QlFVRXNSMEZCVVR0SlFVTlNMRkZCUVVFc1IwRkJWenRCUVVOWUxGTkJRV2RDTERCSFFVRm9RanROUVVOSkxFbEJRVmtzVDBGQlR5eEpRVUZMTEVOQlFVRXNVMEZCUVN4RFFVRlhMRU5CUVVFc1VVRkJRU3hEUVVGMlFpeExRVUYxUXl4UlFVRnVSRHRCUVVGQkxHbENRVUZCT3p0TlFVTkJMRWRCUVVFc1IwRkJUU3hKUVVGTExFTkJRVUVzVTBGQlFTeERRVUZYTEVOQlFVRXNVVUZCUVR0TlFVTjBRaXhSUVVGUkxFTkJRVU1zU1VGQlZDeERRVUZqTEVkQlFXUTdUVUZEUVN4SFFVRkJMRWRCUVUwc1RVRkJRU3hEUVVGUExFZEJRVWNzUTBGQlF5eFBRVUZLTEVOQlFWa3NSMEZCV2l4RlFVRnBRaXhGUVVGcVFpeERRVUZRTzAxQlEwNHNVVUZCUVN4SlFVRlpPMDFCUTFvc1MwRkJRVHRCUVU1S08wbEJUMEVzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc1RVRkJRU3hIUVVGUExGRkJRWGhDTzBsQlEwRXNWVUZCUVN4SFFVRmhMRkZCUVVFc1IwRkJWenRKUVVONFFpeFhRVUZYTEVOQlFVTXNTVUZCV2l4RFFVRnBRaXhSUVVGQkxFZEJRVkVzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCV0N4RFFVRnRRaXhEUVVGdVFpeERRVUZFTEVOQlFYcENPMEZCUTBFc1YwRkJUenRGUVdaSk96dHpRa0ZwUW1Zc1kwRkJRU3hIUVVGcFFpeFRRVUZETEUxQlFVUTdRVUZEWWl4WFFVRlRMRU5CUVVNc1EwRkJReXhOUVVGQkxFZEJRVk1zVTBGQlZpeERRVUZ2UWl4RFFVRkRMRTlCUVhKQ0xFTkJRVFpDTEVOQlFUZENMRU5CUVVRc1EwRkJRU3hIUVVGcFF6dEZRVVEzUWpzN096czdPMEZCUjNKQ0xFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgRXZlbnRNYW5hZ2VyO1xuXG5FdmVudE1hbmFnZXIgPSB7XG4gIHNlbmQ6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIHZhciBldmVudDtcbiAgICBldmVudCA9IG5ldyBjYy5FdmVudEN1c3RvbShldmVudE5hbWUpO1xuICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICBldmVudC5zZXRVc2VyRGF0YShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSxcbiAgbGlzdGVuOiBmdW5jdGlvbihldmVudE5hbWUsIGxpc3RlbkZ1bmMsIG5vZGVPclByaW9yaXR5KSB7XG4gICAgdmFyIGNjTGlzdGVuZXI7XG4gICAgaWYgKG5vZGVPclByaW9yaXR5ID09IG51bGwpIHtcbiAgICAgIG5vZGVPclByaW9yaXR5ID0gMTtcbiAgICB9XG4gICAgY2NMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLkNVU1RPTSxcbiAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5GdW5jKGV2ZW50LmdldFVzZXJEYXRhKCksIGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGNjTGlzdGVuZXIsIG5vZGVPclByaW9yaXR5KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE1hbmFnZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlpYWmxiblF2UVhKclJYWmxiblJOWVc1aFoyVnlMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDJWMlpXNTBMMEZ5YTBWMlpXNTBUV0Z1WVdkbGNpNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRMGs3UlVGQlFTeEpRVUZCTEVWQlFVMHNVMEZCUXl4VFFVRkVMRVZCUVZrc1NVRkJXanRCUVVOR0xGRkJRVUU3U1VGQlFTeExRVUZCTEVkQlFWRXNTVUZCU1N4RlFVRkZMRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeFRRVUZ1UWp0SlFVTlNMRWxCUVVrc1NVRkJRU3hMUVVGUkxFbEJRVm83VFVGRFNTeExRVUZMTEVOQlFVTXNWMEZCVGl4RFFVRnJRaXhKUVVGc1FpeEZRVVJLT3p0WFFVVkJMRVZCUVVVc1EwRkJReXhaUVVGWkxFTkJRVU1zWVVGQmFFSXNRMEZCT0VJc1MwRkJPVUk3UlVGS1JTeERRVUZPTzBWQlMwRXNUVUZCUVN4RlFVRlJMRk5CUVVNc1UwRkJSQ3hGUVVGWkxGVkJRVm9zUlVGQmQwSXNZMEZCZUVJN1FVRkRTaXhSUVVGQk96dE5RVUZCTEdsQ1FVRnJRanM3U1VGRGJFSXNWVUZCUVN4SFFVRmhMRVZCUVVVc1EwRkJReXhoUVVGaExFTkJRVU1zVFVGQmFrSXNRMEZEVkR0TlFVRkJMRXRCUVVFc1JVRkJUeXhGUVVGRkxFTkJRVU1zWVVGQllTeERRVUZETEUxQlFYaENPMDFCUTBFc1UwRkJRU3hGUVVGWExGTkJSRmc3VFVGRlFTeFJRVUZCTEVWQlFWVXNVMEZCUXl4TFFVRkVPMEZCUTA0c1pVRkJUeXhWUVVGQkxFTkJRVmNzUzBGQlN5eERRVUZETEZkQlFVNHNRMEZCUVN4RFFVRllMRVZCUVdkRExFdEJRV2hETzAxQlJFUXNRMEZHVmp0TFFVUlRPMWRCVFdJc1JVRkJSU3hEUVVGRExGbEJRVmtzUTBGQlF5eFhRVUZvUWl4RFFVRTBRaXhWUVVFMVFpeEZRVUYzUXl4alFVRjRRenRGUVZKSkxFTkJURkk3T3p0QlFXTktMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIEV2ZW50TmFtZXM7XG5cbkV2ZW50TmFtZXMgPSB7XG4gIEdBTUVfU1RBUlQ6IFwiZ2FtZS5zdGFydFwiLFxuICBHQU1FX0VORDogXCJnYW1lLmVuZFwiLFxuICBHQU1FX05FWFRfTEVWRUw6IFwiZ2FtZS5uZXh0LmxldmVsXCIsXG4gIEdBTUVfR0VUX1JFU1VMVDogXCJnYW1lLmdldC5yZXN1bHRcIlxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE5hbWVzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5ST1lXMWxjeTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZkR0Z2ZDNVdmMzUjFaSGt2UVhKcllXUXZRWEpyWVdSSFlXMWxMM055WXk5bGRtVnVkQzlCY210RmRtVnVkRTVoYldWekxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZCT3p0QlFVRkJMRlZCUVVFc1IwRkRTVHRGUVVGQkxGVkJRVUVzUlVGQmEwSXNXVUZCYkVJN1JVRkRRU3hSUVVGQkxFVkJRV3RDTEZWQlJHeENPMFZCUlVFc1pVRkJRU3hGUVVGclFpeHBRa0ZHYkVJN1JVRkpRU3hsUVVGQkxFVkJRV3RDTEdsQ1FVcHNRanM3TzBGQlRVb3NUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwiY2MuZ2FtZS5vblN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBHYW1lTG9naWMsIGdhbWVEaWFsb2csIGdhbWVMb2dpY09iaiwgc2NlbmVNYW5hZ2VyO1xuICBjYy52aWV3LmFkanVzdFZpZXdQb3J0KHRydWUpO1xuICBjYy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKDExMzYsIDY0MCwgY2MuUmVzb2x1dGlvblBvbGljeS5TSE9XX0FMTCk7XG4gIGNjLnZpZXcucmVzaXplV2l0aEJyb3dzZXJTaXplKHRydWUpO1xuICBjYy5CdWlsZGVyUmVhZGVyLnNldFJlc291cmNlUGF0aChcInJlcy9cIik7XG4gIHNjZW5lTWFuYWdlciA9IHJlcXVpcmUoXCIuL3Rvb2xzL0Fya1NjZW5lTWFuYWdlci5jb2ZmZWVcIik7XG4gIHNjZW5lTWFuYWdlci5pbml0KCk7XG4gIGdhbWVEaWFsb2cgPSByZXF1aXJlKCcuL2NjYlZpZXcvQXJrTWFpbkRpYWxvZy5jb2ZmZWUnKTtcbiAgc2NlbmVNYW5hZ2VyLmFkZExheWVyVG9TY2VuZShnYW1lRGlhbG9nKTtcbiAgR2FtZUxvZ2ljID0gcmVxdWlyZSgnLi9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUnKTtcbiAgZ2FtZUxvZ2ljT2JqID0gbmV3IEdhbWVMb2dpYygpO1xuICByZXR1cm4gZ2FtZUxvZ2ljT2JqLmluaXQoKTtcbn07XG5cbmNjLmdhbWUucnVuKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXRnBiaTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZkR0Z2ZDNVdmMzUjFaSGt2UVhKcllXUXZRWEpyWVdSSFlXMWxMM055WXk5dFlXbHVMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFWSXNSMEZCYTBJc1UwRkJRVHRCUVVOa0xFMUJRVUU3UlVGQlFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVZJc1EwRkJkVUlzU1VGQmRrSTdSVUZEUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExIVkNRVUZTTEVOQlFXZERMRWxCUVdoRExFVkJRWE5ETEVkQlFYUkRMRVZCUVRKRExFVkJRVVVzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhSUVVFdlJEdEZRVU5CTEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc2NVSkJRVklzUTBGQk9FSXNTVUZCT1VJN1JVRkRRU3hGUVVGRkxFTkJRVU1zWVVGQllTeERRVUZETEdWQlFXcENMRU5CUVdsRExFMUJRV3BETzBWQlJVRXNXVUZCUVN4SFFVRmxMRTlCUVVFc1EwRkJVU3huUTBGQlVqdEZRVU5tTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVVFN1JVRkZRU3hWUVVGQkxFZEJRV0VzVDBGQlFTeERRVUZSTEdkRFFVRlNPMFZCUTJJc1dVRkJXU3hEUVVGRExHVkJRV0lzUTBGQk5rSXNWVUZCTjBJN1JVRkZRU3hUUVVGQkxFZEJRVmtzVDBGQlFTeERRVUZSTEN0Q1FVRlNPMFZCUTFvc1dVRkJRU3hIUVVGbExFbEJRVWtzVTBGQlNpeERRVUZCTzFOQlEyWXNXVUZCV1N4RFFVRkRMRWxCUVdJc1EwRkJRVHRCUVdSak96dEJRV2RDYkVJc1JVRkJSU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZTTEVOQlFVRWlmUT09XG4iLCJ2YXIgVXNlckRhdGE7XG5cblVzZXJEYXRhID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBVc2VyRGF0YSgpIHtcbiAgICB0aGlzLl9zY29yZSA9IDA7XG4gICAgdGhpcy5fY291bnQgPSAwO1xuICB9XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oX3Njb3JlKSB7XG4gICAgdGhpcy5fc2NvcmUgPSBfc2NvcmU7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLmdldFNjb3JlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRDb3VudCA9IGZ1bmN0aW9uKF9jb3VudCkge1xuICAgIHRoaXMuX2NvdW50ID0gX2NvdW50O1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudDtcbiAgfTtcblxuICByZXR1cm4gVXNlckRhdGE7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckRhdGE7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UVhKclZYTmxja1JoZEdFdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFN08wRkJRVTA3UlVGRFZ5eHJRa0ZCUVR0SlFVTlVMRWxCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVlU3U1VGRFZpeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlZPMFZCUmtRN08zRkNRVWxpTEZGQlFVRXNSMEZCVlN4VFFVRkRMRTFCUVVRN1NVRkJReXhKUVVGRExFTkJRVUVzVTBGQlJEdEZRVUZFT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlFUdFhRVUZITEVsQlFVTXNRMEZCUVR0RlFVRktPenR4UWtGRlZpeFJRVUZCTEVkQlFWVXNVMEZCUXl4TlFVRkVPMGxCUVVNc1NVRkJReXhEUVVGQkxGTkJRVVE3UlVGQlJEczdjVUpCUlZZc1VVRkJRU3hIUVVGVkxGTkJRVUU3VjBGQlJ5eEpRVUZETEVOQlFVRTdSVUZCU2pzN096czdPMEZCUldRc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlmUT09XG4iLCJ2YXIgTGF5ZXJNYW5hZ2VyLCBMb2FkZXI7XG5cbkxheWVyTWFuYWdlciA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sYXllclN0YWNrID0gW107XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBjYy5TY2VuZSgpO1xuICAgIHJldHVybiBjYy5kaXJlY3Rvci5ydW5TY2VuZSh0aGlzLnNjZW5lKTtcbiAgfSxcbiAgY2xlYXJMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2VuZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgIHJldHVybiB0aGlzLmxheWVyU3RhY2subGVuZ3RoID0gMDtcbiAgfSxcbiAgYWRkTGF5ZXJUb1NjZW5lOiBmdW5jdGlvbihjY2JMYXllciwgek9yZGVyKSB7XG4gICAgdmFyIGxheW91dCwgbm9kZTtcbiAgICBpZiAoek9yZGVyID09IG51bGwpIHtcbiAgICAgIHpPcmRlciA9IDA7XG4gICAgfVxuICAgIGxheW91dCA9IG5ldyBjY3VpLkxheW91dCgpO1xuICAgIGxheW91dC5zZXRDb250ZW50U2l6ZShjYy5zaXplKDExMzYsIDY0MCkpO1xuICAgIGxheW91dC5zZXRUb3VjaEVuYWJsZWQodHJ1ZSk7XG4gICAgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgbm9kZS5hZGRDaGlsZChsYXlvdXQpO1xuICAgIG5vZGUuYWRkQ2hpbGQoY2NiTGF5ZXIpO1xuICAgIHRoaXMuc2NlbmUuYWRkQ2hpbGQobm9kZSwgek9yZGVyKTtcbiAgICByZXR1cm4gdGhpcy5sYXllclN0YWNrLnB1c2gobm9kZSk7XG4gIH0sXG4gIHJlbW92ZVRvcExheWVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdG9wTGF5ZXI7XG4gICAgdG9wTGF5ZXIgPSB0aGlzLmxheWVyU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRoaXMuc2NlbmUucmVtb3ZlQ2hpbGQodG9wTGF5ZXIsIHRydWUpO1xuICB9XG59O1xuXG5Mb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIExvYWRlcihjY2JGaWxlMSwgY29udHJvbGxlck5hbWUxKSB7XG4gICAgdGhpcy5jY2JGaWxlID0gY2NiRmlsZTE7XG4gICAgdGhpcy5jb250cm9sbGVyTmFtZSA9IGNvbnRyb2xsZXJOYW1lMTtcbiAgfVxuXG4gIExvYWRlci5wcm90b3R5cGUuc2hvd0RpYWxvZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjYy5CdWlsZGVyUmVhZGVyLmxvYWQodGhpcy5jY2JGaWxlKTtcbiAgfTtcblxuICByZXR1cm4gTG9hZGVyO1xuXG59KSgpO1xuXG5MYXllck1hbmFnZXIuZGVmaW5lRGlhbG9nID0gZnVuY3Rpb24oY2NiRmlsZSwgY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJDbGFzcykge1xuICBjYy5CdWlsZGVyUmVhZGVyLnJlZ2lzdGVyQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgbmV3IGNvbnRyb2xsZXJDbGFzcygpKTtcbiAgcmV0dXJuIG5ldyBMb2FkZXIoY2NiRmlsZSwgY29udHJvbGxlck5hbWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXllck1hbmFnZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmRHOXZiSE12UVhKclUyTmxibVZOWVc1aFoyVnlMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDNSdmIyeHpMMEZ5YTFOalpXNWxUV0Z1WVdkbGNpNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlEwRXNTVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRMGs3UlVGQlFTeEpRVUZCTEVWQlFVMHNVMEZCUVR0SlFVTkdMRWxCUVVNc1EwRkJRU3hWUVVGRUxFZEJRV003U1VGRFpDeEpRVUZETEVOQlFVRXNTMEZCUkN4SFFVRlRMRWxCUVVrc1JVRkJSU3hEUVVGRExFdEJRVkFzUTBGQlFUdFhRVU5VTEVWQlFVVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1VVRkJXaXhEUVVGeFFpeEpRVUZETEVOQlFVRXNTMEZCZEVJN1JVRklSU3hEUVVGT08wVkJTMEVzVlVGQlFTeEZRVUZaTEZOQlFVRTdTVUZEVWl4SlFVRkRMRU5CUVVFc1MwRkJTeXhEUVVGRExHbENRVUZRTEVOQlFVRTdWMEZEUVN4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExFMUJRVm9zUjBGQmNVSTdSVUZHWWl4RFFVeGFPMFZCVTBFc1pVRkJRU3hGUVVGclFpeFRRVUZETEZGQlFVUXNSVUZCVnl4TlFVRllPMEZCUTJRc1VVRkJRVHM3VFVGRWVVSXNVMEZCVXpzN1NVRkRiRU1zVFVGQlFTeEhRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVZRc1EwRkJRVHRKUVVOVUxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzU1VGQlVpeEZRVUZqTEVkQlFXUXNRMEZCZEVJN1NVRkRRU3hOUVVGTkxFTkJRVU1zWlVGQlVDeERRVUYxUWl4SlFVRjJRanRKUVVWQkxFbEJRVUVzUjBGQlRTeEpRVUZKTEVWQlFVVXNRMEZCUXl4SlFVRlFMRU5CUVVFN1NVRkRUaXhKUVVGSkxFTkJRVU1zVVVGQlRDeERRVUZqTEUxQlFXUTdTVUZEUVN4SlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxGRkJRV1E3U1VGRlFTeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMRkZCUVZBc1EwRkJaMElzU1VGQmFFSXNSVUZCYzBJc1RVRkJkRUk3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRWxCUVZvc1EwRkJhVUlzU1VGQmFrSTdSVUZXWXl4RFFWUnNRanRGUVhGQ1FTeGpRVUZCTEVWQlFXZENMRk5CUVVFN1FVRkRXaXhSUVVGQk8wbEJRVUVzVVVGQlFTeEhRVUZYTEVsQlFVTXNRMEZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXaXhEUVVGQk8xZEJRMWdzU1VGQlF5eERRVUZCTEV0QlFVc3NRMEZCUXl4WFFVRlFMRU5CUVcxQ0xGRkJRVzVDTEVWQlFUWkNMRWxCUVRkQ08wVkJSbGtzUTBGeVFtaENPenM3UVVGNVFrVTdSVUZEVnl4blFrRkJReXhSUVVGRUxFVkJRVmNzWlVGQldEdEpRVUZETEVsQlFVTXNRMEZCUVN4VlFVRkVPMGxCUVZVc1NVRkJReXhEUVVGQkxHbENRVUZFTzBWQlFWZzdPMjFDUVVOaUxGVkJRVUVzUjBGQllTeFRRVUZCTzFkQlExUXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhKUVVGcVFpeERRVUZ6UWl4SlFVRkRMRU5CUVVFc1QwRkJka0k3UlVGRVV6czdPenM3TzBGQlIycENMRmxCUVZrc1EwRkJReXhaUVVGaUxFZEJRVFJDTEZOQlFVTXNUMEZCUkN4RlFVRlZMR05CUVZZc1JVRkJNRUlzWlVGQk1VSTdSVUZEZUVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eHJRa0ZCYWtJc1EwRkRTU3hqUVVSS0xFVkJSVWtzU1VGQlNTeGxRVUZLTEVOQlFVRXNRMEZHU2p0VFFVdEJMRWxCUVVrc1RVRkJTaXhEUVVGWExFOUJRVmdzUlVGQmIwSXNZMEZCY0VJN1FVRk9kMEk3TzBGQlVUVkNMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIl19
