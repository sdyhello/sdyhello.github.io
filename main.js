(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ArkMainDialog, eventManager, eventNames, g_click_times;

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

g_click_times = 0;

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
var ARK_NET_ASSETS, ARK_RETAIN_PROFITS, ARK_RETAIN_PROFITS_ADD_RATE, ARK_ROE, BalanceSheet, CashFlowStatement, GameLogic, ProfitStatement, UserData, eventManager, eventNames, g_log_table, g_maxStatisticsYears, g_statisticsYears, needCalcItem, sceneManager,
  hasProp = {}.hasOwnProperty;

sceneManager = require('../tools/ArkSceneManager.coffee');

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

UserData = require('../model/ArkUserData.coffee');

BalanceSheet = require('../model/BalanceSheet.coffee');

ProfitStatement = require('../model/ProfitStatement.coffee');

CashFlowStatement = require('../model/CashFlowStatement.coffee');

require("../globalValue.coffee");

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
    this._balanceObj = {};
    this._profitObj = {};
    this._cashFlowObj = {};
    this._registerEvents();
    return this._initTable();
  };

  GameLogic.prototype._registerEvents = function() {
    return eventManager.listen(eventNames.GAME_GET_RESULT, (function(_this) {
      return function(obj) {
        return typeof obj.callback === "function" ? obj.callback(_this._balanceObj["000858"].dumpPercentTable()) : void 0;
      };
    })(this));
  };

  GameLogic.prototype._initTable = function() {
    var dir, i, len, stockCode, stockTable;
    stockTable = ["SZ000001", "SZ000002", "SZ000008", "SZ000060", "SZ000063", "SZ000069", "SZ000100", "SZ000157", "SZ000166", "SZ000333", "SZ000338", "SZ000402", "SZ000413", "SZ000415", "SZ000423", "SZ000425", "SZ000503", "SZ000538", "SZ000540", "SZ000559", "SZ000568", "SZ000623", "SZ000625", "SZ000627", "SZ000630", "SZ000651", "SZ000671", "SZ000686", "SZ000709", "SZ000723", "SZ000725", "SZ000728", "SZ000738", "SZ000750", "SZ000768", "SZ000776", "SZ000783", "SZ000792", "SZ000826", "SZ000839", "SZ000858", "SZ000876", "SZ000895", "SZ000898", "SZ000938", "SZ000959", "SZ000961", "SZ000963", "SZ000983", "SZ001979", "SZ002007", "SZ002008", "SZ002024", "SZ002027", "SZ002044", "SZ002065", "SZ002074", "SZ002081", "SZ002142", "SZ002146", "SZ002153", "SZ002174", "SZ002202", "SZ002230", "SZ002236", "SZ002241", "SZ002252", "SZ002292", "SZ002294", "SZ002304", "SZ002310", "SZ002352", "SZ002385", "SZ002411", "SZ002415", "SZ002424", "SZ002426", "SZ002450", "SZ002456", "SZ002460", "SZ002465", "SZ002466", "SZ002468", "SZ002470", "SZ002475", "SZ002500", "SZ002508", "SZ002555", "SZ002558", "SZ002572", "SZ002594", "SZ002601", "SZ002602", "SZ002608", "SZ002624", "SZ002673", "SZ002714", "SZ002736", "SZ002739", "SZ002797", "SZ002831", "SZ002839", "SZ002841", "SZ300003", "SZ300015", "SZ300017", "SZ300024", "SZ300027", "SZ300033", "SZ300059", "SZ300070", "SZ300072", "SZ300122", "SZ300124", "SZ300136", "SZ300144", "SZ300251", "SZ300315", "SH600000", "SH600008", "SH600009", "SH600010", "SH600011", "SH600015", "SH600016", "SH600018", "SH600019", "SH600021", "SH600023", "SH600028", "SH600029", "SH600030", "SH600031", "SH600036", "SH600038", "SH600048", "SH600050", "SH600061", "SH600066", "SH600068", "SH600074", "SH600085", "SH600089", "SH600100", "SH600104", "SH600109", "SH600111", "SH600115", "SH600118", "SH600153", "SH600157", "SH600170", "SH600177", "SH600188", "SH600196", "SH600208", "SH600219", "SH600221", "SH600233", "SH600271", "SH600276", "SH600297", "SH600309", "SH600332", "SH600340", "SH600352", "SH600362", "SH600369", "SH600372", "SH600373", "SH600376", "SH600383", "SH600390", "SH600406", "SH600415", "SH600436", "SH600482", "SH600485", "SH600489", "SH600498", "SH600518", "SH600519", "SH600522", "SH600535", "SH600547", "SH600549", "SH600570", "SH600583", "SH600585", "SH600588", "SH600606", "SH600637", "SH600649", "SH600660", "SH600663", "SH600674", "SH600682", "SH600685", "SH600688", "SH600690", "SH600703", "SH600704", "SH600705", "SH600739", "SH600741", "SH600795", "SH600804", "SH600816", "SH600820", "SH600827", "SH600837", "SH600871", "SH600886", "SH600887", "SH600893", "SH600895", "SH600900", "SH600909", "SH600919", "SH600926", "SH600958", "SH600959", "SH600977", "SH600999", "SH601006", "SH601009", "SH601012", "SH601018", "SH601021", "SH601088", "SH601099", "SH601111", "SH601117", "SH601118", "SH601155", "SH601163", "SH601166", "SH601169", "SH601186", "SH601198", "SH601211", "SH601212", "SH601216", "SH601225", "SH601228", "SH601229", "SH601288", "SH601318", "SH601328", "SH601333", "SH601336", "SH601375", "SH601377", "SH601390", "SH601398", "SH601555", "SH601600", "SH601601", "SH601607", "SH601608", "SH601611", "SH601618", "SH601628", "SH601633", "SH601668", "SH601669", "SH601688", "SH601718", "SH601727", "SH601766", "SH601788", "SH601800", "SH601818", "SH601857", "SH601866", "SH601872", "SH601877", "SH601878", "SH601881", "SH601888", "SH601898", "SH601899", "SH601901", "SH601919", "SH601933", "SH601939", "SH601958", "SH601966", "SH601985", "SH601988", "SH601989", "SH601991", "SH601992", "SH601997", "SH601998", "SH603160", "SH603799", "SH603833", "SH603858", "SH603993"];
    dir = "hs300";
    for (i = 0, len = stockTable.length; i < len; i++) {
      stockCode = stockTable[i];
      stockCode = stockCode.slice(2, 8);
      this._balanceObj[stockCode] = new BalanceSheet(dir, stockCode);
      this._profitObj[stockCode] = new ProfitStatement(dir, stockCode);
      this._cashFlowObj[stockCode] = new CashFlowStatement(dir, stockCode);
    }
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


},{"../event/ArkEventManager.coffee":3,"../event/ArkEventNames.coffee":4,"../globalValue.coffee":5,"../model/ArkUserData.coffee":7,"../model/BalanceSheet.coffee":8,"../model/CashFlowStatement.coffee":9,"../model/ProfitStatement.coffee":10,"../tools/ArkSceneManager.coffee":12}],3:[function(require,module,exports){
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
  GAME_GET_RESULT: "game.get.result",
  GAME_INIT_TABLE: "game.init.table"
};

module.exports = EventNames;


},{}],5:[function(require,module,exports){
(function (global){
global.year = 6;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
cc.game.onStart = function() {
  var GameLogic, gameDialog, gameLogicObj, sceneManager;
  cc.view.adjustViewPort(true);
  cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL);
  cc.view.enableAutoFullScreen(false);
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


},{"./ccbView/ArkMainDialog.coffee":1,"./control/ArkGameLogic.coffee":2,"./tools/ArkSceneManager.coffee":12}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
var BalanceSheet, TableBase,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

TableBase = require("./TableBase.coffee");

BalanceSheet = (function(superClass) {
  extend(BalanceSheet, superClass);

  function BalanceSheet() {
    return BalanceSheet.__super__.constructor.apply(this, arguments);
  }

  BalanceSheet.prototype.getFilePath = function() {
    return "res/" + this._stockType + "_json/zcfzb_" + this._stockCode + ".json";
  };

  BalanceSheet.prototype.getCashValue = function() {
    return this.getValue(this._data["货币资金(万元)"]);
  };

  BalanceSheet.prototype.getTotalAssets = function() {
    return this.getValue(this._data["资产总计(万元)"]);
  };

  BalanceSheet.prototype._getNoNeedCalcItems = function() {
    return ["资料", "报告日期"];
  };

  BalanceSheet.prototype.dumpPercentTable = function() {
    var assetsPercentTable, celValue, i, index, key, len, percent, percentTable, ref, ref1, totalAssets, value;
    totalAssets = this.getTotalAssets();
    assetsPercentTable = [];
    ref = this._data;
    for (key in ref) {
      value = ref[key];
      percentTable = [key + "\t\t\t\t\t"];
      if (value[0] === 0) {
        continue;
      }
      if (indexOf.call(this._getNoNeedCalcItems(), key) >= 0) {
        continue;
      }
      ref1 = this.getValue(value);
      for (index = i = 0, len = ref1.length; i < len; index = ++i) {
        celValue = ref1[index];
        percent = celValue / totalAssets[index] * 100;
        percentTable.push(percent.toFixed(2));
        percentTable.push("\t\t\t\t");
      }
      percentTable.push("\n");
      assetsPercentTable.push(percentTable);
    }
    console.log(JSON.stringify(assetsPercentTable, null, "\t"));
    return assetsPercentTable;
  };

  return BalanceSheet;

})(TableBase);

module.exports = BalanceSheet;


},{"./TableBase.coffee":11}],9:[function(require,module,exports){
var CashFlowStatement, TableBase,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TableBase = require("./TableBase.coffee");

CashFlowStatement = (function(superClass) {
  extend(CashFlowStatement, superClass);

  function CashFlowStatement() {
    return CashFlowStatement.__super__.constructor.apply(this, arguments);
  }

  CashFlowStatement.prototype.getFilePath = function() {
    return "res/" + this._stockType + "_json/xjllb_" + this._stockCode + ".json";
  };

  return CashFlowStatement;

})(TableBase);

module.exports = CashFlowStatement;


},{"./TableBase.coffee":11}],10:[function(require,module,exports){
var ProfitStatement, TableBase,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TableBase = require("./TableBase.coffee");

ProfitStatement = (function(superClass) {
  extend(ProfitStatement, superClass);

  function ProfitStatement() {
    return ProfitStatement.__super__.constructor.apply(this, arguments);
  }

  ProfitStatement.prototype.getFilePath = function() {
    return "res/" + this._stockType + "_json/lrb_" + this._stockCode + ".json";
  };

  return ProfitStatement;

})(TableBase);

module.exports = ProfitStatement;


},{"./TableBase.coffee":11}],11:[function(require,module,exports){
(function (global){
var TableBase;

TableBase = (function() {
  function TableBase(_stockType, _stockCode) {
    this._stockType = _stockType;
    this._stockCode = _stockCode;
    this._data = [];
    this._loadJson();
  }

  TableBase.prototype.getFilePath = function() {};

  TableBase.prototype._loadJson = function() {
    var filePath;
    filePath = this.getFilePath();
    return cc.loader.loadJson(filePath, (function(_this) {
      return function(error, data) {
        return _this._data = data;
      };
    })(this));
  };

  TableBase.prototype._getShowNumber = function(number) {
    return ((number / 100000).toFixed(2)) + " 亿";
  };

  TableBase.prototype.getFormatNumberTable = function(numberTable) {
    var formatTable, i, len, number;
    formatTable = [];
    for (i = 0, len = numberTable.length; i < len; i++) {
      number = numberTable[i];
      formatTable.push(this._getShowNumber(number));
    }
    return formatTable;
  };

  TableBase.prototype._getYearValueIndex = function() {
    var i, index, indexTable, len, ref, timeStr;
    indexTable = [];
    ref = this._data["报告日期"];
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      timeStr = ref[index];
      if (timeStr.indexOf("12-31") !== -1) {
        indexTable.push(index);
      }
    }
    return indexTable;
  };

  TableBase.prototype._getValueLength = function(valueLength) {
    var length;
    if (valueLength < global.year) {
      length = valueLength;
    } else {
      length = global.year;
    }
    return length;
  };

  TableBase.prototype.getValue = function(data) {
    var i, index, len, valueTable, yearIndexTable;
    yearIndexTable = this._getYearValueIndex();
    valueTable = [];
    for (i = 0, len = yearIndexTable.length; i < len; i++) {
      index = yearIndexTable[i];
      valueTable.push(data[index]);
    }
    return valueTable = valueTable.slice(0, this._getValueLength(valueTable.length));
  };

  return TableBase;

})();

module.exports = TableBase;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],12:[function(require,module,exports){
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


},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9nbG9iYWxWYWx1ZS5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiLCJzcmMvbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlIiwic3JjL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUiLCJzcmMvbW9kZWwvQ2FzaEZsb3dTdGF0ZW1lbnQuY29mZmVlIiwic3JjL21vZGVsL1Byb2ZpdFN0YXRlbWVudC5jb2ZmZWUiLCJzcmMvbW9kZWwvVGFibGVCYXNlLmNvZmZlZSIsInNyYy90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2NsaWNrX3RpbWVzO1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5nX2NsaWNrX3RpbWVzID0gMDtcblxuQXJrTWFpbkRpYWxvZyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQXJrTWFpbkRpYWxvZygpIHt9XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25EaWRMb2FkRnJvbUNDQiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2RhdFRhYmxlID0gW107XG4gICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMSk7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl9zdG9ja0NvZGVFZGl0Qm94KTtcbiAgICB0aGlzLl95ZWFyc0VkaXRCb3ggPSB0aGlzLl9jcmVhdGVFZGl0Qm94KHRoaXMuY2NiX3RleHRGaWVsZF8yKTtcbiAgICB0aGlzLnJvb3ROb2RlLmFkZENoaWxkKHRoaXMuX3llYXJzRWRpdEJveCk7XG4gICAgdGhpcy5faW5pdERhdGEoKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5faW5pdERhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LnNldFN0cmluZyhcIjAwMDAwMVwiKTtcbiAgICByZXR1cm4gdGhpcy5feWVhcnNFZGl0Qm94LnNldFN0cmluZyhcIjZcIik7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2NyZWF0ZUVkaXRCb3ggPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIGVkaXRCb3g7XG4gICAgZWRpdEJveCA9IG5ldyBjYy5FZGl0Qm94KGNjLnNpemUoMjAwLCA1MCkpO1xuICAgIGVkaXRCb3guc2V0UG9zaXRpb24obm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICBlZGl0Qm94LnNldElucHV0TW9kZShjYy5FRElUQk9YX0lOUFVUX01PREVfU0lOR0xFTElORSk7XG4gICAgZWRpdEJveC5zZXRSZXR1cm5UeXBlKGNjLktFWUJPQVJEX1JFVFVSTlRZUEVfRE9ORSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dEZsYWcoY2MuRURJVEJPWF9JTlBVVF9GTEFHX0lOSVRJQUxfQ0FQU19TRU5URU5DRSk7XG4gICAgZWRpdEJveC5zZXRNYXhMZW5ndGgoMTMpO1xuICAgIGVkaXRCb3guc2V0Rm9udChcIkFyaWFsXCIsIDI2KTtcbiAgICBlZGl0Qm94LnNldEZvbnRDb2xvcihjYy5jb2xvcigxMDAsIDEwMCwgMjU1LCAyNTUpKTtcbiAgICByZXR1cm4gZWRpdEJveDtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHRoaXMuY2NiX3Jlc3VsdC5zZXRTdHJpbmcocmVzdWx0KTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5vbkNhbGMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RvY2tDb2RlLCB5ZWFycztcbiAgICBzdG9ja0NvZGUgPSB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIHllYXJzID0gdGhpcy5feWVhcnNFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIHJldHVybiBjYy5sb2FkZXIubG9hZEpzb24oXCJyZXMvMzAwX2pzb24vXCIgKyBzdG9ja0NvZGUgKyBcIi5qc29uXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIF90aGlzLnNob3dSZXN1bHQoXCJcIik7XG4gICAgICAgIHJldHVybiBldmVudE1hbmFnZXIuc2VuZChldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwge1xuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgeWVhcnM6IHllYXJzLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zaG93UmVzdWx0KHN0cik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKFwiQXJrTWFpbkRpYWxvZ1wiLCBuZXcgQXJrTWFpbkRpYWxvZygpKTtcblxuICByZXR1cm4gQXJrTWFpbkRpYWxvZztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5CdWlsZGVyUmVhZGVyLmxvYWQoXCJyZXMvbWFpbi5jY2JpXCIpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMk5pVm1sbGR5OUJjbXROWVdsdVJHbGhiRzluTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyTmpZbFpwWlhjdlFYSnJUV0ZwYmtScFlXeHZaeTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUVdVc1QwRkJRU3hEUVVGUkxHbERRVUZTT3p0QlFVTm1MRlZCUVVFc1IwRkJZU3hQUVVGQkxFTkJRVkVzSzBKQlFWSTdPMEZCUldJc1lVRkJRU3hIUVVGblFqczdRVUZGVmpzN096QkNRVU5HTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVUU3U1VGRFpDeEpRVUZETEVOQlFVRXNVMEZCUkN4SFFVRmhPMWRCUTJJc1NVRkJReXhEUVVGQkxFbEJRVVFzUTBGQlFUdEZRVVpqT3pzd1FrRkxiRUlzU1VGQlFTeEhRVUZOTEZOQlFVRTdTVUZEUml4SlFVRkRMRU5CUVVFc2FVSkJRVVFzUjBGQmNVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTNKQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzYVVKQlFYQkNPMGxCUlVFc1NVRkJReXhEUVVGQkxHRkJRVVFzUjBGQmFVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTJwQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzWVVGQmNFSTdTVUZGUVN4SlFVRkRMRU5CUVVFc1UwRkJSQ3hEUVVGQk8wVkJVRVU3T3pCQ1FWVk9MRk5CUVVFc1IwRkJWeXhUUVVGQk8wbEJRMUFzU1VGQlF5eERRVUZCTEdsQ1FVRnBRaXhEUVVGRExGTkJRVzVDTEVOQlFUWkNMRkZCUVRkQ08xZEJRMEVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVhsQ0xFZEJRWHBDTzBWQlJrODdPekJDUVVsWUxHTkJRVUVzUjBGQlowSXNVMEZCUXl4SlFVRkVPMEZCUTFvc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZTeEpRVUZKTEVWQlFVVXNRMEZCUXl4UFFVRlFMRU5CUVdVc1JVRkJSU3hEUVVGRExFbEJRVWdzUTBGQlVTeEhRVUZTTEVWQlFXRXNSVUZCWWl4RFFVRm1PMGxCUTFZc1QwRkJUeXhEUVVGRExGZEJRVklzUTBGQmIwSXNTVUZCU1N4RFFVRkRMRmRCUVV3c1EwRkJRU3hEUVVGd1FqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5dzJRa0ZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zWVVGQlVpeERRVUZ6UWl4RlFVRkZMRU5CUVVNc2QwSkJRWHBDTzBsQlEwRXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzUlVGQlJTeERRVUZETEhkRFFVRjRRanRKUVVOQkxFOUJRVThzUTBGQlF5eFpRVUZTTEVOQlFYRkNMRVZCUVhKQ08wbEJRMEVzVDBGQlR5eERRVUZETEU5QlFWSXNRMEZCWjBJc1QwRkJhRUlzUlVGQmVVSXNSVUZCZWtJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRkZMRU5CUVVNc1MwRkJTQ3hEUVVGVExFZEJRVlFzUlVGQll5eEhRVUZrTEVWQlFXMUNMRWRCUVc1Q0xFVkJRWGRDTEVkQlFYaENMRU5CUVhKQ08wRkJRMEVzVjBGQlR6dEZRVlJMT3pzd1FrRlhhRUlzVlVGQlFTeEhRVUZaTEZOQlFVTXNUVUZCUkR0WFFVTlNMRWxCUVVNc1EwRkJRU3hWUVVGVkxFTkJRVU1zVTBGQldpeERRVUZ6UWl4TlFVRjBRanRGUVVSUk96c3dRa0ZIV2l4TlFVRkJMRWRCUVZFc1UwRkJRVHRCUVVOS0xGRkJRVUU3U1VGQlFTeFRRVUZCTEVkQlFWa3NTVUZCUXl4RFFVRkJMR2xDUVVGcFFpeERRVUZETEZOQlFXNUNMRU5CUVVFN1NVRkRXaXhMUVVGQkxFZEJRVkVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVVFN1YwRkRVaXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1pVRkJRU3hIUVVGblFpeFRRVUZvUWl4SFFVRXdRaXhQUVVFM1F5eEZRVUZ4UkN4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdVVUZEYWtRc1MwRkJReXhEUVVGQkxGVkJRVVFzUTBGQldTeEZRVUZhTzJWQlEwRXNXVUZCV1N4RFFVRkRMRWxCUVdJc1EwRkJhMElzVlVGQlZTeERRVUZETEdWQlFUZENMRVZCUTBrN1ZVRkJRU3hKUVVGQkxFVkJRVTBzU1VGQlRqdFZRVU5CTEV0QlFVRXNSVUZCVVN4TFFVUlNPMVZCUlVFc1VVRkJRU3hGUVVGVkxGTkJRVU1zUjBGQlJEdHRRa0ZEVGl4TFFVRkRMRU5CUVVFc1ZVRkJSQ3hEUVVGWkxFZEJRVm83VlVGRVRTeERRVVpXTzFOQlJFbzdUVUZHYVVRN1NVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTEVOQlFYSkVPMFZCU0VrN08wVkJZVklzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGxRVVJLTEVWQlJVa3NTVUZCU1N4aFFVRktMRU5CUVVFc1EwRkdTanM3T3pzN08wRkJTMG9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhsUVVGMFFpSjlcbiIsInZhciBBUktfTkVUX0FTU0VUUywgQVJLX1JFVEFJTl9QUk9GSVRTLCBBUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUsIEFSS19ST0UsIEJhbGFuY2VTaGVldCwgQ2FzaEZsb3dTdGF0ZW1lbnQsIEdhbWVMb2dpYywgUHJvZml0U3RhdGVtZW50LCBVc2VyRGF0YSwgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2xvZ190YWJsZSwgZ19tYXhTdGF0aXN0aWNzWWVhcnMsIGdfc3RhdGlzdGljc1llYXJzLCBuZWVkQ2FsY0l0ZW0sIHNjZW5lTWFuYWdlcixcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbkJhbGFuY2VTaGVldCA9IHJlcXVpcmUoJy4uL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUnKTtcblxuUHJvZml0U3RhdGVtZW50ID0gcmVxdWlyZSgnLi4vbW9kZWwvUHJvZml0U3RhdGVtZW50LmNvZmZlZScpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IHJlcXVpcmUoJy4uL21vZGVsL0Nhc2hGbG93U3RhdGVtZW50LmNvZmZlZScpO1xuXG5yZXF1aXJlKFwiLi4vZ2xvYmFsVmFsdWUuY29mZmVlXCIpO1xuXG5nX3N0YXRpc3RpY3NZZWFycyA9IDU7XG5cbmdfbWF4U3RhdGlzdGljc1llYXJzID0gNjtcblxubmVlZENhbGNJdGVtID0ge1xuICBcInJlY2VpdmFibGVzXCI6IFwi5bqU5pS26LSm5qy+KOWFgylcIixcbiAgXCJkZXBvc2l0UmVjZWl2ZWRcIjogXCLpooTmlLbotKbmrL4o5YWDKVwiLFxuICBcInNob3J0TG9hblwiOiBcIuefreacn+WAn+asvijlhYMpXCIsXG4gIFwibG9uZ0xvYW5cIjogXCLplb/mnJ/lgJ/mrL4o5YWDKVwiXG59O1xuXG5BUktfUkVUQUlOX1BST0ZJVFMgPSBcIuW9kuWxnuS6juavjeWFrOWPuOiCoeS4nOeahOe7vOWQiOaUtuebiuaAu+minSjlhYMpXCI7XG5cbkFSS19ORVRfQVNTRVRTID0gXCLlvZLlsZ7kuo7mr43lhazlj7jogqHkuJzmnYPnm4rlkIjorqEo5YWDKVwiO1xuXG5BUktfUk9FID0gXCLlh4DotYTkuqfmlLbnm4rnjodcIjtcblxuQVJLX1JFVEFJTl9QUk9GSVRTX0FERF9SQVRFID0gXCLlh4DliKnmtqblkIzmr5Tlop7plb/njodcIjtcblxuZ19sb2dfdGFibGUgPSBbXTtcblxuR2FtZUxvZ2ljID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lTG9naWMoKSB7fVxuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2JhbGFuY2VPYmogPSB7fTtcbiAgICB0aGlzLl9wcm9maXRPYmogPSB7fTtcbiAgICB0aGlzLl9jYXNoRmxvd09iaiA9IHt9O1xuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRoaXMuX2luaXRUYWJsZSgpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5saXN0ZW4oZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iai5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gb2JqLmNhbGxiYWNrKF90aGlzLl9iYWxhbmNlT2JqW1wiMDAwODU4XCJdLmR1bXBQZXJjZW50VGFibGUoKSkgOiB2b2lkIDA7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9pbml0VGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGlyLCBpLCBsZW4sIHN0b2NrQ29kZSwgc3RvY2tUYWJsZTtcbiAgICBzdG9ja1RhYmxlID0gW1wiU1owMDAwMDFcIiwgXCJTWjAwMDAwMlwiLCBcIlNaMDAwMDA4XCIsIFwiU1owMDAwNjBcIiwgXCJTWjAwMDA2M1wiLCBcIlNaMDAwMDY5XCIsIFwiU1owMDAxMDBcIiwgXCJTWjAwMDE1N1wiLCBcIlNaMDAwMTY2XCIsIFwiU1owMDAzMzNcIiwgXCJTWjAwMDMzOFwiLCBcIlNaMDAwNDAyXCIsIFwiU1owMDA0MTNcIiwgXCJTWjAwMDQxNVwiLCBcIlNaMDAwNDIzXCIsIFwiU1owMDA0MjVcIiwgXCJTWjAwMDUwM1wiLCBcIlNaMDAwNTM4XCIsIFwiU1owMDA1NDBcIiwgXCJTWjAwMDU1OVwiLCBcIlNaMDAwNTY4XCIsIFwiU1owMDA2MjNcIiwgXCJTWjAwMDYyNVwiLCBcIlNaMDAwNjI3XCIsIFwiU1owMDA2MzBcIiwgXCJTWjAwMDY1MVwiLCBcIlNaMDAwNjcxXCIsIFwiU1owMDA2ODZcIiwgXCJTWjAwMDcwOVwiLCBcIlNaMDAwNzIzXCIsIFwiU1owMDA3MjVcIiwgXCJTWjAwMDcyOFwiLCBcIlNaMDAwNzM4XCIsIFwiU1owMDA3NTBcIiwgXCJTWjAwMDc2OFwiLCBcIlNaMDAwNzc2XCIsIFwiU1owMDA3ODNcIiwgXCJTWjAwMDc5MlwiLCBcIlNaMDAwODI2XCIsIFwiU1owMDA4MzlcIiwgXCJTWjAwMDg1OFwiLCBcIlNaMDAwODc2XCIsIFwiU1owMDA4OTVcIiwgXCJTWjAwMDg5OFwiLCBcIlNaMDAwOTM4XCIsIFwiU1owMDA5NTlcIiwgXCJTWjAwMDk2MVwiLCBcIlNaMDAwOTYzXCIsIFwiU1owMDA5ODNcIiwgXCJTWjAwMTk3OVwiLCBcIlNaMDAyMDA3XCIsIFwiU1owMDIwMDhcIiwgXCJTWjAwMjAyNFwiLCBcIlNaMDAyMDI3XCIsIFwiU1owMDIwNDRcIiwgXCJTWjAwMjA2NVwiLCBcIlNaMDAyMDc0XCIsIFwiU1owMDIwODFcIiwgXCJTWjAwMjE0MlwiLCBcIlNaMDAyMTQ2XCIsIFwiU1owMDIxNTNcIiwgXCJTWjAwMjE3NFwiLCBcIlNaMDAyMjAyXCIsIFwiU1owMDIyMzBcIiwgXCJTWjAwMjIzNlwiLCBcIlNaMDAyMjQxXCIsIFwiU1owMDIyNTJcIiwgXCJTWjAwMjI5MlwiLCBcIlNaMDAyMjk0XCIsIFwiU1owMDIzMDRcIiwgXCJTWjAwMjMxMFwiLCBcIlNaMDAyMzUyXCIsIFwiU1owMDIzODVcIiwgXCJTWjAwMjQxMVwiLCBcIlNaMDAyNDE1XCIsIFwiU1owMDI0MjRcIiwgXCJTWjAwMjQyNlwiLCBcIlNaMDAyNDUwXCIsIFwiU1owMDI0NTZcIiwgXCJTWjAwMjQ2MFwiLCBcIlNaMDAyNDY1XCIsIFwiU1owMDI0NjZcIiwgXCJTWjAwMjQ2OFwiLCBcIlNaMDAyNDcwXCIsIFwiU1owMDI0NzVcIiwgXCJTWjAwMjUwMFwiLCBcIlNaMDAyNTA4XCIsIFwiU1owMDI1NTVcIiwgXCJTWjAwMjU1OFwiLCBcIlNaMDAyNTcyXCIsIFwiU1owMDI1OTRcIiwgXCJTWjAwMjYwMVwiLCBcIlNaMDAyNjAyXCIsIFwiU1owMDI2MDhcIiwgXCJTWjAwMjYyNFwiLCBcIlNaMDAyNjczXCIsIFwiU1owMDI3MTRcIiwgXCJTWjAwMjczNlwiLCBcIlNaMDAyNzM5XCIsIFwiU1owMDI3OTdcIiwgXCJTWjAwMjgzMVwiLCBcIlNaMDAyODM5XCIsIFwiU1owMDI4NDFcIiwgXCJTWjMwMDAwM1wiLCBcIlNaMzAwMDE1XCIsIFwiU1ozMDAwMTdcIiwgXCJTWjMwMDAyNFwiLCBcIlNaMzAwMDI3XCIsIFwiU1ozMDAwMzNcIiwgXCJTWjMwMDA1OVwiLCBcIlNaMzAwMDcwXCIsIFwiU1ozMDAwNzJcIiwgXCJTWjMwMDEyMlwiLCBcIlNaMzAwMTI0XCIsIFwiU1ozMDAxMzZcIiwgXCJTWjMwMDE0NFwiLCBcIlNaMzAwMjUxXCIsIFwiU1ozMDAzMTVcIiwgXCJTSDYwMDAwMFwiLCBcIlNINjAwMDA4XCIsIFwiU0g2MDAwMDlcIiwgXCJTSDYwMDAxMFwiLCBcIlNINjAwMDExXCIsIFwiU0g2MDAwMTVcIiwgXCJTSDYwMDAxNlwiLCBcIlNINjAwMDE4XCIsIFwiU0g2MDAwMTlcIiwgXCJTSDYwMDAyMVwiLCBcIlNINjAwMDIzXCIsIFwiU0g2MDAwMjhcIiwgXCJTSDYwMDAyOVwiLCBcIlNINjAwMDMwXCIsIFwiU0g2MDAwMzFcIiwgXCJTSDYwMDAzNlwiLCBcIlNINjAwMDM4XCIsIFwiU0g2MDAwNDhcIiwgXCJTSDYwMDA1MFwiLCBcIlNINjAwMDYxXCIsIFwiU0g2MDAwNjZcIiwgXCJTSDYwMDA2OFwiLCBcIlNINjAwMDc0XCIsIFwiU0g2MDAwODVcIiwgXCJTSDYwMDA4OVwiLCBcIlNINjAwMTAwXCIsIFwiU0g2MDAxMDRcIiwgXCJTSDYwMDEwOVwiLCBcIlNINjAwMTExXCIsIFwiU0g2MDAxMTVcIiwgXCJTSDYwMDExOFwiLCBcIlNINjAwMTUzXCIsIFwiU0g2MDAxNTdcIiwgXCJTSDYwMDE3MFwiLCBcIlNINjAwMTc3XCIsIFwiU0g2MDAxODhcIiwgXCJTSDYwMDE5NlwiLCBcIlNINjAwMjA4XCIsIFwiU0g2MDAyMTlcIiwgXCJTSDYwMDIyMVwiLCBcIlNINjAwMjMzXCIsIFwiU0g2MDAyNzFcIiwgXCJTSDYwMDI3NlwiLCBcIlNINjAwMjk3XCIsIFwiU0g2MDAzMDlcIiwgXCJTSDYwMDMzMlwiLCBcIlNINjAwMzQwXCIsIFwiU0g2MDAzNTJcIiwgXCJTSDYwMDM2MlwiLCBcIlNINjAwMzY5XCIsIFwiU0g2MDAzNzJcIiwgXCJTSDYwMDM3M1wiLCBcIlNINjAwMzc2XCIsIFwiU0g2MDAzODNcIiwgXCJTSDYwMDM5MFwiLCBcIlNINjAwNDA2XCIsIFwiU0g2MDA0MTVcIiwgXCJTSDYwMDQzNlwiLCBcIlNINjAwNDgyXCIsIFwiU0g2MDA0ODVcIiwgXCJTSDYwMDQ4OVwiLCBcIlNINjAwNDk4XCIsIFwiU0g2MDA1MThcIiwgXCJTSDYwMDUxOVwiLCBcIlNINjAwNTIyXCIsIFwiU0g2MDA1MzVcIiwgXCJTSDYwMDU0N1wiLCBcIlNINjAwNTQ5XCIsIFwiU0g2MDA1NzBcIiwgXCJTSDYwMDU4M1wiLCBcIlNINjAwNTg1XCIsIFwiU0g2MDA1ODhcIiwgXCJTSDYwMDYwNlwiLCBcIlNINjAwNjM3XCIsIFwiU0g2MDA2NDlcIiwgXCJTSDYwMDY2MFwiLCBcIlNINjAwNjYzXCIsIFwiU0g2MDA2NzRcIiwgXCJTSDYwMDY4MlwiLCBcIlNINjAwNjg1XCIsIFwiU0g2MDA2ODhcIiwgXCJTSDYwMDY5MFwiLCBcIlNINjAwNzAzXCIsIFwiU0g2MDA3MDRcIiwgXCJTSDYwMDcwNVwiLCBcIlNINjAwNzM5XCIsIFwiU0g2MDA3NDFcIiwgXCJTSDYwMDc5NVwiLCBcIlNINjAwODA0XCIsIFwiU0g2MDA4MTZcIiwgXCJTSDYwMDgyMFwiLCBcIlNINjAwODI3XCIsIFwiU0g2MDA4MzdcIiwgXCJTSDYwMDg3MVwiLCBcIlNINjAwODg2XCIsIFwiU0g2MDA4ODdcIiwgXCJTSDYwMDg5M1wiLCBcIlNINjAwODk1XCIsIFwiU0g2MDA5MDBcIiwgXCJTSDYwMDkwOVwiLCBcIlNINjAwOTE5XCIsIFwiU0g2MDA5MjZcIiwgXCJTSDYwMDk1OFwiLCBcIlNINjAwOTU5XCIsIFwiU0g2MDA5NzdcIiwgXCJTSDYwMDk5OVwiLCBcIlNINjAxMDA2XCIsIFwiU0g2MDEwMDlcIiwgXCJTSDYwMTAxMlwiLCBcIlNINjAxMDE4XCIsIFwiU0g2MDEwMjFcIiwgXCJTSDYwMTA4OFwiLCBcIlNINjAxMDk5XCIsIFwiU0g2MDExMTFcIiwgXCJTSDYwMTExN1wiLCBcIlNINjAxMTE4XCIsIFwiU0g2MDExNTVcIiwgXCJTSDYwMTE2M1wiLCBcIlNINjAxMTY2XCIsIFwiU0g2MDExNjlcIiwgXCJTSDYwMTE4NlwiLCBcIlNINjAxMTk4XCIsIFwiU0g2MDEyMTFcIiwgXCJTSDYwMTIxMlwiLCBcIlNINjAxMjE2XCIsIFwiU0g2MDEyMjVcIiwgXCJTSDYwMTIyOFwiLCBcIlNINjAxMjI5XCIsIFwiU0g2MDEyODhcIiwgXCJTSDYwMTMxOFwiLCBcIlNINjAxMzI4XCIsIFwiU0g2MDEzMzNcIiwgXCJTSDYwMTMzNlwiLCBcIlNINjAxMzc1XCIsIFwiU0g2MDEzNzdcIiwgXCJTSDYwMTM5MFwiLCBcIlNINjAxMzk4XCIsIFwiU0g2MDE1NTVcIiwgXCJTSDYwMTYwMFwiLCBcIlNINjAxNjAxXCIsIFwiU0g2MDE2MDdcIiwgXCJTSDYwMTYwOFwiLCBcIlNINjAxNjExXCIsIFwiU0g2MDE2MThcIiwgXCJTSDYwMTYyOFwiLCBcIlNINjAxNjMzXCIsIFwiU0g2MDE2NjhcIiwgXCJTSDYwMTY2OVwiLCBcIlNINjAxNjg4XCIsIFwiU0g2MDE3MThcIiwgXCJTSDYwMTcyN1wiLCBcIlNINjAxNzY2XCIsIFwiU0g2MDE3ODhcIiwgXCJTSDYwMTgwMFwiLCBcIlNINjAxODE4XCIsIFwiU0g2MDE4NTdcIiwgXCJTSDYwMTg2NlwiLCBcIlNINjAxODcyXCIsIFwiU0g2MDE4NzdcIiwgXCJTSDYwMTg3OFwiLCBcIlNINjAxODgxXCIsIFwiU0g2MDE4ODhcIiwgXCJTSDYwMTg5OFwiLCBcIlNINjAxODk5XCIsIFwiU0g2MDE5MDFcIiwgXCJTSDYwMTkxOVwiLCBcIlNINjAxOTMzXCIsIFwiU0g2MDE5MzlcIiwgXCJTSDYwMTk1OFwiLCBcIlNINjAxOTY2XCIsIFwiU0g2MDE5ODVcIiwgXCJTSDYwMTk4OFwiLCBcIlNINjAxOTg5XCIsIFwiU0g2MDE5OTFcIiwgXCJTSDYwMTk5MlwiLCBcIlNINjAxOTk3XCIsIFwiU0g2MDE5OThcIiwgXCJTSDYwMzE2MFwiLCBcIlNINjAzNzk5XCIsIFwiU0g2MDM4MzNcIiwgXCJTSDYwMzg1OFwiLCBcIlNINjAzOTkzXCJdO1xuICAgIGRpciA9IFwiaHMzMDBcIjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzdG9ja1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdG9ja0NvZGUgPSBzdG9ja1RhYmxlW2ldO1xuICAgICAgc3RvY2tDb2RlID0gc3RvY2tDb2RlLnNsaWNlKDIsIDgpO1xuICAgICAgdGhpcy5fYmFsYW5jZU9ialtzdG9ja0NvZGVdID0gbmV3IEJhbGFuY2VTaGVldChkaXIsIHN0b2NrQ29kZSk7XG4gICAgICB0aGlzLl9wcm9maXRPYmpbc3RvY2tDb2RlXSA9IG5ldyBQcm9maXRTdGF0ZW1lbnQoZGlyLCBzdG9ja0NvZGUpO1xuICAgICAgdGhpcy5fY2FzaEZsb3dPYmpbc3RvY2tDb2RlXSA9IG5ldyBDYXNoRmxvd1N0YXRlbWVudChkaXIsIHN0b2NrQ29kZSk7XG4gICAgfVxuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJlc3VsdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgY2FsY0l0ZW0sIHRvdGFsQXNzZXRzSW5kZXgsIHRvdGFsU2NvcmUsIHZhbHVlO1xuICAgIHRvdGFsU2NvcmUgPSAwO1xuICAgIHRvdGFsQXNzZXRzSW5kZXggPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIEFSS19ORVRfQVNTRVRTKTtcbiAgICBnX3N0YXRpc3RpY3NZZWFycyA9IHRoaXMuX2dldFN0YXRpc3RpY3NZZWFycyhkYXRhLCB0b3RhbEFzc2V0c0luZGV4KTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5oC76LWE5LqnIFwiICsgKHRoaXMuX2dldFNob3dOdW1iZXIoZGF0YVt0b3RhbEFzc2V0c0luZGV4XVsxXSkpICsgXCIsIOe7n+iuoeaXtumXtDpcIiArIGdfc3RhdGlzdGljc1llYXJzICsgXCLlubRcIik7XG4gICAgZm9yIChjYWxjSXRlbSBpbiBuZWVkQ2FsY0l0ZW0pIHtcbiAgICAgIGlmICghaGFzUHJvcC5jYWxsKG5lZWRDYWxjSXRlbSwgY2FsY0l0ZW0pKSBjb250aW51ZTtcbiAgICAgIHZhbHVlID0gbmVlZENhbGNJdGVtW2NhbGNJdGVtXTtcbiAgICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fY2FsY1Njb3JlKGRhdGEsIGNhbGNJdGVtLCB2YWx1ZSwgdG90YWxBc3NldHNJbmRleCk7XG4gICAgfVxuICAgIHRvdGFsU2NvcmUgKz0gdGhpcy5fZ2V0UmV0YWluZWRQcm9maXRzU2NvcmUoZGF0YSk7XG4gICAgdG90YWxTY29yZSArPSB0aGlzLl9nZXRSb2VTY29yZShkYXRhKTtcbiAgICB0b3RhbFNjb3JlID0gTWF0aC5jZWlsKHRvdGFsU2NvcmUpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCLmgLvliIY6IFwiICsgdG90YWxTY29yZSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGdfbG9nX3RhYmxlLCBudWxsLCBcIlxcdFwiKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZWNlaXZlU2NvcmUgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gICAgcmV0dXJuIC1wZXJjZW50O1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFNjb3JlID0gZnVuY3Rpb24odHlwZSwgcGVyY2VudCkge1xuICAgIHZhciBzY29yZTtcbiAgICBzY29yZSA9IDA7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFwicmVjZWl2YWJsZXNcIjpcbiAgICAgICAgc2NvcmUgPSB0aGlzLl9nZXRSZWNlaXZlU2NvcmUocGVyY2VudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlcG9zaXRSZWNlaXZlZFwiOlxuICAgICAgICBzY29yZSA9IHBlcmNlbnQ7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSBcInNob3J0TG9hblwiIHx8IHR5cGUgPT09IFwibG9uZ0xvYW5cIikge1xuICAgICAgc2NvcmUgPSA0MCAtIHBlcmNlbnQ7XG4gICAgfVxuICAgIHJldHVybiBzY29yZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRWYWxpZE51bWJlciA9IGZ1bmN0aW9uKG51bWJlclN0cikge1xuICAgIHZhciBudW07XG4gICAgaWYgKHR5cGVvZiBudW1iZXJTdHIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJldHVybiBudW1iZXJTdHI7XG4gICAgfVxuICAgIG51bSA9IG51bWJlclN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIHJldHVybiBOdW1iZXIobnVtKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRUeXBlUm93TnVtID0gZnVuY3Rpb24oZGF0YSwgdHlwZVN0cikge1xuICAgIHZhciBpLCBpbmRleCwgbGVuLCByb3csIHR5cGVOdW07XG4gICAgdHlwZU51bSA9IDA7XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIHJvdyA9IGRhdGFbaW5kZXhdO1xuICAgICAgaWYgKHJvd1swXS5pbmRleE9mKHR5cGVTdHIpICE9PSAtMSkge1xuICAgICAgICB0eXBlTnVtID0gaW5kZXg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHlwZU51bTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRDb21wb3VuZFJhdGUgPSBmdW5jdGlvbihhZGRSYXRlLCB0aW1lKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKDEgLyB0aW1lICogTWF0aC5sb2coYWRkUmF0ZSkpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2NhbGNTY29yZSA9IGZ1bmN0aW9uKGRhdGEsIHR5cGUsIHR5cGVTdHIsIHRvdGFsQXNzZXRzSW5kZXgpIHtcbiAgICB2YXIgYXZlcmFnZVBlcmNlbnQsIGksIGluZm9UYWJsZSwgcmVmLCBzY29yZSwgdG90YWxQZXJjZW50LCB0eXBlTnVtLCB5ZWFySW5kZXg7XG4gICAgdHlwZU51bSA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgdHlwZVN0cik7XG4gICAgdG90YWxQZXJjZW50ID0gMDtcbiAgICBpbmZvVGFibGUgPSBbXTtcbiAgICBpbmZvVGFibGUucHVzaChkYXRhW3R5cGVOdW1dWzBdKTtcbiAgICBmb3IgKHllYXJJbmRleCA9IGkgPSAxLCByZWYgPSBnX3N0YXRpc3RpY3NZZWFyczsgMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyB5ZWFySW5kZXggPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgaWYgKGRhdGFbdHlwZU51bV1beWVhckluZGV4XSA9PSBudWxsKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5mb1RhYmxlLnB1c2godGhpcy5fZ2V0U2hvd051bWJlcih0aGlzLl9nZXRWYWxpZE51bWJlcihkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0pKSk7XG4gICAgICB0b3RhbFBlcmNlbnQgKz0gdGhpcy5fZ2V0VmFsaWROdW1iZXIoZGF0YVt0eXBlTnVtXVt5ZWFySW5kZXhdKSAvIHRoaXMuX2dldFZhbGlkTnVtYmVyKGRhdGFbdG90YWxBc3NldHNJbmRleF1beWVhckluZGV4XSkgKiAxMDA7XG4gICAgfVxuICAgIGF2ZXJhZ2VQZXJjZW50ID0gdG90YWxQZXJjZW50IC8gZ19zdGF0aXN0aWNzWWVhcnM7XG4gICAgc2NvcmUgPSB0aGlzLl9nZXRTY29yZSh0eXBlLCBhdmVyYWdlUGVyY2VudCk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIlwiICsgaW5mb1RhYmxlKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKG5lZWRDYWxjSXRlbVt0eXBlXSArIFwiIOavlOS+izpcIiArIChhdmVyYWdlUGVyY2VudC50b0ZpeGVkKDIpKSArIFwiJSwg5YiG5pWwIDpcIiArIChzY29yZS50b0ZpeGVkKDIpKSk7XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFN0YXRpc3RpY3NZZWFycyA9IGZ1bmN0aW9uKGRhdGEsIHRvdGFsQXNzZXRzSW5kZXgpIHtcbiAgICB2YXIgbGVuZ3RoLCB0b3RhbEFzc2V0cztcbiAgICB0b3RhbEFzc2V0cyA9IGRhdGFbdG90YWxBc3NldHNJbmRleF0uZmlsdGVyKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhID4gMDtcbiAgICB9KTtcbiAgICBsZW5ndGggPSAwO1xuICAgIGlmICh0b3RhbEFzc2V0cy5sZW5ndGggPiBnX21heFN0YXRpc3RpY3NZZWFycykge1xuICAgICAgbGVuZ3RoID0gZ19tYXhTdGF0aXN0aWNzWWVhcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvdGFsQXNzZXRzLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRUYWJsZUJ5TmFtZSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUpIHtcbiAgICB2YXIgcm93TnVtLCB0YWJsZTtcbiAgICByb3dOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIG5hbWUpO1xuICAgIHRhYmxlID0gZGF0YVtyb3dOdW1dLmZpbHRlcihmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gYSA+IDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhYmxlLnNsaWNlKDAsIGdfbWF4U3RhdGlzdGljc1llYXJzKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZXRhaW5lZFByb2ZpdHNTY29yZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgYWRkUmV0YWluZWRQcm9maXRzLCBhbGxSZXRhaW5lZFByb2ZpdHMsIGF2ZXJhZ2VQZXJjZW50O1xuICAgIHRoaXMuX2dldFJldGFpbmVkUHJvZml0c0FkZFJhdGUoZGF0YSk7XG4gICAgYWxsUmV0YWluZWRQcm9maXRzID0gdGhpcy5fZ2V0VGFibGVCeU5hbWUoZGF0YSwgQVJLX1JFVEFJTl9QUk9GSVRTKTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwi5Yid5aeL5YeA5Yip5ram77yaXCIgKyAodGhpcy5fZ2V0U2hvd051bWJlcihhbGxSZXRhaW5lZFByb2ZpdHNbYWxsUmV0YWluZWRQcm9maXRzLmxlbmd0aCAtIDFdKSkgKyBcIizlvZPliY3lh4DliKnmtqY6XCIgKyAodGhpcy5fZ2V0U2hvd051bWJlcihhbGxSZXRhaW5lZFByb2ZpdHNbMF0pKSk7XG4gICAgYWRkUmV0YWluZWRQcm9maXRzID0gYWxsUmV0YWluZWRQcm9maXRzWzBdIC8gYWxsUmV0YWluZWRQcm9maXRzW2FsbFJldGFpbmVkUHJvZml0cy5sZW5ndGggLSAxXTtcbiAgICBhdmVyYWdlUGVyY2VudCA9ICh0aGlzLl9nZXRDb21wb3VuZFJhdGUoYWRkUmV0YWluZWRQcm9maXRzLCBnX3N0YXRpc3RpY3NZZWFycykgLSAxKSAqIDEwMDtcbiAgICBnX2xvZ190YWJsZS5wdXNoKGdfc3RhdGlzdGljc1llYXJzICsgXCLlubQs5YeA5Yip5ram5aSN5ZCI5aKe6ZW/6YCf5bqmOlwiICsgKGF2ZXJhZ2VQZXJjZW50LnRvRml4ZWQoMikpICsgXCIlXCIpO1xuICAgIHJldHVybiBhdmVyYWdlUGVyY2VudDtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSZXRhaW5lZFByb2ZpdHNBZGRSYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBpLCByYXRlQWRkVGFibGUsIHJhdGVJbmRleCwgcmVmLCByb3dOdW07XG4gICAgcm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBBUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUpO1xuICAgIHJhdGVBZGRUYWJsZSA9IFtdO1xuICAgIGZvciAocmF0ZUluZGV4ID0gaSA9IDEsIHJlZiA9IGdfc3RhdGlzdGljc1llYXJzOyAxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWY7IHJhdGVJbmRleCA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICByYXRlQWRkVGFibGUucHVzaChkYXRhW3Jvd051bV1bcmF0ZUluZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiBnX2xvZ190YWJsZS5wdXNoKEFSS19SRVRBSU5fUFJPRklUU19BRERfUkFURSArIFwiOlwiICsgcmF0ZUFkZFRhYmxlKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRSb2VTY29yZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgYXZlcmFnZVJvZSwgY291bnQsIGksIHJlZiwgcm9lLCByb2VSb3dOdW0sIHJvZVRhYmxlLCByb2VWYWx1ZSwgdG90YWxSb2U7XG4gICAgcm9lUm93TnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCBBUktfUk9FKTtcbiAgICB0b3RhbFJvZSA9IDA7XG4gICAgY291bnQgPSAwO1xuICAgIHJvZVRhYmxlID0gW107XG4gICAgZm9yIChyb2VWYWx1ZSA9IGkgPSAxLCByZWYgPSBnX3N0YXRpc3RpY3NZZWFyczsgMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmOyByb2VWYWx1ZSA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFbcm9lUm93TnVtXVtyb2VWYWx1ZV0gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByb2UgPSBkYXRhW3JvZVJvd051bV1bcm9lVmFsdWVdO1xuICAgICAgcm9lVGFibGUucHVzaChyb2UpO1xuICAgICAgcm9lID0gTnVtYmVyKHJvZS5yZXBsYWNlKFwiJVwiLCBcIlwiKSk7XG4gICAgICB0b3RhbFJvZSArPSByb2U7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgICBnX2xvZ190YWJsZS5wdXNoKFwiUk9FOlwiICsgcm9lVGFibGUpO1xuICAgIGF2ZXJhZ2VSb2UgPSB0b3RhbFJvZSAvIGNvdW50O1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCLlubPlnYdST0U6XCIgKyAoYXZlcmFnZVJvZS50b0ZpeGVkKDIpKSk7XG4gICAgcmV0dXJuIGF2ZXJhZ2VSb2U7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0U2hvd051bWJlciA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgIHJldHVybiAoKG51bWJlciAvIDEwMDAwMDAwMCkudG9GaXhlZCgyKSkgKyBcIiDkur9cIjtcbiAgfTtcblxuICByZXR1cm4gR2FtZUxvZ2ljO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMb2dpYztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTI5dWRISnZiQzlCY210SFlXMWxURzluYVdNdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMjl1ZEhKdmJDOUJjbXRIWVcxbFRHOW5hV011WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRXNNbEJCUVVFN1JVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlFXdENMRTlCUVVFc1EwRkJVU3hwUTBGQlVqczdRVUZEYkVJc1dVRkJRU3hIUVVGclFpeFBRVUZCTEVOQlFWRXNhVU5CUVZJN08wRkJRMnhDTEZWQlFVRXNSMEZCYTBJc1QwRkJRU3hEUVVGUkxDdENRVUZTT3p0QlFVTnNRaXhSUVVGQkxFZEJRV3RDTEU5QlFVRXNRMEZCVVN3MlFrRkJVanM3UVVGRmJFSXNXVUZCUVN4SFFVRnJRaXhQUVVGQkxFTkJRVkVzT0VKQlFWSTdPMEZCUTJ4Q0xHVkJRVUVzUjBGQmNVSXNUMEZCUVN4RFFVRlJMR2xEUVVGU096dEJRVU55UWl4cFFrRkJRU3hIUVVGMVFpeFBRVUZCTEVOQlFWRXNiVU5CUVZJN08wRkJSWFpDTEU5QlFVRXNRMEZCVVN4MVFrRkJVanM3UVVGRlFTeHBRa0ZCUVN4SFFVRnZRanM3UVVGRGNFSXNiMEpCUVVFc1IwRkJkVUk3TzBGQlJYWkNMRmxCUVVFc1IwRkJaVHRGUVVOWUxHRkJRVUVzUlVGQlpTeFRRVVJLTzBWQlJWZ3NhVUpCUVVFc1JVRkJiMElzVTBGR1ZEdEZRVWRZTEZkQlFVRXNSVUZCWXl4VFFVaElPMFZCU1Znc1ZVRkJRU3hGUVVGaExGTkJTa1k3T3p0QlFVOW1MR3RDUVVGQkxFZEJRWEZDT3p0QlFVTnlRaXhqUVVGQkxFZEJRV3RDT3p0QlFVTnNRaXhQUVVGQkxFZEJRVlU3TzBGQlExWXNNa0pCUVVFc1IwRkJPRUk3TzBGQlJUbENMRmRCUVVFc1IwRkJZenM3UVVGSlVqczdPM05DUVVOR0xFbEJRVUVzUjBGQlRTeFRRVUZCTzBsQlEwWXNTVUZCUXl4RFFVRkJMRmRCUVVRc1IwRkJaVHRKUVVObUxFbEJRVU1zUTBGQlFTeFZRVUZFTEVkQlFXTTdTVUZEWkN4SlFVRkRMRU5CUVVFc1dVRkJSQ3hIUVVGblFqdEpRVU5vUWl4SlFVRkRMRU5CUVVFc1pVRkJSQ3hEUVVGQk8xZEJRMEVzU1VGQlF5eERRVUZCTEZWQlFVUXNRMEZCUVR0RlFVeEZPenR6UWtGUFRpeGxRVUZCTEVkQlFXbENMRk5CUVVFN1YwRkZZaXhaUVVGWkxFTkJRVU1zVFVGQllpeERRVUZ2UWl4VlFVRlZMRU5CUVVNc1pVRkJMMElzUlVGQlowUXNRMEZCUVN4VFFVRkJMRXRCUVVFN1lVRkJRU3hUUVVGRExFZEJRVVE3YjBSQlF6VkRMRWRCUVVjc1EwRkJReXhUUVVGVkxFdEJRVU1zUTBGQlFTeFhRVUZaTEVOQlFVRXNVVUZCUVN4RFFVRlRMRU5CUVVNc1owSkJRWFpDTEVOQlFVRTdUVUZFT0VJN1NVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTEVOQlFXaEVPMFZCUm1FN08zTkNRVk5xUWl4VlFVRkJMRWRCUVZrc1UwRkJRVHRCUVVOU0xGRkJRVUU3U1VGQlFTeFZRVUZCTEVkQlFXRXNRMEZCUXl4VlFVRkVMRVZCUVZrc1ZVRkJXaXhGUVVGMVFpeFZRVUYyUWl4RlFVRnJReXhWUVVGc1F5eEZRVUUyUXl4VlFVRTNReXhGUVVGM1JDeFZRVUY0UkN4RlFVRnRSU3hWUVVGdVJTeEZRVUU0UlN4VlFVRTVSU3hGUVVGNVJpeFZRVUY2Uml4RlFVRnZSeXhWUVVGd1J5eEZRVUVyUnl4VlFVRXZSeXhGUVVFd1NDeFZRVUV4U0N4RlFVRnhTU3hWUVVGeVNTeEZRVUZuU2l4VlFVRm9TaXhGUVVFeVNpeFZRVUV6U2l4RlFVRnpTeXhWUVVGMFN5eEZRVUZwVEN4VlFVRnFUQ3hGUVVFMFRDeFZRVUUxVEN4RlFVRjFUU3hWUVVGMlRTeEZRVUZyVGl4VlFVRnNUaXhGUVVFMlRpeFZRVUUzVGl4RlFVRjNUeXhWUVVGNFR5eEZRVUZ0VUN4VlFVRnVVQ3hGUVVFNFVDeFZRVUU1VUN4RlFVRjVVU3hWUVVGNlVTeEZRVUZ2VWl4VlFVRndVaXhGUVVFclVpeFZRVUV2VWl4RlFVRXdVeXhWUVVFeFV5eEZRVUZ4VkN4VlFVRnlWQ3hGUVVGblZTeFZRVUZvVlN4RlFVRXlWU3hWUVVFelZTeEZRVUZ6Vml4VlFVRjBWaXhGUVVGcFZ5eFZRVUZxVnl4RlFVRTBWeXhWUVVFMVZ5eEZRVUYxV0N4VlFVRjJXQ3hGUVVGcldTeFZRVUZzV1N4RlFVRTJXU3hWUVVFM1dTeEZRVUYzV2l4VlFVRjRXaXhGUVVGdFlTeFZRVUZ1WVN4RlFVRTRZU3hWUVVFNVlTeEZRVUY1WWl4VlFVRjZZaXhGUVVGdll5eFZRVUZ3WXl4RlFVRXJZeXhWUVVFdll5eEZRVUV3WkN4VlFVRXhaQ3hGUVVGeFpTeFZRVUZ5WlN4RlFVRm5aaXhWUVVGb1ppeEZRVUV5Wml4VlFVRXpaaXhGUVVGelowSXNWVUZCZEdkQ0xFVkJRV2xvUWl4VlFVRnFhRUlzUlVGQk5HaENMRlZCUVRWb1FpeEZRVUYxYVVJc1ZVRkJkbWxDTEVWQlFXdHFRaXhWUVVGc2FrSXNSVUZCTm1wQ0xGVkJRVGRxUWl4RlFVRjNhMElzVlVGQmVHdENMRVZCUVcxc1FpeFZRVUZ1YkVJc1JVRkJPR3hDTEZWQlFUbHNRaXhGUVVGNWJVSXNWVUZCZW0xQ0xFVkJRVzl1UWl4VlFVRndia0lzUlVGQksyNUNMRlZCUVM5dVFpeEZRVUV3YjBJc1ZVRkJNVzlDTEVWQlFYRndRaXhWUVVGeWNFSXNSVUZCWjNGQ0xGVkJRV2h4UWl4RlFVRXljVUlzVlVGQk0zRkNMRVZCUVhOeVFpeFZRVUYwY2tJc1JVRkJhWE5DTEZWQlFXcHpRaXhGUVVFMGMwSXNWVUZCTlhOQ0xFVkJRWFYwUWl4VlFVRjJkRUlzUlVGQmEzVkNMRlZCUVd4MVFpeEZRVUUyZFVJc1ZVRkJOM1ZDTEVWQlFYZDJRaXhWUVVGNGRrSXNSVUZCYlhkQ0xGVkJRVzUzUWl4RlFVRTRkMElzVlVGQk9YZENMRVZCUVhsNFFpeFZRVUY2ZUVJc1JVRkJiM2xDTEZWQlFYQjVRaXhGUVVFcmVVSXNWVUZCTDNsQ0xFVkJRVEI2UWl4VlFVRXhla0lzUlVGQmNUQkNMRlZCUVhJd1FpeEZRVUZuTVVJc1ZVRkJhREZDTEVWQlFUSXhRaXhWUVVFek1VSXNSVUZCY3pKQ0xGVkJRWFF5UWl4RlFVRnBNMElzVlVGQmFqTkNMRVZCUVRRelFpeFZRVUUxTTBJc1JVRkJkVFJDTEZWQlFYWTBRaXhGUVVGck5VSXNWVUZCYkRWQ0xFVkJRVFkxUWl4VlFVRTNOVUlzUlVGQmR6WkNMRlZCUVhnMlFpeEZRVUZ0TjBJc1ZVRkJiamRDTEVWQlFUZzNRaXhWUVVFNU4wSXNSVUZCZVRoQ0xGVkJRWG80UWl4RlFVRnZPVUlzVlVGQmNEbENMRVZCUVNzNVFpeFZRVUV2T1VJc1JVRkJNQ3RDTEZWQlFURXJRaXhGUVVGeEwwSXNWVUZCY2k5Q0xFVkJRV2RuUXl4VlFVRm9aME1zUlVGQk1tZERMRlZCUVROblF5eEZRVUZ6YUVNc1ZVRkJkR2hETEVWQlFXbHBReXhWUVVGcWFVTXNSVUZCTkdsRExGVkJRVFZwUXl4RlFVRjFha01zVlVGQmRtcERMRVZCUVd0clF5eFZRVUZzYTBNc1JVRkJObXRETEZWQlFUZHJReXhGUVVGM2JFTXNWVUZCZUd4RExFVkJRVzF0UXl4VlFVRnViVU1zUlVGQk9HMURMRlZCUVRsdFF5eEZRVUY1YmtNc1ZVRkJlbTVETEVWQlFXOXZReXhWUVVGd2IwTXNSVUZCSzI5RExGVkJRUzl2UXl4RlFVRXdjRU1zVlVGQk1YQkRMRVZCUVhGeFF5eFZRVUZ5Y1VNc1JVRkJaM0pETEZWQlFXaHlReXhGUVVFeWNrTXNWVUZCTTNKRExFVkJRWE56UXl4VlFVRjBjME1zUlVGQmFYUkRMRlZCUVdwMFF5eEZRVUUwZEVNc1ZVRkJOWFJETEVWQlFYVjFReXhWUVVGMmRVTXNSVUZCYTNaRExGVkJRV3gyUXl4RlFVRTJka01zVlVGQk4zWkRMRVZCUVhkM1F5eFZRVUY0ZDBNc1JVRkJiWGhETEZWQlFXNTRReXhGUVVFNGVFTXNWVUZCT1hoRExFVkJRWGw1UXl4VlFVRjZlVU1zUlVGQmIzcERMRlZCUVhCNlF5eEZRVUVyZWtNc1ZVRkJMM3BETEVWQlFUQXdReXhWUVVFeE1FTXNSVUZCY1RGRExGVkJRWEl4UXl4RlFVRm5Na01zVlVGQmFESkRMRVZCUVRJeVF5eFZRVUV6TWtNc1JVRkJjek5ETEZWQlFYUXpReXhGUVVGcE5FTXNWVUZCYWpSRExFVkJRVFEwUXl4VlFVRTFORU1zUlVGQmRUVkRMRlZCUVhZMVF5eEZRVUZyTmtNc1ZVRkJiRFpETEVWQlFUWTJReXhWUVVFM05rTXNSVUZCZHpkRExGVkJRWGczUXl4RlFVRnRPRU1zVlVGQmJqaERMRVZCUVRnNFF5eFZRVUU1T0VNc1JVRkJlVGxETEZWQlFYbzVReXhGUVVGdkswTXNWVUZCY0N0RExFVkJRU3NyUXl4VlFVRXZLME1zUlVGQk1DOURMRlZCUVRFdlF5eEZRVUZ4WjBRc1ZVRkJjbWRFTEVWQlFXZG9SQ3hWUVVGb2FFUXNSVUZCTW1oRUxGVkJRVE5vUkN4RlFVRnphVVFzVlVGQmRHbEVMRVZCUVdscVJDeFZRVUZxYWtRc1JVRkJOR3BFTEZWQlFUVnFSQ3hGUVVGMWEwUXNWVUZCZG10RUxFVkJRV3RzUkN4VlFVRnNiRVFzUlVGQk5teEVMRlZCUVRkc1JDeEZRVUYzYlVRc1ZVRkJlRzFFTEVWQlFXMXVSQ3hWUVVGdWJrUXNSVUZCT0c1RUxGVkJRVGx1UkN4RlFVRjViMFFzVlVGQmVtOUVMRVZCUVc5d1JDeFZRVUZ3Y0VRc1JVRkJLM0JFTEZWQlFTOXdSQ3hGUVVFd2NVUXNWVUZCTVhGRUxFVkJRWEZ5UkN4VlFVRnlja1FzUlVGQlozTkVMRlZCUVdoelJDeEZRVUV5YzBRc1ZVRkJNM05FTEVWQlFYTjBSQ3hWUVVGMGRFUXNSVUZCYVhWRUxGVkJRV3AxUkN4RlFVRTBkVVFzVlVGQk5YVkVMRVZCUVhWMlJDeFZRVUYyZGtRc1JVRkJhM2RFTEZWQlFXeDNSQ3hGUVVFMmQwUXNWVUZCTjNkRUxFVkJRWGQ0UkN4VlFVRjRlRVFzUlVGQmJYbEVMRlZCUVc1NVJDeEZRVUU0ZVVRc1ZVRkJPWGxFTEVWQlFYbDZSQ3hWUVVGNmVrUXNSVUZCYnpCRUxGVkJRWEF3UkN4RlFVRXJNRVFzVlVGQkx6QkVMRVZCUVRBeFJDeFZRVUV4TVVRc1JVRkJjVEpFTEZWQlFYSXlSQ3hGUVVGbk0wUXNWVUZCYURORUxFVkJRVEl6UkN4VlFVRXpNMFFzUlVGQmN6UkVMRlZCUVhRMFJDeEZRVUZwTlVRc1ZVRkJhalZFTEVWQlFUUTFSQ3hWUVVFMU5VUXNSVUZCZFRaRUxGVkJRWFkyUkN4RlFVRnJOMFFzVlVGQmJEZEVMRVZCUVRZM1JDeFZRVUUzTjBRc1JVRkJkemhFTEZWQlFYZzRSQ3hGUVVGdE9VUXNWVUZCYmpsRUxFVkJRVGc1UkN4VlFVRTVPVVFzUlVGQmVTdEVMRlZCUVhvclJDeEZRVUZ2TDBRc1ZVRkJjQzlFTEVWQlFTc3ZSQ3hWUVVFdkwwUXNSVUZCTUdkRkxGVkJRVEZuUlN4RlFVRnhhRVVzVlVGQmNtaEZMRVZCUVdkcFJTeFZRVUZvYVVVc1JVRkJNbWxGTEZWQlFUTnBSU3hGUVVGemFrVXNWVUZCZEdwRkxFVkJRV2xyUlN4VlFVRnFhMFVzUlVGQk5HdEZMRlZCUVRWclJTeEZRVUYxYkVVc1ZVRkJkbXhGTEVWQlFXdHRSU3hWUVVGc2JVVXNSVUZCTm0xRkxGVkJRVGR0UlN4RlFVRjNia1VzVlVGQmVHNUZMRVZCUVcxdlJTeFZRVUZ1YjBVc1JVRkJPRzlGTEZWQlFUbHZSU3hGUVVGNWNFVXNWVUZCZW5CRkxFVkJRVzl4UlN4VlFVRndjVVVzUlVGQkszRkZMRlZCUVM5eFJTeEZRVUV3Y2tVc1ZVRkJNWEpGTEVWQlFYRnpSU3hWUVVGeWMwVXNSVUZCWjNSRkxGVkJRV2gwUlN4RlFVRXlkRVVzVlVGQk0zUkZMRVZCUVhOMVJTeFZRVUYwZFVVc1JVRkJhWFpGTEZWQlFXcDJSU3hGUVVFMGRrVXNWVUZCTlhaRkxFVkJRWFYzUlN4VlFVRjJkMFVzUlVGQmEzaEZMRlZCUVd4NFJTeEZRVUUyZUVVc1ZVRkJOM2hGTEVWQlFYZDVSU3hWUVVGNGVVVXNSVUZCYlhwRkxGVkJRVzU2UlN4RlFVRTRla1VzVlVGQk9YcEZMRVZCUVhrd1JTeFZRVUY2TUVVc1JVRkJiekZGTEZWQlFYQXhSU3hGUVVFck1VVXNWVUZCTHpGRkxFVkJRVEF5UlN4VlFVRXhNa1VzUlVGQmNUTkZMRlZCUVhJelJTeEZRVUZuTkVVc1ZVRkJhRFJGTEVWQlFUSTBSU3hWUVVFek5FVXNSVUZCY3pWRkxGVkJRWFExUlN4RlFVRnBOa1VzVlVGQmFqWkZMRVZCUVRRMlJTeFZRVUUxTmtVc1JVRkJkVGRGTEZWQlFYWTNSU3hGUVVGck9FVXNWVUZCYkRoRkxFVkJRVFk0UlN4VlFVRTNPRVVzUlVGQmR6bEZMRlZCUVhnNVJTeEZRVUZ0SzBVc1ZVRkJiaXRGTEVWQlFUZ3JSU3hWUVVFNUswVXNSVUZCZVM5RkxGVkJRWG92UlN4RlFVRnZaMFlzVlVGQmNHZEdMRVZCUVN0blJpeFZRVUV2WjBZc1JVRkJNR2hHTEZWQlFURm9SaXhGUVVGeGFVWXNWVUZCY21sR0xFVkJRV2RxUml4VlFVRm9ha1lzUlVGQk1tcEdMRlZCUVROcVJpeEZRVUZ6YTBZc1ZVRkJkR3RHTEVWQlFXbHNSaXhWUVVGcWJFWXNSVUZCTkd4R0xGVkJRVFZzUml4RlFVRjFiVVlzVlVGQmRtMUdMRVZCUVd0dVJpeFZRVUZzYmtZc1JVRkJObTVHTEZWQlFUZHVSaXhGUVVGM2IwWXNWVUZCZUc5R0xFVkJRVzF3Uml4VlFVRnVjRVlzUlVGQk9IQkdMRlZCUVRsd1JpeEZRVUY1Y1VZc1ZVRkJlbkZHTEVWQlFXOXlSaXhWUVVGd2NrWXNSVUZCSzNKR0xGVkJRUzl5Uml4RlFVRXdjMFlzVlVGQk1YTkdMRVZCUVhGMFJpeFZRVUZ5ZEVZc1JVRkJaM1ZHTEZWQlFXaDFSaXhGUVVFeWRVWXNWVUZCTTNWR0xFVkJRWE4yUml4VlFVRjBka1lzUlVGQmFYZEdMRlZCUVdwM1JpeEZRVUUwZDBZc1ZVRkJOWGRHTEVWQlFYVjRSaXhWUVVGMmVFWXNSVUZCYTNsR0xGVkJRV3g1Uml4RlFVRTJlVVlzVlVGQk4zbEdMRVZCUVhkNlJpeFZRVUY0ZWtZc1JVRkJiVEJHTEZWQlFXNHdSaXhGUVVFNE1FWXNWVUZCT1RCR0xFVkJRWGt4Uml4VlFVRjZNVVlzUlVGQmJ6SkdMRlZCUVhBeVJpeEZRVUVyTWtZc1ZVRkJMekpHTEVWQlFUQXpSaXhWUVVFeE0wWXNSVUZCY1RSR0xGVkJRWEkwUml4RlFVRm5OVVlzVlVGQmFEVkdMRVZCUVRJMVJpeFZRVUV6TlVZc1JVRkJjelpHTEZWQlFYUTJSaXhGUVVGcE4wWXNWVUZCYWpkR0xFVkJRVFEzUml4VlFVRTFOMFlzUlVGQmRUaEdMRlZCUVhZNFJpeEZRVUZyT1VZc1ZVRkJiRGxHTEVWQlFUWTVSaXhWUVVFM09VWXNSVUZCZHl0R0xGVkJRWGdyUml4RlFVRnRMMFlzVlVGQmJpOUdMRVZCUVRndlJpeFZRVUU1TDBZc1JVRkJlV2RITEZWQlFYcG5SeXhGUVVGdmFFY3NWVUZCY0doSExFVkJRU3RvUnl4VlFVRXZhRWNzUlVGQk1HbEhMRlZCUVRGcFJ5eEZRVUZ4YWtjc1ZVRkJjbXBITEVWQlFXZHJSeXhWUVVGb2EwY3NSVUZCTW10SExGVkJRVE5yUnl4RlFVRnpiRWNzVlVGQmRHeEhMRVZCUVdsdFJ5eFZRVUZxYlVjc1JVRkJORzFITEZWQlFUVnRSeXhGUVVGMWJrY3NWVUZCZG01SExFVkJRV3R2Unl4VlFVRnNiMGNzUlVGQk5tOUhMRlZCUVRkdlJ5eEZRVUYzY0Vjc1ZVRkJlSEJITEVWQlFXMXhSeXhWUVVGdWNVY3NSVUZCT0hGSExGVkJRVGx4Unl4RlFVRjVja2NzVlVGQmVuSkhMRVZCUVc5elJ5eFZRVUZ3YzBjc1JVRkJLM05ITEZWQlFTOXpSeXhGUVVFd2RFY3NWVUZCTVhSSE8wbEJRMklzUjBGQlFTeEhRVUZOTzBGQlEwNHNVMEZCUVN3MFEwRkJRVHM3VFVGRFNTeFRRVUZCTEVkQlFWa3NVMEZCVXl4RFFVRkRMRXRCUVZZc1EwRkJaMElzUTBGQmFFSXNSVUZCYlVJc1EwRkJia0k3VFVGRFdpeEpRVUZETEVOQlFVRXNWMEZCV1N4RFFVRkJMRk5CUVVFc1EwRkJZaXhIUVVFd1FpeEpRVUZKTEZsQlFVb3NRMEZCYVVJc1IwRkJha0lzUlVGQmMwSXNVMEZCZEVJN1RVRkRNVUlzU1VGQlF5eERRVUZCTEZWQlFWY3NRMEZCUVN4VFFVRkJMRU5CUVZvc1IwRkJlVUlzU1VGQlNTeGxRVUZLTEVOQlFXOUNMRWRCUVhCQ0xFVkJRWGxDTEZOQlFYcENPMDFCUTNwQ0xFbEJRVU1zUTBGQlFTeFpRVUZoTEVOQlFVRXNVMEZCUVN4RFFVRmtMRWRCUVRKQ0xFbEJRVWtzYVVKQlFVb3NRMEZCYzBJc1IwRkJkRUlzUlVGQk1rSXNVMEZCTTBJN1FVRktMMEk3UlVGSVVUczdjMEpCVlZvc1ZVRkJRU3hIUVVGWkxGTkJRVU1zU1VGQlJEdEJRVU5TTEZGQlFVRTdTVUZCUVN4VlFVRkJMRWRCUVdFN1NVRkRZaXhuUWtGQlFTeEhRVUZ0UWl4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeEpRVUZvUWl4RlFVRnpRaXhqUVVGMFFqdEpRVU51UWl4cFFrRkJRU3hIUVVGdlFpeEpRVUZETEVOQlFVRXNiVUpCUVVRc1EwRkJjVUlzU1VGQmNrSXNSVUZCTWtJc1owSkJRVE5DTzBsQlEzQkNMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEUxQlFVRXNSMEZCVFN4RFFVRkRMRWxCUVVNc1EwRkJRU3hqUVVGRUxFTkJRV2RDTEVsQlFVc3NRMEZCUVN4blFrRkJRU3hEUVVGclFpeERRVUZCTEVOQlFVRXNRMEZCZGtNc1EwRkJSQ3hEUVVGT0xFZEJRV3RFTEZOQlFXeEVMRWRCUVRKRUxHbENRVUV6UkN4SFFVRTJSU3hIUVVFNVJqdEJRVU5CTEZOQlFVRXNkMEpCUVVFN096dE5RVU5KTEZWQlFVRXNTVUZCWXl4SlFVRkRMRU5CUVVFc1ZVRkJSQ3hEUVVGWkxFbEJRVm9zUlVGQmEwSXNVVUZCYkVJc1JVRkJORUlzUzBGQk5VSXNSVUZCYlVNc1owSkJRVzVETzBGQlJHeENPMGxCUjBFc1ZVRkJRU3hKUVVGakxFbEJRVU1zUTBGQlFTeDNRa0ZCUkN4RFFVRXdRaXhKUVVFeFFqdEpRVU5rTEZWQlFVRXNTVUZCWXl4SlFVRkRMRU5CUVVFc1dVRkJSQ3hEUVVGakxFbEJRV1E3U1VGRFpDeFZRVUZCTEVkQlFXRXNTVUZCU1N4RFFVRkRMRWxCUVV3c1EwRkJWU3hWUVVGV08wbEJRMklzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc1RVRkJRU3hIUVVGUExGVkJRWGhDTzBGQlEwRXNWMEZCVHl4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExGZEJRV1lzUlVGQk5FSXNTVUZCTlVJc1JVRkJhME1zU1VGQmJFTTdSVUZhUXpzN2MwSkJZMW9zWjBKQlFVRXNSMEZCYTBJc1UwRkJReXhQUVVGRU8wRkJRMlFzVjBGQlR5eERRVUZETzBWQlJFMDdPM05DUVVkc1FpeFRRVUZCTEVkQlFWa3NVMEZCUXl4SlFVRkVMRVZCUVU4c1QwRkJVRHRCUVVOU0xGRkJRVUU3U1VGQlFTeExRVUZCTEVkQlFWRTdRVUZEVWl4WlFVRlBMRWxCUVZBN1FVRkJRU3hYUVVOVExHRkJSRlE3VVVGRlVTeExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMR2RDUVVGRUxFTkJRV3RDTEU5QlFXeENPMEZCUkZBN1FVRkVWQ3hYUVVkVExHbENRVWhVTzFGQlNWRXNTMEZCUVN4SFFVRlJPMEZCU21oQ08wbEJUVUVzU1VGQlJ5eEpRVUZCTEV0QlFWRXNWMEZCVWl4SlFVRjFRaXhKUVVGQkxFdEJRVkVzVlVGQmJFTTdUVUZEU1N4TFFVRkJMRWRCUVZFc1JVRkJRU3hIUVVGTExGRkJSR3BDT3p0QlFVVkJMRmRCUVU4N1JVRldRenM3YzBKQldWb3NaVUZCUVN4SFFVRnJRaXhUUVVGRExGTkJRVVE3UVVGRFpDeFJRVUZCTzBsQlFVRXNTVUZCYjBJc1QwRkJUeXhUUVVGUUxFdEJRWEZDTEZGQlFYcERPMEZCUVVFc1lVRkJUeXhWUVVGUU96dEpRVU5CTEVkQlFVRXNSMEZCVFN4VFFVRlRMRU5CUVVNc1YwRkJWaXhEUVVGQk8wRkJRMDRzVjBGQlR5eE5RVUZCTEVOQlFVOHNSMEZCVUR0RlFVaFBPenR6UWtGTGJFSXNZMEZCUVN4SFFVRnBRaXhUUVVGRExFbEJRVVFzUlVGQlR5eFBRVUZRTzBGQlEySXNVVUZCUVR0SlFVRkJMRTlCUVVFc1IwRkJWVHRCUVVOV0xGTkJRVUVzYzBSQlFVRTdPMDFCUTBrc1NVRkJSeXhIUVVGSkxFTkJRVUVzUTBGQlFTeERRVUZGTEVOQlFVTXNUMEZCVUN4RFFVRmxMRTlCUVdZc1EwRkJRU3hMUVVFMlFpeERRVUZETEVOQlFXcERPMUZCUTBrc1QwRkJRU3hIUVVGVk8wRkJRMVlzWTBGR1NqczdRVUZFU2p0QlFVbEJMRmRCUVU4N1JVRk9UVHM3YzBKQlVXcENMR2RDUVVGQkxFZEJRV3RDTEZOQlFVTXNUMEZCUkN4RlFVRlZMRWxCUVZZN1FVRkRaQ3hYUVVGUExFbEJRVWtzUTBGQlF5eEhRVUZNTEVOQlFWTXNRMEZCUVN4SFFVRkpMRWxCUVVvc1IwRkJWeXhKUVVGSkxFTkJRVU1zUjBGQlRDeERRVUZUTEU5QlFWUXNRMEZCY0VJN1JVRkVUenM3YzBKQlNXeENMRlZCUVVFc1IwRkJZU3hUUVVGRExFbEJRVVFzUlVGQlR5eEpRVUZRTEVWQlFXRXNUMEZCWWl4RlFVRnpRaXhuUWtGQmRFSTdRVUZEVkN4UlFVRkJPMGxCUVVFc1QwRkJRU3hIUVVGVkxFbEJRVU1zUTBGQlFTeGpRVUZFTEVOQlFXZENMRWxCUVdoQ0xFVkJRWE5DTEU5QlFYUkNPMGxCUTFZc1dVRkJRU3hIUVVGbE8wbEJRMllzVTBGQlFTeEhRVUZaTzBsQlExb3NVMEZCVXl4RFFVRkRMRWxCUVZZc1EwRkJaU3hKUVVGTExFTkJRVUVzVDBGQlFTeERRVUZUTEVOQlFVRXNRMEZCUVN4RFFVRTNRanRCUVVOQkxGTkJRV2xDTERSSFFVRnFRanROUVVOSkxFbEJRV0VzWjBOQlFXSTdRVUZCUVN4alFVRkJPenROUVVOQkxGTkJRVk1zUTBGQlF5eEpRVUZXTEVOQlFXVXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFVUXNRMEZCYVVJc1NVRkJTeXhEUVVGQkxFOUJRVUVzUTBGQlV5eERRVUZCTEZOQlFVRXNRMEZCTDBJc1EwRkJhRUlzUTBGQlpqdE5RVU5CTEZsQlFVRXNTVUZCWjBJc1NVRkJReXhEUVVGQkxHVkJRVVFzUTBGQmFVSXNTVUZCU3l4RFFVRkJMRTlCUVVFc1EwRkJVeXhEUVVGQkxGTkJRVUVzUTBGQkwwSXNRMEZCUVN4SFFVRTJReXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4SlFVRkxMRU5CUVVFc1owSkJRVUVzUTBGQmEwSXNRMEZCUVN4VFFVRkJMRU5CUVhoRExFTkJRVGRETEVkQlFXMUhPMEZCU0haSU8wbEJTVUVzWTBGQlFTeEhRVUZwUWl4WlFVRkJMRWRCUVdVN1NVRkRhRU1zUzBGQlFTeEhRVUZSTEVsQlFVTXNRMEZCUVN4VFFVRkVMRU5CUVZjc1NVRkJXQ3hGUVVGcFFpeGpRVUZxUWp0SlFVTlNMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEVWQlFVRXNSMEZCUnl4VFFVRndRanRKUVVOQkxGZEJRVmNzUTBGQlF5eEpRVUZhTEVOQlFXOUNMRmxCUVdFc1EwRkJRU3hKUVVGQkxFTkJRV1FzUjBGQmIwSXNUVUZCY0VJc1IwRkJlVUlzUTBGQlF5eGpRVUZqTEVOQlFVTXNUMEZCWml4RFFVRjFRaXhEUVVGMlFpeERRVUZFTEVOQlFYcENMRWRCUVc5RUxGTkJRWEJFTEVkQlFUUkVMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTRzUTBGQll5eERRVUZrTEVOQlFVUXNRMEZCTDBVN1FVRkRRU3hYUVVGUE8wVkJZa1U3TzNOQ1FXVmlMRzFDUVVGQkxFZEJRWE5DTEZOQlFVTXNTVUZCUkN4RlFVRlBMR2RDUVVGUU8wRkJRMnhDTEZGQlFVRTdTVUZCUVN4WFFVRkJMRWRCUVdNc1NVRkJTeXhEUVVGQkxHZENRVUZCTEVOQlFXbENMRU5CUVVNc1RVRkJka0lzUTBGQk9FSXNVMEZCUXl4RFFVRkVPMkZCUVUwc1EwRkJRU3hIUVVGSk8wbEJRVllzUTBGQk9VSTdTVUZEWkN4TlFVRkJMRWRCUVZNN1NVRkRWQ3hKUVVGSExGZEJRVmNzUTBGQlF5eE5RVUZhTEVkQlFYRkNMRzlDUVVGNFFqdE5RVU5KTEUxQlFVRXNSMEZCVXl4eFFrRkVZanRMUVVGQkxFMUJRVUU3VFVGSFNTeE5RVUZCTEVkQlFWTXNWMEZCVnl4RFFVRkRMRTlCU0hwQ096dEJRVWxCTEZkQlFVODdSVUZRVnpzN2MwSkJVM1JDTEdWQlFVRXNSMEZCYVVJc1UwRkJReXhKUVVGRUxFVkJRVThzU1VGQlVEdEJRVU5pTEZGQlFVRTdTVUZCUVN4TlFVRkJMRWRCUVZNc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCYUVJc1JVRkJjMElzU1VGQmRFSTdTVUZEVkN4TFFVRkJMRWRCUVZFc1NVRkJTeXhEUVVGQkxFMUJRVUVzUTBGQlR5eERRVUZETEUxQlFXSXNRMEZCYjBJc1UwRkJReXhEUVVGRU8yRkJRVTBzUTBGQlFTeEhRVUZKTzBsQlFWWXNRMEZCY0VJN1YwRkRVaXhMUVVGTExFTkJRVU1zUzBGQlRpeERRVUZaTEVOQlFWb3NSVUZCWlN4dlFrRkJaanRGUVVoaE96dHpRa0ZOYWtJc2QwSkJRVUVzUjBGQk1rSXNVMEZCUXl4SlFVRkVPMEZCUTNaQ0xGRkJRVUU3U1VGQlFTeEpRVUZETEVOQlFVRXNNRUpCUVVRc1EwRkJORUlzU1VGQk5VSTdTVUZEUVN4clFrRkJRU3hIUVVGeFFpeEpRVUZETEVOQlFVRXNaVUZCUkN4RFFVRnBRaXhKUVVGcVFpeEZRVUYxUWl4clFrRkJka0k3U1VGRGNrSXNWMEZCVnl4RFFVRkRMRWxCUVZvc1EwRkJhVUlzVVVGQlFTeEhRVUZSTEVOQlFVTXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzYTBKQlFXMUNMRU5CUVVFc2EwSkJRV3RDTEVOQlFVTXNUVUZCYmtJc1IwRkJORUlzUTBGQk5VSXNRMEZCYmtNc1EwRkJSQ3hEUVVGU0xFZEJRVFJGTEZOQlFUVkZMRWRCUVc5R0xFTkJRVU1zU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc2EwSkJRVzFDTEVOQlFVRXNRMEZCUVN4RFFVRnVReXhEUVVGRUxFTkJRWEpITzBsQlEwRXNhMEpCUVVFc1IwRkJjVUlzYTBKQlFXMUNMRU5CUVVFc1EwRkJRU3hEUVVGdVFpeEhRVUYzUWl4clFrRkJiVUlzUTBGQlFTeHJRa0ZCYTBJc1EwRkJReXhOUVVGdVFpeEhRVUUwUWl4RFFVRTFRanRKUVVOb1JTeGpRVUZCTEVkQlFXbENMRU5CUVVNc1NVRkJReXhEUVVGQkxHZENRVUZFTEVOQlFXdENMR3RDUVVGc1FpeEZRVUZ6UXl4cFFrRkJkRU1zUTBGQlFTeEhRVUV5UkN4RFFVRTFSQ3hEUVVGQkxFZEJRV2xGTzBsQlEyeEdMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRVzlDTEdsQ1FVRkVMRWRCUVcxQ0xHTkJRVzVDTEVkQlFXZERMRU5CUVVNc1kwRkJZeXhEUVVGRExFOUJRV1lzUTBGQmRVSXNRMEZCZGtJc1EwRkJSQ3hEUVVGb1F5eEhRVUV5UkN4SFFVRTVSVHRCUVVOQkxGZEJRVTg3UlVGUVowSTdPM05DUVZNelFpd3dRa0ZCUVN4SFFVRXlRaXhUUVVGRExFbEJRVVE3UVVGRGRrSXNVVUZCUVR0SlFVRkJMRTFCUVVFc1IwRkJVeXhKUVVGRExFTkJRVUVzWTBGQlJDeERRVUZuUWl4SlFVRm9RaXhGUVVGelFpd3lRa0ZCZEVJN1NVRkRWQ3haUVVGQkxFZEJRV1U3UVVGRFppeFRRVUZwUWl3MFIwRkJha0k3VFVGRFNTeFpRVUZaTEVOQlFVTXNTVUZCWWl4RFFVRnJRaXhKUVVGTExFTkJRVUVzVFVGQlFTeERRVUZSTEVOQlFVRXNVMEZCUVN4RFFVRXZRanRCUVVSS08xZEJSVUVzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYjBJc01rSkJRVVFzUjBGQk5rSXNSMEZCTjBJc1IwRkJaME1zV1VGQmJrUTdSVUZNZFVJN08zTkNRVkV6UWl4WlFVRkJMRWRCUVdVc1UwRkJReXhKUVVGRU8wRkJRMWdzVVVGQlFUdEpRVUZCTEZOQlFVRXNSMEZCV1N4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeEpRVUZvUWl4RlFVRnpRaXhQUVVGMFFqdEpRVU5hTEZGQlFVRXNSMEZCVnp0SlFVTllMRXRCUVVFc1IwRkJVVHRKUVVOU0xGRkJRVUVzUjBGQlZ6dEJRVU5ZTEZOQlFXZENMREJIUVVGb1FqdE5RVU5KTEVsQlFWa3NUMEZCVHl4SlFVRkxMRU5CUVVFc1UwRkJRU3hEUVVGWExFTkJRVUVzVVVGQlFTeERRVUYyUWl4TFFVRjFReXhSUVVGdVJEdEJRVUZCTEdsQ1FVRkJPenROUVVOQkxFZEJRVUVzUjBGQlRTeEpRVUZMTEVOQlFVRXNVMEZCUVN4RFFVRlhMRU5CUVVFc1VVRkJRVHROUVVOMFFpeFJRVUZSTEVOQlFVTXNTVUZCVkN4RFFVRmpMRWRCUVdRN1RVRkRRU3hIUVVGQkxFZEJRVTBzVFVGQlFTeERRVUZQTEVkQlFVY3NRMEZCUXl4UFFVRktMRU5CUVZrc1IwRkJXaXhGUVVGcFFpeEZRVUZxUWl4RFFVRlFPMDFCUTA0c1VVRkJRU3hKUVVGWk8wMUJRMW9zUzBGQlFUdEJRVTVLTzBsQlQwRXNWMEZCVnl4RFFVRkRMRWxCUVZvc1EwRkJhVUlzVFVGQlFTeEhRVUZQTEZGQlFYaENPMGxCUTBFc1ZVRkJRU3hIUVVGaExGRkJRVUVzUjBGQlZ6dEpRVU40UWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeFJRVUZCTEVkQlFWRXNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJXQ3hEUVVGdFFpeERRVUZ1UWl4RFFVRkVMRU5CUVhwQ08wRkJRMEVzVjBGQlR6dEZRV1pKT3p0elFrRnBRbVlzWTBGQlFTeEhRVUZwUWl4VFFVRkRMRTFCUVVRN1FVRkRZaXhYUVVGVExFTkJRVU1zUTBGQlF5eE5RVUZCTEVkQlFWTXNVMEZCVml4RFFVRnZRaXhEUVVGRExFOUJRWEpDTEVOQlFUWkNMRU5CUVRkQ0xFTkJRVVFzUTBGQlFTeEhRVUZwUXp0RlFVUTNRanM3T3pzN08wRkJSM0pDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBFdmVudE1hbmFnZXI7XG5cbkV2ZW50TWFuYWdlciA9IHtcbiAgc2VuZDogZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgdmFyIGV2ZW50O1xuICAgIGV2ZW50ID0gbmV3IGNjLkV2ZW50Q3VzdG9tKGV2ZW50TmFtZSk7XG4gICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgIGV2ZW50LnNldFVzZXJEYXRhKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gY2MuZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9LFxuICBsaXN0ZW46IGZ1bmN0aW9uKGV2ZW50TmFtZSwgbGlzdGVuRnVuYywgbm9kZU9yUHJpb3JpdHkpIHtcbiAgICB2YXIgY2NMaXN0ZW5lcjtcbiAgICBpZiAobm9kZU9yUHJpb3JpdHkgPT0gbnVsbCkge1xuICAgICAgbm9kZU9yUHJpb3JpdHkgPSAxO1xuICAgIH1cbiAgICBjY0xpc3RlbmVyID0gY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xuICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuQ1VTVE9NLFxuICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbkZ1bmMoZXZlbnQuZ2V0VXNlckRhdGEoKSwgZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoY2NMaXN0ZW5lciwgbm9kZU9yUHJpb3JpdHkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TWFuYWdlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WlhabGJuUXZRWEpyUlhabGJuUk5ZVzVoWjJWeUxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMlYyWlc1MEwwRnlhMFYyWlc1MFRXRnVZV2RsY2k1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlEwazdSVUZCUVN4SlFVRkJMRVZCUVUwc1UwRkJReXhUUVVGRUxFVkJRVmtzU1VGQldqdEJRVU5HTEZGQlFVRTdTVUZCUVN4TFFVRkJMRWRCUVZFc1NVRkJTU3hGUVVGRkxFTkJRVU1zVjBGQlVDeERRVUZ0UWl4VFFVRnVRanRKUVVOU0xFbEJRVWtzU1VGQlFTeExRVUZSTEVsQlFWbzdUVUZEU1N4TFFVRkxMRU5CUVVNc1YwRkJUaXhEUVVGclFpeEpRVUZzUWl4RlFVUktPenRYUVVWQkxFVkJRVVVzUTBGQlF5eFpRVUZaTEVOQlFVTXNZVUZCYUVJc1EwRkJPRUlzUzBGQk9VSTdSVUZLUlN4RFFVRk9PMFZCUzBFc1RVRkJRU3hGUVVGUkxGTkJRVU1zVTBGQlJDeEZRVUZaTEZWQlFWb3NSVUZCZDBJc1kwRkJlRUk3UVVGRFNpeFJRVUZCT3p0TlFVRkJMR2xDUVVGclFqczdTVUZEYkVJc1ZVRkJRU3hIUVVGaExFVkJRVVVzUTBGQlF5eGhRVUZoTEVOQlFVTXNUVUZCYWtJc1EwRkRWRHROUVVGQkxFdEJRVUVzUlVGQlR5eEZRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTFCUVhoQ08wMUJRMEVzVTBGQlFTeEZRVUZYTEZOQlJGZzdUVUZGUVN4UlFVRkJMRVZCUVZVc1UwRkJReXhMUVVGRU8wRkJRMDRzWlVGQlR5eFZRVUZCTEVOQlFWY3NTMEZCU3l4RFFVRkRMRmRCUVU0c1EwRkJRU3hEUVVGWUxFVkJRV2RETEV0QlFXaERPMDFCUkVRc1EwRkdWanRMUVVSVE8xZEJUV0lzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXl4WFFVRm9RaXhEUVVFMFFpeFZRVUUxUWl4RlFVRjNReXhqUVVGNFF6dEZRVkpKTEVOQlRGSTdPenRCUVdOS0xFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgRXZlbnROYW1lcztcblxuRXZlbnROYW1lcyA9IHtcbiAgR0FNRV9TVEFSVDogXCJnYW1lLnN0YXJ0XCIsXG4gIEdBTUVfRU5EOiBcImdhbWUuZW5kXCIsXG4gIEdBTUVfTkVYVF9MRVZFTDogXCJnYW1lLm5leHQubGV2ZWxcIixcbiAgR0FNRV9HRVRfUkVTVUxUOiBcImdhbWUuZ2V0LnJlc3VsdFwiLFxuICBHQU1FX0lOSVRfVEFCTEU6IFwiZ2FtZS5pbml0LnRhYmxlXCJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnROYW1lcztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WlhabGJuUXZRWEpyUlhabGJuUk9ZVzFsY3k1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OWxkbVZ1ZEM5QmNtdEZkbVZ1ZEU1aGJXVnpMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZEU1R0RlFVRkJMRlZCUVVFc1JVRkJhMElzV1VGQmJFSTdSVUZEUVN4UlFVRkJMRVZCUVd0Q0xGVkJSR3hDTzBWQlJVRXNaVUZCUVN4RlFVRnJRaXhwUWtGR2JFSTdSVUZKUVN4bFFVRkJMRVZCUVd0Q0xHbENRVXBzUWp0RlFVdEJMR1ZCUVVFc1JVRkJhMElzYVVKQlRHeENPenM3UVVGUFNpeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUo5XG4iLCJnbG9iYWwueWVhciA9IDY7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdloyeHZZbUZzVm1Gc2RXVXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WjJ4dlltRnNWbUZzZFdVdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFMUJRVTBzUTBGQlF5eEpRVUZRTEVkQlFXTWlmUT09XG4iLCJjYy5nYW1lLm9uU3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIEdhbWVMb2dpYywgZ2FtZURpYWxvZywgZ2FtZUxvZ2ljT2JqLCBzY2VuZU1hbmFnZXI7XG4gIGNjLnZpZXcuYWRqdXN0Vmlld1BvcnQodHJ1ZSk7XG4gIGNjLnZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUoMTEzNiwgNjQwLCBjYy5SZXNvbHV0aW9uUG9saWN5LlNIT1dfQUxMKTtcbiAgY2Mudmlldy5lbmFibGVBdXRvRnVsbFNjcmVlbihmYWxzZSk7XG4gIGNjLnZpZXcucmVzaXplV2l0aEJyb3dzZXJTaXplKHRydWUpO1xuICBjYy5CdWlsZGVyUmVhZGVyLnNldFJlc291cmNlUGF0aChcInJlcy9cIik7XG4gIHNjZW5lTWFuYWdlciA9IHJlcXVpcmUoXCIuL3Rvb2xzL0Fya1NjZW5lTWFuYWdlci5jb2ZmZWVcIik7XG4gIHNjZW5lTWFuYWdlci5pbml0KCk7XG4gIGdhbWVEaWFsb2cgPSByZXF1aXJlKCcuL2NjYlZpZXcvQXJrTWFpbkRpYWxvZy5jb2ZmZWUnKTtcbiAgc2NlbmVNYW5hZ2VyLmFkZExheWVyVG9TY2VuZShnYW1lRGlhbG9nKTtcbiAgR2FtZUxvZ2ljID0gcmVxdWlyZSgnLi9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUnKTtcbiAgZ2FtZUxvZ2ljT2JqID0gbmV3IEdhbWVMb2dpYygpO1xuICByZXR1cm4gZ2FtZUxvZ2ljT2JqLmluaXQoKTtcbn07XG5cbmNjLmdhbWUucnVuKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXRnBiaTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZkR0Z2ZDNVdmMzUjFaSGt2UVhKcllXUXZRWEpyWVdSSFlXMWxMM055WXk5dFlXbHVMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEU5QlFWSXNSMEZCYTBJc1UwRkJRVHRCUVVOa0xFMUJRVUU3UlVGQlFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMR05CUVZJc1EwRkJkVUlzU1VGQmRrSTdSVUZEUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExIVkNRVUZTTEVOQlFXZERMRWxCUVdoRExFVkJRWE5ETEVkQlFYUkRMRVZCUVRKRExFVkJRVVVzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhSUVVFdlJEdEZRVU5CTEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc2IwSkJRVklzUTBGQk5rSXNTMEZCTjBJN1JVRkRRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEhGQ1FVRlNMRU5CUVRoQ0xFbEJRVGxDTzBWQlEwRXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhsUVVGcVFpeERRVUZwUXl4TlFVRnFRenRGUVVWQkxGbEJRVUVzUjBGQlpTeFBRVUZCTEVOQlFWRXNaME5CUVZJN1JVRkRaaXhaUVVGWkxFTkJRVU1zU1VGQllpeERRVUZCTzBWQlJVRXNWVUZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3huUTBGQlVqdEZRVU5pTEZsQlFWa3NRMEZCUXl4bFFVRmlMRU5CUVRaQ0xGVkJRVGRDTzBWQlJVRXNVMEZCUVN4SFFVRlpMRTlCUVVFc1EwRkJVU3dyUWtGQlVqdEZRVU5hTEZsQlFVRXNSMEZCWlN4SlFVRkpMRk5CUVVvc1EwRkJRVHRUUVVObUxGbEJRVmtzUTBGQlF5eEpRVUZpTEVOQlFVRTdRVUZtWXpzN1FVRnJRbXhDTEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJVaXhEUVVGQkluMD1cbiIsInZhciBVc2VyRGF0YTtcblxuVXNlckRhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFVzZXJEYXRhKCkge1xuICAgIHRoaXMuX3Njb3JlID0gMDtcbiAgICB0aGlzLl9jb3VudCA9IDA7XG4gIH1cblxuICBVc2VyRGF0YS5wcm90b3R5cGUuc2V0U2NvcmUgPSBmdW5jdGlvbihfc2NvcmUpIHtcbiAgICB0aGlzLl9zY29yZSA9IF9zY29yZTtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuZ2V0U2NvcmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NvcmU7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLnNldENvdW50ID0gZnVuY3Rpb24oX2NvdW50KSB7XG4gICAgdGhpcy5fY291bnQgPSBfY291bnQ7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLmdldENvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50O1xuICB9O1xuXG4gIHJldHVybiBVc2VyRGF0YTtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyRGF0YTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRWEpyVlhObGNrUmhkR0V1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UVhKclZYTmxja1JoZEdFdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUU3TzBGQlFVMDdSVUZEVnl4clFrRkJRVHRKUVVOVUxFbEJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWVTdTVUZEVml4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVk8wVkJSa1E3TzNGQ1FVbGlMRkZCUVVFc1IwRkJWU3hUUVVGRExFMUJRVVE3U1VGQlF5eEpRVUZETEVOQlFVRXNVMEZCUkR0RlFVRkVPenR4UWtGRlZpeFJRVUZCTEVkQlFWVXNVMEZCUVR0WFFVRkhMRWxCUVVNc1EwRkJRVHRGUVVGS096dHhRa0ZGVml4UlFVRkJMRWRCUVZVc1UwRkJReXhOUVVGRU8wbEJRVU1zU1VGQlF5eERRVUZCTEZOQlFVUTdSVUZCUkRzN2NVSkJSVllzVVVGQlFTeEhRVUZWTEZOQlFVRTdWMEZCUnl4SlFVRkRMRU5CUVVFN1JVRkJTanM3T3pzN08wRkJSV1FzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiIsInZhciBCYWxhbmNlU2hlZXQsIFRhYmxlQmFzZSxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIGluZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuVGFibGVCYXNlID0gcmVxdWlyZShcIi4vVGFibGVCYXNlLmNvZmZlZVwiKTtcblxuQmFsYW5jZVNoZWV0ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhbGFuY2VTaGVldCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFsYW5jZVNoZWV0KCkge1xuICAgIHJldHVybiBCYWxhbmNlU2hlZXQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi96Y2Z6Yl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldENhc2hWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLotKfluIHotYTph5Eo5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5nZXRUb3RhbEFzc2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLotYTkuqfmgLvorqEo5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5fZ2V0Tm9OZWVkQ2FsY0l0ZW1zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtcIui1hOaWmVwiLCBcIuaKpeWRiuaXpeacn1wiXTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmR1bXBQZXJjZW50VGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXNzZXRzUGVyY2VudFRhYmxlLCBjZWxWYWx1ZSwgaSwgaW5kZXgsIGtleSwgbGVuLCBwZXJjZW50LCBwZXJjZW50VGFibGUsIHJlZiwgcmVmMSwgdG90YWxBc3NldHMsIHZhbHVlO1xuICAgIHRvdGFsQXNzZXRzID0gdGhpcy5nZXRUb3RhbEFzc2V0cygpO1xuICAgIGFzc2V0c1BlcmNlbnRUYWJsZSA9IFtdO1xuICAgIHJlZiA9IHRoaXMuX2RhdGE7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWx1ZSA9IHJlZltrZXldO1xuICAgICAgcGVyY2VudFRhYmxlID0gW2tleSArIFwiXFx0XFx0XFx0XFx0XFx0XCJdO1xuICAgICAgaWYgKHZhbHVlWzBdID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLl9nZXROb05lZWRDYWxjSXRlbXMoKSwga2V5KSA+PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVmMSA9IHRoaXMuZ2V0VmFsdWUodmFsdWUpO1xuICAgICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgICAgY2VsVmFsdWUgPSByZWYxW2luZGV4XTtcbiAgICAgICAgcGVyY2VudCA9IGNlbFZhbHVlIC8gdG90YWxBc3NldHNbaW5kZXhdICogMTAwO1xuICAgICAgICBwZXJjZW50VGFibGUucHVzaChwZXJjZW50LnRvRml4ZWQoMikpO1xuICAgICAgICBwZXJjZW50VGFibGUucHVzaChcIlxcdFxcdFxcdFxcdFwiKTtcbiAgICAgIH1cbiAgICAgIHBlcmNlbnRUYWJsZS5wdXNoKFwiXFxuXCIpO1xuICAgICAgYXNzZXRzUGVyY2VudFRhYmxlLnB1c2gocGVyY2VudFRhYmxlKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXNzZXRzUGVyY2VudFRhYmxlLCBudWxsLCBcIlxcdFwiKSk7XG4gICAgcmV0dXJuIGFzc2V0c1BlcmNlbnRUYWJsZTtcbiAgfTtcblxuICByZXR1cm4gQmFsYW5jZVNoZWV0O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGFuY2VTaGVldDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRbUZzWVc1alpWTm9aV1YwTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyMXZaR1ZzTDBKaGJHRnVZMlZUYUdWbGRDNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4MVFrRkJRVHRGUVVGQk96czdPMEZCUVVFc1UwRkJRU3hIUVVGaExFOUJRVUVzUTBGQlVTeHZRa0ZCVWpzN1FVRkhVRHM3T3pzN096dDVRa0ZEVEN4WFFVRkJMRWRCUVZrc1UwRkJRVHRYUVVOWUxFMUJRVUVzUjBGQlR5eEpRVUZETEVOQlFVRXNWVUZCVWl4SFFVRnRRaXhqUVVGdVFpeEhRVUZwUXl4SlFVRkRMRU5CUVVFc1ZVRkJiRU1zUjBGQk5rTTdSVUZFYkVNN08zbENRVWRhTEZsQlFVRXNSMEZCWXl4VFFVRkJPMWRCUVVjc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRlZCUVVFc1EwRkJha0k3UlVGQlNEczdlVUpCUldRc1kwRkJRU3hIUVVGblFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZWQlFVRXNRMEZCYWtJN1JVRkJTRHM3ZVVKQlJXaENMRzFDUVVGQkxFZEJRWEZDTEZOQlFVRTdWMEZCUnl4RFFVRkRMRWxCUVVRc1JVRkJUeXhOUVVGUU8wVkJRVWc3TzNsQ1FVVnlRaXhuUWtGQlFTeEhRVUZyUWl4VFFVRkJPMEZCUTJwQ0xGRkJRVUU3U1VGQlFTeFhRVUZCTEVkQlFXTXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJRVHRKUVVOa0xHdENRVUZCTEVkQlFYRkNPMEZCUTNKQ08wRkJRVUVzVTBGQlFTeFZRVUZCT3p0TlFVTkRMRmxCUVVFc1IwRkJaU3hEUVVGRExFZEJRVUVzUjBGQlRTeFpRVUZRTzAxQlEyWXNTVUZCV1N4TFFVRk5MRU5CUVVFc1EwRkJRU3hEUVVGT0xFdEJRVmtzUTBGQmVFSTdRVUZCUVN4cFFrRkJRVHM3VFVGRFFTeEpRVUZaTEdGQlFVOHNTVUZCUXl4RFFVRkJMRzFDUVVGRUxFTkJRVUVzUTBGQlVDeEZRVUZCTEVkQlFVRXNUVUZCV2p0QlFVRkJMR2xDUVVGQk96dEJRVU5CTzBGQlFVRXNWMEZCUVN4elJFRkJRVHM3VVVGRFF5eFBRVUZCTEVkQlFWVXNVVUZCUVN4SFFVRlhMRmRCUVZrc1EwRkJRU3hMUVVGQkxFTkJRWFpDTEVkQlFXZERPMUZCUXpGRExGbEJRVmtzUTBGQlF5eEpRVUZpTEVOQlFXdENMRTlCUVU4c1EwRkJReXhQUVVGU0xFTkJRV2RDTEVOQlFXaENMRU5CUVd4Q08xRkJRMEVzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCYTBJc1ZVRkJiRUk3UVVGSVJEdE5RVWxCTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVd0Q0xFbEJRV3hDTzAxQlEwRXNhMEpCUVd0Q0xFTkJRVU1zU1VGQmJrSXNRMEZCZDBJc1dVRkJlRUk3UVVGVVJEdEpRVlZCTEU5QlFVOHNRMEZCUXl4SFFVRlNMRU5CUVZrc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeHJRa0ZCWml4RlFVRnRReXhKUVVGdVF5eEZRVUY1UXl4SlFVRjZReXhEUVVGYU8wRkJRMEVzVjBGQlR6dEZRV1JWT3pzN08wZEJWbEU3TzBGQmVVSXpRaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlKOVxuIiwidmFyIENhc2hGbG93U3RhdGVtZW50LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChDYXNoRmxvd1N0YXRlbWVudCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQ2FzaEZsb3dTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIENhc2hGbG93U3RhdGVtZW50Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQ2FzaEZsb3dTdGF0ZW1lbnQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi94amxsYl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICByZXR1cm4gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbn0pKFRhYmxlQmFzZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRXNORUpCUVVFN1JVRkJRVHM3TzBGQlFVRXNVMEZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3h2UWtGQlVqczdRVUZGVURzN096czdPenM0UWtGRlRDeFhRVUZCTEVkQlFXRXNVMEZCUVR0WFFVTmFMRTFCUVVFc1IwRkJUeXhKUVVGRExFTkJRVUVzVlVGQlVpeEhRVUZ0UWl4alFVRnVRaXhIUVVGcFF5eEpRVUZETEVOQlFVRXNWVUZCYkVNc1IwRkJOa003UlVGRWFrTTdPenM3UjBGR2EwSTdPMEZCUzJoRExFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgUHJvZml0U3RhdGVtZW50LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5Qcm9maXRTdGF0ZW1lbnQgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUHJvZml0U3RhdGVtZW50LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQcm9maXRTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIFByb2ZpdFN0YXRlbWVudC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFByb2ZpdFN0YXRlbWVudC5wcm90b3R5cGUuZ2V0RmlsZVBhdGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJyZXMvXCIgKyB0aGlzLl9zdG9ja1R5cGUgKyBcIl9qc29uL2xyYl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICByZXR1cm4gUHJvZml0U3RhdGVtZW50O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpdFN0YXRlbWVudDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZVSEp2Wm1sMFUzUmhkR1Z0Wlc1MExtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMjF2WkdWc0wxQnliMlpwZEZOMFlYUmxiV1Z1ZEM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRU3d3UWtGQlFUdEZRVUZCT3pzN1FVRkJRU3hUUVVGQkxFZEJRV0VzVDBGQlFTeERRVUZSTEc5Q1FVRlNPenRCUVVWUU96czdPenM3T3pSQ1FVTk1MRmRCUVVFc1IwRkJZU3hUUVVGQk8xZEJRMW9zVFVGQlFTeEhRVUZQTEVsQlFVTXNRMEZCUVN4VlFVRlNMRWRCUVcxQ0xGbEJRVzVDTEVkQlFTdENMRWxCUVVNc1EwRkJRU3hWUVVGb1F5eEhRVUV5UXp0RlFVUXZRanM3T3p0SFFVUm5RanM3UVVGSk9VSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIFRhYmxlQmFzZTtcblxuVGFibGVCYXNlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUYWJsZUJhc2UoX3N0b2NrVHlwZSwgX3N0b2NrQ29kZSkge1xuICAgIHRoaXMuX3N0b2NrVHlwZSA9IF9zdG9ja1R5cGU7XG4gICAgdGhpcy5fc3RvY2tDb2RlID0gX3N0b2NrQ29kZTtcbiAgICB0aGlzLl9kYXRhID0gW107XG4gICAgdGhpcy5fbG9hZEpzb24oKTtcbiAgfVxuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0RmlsZVBhdGggPSBmdW5jdGlvbigpIHt9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2xvYWRKc29uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbGVQYXRoO1xuICAgIGZpbGVQYXRoID0gdGhpcy5nZXRGaWxlUGF0aCgpO1xuICAgIHJldHVybiBjYy5sb2FkZXIubG9hZEpzb24oZmlsZVBhdGgsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9nZXRTaG93TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgcmV0dXJuICgobnVtYmVyIC8gMTAwMDAwKS50b0ZpeGVkKDIpKSArIFwiIOS6v1wiO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0Rm9ybWF0TnVtYmVyVGFibGUgPSBmdW5jdGlvbihudW1iZXJUYWJsZSkge1xuICAgIHZhciBmb3JtYXRUYWJsZSwgaSwgbGVuLCBudW1iZXI7XG4gICAgZm9ybWF0VGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBudW1iZXJUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbnVtYmVyID0gbnVtYmVyVGFibGVbaV07XG4gICAgICBmb3JtYXRUYWJsZS5wdXNoKHRoaXMuX2dldFNob3dOdW1iZXIobnVtYmVyKSk7XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXRUYWJsZTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9nZXRZZWFyVmFsdWVJbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBpbmRleCwgaW5kZXhUYWJsZSwgbGVuLCByZWYsIHRpbWVTdHI7XG4gICAgaW5kZXhUYWJsZSA9IFtdO1xuICAgIHJlZiA9IHRoaXMuX2RhdGFbXCLmiqXlkYrml6XmnJ9cIl07XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuICAgICAgdGltZVN0ciA9IHJlZltpbmRleF07XG4gICAgICBpZiAodGltZVN0ci5pbmRleE9mKFwiMTItMzFcIikgIT09IC0xKSB7XG4gICAgICAgIGluZGV4VGFibGUucHVzaChpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleFRhYmxlO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2dldFZhbHVlTGVuZ3RoID0gZnVuY3Rpb24odmFsdWVMZW5ndGgpIHtcbiAgICB2YXIgbGVuZ3RoO1xuICAgIGlmICh2YWx1ZUxlbmd0aCA8IGdsb2JhbC55ZWFyKSB7XG4gICAgICBsZW5ndGggPSB2YWx1ZUxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gZ2xvYmFsLnllYXI7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGxlbiwgdmFsdWVUYWJsZSwgeWVhckluZGV4VGFibGU7XG4gICAgeWVhckluZGV4VGFibGUgPSB0aGlzLl9nZXRZZWFyVmFsdWVJbmRleCgpO1xuICAgIHZhbHVlVGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB5ZWFySW5kZXhUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaW5kZXggPSB5ZWFySW5kZXhUYWJsZVtpXTtcbiAgICAgIHZhbHVlVGFibGUucHVzaChkYXRhW2luZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVRhYmxlID0gdmFsdWVUYWJsZS5zbGljZSgwLCB0aGlzLl9nZXRWYWx1ZUxlbmd0aCh2YWx1ZVRhYmxlLmxlbmd0aCkpO1xuICB9O1xuXG4gIHJldHVybiBUYWJsZUJhc2U7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVCYXNlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlZHRmliR1ZDWVhObExtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMjF2WkdWc0wxUmhZbXhsUW1GelpTNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlEwRXNTVUZCUVRzN1FVRkJUVHRGUVVOUkxHMUNRVUZETEZWQlFVUXNSVUZCWXl4VlFVRmtPMGxCUVVNc1NVRkJReXhEUVVGQkxHRkJRVVE3U1VGQllTeEpRVUZETEVOQlFVRXNZVUZCUkR0SlFVTXhRaXhKUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZUTzBsQlExUXNTVUZCUXl4RFFVRkJMRk5CUVVRc1EwRkJRVHRGUVVaWk96dHpRa0ZKWWl4WFFVRkJMRWRCUVdFc1UwRkJRU3hIUVVGQk96dHpRa0ZGWWl4VFFVRkJMRWRCUVZjc1UwRkJRVHRCUVVOV0xGRkJRVUU3U1VGQlFTeFJRVUZCTEVkQlFWY3NTVUZCUXl4RFFVRkJMRmRCUVVRc1EwRkJRVHRYUVVOWUxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhSUVVGdVFpeEZRVUUyUWl4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdaVUZETlVJc1MwRkJReXhEUVVGQkxFdEJRVVFzUjBGQlV6dE5RVVJ0UWp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUVzUTBGQk4wSTdSVUZHVlRzN2MwSkJUVmdzWTBGQlFTeEhRVUZwUWl4VFFVRkRMRTFCUVVRN1FVRkRhRUlzVjBGQlV5eERRVUZETEVOQlFVTXNUVUZCUVN4SFFVRlRMRTFCUVZZc1EwRkJhVUlzUTBGQlF5eFBRVUZzUWl4RFFVRXdRaXhEUVVFeFFpeERRVUZFTEVOQlFVRXNSMEZCT0VJN1JVRkVka0k3TzNOQ1FVZHFRaXh2UWtGQlFTeEhRVUZ6UWl4VFFVRkRMRmRCUVVRN1FVRkRja0lzVVVGQlFUdEpRVUZCTEZkQlFVRXNSMEZCWXp0QlFVTmtMRk5CUVVFc05rTkJRVUU3TzAxQlEwTXNWMEZCVnl4RFFVRkRMRWxCUVZvc1EwRkJhVUlzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1RVRkJhRUlzUTBGQmFrSTdRVUZFUkR0QlFVVkJMRmRCUVU4N1JVRktZenM3YzBKQlRYUkNMR3RDUVVGQkxFZEJRVzlDTEZOQlFVRTdRVUZEYmtJc1VVRkJRVHRKUVVGQkxGVkJRVUVzUjBGQllUdEJRVU5pTzBGQlFVRXNVMEZCUVN4eFJFRkJRVHM3VFVGRFF5eEpRVUZITEU5QlFVOHNRMEZCUXl4UFFVRlNMRU5CUVdkQ0xFOUJRV2hDTEVOQlFVRXNTMEZCT0VJc1EwRkJReXhEUVVGc1F6dFJRVU5ETEZWQlFWVXNRMEZCUXl4SlFVRllMRU5CUVdkQ0xFdEJRV2hDTEVWQlJFUTdPMEZCUkVRN1FVRkhRU3hYUVVGUE8wVkJURms3TzNOQ1FVOXdRaXhsUVVGQkxFZEJRV2xDTEZOQlFVTXNWMEZCUkR0QlFVTm9RaXhSUVVGQk8wbEJRVUVzU1VGQlJ5eFhRVUZCTEVkQlFXTXNUVUZCVFN4RFFVRkRMRWxCUVhoQ08wMUJRME1zVFVGQlFTeEhRVUZUTEZsQlJGWTdTMEZCUVN4TlFVRkJPMDFCUjBNc1RVRkJRU3hIUVVGVExFMUJRVTBzUTBGQlF5eExRVWhxUWpzN1YwRkpRVHRGUVV4blFqczdjMEpCVDJwQ0xGRkJRVUVzUjBGQlZTeFRRVUZETEVsQlFVUTdRVUZEVkN4UlFVRkJPMGxCUVVFc1kwRkJRU3hIUVVGcFFpeEpRVUZETEVOQlFVRXNhMEpCUVVRc1EwRkJRVHRKUVVOcVFpeFZRVUZCTEVkQlFXRTdRVUZEWWl4VFFVRkJMR2RFUVVGQk96dE5RVU5ETEZWQlFWVXNRMEZCUXl4SlFVRllMRU5CUVdkQ0xFbEJRVXNzUTBGQlFTeExRVUZCTEVOQlFYSkNPMEZCUkVRN1YwRkhRU3hWUVVGQkxFZEJRV0VzVlVGQlZTeERRVUZETEV0QlFWZ3NRMEZCYVVJc1EwRkJha0lzUlVGQmIwSXNTVUZCUXl4RFFVRkJMR1ZCUVVRc1EwRkJhVUlzVlVGQlZTeERRVUZETEUxQlFUVkNMRU5CUVhCQ08wVkJUa283T3pzN096dEJRVkZZTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBMYXllck1hbmFnZXIsIExvYWRlcjtcblxuTGF5ZXJNYW5hZ2VyID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxheWVyU3RhY2sgPSBbXTtcbiAgICB0aGlzLnNjZW5lID0gbmV3IGNjLlNjZW5lKCk7XG4gICAgcmV0dXJuIGNjLmRpcmVjdG9yLnJ1blNjZW5lKHRoaXMuc2NlbmUpO1xuICB9LFxuICBjbGVhckxheWVyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5sZW5ndGggPSAwO1xuICB9LFxuICBhZGRMYXllclRvU2NlbmU6IGZ1bmN0aW9uKGNjYkxheWVyLCB6T3JkZXIpIHtcbiAgICB2YXIgbGF5b3V0LCBub2RlO1xuICAgIGlmICh6T3JkZXIgPT0gbnVsbCkge1xuICAgICAgek9yZGVyID0gMDtcbiAgICB9XG4gICAgbGF5b3V0ID0gbmV3IGNjdWkuTGF5b3V0KCk7XG4gICAgbGF5b3V0LnNldENvbnRlbnRTaXplKGNjLnNpemUoMTEzNiwgNjQwKSk7XG4gICAgbGF5b3V0LnNldFRvdWNoRW5hYmxlZCh0cnVlKTtcbiAgICBub2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICBub2RlLmFkZENoaWxkKGxheW91dCk7XG4gICAgbm9kZS5hZGRDaGlsZChjY2JMYXllcik7XG4gICAgdGhpcy5zY2VuZS5hZGRDaGlsZChub2RlLCB6T3JkZXIpO1xuICAgIHJldHVybiB0aGlzLmxheWVyU3RhY2sucHVzaChub2RlKTtcbiAgfSxcbiAgcmVtb3ZlVG9wTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0b3BMYXllcjtcbiAgICB0b3BMYXllciA9IHRoaXMubGF5ZXJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdGhpcy5zY2VuZS5yZW1vdmVDaGlsZCh0b3BMYXllciwgdHJ1ZSk7XG4gIH1cbn07XG5cbkxvYWRlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTG9hZGVyKGNjYkZpbGUxLCBjb250cm9sbGVyTmFtZTEpIHtcbiAgICB0aGlzLmNjYkZpbGUgPSBjY2JGaWxlMTtcbiAgICB0aGlzLmNvbnRyb2xsZXJOYW1lID0gY29udHJvbGxlck5hbWUxO1xuICB9XG5cbiAgTG9hZGVyLnByb3RvdHlwZS5zaG93RGlhbG9nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNjLkJ1aWxkZXJSZWFkZXIubG9hZCh0aGlzLmNjYkZpbGUpO1xuICB9O1xuXG4gIHJldHVybiBMb2FkZXI7XG5cbn0pKCk7XG5cbkxheWVyTWFuYWdlci5kZWZpbmVEaWFsb2cgPSBmdW5jdGlvbihjY2JGaWxlLCBjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckNsYXNzKSB7XG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBuZXcgY29udHJvbGxlckNsYXNzKCkpO1xuICByZXR1cm4gbmV3IExvYWRlcihjY2JGaWxlLCBjb250cm9sbGVyTmFtZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyTWFuYWdlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12ZEc5dmJITXZRWEpyVTJObGJtVk5ZVzVoWjJWeUxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMM1J2YjJ4ekwwRnlhMU5qWlc1bFRXRnVZV2RsY2k1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUTBFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlEwazdSVUZCUVN4SlFVRkJMRVZCUVUwc1UwRkJRVHRKUVVOR0xFbEJRVU1zUTBGQlFTeFZRVUZFTEVkQlFXTTdTVUZEWkN4SlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGVExFbEJRVWtzUlVGQlJTeERRVUZETEV0QlFWQXNRMEZCUVR0WFFVTlVMRVZCUVVVc1EwRkJReXhSUVVGUkxFTkJRVU1zVVVGQldpeERRVUZ4UWl4SlFVRkRMRU5CUVVFc1MwRkJkRUk3UlVGSVJTeERRVUZPTzBWQlMwRXNWVUZCUVN4RlFVRlpMRk5CUVVFN1NVRkRVaXhKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEdsQ1FVRlFMRU5CUVVFN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEUxQlFWb3NSMEZCY1VJN1JVRkdZaXhEUVV4YU8wVkJVMEVzWlVGQlFTeEZRVUZyUWl4VFFVRkRMRkZCUVVRc1JVRkJWeXhOUVVGWU8wRkJRMlFzVVVGQlFUczdUVUZFZVVJc1UwRkJVenM3U1VGRGJFTXNUVUZCUVN4SFFVRlRMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVlFzUTBGQlFUdEpRVU5VTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNTVUZCVWl4RlFVRmpMRWRCUVdRc1EwRkJkRUk3U1VGRFFTeE5RVUZOTEVOQlFVTXNaVUZCVUN4RFFVRjFRaXhKUVVGMlFqdEpRVVZCTEVsQlFVRXNSMEZCVFN4SlFVRkpMRVZCUVVVc1EwRkJReXhKUVVGUUxFTkJRVUU3U1VGRFRpeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRTFCUVdRN1NVRkRRU3hKUVVGSkxFTkJRVU1zVVVGQlRDeERRVUZqTEZGQlFXUTdTVUZGUVN4SlFVRkRMRU5CUVVFc1MwRkJTeXhEUVVGRExGRkJRVkFzUTBGQlowSXNTVUZCYUVJc1JVRkJjMElzVFVGQmRFSTdWMEZEUVN4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExFbEJRVm9zUTBGQmFVSXNTVUZCYWtJN1JVRldZeXhEUVZSc1FqdEZRWEZDUVN4alFVRkJMRVZCUVdkQ0xGTkJRVUU3UVVGRFdpeFJRVUZCTzBsQlFVRXNVVUZCUVN4SFFVRlhMRWxCUVVNc1EwRkJRU3hWUVVGVkxFTkJRVU1zUjBGQldpeERRVUZCTzFkQlExZ3NTVUZCUXl4RFFVRkJMRXRCUVVzc1EwRkJReXhYUVVGUUxFTkJRVzFDTEZGQlFXNUNMRVZCUVRaQ0xFbEJRVGRDTzBWQlJsa3NRMEZ5UW1oQ096czdRVUY1UWtVN1JVRkRWeXhuUWtGQlF5eFJRVUZFTEVWQlFWY3NaVUZCV0R0SlFVRkRMRWxCUVVNc1EwRkJRU3hWUVVGRU8wbEJRVlVzU1VGQlF5eERRVUZCTEdsQ1FVRkVPMFZCUVZnN08yMUNRVU5pTEZWQlFVRXNSMEZCWVN4VFFVRkJPMWRCUTFRc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhKUVVGRExFTkJRVUVzVDBGQmRrSTdSVUZFVXpzN096czdPMEZCUjJwQ0xGbEJRVmtzUTBGQlF5eFpRVUZpTEVkQlFUUkNMRk5CUVVNc1QwRkJSQ3hGUVVGVkxHTkJRVllzUlVGQk1FSXNaVUZCTVVJN1JVRkRlRUlzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGpRVVJLTEVWQlJVa3NTVUZCU1N4bFFVRktMRU5CUVVFc1EwRkdTanRUUVV0QkxFbEJRVWtzVFVGQlNpeERRVUZYTEU5QlFWZ3NSVUZCYjBJc1kwRkJjRUk3UVVGT2QwSTdPMEZCVVRWQ0xFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iXX0=
