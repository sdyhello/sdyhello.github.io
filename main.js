(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ArkMainDialog, TAG_ASSETS, TAG_DEPOSIT, TAG_LONG_LOAN, TAG_RECEIVABLE, TAG_RETAINED_PROFITS, TAG_SHORT_LOAN, eventManager, eventNames,
  hasProp = {}.hasOwnProperty;

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
    this._editBoxTable = {};
    this._datTable = [];
    return this.init();
  };

  ArkMainDialog.prototype.init = function() {
    var editBox, i, index;
    for (index = i = 1; i <= 6; index = ++i) {
      if (this["ccb_textField_" + index] == null) {
        continue;
      }
      console.log("ccb_textField_" + index);
      editBox = this._createEditBox(this["ccb_textField_" + index]);
      this.rootNode.addChild(editBox);
      this._editBoxTable[this._getEditBoxName(index)] = editBox;
    }
    this._initTestData();
  };

  ArkMainDialog.prototype._initTestData = function() {
    var index, key, ref, results, testData, value;
    testData = ["132675000000", "1432734000", "407706000000", "27890483300", "16108858700", "96029044700"];
    index = 0;
    ref = this._editBoxTable;
    results = [];
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      value = ref[key];
      console.log(value, testData[index]);
      value.setString(testData[index]);
      results.push(index++);
    }
    return results;
  };

  ArkMainDialog.prototype._getEditBoxName = function(index) {
    var tag;
    tag = "";
    switch (index) {
      case 1:
        tag = TAG_ASSETS;
        break;
      case 2:
        tag = TAG_RECEIVABLE;
        break;
      case 3:
        tag = TAG_DEPOSIT;
        break;
      case 4:
        tag = TAG_RETAINED_PROFITS;
        break;
      case 5:
        tag = TAG_SHORT_LOAN;
        break;
      case 6:
        tag = TAG_LONG_LOAN;
    }
    return tag;
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
    return this.ccb_result_bg.setContentSize(cc.size(contentSize.width + 50, contentSize.height + 50));
  };

  ArkMainDialog.prototype.onCalc = function() {
    var dataTable, depositReceive, depositReceiveTable, longLoan, longLoanTable, receivable, receivableTable, retainedProfits, retainedProfitsTable, shortLoan, shortLoanTable, totalAssets, totalAssetsTable;
    totalAssets = Number(this._editBoxTable[TAG_ASSETS].getString());
    totalAssetsTable = [TAG_ASSETS, totalAssets];
    receivable = Number(this._editBoxTable[TAG_RECEIVABLE].getString());
    receivableTable = [TAG_RECEIVABLE, receivable];
    depositReceive = Number(this._editBoxTable[TAG_DEPOSIT].getString());
    depositReceiveTable = [TAG_DEPOSIT, depositReceive];
    retainedProfits = Number(this._editBoxTable[TAG_RETAINED_PROFITS].getString());
    retainedProfitsTable = [TAG_RETAINED_PROFITS, retainedProfits];
    shortLoan = Number(this._editBoxTable[TAG_SHORT_LOAN].getString());
    shortLoanTable = [TAG_SHORT_LOAN, shortLoan];
    longLoan = Number(this._editBoxTable[TAG_LONG_LOAN].getString());
    longLoanTable = [TAG_LONG_LOAN, longLoan];
    dataTable = [totalAssetsTable, receivableTable, depositReceiveTable, retainedProfitsTable, shortLoanTable, longLoanTable];
    this.showResult("");
    return eventManager.send(eventNames.GAME_GET_RESULT, {
      data: dataTable,
      callback: (function(_this) {
        return function(str) {
          return _this.showResult(str);
        };
      })(this)
    });
  };

  cc.BuilderReader.registerController("ArkMainDialog", new ArkMainDialog());

  return ArkMainDialog;

})();

module.exports = cc.BuilderReader.load("res/main.ccbi");


},{"../event/ArkEventManager.coffee":3,"../event/ArkEventNames.coffee":4}],2:[function(require,module,exports){
var DEBUG, GameLogic, UserData, eventManager, eventNames, g_log_table, g_statisticsYears, maxStatisticsYears, needCalcItem, needShowLog, sceneManager,
  hasProp = {}.hasOwnProperty;

sceneManager = require('../tools/ArkSceneManager.coffee');

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

UserData = require('../model/ArkUserData.coffee');

g_statisticsYears = 5;

maxStatisticsYears = 6;

needShowLog = "need";

needCalcItem = {
  "totalAssets": "totalAssets",
  "receivables": "receivables",
  "retainedProfits": "retainedProfits",
  "depositReceived": "depositReceived",
  "shortLoan": "shortLoan",
  "longLoan": "longLoan"
};

g_log_table = [];

if (needShowLog === "need") {
  DEBUG = console.log.bind(console);
} else {
  DEBUG = function() {};
}

GameLogic = (function() {
  function GameLogic() {}

  GameLogic.prototype.init = function() {
    return this._registerEvents();
  };

  GameLogic.prototype._registerEvents = function() {
    return eventManager.listen(eventNames.GAME_GET_RESULT, (function(_this) {
      return function(obj) {
        g_log_table = [];
        return typeof obj.callback === "function" ? obj.callback(_this._getResult(obj.data)) : void 0;
      };
    })(this));
  };

  GameLogic.prototype._getResult = function(data) {
    var calcItem, totalAssetsIndex, totalScore, value;
    totalScore = 0;
    totalAssetsIndex = this._getTypeRowNum(data, needCalcItem.totalAssets);
    g_statisticsYears = this._getStatisticsYears(data, totalAssetsIndex);
    g_log_table.push("totalAssetsIndex " + totalAssetsIndex + ", statisticsYears:" + g_statisticsYears);
    DEBUG("totalAssetsIndex " + totalAssetsIndex + ", statisticsYears:" + g_statisticsYears);
    for (calcItem in needCalcItem) {
      if (!hasProp.call(needCalcItem, calcItem)) continue;
      value = needCalcItem[calcItem];
      if (value === "totalAssets" || value === "retainedProfits") {
        continue;
      }
      totalScore += this._calcScore(data, calcItem, value, totalAssetsIndex);
    }
    totalScore += this._getRetainedProfitsScore(data);
    totalScore += this._getRoeScore(data);
    totalScore = Math.ceil(totalScore);
    g_log_table.push("totalScore: " + totalScore);
    console.log("totalScore: " + totalScore);
    return JSON.stringify(g_log_table);
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
    g_log_table.push(data[typeNum][0] + ", " + data[typeNum][1]);
    DEBUG(data[typeNum][0], data[typeNum][1], typeNum);
    totalPercent = 0;
    for (yearIndex = i = 1, ref = g_statisticsYears; 1 <= ref ? i <= ref : i >= ref; yearIndex = 1 <= ref ? ++i : --i) {
      if (data[typeNum][yearIndex] == null) {
        break;
      }
      totalPercent += this._getValidNumber(data[typeNum][yearIndex]) / this._getValidNumber(data[totalAssetsIndex][yearIndex]) * 100;
    }
    averagePercent = totalPercent / g_statisticsYears;
    score = this._getScore(type, averagePercent);
    g_log_table.push(needCalcItem[type] + " percent:" + (averagePercent.toFixed(2)) + "%, score :" + (score.toFixed(2)));
    DEBUG(needCalcItem[type] + " percent:" + (averagePercent.toFixed(2)) + "%, score :" + (score.toFixed(2)));
    return score;
  };

  GameLogic.prototype._getStatisticsYears = function(data, totalAssetsIndex) {
    var length, totalAssets;
    totalAssets = data[totalAssetsIndex].filter(function(a) {
      return a > 0;
    });
    length = 0;
    if (totalAssets.length > maxStatisticsYears) {
      length = maxStatisticsYears;
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
    return table.slice(0, maxStatisticsYears);
  };

  GameLogic.prototype._getRetainedProfitsScore = function(data) {
    var addRetainedProfits, allRetainedProfits, averagePercent;
    allRetainedProfits = this._getTableByName(data, needCalcItem.retainedProfits);
    g_log_table.push("初始净利润：" + allRetainedProfits[allRetainedProfits.length - 1] + ", 当前净利润:" + allRetainedProfits[0]);
    DEBUG("初始净利润：" + allRetainedProfits[allRetainedProfits.length - 1] + ", 当前净利润:" + allRetainedProfits[0]);
    addRetainedProfits = allRetainedProfits[0] / allRetainedProfits[allRetainedProfits.length - 1];
    averagePercent = (this._getCompoundRate(addRetainedProfits, g_statisticsYears) - 1) * 100;
    g_log_table.push("净利润复合增长速度:" + (JSON.stringify(averagePercent)));
    DEBUG("净利润复合增长速度:" + (JSON.stringify(averagePercent)));
    return averagePercent;
  };

  GameLogic.prototype._getRoeScore = function(data) {
    var allNetAssets, averageRoe, i, index, len, netAsset, retainedProfitsRowNum, roe, totalRoe;
    retainedProfitsRowNum = this._getTypeRowNum(data, needCalcItem.retainedProfits);
    allNetAssets = this._getTableByName(data, needCalcItem.totalAssets);
    totalRoe = 0;
    for (index = i = 0, len = allNetAssets.length; i < len; index = ++i) {
      netAsset = allNetAssets[index];
      if (index === allNetAssets.length - 1) {
        break;
      }
      roe = data[retainedProfitsRowNum][index + 1] / ((this._getValidNumber(netAsset) + this._getValidNumber(allNetAssets[index + 1])) / 2) * 100;
      totalRoe += roe;
      g_log_table.push("roe:" + (roe.toFixed(2)));
      DEBUG("roe:" + (roe.toFixed(2)));
    }
    if (allNetAssets.length === 1) {
      g_log_table.push("averageRoe :" + (totalRoe.toFixed(2)));
      DEBUG("averageRoe :" + (totalRoe.toFixed(2)));
      return totalRoe;
    }
    averageRoe = totalRoe / (allNetAssets.length - 1);
    g_log_table.push("averageRoe :" + (averageRoe.toFixed(2)));
    DEBUG("averageRoe :" + (averageRoe.toFixed(2)));
    return averageRoe;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9tYWluLmNvZmZlZSIsInNyYy9tb2RlbC9BcmtVc2VyRGF0YS5jb2ZmZWUiLCJzcmMvdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgVEFHX0FTU0VUUywgVEFHX0RFUE9TSVQsIFRBR19MT05HX0xPQU4sIFRBR19SRUNFSVZBQkxFLCBUQUdfUkVUQUlORURfUFJPRklUUywgVEFHX1NIT1JUX0xPQU4sIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcyxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5UQUdfQVNTRVRTID0gXCJ0b3RhbEFzc2V0c1wiO1xuXG5UQUdfUkVDRUlWQUJMRSA9IFwicmVjZWl2YWJsZXNcIjtcblxuVEFHX0RFUE9TSVQgPSBcImRlcG9zaXRSZWNlaXZlZFwiO1xuXG5UQUdfUkVUQUlORURfUFJPRklUUyA9IFwicmV0YWluZWRQcm9maXRzXCI7XG5cblRBR19TSE9SVF9MT0FOID0gXCJzaG9ydExvYW5cIjtcblxuVEFHX0xPTkdfTE9BTiA9IFwibG9uZ0xvYW5cIjtcblxuQXJrTWFpbkRpYWxvZyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQXJrTWFpbkRpYWxvZygpIHt9XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25EaWRMb2FkRnJvbUNDQiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2VkaXRCb3hUYWJsZSA9IHt9O1xuICAgIHRoaXMuX2RhdFRhYmxlID0gW107XG4gICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWRpdEJveCwgaSwgaW5kZXg7XG4gICAgZm9yIChpbmRleCA9IGkgPSAxOyBpIDw9IDY7IGluZGV4ID0gKytpKSB7XG4gICAgICBpZiAodGhpc1tcImNjYl90ZXh0RmllbGRfXCIgKyBpbmRleF0gPT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiY2NiX3RleHRGaWVsZF9cIiArIGluZGV4KTtcbiAgICAgIGVkaXRCb3ggPSB0aGlzLl9jcmVhdGVFZGl0Qm94KHRoaXNbXCJjY2JfdGV4dEZpZWxkX1wiICsgaW5kZXhdKTtcbiAgICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQoZWRpdEJveCk7XG4gICAgICB0aGlzLl9lZGl0Qm94VGFibGVbdGhpcy5fZ2V0RWRpdEJveE5hbWUoaW5kZXgpXSA9IGVkaXRCb3g7XG4gICAgfVxuICAgIHRoaXMuX2luaXRUZXN0RGF0YSgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9pbml0VGVzdERhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5kZXgsIGtleSwgcmVmLCByZXN1bHRzLCB0ZXN0RGF0YSwgdmFsdWU7XG4gICAgdGVzdERhdGEgPSBbXCIxMzI2NzUwMDAwMDBcIiwgXCIxNDMyNzM0MDAwXCIsIFwiNDA3NzA2MDAwMDAwXCIsIFwiMjc4OTA0ODMzMDBcIiwgXCIxNjEwODg1ODcwMFwiLCBcIjk2MDI5MDQ0NzAwXCJdO1xuICAgIGluZGV4ID0gMDtcbiAgICByZWYgPSB0aGlzLl9lZGl0Qm94VGFibGU7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgaWYgKCFoYXNQcm9wLmNhbGwocmVmLCBrZXkpKSBjb250aW51ZTtcbiAgICAgIHZhbHVlID0gcmVmW2tleV07XG4gICAgICBjb25zb2xlLmxvZyh2YWx1ZSwgdGVzdERhdGFbaW5kZXhdKTtcbiAgICAgIHZhbHVlLnNldFN0cmluZyh0ZXN0RGF0YVtpbmRleF0pO1xuICAgICAgcmVzdWx0cy5wdXNoKGluZGV4KyspO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5fZ2V0RWRpdEJveE5hbWUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHZhciB0YWc7XG4gICAgdGFnID0gXCJcIjtcbiAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRhZyA9IFRBR19BU1NFVFM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0YWcgPSBUQUdfUkVDRUlWQUJMRTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRhZyA9IFRBR19ERVBPU0lUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgdGFnID0gVEFHX1JFVEFJTkVEX1BST0ZJVFM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA1OlxuICAgICAgICB0YWcgPSBUQUdfU0hPUlRfTE9BTjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDY6XG4gICAgICAgIHRhZyA9IFRBR19MT05HX0xPQU47XG4gICAgfVxuICAgIHJldHVybiB0YWc7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2NyZWF0ZUVkaXRCb3ggPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIGVkaXRCb3g7XG4gICAgZWRpdEJveCA9IG5ldyBjYy5FZGl0Qm94KGNjLnNpemUoMjAwLCA1MCkpO1xuICAgIGVkaXRCb3guc2V0UG9zaXRpb24obm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICBlZGl0Qm94LnNldElucHV0TW9kZShjYy5FRElUQk9YX0lOUFVUX01PREVfU0lOR0xFTElORSk7XG4gICAgZWRpdEJveC5zZXRSZXR1cm5UeXBlKGNjLktFWUJPQVJEX1JFVFVSTlRZUEVfRE9ORSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dEZsYWcoY2MuRURJVEJPWF9JTlBVVF9GTEFHX0lOSVRJQUxfQ0FQU19TRU5URU5DRSk7XG4gICAgZWRpdEJveC5zZXRNYXhMZW5ndGgoMTMpO1xuICAgIGVkaXRCb3guc2V0Rm9udChcIkFyaWFsXCIsIDI2KTtcbiAgICBlZGl0Qm94LnNldEZvbnRDb2xvcihjYy5jb2xvcigxMDAsIDEwMCwgMjU1LCAyNTUpKTtcbiAgICByZXR1cm4gZWRpdEJveDtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgdmFyIGNvbnRlbnRTaXplO1xuICAgIHRoaXMuY2NiX3Jlc3VsdC5zZXRTdHJpbmcocmVzdWx0KTtcbiAgICBjb250ZW50U2l6ZSA9IHRoaXMuY2NiX3Jlc3VsdC5nZXRDb250ZW50U2l6ZSgpO1xuICAgIHJldHVybiB0aGlzLmNjYl9yZXN1bHRfYmcuc2V0Q29udGVudFNpemUoY2Muc2l6ZShjb250ZW50U2l6ZS53aWR0aCArIDUwLCBjb250ZW50U2l6ZS5oZWlnaHQgKyA1MCkpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLm9uQ2FsYyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhVGFibGUsIGRlcG9zaXRSZWNlaXZlLCBkZXBvc2l0UmVjZWl2ZVRhYmxlLCBsb25nTG9hbiwgbG9uZ0xvYW5UYWJsZSwgcmVjZWl2YWJsZSwgcmVjZWl2YWJsZVRhYmxlLCByZXRhaW5lZFByb2ZpdHMsIHJldGFpbmVkUHJvZml0c1RhYmxlLCBzaG9ydExvYW4sIHNob3J0TG9hblRhYmxlLCB0b3RhbEFzc2V0cywgdG90YWxBc3NldHNUYWJsZTtcbiAgICB0b3RhbEFzc2V0cyA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX0FTU0VUU10uZ2V0U3RyaW5nKCkpO1xuICAgIHRvdGFsQXNzZXRzVGFibGUgPSBbVEFHX0FTU0VUUywgdG90YWxBc3NldHNdO1xuICAgIHJlY2VpdmFibGUgPSBOdW1iZXIodGhpcy5fZWRpdEJveFRhYmxlW1RBR19SRUNFSVZBQkxFXS5nZXRTdHJpbmcoKSk7XG4gICAgcmVjZWl2YWJsZVRhYmxlID0gW1RBR19SRUNFSVZBQkxFLCByZWNlaXZhYmxlXTtcbiAgICBkZXBvc2l0UmVjZWl2ZSA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX0RFUE9TSVRdLmdldFN0cmluZygpKTtcbiAgICBkZXBvc2l0UmVjZWl2ZVRhYmxlID0gW1RBR19ERVBPU0lULCBkZXBvc2l0UmVjZWl2ZV07XG4gICAgcmV0YWluZWRQcm9maXRzID0gTnVtYmVyKHRoaXMuX2VkaXRCb3hUYWJsZVtUQUdfUkVUQUlORURfUFJPRklUU10uZ2V0U3RyaW5nKCkpO1xuICAgIHJldGFpbmVkUHJvZml0c1RhYmxlID0gW1RBR19SRVRBSU5FRF9QUk9GSVRTLCByZXRhaW5lZFByb2ZpdHNdO1xuICAgIHNob3J0TG9hbiA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX1NIT1JUX0xPQU5dLmdldFN0cmluZygpKTtcbiAgICBzaG9ydExvYW5UYWJsZSA9IFtUQUdfU0hPUlRfTE9BTiwgc2hvcnRMb2FuXTtcbiAgICBsb25nTG9hbiA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX0xPTkdfTE9BTl0uZ2V0U3RyaW5nKCkpO1xuICAgIGxvbmdMb2FuVGFibGUgPSBbVEFHX0xPTkdfTE9BTiwgbG9uZ0xvYW5dO1xuICAgIGRhdGFUYWJsZSA9IFt0b3RhbEFzc2V0c1RhYmxlLCByZWNlaXZhYmxlVGFibGUsIGRlcG9zaXRSZWNlaXZlVGFibGUsIHJldGFpbmVkUHJvZml0c1RhYmxlLCBzaG9ydExvYW5UYWJsZSwgbG9uZ0xvYW5UYWJsZV07XG4gICAgdGhpcy5zaG93UmVzdWx0KFwiXCIpO1xuICAgIHJldHVybiBldmVudE1hbmFnZXIuc2VuZChldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwge1xuICAgICAgZGF0YTogZGF0YVRhYmxlLFxuICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnNob3dSZXN1bHQoc3RyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH07XG5cbiAgY2MuQnVpbGRlclJlYWRlci5yZWdpc3RlckNvbnRyb2xsZXIoXCJBcmtNYWluRGlhbG9nXCIsIG5ldyBBcmtNYWluRGlhbG9nKCkpO1xuXG4gIHJldHVybiBBcmtNYWluRGlhbG9nO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkJ1aWxkZXJSZWFkZXIubG9hZChcInJlcy9tYWluLmNjYmlcIik7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyTmlWbWxsZHk5QmNtdE5ZV2x1UkdsaGJHOW5MbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDJOallsWnBaWGN2UVhKclRXRnBia1JwWVd4dlp5NWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4eFNVRkJRVHRGUVVGQk96dEJRVUZCTEZsQlFVRXNSMEZCWlN4UFFVRkJMRU5CUVZFc2FVTkJRVkk3TzBGQlEyWXNWVUZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3dyUWtGQlVqczdRVUZGWWl4VlFVRkJMRWRCUVdFN08wRkJRMklzWTBGQlFTeEhRVUZwUWpzN1FVRkRha0lzVjBGQlFTeEhRVUZqT3p0QlFVTmtMRzlDUVVGQkxFZEJRWFZDT3p0QlFVTjJRaXhqUVVGQkxFZEJRV2xDT3p0QlFVTnFRaXhoUVVGQkxFZEJRV2RDT3p0QlFVVldPenM3TUVKQlEwWXNaMEpCUVVFc1IwRkJhMElzVTBGQlFUdEpRVU5rTEVsQlFVTXNRMEZCUVN4aFFVRkVMRWRCUVdsQ08wbEJRMnBDTEVsQlFVTXNRMEZCUVN4VFFVRkVMRWRCUVdFN1YwRkRZaXhKUVVGRExFTkJRVUVzU1VGQlJDeERRVUZCTzBWQlNHTTdPekJDUVV0c1FpeEpRVUZCTEVkQlFVMHNVMEZCUVR0QlFVTkdMRkZCUVVFN1FVRkJRU3hUUVVGaExHdERRVUZpTzAxQlEwa3NTVUZCWjBJc2MwTkJRV2hDTzBGQlFVRXNhVUpCUVVFN08wMUJRMEVzVDBGQlR5eERRVUZETEVkQlFWSXNRMEZCV1N4blFrRkJRU3hIUVVGcFFpeExRVUUzUWp0TlFVTkJMRTlCUVVFc1IwRkJWU3hKUVVGRExFTkJRVUVzWTBGQlJDeERRVUZuUWl4SlFVRkZMRU5CUVVFc1owSkJRVUVzUjBGQmFVSXNTMEZCYWtJc1EwRkJiRUk3VFVGRFZpeEpRVUZETEVOQlFVRXNVVUZCVVN4RFFVRkRMRkZCUVZZc1EwRkJiVUlzVDBGQmJrSTdUVUZEUVN4SlFVRkRMRU5CUVVFc1lVRkJZeXhEUVVGQkxFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFXbENMRXRCUVdwQ0xFTkJRVUVzUTBGQlppeEhRVUV3UXp0QlFVdzVRenRKUVU5QkxFbEJRVU1zUTBGQlFTeGhRVUZFTEVOQlFVRTdSVUZTUlRzN01FSkJXVTRzWVVGQlFTeEhRVUZsTEZOQlFVRTdRVUZEV0N4UlFVRkJPMGxCUVVFc1VVRkJRU3hIUVVGWExFTkJRVU1zWTBGQlJDeEZRVUZwUWl4WlFVRnFRaXhGUVVFclFpeGpRVUV2UWl4RlFVRXJReXhoUVVFdlF5eEZRVUU0UkN4aFFVRTVSQ3hGUVVFMlJTeGhRVUUzUlR0SlFVTllMRXRCUVVFc1IwRkJVVHRCUVVOU08wRkJRVUU3VTBGQlFTeFZRVUZCT3pzN1RVRkRTU3hQUVVGUExFTkJRVU1zUjBGQlVpeERRVUZaTEV0QlFWb3NSVUZCYlVJc1VVRkJVeXhEUVVGQkxFdEJRVUVzUTBGQk5VSTdUVUZEUVN4TFFVRkxMRU5CUVVNc1UwRkJUaXhEUVVGblFpeFJRVUZUTEVOQlFVRXNTMEZCUVN4RFFVRjZRanR0UWtGRFFTeExRVUZCTzBGQlNFbzdPMFZCU0ZjN096QkNRVkZtTEdWQlFVRXNSMEZCYVVJc1UwRkJReXhMUVVGRU8wRkJRMklzVVVGQlFUdEpRVUZCTEVkQlFVRXNSMEZCVFR0QlFVTk9MRmxCUVU4c1MwRkJVRHRCUVVGQkxGZEJRMU1zUTBGRVZEdFJRVVZSTEVkQlFVRXNSMEZCVFR0QlFVUk1PMEZCUkZRc1YwRkhVeXhEUVVoVU8xRkJTVkVzUjBGQlFTeEhRVUZOTzBGQlJFdzdRVUZJVkN4WFFVdFRMRU5CVEZRN1VVRk5VU3hIUVVGQkxFZEJRVTA3UVVGRVREdEJRVXhVTEZkQlQxTXNRMEZRVkR0UlFWRlJMRWRCUVVFc1IwRkJUVHRCUVVSTU8wRkJVRlFzVjBGVFV5eERRVlJVTzFGQlZWRXNSMEZCUVN4SFFVRk5PMEZCUkV3N1FVRlVWQ3hYUVZkVExFTkJXRlE3VVVGWlVTeEhRVUZCTEVkQlFVMDdRVUZhWkR0QlFXRkJMRmRCUVU4N1JVRm1UVHM3TUVKQmFVSnFRaXhqUVVGQkxFZEJRV2RDTEZOQlFVTXNTVUZCUkR0QlFVTmFMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzU1VGQlNTeEZRVUZGTEVOQlFVTXNUMEZCVUN4RFFVRmxMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlVpeEZRVUZoTEVWQlFXSXNRMEZCWmp0SlFVTldMRTlCUVU4c1EwRkJReXhYUVVGU0xFTkJRVzlDTEVsQlFVa3NRMEZCUXl4WFFVRk1MRU5CUVVFc1EwRkJjRUk3U1VGRFFTeFBRVUZQTEVOQlFVTXNXVUZCVWl4RFFVRnhRaXhGUVVGRkxFTkJRVU1zTmtKQlFYaENPMGxCUTBFc1QwRkJUeXhEUVVGRExHRkJRVklzUTBGQmMwSXNSVUZCUlN4RFFVRkRMSGRDUVVGNlFqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5eDNRMEZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRnlRanRKUVVOQkxFOUJRVThzUTBGQlF5eFBRVUZTTEVOQlFXZENMRTlCUVdoQ0xFVkJRWGxDTEVWQlFYcENPMGxCUTBFc1QwRkJUeXhEUVVGRExGbEJRVklzUTBGQmNVSXNSVUZCUlN4RFFVRkRMRXRCUVVnc1EwRkJVeXhIUVVGVUxFVkJRV01zUjBGQlpDeEZRVUZ0UWl4SFFVRnVRaXhGUVVGM1FpeEhRVUY0UWl4RFFVRnlRanRCUVVOQkxGZEJRVTg3UlVGVVN6czdNRUpCVjJoQ0xGVkJRVUVzUjBGQldTeFRRVUZETEUxQlFVUTdRVUZEVWl4UlFVRkJPMGxCUVVFc1NVRkJReXhEUVVGQkxGVkJRVlVzUTBGQlF5eFRRVUZhTEVOQlFYTkNMRTFCUVhSQ08wbEJRMEVzVjBGQlFTeEhRVUZqTEVsQlFVTXNRMEZCUVN4VlFVRlZMRU5CUVVNc1kwRkJXaXhEUVVGQk8xZEJRMlFzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4alFVRm1MRU5CUVRoQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNWMEZCVnl4RFFVRkRMRXRCUVZvc1IwRkJiMElzUlVGQk5VSXNSVUZCWjBNc1YwRkJWeXhEUVVGRExFMUJRVm9zUjBGQmNVSXNSVUZCY2tRc1EwRkJPVUk3UlVGSVVUczdNRUpCUzFvc1RVRkJRU3hIUVVGUkxGTkJRVUU3UVVGRFNpeFJRVUZCTzBsQlFVRXNWMEZCUVN4SFFVRmpMRTFCUVVFc1EwRkJUeXhKUVVGRExFTkJRVUVzWVVGQll5eERRVUZCTEZWQlFVRXNRMEZCVnl4RFFVRkRMRk5CUVROQ0xFTkJRVUVzUTBGQlVEdEpRVU5rTEdkQ1FVRkJMRWRCUVcxQ0xFTkJRVU1zVlVGQlJDeEZRVUZoTEZkQlFXSTdTVUZEYmtJc1ZVRkJRU3hIUVVGaExFMUJRVUVzUTBGQlR5eEpRVUZETEVOQlFVRXNZVUZCWXl4RFFVRkJMR05CUVVFc1EwRkJaU3hEUVVGRExGTkJRUzlDTEVOQlFVRXNRMEZCVUR0SlFVTmlMR1ZCUVVFc1IwRkJhMElzUTBGQlF5eGpRVUZFTEVWQlFXbENMRlZCUVdwQ08wbEJRMnhDTEdOQlFVRXNSMEZCYVVJc1RVRkJRU3hEUVVGUExFbEJRVU1zUTBGQlFTeGhRVUZqTEVOQlFVRXNWMEZCUVN4RFFVRlpMRU5CUVVNc1UwRkJOVUlzUTBGQlFTeERRVUZRTzBsQlEycENMRzFDUVVGQkxFZEJRWE5DTEVOQlFVTXNWMEZCUkN4RlFVRmpMR05CUVdRN1NVRkRkRUlzWlVGQlFTeEhRVUZyUWl4TlFVRkJMRU5CUVU4c1NVRkJReXhEUVVGQkxHRkJRV01zUTBGQlFTeHZRa0ZCUVN4RFFVRnhRaXhEUVVGRExGTkJRWEpETEVOQlFVRXNRMEZCVUR0SlFVTnNRaXh2UWtGQlFTeEhRVUYxUWl4RFFVRkRMRzlDUVVGRUxFVkJRWFZDTEdWQlFYWkNPMGxCUTNaQ0xGTkJRVUVzUjBGQldTeE5RVUZCTEVOQlFVOHNTVUZCUXl4RFFVRkJMR0ZCUVdNc1EwRkJRU3hqUVVGQkxFTkJRV1VzUTBGQlF5eFRRVUV2UWl4RFFVRkJMRU5CUVZBN1NVRkRXaXhqUVVGQkxFZEJRV2xDTEVOQlFVTXNZMEZCUkN4RlFVRnBRaXhUUVVGcVFqdEpRVU5xUWl4UlFVRkJMRWRCUVZjc1RVRkJRU3hEUVVGUExFbEJRVU1zUTBGQlFTeGhRVUZqTEVOQlFVRXNZVUZCUVN4RFFVRmpMRU5CUVVNc1UwRkJPVUlzUTBGQlFTeERRVUZRTzBsQlExZ3NZVUZCUVN4SFFVRm5RaXhEUVVGRExHRkJRVVFzUlVGQlowSXNVVUZCYUVJN1NVRkZhRUlzVTBGQlFTeEhRVUZaTEVOQlFVTXNaMEpCUVVRc1JVRkJiVUlzWlVGQmJrSXNSVUZCYjBNc2JVSkJRWEJETEVWQlFYbEVMRzlDUVVGNlJDeEZRVUVyUlN4alFVRXZSU3hGUVVFclJpeGhRVUV2Ump0SlFVVmFMRWxCUVVNc1EwRkJRU3hWUVVGRUxFTkJRVmtzUlVGQldqdFhRVU5CTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVd0Q0xGVkJRVlVzUTBGQlF5eGxRVUUzUWl4RlFVTkpPMDFCUVVFc1NVRkJRU3hGUVVGTkxGTkJRVTQ3VFVGRFFTeFJRVUZCTEVWQlFWVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1pVRkJRU3hUUVVGRExFZEJRVVE3YVVKQlEwNHNTMEZCUXl4RFFVRkJMRlZCUVVRc1EwRkJXU3hIUVVGYU8xRkJSRTA3VFVGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJMRU5CUkZZN1MwRkVTanRGUVdwQ1NUczdSVUZ6UWxJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eHJRa0ZCYWtJc1EwRkRTU3hsUVVSS0xFVkJSVWtzU1VGQlNTeGhRVUZLTEVOQlFVRXNRMEZHU2pzN096czdPMEZCUzBvc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhKUVVGcVFpeERRVUZ6UWl4bFFVRjBRaUo5XG4iLCJ2YXIgREVCVUcsIEdhbWVMb2dpYywgVXNlckRhdGEsIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcywgZ19sb2dfdGFibGUsIGdfc3RhdGlzdGljc1llYXJzLCBtYXhTdGF0aXN0aWNzWWVhcnMsIG5lZWRDYWxjSXRlbSwgbmVlZFNob3dMb2csIHNjZW5lTWFuYWdlcixcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbmdfc3RhdGlzdGljc1llYXJzID0gNTtcblxubWF4U3RhdGlzdGljc1llYXJzID0gNjtcblxubmVlZFNob3dMb2cgPSBcIm5lZWRcIjtcblxubmVlZENhbGNJdGVtID0ge1xuICBcInRvdGFsQXNzZXRzXCI6IFwidG90YWxBc3NldHNcIixcbiAgXCJyZWNlaXZhYmxlc1wiOiBcInJlY2VpdmFibGVzXCIsXG4gIFwicmV0YWluZWRQcm9maXRzXCI6IFwicmV0YWluZWRQcm9maXRzXCIsXG4gIFwiZGVwb3NpdFJlY2VpdmVkXCI6IFwiZGVwb3NpdFJlY2VpdmVkXCIsXG4gIFwic2hvcnRMb2FuXCI6IFwic2hvcnRMb2FuXCIsXG4gIFwibG9uZ0xvYW5cIjogXCJsb25nTG9hblwiXG59O1xuXG5nX2xvZ190YWJsZSA9IFtdO1xuXG5pZiAobmVlZFNob3dMb2cgPT09IFwibmVlZFwiKSB7XG4gIERFQlVHID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbn0gZWxzZSB7XG4gIERFQlVHID0gZnVuY3Rpb24oKSB7fTtcbn1cblxuR2FtZUxvZ2ljID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lTG9naWMoKSB7fVxuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5saXN0ZW4oZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBnX2xvZ190YWJsZSA9IFtdO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iai5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gb2JqLmNhbGxiYWNrKF90aGlzLl9nZXRSZXN1bHQob2JqLmRhdGEpKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJlc3VsdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgY2FsY0l0ZW0sIHRvdGFsQXNzZXRzSW5kZXgsIHRvdGFsU2NvcmUsIHZhbHVlO1xuICAgIHRvdGFsU2NvcmUgPSAwO1xuICAgIHRvdGFsQXNzZXRzSW5kZXggPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIG5lZWRDYWxjSXRlbS50b3RhbEFzc2V0cyk7XG4gICAgZ19zdGF0aXN0aWNzWWVhcnMgPSB0aGlzLl9nZXRTdGF0aXN0aWNzWWVhcnMoZGF0YSwgdG90YWxBc3NldHNJbmRleCk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcInRvdGFsQXNzZXRzSW5kZXggXCIgKyB0b3RhbEFzc2V0c0luZGV4ICsgXCIsIHN0YXRpc3RpY3NZZWFyczpcIiArIGdfc3RhdGlzdGljc1llYXJzKTtcbiAgICBERUJVRyhcInRvdGFsQXNzZXRzSW5kZXggXCIgKyB0b3RhbEFzc2V0c0luZGV4ICsgXCIsIHN0YXRpc3RpY3NZZWFyczpcIiArIGdfc3RhdGlzdGljc1llYXJzKTtcbiAgICBmb3IgKGNhbGNJdGVtIGluIG5lZWRDYWxjSXRlbSkge1xuICAgICAgaWYgKCFoYXNQcm9wLmNhbGwobmVlZENhbGNJdGVtLCBjYWxjSXRlbSkpIGNvbnRpbnVlO1xuICAgICAgdmFsdWUgPSBuZWVkQ2FsY0l0ZW1bY2FsY0l0ZW1dO1xuICAgICAgaWYgKHZhbHVlID09PSBcInRvdGFsQXNzZXRzXCIgfHwgdmFsdWUgPT09IFwicmV0YWluZWRQcm9maXRzXCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2NhbGNTY29yZShkYXRhLCBjYWxjSXRlbSwgdmFsdWUsIHRvdGFsQXNzZXRzSW5kZXgpO1xuICAgIH1cbiAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2dldFJldGFpbmVkUHJvZml0c1Njb3JlKGRhdGEpO1xuICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fZ2V0Um9lU2NvcmUoZGF0YSk7XG4gICAgdG90YWxTY29yZSA9IE1hdGguY2VpbCh0b3RhbFNjb3JlKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwidG90YWxTY29yZTogXCIgKyB0b3RhbFNjb3JlKTtcbiAgICBjb25zb2xlLmxvZyhcInRvdGFsU2NvcmU6IFwiICsgdG90YWxTY29yZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGdfbG9nX3RhYmxlKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZWNlaXZlU2NvcmUgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gICAgcmV0dXJuIC1wZXJjZW50O1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFNjb3JlID0gZnVuY3Rpb24odHlwZSwgcGVyY2VudCkge1xuICAgIHZhciBzY29yZTtcbiAgICBzY29yZSA9IDA7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwicmVjZWl2YWJsZXNcIjpcbiAgICAgICAgc2NvcmUgPSB0aGlzLl9nZXRSZWNlaXZlU2NvcmUocGVyY2VudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlcG9zaXRSZWNlaXZlZFwiOlxuICAgICAgICBzY29yZSA9IHBlcmNlbnQ7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSBcInNob3J0TG9hblwiIHx8IHR5cGUgPT09IFwibG9uZ0xvYW5cIikge1xuICAgICAgc2NvcmUgPSA0MCAtIHBlcmNlbnQ7XG4gICAgfVxuICAgIHJldHVybiBzY29yZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRWYWxpZE51bWJlciA9IGZ1bmN0aW9uKG51bWJlclN0cikge1xuICAgIHZhciBudW07XG4gICAgaWYgKHR5cGVvZiBudW1iZXJTdHIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJldHVybiBudW1iZXJTdHI7XG4gICAgfVxuICAgIG51bSA9IG51bWJlclN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBOdW1iZXIobnVtKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRUeXBlUm93TnVtID0gZnVuY3Rpb24oZGF0YSwgdHlwZVN0cikge1xuICAgIHZhciBpLCBpbmRleCwgbGVuLCByb3csIHR5cGVOdW07XG4gICAgdHlwZU51bSA9IDA7XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIHJvdyA9IGRhdGFbaW5kZXhdO1xuICAgICAgaWYgKHJvd1swXS5pbmRleE9mKHR5cGVTdHIpICE9PSAtMSkge1xuICAgICAgICB0eXBlTnVtID0gaW5kZXg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHlwZU51bTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRDb21wb3VuZFJhdGUgPSBmdW5jdGlvbihhZGRSYXRlLCB0aW1lKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKDEgLyB0aW1lICogTWF0aC5sb2coYWRkUmF0ZSkpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2NhbGNTY29yZSA9IGZ1bmN0aW9uKGRhdGEsIHR5cGUsIHR5cGVTdHIsIHRvdGFsQXNzZXRzSW5kZXgpIHtcbiAgICB2YXIgYXZlcmFnZVBlcmNlbnQsIGksIHJlZiwgc2NvcmUsIHRvdGFsUGVyY2VudCwgdHlwZU51bSwgeWVhckluZGV4O1xuICAgIHR5cGVOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIHR5cGVTdHIpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goZGF0YVt0eXBlTnVtXVswXSArIFwiLCBcIiArIGRhdGFbdHlwZU51bV1bMV0pO1xuICAgIERFQlVHKGRhdGFbdHlwZU51bV1bMF0sIGRhdGFbdHlwZU51bV1bMV0sIHR5cGVOdW0pO1xuICAgIHRvdGFsUGVyY2VudCA9IDA7XG4gICAgZm9yICh5ZWFySW5kZXggPSBpID0gMSwgcmVmID0gZ19zdGF0aXN0aWNzWWVhcnM7IDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZjsgeWVhckluZGV4ID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIGlmIChkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0gPT0gbnVsbCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRvdGFsUGVyY2VudCArPSB0aGlzLl9nZXRWYWxpZE51bWJlcihkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0pIC8gdGhpcy5fZ2V0VmFsaWROdW1iZXIoZGF0YVt0b3RhbEFzc2V0c0luZGV4XVt5ZWFySW5kZXhdKSAqIDEwMDtcbiAgICB9XG4gICAgYXZlcmFnZVBlcmNlbnQgPSB0b3RhbFBlcmNlbnQgLyBnX3N0YXRpc3RpY3NZZWFycztcbiAgICBzY29yZSA9IHRoaXMuX2dldFNjb3JlKHR5cGUsIGF2ZXJhZ2VQZXJjZW50KTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKG5lZWRDYWxjSXRlbVt0eXBlXSArIFwiIHBlcmNlbnQ6XCIgKyAoYXZlcmFnZVBlcmNlbnQudG9GaXhlZCgyKSkgKyBcIiUsIHNjb3JlIDpcIiArIChzY29yZS50b0ZpeGVkKDIpKSk7XG4gICAgREVCVUcobmVlZENhbGNJdGVtW3R5cGVdICsgXCIgcGVyY2VudDpcIiArIChhdmVyYWdlUGVyY2VudC50b0ZpeGVkKDIpKSArIFwiJSwgc2NvcmUgOlwiICsgKHNjb3JlLnRvRml4ZWQoMikpKTtcbiAgICByZXR1cm4gc2NvcmU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0U3RhdGlzdGljc1llYXJzID0gZnVuY3Rpb24oZGF0YSwgdG90YWxBc3NldHNJbmRleCkge1xuICAgIHZhciBsZW5ndGgsIHRvdGFsQXNzZXRzO1xuICAgIHRvdGFsQXNzZXRzID0gZGF0YVt0b3RhbEFzc2V0c0luZGV4XS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPiAwO1xuICAgIH0pO1xuICAgIGxlbmd0aCA9IDA7XG4gICAgaWYgKHRvdGFsQXNzZXRzLmxlbmd0aCA+IG1heFN0YXRpc3RpY3NZZWFycykge1xuICAgICAgbGVuZ3RoID0gbWF4U3RhdGlzdGljc1llYXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b3RhbEFzc2V0cy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VGFibGVCeU5hbWUgPSBmdW5jdGlvbihkYXRhLCBuYW1lKSB7XG4gICAgdmFyIHJvd051bSwgdGFibGU7XG4gICAgcm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBuYW1lKTtcbiAgICB0YWJsZSA9IGRhdGFbcm93TnVtXS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPiAwO1xuICAgIH0pO1xuICAgIHJldHVybiB0YWJsZS5zbGljZSgwLCBtYXhTdGF0aXN0aWNzWWVhcnMpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJldGFpbmVkUHJvZml0c1Njb3JlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBhZGRSZXRhaW5lZFByb2ZpdHMsIGFsbFJldGFpbmVkUHJvZml0cywgYXZlcmFnZVBlcmNlbnQ7XG4gICAgYWxsUmV0YWluZWRQcm9maXRzID0gdGhpcy5fZ2V0VGFibGVCeU5hbWUoZGF0YSwgbmVlZENhbGNJdGVtLnJldGFpbmVkUHJvZml0cyk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuWIneWni+WHgOWIqea2pu+8mlwiICsgYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXSArIFwiLCDlvZPliY3lh4DliKnmtqY6XCIgKyBhbGxSZXRhaW5lZFByb2ZpdHNbMF0pO1xuICAgIERFQlVHKFwi5Yid5aeL5YeA5Yip5ram77yaXCIgKyBhbGxSZXRhaW5lZFByb2ZpdHNbYWxsUmV0YWluZWRQcm9maXRzLmxlbmd0aCAtIDFdICsgXCIsIOW9k+WJjeWHgOWIqea2pjpcIiArIGFsbFJldGFpbmVkUHJvZml0c1swXSk7XG4gICAgYWRkUmV0YWluZWRQcm9maXRzID0gYWxsUmV0YWluZWRQcm9maXRzWzBdIC8gYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXTtcbiAgICBhdmVyYWdlUGVyY2VudCA9ICh0aGlzLl9nZXRDb21wb3VuZFJhdGUoYWRkUmV0YWluZWRQcm9maXRzLCBnX3N0YXRpc3RpY3NZZWFycykgLSAxKSAqIDEwMDtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5YeA5Yip5ram5aSN5ZCI5aKe6ZW/6YCf5bqmOlwiICsgKEpTT04uc3RyaW5naWZ5KGF2ZXJhZ2VQZXJjZW50KSkpO1xuICAgIERFQlVHKFwi5YeA5Yip5ram5aSN5ZCI5aKe6ZW/6YCf5bqmOlwiICsgKEpTT04uc3RyaW5naWZ5KGF2ZXJhZ2VQZXJjZW50KSkpO1xuICAgIHJldHVybiBhdmVyYWdlUGVyY2VudDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSb2VTY29yZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgYWxsTmV0QXNzZXRzLCBhdmVyYWdlUm9lLCBpLCBpbmRleCwgbGVuLCBuZXRBc3NldCwgcmV0YWluZWRQcm9maXRzUm93TnVtLCByb2UsIHRvdGFsUm9lO1xuICAgIHJldGFpbmVkUHJvZml0c1Jvd051bSA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgbmVlZENhbGNJdGVtLnJldGFpbmVkUHJvZml0cyk7XG4gICAgYWxsTmV0QXNzZXRzID0gdGhpcy5fZ2V0VGFibGVCeU5hbWUoZGF0YSwgbmVlZENhbGNJdGVtLnRvdGFsQXNzZXRzKTtcbiAgICB0b3RhbFJvZSA9IDA7XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSBhbGxOZXRBc3NldHMubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuICAgICAgbmV0QXNzZXQgPSBhbGxOZXRBc3NldHNbaW5kZXhdO1xuICAgICAgaWYgKGluZGV4ID09PSBhbGxOZXRBc3NldHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJvZSA9IGRhdGFbcmV0YWluZWRQcm9maXRzUm93TnVtXVtpbmRleCArIDFdIC8gKCh0aGlzLl9nZXRWYWxpZE51bWJlcihuZXRBc3NldCkgKyB0aGlzLl9nZXRWYWxpZE51bWJlcihhbGxOZXRBc3NldHNbaW5kZXggKyAxXSkpIC8gMikgKiAxMDA7XG4gICAgICB0b3RhbFJvZSArPSByb2U7XG4gICAgICBnX2xvZ190YWJsZS5wdXNoKFwicm9lOlwiICsgKHJvZS50b0ZpeGVkKDIpKSk7XG4gICAgICBERUJVRyhcInJvZTpcIiArIChyb2UudG9GaXhlZCgyKSkpO1xuICAgIH1cbiAgICBpZiAoYWxsTmV0QXNzZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZ19sb2dfdGFibGUucHVzaChcImF2ZXJhZ2VSb2UgOlwiICsgKHRvdGFsUm9lLnRvRml4ZWQoMikpKTtcbiAgICAgIERFQlVHKFwiYXZlcmFnZVJvZSA6XCIgKyAodG90YWxSb2UudG9GaXhlZCgyKSkpO1xuICAgICAgcmV0dXJuIHRvdGFsUm9lO1xuICAgIH1cbiAgICBhdmVyYWdlUm9lID0gdG90YWxSb2UgLyAoYWxsTmV0QXNzZXRzLmxlbmd0aCAtIDEpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCJhdmVyYWdlUm9lIDpcIiArIChhdmVyYWdlUm9lLnRvRml4ZWQoMikpKTtcbiAgICBERUJVRyhcImF2ZXJhZ2VSb2UgOlwiICsgKGF2ZXJhZ2VSb2UudG9GaXhlZCgyKSkpO1xuICAgIHJldHVybiBhdmVyYWdlUm9lO1xuICB9O1xuXG4gIHJldHVybiBHYW1lTG9naWM7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxvZ2ljO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMjl1ZEhKdmJDOUJjbXRIWVcxbFRHOW5hV011WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyOXVkSEp2YkM5QmNtdEhZVzFsVEc5bmFXTXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFc2FVcEJRVUU3UlVGQlFUczdRVUZCUVN4WlFVRkJMRWRCUVd0Q0xFOUJRVUVzUTBGQlVTeHBRMEZCVWpzN1FVRkRiRUlzV1VGQlFTeEhRVUZyUWl4UFFVRkJMRU5CUVZFc2FVTkJRVkk3TzBGQlEyeENMRlZCUVVFc1IwRkJhMElzVDBGQlFTeERRVUZSTEN0Q1FVRlNPenRCUVVOc1FpeFJRVUZCTEVkQlFXdENMRTlCUVVFc1EwRkJVU3cyUWtGQlVqczdRVUZGYkVJc2FVSkJRVUVzUjBGQmIwSTdPMEZCUTNCQ0xHdENRVUZCTEVkQlFYRkNPenRCUVVOeVFpeFhRVUZCTEVkQlFXTTdPMEZCUldRc1dVRkJRU3hIUVVGbE8wVkJRMWdzWlVGQlFTeGhRVVJYTzBWQlJWZ3NaVUZCUVN4aFFVWlhPMFZCUjFnc2JVSkJRVUVzYVVKQlNGYzdSVUZKV0N4dFFrRkJRU3hwUWtGS1Z6dEZRVXRZTEdGQlFVRXNWMEZNVnp0RlFVMVlMRmxCUVVFc1ZVRk9WenM3TzBGQlUyWXNWMEZCUVN4SFFVRmpPenRCUVVWa0xFbEJRVWNzVjBGQlFTeExRVUZsTEUxQlFXeENPMFZCUTBrc1MwRkJRU3hIUVVGUkxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCV2l4RFFVRnBRaXhQUVVGcVFpeEZRVVJhTzBOQlFVRXNUVUZCUVR0RlFVZEpMRXRCUVVFc1IwRkJVU3hUUVVGQkxFZEJRVUVzUlVGSVdqczdPMEZCUzAwN096dHpRa0ZEUml4SlFVRkJMRWRCUVUwc1UwRkJRVHRYUVVOR0xFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFVRTdSVUZFUlRzN2MwSkJTVTRzWlVGQlFTeEhRVUZwUWl4VFFVRkJPMWRCUTJJc1dVRkJXU3hEUVVGRExFMUJRV0lzUTBGQmIwSXNWVUZCVlN4RFFVRkRMR1ZCUVM5Q0xFVkJRV2RFTEVOQlFVRXNVMEZCUVN4TFFVRkJPMkZCUVVFc1UwRkJReXhIUVVGRU8xRkJRelZETEZkQlFVRXNSMEZCWXp0dlJFRkRaQ3hIUVVGSExFTkJRVU1zVTBGQlZTeExRVUZETEVOQlFVRXNWVUZCUkN4RFFVRlpMRWRCUVVjc1EwRkJReXhKUVVGb1FqdE5RVVk0UWp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUVzUTBGQmFFUTdSVUZFWVRzN2MwSkJUV3BDTEZWQlFVRXNSMEZCV1N4VFFVRkRMRWxCUVVRN1FVRkRVaXhSUVVGQk8wbEJRVUVzVlVGQlFTeEhRVUZoTzBsQlEySXNaMEpCUVVFc1IwRkJiVUlzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNXVUZCV1N4RFFVRkRMRmRCUVc1RE8wbEJRMjVDTEdsQ1FVRkJMRWRCUVc5Q0xFbEJRVU1zUTBGQlFTeHRRa0ZCUkN4RFFVRnhRaXhKUVVGeVFpeEZRVUV5UWl4blFrRkJNMEk3U1VGRGNFSXNWMEZCVnl4RFFVRkRMRWxCUVZvc1EwRkJhVUlzYlVKQlFVRXNSMEZCYjBJc1owSkJRWEJDTEVkQlFYRkRMRzlDUVVGeVF5eEhRVUY1UkN4cFFrRkJNVVU3U1VGRFFTeExRVUZCTEVOQlFVMHNiVUpCUVVFc1IwRkJiMElzWjBKQlFYQkNMRWRCUVhGRExHOUNRVUZ5UXl4SFFVRjVSQ3hwUWtGQkwwUTdRVUZEUVN4VFFVRkJMSGRDUVVGQk96czdUVUZEU1N4SlFVRlpMRXRCUVVFc1MwRkJWU3hoUVVGV0xFbEJRVUVzUzBGQlFTeExRVUY1UWl4cFFrRkJja003UVVGQlFTeHBRa0ZCUVRzN1RVRkRRU3hWUVVGQkxFbEJRV01zU1VGQlF5eERRVUZCTEZWQlFVUXNRMEZCV1N4SlFVRmFMRVZCUVd0Q0xGRkJRV3hDTEVWQlFUUkNMRXRCUVRWQ0xFVkJRVzFETEdkQ1FVRnVRenRCUVVac1FqdEpRVWxCTEZWQlFVRXNTVUZCWXl4SlFVRkRMRU5CUVVFc2QwSkJRVVFzUTBGQk1FSXNTVUZCTVVJN1NVRkRaQ3hWUVVGQkxFbEJRV01zU1VGQlF5eERRVUZCTEZsQlFVUXNRMEZCWXl4SlFVRmtPMGxCUTJRc1ZVRkJRU3hIUVVGaExFbEJRVWtzUTBGQlF5eEpRVUZNTEVOQlFWVXNWVUZCVmp0SlFVTmlMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEdOQlFVRXNSMEZCWlN4VlFVRm9RenRKUVVOQkxFOUJRVThzUTBGQlF5eEhRVUZTTEVOQlFWa3NZMEZCUVN4SFFVRmxMRlZCUVROQ08wRkJRMEVzVjBGQlR5eEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMRmRCUVdZN1JVRm1RenM3YzBKQmFVSmFMR2RDUVVGQkxFZEJRV3RDTEZOQlFVTXNUMEZCUkR0QlFVTmtMRmRCUVU4c1EwRkJRenRGUVVSTk96dHpRa0ZIYkVJc1UwRkJRU3hIUVVGWkxGTkJRVU1zU1VGQlJDeEZRVUZQTEU5QlFWQTdRVUZEVWl4UlFVRkJPMGxCUVVFc1MwRkJRU3hIUVVGUk8wRkJRMUlzV1VGQlR5eEpRVUZRTzBGQlFVRXNWMEZEVXl4aFFVUlVPMUZCUlZFc1MwRkJRU3hIUVVGUkxFbEJRVU1zUTBGQlFTeG5Ra0ZCUkN4RFFVRnJRaXhQUVVGc1FqdEJRVVJRTzBGQlJGUXNWMEZIVXl4cFFrRklWRHRSUVVsUkxFdEJRVUVzUjBGQlVUdEJRVXBvUWp0SlFVMUJMRWxCUVVjc1NVRkJRU3hMUVVGUkxGZEJRVklzU1VGQmRVSXNTVUZCUVN4TFFVRlJMRlZCUVd4RE8wMUJRMGtzUzBGQlFTeEhRVUZSTEVWQlFVRXNSMEZCU3l4UlFVUnFRanM3UVVGRlFTeFhRVUZQTzBWQlZrTTdPM05DUVZsYUxHVkJRVUVzUjBGQmEwSXNVMEZCUXl4VFFVRkVPMEZCUTJRc1VVRkJRVHRKUVVGQkxFbEJRVzlDTEU5QlFVOHNVMEZCVUN4TFFVRnhRaXhSUVVGNlF6dEJRVUZCTEdGQlFVOHNWVUZCVURzN1NVRkRRU3hIUVVGQkxFZEJRVTBzVTBGQlV5eERRVUZETEZkQlFWWXNRMEZCUVR0QlFVTk9MRmRCUVU4c1RVRkJRU3hEUVVGUExFZEJRVkE3UlVGSVR6czdjMEpCUzJ4Q0xHTkJRVUVzUjBGQmFVSXNVMEZCUXl4SlFVRkVMRVZCUVU4c1QwRkJVRHRCUVVOaUxGRkJRVUU3U1VGQlFTeFBRVUZCTEVkQlFWVTdRVUZEVml4VFFVRkJMSE5FUVVGQk96dE5RVU5KTEVsQlFVY3NSMEZCU1N4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFOUJRVkFzUTBGQlpTeFBRVUZtTEVOQlFVRXNTMEZCTmtJc1EwRkJReXhEUVVGcVF6dFJRVU5KTEU5QlFVRXNSMEZCVlR0QlFVTldMR05CUmtvN08wRkJSRW83UVVGSlFTeFhRVUZQTzBWQlRrMDdPM05DUVZGcVFpeG5Ra0ZCUVN4SFFVRnJRaXhUUVVGRExFOUJRVVFzUlVGQlZTeEpRVUZXTzBGQlEyUXNWMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJUQ3hEUVVGVExFTkJRVUVzUjBGQlNTeEpRVUZLTEVkQlFWY3NTVUZCU1N4RFFVRkRMRWRCUVV3c1EwRkJVeXhQUVVGVUxFTkJRWEJDTzBWQlJFODdPM05DUVVsc1FpeFZRVUZCTEVkQlFXRXNVMEZCUXl4SlFVRkVMRVZCUVU4c1NVRkJVQ3hGUVVGaExFOUJRV0lzUlVGQmMwSXNaMEpCUVhSQ08wRkJRMVFzVVVGQlFUdEpRVUZCTEU5QlFVRXNSMEZCVlN4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeEpRVUZvUWl4RlFVRnpRaXhQUVVGMFFqdEpRVU5XTEZkQlFWY3NRMEZCUXl4SlFVRmFMRU5CUVc5Q0xFbEJRVXNzUTBGQlFTeFBRVUZCTEVOQlFWTXNRMEZCUVN4RFFVRkJMRU5CUVdZc1IwRkJhMElzU1VGQmJFSXNSMEZCYzBJc1NVRkJTeXhEUVVGQkxFOUJRVUVzUTBGQlV5eERRVUZCTEVOQlFVRXNRMEZCZGtRN1NVRkRRU3hMUVVGQkxFTkJRVTBzU1VGQlN5eERRVUZCTEU5QlFVRXNRMEZCVXl4RFFVRkJMRU5CUVVFc1EwRkJjRUlzUlVGQmQwSXNTVUZCU3l4RFFVRkJMRTlCUVVFc1EwRkJVeXhEUVVGQkxFTkJRVUVzUTBGQmRFTXNSVUZCTUVNc1QwRkJNVU03U1VGRFFTeFpRVUZCTEVkQlFXVTdRVUZEWml4VFFVRnBRaXcwUjBGQmFrSTdUVUZEU1N4SlFVRmhMR2REUVVGaU8wRkJRVUVzWTBGQlFUczdUVUZEUVN4WlFVRkJMRWxCUVdkQ0xFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFXbENMRWxCUVVzc1EwRkJRU3hQUVVGQkxFTkJRVk1zUTBGQlFTeFRRVUZCTEVOQlFTOUNMRU5CUVVFc1IwRkJOa01zU1VGQlF5eERRVUZCTEdWQlFVUXNRMEZCYVVJc1NVRkJTeXhEUVVGQkxHZENRVUZCTEVOQlFXdENMRU5CUVVFc1UwRkJRU3hEUVVGNFF5eERRVUUzUXl4SFFVRnRSenRCUVVaMlNEdEpRVWRCTEdOQlFVRXNSMEZCYVVJc1dVRkJRU3hIUVVGbE8wbEJRMmhETEV0QlFVRXNSMEZCVVN4SlFVRkRMRU5CUVVFc1UwRkJSQ3hEUVVGWExFbEJRVmdzUlVGQmFVSXNZMEZCYWtJN1NVRkRVaXhYUVVGWExFTkJRVU1zU1VGQldpeERRVUZ2UWl4WlFVRmhMRU5CUVVFc1NVRkJRU3hEUVVGa0xFZEJRVzlDTEZkQlFYQkNMRWRCUVRoQ0xFTkJRVU1zWTBGQll5eERRVUZETEU5QlFXWXNRMEZCZFVJc1EwRkJka0lzUTBGQlJDeERRVUU1UWl4SFFVRjVSQ3haUVVGNlJDeEhRVUZ2UlN4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGT0xFTkJRV01zUTBGQlpDeERRVUZFTEVOQlFYWkdPMGxCUTBFc1MwRkJRU3hEUVVGVExGbEJRV0VzUTBGQlFTeEpRVUZCTEVOQlFXUXNSMEZCYjBJc1YwRkJjRUlzUjBGQk9FSXNRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJaaXhEUVVGMVFpeERRVUYyUWl4RFFVRkVMRU5CUVRsQ0xFZEJRWGxFTEZsQlFYcEVMRWRCUVc5RkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVNHNRMEZCWXl4RFFVRmtMRU5CUVVRc1EwRkJOVVU3UVVGRFFTeFhRVUZQTzBWQldrVTdPM05DUVdOaUxHMUNRVUZCTEVkQlFYTkNMRk5CUVVNc1NVRkJSQ3hGUVVGUExHZENRVUZRTzBGQlEyeENMRkZCUVVFN1NVRkJRU3hYUVVGQkxFZEJRV01zU1VGQlN5eERRVUZCTEdkQ1FVRkJMRU5CUVdsQ0xFTkJRVU1zVFVGQmRrSXNRMEZCT0VJc1UwRkJReXhEUVVGRU8yRkJRVTBzUTBGQlFTeEhRVUZKTzBsQlFWWXNRMEZCT1VJN1NVRkRaQ3hOUVVGQkxFZEJRVk03U1VGRFZDeEpRVUZITEZkQlFWY3NRMEZCUXl4TlFVRmFMRWRCUVhGQ0xHdENRVUY0UWp0TlFVTkpMRTFCUVVFc1IwRkJVeXh0UWtGRVlqdExRVUZCTEUxQlFVRTdUVUZIU1N4TlFVRkJMRWRCUVZNc1YwRkJWeXhEUVVGRExFOUJTSHBDT3p0QlFVbEJMRmRCUVU4N1JVRlFWenM3YzBKQlUzUkNMR1ZCUVVFc1IwRkJhVUlzVTBGQlF5eEpRVUZFTEVWQlFVOHNTVUZCVUR0QlFVTmlMRkZCUVVFN1NVRkJRU3hOUVVGQkxFZEJRVk1zU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNTVUZCZEVJN1NVRkRWQ3hMUVVGQkxFZEJRVkVzU1VGQlN5eERRVUZCTEUxQlFVRXNRMEZCVHl4RFFVRkRMRTFCUVdJc1EwRkJiMElzVTBGQlF5eERRVUZFTzJGQlFVMHNRMEZCUVN4SFFVRkpPMGxCUVZZc1EwRkJjRUk3VjBGRFVpeExRVUZMTEVOQlFVTXNTMEZCVGl4RFFVRlpMRU5CUVZvc1JVRkJaU3hyUWtGQlpqdEZRVWhoT3p0elFrRk5ha0lzZDBKQlFVRXNSMEZCTWtJc1UwRkJReXhKUVVGRU8wRkJRM1pDTEZGQlFVRTdTVUZCUVN4clFrRkJRU3hIUVVGeFFpeEpRVUZETEVOQlFVRXNaVUZCUkN4RFFVRnBRaXhKUVVGcVFpeEZRVUYxUWl4WlFVRlpMRU5CUVVNc1pVRkJjRU03U1VGRGNrSXNWMEZCVnl4RFFVRkRMRWxCUVZvc1EwRkJhVUlzVVVGQlFTeEhRVUZUTEd0Q1FVRnRRaXhEUVVGQkxHdENRVUZyUWl4RFFVRkRMRTFCUVc1Q0xFZEJRVFJDTEVOQlFUVkNMRU5CUVRWQ0xFZEJRVEpFTEZWQlFUTkVMRWRCUVhGRkxHdENRVUZ0UWl4RFFVRkJMRU5CUVVFc1EwRkJla2M3U1VGRFFTeExRVUZCTEVOQlFVMHNVVUZCUVN4SFFVRlRMR3RDUVVGdFFpeERRVUZCTEd0Q1FVRnJRaXhEUVVGRExFMUJRVzVDTEVkQlFUUkNMRU5CUVRWQ0xFTkJRVFZDTEVkQlFUSkVMRlZCUVRORUxFZEJRWEZGTEd0Q1FVRnRRaXhEUVVGQkxFTkJRVUVzUTBGQk9VWTdTVUZEUVN4clFrRkJRU3hIUVVGeFFpeHJRa0ZCYlVJc1EwRkJRU3hEUVVGQkxFTkJRVzVDTEVkQlFYZENMR3RDUVVGdFFpeERRVUZCTEd0Q1FVRnJRaXhEUVVGRExFMUJRVzVDTEVkQlFUUkNMRU5CUVRWQ08wbEJRMmhGTEdOQlFVRXNSMEZCYVVJc1EwRkJReXhKUVVGRExFTkJRVUVzWjBKQlFVUXNRMEZCYTBJc2EwSkJRV3hDTEVWQlFYTkRMR2xDUVVGMFF5eERRVUZCTEVkQlFUSkVMRU5CUVRWRUxFTkJRVUVzUjBGQmFVVTdTVUZEYkVZc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmFVSXNXVUZCUVN4SFFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeGpRVUZtTEVOQlFVUXNRMEZCTjBJN1NVRkRRU3hMUVVGQkxFTkJRVTBzV1VGQlFTeEhRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVV3c1EwRkJaU3hqUVVGbUxFTkJRVVFzUTBGQmJFSTdRVUZEUVN4WFFVRlBPMFZCVW1kQ096dHpRa0ZYTTBJc1dVRkJRU3hIUVVGbExGTkJRVU1zU1VGQlJEdEJRVU5ZTEZGQlFVRTdTVUZCUVN4eFFrRkJRU3hIUVVGM1FpeEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4WlFVRlpMRU5CUVVNc1pVRkJia003U1VGRGVFSXNXVUZCUVN4SFFVRmxMRWxCUVVNc1EwRkJRU3hsUVVGRUxFTkJRV2xDTEVsQlFXcENMRVZCUVhWQ0xGbEJRVmtzUTBGQlF5eFhRVUZ3UXp0SlFVTm1MRkZCUVVFc1IwRkJWenRCUVVOWUxGTkJRVUVzT0VSQlFVRTdPMDFCUTBrc1NVRkJVeXhMUVVGQkxFdEJRVk1zV1VGQldTeERRVUZETEUxQlFXSXNSMEZCYzBJc1EwRkJlRU03UVVGQlFTeGpRVUZCT3p0TlFVTkJMRWRCUVVFc1IwRkJUU3hKUVVGTExFTkJRVUVzY1VKQlFVRXNRMEZCZFVJc1EwRkJRU3hMUVVGQkxFZEJRVkVzUTBGQlVpeERRVUUxUWl4SFFVRjVReXhEUVVGRExFTkJRVU1zU1VGQlF5eERRVUZCTEdWQlFVUXNRMEZCYVVJc1VVRkJha0lzUTBGQlFTeEhRVUUyUWl4SlFVRkRMRU5CUVVFc1pVRkJSQ3hEUVVGcFFpeFpRVUZoTEVOQlFVRXNTMEZCUVN4SFFVRlJMRU5CUVZJc1EwRkJPVUlzUTBGQk9VSXNRMEZCUVN4SFFVRXlSU3hEUVVFMVJTeERRVUY2UXl4SFFVRXdTRHROUVVOb1NTeFJRVUZCTEVsQlFWazdUVUZEV2l4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeE5RVUZCTEVkQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJTaXhEUVVGWkxFTkJRVm9zUTBGQlJDeERRVUYyUWp0TlFVTkJMRXRCUVVFc1EwRkJUU3hOUVVGQkxFZEJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCU2l4RFFVRlpMRU5CUVZvc1EwRkJSQ3hEUVVGYU8wRkJURW83U1VGTlFTeEpRVUZITEZsQlFWa3NRMEZCUXl4TlFVRmlMRXRCUVhWQ0xFTkJRVEZDTzAxQlEwa3NWMEZCVnl4RFFVRkRMRWxCUVZvc1EwRkJhVUlzWTBGQlFTeEhRVUZqTEVOQlFVTXNVVUZCVVN4RFFVRkRMRTlCUVZRc1EwRkJhVUlzUTBGQmFrSXNRMEZCUkN4RFFVRXZRanROUVVOQkxFdEJRVUVzUTBGQlRTeGpRVUZCTEVkQlFXTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1QwRkJWQ3hEUVVGcFFpeERRVUZxUWl4RFFVRkVMRU5CUVhCQ08wRkJRMEVzWVVGQlR5eFRRVWhZT3p0SlFVbEJMRlZCUVVFc1IwRkJZU3hSUVVGQkxFZEJRVmNzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCWWl4SFFVRnpRaXhEUVVGMlFqdEpRVU40UWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeGpRVUZCTEVkQlFXTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJXQ3hEUVVGdFFpeERRVUZ1UWl4RFFVRkVMRU5CUVM5Q08wbEJRMEVzUzBGQlFTeERRVUZOTEdOQlFVRXNSMEZCWXl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGWUxFTkJRVzFDTEVOQlFXNUNMRU5CUVVRc1EwRkJjRUk3UVVGRFFTeFhRVUZQTzBWQmFrSkpPenM3T3pzN1FVRnRRbTVDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBFdmVudE1hbmFnZXI7XG5cbkV2ZW50TWFuYWdlciA9IHtcbiAgc2VuZDogZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgdmFyIGV2ZW50O1xuICAgIGV2ZW50ID0gbmV3IGNjLkV2ZW50Q3VzdG9tKGV2ZW50TmFtZSk7XG4gICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgIGV2ZW50LnNldFVzZXJEYXRhKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gY2MuZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9LFxuICBsaXN0ZW46IGZ1bmN0aW9uKGV2ZW50TmFtZSwgbGlzdGVuRnVuYywgbm9kZU9yUHJpb3JpdHkpIHtcbiAgICB2YXIgY2NMaXN0ZW5lcjtcbiAgICBpZiAobm9kZU9yUHJpb3JpdHkgPT0gbnVsbCkge1xuICAgICAgbm9kZU9yUHJpb3JpdHkgPSAxO1xuICAgIH1cbiAgICBjY0xpc3RlbmVyID0gY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xuICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuQ1VTVE9NLFxuICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbkZ1bmMoZXZlbnQuZ2V0VXNlckRhdGEoKSwgZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoY2NMaXN0ZW5lciwgbm9kZU9yUHJpb3JpdHkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TWFuYWdlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WlhabGJuUXZRWEpyUlhabGJuUk5ZVzVoWjJWeUxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMlYyWlc1MEwwRnlhMFYyWlc1MFRXRnVZV2RsY2k1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlEwazdSVUZCUVN4SlFVRkJMRVZCUVUwc1UwRkJReXhUUVVGRUxFVkJRVmtzU1VGQldqdEJRVU5HTEZGQlFVRTdTVUZCUVN4TFFVRkJMRWRCUVZFc1NVRkJTU3hGUVVGRkxFTkJRVU1zVjBGQlVDeERRVUZ0UWl4VFFVRnVRanRKUVVOU0xFbEJRVWtzU1VGQlFTeExRVUZSTEVsQlFWbzdUVUZEU1N4TFFVRkxMRU5CUVVNc1YwRkJUaXhEUVVGclFpeEpRVUZzUWl4RlFVUktPenRYUVVWQkxFVkJRVVVzUTBGQlF5eFpRVUZaTEVOQlFVTXNZVUZCYUVJc1EwRkJPRUlzUzBGQk9VSTdSVUZLUlN4RFFVRk9PMFZCUzBFc1RVRkJRU3hGUVVGUkxGTkJRVU1zVTBGQlJDeEZRVUZaTEZWQlFWb3NSVUZCZDBJc1kwRkJlRUk3UVVGRFNpeFJRVUZCT3p0TlFVRkJMR2xDUVVGclFqczdTVUZEYkVJc1ZVRkJRU3hIUVVGaExFVkJRVVVzUTBGQlF5eGhRVUZoTEVOQlFVTXNUVUZCYWtJc1EwRkRWRHROUVVGQkxFdEJRVUVzUlVGQlR5eEZRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTFCUVhoQ08wMUJRMEVzVTBGQlFTeEZRVUZYTEZOQlJGZzdUVUZGUVN4UlFVRkJMRVZCUVZVc1UwRkJReXhMUVVGRU8wRkJRMDRzWlVGQlR5eFZRVUZCTEVOQlFWY3NTMEZCU3l4RFFVRkRMRmRCUVU0c1EwRkJRU3hEUVVGWUxFVkJRV2RETEV0QlFXaERPMDFCUkVRc1EwRkdWanRMUVVSVE8xZEJUV0lzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXl4WFFVRm9RaXhEUVVFMFFpeFZRVUUxUWl4RlFVRjNReXhqUVVGNFF6dEZRVkpKTEVOQlRGSTdPenRCUVdOS0xFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgRXZlbnROYW1lcztcblxuRXZlbnROYW1lcyA9IHtcbiAgR0FNRV9TVEFSVDogXCJnYW1lLnN0YXJ0XCIsXG4gIEdBTUVfRU5EOiBcImdhbWUuZW5kXCIsXG4gIEdBTUVfTkVYVF9MRVZFTDogXCJnYW1lLm5leHQubGV2ZWxcIixcbiAgR0FNRV9HRVRfUkVTVUxUOiBcImdhbWUuZ2V0LnJlc3VsdFwiXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TmFtZXM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlpYWmxiblF2UVhKclJYWmxiblJPWVcxbGN5NWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTlsZG1WdWRDOUJjbXRGZG1WdWRFNWhiV1Z6TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkJPenRCUVVGQkxGVkJRVUVzUjBGRFNUdEZRVUZCTEZWQlFVRXNSVUZCYTBJc1dVRkJiRUk3UlVGRFFTeFJRVUZCTEVWQlFXdENMRlZCUkd4Q08wVkJSVUVzWlVGQlFTeEZRVUZyUWl4cFFrRkdiRUk3UlVGSlFTeGxRVUZCTEVWQlFXdENMR2xDUVVwc1FqczdPMEZCVFVvc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlmUT09XG4iLCJjYy5nYW1lLm9uU3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIEdhbWVMb2dpYywgZ2FtZURpYWxvZywgZ2FtZUxvZ2ljT2JqLCBzY2VuZU1hbmFnZXI7XG4gIGNjLnZpZXcuYWRqdXN0Vmlld1BvcnQodHJ1ZSk7XG4gIGNjLnZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUoMTEzNiwgNjQwLCBjYy5SZXNvbHV0aW9uUG9saWN5LlNIT1dfQUxMKTtcbiAgY2Mudmlldy5yZXNpemVXaXRoQnJvd3NlclNpemUodHJ1ZSk7XG4gIGNjLkJ1aWxkZXJSZWFkZXIuc2V0UmVzb3VyY2VQYXRoKFwicmVzL1wiKTtcbiAgc2NlbmVNYW5hZ2VyID0gcmVxdWlyZShcIi4vdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZVwiKTtcbiAgc2NlbmVNYW5hZ2VyLmluaXQoKTtcbiAgZ2FtZURpYWxvZyA9IHJlcXVpcmUoJy4vY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZScpO1xuICBzY2VuZU1hbmFnZXIuYWRkTGF5ZXJUb1NjZW5lKGdhbWVEaWFsb2cpO1xuICBHYW1lTG9naWMgPSByZXF1aXJlKCcuL2NvbnRyb2wvQXJrR2FtZUxvZ2ljLmNvZmZlZScpO1xuICBnYW1lTG9naWNPYmogPSBuZXcgR2FtZUxvZ2ljKCk7XG4gIHJldHVybiBnYW1lTG9naWNPYmouaW5pdCgpO1xufTtcblxuY2MuZ2FtZS5ydW4oKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12YldGcGJpNWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTl0WVdsdUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVZJc1IwRkJhMElzVTBGQlFUdEJRVU5rTEUxQlFVRTdSVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRVklzUTBGQmRVSXNTVUZCZGtJN1JVRkRRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEhWQ1FVRlNMRU5CUVdkRExFbEJRV2hETEVWQlFYTkRMRWRCUVhSRExFVkJRVEpETEVWQlFVVXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eFJRVUV2UkR0RlFVTkJMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zY1VKQlFWSXNRMEZCT0VJc1NVRkJPVUk3UlVGRFFTeEZRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMR1ZCUVdwQ0xFTkJRV2xETEUxQlFXcERPMFZCUlVFc1dVRkJRU3hIUVVGbExFOUJRVUVzUTBGQlVTeG5RMEZCVWp0RlFVTm1MRmxCUVZrc1EwRkJReXhKUVVGaUxFTkJRVUU3UlVGRlFTeFZRVUZCTEVkQlFXRXNUMEZCUVN4RFFVRlJMR2REUVVGU08wVkJRMklzV1VGQldTeERRVUZETEdWQlFXSXNRMEZCTmtJc1ZVRkJOMEk3UlVGRlFTeFRRVUZCTEVkQlFWa3NUMEZCUVN4RFFVRlJMQ3RDUVVGU08wVkJRMW9zV1VGQlFTeEhRVUZsTEVsQlFVa3NVMEZCU2l4RFFVRkJPMU5CUTJZc1dVRkJXU3hEUVVGRExFbEJRV0lzUTBGQlFUdEJRV1JqT3p0QlFXZENiRUlzUlVGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRlNMRU5CUVVFaWZRPT1cbiIsInZhciBVc2VyRGF0YTtcblxuVXNlckRhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFVzZXJEYXRhKCkge1xuICAgIHRoaXMuX3Njb3JlID0gMDtcbiAgICB0aGlzLl9jb3VudCA9IDA7XG4gIH1cblxuICBVc2VyRGF0YS5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihfc2NvcmUpIHtcbiAgICB0aGlzLl9zY29yZSA9IF9zY29yZTtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuZ2V0U2NvcmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NvcmU7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLnNldENvdW50ID0gZnVuY3Rpb24oX2NvdW50KSB7XG4gICAgdGhpcy5fY291bnQgPSBfY291bnQ7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLmdldENvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50O1xuICB9O1xuXG4gIHJldHVybiBVc2VyRGF0YTtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyRGF0YTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRWEpyVlhObGNrUmhkR0V1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UVhKclZYTmxja1JoZEdFdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUU3TzBGQlFVMDdSVUZEVnl4clFrRkJRVHRKUVVOVUxFbEJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWVTdTVUZEVml4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVk8wVkJSa1E3TzNGQ1FVbGlMRkZCUVVFc1IwRkJWU3hUUVVGRExFMUJRVVE3U1VGQlF5eEpRVUZETEVOQlFVRXNVMEZCUkR0RlFVRkVPenR4UWtGRlZpeFJRVUZCTEVkQlFWVXNVMEZCUVR0WFFVRkhMRWxCUVVNc1EwRkJRVHRGUVVGS096dHhRa0ZGVml4UlFVRkJMRWRCUVZVc1UwRkJReXhOUVVGRU8wbEJRVU1zU1VGQlF5eERRVUZCTEZOQlFVUTdSVUZCUkRzN2NVSkJSVllzVVVGQlFTeEhRVUZWTEZOQlFVRTdWMEZCUnl4SlFVRkRMRU5CUVVFN1JVRkJTanM3T3pzN08wRkJSV1FzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiIsInZhciBMYXllck1hbmFnZXIsIExvYWRlcjtcblxuTGF5ZXJNYW5hZ2VyID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxheWVyU3RhY2sgPSBbXTtcbiAgICB0aGlzLnNjZW5lID0gbmV3IGNjLlNjZW5lKCk7XG4gICAgcmV0dXJuIGNjLmRpcmVjdG9yLnJ1blNjZW5lKHRoaXMuc2NlbmUpO1xuICB9LFxuICBjbGVhckxheWVyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5sZW5ndGggPSAwO1xuICB9LFxuICBhZGRMYXllclRvU2NlbmU6IGZ1bmN0aW9uKGNjYkxheWVyLCB6T3JkZXIpIHtcbiAgICB2YXIgbGF5b3V0LCBub2RlO1xuICAgIGlmICh6T3JkZXIgPT0gbnVsbCkge1xuICAgICAgek9yZGVyID0gMDtcbiAgICB9XG4gICAgbGF5b3V0ID0gbmV3IGNjdWkuTGF5b3V0KCk7XG4gICAgbGF5b3V0LnNldENvbnRlbnRTaXplKGNjLnNpemUoMTEzNiwgNjQwKSk7XG4gICAgbGF5b3V0LnNldFRvdWNoRW5hYmxlZCh0cnVlKTtcbiAgICBub2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICBub2RlLmFkZENoaWxkKGxheW91dCk7XG4gICAgbm9kZS5hZGRDaGlsZChjY2JMYXllcik7XG4gICAgdGhpcy5zY2VuZS5hZGRDaGlsZChub2RlLCB6T3JkZXIpO1xuICAgIHJldHVybiB0aGlzLmxheWVyU3RhY2sucHVzaChub2RlKTtcbiAgfSxcbiAgcmVtb3ZlVG9wTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0b3BMYXllcjtcbiAgICB0b3BMYXllciA9IHRoaXMubGF5ZXJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdGhpcy5zY2VuZS5yZW1vdmVDaGlsZCh0b3BMYXllciwgdHJ1ZSk7XG4gIH1cbn07XG5cbkxvYWRlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTG9hZGVyKGNjYkZpbGUxLCBjb250cm9sbGVyTmFtZTEpIHtcbiAgICB0aGlzLmNjYkZpbGUgPSBjY2JGaWxlMTtcbiAgICB0aGlzLmNvbnRyb2xsZXJOYW1lID0gY29udHJvbGxlck5hbWUxO1xuICB9XG5cbiAgTG9hZGVyLnByb3RvdHlwZS5zaG93RGlhbG9nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNjLkJ1aWxkZXJSZWFkZXIubG9hZCh0aGlzLmNjYkZpbGUpO1xuICB9O1xuXG4gIHJldHVybiBMb2FkZXI7XG5cbn0pKCk7XG5cbkxheWVyTWFuYWdlci5kZWZpbmVEaWFsb2cgPSBmdW5jdGlvbihjY2JGaWxlLCBjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckNsYXNzKSB7XG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBuZXcgY29udHJvbGxlckNsYXNzKCkpO1xuICByZXR1cm4gbmV3IExvYWRlcihjY2JGaWxlLCBjb250cm9sbGVyTmFtZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyTWFuYWdlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12ZEc5dmJITXZRWEpyVTJObGJtVk5ZVzVoWjJWeUxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMM1J2YjJ4ekwwRnlhMU5qWlc1bFRXRnVZV2RsY2k1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUTBFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlEwazdSVUZCUVN4SlFVRkJMRVZCUVUwc1UwRkJRVHRKUVVOR0xFbEJRVU1zUTBGQlFTeFZRVUZFTEVkQlFXTTdTVUZEWkN4SlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGVExFbEJRVWtzUlVGQlJTeERRVUZETEV0QlFWQXNRMEZCUVR0WFFVTlVMRVZCUVVVc1EwRkJReXhSUVVGUkxFTkJRVU1zVVVGQldpeERRVUZ4UWl4SlFVRkRMRU5CUVVFc1MwRkJkRUk3UlVGSVJTeERRVUZPTzBWQlMwRXNWVUZCUVN4RlFVRlpMRk5CUVVFN1NVRkRVaXhKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEdsQ1FVRlFMRU5CUVVFN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEUxQlFWb3NSMEZCY1VJN1JVRkdZaXhEUVV4YU8wVkJVMEVzWlVGQlFTeEZRVUZyUWl4VFFVRkRMRkZCUVVRc1JVRkJWeXhOUVVGWU8wRkJRMlFzVVVGQlFUczdUVUZFZVVJc1UwRkJVenM3U1VGRGJFTXNUVUZCUVN4SFFVRlRMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVlFzUTBGQlFUdEpRVU5VTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNTVUZCVWl4RlFVRmpMRWRCUVdRc1EwRkJkRUk3U1VGRFFTeE5RVUZOTEVOQlFVTXNaVUZCVUN4RFFVRjFRaXhKUVVGMlFqdEpRVVZCTEVsQlFVRXNSMEZCVFN4SlFVRkpMRVZCUVVVc1EwRkJReXhKUVVGUUxFTkJRVUU3U1VGRFRpeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRTFCUVdRN1NVRkRRU3hKUVVGSkxFTkJRVU1zVVVGQlRDeERRVUZqTEZGQlFXUTdTVUZGUVN4SlFVRkRMRU5CUVVFc1MwRkJTeXhEUVVGRExGRkJRVkFzUTBGQlowSXNTVUZCYUVJc1JVRkJjMElzVFVGQmRFSTdWMEZEUVN4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExFbEJRVm9zUTBGQmFVSXNTVUZCYWtJN1JVRldZeXhEUVZSc1FqdEZRWEZDUVN4alFVRkJMRVZCUVdkQ0xGTkJRVUU3UVVGRFdpeFJRVUZCTzBsQlFVRXNVVUZCUVN4SFFVRlhMRWxCUVVNc1EwRkJRU3hWUVVGVkxFTkJRVU1zUjBGQldpeERRVUZCTzFkQlExZ3NTVUZCUXl4RFFVRkJMRXRCUVVzc1EwRkJReXhYUVVGUUxFTkJRVzFDTEZGQlFXNUNMRVZCUVRaQ0xFbEJRVGRDTzBWQlJsa3NRMEZ5UW1oQ096czdRVUY1UWtVN1JVRkRWeXhuUWtGQlF5eFJRVUZFTEVWQlFWY3NaVUZCV0R0SlFVRkRMRWxCUVVNc1EwRkJRU3hWUVVGRU8wbEJRVlVzU1VGQlF5eERRVUZCTEdsQ1FVRkVPMFZCUVZnN08yMUNRVU5pTEZWQlFVRXNSMEZCWVN4VFFVRkJPMWRCUTFRc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhKUVVGRExFTkJRVUVzVDBGQmRrSTdSVUZFVXpzN096czdPMEZCUjJwQ0xGbEJRVmtzUTBGQlF5eFpRVUZpTEVkQlFUUkNMRk5CUVVNc1QwRkJSQ3hGUVVGVkxHTkJRVllzUlVGQk1FSXNaVUZCTVVJN1JVRkRlRUlzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGpRVVJLTEVWQlJVa3NTVUZCU1N4bFFVRktMRU5CUVVFc1EwRkdTanRUUVV0QkxFbEJRVWtzVFVGQlNpeERRVUZYTEU5QlFWZ3NSVUZCYjBJc1kwRkJjRUk3UVVGT2QwSTdPMEZCVVRWQ0xFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iXX0=
