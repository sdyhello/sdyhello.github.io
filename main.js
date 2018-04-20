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
    return this.ccb_result.setString(result);
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
    var averagePercent, i, infoTable, ref, score, totalPercent, typeNum, yearIndex;
    typeNum = this._getTypeRowNum(data, typeStr);
    totalPercent = 0;
    infoTable = [];
    infoTable.push(data[typeNum][0]);
    for (yearIndex = i = 1, ref = g_statisticsYears; 1 <= ref ? i <= ref : i >= ref; yearIndex = 1 <= ref ? ++i : --i) {
      if (data[typeNum][yearIndex] == null) {
        break;
      }
      infoTable.push(this._getShowNumber(this._getValidNumber(data[typeNum][yearIndex])));
      totalPercent += this._getValidNumber(data[typeNum][yearIndex]) / this._getValidNumber(data[totalAssetsIndex][yearIndex]) * 100;
    }
    averagePercent = totalPercent / g_statisticsYears;
    score = this._getScore(type, averagePercent);
    g_log_table.push("" + infoTable);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9tYWluLmNvZmZlZSIsInNyYy9tb2RlbC9BcmtVc2VyRGF0YS5jb2ZmZWUiLCJzcmMvdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgVEFHX0FTU0VUUywgVEFHX0RFUE9TSVQsIFRBR19MT05HX0xPQU4sIFRBR19SRUNFSVZBQkxFLCBUQUdfUkVUQUlORURfUFJPRklUUywgVEFHX1NIT1JUX0xPQU4sIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcztcblxuZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZScpO1xuXG5ldmVudE5hbWVzID0gcmVxdWlyZSgnLi4vZXZlbnQvQXJrRXZlbnROYW1lcy5jb2ZmZWUnKTtcblxuVEFHX0FTU0VUUyA9IFwidG90YWxBc3NldHNcIjtcblxuVEFHX1JFQ0VJVkFCTEUgPSBcInJlY2VpdmFibGVzXCI7XG5cblRBR19ERVBPU0lUID0gXCJkZXBvc2l0UmVjZWl2ZWRcIjtcblxuVEFHX1JFVEFJTkVEX1BST0ZJVFMgPSBcInJldGFpbmVkUHJvZml0c1wiO1xuXG5UQUdfU0hPUlRfTE9BTiA9IFwic2hvcnRMb2FuXCI7XG5cblRBR19MT05HX0xPQU4gPSBcImxvbmdMb2FuXCI7XG5cbkFya01haW5EaWFsb2cgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEFya01haW5EaWFsb2coKSB7fVxuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLm9uRGlkTG9hZEZyb21DQ0IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9kYXRUYWJsZSA9IFtdO1xuICAgIHJldHVybiB0aGlzLmluaXQoKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fc3RvY2tDb2RlRWRpdEJveCA9IHRoaXMuX2NyZWF0ZUVkaXRCb3godGhpcy5jY2JfdGV4dEZpZWxkXzEpO1xuICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQodGhpcy5fc3RvY2tDb2RlRWRpdEJveCk7XG4gICAgdGhpcy5feWVhcnNFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMik7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl95ZWFyc0VkaXRCb3gpO1xuICAgIHRoaXMuX2luaXREYXRhKCk7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2luaXREYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fc3RvY2tDb2RlRWRpdEJveC5zZXRTdHJpbmcoXCIwMDAwMDFcIik7XG4gICAgcmV0dXJuIHRoaXMuX3llYXJzRWRpdEJveC5zZXRTdHJpbmcoXCI2XCIpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9jcmVhdGVFZGl0Qm94ID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciBlZGl0Qm94O1xuICAgIGVkaXRCb3ggPSBuZXcgY2MuRWRpdEJveChjYy5zaXplKDIwMCwgNTApKTtcbiAgICBlZGl0Qm94LnNldFBvc2l0aW9uKG5vZGUuZ2V0UG9zaXRpb24oKSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dE1vZGUoY2MuRURJVEJPWF9JTlBVVF9NT0RFX1NJTkdMRUxJTkUpO1xuICAgIGVkaXRCb3guc2V0UmV0dXJuVHlwZShjYy5LRVlCT0FSRF9SRVRVUk5UWVBFX0RPTkUpO1xuICAgIGVkaXRCb3guc2V0SW5wdXRGbGFnKGNjLkVESVRCT1hfSU5QVVRfRkxBR19JTklUSUFMX0NBUFNfU0VOVEVOQ0UpO1xuICAgIGVkaXRCb3guc2V0TWF4TGVuZ3RoKDEzKTtcbiAgICBlZGl0Qm94LnNldEZvbnQoXCJBcmlhbFwiLCAyNik7XG4gICAgZWRpdEJveC5zZXRGb250Q29sb3IoY2MuY29sb3IoMTAwLCAxMDAsIDI1NSwgMjU1KSk7XG4gICAgcmV0dXJuIGVkaXRCb3g7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuc2hvd1Jlc3VsdCA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLmNjYl9yZXN1bHQuc2V0U3RyaW5nKHJlc3VsdCk7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25DYWxjID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0b2NrQ29kZSwgeWVhcnM7XG4gICAgc3RvY2tDb2RlID0gdGhpcy5fc3RvY2tDb2RlRWRpdEJveC5nZXRTdHJpbmcoKTtcbiAgICB5ZWFycyA9IHRoaXMuX3llYXJzRWRpdEJveC5nZXRTdHJpbmcoKTtcbiAgICByZXR1cm4gY2MubG9hZGVyLmxvYWRKc29uKFwicmVzLzMwMF9qc29uL1wiICsgc3RvY2tDb2RlICsgXCIuanNvblwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICBfdGhpcy5zaG93UmVzdWx0KFwiXCIpO1xuICAgICAgICByZXR1cm4gZXZlbnRNYW5hZ2VyLnNlbmQoZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHllYXJzOiB5ZWFycyxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2hvd1Jlc3VsdChzdHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBjYy5CdWlsZGVyUmVhZGVyLnJlZ2lzdGVyQ29udHJvbGxlcihcIkFya01haW5EaWFsb2dcIiwgbmV3IEFya01haW5EaWFsb2coKSk7XG5cbiAgcmV0dXJuIEFya01haW5EaWFsb2c7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQnVpbGRlclJlYWRlci5sb2FkKFwicmVzL21haW4uY2NiaVwiKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTJOaVZtbGxkeTlCY210TllXbHVSR2xoYkc5bkxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMk5qWWxacFpYY3ZRWEpyVFdGcGJrUnBZV3h2Wnk1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlFXVXNUMEZCUVN4RFFVRlJMR2xEUVVGU096dEJRVU5tTEZWQlFVRXNSMEZCWVN4UFFVRkJMRU5CUVZFc0swSkJRVkk3TzBGQlJXSXNWVUZCUVN4SFFVRmhPenRCUVVOaUxHTkJRVUVzUjBGQmFVSTdPMEZCUTJwQ0xGZEJRVUVzUjBGQll6czdRVUZEWkN4dlFrRkJRU3hIUVVGMVFqczdRVUZEZGtJc1kwRkJRU3hIUVVGcFFqczdRVUZEYWtJc1lVRkJRU3hIUVVGblFqczdRVUZGVmpzN096QkNRVU5HTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVUU3U1VGRFpDeEpRVUZETEVOQlFVRXNVMEZCUkN4SFFVRmhPMWRCUTJJc1NVRkJReXhEUVVGQkxFbEJRVVFzUTBGQlFUdEZRVVpqT3pzd1FrRkpiRUlzU1VGQlFTeEhRVUZOTEZOQlFVRTdTVUZEUml4SlFVRkRMRU5CUVVFc2FVSkJRVVFzUjBGQmNVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTNKQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzYVVKQlFYQkNPMGxCUlVFc1NVRkJReXhEUVVGQkxHRkJRVVFzUjBGQmFVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTJwQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzWVVGQmNFSTdTVUZGUVN4SlFVRkRMRU5CUVVFc1UwRkJSQ3hEUVVGQk8wVkJVRVU3T3pCQ1FWVk9MRk5CUVVFc1IwRkJWeXhUUVVGQk8wbEJRMUFzU1VGQlF5eERRVUZCTEdsQ1FVRnBRaXhEUVVGRExGTkJRVzVDTEVOQlFUWkNMRkZCUVRkQ08xZEJRMEVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVhsQ0xFZEJRWHBDTzBWQlJrODdPekJDUVVsWUxHTkJRVUVzUjBGQlowSXNVMEZCUXl4SlFVRkVPMEZCUTFvc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZTeEpRVUZKTEVWQlFVVXNRMEZCUXl4UFFVRlFMRU5CUVdVc1JVRkJSU3hEUVVGRExFbEJRVWdzUTBGQlVTeEhRVUZTTEVWQlFXRXNSVUZCWWl4RFFVRm1PMGxCUTFZc1QwRkJUeXhEUVVGRExGZEJRVklzUTBGQmIwSXNTVUZCU1N4RFFVRkRMRmRCUVV3c1EwRkJRU3hEUVVGd1FqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5dzJRa0ZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zWVVGQlVpeERRVUZ6UWl4RlFVRkZMRU5CUVVNc2QwSkJRWHBDTzBsQlEwRXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzUlVGQlJTeERRVUZETEhkRFFVRjRRanRKUVVOQkxFOUJRVThzUTBGQlF5eFpRVUZTTEVOQlFYRkNMRVZCUVhKQ08wbEJRMEVzVDBGQlR5eERRVUZETEU5QlFWSXNRMEZCWjBJc1QwRkJhRUlzUlVGQmVVSXNSVUZCZWtJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRkZMRU5CUVVNc1MwRkJTQ3hEUVVGVExFZEJRVlFzUlVGQll5eEhRVUZrTEVWQlFXMUNMRWRCUVc1Q0xFVkJRWGRDTEVkQlFYaENMRU5CUVhKQ08wRkJRMEVzVjBGQlR6dEZRVlJMT3pzd1FrRlhhRUlzVlVGQlFTeEhRVUZaTEZOQlFVTXNUVUZCUkR0WFFVTlNMRWxCUVVNc1EwRkJRU3hWUVVGVkxFTkJRVU1zVTBGQldpeERRVUZ6UWl4TlFVRjBRanRGUVVSUk96c3dRa0ZIV2l4TlFVRkJMRWRCUVZFc1UwRkJRVHRCUVVOS0xGRkJRVUU3U1VGQlFTeFRRVUZCTEVkQlFWa3NTVUZCUXl4RFFVRkJMR2xDUVVGcFFpeERRVUZETEZOQlFXNUNMRU5CUVVFN1NVRkRXaXhMUVVGQkxFZEJRVkVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVVFN1YwRkRVaXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1pVRkJRU3hIUVVGblFpeFRRVUZvUWl4SFFVRXdRaXhQUVVFM1F5eEZRVUZ4UkN4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdVVUZEYWtRc1MwRkJReXhEUVVGQkxGVkJRVVFzUTBGQldTeEZRVUZhTzJWQlEwRXNXVUZCV1N4RFFVRkRMRWxCUVdJc1EwRkJhMElzVlVGQlZTeERRVUZETEdWQlFUZENMRVZCUTBrN1ZVRkJRU3hKUVVGQkxFVkJRVTBzU1VGQlRqdFZRVU5CTEV0QlFVRXNSVUZCVVN4TFFVUlNPMVZCUlVFc1VVRkJRU3hGUVVGVkxGTkJRVU1zUjBGQlJEdHRRa0ZEVGl4TFFVRkRMRU5CUVVFc1ZVRkJSQ3hEUVVGWkxFZEJRVm83VlVGRVRTeERRVVpXTzFOQlJFbzdUVUZHYVVRN1NVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTEVOQlFYSkVPMFZCU0VrN08wVkJZVklzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGxRVVJLTEVWQlJVa3NTVUZCU1N4aFFVRktMRU5CUVVFc1EwRkdTanM3T3pzN08wRkJTMG9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhsUVVGMFFpSjlcbiIsInZhciBBUktfTkVUX0FTU0VUUywgQVJLX1JFVEFJTl9QUk9GSVRTLCBBUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUsIEFSS19ST0UsIEdhbWVMb2dpYywgVXNlckRhdGEsIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcywgZ19sb2dfdGFibGUsIGdfbWF4U3RhdGlzdGljc1llYXJzLCBnX3N0YXRpc3RpY3NZZWFycywgbmVlZENhbGNJdGVtLCBzY2VuZU1hbmFnZXIsXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuc2NlbmVNYW5hZ2VyID0gcmVxdWlyZSgnLi4vdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZScpO1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5Vc2VyRGF0YSA9IHJlcXVpcmUoJy4uL21vZGVsL0Fya1VzZXJEYXRhLmNvZmZlZScpO1xuXG5nX3N0YXRpc3RpY3NZZWFycyA9IDU7XG5cbmdfbWF4U3RhdGlzdGljc1llYXJzID0gNjtcblxubmVlZENhbGNJdGVtID0ge1xuICBcInJlY2VpdmFibGVzXCI6IFwi5bqU5pS26LSm5qy+KOWFgylcIixcbiAgXCJkZXBvc2l0UmVjZWl2ZWRcIjogXCLpooTmlLbotKbmrL4o5YWDKVwiLFxuICBcInNob3J0TG9hblwiOiBcIuefreacn+WAn+asvijlhYMpXCIsXG4gIFwibG9uZ0xvYW5cIjogXCLplb/mnJ/lgJ/mrL4o5YWDKVwiXG59O1xuXG5BUktfUkVUQUlOX1BST0ZJVFMgPSBcIuW9kuWxnuS6juavjeWFrOWPuOiCoeS4nOeahOe7vOWQiOaUtuebiuaAu+minSjlhYMpXCI7XG5cbkFSS19ORVRfQVNTRVRTID0gXCLlvZLlsZ7kuo7mr43lhazlj7jogqHkuJzmnYPnm4rlkIjorqEo5YWDKVwiO1xuXG5BUktfUk9FID0gXCLlh4DotYTkuqfmlLbnm4rnjodcIjtcblxuQVJLX1JFVEFJTl9QUk9GSVRTX0FERF9SQVRFID0gXCLlh4DliKnmtqblkIzmr5Tlop7plb/njodcIjtcblxuZ19sb2dfdGFibGUgPSBbXTtcblxuR2FtZUxvZ2ljID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lTG9naWMoKSB7fVxuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5saXN0ZW4oZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBnX2xvZ190YWJsZSA9IFtdO1xuICAgICAgICBnX21heFN0YXRpc3RpY3NZZWFycyA9IG9iai55ZWFycztcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmouY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IG9iai5jYWxsYmFjayhfdGhpcy5fZ2V0UmVzdWx0KG9iai5kYXRhKSkgOiB2b2lkIDA7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZXN1bHQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGNhbGNJdGVtLCB0b3RhbEFzc2V0c0luZGV4LCB0b3RhbFNjb3JlLCB2YWx1ZTtcbiAgICB0b3RhbFNjb3JlID0gMDtcbiAgICB0b3RhbEFzc2V0c0luZGV4ID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBBUktfTkVUX0FTU0VUUyk7XG4gICAgZ19zdGF0aXN0aWNzWWVhcnMgPSB0aGlzLl9nZXRTdGF0aXN0aWNzWWVhcnMoZGF0YSwgdG90YWxBc3NldHNJbmRleCk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuaAu+i1hOS6pyBcIiArICh0aGlzLl9nZXRTaG93TnVtYmVyKGRhdGFbdG90YWxBc3NldHNJbmRleF1bMV0pKSArIFwiLCDnu5/orqHml7bpl7Q6XCIgKyBnX3N0YXRpc3RpY3NZZWFycyArIFwi5bm0XCIpO1xuICAgIGZvciAoY2FsY0l0ZW0gaW4gbmVlZENhbGNJdGVtKSB7XG4gICAgICBpZiAoIWhhc1Byb3AuY2FsbChuZWVkQ2FsY0l0ZW0sIGNhbGNJdGVtKSkgY29udGludWU7XG4gICAgICB2YWx1ZSA9IG5lZWRDYWxjSXRlbVtjYWxjSXRlbV07XG4gICAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2NhbGNTY29yZShkYXRhLCBjYWxjSXRlbSwgdmFsdWUsIHRvdGFsQXNzZXRzSW5kZXgpO1xuICAgIH1cbiAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2dldFJldGFpbmVkUHJvZml0c1Njb3JlKGRhdGEpO1xuICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fZ2V0Um9lU2NvcmUoZGF0YSk7XG4gICAgdG90YWxTY29yZSA9IE1hdGguY2VpbCh0b3RhbFNjb3JlKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5oC75YiGOiBcIiArIHRvdGFsU2NvcmUpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShnX2xvZ190YWJsZSwgbnVsbCwgXCJcXHRcIik7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0UmVjZWl2ZVNjb3JlID0gZnVuY3Rpb24ocGVyY2VudCkge1xuICAgIHJldHVybiAtcGVyY2VudDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRTY29yZSA9IGZ1bmN0aW9uKHR5cGUsIHBlcmNlbnQpIHtcbiAgICB2YXIgc2NvcmU7XG4gICAgc2NvcmUgPSAwO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcInJlY2VpdmFibGVzXCI6XG4gICAgICAgIHNjb3JlID0gdGhpcy5fZ2V0UmVjZWl2ZVNjb3JlKHBlcmNlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkZXBvc2l0UmVjZWl2ZWRcIjpcbiAgICAgICAgc2NvcmUgPSBwZXJjZW50O1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gXCJzaG9ydExvYW5cIiB8fCB0eXBlID09PSBcImxvbmdMb2FuXCIpIHtcbiAgICAgIHNjb3JlID0gNDAgLSBwZXJjZW50O1xuICAgIH1cbiAgICByZXR1cm4gc2NvcmU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VmFsaWROdW1iZXIgPSBmdW5jdGlvbihudW1iZXJTdHIpIHtcbiAgICB2YXIgbnVtO1xuICAgIGlmICh0eXBlb2YgbnVtYmVyU3RyID09PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gbnVtYmVyU3RyO1xuICAgIH1cbiAgICBudW0gPSBudW1iZXJTdHIudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gTnVtYmVyKG51bSk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VHlwZVJvd051bSA9IGZ1bmN0aW9uKGRhdGEsIHR5cGVTdHIpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGxlbiwgcm93LCB0eXBlTnVtO1xuICAgIHR5cGVOdW0gPSAwO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICByb3cgPSBkYXRhW2luZGV4XTtcbiAgICAgIGlmIChyb3dbMF0uaW5kZXhPZih0eXBlU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgdHlwZU51bSA9IGluZGV4O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVOdW07XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0Q29tcG91bmRSYXRlID0gZnVuY3Rpb24oYWRkUmF0ZSwgdGltZSkge1xuICAgIHJldHVybiBNYXRoLmV4cCgxIC8gdGltZSAqIE1hdGgubG9nKGFkZFJhdGUpKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9jYWxjU2NvcmUgPSBmdW5jdGlvbihkYXRhLCB0eXBlLCB0eXBlU3RyLCB0b3RhbEFzc2V0c0luZGV4KSB7XG4gICAgdmFyIGF2ZXJhZ2VQZXJjZW50LCBpLCBpbmZvVGFibGUsIHJlZiwgc2NvcmUsIHRvdGFsUGVyY2VudCwgdHlwZU51bSwgeWVhckluZGV4O1xuICAgIHR5cGVOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIHR5cGVTdHIpO1xuICAgIHRvdGFsUGVyY2VudCA9IDA7XG4gICAgaW5mb1RhYmxlID0gW107XG4gICAgaW5mb1RhYmxlLnB1c2goZGF0YVt0eXBlTnVtXVswXSk7XG4gICAgZm9yICh5ZWFySW5kZXggPSBpID0gMSwgcmVmID0gZ19zdGF0aXN0aWNzWWVhcnM7IDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZjsgeWVhckluZGV4ID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIGlmIChkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0gPT0gbnVsbCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZm9UYWJsZS5wdXNoKHRoaXMuX2dldFNob3dOdW1iZXIodGhpcy5fZ2V0VmFsaWROdW1iZXIoZGF0YVt0eXBlTnVtXVt5ZWFySW5kZXhdKSkpO1xuICAgICAgdG90YWxQZXJjZW50ICs9IHRoaXMuX2dldFZhbGlkTnVtYmVyKGRhdGFbdHlwZU51bV1beWVhckluZGV4XSkgLyB0aGlzLl9nZXRWYWxpZE51bWJlcihkYXRhW3RvdGFsQXNzZXRzSW5kZXhdW3llYXJJbmRleF0pICogMTAwO1xuICAgIH1cbiAgICBhdmVyYWdlUGVyY2VudCA9IHRvdGFsUGVyY2VudCAvIGdfc3RhdGlzdGljc1llYXJzO1xuICAgIHNjb3JlID0gdGhpcy5fZ2V0U2NvcmUodHlwZSwgYXZlcmFnZVBlcmNlbnQpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCJcIiArIGluZm9UYWJsZSk7XG4gICAgZ19sb2dfdGFibGUucHVzaChuZWVkQ2FsY0l0ZW1bdHlwZV0gKyBcIiDmr5Tkvos6XCIgKyAoYXZlcmFnZVBlcmNlbnQudG9GaXhlZCgyKSkgKyBcIiUsIOWIhuaVsCA6XCIgKyAoc2NvcmUudG9GaXhlZCgyKSkpO1xuICAgIHJldHVybiBzY29yZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRTdGF0aXN0aWNzWWVhcnMgPSBmdW5jdGlvbihkYXRhLCB0b3RhbEFzc2V0c0luZGV4KSB7XG4gICAgdmFyIGxlbmd0aCwgdG90YWxBc3NldHM7XG4gICAgdG90YWxBc3NldHMgPSBkYXRhW3RvdGFsQXNzZXRzSW5kZXhdLmZpbHRlcihmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gYSA+IDA7XG4gICAgfSk7XG4gICAgbGVuZ3RoID0gMDtcbiAgICBpZiAodG90YWxBc3NldHMubGVuZ3RoID4gZ19tYXhTdGF0aXN0aWNzWWVhcnMpIHtcbiAgICAgIGxlbmd0aCA9IGdfbWF4U3RhdGlzdGljc1llYXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b3RhbEFzc2V0cy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VGFibGVCeU5hbWUgPSBmdW5jdGlvbihkYXRhLCBuYW1lKSB7XG4gICAgdmFyIHJvd051bSwgdGFibGU7XG4gICAgcm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBuYW1lKTtcbiAgICB0YWJsZSA9IGRhdGFbcm93TnVtXS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPiAwO1xuICAgIH0pO1xuICAgIHJldHVybiB0YWJsZS5zbGljZSgwLCBnX21heFN0YXRpc3RpY3NZZWFycyk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0UmV0YWluZWRQcm9maXRzU2NvcmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGFkZFJldGFpbmVkUHJvZml0cywgYWxsUmV0YWluZWRQcm9maXRzLCBhdmVyYWdlUGVyY2VudDtcbiAgICB0aGlzLl9nZXRSZXRhaW5lZFByb2ZpdHNBZGRSYXRlKGRhdGEpO1xuICAgIGFsbFJldGFpbmVkUHJvZml0cyA9IHRoaXMuX2dldFRhYmxlQnlOYW1lKGRhdGEsIEFSS19SRVRBSU5fUFJPRklUUyk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuWIneWni+WHgOWIqea2pu+8mlwiICsgKHRoaXMuX2dldFNob3dOdW1iZXIoYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXSkpICsgXCIs5b2T5YmN5YeA5Yip5ramOlwiICsgKHRoaXMuX2dldFNob3dOdW1iZXIoYWxsUmV0YWluZWRQcm9maXRzWzBdKSkpO1xuICAgIGFkZFJldGFpbmVkUHJvZml0cyA9IGFsbFJldGFpbmVkUHJvZml0c1swXSAvIGFsbFJldGFpbmVkUHJvZml0c1thbGxSZXRhaW5lZFByb2ZpdHMubGVuZ3RoIC0gMV07XG4gICAgYXZlcmFnZVBlcmNlbnQgPSAodGhpcy5fZ2V0Q29tcG91bmRSYXRlKGFkZFJldGFpbmVkUHJvZml0cywgZ19zdGF0aXN0aWNzWWVhcnMpIC0gMSkgKiAxMDA7XG4gICAgZ19sb2dfdGFibGUucHVzaChnX3N0YXRpc3RpY3NZZWFycyArIFwi5bm0LOWHgOWIqea2puWkjeWQiOWinumVv+mAn+W6pjpcIiArIChhdmVyYWdlUGVyY2VudC50b0ZpeGVkKDIpKSArIFwiJVwiKTtcbiAgICByZXR1cm4gYXZlcmFnZVBlcmNlbnQ7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0UmV0YWluZWRQcm9maXRzQWRkUmF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgaSwgcmF0ZUFkZFRhYmxlLCByYXRlSW5kZXgsIHJlZiwgcm93TnVtO1xuICAgIHJvd051bSA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgQVJLX1JFVEFJTl9QUk9GSVRTX0FERF9SQVRFKTtcbiAgICByYXRlQWRkVGFibGUgPSBbXTtcbiAgICBmb3IgKHJhdGVJbmRleCA9IGkgPSAxLCByZWYgPSBnX3N0YXRpc3RpY3NZZWFyczsgMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyByYXRlSW5kZXggPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgcmF0ZUFkZFRhYmxlLnB1c2goZGF0YVtyb3dOdW1dW3JhdGVJbmRleF0pO1xuICAgIH1cbiAgICByZXR1cm4gZ19sb2dfdGFibGUucHVzaChBUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUgKyBcIjpcIiArIHJhdGVBZGRUYWJsZSk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0Um9lU2NvcmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGF2ZXJhZ2VSb2UsIGNvdW50LCBpLCByZWYsIHJvZSwgcm9lUm93TnVtLCByb2VUYWJsZSwgcm9lVmFsdWUsIHRvdGFsUm9lO1xuICAgIHJvZVJvd051bSA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgQVJLX1JPRSk7XG4gICAgdG90YWxSb2UgPSAwO1xuICAgIGNvdW50ID0gMDtcbiAgICByb2VUYWJsZSA9IFtdO1xuICAgIGZvciAocm9lVmFsdWUgPSBpID0gMSwgcmVmID0gZ19zdGF0aXN0aWNzWWVhcnM7IDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZjsgcm9lVmFsdWUgPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhW3JvZVJvd051bV1bcm9lVmFsdWVdICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcm9lID0gZGF0YVtyb2VSb3dOdW1dW3JvZVZhbHVlXTtcbiAgICAgIHJvZVRhYmxlLnB1c2gocm9lKTtcbiAgICAgIHJvZSA9IE51bWJlcihyb2UucmVwbGFjZShcIiVcIiwgXCJcIikpO1xuICAgICAgdG90YWxSb2UgKz0gcm9lO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgZ19sb2dfdGFibGUucHVzaChcIlJPRTpcIiArIHJvZVRhYmxlKTtcbiAgICBhdmVyYWdlUm9lID0gdG90YWxSb2UgLyBjb3VudDtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5bmz5Z2HUk9FOlwiICsgKGF2ZXJhZ2VSb2UudG9GaXhlZCgyKSkpO1xuICAgIHJldHVybiBhdmVyYWdlUm9lO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFNob3dOdW1iZXIgPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgICByZXR1cm4gKChudW1iZXIgLyAxMDAwMDAwMDApLnRvRml4ZWQoMikpICsgXCIg5Lq/XCI7XG4gIH07XG5cbiAgcmV0dXJuIEdhbWVMb2dpYztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lTG9naWM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyOXVkSEp2YkM5QmNtdEhZVzFsVEc5bmFXTXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTI5dWRISnZiQzlCY210SFlXMWxURzluYVdNdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUVzZVUxQlFVRTdSVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRV3RDTEU5QlFVRXNRMEZCVVN4cFEwRkJVanM3UVVGRGJFSXNXVUZCUVN4SFFVRnJRaXhQUVVGQkxFTkJRVkVzYVVOQlFWSTdPMEZCUTJ4Q0xGVkJRVUVzUjBGQmEwSXNUMEZCUVN4RFFVRlJMQ3RDUVVGU096dEJRVU5zUWl4UlFVRkJMRWRCUVd0Q0xFOUJRVUVzUTBGQlVTdzJRa0ZCVWpzN1FVRkZiRUlzYVVKQlFVRXNSMEZCYjBJN08wRkJRM0JDTEc5Q1FVRkJMRWRCUVhWQ096dEJRVVYyUWl4WlFVRkJMRWRCUVdVN1JVRkRXQ3hoUVVGQkxFVkJRV1VzVTBGRVNqdEZRVVZZTEdsQ1FVRkJMRVZCUVc5Q0xGTkJSbFE3UlVGSFdDeFhRVUZCTEVWQlFXTXNVMEZJU0R0RlFVbFlMRlZCUVVFc1JVRkJZU3hUUVVwR096czdRVUZQWml4clFrRkJRU3hIUVVGeFFqczdRVUZEY2tJc1kwRkJRU3hIUVVGclFqczdRVUZEYkVJc1QwRkJRU3hIUVVGVk96dEJRVU5XTERKQ1FVRkJMRWRCUVRoQ096dEJRVVU1UWl4WFFVRkJMRWRCUVdNN08wRkJSMUk3T3p0elFrRkRSaXhKUVVGQkxFZEJRVTBzVTBGQlFUdFhRVU5HTEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVVFN1JVRkVSVHM3YzBKQlIwNHNaVUZCUVN4SFFVRnBRaXhUUVVGQk8xZEJRMklzV1VGQldTeERRVUZETEUxQlFXSXNRMEZCYjBJc1ZVRkJWU3hEUVVGRExHVkJRUzlDTEVWQlFXZEVMRU5CUVVFc1UwRkJRU3hMUVVGQk8yRkJRVUVzVTBGQlF5eEhRVUZFTzFGQlF6VkRMRmRCUVVFc1IwRkJZenRSUVVOa0xHOUNRVUZCTEVkQlFYVkNMRWRCUVVjc1EwRkJRenR2UkVGRE0wSXNSMEZCUnl4RFFVRkRMRk5CUVZVc1MwRkJReXhEUVVGQkxGVkJRVVFzUTBGQldTeEhRVUZITEVOQlFVTXNTVUZCYUVJN1RVRklPRUk3U1VGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJMRU5CUVdoRU8wVkJSR0U3TzNOQ1FVOXFRaXhWUVVGQkxFZEJRVmtzVTBGQlF5eEpRVUZFTzBGQlExSXNVVUZCUVR0SlFVRkJMRlZCUVVFc1IwRkJZVHRKUVVOaUxHZENRVUZCTEVkQlFXMUNMRWxCUVVNc1EwRkJRU3hqUVVGRUxFTkJRV2RDTEVsQlFXaENMRVZCUVhOQ0xHTkJRWFJDTzBsQlEyNUNMR2xDUVVGQkxFZEJRVzlDTEVsQlFVTXNRMEZCUVN4dFFrRkJSQ3hEUVVGeFFpeEpRVUZ5UWl4RlFVRXlRaXhuUWtGQk0wSTdTVUZEY0VJc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmFVSXNUVUZCUVN4SFFVRk5MRU5CUVVNc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCU3l4RFFVRkJMR2RDUVVGQkxFTkJRV3RDTEVOQlFVRXNRMEZCUVN4RFFVRjJReXhEUVVGRUxFTkJRVTRzUjBGQmEwUXNVMEZCYkVRc1IwRkJNa1FzYVVKQlFUTkVMRWRCUVRaRkxFZEJRVGxHTzBGQlEwRXNVMEZCUVN4M1FrRkJRVHM3TzAxQlEwa3NWVUZCUVN4SlFVRmpMRWxCUVVNc1EwRkJRU3hWUVVGRUxFTkJRVmtzU1VGQldpeEZRVUZyUWl4UlFVRnNRaXhGUVVFMFFpeExRVUUxUWl4RlFVRnRReXhuUWtGQmJrTTdRVUZFYkVJN1NVRkhRU3hWUVVGQkxFbEJRV01zU1VGQlF5eERRVUZCTEhkQ1FVRkVMRU5CUVRCQ0xFbEJRVEZDTzBsQlEyUXNWVUZCUVN4SlFVRmpMRWxCUVVNc1EwRkJRU3haUVVGRUxFTkJRV01zU1VGQlpEdEpRVU5rTEZWQlFVRXNSMEZCWVN4SlFVRkpMRU5CUVVNc1NVRkJUQ3hEUVVGVkxGVkJRVlk3U1VGRFlpeFhRVUZYTEVOQlFVTXNTVUZCV2l4RFFVRnBRaXhOUVVGQkxFZEJRVThzVlVGQmVFSTdRVUZEUVN4WFFVRlBMRWxCUVVrc1EwRkJReXhUUVVGTUxFTkJRV1VzVjBGQlppeEZRVUUwUWl4SlFVRTFRaXhGUVVGclF5eEpRVUZzUXp0RlFWcERPenR6UWtGaldpeG5Ra0ZCUVN4SFFVRnJRaXhUUVVGRExFOUJRVVE3UVVGRFpDeFhRVUZQTEVOQlFVTTdSVUZFVFRzN2MwSkJSMnhDTEZOQlFVRXNSMEZCV1N4VFFVRkRMRWxCUVVRc1JVRkJUeXhQUVVGUU8wRkJRMUlzVVVGQlFUdEpRVUZCTEV0QlFVRXNSMEZCVVR0QlFVTlNMRmxCUVU4c1NVRkJVRHRCUVVGQkxGZEJRMU1zWVVGRVZEdFJRVVZSTEV0QlFVRXNSMEZCVVN4SlFVRkRMRU5CUVVFc1owSkJRVVFzUTBGQmEwSXNUMEZCYkVJN1FVRkVVRHRCUVVSVUxGZEJSMU1zYVVKQlNGUTdVVUZKVVN4TFFVRkJMRWRCUVZFN1FVRkthRUk3U1VGTlFTeEpRVUZITEVsQlFVRXNTMEZCVVN4WFFVRlNMRWxCUVhWQ0xFbEJRVUVzUzBGQlVTeFZRVUZzUXp0TlFVTkpMRXRCUVVFc1IwRkJVU3hGUVVGQkxFZEJRVXNzVVVGRWFrSTdPMEZCUlVFc1YwRkJUenRGUVZaRE96dHpRa0ZaV2l4bFFVRkJMRWRCUVd0Q0xGTkJRVU1zVTBGQlJEdEJRVU5rTEZGQlFVRTdTVUZCUVN4SlFVRnZRaXhQUVVGUExGTkJRVkFzUzBGQmNVSXNVVUZCZWtNN1FVRkJRU3hoUVVGUExGVkJRVkE3TzBsQlEwRXNSMEZCUVN4SFFVRk5MRk5CUVZNc1EwRkJReXhYUVVGV0xFTkJRVUU3UVVGRFRpeFhRVUZQTEUxQlFVRXNRMEZCVHl4SFFVRlFPMFZCU0U4N08zTkNRVXRzUWl4alFVRkJMRWRCUVdsQ0xGTkJRVU1zU1VGQlJDeEZRVUZQTEU5QlFWQTdRVUZEWWl4UlFVRkJPMGxCUVVFc1QwRkJRU3hIUVVGVk8wRkJRMVlzVTBGQlFTeHpSRUZCUVRzN1RVRkRTU3hKUVVGSExFZEJRVWtzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4UFFVRlFMRU5CUVdVc1QwRkJaaXhEUVVGQkxFdEJRVFpDTEVOQlFVTXNRMEZCYWtNN1VVRkRTU3hQUVVGQkxFZEJRVlU3UVVGRFZpeGpRVVpLT3p0QlFVUktPMEZCU1VFc1YwRkJUenRGUVU1Tk96dHpRa0ZSYWtJc1owSkJRVUVzUjBGQmEwSXNVMEZCUXl4UFFVRkVMRVZCUVZVc1NVRkJWanRCUVVOa0xGZEJRVThzU1VGQlNTeERRVUZETEVkQlFVd3NRMEZCVXl4RFFVRkJMRWRCUVVrc1NVRkJTaXhIUVVGWExFbEJRVWtzUTBGQlF5eEhRVUZNTEVOQlFWTXNUMEZCVkN4RFFVRndRanRGUVVSUE96dHpRa0ZKYkVJc1ZVRkJRU3hIUVVGaExGTkJRVU1zU1VGQlJDeEZRVUZQTEVsQlFWQXNSVUZCWVN4UFFVRmlMRVZCUVhOQ0xHZENRVUYwUWp0QlFVTlVMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNUMEZCZEVJN1NVRkRWaXhaUVVGQkxFZEJRV1U3U1VGRFppeFRRVUZCTEVkQlFWazdTVUZEV2l4VFFVRlRMRU5CUVVNc1NVRkJWaXhEUVVGbExFbEJRVXNzUTBGQlFTeFBRVUZCTEVOQlFWTXNRMEZCUVN4RFFVRkJMRU5CUVRkQ08wRkJRMEVzVTBGQmFVSXNORWRCUVdwQ08wMUJRMGtzU1VGQllTeG5RMEZCWWp0QlFVRkJMR05CUVVFN08wMUJRMEVzVTBGQlV5eERRVUZETEVsQlFWWXNRMEZCWlN4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeEpRVUZETEVOQlFVRXNaVUZCUkN4RFFVRnBRaXhKUVVGTExFTkJRVUVzVDBGQlFTeERRVUZUTEVOQlFVRXNVMEZCUVN4RFFVRXZRaXhEUVVGb1FpeERRVUZtTzAxQlEwRXNXVUZCUVN4SlFVRm5RaXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4SlFVRkxMRU5CUVVFc1QwRkJRU3hEUVVGVExFTkJRVUVzVTBGQlFTeERRVUV2UWl4RFFVRkJMRWRCUVRaRExFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFXbENMRWxCUVVzc1EwRkJRU3huUWtGQlFTeERRVUZyUWl4RFFVRkJMRk5CUVVFc1EwRkJlRU1zUTBGQk4wTXNSMEZCYlVjN1FVRklka2c3U1VGSlFTeGpRVUZCTEVkQlFXbENMRmxCUVVFc1IwRkJaVHRKUVVOb1F5eExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMRk5CUVVRc1EwRkJWeXhKUVVGWUxFVkJRV2xDTEdOQlFXcENPMGxCUTFJc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmFVSXNSVUZCUVN4SFFVRkhMRk5CUVhCQ08wbEJRMEVzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYjBJc1dVRkJZU3hEUVVGQkxFbEJRVUVzUTBGQlpDeEhRVUZ2UWl4TlFVRndRaXhIUVVGNVFpeERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRm1MRU5CUVhWQ0xFTkJRWFpDTEVOQlFVUXNRMEZCZWtJc1IwRkJiMFFzVTBGQmNFUXNSMEZCTkVRc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlRpeERRVUZqTEVOQlFXUXNRMEZCUkN4RFFVRXZSVHRCUVVOQkxGZEJRVTg3UlVGaVJUczdjMEpCWldJc2JVSkJRVUVzUjBGQmMwSXNVMEZCUXl4SlFVRkVMRVZCUVU4c1owSkJRVkE3UVVGRGJFSXNVVUZCUVR0SlFVRkJMRmRCUVVFc1IwRkJZeXhKUVVGTExFTkJRVUVzWjBKQlFVRXNRMEZCYVVJc1EwRkJReXhOUVVGMlFpeERRVUU0UWl4VFFVRkRMRU5CUVVRN1lVRkJUU3hEUVVGQkxFZEJRVWs3U1VGQlZpeERRVUU1UWp0SlFVTmtMRTFCUVVFc1IwRkJVenRKUVVOVUxFbEJRVWNzVjBGQlZ5eERRVUZETEUxQlFWb3NSMEZCY1VJc2IwSkJRWGhDTzAxQlEwa3NUVUZCUVN4SFFVRlRMSEZDUVVSaU8wdEJRVUVzVFVGQlFUdE5RVWRKTEUxQlFVRXNSMEZCVXl4WFFVRlhMRU5CUVVNc1QwRklla0k3TzBGQlNVRXNWMEZCVHp0RlFWQlhPenR6UWtGVGRFSXNaVUZCUVN4SFFVRnBRaXhUUVVGRExFbEJRVVFzUlVGQlR5eEpRVUZRTzBGQlEySXNVVUZCUVR0SlFVRkJMRTFCUVVFc1IwRkJVeXhKUVVGRExFTkJRVUVzWTBGQlJDeERRVUZuUWl4SlFVRm9RaXhGUVVGelFpeEpRVUYwUWp0SlFVTlVMRXRCUVVFc1IwRkJVU3hKUVVGTExFTkJRVUVzVFVGQlFTeERRVUZQTEVOQlFVTXNUVUZCWWl4RFFVRnZRaXhUUVVGRExFTkJRVVE3WVVGQlRTeERRVUZCTEVkQlFVazdTVUZCVml4RFFVRndRanRYUVVOU0xFdEJRVXNzUTBGQlF5eExRVUZPTEVOQlFWa3NRMEZCV2l4RlFVRmxMRzlDUVVGbU8wVkJTR0U3TzNOQ1FVMXFRaXgzUWtGQlFTeEhRVUV5UWl4VFFVRkRMRWxCUVVRN1FVRkRka0lzVVVGQlFUdEpRVUZCTEVsQlFVTXNRMEZCUVN3d1FrRkJSQ3hEUVVFMFFpeEpRVUUxUWp0SlFVTkJMR3RDUVVGQkxFZEJRWEZDTEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVdsQ0xFbEJRV3BDTEVWQlFYVkNMR3RDUVVGMlFqdEpRVU55UWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeFJRVUZCTEVkQlFWRXNRMEZCUXl4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeHJRa0ZCYlVJc1EwRkJRU3hyUWtGQmEwSXNRMEZCUXl4TlFVRnVRaXhIUVVFMFFpeERRVUUxUWl4RFFVRnVReXhEUVVGRUxFTkJRVklzUjBGQk5FVXNVMEZCTlVVc1IwRkJiMFlzUTBGQlF5eEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRm5RaXhyUWtGQmJVSXNRMEZCUVN4RFFVRkJMRU5CUVc1RExFTkJRVVFzUTBGQmNrYzdTVUZEUVN4clFrRkJRU3hIUVVGeFFpeHJRa0ZCYlVJc1EwRkJRU3hEUVVGQkxFTkJRVzVDTEVkQlFYZENMR3RDUVVGdFFpeERRVUZCTEd0Q1FVRnJRaXhEUVVGRExFMUJRVzVDTEVkQlFUUkNMRU5CUVRWQ08wbEJRMmhGTEdOQlFVRXNSMEZCYVVJc1EwRkJReXhKUVVGRExFTkJRVUVzWjBKQlFVUXNRMEZCYTBJc2EwSkJRV3hDTEVWQlFYTkRMR2xDUVVGMFF5eERRVUZCTEVkQlFUSkVMRU5CUVRWRUxFTkJRVUVzUjBGQmFVVTdTVUZEYkVZc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmIwSXNhVUpCUVVRc1IwRkJiVUlzWTBGQmJrSXNSMEZCWjBNc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlppeERRVUYxUWl4RFFVRjJRaXhEUVVGRUxFTkJRV2hETEVkQlFUSkVMRWRCUVRsRk8wRkJRMEVzVjBGQlR6dEZRVkJuUWpzN2MwSkJVek5DTERCQ1FVRkJMRWRCUVRKQ0xGTkJRVU1zU1VGQlJEdEJRVU4yUWl4UlFVRkJPMGxCUVVFc1RVRkJRU3hIUVVGVExFbEJRVU1zUTBGQlFTeGpRVUZFTEVOQlFXZENMRWxCUVdoQ0xFVkJRWE5DTERKQ1FVRjBRanRKUVVOVUxGbEJRVUVzUjBGQlpUdEJRVU5tTEZOQlFXbENMRFJIUVVGcVFqdE5RVU5KTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVd0Q0xFbEJRVXNzUTBGQlFTeE5RVUZCTEVOQlFWRXNRMEZCUVN4VFFVRkJMRU5CUVM5Q08wRkJSRW83VjBGRlFTeFhRVUZYTEVOQlFVTXNTVUZCV2l4RFFVRnZRaXd5UWtGQlJDeEhRVUUyUWl4SFFVRTNRaXhIUVVGblF5eFpRVUZ1UkR0RlFVeDFRanM3YzBKQlVUTkNMRmxCUVVFc1IwRkJaU3hUUVVGRExFbEJRVVE3UVVGRFdDeFJRVUZCTzBsQlFVRXNVMEZCUVN4SFFVRlpMRWxCUVVNc1EwRkJRU3hqUVVGRUxFTkJRV2RDTEVsQlFXaENMRVZCUVhOQ0xFOUJRWFJDTzBsQlExb3NVVUZCUVN4SFFVRlhPMGxCUTFnc1MwRkJRU3hIUVVGUk8wbEJRMUlzVVVGQlFTeEhRVUZYTzBGQlExZ3NVMEZCWjBJc01FZEJRV2hDTzAxQlEwa3NTVUZCV1N4UFFVRlBMRWxCUVVzc1EwRkJRU3hUUVVGQkxFTkJRVmNzUTBGQlFTeFJRVUZCTEVOQlFYWkNMRXRCUVhWRExGRkJRVzVFTzBGQlFVRXNhVUpCUVVFN08wMUJRMEVzUjBGQlFTeEhRVUZOTEVsQlFVc3NRMEZCUVN4VFFVRkJMRU5CUVZjc1EwRkJRU3hSUVVGQk8wMUJRM1JDTEZGQlFWRXNRMEZCUXl4SlFVRlVMRU5CUVdNc1IwRkJaRHROUVVOQkxFZEJRVUVzUjBGQlRTeE5RVUZCTEVOQlFVOHNSMEZCUnl4RFFVRkRMRTlCUVVvc1EwRkJXU3hIUVVGYUxFVkJRV2xDTEVWQlFXcENMRU5CUVZBN1RVRkRUaXhSUVVGQkxFbEJRVms3VFVGRFdpeExRVUZCTzBGQlRrbzdTVUZQUVN4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeE5RVUZCTEVkQlFVOHNVVUZCZUVJN1NVRkRRU3hWUVVGQkxFZEJRV0VzVVVGQlFTeEhRVUZYTzBsQlEzaENMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEZGQlFVRXNSMEZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGWUxFTkJRVzFDTEVOQlFXNUNMRU5CUVVRc1EwRkJla0k3UVVGRFFTeFhRVUZQTzBWQlprazdPM05DUVdsQ1ppeGpRVUZCTEVkQlFXbENMRk5CUVVNc1RVRkJSRHRCUVVOaUxGZEJRVk1zUTBGQlF5eERRVUZETEUxQlFVRXNSMEZCVXl4VFFVRldMRU5CUVc5Q0xFTkJRVU1zVDBGQmNrSXNRMEZCTmtJc1EwRkJOMElzUTBGQlJDeERRVUZCTEVkQlFXbERPMFZCUkRkQ096czdPenM3UVVGSGNrSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIEV2ZW50TWFuYWdlcjtcblxuRXZlbnRNYW5hZ2VyID0ge1xuICBzZW5kOiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICB2YXIgZXZlbnQ7XG4gICAgZXZlbnQgPSBuZXcgY2MuRXZlbnRDdXN0b20oZXZlbnROYW1lKTtcbiAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgZXZlbnQuc2V0VXNlckRhdGEoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBjYy5ldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0sXG4gIGxpc3RlbjogZnVuY3Rpb24oZXZlbnROYW1lLCBsaXN0ZW5GdW5jLCBub2RlT3JQcmlvcml0eSkge1xuICAgIHZhciBjY0xpc3RlbmVyO1xuICAgIGlmIChub2RlT3JQcmlvcml0eSA9PSBudWxsKSB7XG4gICAgICBub2RlT3JQcmlvcml0eSA9IDE7XG4gICAgfVxuICAgIGNjTGlzdGVuZXIgPSBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZSh7XG4gICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00sXG4gICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gbGlzdGVuRnVuYyhldmVudC5nZXRVc2VyRGF0YSgpLCBldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihjY0xpc3RlbmVyLCBub2RlT3JQcmlvcml0eSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5STllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyVjJaVzUwTDBGeWEwVjJaVzUwVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlF5eFRRVUZFTEVWQlFWa3NTVUZCV2p0QlFVTkdMRkZCUVVFN1NVRkJRU3hMUVVGQkxFZEJRVkVzU1VGQlNTeEZRVUZGTEVOQlFVTXNWMEZCVUN4RFFVRnRRaXhUUVVGdVFqdEpRVU5TTEVsQlFVa3NTVUZCUVN4TFFVRlJMRWxCUVZvN1RVRkRTU3hMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZyUWl4SlFVRnNRaXhGUVVSS096dFhRVVZCTEVWQlFVVXNRMEZCUXl4WlFVRlpMRU5CUVVNc1lVRkJhRUlzUTBGQk9FSXNTMEZCT1VJN1JVRktSU3hEUVVGT08wVkJTMEVzVFVGQlFTeEZRVUZSTEZOQlFVTXNVMEZCUkN4RlFVRlpMRlZCUVZvc1JVRkJkMElzWTBGQmVFSTdRVUZEU2l4UlFVRkJPenROUVVGQkxHbENRVUZyUWpzN1NVRkRiRUlzVlVGQlFTeEhRVUZoTEVWQlFVVXNRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJha0lzUTBGRFZEdE5RVUZCTEV0QlFVRXNSVUZCVHl4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRWGhDTzAxQlEwRXNVMEZCUVN4RlFVRlhMRk5CUkZnN1RVRkZRU3hSUVVGQkxFVkJRVlVzVTBGQlF5eExRVUZFTzBGQlEwNHNaVUZCVHl4VlFVRkJMRU5CUVZjc1MwRkJTeXhEUVVGRExGZEJRVTRzUTBGQlFTeERRVUZZTEVWQlFXZERMRXRCUVdoRE8wMUJSRVFzUTBGR1ZqdExRVVJUTzFkQlRXSXNSVUZCUlN4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGb1FpeERRVUUwUWl4VlFVRTFRaXhGUVVGM1F5eGpRVUY0UXp0RlFWSkpMRU5CVEZJN096dEJRV05LTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBFdmVudE5hbWVzO1xuXG5FdmVudE5hbWVzID0ge1xuICBHQU1FX1NUQVJUOiBcImdhbWUuc3RhcnRcIixcbiAgR0FNRV9FTkQ6IFwiZ2FtZS5lbmRcIixcbiAgR0FNRV9ORVhUX0xFVkVMOiBcImdhbWUubmV4dC5sZXZlbFwiLFxuICBHQU1FX0dFVF9SRVNVTFQ6IFwiZ2FtZS5nZXQucmVzdWx0XCJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnROYW1lcztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WlhabGJuUXZRWEpyUlhabGJuUk9ZVzFsY3k1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OWxkbVZ1ZEM5QmNtdEZkbVZ1ZEU1aGJXVnpMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZEU1R0RlFVRkJMRlZCUVVFc1JVRkJhMElzV1VGQmJFSTdSVUZEUVN4UlFVRkJMRVZCUVd0Q0xGVkJSR3hDTzBWQlJVRXNaVUZCUVN4RlFVRnJRaXhwUWtGR2JFSTdSVUZKUVN4bFFVRkJMRVZCUVd0Q0xHbENRVXBzUWpzN08wRkJUVW9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiIsImNjLmdhbWUub25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgR2FtZUxvZ2ljLCBnYW1lRGlhbG9nLCBnYW1lTG9naWNPYmosIHNjZW5lTWFuYWdlcjtcbiAgY2Mudmlldy5hZGp1c3RWaWV3UG9ydCh0cnVlKTtcbiAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgxMTM2LCA2NDAsIGNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwpO1xuICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcbiAgY2MuQnVpbGRlclJlYWRlci5zZXRSZXNvdXJjZVBhdGgoXCJyZXMvXCIpO1xuICBzY2VuZU1hbmFnZXIgPSByZXF1aXJlKFwiLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlXCIpO1xuICBzY2VuZU1hbmFnZXIuaW5pdCgpO1xuICBnYW1lRGlhbG9nID0gcmVxdWlyZSgnLi9jY2JWaWV3L0Fya01haW5EaWFsb2cuY29mZmVlJyk7XG4gIHNjZW5lTWFuYWdlci5hZGRMYXllclRvU2NlbmUoZ2FtZURpYWxvZyk7XG4gIEdhbWVMb2dpYyA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmtHYW1lTG9naWMuY29mZmVlJyk7XG4gIGdhbWVMb2dpY09iaiA9IG5ldyBHYW1lTG9naWMoKTtcbiAgcmV0dXJuIGdhbWVMb2dpY09iai5pbml0KCk7XG59O1xuXG5jYy5nYW1lLnJ1bigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiV0ZwYmk1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OXRZV2x1TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVklzUjBGQmEwSXNVMEZCUVR0QlFVTmtMRTFCUVVFN1JVRkJRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFWSXNRMEZCZFVJc1NVRkJka0k3UlVGRFFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMSFZDUVVGU0xFTkJRV2RETEVsQlFXaERMRVZCUVhORExFZEJRWFJETEVWQlFUSkRMRVZCUVVVc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UlFVRXZSRHRGUVVOQkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNjVUpCUVZJc1EwRkJPRUlzU1VGQk9VSTdSVUZEUVN4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExHVkJRV3BDTEVOQlFXbERMRTFCUVdwRE8wVkJSVUVzV1VGQlFTeEhRVUZsTEU5QlFVRXNRMEZCVVN4blEwRkJVanRGUVVObUxGbEJRVmtzUTBGQlF5eEpRVUZpTEVOQlFVRTdSVUZGUVN4VlFVRkJMRWRCUVdFc1QwRkJRU3hEUVVGUkxHZERRVUZTTzBWQlEySXNXVUZCV1N4RFFVRkRMR1ZCUVdJc1EwRkJOa0lzVlVGQk4wSTdSVUZGUVN4VFFVRkJMRWRCUVZrc1QwRkJRU3hEUVVGUkxDdENRVUZTTzBWQlExb3NXVUZCUVN4SFFVRmxMRWxCUVVrc1UwRkJTaXhEUVVGQk8xTkJRMllzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCUVR0QlFXUmpPenRCUVdkQ2JFSXNSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGU0xFTkJRVUVpZlE9PVxuIiwidmFyIFVzZXJEYXRhO1xuXG5Vc2VyRGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVXNlckRhdGEoKSB7XG4gICAgdGhpcy5fc2NvcmUgPSAwO1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgfVxuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKF9zY29yZSkge1xuICAgIHRoaXMuX3Njb3JlID0gX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRTY29yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29yZTtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuc2V0Q291bnQgPSBmdW5jdGlvbihfY291bnQpIHtcbiAgICB0aGlzLl9jb3VudCA9IF9jb3VudDtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuZ2V0Q291bnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJEYXRhO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJEYXRhO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRWEpyVlhObGNrUmhkR0V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRTdPMEZCUVUwN1JVRkRWeXhyUWtGQlFUdEpRVU5VTEVsQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZVN1NVRkRWaXhKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTzBWQlJrUTdPM0ZDUVVsaUxGRkJRVUVzUjBGQlZTeFRRVUZETEUxQlFVUTdTVUZCUXl4SlFVRkRMRU5CUVVFc1UwRkJSRHRGUVVGRU96dHhRa0ZGVml4UlFVRkJMRWRCUVZVc1UwRkJRVHRYUVVGSExFbEJRVU1zUTBGQlFUdEZRVUZLT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlF5eE5RVUZFTzBsQlFVTXNTVUZCUXl4RFFVRkJMRk5CUVVRN1JVRkJSRHM3Y1VKQlJWWXNVVUZCUVN4SFFVRlZMRk5CUVVFN1YwRkJSeXhKUVVGRExFTkJRVUU3UlVGQlNqczdPenM3TzBGQlJXUXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIExheWVyTWFuYWdlciwgTG9hZGVyO1xuXG5MYXllck1hbmFnZXIgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGF5ZXJTdGFjayA9IFtdO1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgY2MuU2NlbmUoKTtcbiAgICByZXR1cm4gY2MuZGlyZWN0b3IucnVuU2NlbmUodGhpcy5zY2VuZSk7XG4gIH0sXG4gIGNsZWFyTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICByZXR1cm4gdGhpcy5sYXllclN0YWNrLmxlbmd0aCA9IDA7XG4gIH0sXG4gIGFkZExheWVyVG9TY2VuZTogZnVuY3Rpb24oY2NiTGF5ZXIsIHpPcmRlcikge1xuICAgIHZhciBsYXlvdXQsIG5vZGU7XG4gICAgaWYgKHpPcmRlciA9PSBudWxsKSB7XG4gICAgICB6T3JkZXIgPSAwO1xuICAgIH1cbiAgICBsYXlvdXQgPSBuZXcgY2N1aS5MYXlvdXQoKTtcbiAgICBsYXlvdXQuc2V0Q29udGVudFNpemUoY2Muc2l6ZSgxMTM2LCA2NDApKTtcbiAgICBsYXlvdXQuc2V0VG91Y2hFbmFibGVkKHRydWUpO1xuICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuICAgIG5vZGUuYWRkQ2hpbGQobGF5b3V0KTtcbiAgICBub2RlLmFkZENoaWxkKGNjYkxheWVyKTtcbiAgICB0aGlzLnNjZW5lLmFkZENoaWxkKG5vZGUsIHpPcmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5wdXNoKG5vZGUpO1xuICB9LFxuICByZW1vdmVUb3BMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRvcExheWVyO1xuICAgIHRvcExheWVyID0gdGhpcy5sYXllclN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0aGlzLnNjZW5lLnJlbW92ZUNoaWxkKHRvcExheWVyLCB0cnVlKTtcbiAgfVxufTtcblxuTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMb2FkZXIoY2NiRmlsZTEsIGNvbnRyb2xsZXJOYW1lMSkge1xuICAgIHRoaXMuY2NiRmlsZSA9IGNjYkZpbGUxO1xuICAgIHRoaXMuY29udHJvbGxlck5hbWUgPSBjb250cm9sbGVyTmFtZTE7XG4gIH1cblxuICBMb2FkZXIucHJvdG90eXBlLnNob3dEaWFsb2cgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2MuQnVpbGRlclJlYWRlci5sb2FkKHRoaXMuY2NiRmlsZSk7XG4gIH07XG5cbiAgcmV0dXJuIExvYWRlcjtcblxufSkoKTtcblxuTGF5ZXJNYW5hZ2VyLmRlZmluZURpYWxvZyA9IGZ1bmN0aW9uKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQ2xhc3MpIHtcbiAgY2MuQnVpbGRlclJlYWRlci5yZWdpc3RlckNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIG5ldyBjb250cm9sbGVyQ2xhc3MoKSk7XG4gIHJldHVybiBuZXcgTG9hZGVyKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdlFYSnJVMk5sYm1WTllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwzUnZiMnh6TDBGeWExTmpaVzVsVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlFUdEpRVU5HTEVsQlFVTXNRMEZCUVN4VlFVRkVMRWRCUVdNN1NVRkRaQ3hKUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRXRCUVZBc1EwRkJRVHRYUVVOVUxFVkJRVVVzUTBGQlF5eFJRVUZSTEVOQlFVTXNVVUZCV2l4RFFVRnhRaXhKUVVGRExFTkJRVUVzUzBGQmRFSTdSVUZJUlN4RFFVRk9PMFZCUzBFc1ZVRkJRU3hGUVVGWkxGTkJRVUU3U1VGRFVpeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMR2xDUVVGUUxFTkJRVUU3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRTFCUVZvc1IwRkJjVUk3UlVGR1lpeERRVXhhTzBWQlUwRXNaVUZCUVN4RlFVRnJRaXhUUVVGRExGRkJRVVFzUlVGQlZ5eE5RVUZZTzBGQlEyUXNVVUZCUVRzN1RVRkVlVUlzVTBGQlV6czdTVUZEYkVNc1RVRkJRU3hIUVVGVExFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFWUXNRMEZCUVR0SlFVTlVMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1NVRkJVaXhGUVVGakxFZEJRV1FzUTBGQmRFSTdTVUZEUVN4TlFVRk5MRU5CUVVNc1pVRkJVQ3hEUVVGMVFpeEpRVUYyUWp0SlFVVkJMRWxCUVVFc1IwRkJUU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZRTEVOQlFVRTdTVUZEVGl4SlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxFMUJRV1E3U1VGRFFTeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRkZCUVdRN1NVRkZRU3hKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEZGQlFWQXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNUVUZCZEVJN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEVsQlFWb3NRMEZCYVVJc1NVRkJha0k3UlVGV1l5eERRVlJzUWp0RlFYRkNRU3hqUVVGQkxFVkJRV2RDTEZOQlFVRTdRVUZEV2l4UlFVRkJPMGxCUVVFc1VVRkJRU3hIUVVGWExFbEJRVU1zUTBGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV2l4RFFVRkJPMWRCUTFnc1NVRkJReXhEUVVGQkxFdEJRVXNzUTBGQlF5eFhRVUZRTEVOQlFXMUNMRkZCUVc1Q0xFVkJRVFpDTEVsQlFUZENPMFZCUmxrc1EwRnlRbWhDT3pzN1FVRjVRa1U3UlVGRFZ5eG5Ra0ZCUXl4UlFVRkVMRVZCUVZjc1pVRkJXRHRKUVVGRExFbEJRVU1zUTBGQlFTeFZRVUZFTzBsQlFWVXNTVUZCUXl4RFFVRkJMR2xDUVVGRU8wVkJRVmc3TzIxQ1FVTmlMRlZCUVVFc1IwRkJZU3hUUVVGQk8xZEJRMVFzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRnFRaXhEUVVGelFpeEpRVUZETEVOQlFVRXNUMEZCZGtJN1JVRkVVenM3T3pzN08wRkJSMnBDTEZsQlFWa3NRMEZCUXl4WlFVRmlMRWRCUVRSQ0xGTkJRVU1zVDBGQlJDeEZRVUZWTEdOQlFWWXNSVUZCTUVJc1pVRkJNVUk3UlVGRGVFSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhyUWtGQmFrSXNRMEZEU1N4alFVUktMRVZCUlVrc1NVRkJTU3hsUVVGS0xFTkJRVUVzUTBGR1NqdFRRVXRCTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTlCUVZnc1JVRkJiMElzWTBGQmNFSTdRVUZPZDBJN08wRkJVVFZDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiJdfQ==
