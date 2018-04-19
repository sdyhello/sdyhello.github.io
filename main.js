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
    console.log("on calc");
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
        console.log("get result");
        return typeof obj.callback === "function" ? obj.callback(_this._getResult(obj.data)) : void 0;
      };
    })(this));
  };

  GameLogic.prototype._getResult = function(data) {
    var calcItem, totalAssetsIndex, totalScore, value;
    totalScore = 0;
    totalAssetsIndex = this._getTypeRowNum(data, needCalcItem.totalAssets);
    g_statisticsYears = this._getStatisticsYears(data, totalAssetsIndex);
    g_log_table.push("totalAssetsIndex " + totalAssetsIndex + ", statisticsYears:" + g_statisticsYears + "\n");
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
    g_log_table.push("totalScore: " + totalScore + "\n");
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
    g_log_table.push(data[typeNum][0] + ", " + data[typeNum][1] + "\n");
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
    g_log_table.push(needCalcItem[type] + " percent:" + (averagePercent.toFixed(2)) + "%, score :" + (score.toFixed(2)) + "\n");
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
    g_log_table.push("初始净利润：" + allRetainedProfits[allRetainedProfits.length - 1] + ", 当前净利润:" + allRetainedProfits[0] + "\n");
    DEBUG("初始净利润：" + allRetainedProfits[allRetainedProfits.length - 1] + ", 当前净利润:" + allRetainedProfits[0]);
    addRetainedProfits = allRetainedProfits[0] / allRetainedProfits[allRetainedProfits.length - 1];
    averagePercent = (this._getCompoundRate(addRetainedProfits, g_statisticsYears) - 1) * 100;
    g_log_table.push("净利润复合增长速度:" + (JSON.stringify(averagePercent)) + "\n");
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
      g_log_table.push("roe:" + (roe.toFixed(2)) + "\n");
      DEBUG("roe:" + (roe.toFixed(2)));
    }
    if (allNetAssets.length === 1) {
      g_log_table.push("averageRoe :" + (totalRoe.toFixed(2)) + "\n");
      DEBUG("averageRoe :" + (totalRoe.toFixed(2)));
      return totalRoe;
    }
    averageRoe = totalRoe / (allNetAssets.length - 1);
    g_log_table.push("averageRoe :" + (averageRoe.toFixed(2)) + "\n");
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9tYWluLmNvZmZlZSIsInNyYy9tb2RlbC9BcmtVc2VyRGF0YS5jb2ZmZWUiLCJzcmMvdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgVEFHX0FTU0VUUywgVEFHX0RFUE9TSVQsIFRBR19MT05HX0xPQU4sIFRBR19SRUNFSVZBQkxFLCBUQUdfUkVUQUlORURfUFJPRklUUywgVEFHX1NIT1JUX0xPQU4sIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcyxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5UQUdfQVNTRVRTID0gXCJ0b3RhbEFzc2V0c1wiO1xuXG5UQUdfUkVDRUlWQUJMRSA9IFwicmVjZWl2YWJsZXNcIjtcblxuVEFHX0RFUE9TSVQgPSBcImRlcG9zaXRSZWNlaXZlZFwiO1xuXG5UQUdfUkVUQUlORURfUFJPRklUUyA9IFwicmV0YWluZWRQcm9maXRzXCI7XG5cblRBR19TSE9SVF9MT0FOID0gXCJzaG9ydExvYW5cIjtcblxuVEFHX0xPTkdfTE9BTiA9IFwibG9uZ0xvYW5cIjtcblxuQXJrTWFpbkRpYWxvZyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQXJrTWFpbkRpYWxvZygpIHt9XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25EaWRMb2FkRnJvbUNDQiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2VkaXRCb3hUYWJsZSA9IHt9O1xuICAgIHRoaXMuX2RhdFRhYmxlID0gW107XG4gICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWRpdEJveCwgaSwgaW5kZXg7XG4gICAgZm9yIChpbmRleCA9IGkgPSAxOyBpIDw9IDY7IGluZGV4ID0gKytpKSB7XG4gICAgICBpZiAodGhpc1tcImNjYl90ZXh0RmllbGRfXCIgKyBpbmRleF0gPT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiY2NiX3RleHRGaWVsZF9cIiArIGluZGV4KTtcbiAgICAgIGVkaXRCb3ggPSB0aGlzLl9jcmVhdGVFZGl0Qm94KHRoaXNbXCJjY2JfdGV4dEZpZWxkX1wiICsgaW5kZXhdKTtcbiAgICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQoZWRpdEJveCk7XG4gICAgICB0aGlzLl9lZGl0Qm94VGFibGVbdGhpcy5fZ2V0RWRpdEJveE5hbWUoaW5kZXgpXSA9IGVkaXRCb3g7XG4gICAgfVxuICAgIHRoaXMuX2luaXRUZXN0RGF0YSgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9pbml0VGVzdERhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5kZXgsIGtleSwgcmVmLCByZXN1bHRzLCB0ZXN0RGF0YSwgdmFsdWU7XG4gICAgdGVzdERhdGEgPSBbXCIxMzI2NzUwMDAwMDBcIiwgXCIxNDMyNzM0MDAwXCIsIFwiNDA3NzA2MDAwMDAwXCIsIFwiMjc4OTA0ODMzMDBcIiwgXCIxNjEwODg1ODcwMFwiLCBcIjk2MDI5MDQ0NzAwXCJdO1xuICAgIGluZGV4ID0gMDtcbiAgICByZWYgPSB0aGlzLl9lZGl0Qm94VGFibGU7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgaWYgKCFoYXNQcm9wLmNhbGwocmVmLCBrZXkpKSBjb250aW51ZTtcbiAgICAgIHZhbHVlID0gcmVmW2tleV07XG4gICAgICBjb25zb2xlLmxvZyh2YWx1ZSwgdGVzdERhdGFbaW5kZXhdKTtcbiAgICAgIHZhbHVlLnNldFN0cmluZyh0ZXN0RGF0YVtpbmRleF0pO1xuICAgICAgcmVzdWx0cy5wdXNoKGluZGV4KyspO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5fZ2V0RWRpdEJveE5hbWUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHZhciB0YWc7XG4gICAgdGFnID0gXCJcIjtcbiAgICBzd2l0Y2ggKGluZGV4KSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRhZyA9IFRBR19BU1NFVFM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0YWcgPSBUQUdfUkVDRUlWQUJMRTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRhZyA9IFRBR19ERVBPU0lUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgdGFnID0gVEFHX1JFVEFJTkVEX1BST0ZJVFM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA1OlxuICAgICAgICB0YWcgPSBUQUdfU0hPUlRfTE9BTjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDY6XG4gICAgICAgIHRhZyA9IFRBR19MT05HX0xPQU47XG4gICAgfVxuICAgIHJldHVybiB0YWc7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2NyZWF0ZUVkaXRCb3ggPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIGVkaXRCb3g7XG4gICAgZWRpdEJveCA9IG5ldyBjYy5FZGl0Qm94KGNjLnNpemUoMjAwLCA1MCkpO1xuICAgIGVkaXRCb3guc2V0UG9zaXRpb24obm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICBlZGl0Qm94LnNldElucHV0TW9kZShjYy5FRElUQk9YX0lOUFVUX01PREVfU0lOR0xFTElORSk7XG4gICAgZWRpdEJveC5zZXRSZXR1cm5UeXBlKGNjLktFWUJPQVJEX1JFVFVSTlRZUEVfRE9ORSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dEZsYWcoY2MuRURJVEJPWF9JTlBVVF9GTEFHX0lOSVRJQUxfQ0FQU19TRU5URU5DRSk7XG4gICAgZWRpdEJveC5zZXRNYXhMZW5ndGgoMTMpO1xuICAgIGVkaXRCb3guc2V0Rm9udChcIkFyaWFsXCIsIDI2KTtcbiAgICBlZGl0Qm94LnNldEZvbnRDb2xvcihjYy5jb2xvcigxMDAsIDEwMCwgMjU1LCAyNTUpKTtcbiAgICByZXR1cm4gZWRpdEJveDtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgdmFyIGNvbnRlbnRTaXplO1xuICAgIHRoaXMuY2NiX3Jlc3VsdC5zZXRTdHJpbmcocmVzdWx0KTtcbiAgICBjb250ZW50U2l6ZSA9IHRoaXMuY2NiX3Jlc3VsdC5nZXRDb250ZW50U2l6ZSgpO1xuICAgIHJldHVybiB0aGlzLmNjYl9yZXN1bHRfYmcuc2V0Q29udGVudFNpemUoY2Muc2l6ZShjb250ZW50U2l6ZS53aWR0aCArIDUwLCBjb250ZW50U2l6ZS5oZWlnaHQgKyA1MCkpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLm9uQ2FsYyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhVGFibGUsIGRlcG9zaXRSZWNlaXZlLCBkZXBvc2l0UmVjZWl2ZVRhYmxlLCBsb25nTG9hbiwgbG9uZ0xvYW5UYWJsZSwgcmVjZWl2YWJsZSwgcmVjZWl2YWJsZVRhYmxlLCByZXRhaW5lZFByb2ZpdHMsIHJldGFpbmVkUHJvZml0c1RhYmxlLCBzaG9ydExvYW4sIHNob3J0TG9hblRhYmxlLCB0b3RhbEFzc2V0cywgdG90YWxBc3NldHNUYWJsZTtcbiAgICB0b3RhbEFzc2V0cyA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX0FTU0VUU10uZ2V0U3RyaW5nKCkpO1xuICAgIHRvdGFsQXNzZXRzVGFibGUgPSBbVEFHX0FTU0VUUywgdG90YWxBc3NldHNdO1xuICAgIHJlY2VpdmFibGUgPSBOdW1iZXIodGhpcy5fZWRpdEJveFRhYmxlW1RBR19SRUNFSVZBQkxFXS5nZXRTdHJpbmcoKSk7XG4gICAgcmVjZWl2YWJsZVRhYmxlID0gW1RBR19SRUNFSVZBQkxFLCByZWNlaXZhYmxlXTtcbiAgICBkZXBvc2l0UmVjZWl2ZSA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX0RFUE9TSVRdLmdldFN0cmluZygpKTtcbiAgICBkZXBvc2l0UmVjZWl2ZVRhYmxlID0gW1RBR19ERVBPU0lULCBkZXBvc2l0UmVjZWl2ZV07XG4gICAgcmV0YWluZWRQcm9maXRzID0gTnVtYmVyKHRoaXMuX2VkaXRCb3hUYWJsZVtUQUdfUkVUQUlORURfUFJPRklUU10uZ2V0U3RyaW5nKCkpO1xuICAgIHJldGFpbmVkUHJvZml0c1RhYmxlID0gW1RBR19SRVRBSU5FRF9QUk9GSVRTLCByZXRhaW5lZFByb2ZpdHNdO1xuICAgIHNob3J0TG9hbiA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX1NIT1JUX0xPQU5dLmdldFN0cmluZygpKTtcbiAgICBzaG9ydExvYW5UYWJsZSA9IFtUQUdfU0hPUlRfTE9BTiwgc2hvcnRMb2FuXTtcbiAgICBsb25nTG9hbiA9IE51bWJlcih0aGlzLl9lZGl0Qm94VGFibGVbVEFHX0xPTkdfTE9BTl0uZ2V0U3RyaW5nKCkpO1xuICAgIGxvbmdMb2FuVGFibGUgPSBbVEFHX0xPTkdfTE9BTiwgbG9uZ0xvYW5dO1xuICAgIGRhdGFUYWJsZSA9IFt0b3RhbEFzc2V0c1RhYmxlLCByZWNlaXZhYmxlVGFibGUsIGRlcG9zaXRSZWNlaXZlVGFibGUsIHJldGFpbmVkUHJvZml0c1RhYmxlLCBzaG9ydExvYW5UYWJsZSwgbG9uZ0xvYW5UYWJsZV07XG4gICAgY29uc29sZS5sb2coXCJvbiBjYWxjXCIpO1xuICAgIHJldHVybiBldmVudE1hbmFnZXIuc2VuZChldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwge1xuICAgICAgZGF0YTogZGF0YVRhYmxlLFxuICAgICAgY2FsbGJhY2s6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnNob3dSZXN1bHQoc3RyKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH07XG5cbiAgY2MuQnVpbGRlclJlYWRlci5yZWdpc3RlckNvbnRyb2xsZXIoXCJBcmtNYWluRGlhbG9nXCIsIG5ldyBBcmtNYWluRGlhbG9nKCkpO1xuXG4gIHJldHVybiBBcmtNYWluRGlhbG9nO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLkJ1aWxkZXJSZWFkZXIubG9hZChcInJlcy9tYWluLmNjYmlcIik7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyTmlWbWxsZHk5QmNtdE5ZV2x1UkdsaGJHOW5MbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDJOallsWnBaWGN2UVhKclRXRnBia1JwWVd4dlp5NWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4eFNVRkJRVHRGUVVGQk96dEJRVUZCTEZsQlFVRXNSMEZCWlN4UFFVRkJMRU5CUVZFc2FVTkJRVkk3TzBGQlEyWXNWVUZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3dyUWtGQlVqczdRVUZGWWl4VlFVRkJMRWRCUVdFN08wRkJRMklzWTBGQlFTeEhRVUZwUWpzN1FVRkRha0lzVjBGQlFTeEhRVUZqT3p0QlFVTmtMRzlDUVVGQkxFZEJRWFZDT3p0QlFVTjJRaXhqUVVGQkxFZEJRV2xDT3p0QlFVTnFRaXhoUVVGQkxFZEJRV2RDT3p0QlFVVldPenM3TUVKQlEwWXNaMEpCUVVFc1IwRkJhMElzVTBGQlFUdEpRVU5rTEVsQlFVTXNRMEZCUVN4aFFVRkVMRWRCUVdsQ08wbEJRMnBDTEVsQlFVTXNRMEZCUVN4VFFVRkVMRWRCUVdFN1YwRkRZaXhKUVVGRExFTkJRVUVzU1VGQlJDeERRVUZCTzBWQlNHTTdPekJDUVV0c1FpeEpRVUZCTEVkQlFVMHNVMEZCUVR0QlFVTkdMRkZCUVVFN1FVRkJRU3hUUVVGaExHdERRVUZpTzAxQlEwa3NTVUZCWjBJc2MwTkJRV2hDTzBGQlFVRXNhVUpCUVVFN08wMUJRMEVzVDBGQlR5eERRVUZETEVkQlFWSXNRMEZCV1N4blFrRkJRU3hIUVVGcFFpeExRVUUzUWp0TlFVTkJMRTlCUVVFc1IwRkJWU3hKUVVGRExFTkJRVUVzWTBGQlJDeERRVUZuUWl4SlFVRkZMRU5CUVVFc1owSkJRVUVzUjBGQmFVSXNTMEZCYWtJc1EwRkJiRUk3VFVGRFZpeEpRVUZETEVOQlFVRXNVVUZCVVN4RFFVRkRMRkZCUVZZc1EwRkJiVUlzVDBGQmJrSTdUVUZEUVN4SlFVRkRMRU5CUVVFc1lVRkJZeXhEUVVGQkxFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFXbENMRXRCUVdwQ0xFTkJRVUVzUTBGQlppeEhRVUV3UXp0QlFVdzVRenRKUVU5QkxFbEJRVU1zUTBGQlFTeGhRVUZFTEVOQlFVRTdSVUZTUlRzN01FSkJXVTRzWVVGQlFTeEhRVUZsTEZOQlFVRTdRVUZEV0N4UlFVRkJPMGxCUVVFc1VVRkJRU3hIUVVGWExFTkJRVU1zWTBGQlJDeEZRVUZwUWl4WlFVRnFRaXhGUVVFclFpeGpRVUV2UWl4RlFVRXJReXhoUVVFdlF5eEZRVUU0UkN4aFFVRTVSQ3hGUVVFMlJTeGhRVUUzUlR0SlFVTllMRXRCUVVFc1IwRkJVVHRCUVVOU08wRkJRVUU3VTBGQlFTeFZRVUZCT3pzN1RVRkRTU3hQUVVGUExFTkJRVU1zUjBGQlVpeERRVUZaTEV0QlFWb3NSVUZCYlVJc1VVRkJVeXhEUVVGQkxFdEJRVUVzUTBGQk5VSTdUVUZEUVN4TFFVRkxMRU5CUVVNc1UwRkJUaXhEUVVGblFpeFJRVUZUTEVOQlFVRXNTMEZCUVN4RFFVRjZRanR0UWtGRFFTeExRVUZCTzBGQlNFbzdPMFZCU0ZjN096QkNRVkZtTEdWQlFVRXNSMEZCYVVJc1UwRkJReXhMUVVGRU8wRkJRMklzVVVGQlFUdEpRVUZCTEVkQlFVRXNSMEZCVFR0QlFVTk9MRmxCUVU4c1MwRkJVRHRCUVVGQkxGZEJRMU1zUTBGRVZEdFJRVVZSTEVkQlFVRXNSMEZCVFR0QlFVUk1PMEZCUkZRc1YwRkhVeXhEUVVoVU8xRkJTVkVzUjBGQlFTeEhRVUZOTzBGQlJFdzdRVUZJVkN4WFFVdFRMRU5CVEZRN1VVRk5VU3hIUVVGQkxFZEJRVTA3UVVGRVREdEJRVXhVTEZkQlQxTXNRMEZRVkR0UlFWRlJMRWRCUVVFc1IwRkJUVHRCUVVSTU8wRkJVRlFzVjBGVFV5eERRVlJVTzFGQlZWRXNSMEZCUVN4SFFVRk5PMEZCUkV3N1FVRlVWQ3hYUVZkVExFTkJXRlE3VVVGWlVTeEhRVUZCTEVkQlFVMDdRVUZhWkR0QlFXRkJMRmRCUVU4N1JVRm1UVHM3TUVKQmFVSnFRaXhqUVVGQkxFZEJRV2RDTEZOQlFVTXNTVUZCUkR0QlFVTmFMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzU1VGQlNTeEZRVUZGTEVOQlFVTXNUMEZCVUN4RFFVRmxMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlVpeEZRVUZoTEVWQlFXSXNRMEZCWmp0SlFVTldMRTlCUVU4c1EwRkJReXhYUVVGU0xFTkJRVzlDTEVsQlFVa3NRMEZCUXl4WFFVRk1MRU5CUVVFc1EwRkJjRUk3U1VGRFFTeFBRVUZQTEVOQlFVTXNXVUZCVWl4RFFVRnhRaXhGUVVGRkxFTkJRVU1zTmtKQlFYaENPMGxCUTBFc1QwRkJUeXhEUVVGRExHRkJRVklzUTBGQmMwSXNSVUZCUlN4RFFVRkRMSGRDUVVGNlFqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5eDNRMEZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRnlRanRKUVVOQkxFOUJRVThzUTBGQlF5eFBRVUZTTEVOQlFXZENMRTlCUVdoQ0xFVkJRWGxDTEVWQlFYcENPMGxCUTBFc1QwRkJUeXhEUVVGRExGbEJRVklzUTBGQmNVSXNSVUZCUlN4RFFVRkRMRXRCUVVnc1EwRkJVeXhIUVVGVUxFVkJRV01zUjBGQlpDeEZRVUZ0UWl4SFFVRnVRaXhGUVVGM1FpeEhRVUY0UWl4RFFVRnlRanRCUVVOQkxGZEJRVTg3UlVGVVN6czdNRUpCVjJoQ0xGVkJRVUVzUjBGQldTeFRRVUZETEUxQlFVUTdRVUZEVWl4UlFVRkJPMGxCUVVFc1NVRkJReXhEUVVGQkxGVkJRVlVzUTBGQlF5eFRRVUZhTEVOQlFYTkNMRTFCUVhSQ08wbEJRMEVzVjBGQlFTeEhRVUZqTEVsQlFVTXNRMEZCUVN4VlFVRlZMRU5CUVVNc1kwRkJXaXhEUVVGQk8xZEJRMlFzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4alFVRm1MRU5CUVRoQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNWMEZCVnl4RFFVRkRMRXRCUVZvc1IwRkJiMElzUlVGQk5VSXNSVUZCWjBNc1YwRkJWeXhEUVVGRExFMUJRVm9zUjBGQmNVSXNSVUZCY2tRc1EwRkJPVUk3UlVGSVVUczdNRUpCUzFvc1RVRkJRU3hIUVVGUkxGTkJRVUU3UVVGRFNpeFJRVUZCTzBsQlFVRXNWMEZCUVN4SFFVRmpMRTFCUVVFc1EwRkJUeXhKUVVGRExFTkJRVUVzWVVGQll5eERRVUZCTEZWQlFVRXNRMEZCVnl4RFFVRkRMRk5CUVROQ0xFTkJRVUVzUTBGQlVEdEpRVU5rTEdkQ1FVRkJMRWRCUVcxQ0xFTkJRVU1zVlVGQlJDeEZRVUZoTEZkQlFXSTdTVUZEYmtJc1ZVRkJRU3hIUVVGaExFMUJRVUVzUTBGQlR5eEpRVUZETEVOQlFVRXNZVUZCWXl4RFFVRkJMR05CUVVFc1EwRkJaU3hEUVVGRExGTkJRUzlDTEVOQlFVRXNRMEZCVUR0SlFVTmlMR1ZCUVVFc1IwRkJhMElzUTBGQlF5eGpRVUZFTEVWQlFXbENMRlZCUVdwQ08wbEJRMnhDTEdOQlFVRXNSMEZCYVVJc1RVRkJRU3hEUVVGUExFbEJRVU1zUTBGQlFTeGhRVUZqTEVOQlFVRXNWMEZCUVN4RFFVRlpMRU5CUVVNc1UwRkJOVUlzUTBGQlFTeERRVUZRTzBsQlEycENMRzFDUVVGQkxFZEJRWE5DTEVOQlFVTXNWMEZCUkN4RlFVRmpMR05CUVdRN1NVRkRkRUlzWlVGQlFTeEhRVUZyUWl4TlFVRkJMRU5CUVU4c1NVRkJReXhEUVVGQkxHRkJRV01zUTBGQlFTeHZRa0ZCUVN4RFFVRnhRaXhEUVVGRExGTkJRWEpETEVOQlFVRXNRMEZCVUR0SlFVTnNRaXh2UWtGQlFTeEhRVUYxUWl4RFFVRkRMRzlDUVVGRUxFVkJRWFZDTEdWQlFYWkNPMGxCUTNaQ0xGTkJRVUVzUjBGQldTeE5RVUZCTEVOQlFVOHNTVUZCUXl4RFFVRkJMR0ZCUVdNc1EwRkJRU3hqUVVGQkxFTkJRV1VzUTBGQlF5eFRRVUV2UWl4RFFVRkJMRU5CUVZBN1NVRkRXaXhqUVVGQkxFZEJRV2xDTEVOQlFVTXNZMEZCUkN4RlFVRnBRaXhUUVVGcVFqdEpRVU5xUWl4UlFVRkJMRWRCUVZjc1RVRkJRU3hEUVVGUExFbEJRVU1zUTBGQlFTeGhRVUZqTEVOQlFVRXNZVUZCUVN4RFFVRmpMRU5CUVVNc1UwRkJPVUlzUTBGQlFTeERRVUZRTzBsQlExZ3NZVUZCUVN4SFFVRm5RaXhEUVVGRExHRkJRVVFzUlVGQlowSXNVVUZCYUVJN1NVRkZhRUlzVTBGQlFTeEhRVUZaTEVOQlFVTXNaMEpCUVVRc1JVRkJiVUlzWlVGQmJrSXNSVUZCYjBNc2JVSkJRWEJETEVWQlFYbEVMRzlDUVVGNlJDeEZRVUVyUlN4alFVRXZSU3hGUVVFclJpeGhRVUV2Ump0SlFVVmFMRTlCUVU4c1EwRkJReXhIUVVGU0xFTkJRVmtzVTBGQldqdFhRVU5CTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVd0Q0xGVkJRVlVzUTBGQlF5eGxRVUUzUWl4RlFVTkpPMDFCUVVFc1NVRkJRU3hGUVVGTkxGTkJRVTQ3VFVGRFFTeFJRVUZCTEVWQlFWVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1pVRkJRU3hUUVVGRExFZEJRVVE3YVVKQlEwNHNTMEZCUXl4RFFVRkJMRlZCUVVRc1EwRkJXU3hIUVVGYU8xRkJSRTA3VFVGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJMRU5CUkZZN1MwRkVTanRGUVdwQ1NUczdSVUZ6UWxJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eHJRa0ZCYWtJc1EwRkRTU3hsUVVSS0xFVkJSVWtzU1VGQlNTeGhRVUZLTEVOQlFVRXNRMEZHU2pzN096czdPMEZCUzBvc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhKUVVGcVFpeERRVUZ6UWl4bFFVRjBRaUo5XG4iLCJ2YXIgREVCVUcsIEdhbWVMb2dpYywgVXNlckRhdGEsIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcywgZ19sb2dfdGFibGUsIGdfc3RhdGlzdGljc1llYXJzLCBtYXhTdGF0aXN0aWNzWWVhcnMsIG5lZWRDYWxjSXRlbSwgbmVlZFNob3dMb2csIHNjZW5lTWFuYWdlcixcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbmdfc3RhdGlzdGljc1llYXJzID0gNTtcblxubWF4U3RhdGlzdGljc1llYXJzID0gNjtcblxubmVlZFNob3dMb2cgPSBcIm5lZWRcIjtcblxubmVlZENhbGNJdGVtID0ge1xuICBcInRvdGFsQXNzZXRzXCI6IFwidG90YWxBc3NldHNcIixcbiAgXCJyZWNlaXZhYmxlc1wiOiBcInJlY2VpdmFibGVzXCIsXG4gIFwicmV0YWluZWRQcm9maXRzXCI6IFwicmV0YWluZWRQcm9maXRzXCIsXG4gIFwiZGVwb3NpdFJlY2VpdmVkXCI6IFwiZGVwb3NpdFJlY2VpdmVkXCIsXG4gIFwic2hvcnRMb2FuXCI6IFwic2hvcnRMb2FuXCIsXG4gIFwibG9uZ0xvYW5cIjogXCJsb25nTG9hblwiXG59O1xuXG5nX2xvZ190YWJsZSA9IFtdO1xuXG5pZiAobmVlZFNob3dMb2cgPT09IFwibmVlZFwiKSB7XG4gIERFQlVHID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbn0gZWxzZSB7XG4gIERFQlVHID0gZnVuY3Rpb24oKSB7fTtcbn1cblxuR2FtZUxvZ2ljID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lTG9naWMoKSB7fVxuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5saXN0ZW4oZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBjb25zb2xlLmxvZyhcImdldCByZXN1bHRcIik7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqLmNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgPyBvYmouY2FsbGJhY2soX3RoaXMuX2dldFJlc3VsdChvYmouZGF0YSkpIDogdm9pZCAwO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0UmVzdWx0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBjYWxjSXRlbSwgdG90YWxBc3NldHNJbmRleCwgdG90YWxTY29yZSwgdmFsdWU7XG4gICAgdG90YWxTY29yZSA9IDA7XG4gICAgdG90YWxBc3NldHNJbmRleCA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgbmVlZENhbGNJdGVtLnRvdGFsQXNzZXRzKTtcbiAgICBnX3N0YXRpc3RpY3NZZWFycyA9IHRoaXMuX2dldFN0YXRpc3RpY3NZZWFycyhkYXRhLCB0b3RhbEFzc2V0c0luZGV4KTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwidG90YWxBc3NldHNJbmRleCBcIiArIHRvdGFsQXNzZXRzSW5kZXggKyBcIiwgc3RhdGlzdGljc1llYXJzOlwiICsgZ19zdGF0aXN0aWNzWWVhcnMgKyBcIlxcblwiKTtcbiAgICBERUJVRyhcInRvdGFsQXNzZXRzSW5kZXggXCIgKyB0b3RhbEFzc2V0c0luZGV4ICsgXCIsIHN0YXRpc3RpY3NZZWFyczpcIiArIGdfc3RhdGlzdGljc1llYXJzKTtcbiAgICBmb3IgKGNhbGNJdGVtIGluIG5lZWRDYWxjSXRlbSkge1xuICAgICAgaWYgKCFoYXNQcm9wLmNhbGwobmVlZENhbGNJdGVtLCBjYWxjSXRlbSkpIGNvbnRpbnVlO1xuICAgICAgdmFsdWUgPSBuZWVkQ2FsY0l0ZW1bY2FsY0l0ZW1dO1xuICAgICAgaWYgKHZhbHVlID09PSBcInRvdGFsQXNzZXRzXCIgfHwgdmFsdWUgPT09IFwicmV0YWluZWRQcm9maXRzXCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2NhbGNTY29yZShkYXRhLCBjYWxjSXRlbSwgdmFsdWUsIHRvdGFsQXNzZXRzSW5kZXgpO1xuICAgIH1cbiAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2dldFJldGFpbmVkUHJvZml0c1Njb3JlKGRhdGEpO1xuICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fZ2V0Um9lU2NvcmUoZGF0YSk7XG4gICAgdG90YWxTY29yZSA9IE1hdGguY2VpbCh0b3RhbFNjb3JlKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwidG90YWxTY29yZTogXCIgKyB0b3RhbFNjb3JlICsgXCJcXG5cIik7XG4gICAgY29uc29sZS5sb2coXCJ0b3RhbFNjb3JlOiBcIiArIHRvdGFsU2NvcmUpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShnX2xvZ190YWJsZSk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0UmVjZWl2ZVNjb3JlID0gZnVuY3Rpb24ocGVyY2VudCkge1xuICAgIHJldHVybiAtcGVyY2VudDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRTY29yZSA9IGZ1bmN0aW9uKHR5cGUsIHBlcmNlbnQpIHtcbiAgICB2YXIgc2NvcmU7XG4gICAgc2NvcmUgPSAwO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcInJlY2VpdmFibGVzXCI6XG4gICAgICAgIHNjb3JlID0gdGhpcy5fZ2V0UmVjZWl2ZVNjb3JlKHBlcmNlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkZXBvc2l0UmVjZWl2ZWRcIjpcbiAgICAgICAgc2NvcmUgPSBwZXJjZW50O1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gXCJzaG9ydExvYW5cIiB8fCB0eXBlID09PSBcImxvbmdMb2FuXCIpIHtcbiAgICAgIHNjb3JlID0gNDAgLSBwZXJjZW50O1xuICAgIH1cbiAgICByZXR1cm4gc2NvcmU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VmFsaWROdW1iZXIgPSBmdW5jdGlvbihudW1iZXJTdHIpIHtcbiAgICB2YXIgbnVtO1xuICAgIGlmICh0eXBlb2YgbnVtYmVyU3RyID09PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gbnVtYmVyU3RyO1xuICAgIH1cbiAgICBudW0gPSBudW1iZXJTdHIudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gTnVtYmVyKG51bSk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VHlwZVJvd051bSA9IGZ1bmN0aW9uKGRhdGEsIHR5cGVTdHIpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGxlbiwgcm93LCB0eXBlTnVtO1xuICAgIHR5cGVOdW0gPSAwO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICByb3cgPSBkYXRhW2luZGV4XTtcbiAgICAgIGlmIChyb3dbMF0uaW5kZXhPZih0eXBlU3RyKSAhPT0gLTEpIHtcbiAgICAgICAgdHlwZU51bSA9IGluZGV4O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVOdW07XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0Q29tcG91bmRSYXRlID0gZnVuY3Rpb24oYWRkUmF0ZSwgdGltZSkge1xuICAgIHJldHVybiBNYXRoLmV4cCgxIC8gdGltZSAqIE1hdGgubG9nKGFkZFJhdGUpKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9jYWxjU2NvcmUgPSBmdW5jdGlvbihkYXRhLCB0eXBlLCB0eXBlU3RyLCB0b3RhbEFzc2V0c0luZGV4KSB7XG4gICAgdmFyIGF2ZXJhZ2VQZXJjZW50LCBpLCByZWYsIHNjb3JlLCB0b3RhbFBlcmNlbnQsIHR5cGVOdW0sIHllYXJJbmRleDtcbiAgICB0eXBlTnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCB0eXBlU3RyKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKGRhdGFbdHlwZU51bV1bMF0gKyBcIiwgXCIgKyBkYXRhW3R5cGVOdW1dWzFdICsgXCJcXG5cIik7XG4gICAgREVCVUcoZGF0YVt0eXBlTnVtXVswXSwgZGF0YVt0eXBlTnVtXVsxXSwgdHlwZU51bSk7XG4gICAgdG90YWxQZXJjZW50ID0gMDtcbiAgICBmb3IgKHllYXJJbmRleCA9IGkgPSAxLCByZWYgPSBnX3N0YXRpc3RpY3NZZWFyczsgMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyB5ZWFySW5kZXggPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgaWYgKGRhdGFbdHlwZU51bV1beWVhckluZGV4XSA9PSBudWxsKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdG90YWxQZXJjZW50ICs9IHRoaXMuX2dldFZhbGlkTnVtYmVyKGRhdGFbdHlwZU51bV1beWVhckluZGV4XSkgLyB0aGlzLl9nZXRWYWxpZE51bWJlcihkYXRhW3RvdGFsQXNzZXRzSW5kZXhdW3llYXJJbmRleF0pICogMTAwO1xuICAgIH1cbiAgICBhdmVyYWdlUGVyY2VudCA9IHRvdGFsUGVyY2VudCAvIGdfc3RhdGlzdGljc1llYXJzO1xuICAgIHNjb3JlID0gdGhpcy5fZ2V0U2NvcmUodHlwZSwgYXZlcmFnZVBlcmNlbnQpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2gobmVlZENhbGNJdGVtW3R5cGVdICsgXCIgcGVyY2VudDpcIiArIChhdmVyYWdlUGVyY2VudC50b0ZpeGVkKDIpKSArIFwiJSwgc2NvcmUgOlwiICsgKHNjb3JlLnRvRml4ZWQoMikpICsgXCJcXG5cIik7XG4gICAgREVCVUcobmVlZENhbGNJdGVtW3R5cGVdICsgXCIgcGVyY2VudDpcIiArIChhdmVyYWdlUGVyY2VudC50b0ZpeGVkKDIpKSArIFwiJSwgc2NvcmUgOlwiICsgKHNjb3JlLnRvRml4ZWQoMikpKTtcbiAgICByZXR1cm4gc2NvcmU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0U3RhdGlzdGljc1llYXJzID0gZnVuY3Rpb24oZGF0YSwgdG90YWxBc3NldHNJbmRleCkge1xuICAgIHZhciBsZW5ndGgsIHRvdGFsQXNzZXRzO1xuICAgIHRvdGFsQXNzZXRzID0gZGF0YVt0b3RhbEFzc2V0c0luZGV4XS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPiAwO1xuICAgIH0pO1xuICAgIGxlbmd0aCA9IDA7XG4gICAgaWYgKHRvdGFsQXNzZXRzLmxlbmd0aCA+IG1heFN0YXRpc3RpY3NZZWFycykge1xuICAgICAgbGVuZ3RoID0gbWF4U3RhdGlzdGljc1llYXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b3RhbEFzc2V0cy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0VGFibGVCeU5hbWUgPSBmdW5jdGlvbihkYXRhLCBuYW1lKSB7XG4gICAgdmFyIHJvd051bSwgdGFibGU7XG4gICAgcm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBuYW1lKTtcbiAgICB0YWJsZSA9IGRhdGFbcm93TnVtXS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPiAwO1xuICAgIH0pO1xuICAgIHJldHVybiB0YWJsZS5zbGljZSgwLCBtYXhTdGF0aXN0aWNzWWVhcnMpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJldGFpbmVkUHJvZml0c1Njb3JlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBhZGRSZXRhaW5lZFByb2ZpdHMsIGFsbFJldGFpbmVkUHJvZml0cywgYXZlcmFnZVBlcmNlbnQ7XG4gICAgYWxsUmV0YWluZWRQcm9maXRzID0gdGhpcy5fZ2V0VGFibGVCeU5hbWUoZGF0YSwgbmVlZENhbGNJdGVtLnJldGFpbmVkUHJvZml0cyk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuWIneWni+WHgOWIqea2pu+8mlwiICsgYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXSArIFwiLCDlvZPliY3lh4DliKnmtqY6XCIgKyBhbGxSZXRhaW5lZFByb2ZpdHNbMF0gKyBcIlxcblwiKTtcbiAgICBERUJVRyhcIuWIneWni+WHgOWIqea2pu+8mlwiICsgYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXSArIFwiLCDlvZPliY3lh4DliKnmtqY6XCIgKyBhbGxSZXRhaW5lZFByb2ZpdHNbMF0pO1xuICAgIGFkZFJldGFpbmVkUHJvZml0cyA9IGFsbFJldGFpbmVkUHJvZml0c1swXSAvIGFsbFJldGFpbmVkUHJvZml0c1thbGxSZXRhaW5lZFByb2ZpdHMubGVuZ3RoIC0gMV07XG4gICAgYXZlcmFnZVBlcmNlbnQgPSAodGhpcy5fZ2V0Q29tcG91bmRSYXRlKGFkZFJldGFpbmVkUHJvZml0cywgZ19zdGF0aXN0aWNzWWVhcnMpIC0gMSkgKiAxMDA7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuWHgOWIqea2puWkjeWQiOWinumVv+mAn+W6pjpcIiArIChKU09OLnN0cmluZ2lmeShhdmVyYWdlUGVyY2VudCkpICsgXCJcXG5cIik7XG4gICAgREVCVUcoXCLlh4DliKnmtqblpI3lkIjlop7plb/pgJ/luqY6XCIgKyAoSlNPTi5zdHJpbmdpZnkoYXZlcmFnZVBlcmNlbnQpKSk7XG4gICAgcmV0dXJuIGF2ZXJhZ2VQZXJjZW50O1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJvZVNjb3JlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBhbGxOZXRBc3NldHMsIGF2ZXJhZ2VSb2UsIGksIGluZGV4LCBsZW4sIG5ldEFzc2V0LCByZXRhaW5lZFByb2ZpdHNSb3dOdW0sIHJvZSwgdG90YWxSb2U7XG4gICAgcmV0YWluZWRQcm9maXRzUm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBuZWVkQ2FsY0l0ZW0ucmV0YWluZWRQcm9maXRzKTtcbiAgICBhbGxOZXRBc3NldHMgPSB0aGlzLl9nZXRUYWJsZUJ5TmFtZShkYXRhLCBuZWVkQ2FsY0l0ZW0udG90YWxBc3NldHMpO1xuICAgIHRvdGFsUm9lID0gMDtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IGFsbE5ldEFzc2V0cy5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICBuZXRBc3NldCA9IGFsbE5ldEFzc2V0c1tpbmRleF07XG4gICAgICBpZiAoaW5kZXggPT09IGFsbE5ldEFzc2V0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcm9lID0gZGF0YVtyZXRhaW5lZFByb2ZpdHNSb3dOdW1dW2luZGV4ICsgMV0gLyAoKHRoaXMuX2dldFZhbGlkTnVtYmVyKG5ldEFzc2V0KSArIHRoaXMuX2dldFZhbGlkTnVtYmVyKGFsbE5ldEFzc2V0c1tpbmRleCArIDFdKSkgLyAyKSAqIDEwMDtcbiAgICAgIHRvdGFsUm9lICs9IHJvZTtcbiAgICAgIGdfbG9nX3RhYmxlLnB1c2goXCJyb2U6XCIgKyAocm9lLnRvRml4ZWQoMikpICsgXCJcXG5cIik7XG4gICAgICBERUJVRyhcInJvZTpcIiArIChyb2UudG9GaXhlZCgyKSkpO1xuICAgIH1cbiAgICBpZiAoYWxsTmV0QXNzZXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZ19sb2dfdGFibGUucHVzaChcImF2ZXJhZ2VSb2UgOlwiICsgKHRvdGFsUm9lLnRvRml4ZWQoMikpICsgXCJcXG5cIik7XG4gICAgICBERUJVRyhcImF2ZXJhZ2VSb2UgOlwiICsgKHRvdGFsUm9lLnRvRml4ZWQoMikpKTtcbiAgICAgIHJldHVybiB0b3RhbFJvZTtcbiAgICB9XG4gICAgYXZlcmFnZVJvZSA9IHRvdGFsUm9lIC8gKGFsbE5ldEFzc2V0cy5sZW5ndGggLSAxKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwiYXZlcmFnZVJvZSA6XCIgKyAoYXZlcmFnZVJvZS50b0ZpeGVkKDIpKSArIFwiXFxuXCIpO1xuICAgIERFQlVHKFwiYXZlcmFnZVJvZSA6XCIgKyAoYXZlcmFnZVJvZS50b0ZpeGVkKDIpKSk7XG4gICAgcmV0dXJuIGF2ZXJhZ2VSb2U7XG4gIH07XG5cbiAgcmV0dXJuIEdhbWVMb2dpYztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lTG9naWM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyOXVkSEp2YkM5QmNtdEhZVzFsVEc5bmFXTXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTI5dWRISnZiQzlCY210SFlXMWxURzluYVdNdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUVzYVVwQlFVRTdSVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRV3RDTEU5QlFVRXNRMEZCVVN4cFEwRkJVanM3UVVGRGJFSXNXVUZCUVN4SFFVRnJRaXhQUVVGQkxFTkJRVkVzYVVOQlFWSTdPMEZCUTJ4Q0xGVkJRVUVzUjBGQmEwSXNUMEZCUVN4RFFVRlJMQ3RDUVVGU096dEJRVU5zUWl4UlFVRkJMRWRCUVd0Q0xFOUJRVUVzUTBGQlVTdzJRa0ZCVWpzN1FVRkZiRUlzYVVKQlFVRXNSMEZCYjBJN08wRkJRM0JDTEd0Q1FVRkJMRWRCUVhGQ096dEJRVU55UWl4WFFVRkJMRWRCUVdNN08wRkJSV1FzV1VGQlFTeEhRVUZsTzBWQlExZ3NaVUZCUVN4aFFVUlhPMFZCUlZnc1pVRkJRU3hoUVVaWE8wVkJSMWdzYlVKQlFVRXNhVUpCU0ZjN1JVRkpXQ3h0UWtGQlFTeHBRa0ZLVnp0RlFVdFlMR0ZCUVVFc1YwRk1WenRGUVUxWUxGbEJRVUVzVlVGT1Z6czdPMEZCVTJZc1YwRkJRU3hIUVVGak96dEJRVVZrTEVsQlFVY3NWMEZCUVN4TFFVRmxMRTFCUVd4Q08wVkJRMGtzUzBGQlFTeEhRVUZSTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeFBRVUZxUWl4RlFVUmFPME5CUVVFc1RVRkJRVHRGUVVkSkxFdEJRVUVzUjBGQlVTeFRRVUZCTEVkQlFVRXNSVUZJV2pzN08wRkJTMDA3T3p0elFrRkRSaXhKUVVGQkxFZEJRVTBzVTBGQlFUdFhRVU5HTEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVVFN1JVRkVSVHM3YzBKQlNVNHNaVUZCUVN4SFFVRnBRaXhUUVVGQk8xZEJRMklzV1VGQldTeERRVUZETEUxQlFXSXNRMEZCYjBJc1ZVRkJWU3hEUVVGRExHVkJRUzlDTEVWQlFXZEVMRU5CUVVFc1UwRkJRU3hMUVVGQk8yRkJRVUVzVTBGQlF5eEhRVUZFTzFGQlF6VkRMRTlCUVU4c1EwRkJReXhIUVVGU0xFTkJRVmtzV1VGQldqdHZSRUZEUVN4SFFVRkhMRU5CUVVNc1UwRkJWU3hMUVVGRExFTkJRVUVzVlVGQlJDeERRVUZaTEVkQlFVY3NRMEZCUXl4SlFVRm9RanROUVVZNFFqdEpRVUZCTEVOQlFVRXNRMEZCUVN4RFFVRkJMRWxCUVVFc1EwRkJhRVE3UlVGRVlUczdjMEpCVFdwQ0xGVkJRVUVzUjBGQldTeFRRVUZETEVsQlFVUTdRVUZEVWl4UlFVRkJPMGxCUVVFc1ZVRkJRU3hIUVVGaE8wbEJRMklzWjBKQlFVRXNSMEZCYlVJc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCYUVJc1JVRkJjMElzV1VGQldTeERRVUZETEZkQlFXNURPMGxCUTI1Q0xHbENRVUZCTEVkQlFXOUNMRWxCUVVNc1EwRkJRU3h0UWtGQlJDeERRVUZ4UWl4SlFVRnlRaXhGUVVFeVFpeG5Ra0ZCTTBJN1NVRkRjRUlzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc2JVSkJRVUVzUjBGQmIwSXNaMEpCUVhCQ0xFZEJRWEZETEc5Q1FVRnlReXhIUVVGNVJDeHBRa0ZCZWtRc1IwRkJNa1VzU1VGQk5VWTdTVUZEUVN4TFFVRkJMRU5CUVUwc2JVSkJRVUVzUjBGQmIwSXNaMEpCUVhCQ0xFZEJRWEZETEc5Q1FVRnlReXhIUVVGNVJDeHBRa0ZCTDBRN1FVRkRRU3hUUVVGQkxIZENRVUZCT3pzN1RVRkRTU3hKUVVGWkxFdEJRVUVzUzBGQlZTeGhRVUZXTEVsQlFVRXNTMEZCUVN4TFFVRjVRaXhwUWtGQmNrTTdRVUZCUVN4cFFrRkJRVHM3VFVGRFFTeFZRVUZCTEVsQlFXTXNTVUZCUXl4RFFVRkJMRlZCUVVRc1EwRkJXU3hKUVVGYUxFVkJRV3RDTEZGQlFXeENMRVZCUVRSQ0xFdEJRVFZDTEVWQlFXMURMR2RDUVVGdVF6dEJRVVpzUWp0SlFVbEJMRlZCUVVFc1NVRkJZeXhKUVVGRExFTkJRVUVzZDBKQlFVUXNRMEZCTUVJc1NVRkJNVUk3U1VGRFpDeFZRVUZCTEVsQlFXTXNTVUZCUXl4RFFVRkJMRmxCUVVRc1EwRkJZeXhKUVVGa08wbEJRMlFzVlVGQlFTeEhRVUZoTEVsQlFVa3NRMEZCUXl4SlFVRk1MRU5CUVZVc1ZVRkJWanRKUVVOaUxGZEJRVmNzUTBGQlF5eEpRVUZhTEVOQlFXbENMR05CUVVFc1IwRkJaU3hWUVVGbUxFZEJRVEJDTEVsQlFUTkRPMGxCUTBFc1QwRkJUeXhEUVVGRExFZEJRVklzUTBGQldTeGpRVUZCTEVkQlFXVXNWVUZCTTBJN1FVRkRRU3hYUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZNTEVOQlFXVXNWMEZCWmp0RlFXWkRPenR6UWtGcFFsb3NaMEpCUVVFc1IwRkJhMElzVTBGQlF5eFBRVUZFTzBGQlEyUXNWMEZCVHl4RFFVRkRPMFZCUkUwN08zTkNRVWRzUWl4VFFVRkJMRWRCUVZrc1UwRkJReXhKUVVGRUxFVkJRVThzVDBGQlVEdEJRVU5TTEZGQlFVRTdTVUZCUVN4TFFVRkJMRWRCUVZFN1FVRkRVaXhaUVVGUExFbEJRVkE3UVVGQlFTeFhRVU5UTEdGQlJGUTdVVUZGVVN4TFFVRkJMRWRCUVZFc1NVRkJReXhEUVVGQkxHZENRVUZFTEVOQlFXdENMRTlCUVd4Q08wRkJSRkE3UVVGRVZDeFhRVWRUTEdsQ1FVaFVPMUZCU1ZFc1MwRkJRU3hIUVVGUk8wRkJTbWhDTzBsQlRVRXNTVUZCUnl4SlFVRkJMRXRCUVZFc1YwRkJVaXhKUVVGMVFpeEpRVUZCTEV0QlFWRXNWVUZCYkVNN1RVRkRTU3hMUVVGQkxFZEJRVkVzUlVGQlFTeEhRVUZMTEZGQlJHcENPenRCUVVWQkxGZEJRVTg3UlVGV1F6czdjMEpCV1Zvc1pVRkJRU3hIUVVGclFpeFRRVUZETEZOQlFVUTdRVUZEWkN4UlFVRkJPMGxCUVVFc1NVRkJiMElzVDBGQlR5eFRRVUZRTEV0QlFYRkNMRkZCUVhwRE8wRkJRVUVzWVVGQlR5eFZRVUZRT3p0SlFVTkJMRWRCUVVFc1IwRkJUU3hUUVVGVExFTkJRVU1zVjBGQlZpeERRVUZCTzBGQlEwNHNWMEZCVHl4TlFVRkJMRU5CUVU4c1IwRkJVRHRGUVVoUE96dHpRa0ZMYkVJc1kwRkJRU3hIUVVGcFFpeFRRVUZETEVsQlFVUXNSVUZCVHl4UFFVRlFPMEZCUTJJc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZUdEJRVU5XTEZOQlFVRXNjMFJCUVVFN08wMUJRMGtzU1VGQlJ5eEhRVUZKTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1QwRkJVQ3hEUVVGbExFOUJRV1lzUTBGQlFTeExRVUUyUWl4RFFVRkRMRU5CUVdwRE8xRkJRMGtzVDBGQlFTeEhRVUZWTzBGQlExWXNZMEZHU2pzN1FVRkVTanRCUVVsQkxGZEJRVTg3UlVGT1RUczdjMEpCVVdwQ0xHZENRVUZCTEVkQlFXdENMRk5CUVVNc1QwRkJSQ3hGUVVGVkxFbEJRVlk3UVVGRFpDeFhRVUZQTEVsQlFVa3NRMEZCUXl4SFFVRk1MRU5CUVZNc1EwRkJRU3hIUVVGSkxFbEJRVW9zUjBGQlZ5eEpRVUZKTEVOQlFVTXNSMEZCVEN4RFFVRlRMRTlCUVZRc1EwRkJjRUk3UlVGRVR6czdjMEpCU1d4Q0xGVkJRVUVzUjBGQllTeFRRVUZETEVsQlFVUXNSVUZCVHl4SlFVRlFMRVZCUVdFc1QwRkJZaXhGUVVGelFpeG5Ra0ZCZEVJN1FVRkRWQ3hSUVVGQk8wbEJRVUVzVDBGQlFTeEhRVUZWTEVsQlFVTXNRMEZCUVN4alFVRkVMRU5CUVdkQ0xFbEJRV2hDTEVWQlFYTkNMRTlCUVhSQ08wbEJRMVlzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYjBJc1NVRkJTeXhEUVVGQkxFOUJRVUVzUTBGQlV5eERRVUZCTEVOQlFVRXNRMEZCWml4SFFVRnJRaXhKUVVGc1FpeEhRVUZ6UWl4SlFVRkxMRU5CUVVFc1QwRkJRU3hEUVVGVExFTkJRVUVzUTBGQlFTeERRVUZ3UXl4SFFVRjFReXhKUVVFeFJEdEpRVU5CTEV0QlFVRXNRMEZCVFN4SlFVRkxMRU5CUVVFc1QwRkJRU3hEUVVGVExFTkJRVUVzUTBGQlFTeERRVUZ3UWl4RlFVRjNRaXhKUVVGTExFTkJRVUVzVDBGQlFTeERRVUZUTEVOQlFVRXNRMEZCUVN4RFFVRjBReXhGUVVFd1F5eFBRVUV4UXp0SlFVTkJMRmxCUVVFc1IwRkJaVHRCUVVObUxGTkJRV2xDTERSSFFVRnFRanROUVVOSkxFbEJRV0VzWjBOQlFXSTdRVUZCUVN4alFVRkJPenROUVVOQkxGbEJRVUVzU1VGQlowSXNTVUZCUXl4RFFVRkJMR1ZCUVVRc1EwRkJhVUlzU1VGQlN5eERRVUZCTEU5QlFVRXNRMEZCVXl4RFFVRkJMRk5CUVVFc1EwRkJMMElzUTBGQlFTeEhRVUUyUXl4SlFVRkRMRU5CUVVFc1pVRkJSQ3hEUVVGcFFpeEpRVUZMTEVOQlFVRXNaMEpCUVVFc1EwRkJhMElzUTBGQlFTeFRRVUZCTEVOQlFYaERMRU5CUVRkRExFZEJRVzFITzBGQlJuWklPMGxCUjBFc1kwRkJRU3hIUVVGcFFpeFpRVUZCTEVkQlFXVTdTVUZEYUVNc1MwRkJRU3hIUVVGUkxFbEJRVU1zUTBGQlFTeFRRVUZFTEVOQlFWY3NTVUZCV0N4RlFVRnBRaXhqUVVGcVFqdEpRVU5TTEZkQlFWY3NRMEZCUXl4SlFVRmFMRU5CUVc5Q0xGbEJRV0VzUTBGQlFTeEpRVUZCTEVOQlFXUXNSMEZCYjBJc1YwRkJjRUlzUjBGQk9FSXNRMEZCUXl4alFVRmpMRU5CUVVNc1QwRkJaaXhEUVVGMVFpeERRVUYyUWl4RFFVRkVMRU5CUVRsQ0xFZEJRWGxFTEZsQlFYcEVMRWRCUVc5RkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVNHNRMEZCWXl4RFFVRmtMRU5CUVVRc1EwRkJjRVVzUjBGQmMwWXNTVUZCZWtjN1NVRkRRU3hMUVVGQkxFTkJRVk1zV1VGQllTeERRVUZCTEVsQlFVRXNRMEZCWkN4SFFVRnZRaXhYUVVGd1FpeEhRVUU0UWl4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGbUxFTkJRWFZDTEVOQlFYWkNMRU5CUVVRc1EwRkJPVUlzUjBGQmVVUXNXVUZCZWtRc1IwRkJiMFVzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVGl4RFFVRmpMRU5CUVdRc1EwRkJSQ3hEUVVFMVJUdEJRVU5CTEZkQlFVODdSVUZhUlRzN2MwSkJZMklzYlVKQlFVRXNSMEZCYzBJc1UwRkJReXhKUVVGRUxFVkJRVThzWjBKQlFWQTdRVUZEYkVJc1VVRkJRVHRKUVVGQkxGZEJRVUVzUjBGQll5eEpRVUZMTEVOQlFVRXNaMEpCUVVFc1EwRkJhVUlzUTBGQlF5eE5RVUYyUWl4RFFVRTRRaXhUUVVGRExFTkJRVVE3WVVGQlRTeERRVUZCTEVkQlFVazdTVUZCVml4RFFVRTVRanRKUVVOa0xFMUJRVUVzUjBGQlV6dEpRVU5VTEVsQlFVY3NWMEZCVnl4RFFVRkRMRTFCUVZvc1IwRkJjVUlzYTBKQlFYaENPMDFCUTBrc1RVRkJRU3hIUVVGVExHMUNRVVJpTzB0QlFVRXNUVUZCUVR0TlFVZEpMRTFCUVVFc1IwRkJVeXhYUVVGWExFTkJRVU1zVDBGSWVrSTdPMEZCU1VFc1YwRkJUenRGUVZCWE96dHpRa0ZUZEVJc1pVRkJRU3hIUVVGcFFpeFRRVUZETEVsQlFVUXNSVUZCVHl4SlFVRlFPMEZCUTJJc1VVRkJRVHRKUVVGQkxFMUJRVUVzUjBGQlV5eEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4SlFVRjBRanRKUVVOVUxFdEJRVUVzUjBGQlVTeEpRVUZMTEVOQlFVRXNUVUZCUVN4RFFVRlBMRU5CUVVNc1RVRkJZaXhEUVVGdlFpeFRRVUZETEVOQlFVUTdZVUZCVFN4RFFVRkJMRWRCUVVrN1NVRkJWaXhEUVVGd1FqdFhRVU5TTEV0QlFVc3NRMEZCUXl4TFFVRk9MRU5CUVZrc1EwRkJXaXhGUVVGbExHdENRVUZtTzBWQlNHRTdPM05DUVUxcVFpeDNRa0ZCUVN4SFFVRXlRaXhUUVVGRExFbEJRVVE3UVVGRGRrSXNVVUZCUVR0SlFVRkJMR3RDUVVGQkxFZEJRWEZDTEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVdsQ0xFbEJRV3BDTEVWQlFYVkNMRmxCUVZrc1EwRkJReXhsUVVGd1F6dEpRVU55UWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeFJRVUZCTEVkQlFWTXNhMEpCUVcxQ0xFTkJRVUVzYTBKQlFXdENMRU5CUVVNc1RVRkJia0lzUjBGQk5FSXNRMEZCTlVJc1EwRkJOVUlzUjBGQk1rUXNWVUZCTTBRc1IwRkJjVVVzYTBKQlFXMUNMRU5CUVVFc1EwRkJRU3hEUVVGNFJpeEhRVUV5Uml4SlFVRTFSenRKUVVOQkxFdEJRVUVzUTBGQlRTeFJRVUZCTEVkQlFWTXNhMEpCUVcxQ0xFTkJRVUVzYTBKQlFXdENMRU5CUVVNc1RVRkJia0lzUjBGQk5FSXNRMEZCTlVJc1EwRkJOVUlzUjBGQk1rUXNWVUZCTTBRc1IwRkJjVVVzYTBKQlFXMUNMRU5CUVVFc1EwRkJRU3hEUVVFNVJqdEpRVU5CTEd0Q1FVRkJMRWRCUVhGQ0xHdENRVUZ0UWl4RFFVRkJMRU5CUVVFc1EwRkJia0lzUjBGQmQwSXNhMEpCUVcxQ0xFTkJRVUVzYTBKQlFXdENMRU5CUVVNc1RVRkJia0lzUjBGQk5FSXNRMEZCTlVJN1NVRkRhRVVzWTBGQlFTeEhRVUZwUWl4RFFVRkRMRWxCUVVNc1EwRkJRU3huUWtGQlJDeERRVUZyUWl4clFrRkJiRUlzUlVGQmMwTXNhVUpCUVhSRExFTkJRVUVzUjBGQk1rUXNRMEZCTlVRc1EwRkJRU3hIUVVGcFJUdEpRVU5zUml4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeFpRVUZCTEVkQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExHTkJRV1lzUTBGQlJDeERRVUZhTEVkQlFUUkRMRWxCUVRkRU8wbEJRMEVzUzBGQlFTeERRVUZOTEZsQlFVRXNSMEZCV1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGTUxFTkJRV1VzWTBGQlppeERRVUZFTEVOQlFXeENPMEZCUTBFc1YwRkJUenRGUVZKblFqczdjMEpCVnpOQ0xGbEJRVUVzUjBGQlpTeFRRVUZETEVsQlFVUTdRVUZEV0N4UlFVRkJPMGxCUVVFc2NVSkJRVUVzUjBGQmQwSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQmFFSXNSVUZCYzBJc1dVRkJXU3hEUVVGRExHVkJRVzVETzBsQlEzaENMRmxCUVVFc1IwRkJaU3hKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4SlFVRnFRaXhGUVVGMVFpeFpRVUZaTEVOQlFVTXNWMEZCY0VNN1NVRkRaaXhSUVVGQkxFZEJRVmM3UVVGRFdDeFRRVUZCTERoRVFVRkJPenROUVVOSkxFbEJRVk1zUzBGQlFTeExRVUZUTEZsQlFWa3NRMEZCUXl4TlFVRmlMRWRCUVhOQ0xFTkJRWGhETzBGQlFVRXNZMEZCUVRzN1RVRkRRU3hIUVVGQkxFZEJRVTBzU1VGQlN5eERRVUZCTEhGQ1FVRkJMRU5CUVhWQ0xFTkJRVUVzUzBGQlFTeEhRVUZSTEVOQlFWSXNRMEZCTlVJc1IwRkJlVU1zUTBGQlF5eERRVUZETEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVdsQ0xGRkJRV3BDTEVOQlFVRXNSMEZCTmtJc1NVRkJReXhEUVVGQkxHVkJRVVFzUTBGQmFVSXNXVUZCWVN4RFFVRkJMRXRCUVVFc1IwRkJVU3hEUVVGU0xFTkJRVGxDTEVOQlFUbENMRU5CUVVFc1IwRkJNa1VzUTBGQk5VVXNRMEZCZWtNc1IwRkJNRWc3VFVGRGFFa3NVVUZCUVN4SlFVRlpPMDFCUTFvc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmFVSXNUVUZCUVN4SFFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVW9zUTBGQldTeERRVUZhTEVOQlFVUXNRMEZCVGl4SFFVRnpRaXhKUVVGMlF6dE5RVU5CTEV0QlFVRXNRMEZCVFN4TlFVRkJMRWRCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlNpeERRVUZaTEVOQlFWb3NRMEZCUkN4RFFVRmFPMEZCVEVvN1NVRk5RU3hKUVVGSExGbEJRVmtzUTBGQlF5eE5RVUZpTEV0QlFYVkNMRU5CUVRGQ08wMUJRMGtzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc1kwRkJRU3hIUVVGakxFTkJRVU1zVVVGQlVTeERRVUZETEU5QlFWUXNRMEZCYVVJc1EwRkJha0lzUTBGQlJDeERRVUZrTEVkQlFXMURMRWxCUVhCRU8wMUJRMEVzUzBGQlFTeERRVUZOTEdOQlFVRXNSMEZCWXl4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGVUxFTkJRV2xDTEVOQlFXcENMRU5CUVVRc1EwRkJjRUk3UVVGRFFTeGhRVUZQTEZOQlNGZzdPMGxCU1VFc1ZVRkJRU3hIUVVGaExGRkJRVUVzUjBGQlZ5eERRVUZETEZsQlFWa3NRMEZCUXl4TlFVRmlMRWRCUVhOQ0xFTkJRWFpDTzBsQlEzaENMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEdOQlFVRXNSMEZCWXl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGWUxFTkJRVzFDTEVOQlFXNUNMRU5CUVVRc1EwRkJaQ3hIUVVGeFF5eEpRVUYwUkR0SlFVTkJMRXRCUVVFc1EwRkJUU3hqUVVGQkxFZEJRV01zUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCV0N4RFFVRnRRaXhEUVVGdVFpeERRVUZFTEVOQlFYQkNPMEZCUTBFc1YwRkJUenRGUVdwQ1NUczdPenM3TzBGQmJVSnVRaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlKOVxuIiwidmFyIEV2ZW50TWFuYWdlcjtcblxuRXZlbnRNYW5hZ2VyID0ge1xuICBzZW5kOiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICB2YXIgZXZlbnQ7XG4gICAgZXZlbnQgPSBuZXcgY2MuRXZlbnRDdXN0b20oZXZlbnROYW1lKTtcbiAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgZXZlbnQuc2V0VXNlckRhdGEoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBjYy5ldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0sXG4gIGxpc3RlbjogZnVuY3Rpb24oZXZlbnROYW1lLCBsaXN0ZW5GdW5jLCBub2RlT3JQcmlvcml0eSkge1xuICAgIHZhciBjY0xpc3RlbmVyO1xuICAgIGlmIChub2RlT3JQcmlvcml0eSA9PSBudWxsKSB7XG4gICAgICBub2RlT3JQcmlvcml0eSA9IDE7XG4gICAgfVxuICAgIGNjTGlzdGVuZXIgPSBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZSh7XG4gICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00sXG4gICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gbGlzdGVuRnVuYyhldmVudC5nZXRVc2VyRGF0YSgpLCBldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihjY0xpc3RlbmVyLCBub2RlT3JQcmlvcml0eSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5STllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyVjJaVzUwTDBGeWEwVjJaVzUwVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlF5eFRRVUZFTEVWQlFWa3NTVUZCV2p0QlFVTkdMRkZCUVVFN1NVRkJRU3hMUVVGQkxFZEJRVkVzU1VGQlNTeEZRVUZGTEVOQlFVTXNWMEZCVUN4RFFVRnRRaXhUUVVGdVFqdEpRVU5TTEVsQlFVa3NTVUZCUVN4TFFVRlJMRWxCUVZvN1RVRkRTU3hMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZyUWl4SlFVRnNRaXhGUVVSS096dFhRVVZCTEVWQlFVVXNRMEZCUXl4WlFVRlpMRU5CUVVNc1lVRkJhRUlzUTBGQk9FSXNTMEZCT1VJN1JVRktSU3hEUVVGT08wVkJTMEVzVFVGQlFTeEZRVUZSTEZOQlFVTXNVMEZCUkN4RlFVRlpMRlZCUVZvc1JVRkJkMElzWTBGQmVFSTdRVUZEU2l4UlFVRkJPenROUVVGQkxHbENRVUZyUWpzN1NVRkRiRUlzVlVGQlFTeEhRVUZoTEVWQlFVVXNRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJha0lzUTBGRFZEdE5RVUZCTEV0QlFVRXNSVUZCVHl4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRWGhDTzAxQlEwRXNVMEZCUVN4RlFVRlhMRk5CUkZnN1RVRkZRU3hSUVVGQkxFVkJRVlVzVTBGQlF5eExRVUZFTzBGQlEwNHNaVUZCVHl4VlFVRkJMRU5CUVZjc1MwRkJTeXhEUVVGRExGZEJRVTRzUTBGQlFTeERRVUZZTEVWQlFXZERMRXRCUVdoRE8wMUJSRVFzUTBGR1ZqdExRVVJUTzFkQlRXSXNSVUZCUlN4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGb1FpeERRVUUwUWl4VlFVRTFRaXhGUVVGM1F5eGpRVUY0UXp0RlFWSkpMRU5CVEZJN096dEJRV05LTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBFdmVudE5hbWVzO1xuXG5FdmVudE5hbWVzID0ge1xuICBHQU1FX1NUQVJUOiBcImdhbWUuc3RhcnRcIixcbiAgR0FNRV9FTkQ6IFwiZ2FtZS5lbmRcIixcbiAgR0FNRV9ORVhUX0xFVkVMOiBcImdhbWUubmV4dC5sZXZlbFwiLFxuICBHQU1FX0dFVF9SRVNVTFQ6IFwiZ2FtZS5nZXQucmVzdWx0XCJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnROYW1lcztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WlhabGJuUXZRWEpyUlhabGJuUk9ZVzFsY3k1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OWxkbVZ1ZEM5QmNtdEZkbVZ1ZEU1aGJXVnpMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZEU1R0RlFVRkJMRlZCUVVFc1JVRkJhMElzV1VGQmJFSTdSVUZEUVN4UlFVRkJMRVZCUVd0Q0xGVkJSR3hDTzBWQlJVRXNaVUZCUVN4RlFVRnJRaXhwUWtGR2JFSTdSVUZKUVN4bFFVRkJMRVZCUVd0Q0xHbENRVXBzUWpzN08wRkJUVW9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiIsImNjLmdhbWUub25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgR2FtZUxvZ2ljLCBnYW1lRGlhbG9nLCBnYW1lTG9naWNPYmosIHNjZW5lTWFuYWdlcjtcbiAgY2Mudmlldy5hZGp1c3RWaWV3UG9ydCh0cnVlKTtcbiAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgxMTM2LCA2NDAsIGNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwpO1xuICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcbiAgY2MuQnVpbGRlclJlYWRlci5zZXRSZXNvdXJjZVBhdGgoXCJyZXMvXCIpO1xuICBzY2VuZU1hbmFnZXIgPSByZXF1aXJlKFwiLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlXCIpO1xuICBzY2VuZU1hbmFnZXIuaW5pdCgpO1xuICBnYW1lRGlhbG9nID0gcmVxdWlyZSgnLi9jY2JWaWV3L0Fya01haW5EaWFsb2cuY29mZmVlJyk7XG4gIHNjZW5lTWFuYWdlci5hZGRMYXllclRvU2NlbmUoZ2FtZURpYWxvZyk7XG4gIEdhbWVMb2dpYyA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmtHYW1lTG9naWMuY29mZmVlJyk7XG4gIGdhbWVMb2dpY09iaiA9IG5ldyBHYW1lTG9naWMoKTtcbiAgcmV0dXJuIGdhbWVMb2dpY09iai5pbml0KCk7XG59O1xuXG5jYy5nYW1lLnJ1bigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiV0ZwYmk1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OXRZV2x1TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVklzUjBGQmEwSXNVMEZCUVR0QlFVTmtMRTFCUVVFN1JVRkJRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFWSXNRMEZCZFVJc1NVRkJka0k3UlVGRFFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMSFZDUVVGU0xFTkJRV2RETEVsQlFXaERMRVZCUVhORExFZEJRWFJETEVWQlFUSkRMRVZCUVVVc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UlFVRXZSRHRGUVVOQkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNjVUpCUVZJc1EwRkJPRUlzU1VGQk9VSTdSVUZEUVN4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExHVkJRV3BDTEVOQlFXbERMRTFCUVdwRE8wVkJSVUVzV1VGQlFTeEhRVUZsTEU5QlFVRXNRMEZCVVN4blEwRkJVanRGUVVObUxGbEJRVmtzUTBGQlF5eEpRVUZpTEVOQlFVRTdSVUZGUVN4VlFVRkJMRWRCUVdFc1QwRkJRU3hEUVVGUkxHZERRVUZTTzBWQlEySXNXVUZCV1N4RFFVRkRMR1ZCUVdJc1EwRkJOa0lzVlVGQk4wSTdSVUZGUVN4VFFVRkJMRWRCUVZrc1QwRkJRU3hEUVVGUkxDdENRVUZTTzBWQlExb3NXVUZCUVN4SFFVRmxMRWxCUVVrc1UwRkJTaXhEUVVGQk8xTkJRMllzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCUVR0QlFXUmpPenRCUVdkQ2JFSXNSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGU0xFTkJRVUVpZlE9PVxuIiwidmFyIFVzZXJEYXRhO1xuXG5Vc2VyRGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVXNlckRhdGEoKSB7XG4gICAgdGhpcy5fc2NvcmUgPSAwO1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgfVxuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKF9zY29yZSkge1xuICAgIHRoaXMuX3Njb3JlID0gX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRTY29yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29yZTtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuc2V0Q291bnQgPSBmdW5jdGlvbihfY291bnQpIHtcbiAgICB0aGlzLl9jb3VudCA9IF9jb3VudDtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuZ2V0Q291bnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJEYXRhO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJEYXRhO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRWEpyVlhObGNrUmhkR0V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRTdPMEZCUVUwN1JVRkRWeXhyUWtGQlFUdEpRVU5VTEVsQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZVN1NVRkRWaXhKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTzBWQlJrUTdPM0ZDUVVsaUxGRkJRVUVzUjBGQlZTeFRRVUZETEUxQlFVUTdTVUZCUXl4SlFVRkRMRU5CUVVFc1UwRkJSRHRGUVVGRU96dHhRa0ZGVml4UlFVRkJMRWRCUVZVc1UwRkJRVHRYUVVGSExFbEJRVU1zUTBGQlFUdEZRVUZLT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlF5eE5RVUZFTzBsQlFVTXNTVUZCUXl4RFFVRkJMRk5CUVVRN1JVRkJSRHM3Y1VKQlJWWXNVVUZCUVN4SFFVRlZMRk5CUVVFN1YwRkJSeXhKUVVGRExFTkJRVUU3UlVGQlNqczdPenM3TzBGQlJXUXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIExheWVyTWFuYWdlciwgTG9hZGVyO1xuXG5MYXllck1hbmFnZXIgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGF5ZXJTdGFjayA9IFtdO1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgY2MuU2NlbmUoKTtcbiAgICByZXR1cm4gY2MuZGlyZWN0b3IucnVuU2NlbmUodGhpcy5zY2VuZSk7XG4gIH0sXG4gIGNsZWFyTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICByZXR1cm4gdGhpcy5sYXllclN0YWNrLmxlbmd0aCA9IDA7XG4gIH0sXG4gIGFkZExheWVyVG9TY2VuZTogZnVuY3Rpb24oY2NiTGF5ZXIsIHpPcmRlcikge1xuICAgIHZhciBsYXlvdXQsIG5vZGU7XG4gICAgaWYgKHpPcmRlciA9PSBudWxsKSB7XG4gICAgICB6T3JkZXIgPSAwO1xuICAgIH1cbiAgICBsYXlvdXQgPSBuZXcgY2N1aS5MYXlvdXQoKTtcbiAgICBsYXlvdXQuc2V0Q29udGVudFNpemUoY2Muc2l6ZSgxMTM2LCA2NDApKTtcbiAgICBsYXlvdXQuc2V0VG91Y2hFbmFibGVkKHRydWUpO1xuICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuICAgIG5vZGUuYWRkQ2hpbGQobGF5b3V0KTtcbiAgICBub2RlLmFkZENoaWxkKGNjYkxheWVyKTtcbiAgICB0aGlzLnNjZW5lLmFkZENoaWxkKG5vZGUsIHpPcmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5wdXNoKG5vZGUpO1xuICB9LFxuICByZW1vdmVUb3BMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRvcExheWVyO1xuICAgIHRvcExheWVyID0gdGhpcy5sYXllclN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0aGlzLnNjZW5lLnJlbW92ZUNoaWxkKHRvcExheWVyLCB0cnVlKTtcbiAgfVxufTtcblxuTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMb2FkZXIoY2NiRmlsZTEsIGNvbnRyb2xsZXJOYW1lMSkge1xuICAgIHRoaXMuY2NiRmlsZSA9IGNjYkZpbGUxO1xuICAgIHRoaXMuY29udHJvbGxlck5hbWUgPSBjb250cm9sbGVyTmFtZTE7XG4gIH1cblxuICBMb2FkZXIucHJvdG90eXBlLnNob3dEaWFsb2cgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2MuQnVpbGRlclJlYWRlci5sb2FkKHRoaXMuY2NiRmlsZSk7XG4gIH07XG5cbiAgcmV0dXJuIExvYWRlcjtcblxufSkoKTtcblxuTGF5ZXJNYW5hZ2VyLmRlZmluZURpYWxvZyA9IGZ1bmN0aW9uKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQ2xhc3MpIHtcbiAgY2MuQnVpbGRlclJlYWRlci5yZWdpc3RlckNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIG5ldyBjb250cm9sbGVyQ2xhc3MoKSk7XG4gIHJldHVybiBuZXcgTG9hZGVyKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdlFYSnJVMk5sYm1WTllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwzUnZiMnh6TDBGeWExTmpaVzVsVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlFUdEpRVU5HTEVsQlFVTXNRMEZCUVN4VlFVRkVMRWRCUVdNN1NVRkRaQ3hKUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRXRCUVZBc1EwRkJRVHRYUVVOVUxFVkJRVVVzUTBGQlF5eFJRVUZSTEVOQlFVTXNVVUZCV2l4RFFVRnhRaXhKUVVGRExFTkJRVUVzUzBGQmRFSTdSVUZJUlN4RFFVRk9PMFZCUzBFc1ZVRkJRU3hGUVVGWkxGTkJRVUU3U1VGRFVpeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMR2xDUVVGUUxFTkJRVUU3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRTFCUVZvc1IwRkJjVUk3UlVGR1lpeERRVXhhTzBWQlUwRXNaVUZCUVN4RlFVRnJRaXhUUVVGRExGRkJRVVFzUlVGQlZ5eE5RVUZZTzBGQlEyUXNVVUZCUVRzN1RVRkVlVUlzVTBGQlV6czdTVUZEYkVNc1RVRkJRU3hIUVVGVExFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFWUXNRMEZCUVR0SlFVTlVMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1NVRkJVaXhGUVVGakxFZEJRV1FzUTBGQmRFSTdTVUZEUVN4TlFVRk5MRU5CUVVNc1pVRkJVQ3hEUVVGMVFpeEpRVUYyUWp0SlFVVkJMRWxCUVVFc1IwRkJUU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZRTEVOQlFVRTdTVUZEVGl4SlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxFMUJRV1E3U1VGRFFTeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRkZCUVdRN1NVRkZRU3hKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEZGQlFWQXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNUVUZCZEVJN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEVsQlFWb3NRMEZCYVVJc1NVRkJha0k3UlVGV1l5eERRVlJzUWp0RlFYRkNRU3hqUVVGQkxFVkJRV2RDTEZOQlFVRTdRVUZEV2l4UlFVRkJPMGxCUVVFc1VVRkJRU3hIUVVGWExFbEJRVU1zUTBGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV2l4RFFVRkJPMWRCUTFnc1NVRkJReXhEUVVGQkxFdEJRVXNzUTBGQlF5eFhRVUZRTEVOQlFXMUNMRkZCUVc1Q0xFVkJRVFpDTEVsQlFUZENPMFZCUmxrc1EwRnlRbWhDT3pzN1FVRjVRa1U3UlVGRFZ5eG5Ra0ZCUXl4UlFVRkVMRVZCUVZjc1pVRkJXRHRKUVVGRExFbEJRVU1zUTBGQlFTeFZRVUZFTzBsQlFWVXNTVUZCUXl4RFFVRkJMR2xDUVVGRU8wVkJRVmc3TzIxQ1FVTmlMRlZCUVVFc1IwRkJZU3hUUVVGQk8xZEJRMVFzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRnFRaXhEUVVGelFpeEpRVUZETEVOQlFVRXNUMEZCZGtJN1JVRkVVenM3T3pzN08wRkJSMnBDTEZsQlFWa3NRMEZCUXl4WlFVRmlMRWRCUVRSQ0xGTkJRVU1zVDBGQlJDeEZRVUZWTEdOQlFWWXNSVUZCTUVJc1pVRkJNVUk3UlVGRGVFSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhyUWtGQmFrSXNRMEZEU1N4alFVUktMRVZCUlVrc1NVRkJTU3hsUVVGS0xFTkJRVUVzUTBGR1NqdFRRVXRCTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTlCUVZnc1JVRkJiMElzWTBGQmNFSTdRVUZPZDBJN08wRkJVVFZDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiJdfQ==
