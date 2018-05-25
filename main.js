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
        return typeof obj.callback === "function" ? obj.callback(_this._balanceObj["000858"].getCashValue()) : void 0;
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
  hasProp = {}.hasOwnProperty;

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
    return this.getYearValue(this._data["货币资金(万元)"]);
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

  TableBase.prototype.getYearValueIndex = function() {
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

  TableBase.prototype.getYearValue = function(data) {
    var i, index, len, valueTable, yearIndexTable;
    yearIndexTable = this.getYearValueIndex();
    valueTable = [];
    for (i = 0, len = yearIndexTable.length; i < len; i++) {
      index = yearIndexTable[i];
      valueTable.push(data[index]);
    }
    valueTable = valueTable.slice(0, this._getValueLength(valueTable.length));
    return this.getFormatNumberTable(valueTable);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9nbG9iYWxWYWx1ZS5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiLCJzcmMvbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlIiwic3JjL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUiLCJzcmMvbW9kZWwvQ2FzaEZsb3dTdGF0ZW1lbnQuY29mZmVlIiwic3JjL21vZGVsL1Byb2ZpdFN0YXRlbWVudC5jb2ZmZWUiLCJzcmMvbW9kZWwvVGFibGVCYXNlLmNvZmZlZSIsInNyYy90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2NsaWNrX3RpbWVzO1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5nX2NsaWNrX3RpbWVzID0gMDtcblxuQXJrTWFpbkRpYWxvZyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQXJrTWFpbkRpYWxvZygpIHt9XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25EaWRMb2FkRnJvbUNDQiA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2RhdFRhYmxlID0gW107XG4gICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMSk7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl9zdG9ja0NvZGVFZGl0Qm94KTtcbiAgICB0aGlzLl95ZWFyc0VkaXRCb3ggPSB0aGlzLl9jcmVhdGVFZGl0Qm94KHRoaXMuY2NiX3RleHRGaWVsZF8yKTtcbiAgICB0aGlzLnJvb3ROb2RlLmFkZENoaWxkKHRoaXMuX3llYXJzRWRpdEJveCk7XG4gICAgdGhpcy5faW5pdERhdGEoKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5faW5pdERhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LnNldFN0cmluZyhcIjAwMDAwMVwiKTtcbiAgICByZXR1cm4gdGhpcy5feWVhcnNFZGl0Qm94LnNldFN0cmluZyhcIjZcIik7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2NyZWF0ZUVkaXRCb3ggPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIGVkaXRCb3g7XG4gICAgZWRpdEJveCA9IG5ldyBjYy5FZGl0Qm94KGNjLnNpemUoMjAwLCA1MCkpO1xuICAgIGVkaXRCb3guc2V0UG9zaXRpb24obm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICBlZGl0Qm94LnNldElucHV0TW9kZShjYy5FRElUQk9YX0lOUFVUX01PREVfU0lOR0xFTElORSk7XG4gICAgZWRpdEJveC5zZXRSZXR1cm5UeXBlKGNjLktFWUJPQVJEX1JFVFVSTlRZUEVfRE9ORSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dEZsYWcoY2MuRURJVEJPWF9JTlBVVF9GTEFHX0lOSVRJQUxfQ0FQU19TRU5URU5DRSk7XG4gICAgZWRpdEJveC5zZXRNYXhMZW5ndGgoMTMpO1xuICAgIGVkaXRCb3guc2V0Rm9udChcIkFyaWFsXCIsIDI2KTtcbiAgICBlZGl0Qm94LnNldEZvbnRDb2xvcihjYy5jb2xvcigxMDAsIDEwMCwgMjU1LCAyNTUpKTtcbiAgICByZXR1cm4gZWRpdEJveDtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHRoaXMuY2NiX3Jlc3VsdC5zZXRTdHJpbmcocmVzdWx0KTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5vbkNhbGMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RvY2tDb2RlLCB5ZWFycztcbiAgICBzdG9ja0NvZGUgPSB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIHllYXJzID0gdGhpcy5feWVhcnNFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIHJldHVybiBjYy5sb2FkZXIubG9hZEpzb24oXCJyZXMvMzAwX2pzb24vXCIgKyBzdG9ja0NvZGUgKyBcIi5qc29uXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIF90aGlzLnNob3dSZXN1bHQoXCJcIik7XG4gICAgICAgIHJldHVybiBldmVudE1hbmFnZXIuc2VuZChldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwge1xuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgeWVhcnM6IHllYXJzLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zaG93UmVzdWx0KHN0cik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKFwiQXJrTWFpbkRpYWxvZ1wiLCBuZXcgQXJrTWFpbkRpYWxvZygpKTtcblxuICByZXR1cm4gQXJrTWFpbkRpYWxvZztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5CdWlsZGVyUmVhZGVyLmxvYWQoXCJyZXMvbWFpbi5jY2JpXCIpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMk5pVm1sbGR5OUJjbXROWVdsdVJHbGhiRzluTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyTmpZbFpwWlhjdlFYSnJUV0ZwYmtScFlXeHZaeTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUVdVc1QwRkJRU3hEUVVGUkxHbERRVUZTT3p0QlFVTm1MRlZCUVVFc1IwRkJZU3hQUVVGQkxFTkJRVkVzSzBKQlFWSTdPMEZCUldJc1lVRkJRU3hIUVVGblFqczdRVUZGVmpzN096QkNRVU5HTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVUU3U1VGRFpDeEpRVUZETEVOQlFVRXNVMEZCUkN4SFFVRmhPMWRCUTJJc1NVRkJReXhEUVVGQkxFbEJRVVFzUTBGQlFUdEZRVVpqT3pzd1FrRkpiRUlzU1VGQlFTeEhRVUZOTEZOQlFVRTdTVUZEUml4SlFVRkRMRU5CUVVFc2FVSkJRVVFzUjBGQmNVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTNKQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzYVVKQlFYQkNPMGxCUlVFc1NVRkJReXhEUVVGQkxHRkJRVVFzUjBGQmFVSXNTVUZCUXl4RFFVRkJMR05CUVVRc1EwRkJaMElzU1VGQlF5eERRVUZCTEdWQlFXcENPMGxCUTJwQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhKUVVGRExFTkJRVUVzWVVGQmNFSTdTVUZGUVN4SlFVRkRMRU5CUVVFc1UwRkJSQ3hEUVVGQk8wVkJVRVU3T3pCQ1FWVk9MRk5CUVVFc1IwRkJWeXhUUVVGQk8wbEJRMUFzU1VGQlF5eERRVUZCTEdsQ1FVRnBRaXhEUVVGRExGTkJRVzVDTEVOQlFUWkNMRkZCUVRkQ08xZEJRMEVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVhsQ0xFZEJRWHBDTzBWQlJrODdPekJDUVVsWUxHTkJRVUVzUjBGQlowSXNVMEZCUXl4SlFVRkVPMEZCUTFvc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZTeEpRVUZKTEVWQlFVVXNRMEZCUXl4UFFVRlFMRU5CUVdVc1JVRkJSU3hEUVVGRExFbEJRVWdzUTBGQlVTeEhRVUZTTEVWQlFXRXNSVUZCWWl4RFFVRm1PMGxCUTFZc1QwRkJUeXhEUVVGRExGZEJRVklzUTBGQmIwSXNTVUZCU1N4RFFVRkRMRmRCUVV3c1EwRkJRU3hEUVVGd1FqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5dzJRa0ZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zWVVGQlVpeERRVUZ6UWl4RlFVRkZMRU5CUVVNc2QwSkJRWHBDTzBsQlEwRXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzUlVGQlJTeERRVUZETEhkRFFVRjRRanRKUVVOQkxFOUJRVThzUTBGQlF5eFpRVUZTTEVOQlFYRkNMRVZCUVhKQ08wbEJRMEVzVDBGQlR5eERRVUZETEU5QlFWSXNRMEZCWjBJc1QwRkJhRUlzUlVGQmVVSXNSVUZCZWtJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRkZMRU5CUVVNc1MwRkJTQ3hEUVVGVExFZEJRVlFzUlVGQll5eEhRVUZrTEVWQlFXMUNMRWRCUVc1Q0xFVkJRWGRDTEVkQlFYaENMRU5CUVhKQ08wRkJRMEVzVjBGQlR6dEZRVlJMT3pzd1FrRlhhRUlzVlVGQlFTeEhRVUZaTEZOQlFVTXNUVUZCUkR0WFFVTlNMRWxCUVVNc1EwRkJRU3hWUVVGVkxFTkJRVU1zVTBGQldpeERRVUZ6UWl4TlFVRjBRanRGUVVSUk96c3dRa0ZIV2l4TlFVRkJMRWRCUVZFc1UwRkJRVHRCUVVOS0xGRkJRVUU3U1VGQlFTeFRRVUZCTEVkQlFWa3NTVUZCUXl4RFFVRkJMR2xDUVVGcFFpeERRVUZETEZOQlFXNUNMRU5CUVVFN1NVRkRXaXhMUVVGQkxFZEJRVkVzU1VGQlF5eERRVUZCTEdGQlFXRXNRMEZCUXl4VFFVRm1MRU5CUVVFN1YwRkRVaXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1pVRkJRU3hIUVVGblFpeFRRVUZvUWl4SFFVRXdRaXhQUVVFM1F5eEZRVUZ4UkN4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdVVUZEYWtRc1MwRkJReXhEUVVGQkxGVkJRVVFzUTBGQldTeEZRVUZhTzJWQlEwRXNXVUZCV1N4RFFVRkRMRWxCUVdJc1EwRkJhMElzVlVGQlZTeERRVUZETEdWQlFUZENMRVZCUTBrN1ZVRkJRU3hKUVVGQkxFVkJRVTBzU1VGQlRqdFZRVU5CTEV0QlFVRXNSVUZCVVN4TFFVUlNPMVZCUlVFc1VVRkJRU3hGUVVGVkxGTkJRVU1zUjBGQlJEdHRRa0ZEVGl4TFFVRkRMRU5CUVVFc1ZVRkJSQ3hEUVVGWkxFZEJRVm83VlVGRVRTeERRVVpXTzFOQlJFbzdUVUZHYVVRN1NVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTEVOQlFYSkVPMFZCU0VrN08wVkJZVklzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGxRVVJLTEVWQlJVa3NTVUZCU1N4aFFVRktMRU5CUVVFc1EwRkdTanM3T3pzN08wRkJTMG9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhsUVVGMFFpSjlcbiIsInZhciBBUktfTkVUX0FTU0VUUywgQVJLX1JFVEFJTl9QUk9GSVRTLCBBUktfUkVUQUlOX1BST0ZJVFNfQUREX1JBVEUsIEFSS19ST0UsIEJhbGFuY2VTaGVldCwgQ2FzaEZsb3dTdGF0ZW1lbnQsIEdhbWVMb2dpYywgUHJvZml0U3RhdGVtZW50LCBVc2VyRGF0YSwgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2xvZ190YWJsZSwgZ19tYXhTdGF0aXN0aWNzWWVhcnMsIGdfc3RhdGlzdGljc1llYXJzLCBuZWVkQ2FsY0l0ZW0sIHNjZW5lTWFuYWdlcixcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbkJhbGFuY2VTaGVldCA9IHJlcXVpcmUoJy4uL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUnKTtcblxuUHJvZml0U3RhdGVtZW50ID0gcmVxdWlyZSgnLi4vbW9kZWwvUHJvZml0U3RhdGVtZW50LmNvZmZlZScpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IHJlcXVpcmUoJy4uL21vZGVsL0Nhc2hGbG93U3RhdGVtZW50LmNvZmZlZScpO1xuXG5yZXF1aXJlKFwiLi4vZ2xvYmFsVmFsdWUuY29mZmVlXCIpO1xuXG5nX3N0YXRpc3RpY3NZZWFycyA9IDU7XG5cbmdfbWF4U3RhdGlzdGljc1llYXJzID0gNjtcblxubmVlZENhbGNJdGVtID0ge1xuICBcInJlY2VpdmFibGVzXCI6IFwi5bqU5pS26LSm5qy+KOWFgylcIixcbiAgXCJkZXBvc2l0UmVjZWl2ZWRcIjogXCLpooTmlLbotKbmrL4o5YWDKVwiLFxuICBcInNob3J0TG9hblwiOiBcIuefreacn+WAn+asvijlhYMpXCIsXG4gIFwibG9uZ0xvYW5cIjogXCLplb/mnJ/lgJ/mrL4o5YWDKVwiXG59O1xuXG5BUktfUkVUQUlOX1BST0ZJVFMgPSBcIuW9kuWxnuS6juavjeWFrOWPuOiCoeS4nOeahOe7vOWQiOaUtuebiuaAu+minSjlhYMpXCI7XG5cbkFSS19ORVRfQVNTRVRTID0gXCLlvZLlsZ7kuo7mr43lhazlj7jogqHkuJzmnYPnm4rlkIjorqEo5YWDKVwiO1xuXG5BUktfUk9FID0gXCLlh4DotYTkuqfmlLbnm4rnjodcIjtcblxuQVJLX1JFVEFJTl9QUk9GSVRTX0FERF9SQVRFID0gXCLlh4DliKnmtqblkIzmr5Tlop7plb/njodcIjtcblxuZ19sb2dfdGFibGUgPSBbXTtcblxuR2FtZUxvZ2ljID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBHYW1lTG9naWMoKSB7fVxuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2JhbGFuY2VPYmogPSB7fTtcbiAgICB0aGlzLl9wcm9maXRPYmogPSB7fTtcbiAgICB0aGlzLl9jYXNoRmxvd09iaiA9IHt9O1xuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRoaXMuX2luaXRUYWJsZSgpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5saXN0ZW4oZXZlbnROYW1lcy5HQU1FX0dFVF9SRVNVTFQsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iai5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gb2JqLmNhbGxiYWNrKF90aGlzLl9iYWxhbmNlT2JqW1wiMDAwODU4XCJdLmdldENhc2hWYWx1ZSgpKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2luaXRUYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkaXIsIGksIGxlbiwgc3RvY2tDb2RlLCBzdG9ja1RhYmxlO1xuICAgIHN0b2NrVGFibGUgPSBbXCJTWjAwMDAwMVwiLCBcIlNaMDAwMDAyXCIsIFwiU1owMDAwMDhcIiwgXCJTWjAwMDA2MFwiLCBcIlNaMDAwMDYzXCIsIFwiU1owMDAwNjlcIiwgXCJTWjAwMDEwMFwiLCBcIlNaMDAwMTU3XCIsIFwiU1owMDAxNjZcIiwgXCJTWjAwMDMzM1wiLCBcIlNaMDAwMzM4XCIsIFwiU1owMDA0MDJcIiwgXCJTWjAwMDQxM1wiLCBcIlNaMDAwNDE1XCIsIFwiU1owMDA0MjNcIiwgXCJTWjAwMDQyNVwiLCBcIlNaMDAwNTAzXCIsIFwiU1owMDA1MzhcIiwgXCJTWjAwMDU0MFwiLCBcIlNaMDAwNTU5XCIsIFwiU1owMDA1NjhcIiwgXCJTWjAwMDYyM1wiLCBcIlNaMDAwNjI1XCIsIFwiU1owMDA2MjdcIiwgXCJTWjAwMDYzMFwiLCBcIlNaMDAwNjUxXCIsIFwiU1owMDA2NzFcIiwgXCJTWjAwMDY4NlwiLCBcIlNaMDAwNzA5XCIsIFwiU1owMDA3MjNcIiwgXCJTWjAwMDcyNVwiLCBcIlNaMDAwNzI4XCIsIFwiU1owMDA3MzhcIiwgXCJTWjAwMDc1MFwiLCBcIlNaMDAwNzY4XCIsIFwiU1owMDA3NzZcIiwgXCJTWjAwMDc4M1wiLCBcIlNaMDAwNzkyXCIsIFwiU1owMDA4MjZcIiwgXCJTWjAwMDgzOVwiLCBcIlNaMDAwODU4XCIsIFwiU1owMDA4NzZcIiwgXCJTWjAwMDg5NVwiLCBcIlNaMDAwODk4XCIsIFwiU1owMDA5MzhcIiwgXCJTWjAwMDk1OVwiLCBcIlNaMDAwOTYxXCIsIFwiU1owMDA5NjNcIiwgXCJTWjAwMDk4M1wiLCBcIlNaMDAxOTc5XCIsIFwiU1owMDIwMDdcIiwgXCJTWjAwMjAwOFwiLCBcIlNaMDAyMDI0XCIsIFwiU1owMDIwMjdcIiwgXCJTWjAwMjA0NFwiLCBcIlNaMDAyMDY1XCIsIFwiU1owMDIwNzRcIiwgXCJTWjAwMjA4MVwiLCBcIlNaMDAyMTQyXCIsIFwiU1owMDIxNDZcIiwgXCJTWjAwMjE1M1wiLCBcIlNaMDAyMTc0XCIsIFwiU1owMDIyMDJcIiwgXCJTWjAwMjIzMFwiLCBcIlNaMDAyMjM2XCIsIFwiU1owMDIyNDFcIiwgXCJTWjAwMjI1MlwiLCBcIlNaMDAyMjkyXCIsIFwiU1owMDIyOTRcIiwgXCJTWjAwMjMwNFwiLCBcIlNaMDAyMzEwXCIsIFwiU1owMDIzNTJcIiwgXCJTWjAwMjM4NVwiLCBcIlNaMDAyNDExXCIsIFwiU1owMDI0MTVcIiwgXCJTWjAwMjQyNFwiLCBcIlNaMDAyNDI2XCIsIFwiU1owMDI0NTBcIiwgXCJTWjAwMjQ1NlwiLCBcIlNaMDAyNDYwXCIsIFwiU1owMDI0NjVcIiwgXCJTWjAwMjQ2NlwiLCBcIlNaMDAyNDY4XCIsIFwiU1owMDI0NzBcIiwgXCJTWjAwMjQ3NVwiLCBcIlNaMDAyNTAwXCIsIFwiU1owMDI1MDhcIiwgXCJTWjAwMjU1NVwiLCBcIlNaMDAyNTU4XCIsIFwiU1owMDI1NzJcIiwgXCJTWjAwMjU5NFwiLCBcIlNaMDAyNjAxXCIsIFwiU1owMDI2MDJcIiwgXCJTWjAwMjYwOFwiLCBcIlNaMDAyNjI0XCIsIFwiU1owMDI2NzNcIiwgXCJTWjAwMjcxNFwiLCBcIlNaMDAyNzM2XCIsIFwiU1owMDI3MzlcIiwgXCJTWjAwMjc5N1wiLCBcIlNaMDAyODMxXCIsIFwiU1owMDI4MzlcIiwgXCJTWjAwMjg0MVwiLCBcIlNaMzAwMDAzXCIsIFwiU1ozMDAwMTVcIiwgXCJTWjMwMDAxN1wiLCBcIlNaMzAwMDI0XCIsIFwiU1ozMDAwMjdcIiwgXCJTWjMwMDAzM1wiLCBcIlNaMzAwMDU5XCIsIFwiU1ozMDAwNzBcIiwgXCJTWjMwMDA3MlwiLCBcIlNaMzAwMTIyXCIsIFwiU1ozMDAxMjRcIiwgXCJTWjMwMDEzNlwiLCBcIlNaMzAwMTQ0XCIsIFwiU1ozMDAyNTFcIiwgXCJTWjMwMDMxNVwiLCBcIlNINjAwMDAwXCIsIFwiU0g2MDAwMDhcIiwgXCJTSDYwMDAwOVwiLCBcIlNINjAwMDEwXCIsIFwiU0g2MDAwMTFcIiwgXCJTSDYwMDAxNVwiLCBcIlNINjAwMDE2XCIsIFwiU0g2MDAwMThcIiwgXCJTSDYwMDAxOVwiLCBcIlNINjAwMDIxXCIsIFwiU0g2MDAwMjNcIiwgXCJTSDYwMDAyOFwiLCBcIlNINjAwMDI5XCIsIFwiU0g2MDAwMzBcIiwgXCJTSDYwMDAzMVwiLCBcIlNINjAwMDM2XCIsIFwiU0g2MDAwMzhcIiwgXCJTSDYwMDA0OFwiLCBcIlNINjAwMDUwXCIsIFwiU0g2MDAwNjFcIiwgXCJTSDYwMDA2NlwiLCBcIlNINjAwMDY4XCIsIFwiU0g2MDAwNzRcIiwgXCJTSDYwMDA4NVwiLCBcIlNINjAwMDg5XCIsIFwiU0g2MDAxMDBcIiwgXCJTSDYwMDEwNFwiLCBcIlNINjAwMTA5XCIsIFwiU0g2MDAxMTFcIiwgXCJTSDYwMDExNVwiLCBcIlNINjAwMTE4XCIsIFwiU0g2MDAxNTNcIiwgXCJTSDYwMDE1N1wiLCBcIlNINjAwMTcwXCIsIFwiU0g2MDAxNzdcIiwgXCJTSDYwMDE4OFwiLCBcIlNINjAwMTk2XCIsIFwiU0g2MDAyMDhcIiwgXCJTSDYwMDIxOVwiLCBcIlNINjAwMjIxXCIsIFwiU0g2MDAyMzNcIiwgXCJTSDYwMDI3MVwiLCBcIlNINjAwMjc2XCIsIFwiU0g2MDAyOTdcIiwgXCJTSDYwMDMwOVwiLCBcIlNINjAwMzMyXCIsIFwiU0g2MDAzNDBcIiwgXCJTSDYwMDM1MlwiLCBcIlNINjAwMzYyXCIsIFwiU0g2MDAzNjlcIiwgXCJTSDYwMDM3MlwiLCBcIlNINjAwMzczXCIsIFwiU0g2MDAzNzZcIiwgXCJTSDYwMDM4M1wiLCBcIlNINjAwMzkwXCIsIFwiU0g2MDA0MDZcIiwgXCJTSDYwMDQxNVwiLCBcIlNINjAwNDM2XCIsIFwiU0g2MDA0ODJcIiwgXCJTSDYwMDQ4NVwiLCBcIlNINjAwNDg5XCIsIFwiU0g2MDA0OThcIiwgXCJTSDYwMDUxOFwiLCBcIlNINjAwNTE5XCIsIFwiU0g2MDA1MjJcIiwgXCJTSDYwMDUzNVwiLCBcIlNINjAwNTQ3XCIsIFwiU0g2MDA1NDlcIiwgXCJTSDYwMDU3MFwiLCBcIlNINjAwNTgzXCIsIFwiU0g2MDA1ODVcIiwgXCJTSDYwMDU4OFwiLCBcIlNINjAwNjA2XCIsIFwiU0g2MDA2MzdcIiwgXCJTSDYwMDY0OVwiLCBcIlNINjAwNjYwXCIsIFwiU0g2MDA2NjNcIiwgXCJTSDYwMDY3NFwiLCBcIlNINjAwNjgyXCIsIFwiU0g2MDA2ODVcIiwgXCJTSDYwMDY4OFwiLCBcIlNINjAwNjkwXCIsIFwiU0g2MDA3MDNcIiwgXCJTSDYwMDcwNFwiLCBcIlNINjAwNzA1XCIsIFwiU0g2MDA3MzlcIiwgXCJTSDYwMDc0MVwiLCBcIlNINjAwNzk1XCIsIFwiU0g2MDA4MDRcIiwgXCJTSDYwMDgxNlwiLCBcIlNINjAwODIwXCIsIFwiU0g2MDA4MjdcIiwgXCJTSDYwMDgzN1wiLCBcIlNINjAwODcxXCIsIFwiU0g2MDA4ODZcIiwgXCJTSDYwMDg4N1wiLCBcIlNINjAwODkzXCIsIFwiU0g2MDA4OTVcIiwgXCJTSDYwMDkwMFwiLCBcIlNINjAwOTA5XCIsIFwiU0g2MDA5MTlcIiwgXCJTSDYwMDkyNlwiLCBcIlNINjAwOTU4XCIsIFwiU0g2MDA5NTlcIiwgXCJTSDYwMDk3N1wiLCBcIlNINjAwOTk5XCIsIFwiU0g2MDEwMDZcIiwgXCJTSDYwMTAwOVwiLCBcIlNINjAxMDEyXCIsIFwiU0g2MDEwMThcIiwgXCJTSDYwMTAyMVwiLCBcIlNINjAxMDg4XCIsIFwiU0g2MDEwOTlcIiwgXCJTSDYwMTExMVwiLCBcIlNINjAxMTE3XCIsIFwiU0g2MDExMThcIiwgXCJTSDYwMTE1NVwiLCBcIlNINjAxMTYzXCIsIFwiU0g2MDExNjZcIiwgXCJTSDYwMTE2OVwiLCBcIlNINjAxMTg2XCIsIFwiU0g2MDExOThcIiwgXCJTSDYwMTIxMVwiLCBcIlNINjAxMjEyXCIsIFwiU0g2MDEyMTZcIiwgXCJTSDYwMTIyNVwiLCBcIlNINjAxMjI4XCIsIFwiU0g2MDEyMjlcIiwgXCJTSDYwMTI4OFwiLCBcIlNINjAxMzE4XCIsIFwiU0g2MDEzMjhcIiwgXCJTSDYwMTMzM1wiLCBcIlNINjAxMzM2XCIsIFwiU0g2MDEzNzVcIiwgXCJTSDYwMTM3N1wiLCBcIlNINjAxMzkwXCIsIFwiU0g2MDEzOThcIiwgXCJTSDYwMTU1NVwiLCBcIlNINjAxNjAwXCIsIFwiU0g2MDE2MDFcIiwgXCJTSDYwMTYwN1wiLCBcIlNINjAxNjA4XCIsIFwiU0g2MDE2MTFcIiwgXCJTSDYwMTYxOFwiLCBcIlNINjAxNjI4XCIsIFwiU0g2MDE2MzNcIiwgXCJTSDYwMTY2OFwiLCBcIlNINjAxNjY5XCIsIFwiU0g2MDE2ODhcIiwgXCJTSDYwMTcxOFwiLCBcIlNINjAxNzI3XCIsIFwiU0g2MDE3NjZcIiwgXCJTSDYwMTc4OFwiLCBcIlNINjAxODAwXCIsIFwiU0g2MDE4MThcIiwgXCJTSDYwMTg1N1wiLCBcIlNINjAxODY2XCIsIFwiU0g2MDE4NzJcIiwgXCJTSDYwMTg3N1wiLCBcIlNINjAxODc4XCIsIFwiU0g2MDE4ODFcIiwgXCJTSDYwMTg4OFwiLCBcIlNINjAxODk4XCIsIFwiU0g2MDE4OTlcIiwgXCJTSDYwMTkwMVwiLCBcIlNINjAxOTE5XCIsIFwiU0g2MDE5MzNcIiwgXCJTSDYwMTkzOVwiLCBcIlNINjAxOTU4XCIsIFwiU0g2MDE5NjZcIiwgXCJTSDYwMTk4NVwiLCBcIlNINjAxOTg4XCIsIFwiU0g2MDE5ODlcIiwgXCJTSDYwMTk5MVwiLCBcIlNINjAxOTkyXCIsIFwiU0g2MDE5OTdcIiwgXCJTSDYwMTk5OFwiLCBcIlNINjAzMTYwXCIsIFwiU0g2MDM3OTlcIiwgXCJTSDYwMzgzM1wiLCBcIlNINjAzODU4XCIsIFwiU0g2MDM5OTNcIl07XG4gICAgZGlyID0gXCJoczMwMFwiO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHN0b2NrVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0b2NrQ29kZSA9IHN0b2NrVGFibGVbaV07XG4gICAgICBzdG9ja0NvZGUgPSBzdG9ja0NvZGUuc2xpY2UoMiwgOCk7XG4gICAgICB0aGlzLl9iYWxhbmNlT2JqW3N0b2NrQ29kZV0gPSBuZXcgQmFsYW5jZVNoZWV0KGRpciwgc3RvY2tDb2RlKTtcbiAgICAgIHRoaXMuX3Byb2ZpdE9ialtzdG9ja0NvZGVdID0gbmV3IFByb2ZpdFN0YXRlbWVudChkaXIsIHN0b2NrQ29kZSk7XG4gICAgICB0aGlzLl9jYXNoRmxvd09ialtzdG9ja0NvZGVdID0gbmV3IENhc2hGbG93U3RhdGVtZW50KGRpciwgc3RvY2tDb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0UmVzdWx0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBjYWxjSXRlbSwgdG90YWxBc3NldHNJbmRleCwgdG90YWxTY29yZSwgdmFsdWU7XG4gICAgdG90YWxTY29yZSA9IDA7XG4gICAgdG90YWxBc3NldHNJbmRleCA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgQVJLX05FVF9BU1NFVFMpO1xuICAgIGdfc3RhdGlzdGljc1llYXJzID0gdGhpcy5fZ2V0U3RhdGlzdGljc1llYXJzKGRhdGEsIHRvdGFsQXNzZXRzSW5kZXgpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCLmgLvotYTkuqcgXCIgKyAodGhpcy5fZ2V0U2hvd051bWJlcihkYXRhW3RvdGFsQXNzZXRzSW5kZXhdWzFdKSkgKyBcIiwg57uf6K6h5pe26Ze0OlwiICsgZ19zdGF0aXN0aWNzWWVhcnMgKyBcIuW5tFwiKTtcbiAgICBmb3IgKGNhbGNJdGVtIGluIG5lZWRDYWxjSXRlbSkge1xuICAgICAgaWYgKCFoYXNQcm9wLmNhbGwobmVlZENhbGNJdGVtLCBjYWxjSXRlbSkpIGNvbnRpbnVlO1xuICAgICAgdmFsdWUgPSBuZWVkQ2FsY0l0ZW1bY2FsY0l0ZW1dO1xuICAgICAgdG90YWxTY29yZSArPSB0aGlzLl9jYWxjU2NvcmUoZGF0YSwgY2FsY0l0ZW0sIHZhbHVlLCB0b3RhbEFzc2V0c0luZGV4KTtcbiAgICB9XG4gICAgdG90YWxTY29yZSArPSB0aGlzLl9nZXRSZXRhaW5lZFByb2ZpdHNTY29yZShkYXRhKTtcbiAgICB0b3RhbFNjb3JlICs9IHRoaXMuX2dldFJvZVNjb3JlKGRhdGEpO1xuICAgIHRvdGFsU2NvcmUgPSBNYXRoLmNlaWwodG90YWxTY29yZSk7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuaAu+WIhjogXCIgKyB0b3RhbFNjb3JlKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZ19sb2dfdGFibGUsIG51bGwsIFwiXFx0XCIpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJlY2VpdmVTY29yZSA9IGZ1bmN0aW9uKHBlcmNlbnQpIHtcbiAgICByZXR1cm4gLXBlcmNlbnQ7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0U2NvcmUgPSBmdW5jdGlvbih0eXBlLCBwZXJjZW50KSB7XG4gICAgdmFyIHNjb3JlO1xuICAgIHNjb3JlID0gMDtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJyZWNlaXZhYmxlc1wiOlxuICAgICAgICBzY29yZSA9IHRoaXMuX2dldFJlY2VpdmVTY29yZShwZXJjZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGVwb3NpdFJlY2VpdmVkXCI6XG4gICAgICAgIHNjb3JlID0gcGVyY2VudDtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09IFwic2hvcnRMb2FuXCIgfHwgdHlwZSA9PT0gXCJsb25nTG9hblwiKSB7XG4gICAgICBzY29yZSA9IDQwIC0gcGVyY2VudDtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFZhbGlkTnVtYmVyID0gZnVuY3Rpb24obnVtYmVyU3RyKSB7XG4gICAgdmFyIG51bTtcbiAgICBpZiAodHlwZW9mIG51bWJlclN0ciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0dXJuIG51bWJlclN0cjtcbiAgICB9XG4gICAgbnVtID0gbnVtYmVyU3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIE51bWJlcihudW0pO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFR5cGVSb3dOdW0gPSBmdW5jdGlvbihkYXRhLCB0eXBlU3RyKSB7XG4gICAgdmFyIGksIGluZGV4LCBsZW4sIHJvdywgdHlwZU51bTtcbiAgICB0eXBlTnVtID0gMDtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuICAgICAgcm93ID0gZGF0YVtpbmRleF07XG4gICAgICBpZiAocm93WzBdLmluZGV4T2YodHlwZVN0cikgIT09IC0xKSB7XG4gICAgICAgIHR5cGVOdW0gPSBpbmRleDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0eXBlTnVtO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldENvbXBvdW5kUmF0ZSA9IGZ1bmN0aW9uKGFkZFJhdGUsIHRpbWUpIHtcbiAgICByZXR1cm4gTWF0aC5leHAoMSAvIHRpbWUgKiBNYXRoLmxvZyhhZGRSYXRlKSk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fY2FsY1Njb3JlID0gZnVuY3Rpb24oZGF0YSwgdHlwZSwgdHlwZVN0ciwgdG90YWxBc3NldHNJbmRleCkge1xuICAgIHZhciBhdmVyYWdlUGVyY2VudCwgaSwgaW5mb1RhYmxlLCByZWYsIHNjb3JlLCB0b3RhbFBlcmNlbnQsIHR5cGVOdW0sIHllYXJJbmRleDtcbiAgICB0eXBlTnVtID0gdGhpcy5fZ2V0VHlwZVJvd051bShkYXRhLCB0eXBlU3RyKTtcbiAgICB0b3RhbFBlcmNlbnQgPSAwO1xuICAgIGluZm9UYWJsZSA9IFtdO1xuICAgIGluZm9UYWJsZS5wdXNoKGRhdGFbdHlwZU51bV1bMF0pO1xuICAgIGZvciAoeWVhckluZGV4ID0gaSA9IDEsIHJlZiA9IGdfc3RhdGlzdGljc1llYXJzOyAxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWY7IHllYXJJbmRleCA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICBpZiAoZGF0YVt0eXBlTnVtXVt5ZWFySW5kZXhdID09IG51bGwpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpbmZvVGFibGUucHVzaCh0aGlzLl9nZXRTaG93TnVtYmVyKHRoaXMuX2dldFZhbGlkTnVtYmVyKGRhdGFbdHlwZU51bV1beWVhckluZGV4XSkpKTtcbiAgICAgIHRvdGFsUGVyY2VudCArPSB0aGlzLl9nZXRWYWxpZE51bWJlcihkYXRhW3R5cGVOdW1dW3llYXJJbmRleF0pIC8gdGhpcy5fZ2V0VmFsaWROdW1iZXIoZGF0YVt0b3RhbEFzc2V0c0luZGV4XVt5ZWFySW5kZXhdKSAqIDEwMDtcbiAgICB9XG4gICAgYXZlcmFnZVBlcmNlbnQgPSB0b3RhbFBlcmNlbnQgLyBnX3N0YXRpc3RpY3NZZWFycztcbiAgICBzY29yZSA9IHRoaXMuX2dldFNjb3JlKHR5cGUsIGF2ZXJhZ2VQZXJjZW50KTtcbiAgICBnX2xvZ190YWJsZS5wdXNoKFwiXCIgKyBpbmZvVGFibGUpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2gobmVlZENhbGNJdGVtW3R5cGVdICsgXCIg5q+U5L6LOlwiICsgKGF2ZXJhZ2VQZXJjZW50LnRvRml4ZWQoMikpICsgXCIlLCDliIbmlbAgOlwiICsgKHNjb3JlLnRvRml4ZWQoMikpKTtcbiAgICByZXR1cm4gc2NvcmU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0U3RhdGlzdGljc1llYXJzID0gZnVuY3Rpb24oZGF0YSwgdG90YWxBc3NldHNJbmRleCkge1xuICAgIHZhciBsZW5ndGgsIHRvdGFsQXNzZXRzO1xuICAgIHRvdGFsQXNzZXRzID0gZGF0YVt0b3RhbEFzc2V0c0luZGV4XS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPiAwO1xuICAgIH0pO1xuICAgIGxlbmd0aCA9IDA7XG4gICAgaWYgKHRvdGFsQXNzZXRzLmxlbmd0aCA+IGdfbWF4U3RhdGlzdGljc1llYXJzKSB7XG4gICAgICBsZW5ndGggPSBnX21heFN0YXRpc3RpY3NZZWFycztcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG90YWxBc3NldHMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFRhYmxlQnlOYW1lID0gZnVuY3Rpb24oZGF0YSwgbmFtZSkge1xuICAgIHZhciByb3dOdW0sIHRhYmxlO1xuICAgIHJvd051bSA9IHRoaXMuX2dldFR5cGVSb3dOdW0oZGF0YSwgbmFtZSk7XG4gICAgdGFibGUgPSBkYXRhW3Jvd051bV0uZmlsdGVyKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhID4gMDtcbiAgICB9KTtcbiAgICByZXR1cm4gdGFibGUuc2xpY2UoMCwgZ19tYXhTdGF0aXN0aWNzWWVhcnMpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJldGFpbmVkUHJvZml0c1Njb3JlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBhZGRSZXRhaW5lZFByb2ZpdHMsIGFsbFJldGFpbmVkUHJvZml0cywgYXZlcmFnZVBlcmNlbnQ7XG4gICAgdGhpcy5fZ2V0UmV0YWluZWRQcm9maXRzQWRkUmF0ZShkYXRhKTtcbiAgICBhbGxSZXRhaW5lZFByb2ZpdHMgPSB0aGlzLl9nZXRUYWJsZUJ5TmFtZShkYXRhLCBBUktfUkVUQUlOX1BST0ZJVFMpO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goXCLliJ3lp4vlh4DliKnmtqbvvJpcIiArICh0aGlzLl9nZXRTaG93TnVtYmVyKGFsbFJldGFpbmVkUHJvZml0c1thbGxSZXRhaW5lZFByb2ZpdHMubGVuZ3RoIC0gMV0pKSArIFwiLOW9k+WJjeWHgOWIqea2pjpcIiArICh0aGlzLl9nZXRTaG93TnVtYmVyKGFsbFJldGFpbmVkUHJvZml0c1swXSkpKTtcbiAgICBhZGRSZXRhaW5lZFByb2ZpdHMgPSBhbGxSZXRhaW5lZFByb2ZpdHNbMF0gLyBhbGxSZXRhaW5lZFByb2ZpdHNbYWxsUmV0YWluZWRQcm9maXRzLmxlbmd0aCAtIDFdO1xuICAgIGF2ZXJhZ2VQZXJjZW50ID0gKHRoaXMuX2dldENvbXBvdW5kUmF0ZShhZGRSZXRhaW5lZFByb2ZpdHMsIGdfc3RhdGlzdGljc1llYXJzKSAtIDEpICogMTAwO1xuICAgIGdfbG9nX3RhYmxlLnB1c2goZ19zdGF0aXN0aWNzWWVhcnMgKyBcIuW5tCzlh4DliKnmtqblpI3lkIjlop7plb/pgJ/luqY6XCIgKyAoYXZlcmFnZVBlcmNlbnQudG9GaXhlZCgyKSkgKyBcIiVcIik7XG4gICAgcmV0dXJuIGF2ZXJhZ2VQZXJjZW50O1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJldGFpbmVkUHJvZml0c0FkZFJhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGksIHJhdGVBZGRUYWJsZSwgcmF0ZUluZGV4LCByZWYsIHJvd051bTtcbiAgICByb3dOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIEFSS19SRVRBSU5fUFJPRklUU19BRERfUkFURSk7XG4gICAgcmF0ZUFkZFRhYmxlID0gW107XG4gICAgZm9yIChyYXRlSW5kZXggPSBpID0gMSwgcmVmID0gZ19zdGF0aXN0aWNzWWVhcnM7IDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZjsgcmF0ZUluZGV4ID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIHJhdGVBZGRUYWJsZS5wdXNoKGRhdGFbcm93TnVtXVtyYXRlSW5kZXhdKTtcbiAgICB9XG4gICAgcmV0dXJuIGdfbG9nX3RhYmxlLnB1c2goQVJLX1JFVEFJTl9QUk9GSVRTX0FERF9SQVRFICsgXCI6XCIgKyByYXRlQWRkVGFibGUpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2dldFJvZVNjb3JlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBhdmVyYWdlUm9lLCBjb3VudCwgaSwgcmVmLCByb2UsIHJvZVJvd051bSwgcm9lVGFibGUsIHJvZVZhbHVlLCB0b3RhbFJvZTtcbiAgICByb2VSb3dOdW0gPSB0aGlzLl9nZXRUeXBlUm93TnVtKGRhdGEsIEFSS19ST0UpO1xuICAgIHRvdGFsUm9lID0gMDtcbiAgICBjb3VudCA9IDA7XG4gICAgcm9lVGFibGUgPSBbXTtcbiAgICBmb3IgKHJvZVZhbHVlID0gaSA9IDEsIHJlZiA9IGdfc3RhdGlzdGljc1llYXJzOyAxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWY7IHJvZVZhbHVlID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YVtyb2VSb3dOdW1dW3JvZVZhbHVlXSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJvZSA9IGRhdGFbcm9lUm93TnVtXVtyb2VWYWx1ZV07XG4gICAgICByb2VUYWJsZS5wdXNoKHJvZSk7XG4gICAgICByb2UgPSBOdW1iZXIocm9lLnJlcGxhY2UoXCIlXCIsIFwiXCIpKTtcbiAgICAgIHRvdGFsUm9lICs9IHJvZTtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICAgIGdfbG9nX3RhYmxlLnB1c2goXCJST0U6XCIgKyByb2VUYWJsZSk7XG4gICAgYXZlcmFnZVJvZSA9IHRvdGFsUm9lIC8gY291bnQ7XG4gICAgZ19sb2dfdGFibGUucHVzaChcIuW5s+Wdh1JPRTpcIiArIChhdmVyYWdlUm9lLnRvRml4ZWQoMikpKTtcbiAgICByZXR1cm4gYXZlcmFnZVJvZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRTaG93TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgcmV0dXJuICgobnVtYmVyIC8gMTAwMDAwMDAwKS50b0ZpeGVkKDIpKSArIFwiIOS6v1wiO1xuICB9O1xuXG4gIHJldHVybiBHYW1lTG9naWM7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxvZ2ljO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMjl1ZEhKdmJDOUJjbXRIWVcxbFRHOW5hV011WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyOXVkSEp2YkM5QmNtdEhZVzFsVEc5bmFXTXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFc01sQkJRVUU3UlVGQlFUczdRVUZCUVN4WlFVRkJMRWRCUVd0Q0xFOUJRVUVzUTBGQlVTeHBRMEZCVWpzN1FVRkRiRUlzV1VGQlFTeEhRVUZyUWl4UFFVRkJMRU5CUVZFc2FVTkJRVkk3TzBGQlEyeENMRlZCUVVFc1IwRkJhMElzVDBGQlFTeERRVUZSTEN0Q1FVRlNPenRCUVVOc1FpeFJRVUZCTEVkQlFXdENMRTlCUVVFc1EwRkJVU3cyUWtGQlVqczdRVUZGYkVJc1dVRkJRU3hIUVVGclFpeFBRVUZCTEVOQlFWRXNPRUpCUVZJN08wRkJRMnhDTEdWQlFVRXNSMEZCY1VJc1QwRkJRU3hEUVVGUkxHbERRVUZTT3p0QlFVTnlRaXhwUWtGQlFTeEhRVUYxUWl4UFFVRkJMRU5CUVZFc2JVTkJRVkk3TzBGQlJYWkNMRTlCUVVFc1EwRkJVU3gxUWtGQlVqczdRVUZGUVN4cFFrRkJRU3hIUVVGdlFqczdRVUZEY0VJc2IwSkJRVUVzUjBGQmRVSTdPMEZCUlhaQ0xGbEJRVUVzUjBGQlpUdEZRVU5ZTEdGQlFVRXNSVUZCWlN4VFFVUktPMFZCUlZnc2FVSkJRVUVzUlVGQmIwSXNVMEZHVkR0RlFVZFlMRmRCUVVFc1JVRkJZeXhUUVVoSU8wVkJTVmdzVlVGQlFTeEZRVUZoTEZOQlNrWTdPenRCUVU5bUxHdENRVUZCTEVkQlFYRkNPenRCUVVOeVFpeGpRVUZCTEVkQlFXdENPenRCUVVOc1FpeFBRVUZCTEVkQlFWVTdPMEZCUTFZc01rSkJRVUVzUjBGQk9FSTdPMEZCUlRsQ0xGZEJRVUVzUjBGQll6czdRVUZKVWpzN08zTkNRVU5HTEVsQlFVRXNSMEZCVFN4VFFVRkJPMGxCUTBZc1NVRkJReXhEUVVGQkxGZEJRVVFzUjBGQlpUdEpRVU5tTEVsQlFVTXNRMEZCUVN4VlFVRkVMRWRCUVdNN1NVRkRaQ3hKUVVGRExFTkJRVUVzV1VGQlJDeEhRVUZuUWp0SlFVTm9RaXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZCTzFkQlEwRXNTVUZCUXl4RFFVRkJMRlZCUVVRc1EwRkJRVHRGUVV4Rk96dHpRa0ZQVGl4bFFVRkJMRWRCUVdsQ0xGTkJRVUU3VjBGRllpeFpRVUZaTEVOQlFVTXNUVUZCWWl4RFFVRnZRaXhWUVVGVkxFTkJRVU1zWlVGQkwwSXNSVUZCWjBRc1EwRkJRU3hUUVVGQkxFdEJRVUU3WVVGQlFTeFRRVUZETEVkQlFVUTdiMFJCUXpWRExFZEJRVWNzUTBGQlF5eFRRVUZWTEV0QlFVTXNRMEZCUVN4WFFVRlpMRU5CUVVFc1VVRkJRU3hEUVVGVExFTkJRVU1zV1VGQmRrSXNRMEZCUVR0TlFVUTRRanRKUVVGQkxFTkJRVUVzUTBGQlFTeERRVUZCTEVsQlFVRXNRMEZCYUVRN1JVRkdZVHM3YzBKQlUycENMRlZCUVVFc1IwRkJXU3hUUVVGQk8wRkJRMUlzVVVGQlFUdEpRVUZCTEZWQlFVRXNSMEZCWVN4RFFVRkRMRlZCUVVRc1JVRkJXU3hWUVVGYUxFVkJRWFZDTEZWQlFYWkNMRVZCUVd0RExGVkJRV3hETEVWQlFUWkRMRlZCUVRkRExFVkJRWGRFTEZWQlFYaEVMRVZCUVcxRkxGVkJRVzVGTEVWQlFUaEZMRlZCUVRsRkxFVkJRWGxHTEZWQlFYcEdMRVZCUVc5SExGVkJRWEJITEVWQlFTdEhMRlZCUVM5SExFVkJRVEJJTEZWQlFURklMRVZCUVhGSkxGVkJRWEpKTEVWQlFXZEtMRlZCUVdoS0xFVkJRVEpLTEZWQlFUTktMRVZCUVhOTExGVkJRWFJMTEVWQlFXbE1MRlZCUVdwTUxFVkJRVFJNTEZWQlFUVk1MRVZCUVhWTkxGVkJRWFpOTEVWQlFXdE9MRlZCUVd4T0xFVkJRVFpPTEZWQlFUZE9MRVZCUVhkUExGVkJRWGhQTEVWQlFXMVFMRlZCUVc1UUxFVkJRVGhRTEZWQlFUbFFMRVZCUVhsUkxGVkJRWHBSTEVWQlFXOVNMRlZCUVhCU0xFVkJRU3RTTEZWQlFTOVNMRVZCUVRCVExGVkJRVEZUTEVWQlFYRlVMRlZCUVhKVUxFVkJRV2RWTEZWQlFXaFZMRVZCUVRKVkxGVkJRVE5WTEVWQlFYTldMRlZCUVhSV0xFVkJRV2xYTEZWQlFXcFhMRVZCUVRSWExGVkJRVFZYTEVWQlFYVllMRlZCUVhaWUxFVkJRV3RaTEZWQlFXeFpMRVZCUVRaWkxGVkJRVGRaTEVWQlFYZGFMRlZCUVhoYUxFVkJRVzFoTEZWQlFXNWhMRVZCUVRoaExGVkJRVGxoTEVWQlFYbGlMRlZCUVhwaUxFVkJRVzlqTEZWQlFYQmpMRVZCUVN0akxGVkJRUzlqTEVWQlFUQmtMRlZCUVRGa0xFVkJRWEZsTEZWQlFYSmxMRVZCUVdkbUxGVkJRV2htTEVWQlFUSm1MRlZCUVRObUxFVkJRWE5uUWl4VlFVRjBaMElzUlVGQmFXaENMRlZCUVdwb1FpeEZRVUUwYUVJc1ZVRkJOV2hDTEVWQlFYVnBRaXhWUVVGMmFVSXNSVUZCYTJwQ0xGVkJRV3hxUWl4RlFVRTJha0lzVlVGQk4ycENMRVZCUVhkclFpeFZRVUY0YTBJc1JVRkJiV3hDTEZWQlFXNXNRaXhGUVVFNGJFSXNWVUZCT1d4Q0xFVkJRWGx0UWl4VlFVRjZiVUlzUlVGQmIyNUNMRlZCUVhCdVFpeEZRVUVyYmtJc1ZVRkJMMjVDTEVWQlFUQnZRaXhWUVVFeGIwSXNSVUZCY1hCQ0xGVkJRWEp3UWl4RlFVRm5jVUlzVlVGQmFIRkNMRVZCUVRKeFFpeFZRVUV6Y1VJc1JVRkJjM0pDTEZWQlFYUnlRaXhGUVVGcGMwSXNWVUZCYW5OQ0xFVkJRVFJ6UWl4VlFVRTFjMElzUlVGQmRYUkNMRlZCUVhaMFFpeEZRVUZyZFVJc1ZVRkJiSFZDTEVWQlFUWjFRaXhWUVVFM2RVSXNSVUZCZDNaQ0xGVkJRWGgyUWl4RlFVRnRkMElzVlVGQmJuZENMRVZCUVRoM1FpeFZRVUU1ZDBJc1JVRkJlWGhDTEZWQlFYcDRRaXhGUVVGdmVVSXNWVUZCY0hsQ0xFVkJRU3Q1UWl4VlFVRXZlVUlzUlVGQk1IcENMRlZCUVRGNlFpeEZRVUZ4TUVJc1ZVRkJjakJDTEVWQlFXY3hRaXhWUVVGb01VSXNSVUZCTWpGQ0xGVkJRVE14UWl4RlFVRnpNa0lzVlVGQmRESkNMRVZCUVdrelFpeFZRVUZxTTBJc1JVRkJORE5DTEZWQlFUVXpRaXhGUVVGMU5FSXNWVUZCZGpSQ0xFVkJRV3MxUWl4VlFVRnNOVUlzUlVGQk5qVkNMRlZCUVRjMVFpeEZRVUYzTmtJc1ZVRkJlRFpDTEVWQlFXMDNRaXhWUVVGdU4wSXNSVUZCT0RkQ0xGVkJRVGszUWl4RlFVRjVPRUlzVlVGQmVqaENMRVZCUVc4NVFpeFZRVUZ3T1VJc1JVRkJLemxDTEZWQlFTODVRaXhGUVVFd0swSXNWVUZCTVN0Q0xFVkJRWEV2UWl4VlFVRnlMMElzUlVGQloyZERMRlZCUVdoblF5eEZRVUV5WjBNc1ZVRkJNMmRETEVWQlFYTm9ReXhWUVVGMGFFTXNSVUZCYVdsRExGVkJRV3BwUXl4RlFVRTBhVU1zVlVGQk5XbERMRVZCUVhWcVF5eFZRVUYyYWtNc1JVRkJhMnRETEZWQlFXeHJReXhGUVVFMmEwTXNWVUZCTjJ0RExFVkJRWGRzUXl4VlFVRjRiRU1zUlVGQmJXMURMRlZCUVc1dFF5eEZRVUU0YlVNc1ZVRkJPVzFETEVWQlFYbHVReXhWUVVGNmJrTXNSVUZCYjI5RExGVkJRWEJ2UXl4RlFVRXJiME1zVlVGQkwyOURMRVZCUVRCd1F5eFZRVUV4Y0VNc1JVRkJjWEZETEZWQlFYSnhReXhGUVVGbmNrTXNWVUZCYUhKRExFVkJRVEp5UXl4VlFVRXpja01zUlVGQmMzTkRMRlZCUVhSelF5eEZRVUZwZEVNc1ZVRkJhblJETEVWQlFUUjBReXhWUVVFMWRFTXNSVUZCZFhWRExGVkJRWFoxUXl4RlFVRnJka01zVlVGQmJIWkRMRVZCUVRaMlF5eFZRVUUzZGtNc1JVRkJkM2RETEZWQlFYaDNReXhGUVVGdGVFTXNWVUZCYm5oRExFVkJRVGg0UXl4VlFVRTVlRU1zUlVGQmVYbERMRlZCUVhwNVF5eEZRVUZ2ZWtNc1ZVRkJjSHBETEVWQlFTdDZReXhWUVVFdmVrTXNSVUZCTURCRExGVkJRVEV3UXl4RlFVRnhNVU1zVlVGQmNqRkRMRVZCUVdjeVF5eFZRVUZvTWtNc1JVRkJNakpETEZWQlFUTXlReXhGUVVGek0wTXNWVUZCZERORExFVkJRV2swUXl4VlFVRnFORU1zUlVGQk5EUkRMRlZCUVRVMFF5eEZRVUYxTlVNc1ZVRkJkalZETEVWQlFXczJReXhWUVVGc05rTXNSVUZCTmpaRExGVkJRVGMyUXl4RlFVRjNOME1zVlVGQmVEZERMRVZCUVcwNFF5eFZRVUZ1T0VNc1JVRkJPRGhETEZWQlFUazRReXhGUVVGNU9VTXNWVUZCZWpsRExFVkJRVzhyUXl4VlFVRndLME1zUlVGQkt5dERMRlZCUVM4clF5eEZRVUV3TDBNc1ZVRkJNUzlETEVWQlFYRm5SQ3hWUVVGeVowUXNSVUZCWjJoRUxGVkJRV2hvUkN4RlFVRXlhRVFzVlVGQk0yaEVMRVZCUVhOcFJDeFZRVUYwYVVRc1JVRkJhV3BFTEZWQlFXcHFSQ3hGUVVFMGFrUXNWVUZCTldwRUxFVkJRWFZyUkN4VlFVRjJhMFFzUlVGQmEyeEVMRlZCUVd4c1JDeEZRVUUyYkVRc1ZVRkJOMnhFTEVWQlFYZHRSQ3hWUVVGNGJVUXNSVUZCYlc1RUxGVkJRVzV1UkN4RlFVRTRia1FzVlVGQk9XNUVMRVZCUVhsdlJDeFZRVUY2YjBRc1JVRkJiM0JFTEZWQlFYQndSQ3hGUVVFcmNFUXNWVUZCTDNCRUxFVkJRVEJ4UkN4VlFVRXhjVVFzUlVGQmNYSkVMRlZCUVhKeVJDeEZRVUZuYzBRc1ZVRkJhSE5FTEVWQlFUSnpSQ3hWUVVFemMwUXNSVUZCYzNSRUxGVkJRWFIwUkN4RlFVRnBkVVFzVlVGQmFuVkVMRVZCUVRSMVJDeFZRVUUxZFVRc1JVRkJkWFpFTEZWQlFYWjJSQ3hGUVVGcmQwUXNWVUZCYkhkRUxFVkJRVFozUkN4VlFVRTNkMFFzUlVGQmQzaEVMRlZCUVhoNFJDeEZRVUZ0ZVVRc1ZVRkJibmxFTEVWQlFUaDVSQ3hWUVVFNWVVUXNSVUZCZVhwRUxGVkJRWHA2UkN4RlFVRnZNRVFzVlVGQmNEQkVMRVZCUVNzd1JDeFZRVUV2TUVRc1JVRkJNREZFTEZWQlFURXhSQ3hGUVVGeE1rUXNWVUZCY2pKRUxFVkJRV2N6UkN4VlFVRm9NMFFzUlVGQk1qTkVMRlZCUVRNelJDeEZRVUZ6TkVRc1ZVRkJkRFJFTEVWQlFXazFSQ3hWUVVGcU5VUXNSVUZCTkRWRUxGVkJRVFUxUkN4RlFVRjFOa1FzVlVGQmRqWkVMRVZCUVdzM1JDeFZRVUZzTjBRc1JVRkJOamRFTEZWQlFUYzNSQ3hGUVVGM09FUXNWVUZCZURoRUxFVkJRVzA1UkN4VlFVRnVPVVFzUlVGQk9EbEVMRlZCUVRrNVJDeEZRVUY1SzBRc1ZVRkJlaXRFTEVWQlFXOHZSQ3hWUVVGd0wwUXNSVUZCS3k5RUxGVkJRUzh2UkN4RlFVRXdaMFVzVlVGQk1XZEZMRVZCUVhGb1JTeFZRVUZ5YUVVc1JVRkJaMmxGTEZWQlFXaHBSU3hGUVVFeWFVVXNWVUZCTTJsRkxFVkJRWE5xUlN4VlFVRjBha1VzUlVGQmFXdEZMRlZCUVdwclJTeEZRVUUwYTBVc1ZVRkJOV3RGTEVWQlFYVnNSU3hWUVVGMmJFVXNSVUZCYTIxRkxGVkJRV3h0UlN4RlFVRTJiVVVzVlVGQk4yMUZMRVZCUVhkdVJTeFZRVUY0YmtVc1JVRkJiVzlGTEZWQlFXNXZSU3hGUVVFNGIwVXNWVUZCT1c5RkxFVkJRWGx3UlN4VlFVRjZjRVVzUlVGQmIzRkZMRlZCUVhCeFJTeEZRVUVyY1VVc1ZVRkJMM0ZGTEVWQlFUQnlSU3hWUVVFeGNrVXNSVUZCY1hORkxGVkJRWEp6UlN4RlFVRm5kRVVzVlVGQmFIUkZMRVZCUVRKMFJTeFZRVUV6ZEVVc1JVRkJjM1ZGTEZWQlFYUjFSU3hGUVVGcGRrVXNWVUZCYW5aRkxFVkJRVFIyUlN4VlFVRTFka1VzUlVGQmRYZEZMRlZCUVhaM1JTeEZRVUZyZUVVc1ZVRkJiSGhGTEVWQlFUWjRSU3hWUVVFM2VFVXNSVUZCZDNsRkxGVkJRWGg1UlN4RlFVRnRla1VzVlVGQmJucEZMRVZCUVRoNlJTeFZRVUU1ZWtVc1JVRkJlVEJGTEZWQlFYb3dSU3hGUVVGdk1VVXNWVUZCY0RGRkxFVkJRU3N4UlN4VlFVRXZNVVVzUlVGQk1ESkZMRlZCUVRFeVJTeEZRVUZ4TTBVc1ZVRkJjak5GTEVWQlFXYzBSU3hWUVVGb05FVXNSVUZCTWpSRkxGVkJRVE0wUlN4RlFVRnpOVVVzVlVGQmREVkZMRVZCUVdrMlJTeFZRVUZxTmtVc1JVRkJORFpGTEZWQlFUVTJSU3hGUVVGMU4wVXNWVUZCZGpkRkxFVkJRV3M0UlN4VlFVRnNPRVVzUlVGQk5qaEZMRlZCUVRjNFJTeEZRVUYzT1VVc1ZVRkJlRGxGTEVWQlFXMHJSU3hWUVVGdUswVXNSVUZCT0N0RkxGVkJRVGtyUlN4RlFVRjVMMFVzVlVGQmVpOUZMRVZCUVc5blJpeFZRVUZ3WjBZc1JVRkJLMmRHTEZWQlFTOW5SaXhGUVVFd2FFWXNWVUZCTVdoR0xFVkJRWEZwUml4VlFVRnlhVVlzUlVGQloycEdMRlZCUVdocVJpeEZRVUV5YWtZc1ZVRkJNMnBHTEVWQlFYTnJSaXhWUVVGMGEwWXNSVUZCYVd4R0xGVkJRV3BzUml4RlFVRTBiRVlzVlVGQk5XeEdMRVZCUVhWdFJpeFZRVUYyYlVZc1JVRkJhMjVHTEZWQlFXeHVSaXhGUVVFMmJrWXNWVUZCTjI1R0xFVkJRWGR2Uml4VlFVRjRiMFlzUlVGQmJYQkdMRlZCUVc1d1JpeEZRVUU0Y0VZc1ZVRkJPWEJHTEVWQlFYbHhSaXhWUVVGNmNVWXNSVUZCYjNKR0xGVkJRWEJ5Uml4RlFVRXJja1lzVlVGQkwzSkdMRVZCUVRCelJpeFZRVUV4YzBZc1JVRkJjWFJHTEZWQlFYSjBSaXhGUVVGbmRVWXNWVUZCYUhWR0xFVkJRVEoxUml4VlFVRXpkVVlzUlVGQmMzWkdMRlZCUVhSMlJpeEZRVUZwZDBZc1ZVRkJhbmRHTEVWQlFUUjNSaXhWUVVFMWQwWXNSVUZCZFhoR0xGVkJRWFo0Uml4RlFVRnJlVVlzVlVGQmJIbEdMRVZCUVRaNVJpeFZRVUUzZVVZc1JVRkJkM3BHTEZWQlFYaDZSaXhGUVVGdE1FWXNWVUZCYmpCR0xFVkJRVGd3Uml4VlFVRTVNRVlzUlVGQmVURkdMRlZCUVhveFJpeEZRVUZ2TWtZc1ZVRkJjREpHTEVWQlFTc3lSaXhWUVVFdk1rWXNSVUZCTUROR0xGVkJRVEV6Uml4RlFVRnhORVlzVlVGQmNqUkdMRVZCUVdjMVJpeFZRVUZvTlVZc1JVRkJNalZHTEZWQlFUTTFSaXhGUVVGek5rWXNWVUZCZERaR0xFVkJRV2szUml4VlFVRnFOMFlzUlVGQk5EZEdMRlZCUVRVM1JpeEZRVUYxT0VZc1ZVRkJkamhHTEVWQlFXczVSaXhWUVVGc09VWXNSVUZCTmpsR0xGVkJRVGM1Uml4RlFVRjNLMFlzVlVGQmVDdEdMRVZCUVcwdlJpeFZRVUZ1TDBZc1JVRkJPQzlHTEZWQlFUa3ZSaXhGUVVGNVowY3NWVUZCZW1kSExFVkJRVzlvUnl4VlFVRndhRWNzUlVGQksyaEhMRlZCUVM5b1J5eEZRVUV3YVVjc1ZVRkJNV2xITEVWQlFYRnFSeXhWUVVGeWFrY3NSVUZCWjJ0SExGVkJRV2hyUnl4RlFVRXlhMGNzVlVGQk0ydEhMRVZCUVhOc1J5eFZRVUYwYkVjc1JVRkJhVzFITEZWQlFXcHRSeXhGUVVFMGJVY3NWVUZCTlcxSExFVkJRWFZ1Unl4VlFVRjJia2NzUlVGQmEyOUhMRlZCUVd4dlJ5eEZRVUUyYjBjc1ZVRkJOMjlITEVWQlFYZHdSeXhWUVVGNGNFY3NSVUZCYlhGSExGVkJRVzV4Unl4RlFVRTRjVWNzVlVGQk9YRkhMRVZCUVhseVJ5eFZRVUY2Y2tjc1JVRkJiM05ITEZWQlFYQnpSeXhGUVVFcmMwY3NWVUZCTDNOSExFVkJRVEIwUnl4VlFVRXhkRWM3U1VGRFlpeEhRVUZCTEVkQlFVMDdRVUZEVGl4VFFVRkJMRFJEUVVGQk96dE5RVU5KTEZOQlFVRXNSMEZCV1N4VFFVRlRMRU5CUVVNc1MwRkJWaXhEUVVGblFpeERRVUZvUWl4RlFVRnRRaXhEUVVGdVFqdE5RVU5hTEVsQlFVTXNRMEZCUVN4WFFVRlpMRU5CUVVFc1UwRkJRU3hEUVVGaUxFZEJRVEJDTEVsQlFVa3NXVUZCU2l4RFFVRnBRaXhIUVVGcVFpeEZRVUZ6UWl4VFFVRjBRanROUVVNeFFpeEpRVUZETEVOQlFVRXNWVUZCVnl4RFFVRkJMRk5CUVVFc1EwRkJXaXhIUVVGNVFpeEpRVUZKTEdWQlFVb3NRMEZCYjBJc1IwRkJjRUlzUlVGQmVVSXNVMEZCZWtJN1RVRkRla0lzU1VGQlF5eERRVUZCTEZsQlFXRXNRMEZCUVN4VFFVRkJMRU5CUVdRc1IwRkJNa0lzU1VGQlNTeHBRa0ZCU2l4RFFVRnpRaXhIUVVGMFFpeEZRVUV5UWl4VFFVRXpRanRCUVVvdlFqdEZRVWhST3p0elFrRlZXaXhWUVVGQkxFZEJRVmtzVTBGQlF5eEpRVUZFTzBGQlExSXNVVUZCUVR0SlFVRkJMRlZCUVVFc1IwRkJZVHRKUVVOaUxHZENRVUZCTEVkQlFXMUNMRWxCUVVNc1EwRkJRU3hqUVVGRUxFTkJRV2RDTEVsQlFXaENMRVZCUVhOQ0xHTkJRWFJDTzBsQlEyNUNMR2xDUVVGQkxFZEJRVzlDTEVsQlFVTXNRMEZCUVN4dFFrRkJSQ3hEUVVGeFFpeEpRVUZ5UWl4RlFVRXlRaXhuUWtGQk0wSTdTVUZEY0VJc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmFVSXNUVUZCUVN4SFFVRk5MRU5CUVVNc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCU3l4RFFVRkJMR2RDUVVGQkxFTkJRV3RDTEVOQlFVRXNRMEZCUVN4RFFVRjJReXhEUVVGRUxFTkJRVTRzUjBGQmEwUXNVMEZCYkVRc1IwRkJNa1FzYVVKQlFUTkVMRWRCUVRaRkxFZEJRVGxHTzBGQlEwRXNVMEZCUVN4M1FrRkJRVHM3TzAxQlEwa3NWVUZCUVN4SlFVRmpMRWxCUVVNc1EwRkJRU3hWUVVGRUxFTkJRVmtzU1VGQldpeEZRVUZyUWl4UlFVRnNRaXhGUVVFMFFpeExRVUUxUWl4RlFVRnRReXhuUWtGQmJrTTdRVUZFYkVJN1NVRkhRU3hWUVVGQkxFbEJRV01zU1VGQlF5eERRVUZCTEhkQ1FVRkVMRU5CUVRCQ0xFbEJRVEZDTzBsQlEyUXNWVUZCUVN4SlFVRmpMRWxCUVVNc1EwRkJRU3haUVVGRUxFTkJRV01zU1VGQlpEdEpRVU5rTEZWQlFVRXNSMEZCWVN4SlFVRkpMRU5CUVVNc1NVRkJUQ3hEUVVGVkxGVkJRVlk3U1VGRFlpeFhRVUZYTEVOQlFVTXNTVUZCV2l4RFFVRnBRaXhOUVVGQkxFZEJRVThzVlVGQmVFSTdRVUZEUVN4WFFVRlBMRWxCUVVrc1EwRkJReXhUUVVGTUxFTkJRV1VzVjBGQlppeEZRVUUwUWl4SlFVRTFRaXhGUVVGclF5eEpRVUZzUXp0RlFWcERPenR6UWtGaldpeG5Ra0ZCUVN4SFFVRnJRaXhUUVVGRExFOUJRVVE3UVVGRFpDeFhRVUZQTEVOQlFVTTdSVUZFVFRzN2MwSkJSMnhDTEZOQlFVRXNSMEZCV1N4VFFVRkRMRWxCUVVRc1JVRkJUeXhQUVVGUU8wRkJRMUlzVVVGQlFUdEpRVUZCTEV0QlFVRXNSMEZCVVR0QlFVTlNMRmxCUVU4c1NVRkJVRHRCUVVGQkxGZEJRMU1zWVVGRVZEdFJRVVZSTEV0QlFVRXNSMEZCVVN4SlFVRkRMRU5CUVVFc1owSkJRVVFzUTBGQmEwSXNUMEZCYkVJN1FVRkVVRHRCUVVSVUxGZEJSMU1zYVVKQlNGUTdVVUZKVVN4TFFVRkJMRWRCUVZFN1FVRkthRUk3U1VGTlFTeEpRVUZITEVsQlFVRXNTMEZCVVN4WFFVRlNMRWxCUVhWQ0xFbEJRVUVzUzBGQlVTeFZRVUZzUXp0TlFVTkpMRXRCUVVFc1IwRkJVU3hGUVVGQkxFZEJRVXNzVVVGRWFrSTdPMEZCUlVFc1YwRkJUenRGUVZaRE96dHpRa0ZaV2l4bFFVRkJMRWRCUVd0Q0xGTkJRVU1zVTBGQlJEdEJRVU5rTEZGQlFVRTdTVUZCUVN4SlFVRnZRaXhQUVVGUExGTkJRVkFzUzBGQmNVSXNVVUZCZWtNN1FVRkJRU3hoUVVGUExGVkJRVkE3TzBsQlEwRXNSMEZCUVN4SFFVRk5MRk5CUVZNc1EwRkJReXhYUVVGV0xFTkJRVUU3UVVGRFRpeFhRVUZQTEUxQlFVRXNRMEZCVHl4SFFVRlFPMFZCU0U4N08zTkNRVXRzUWl4alFVRkJMRWRCUVdsQ0xGTkJRVU1zU1VGQlJDeEZRVUZQTEU5QlFWQTdRVUZEWWl4UlFVRkJPMGxCUVVFc1QwRkJRU3hIUVVGVk8wRkJRMVlzVTBGQlFTeHpSRUZCUVRzN1RVRkRTU3hKUVVGSExFZEJRVWtzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4UFFVRlFMRU5CUVdVc1QwRkJaaXhEUVVGQkxFdEJRVFpDTEVOQlFVTXNRMEZCYWtNN1VVRkRTU3hQUVVGQkxFZEJRVlU3UVVGRFZpeGpRVVpLT3p0QlFVUktPMEZCU1VFc1YwRkJUenRGUVU1Tk96dHpRa0ZSYWtJc1owSkJRVUVzUjBGQmEwSXNVMEZCUXl4UFFVRkVMRVZCUVZVc1NVRkJWanRCUVVOa0xGZEJRVThzU1VGQlNTeERRVUZETEVkQlFVd3NRMEZCVXl4RFFVRkJMRWRCUVVrc1NVRkJTaXhIUVVGWExFbEJRVWtzUTBGQlF5eEhRVUZNTEVOQlFWTXNUMEZCVkN4RFFVRndRanRGUVVSUE96dHpRa0ZKYkVJc1ZVRkJRU3hIUVVGaExGTkJRVU1zU1VGQlJDeEZRVUZQTEVsQlFWQXNSVUZCWVN4UFFVRmlMRVZCUVhOQ0xHZENRVUYwUWp0QlFVTlVMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNUMEZCZEVJN1NVRkRWaXhaUVVGQkxFZEJRV1U3U1VGRFppeFRRVUZCTEVkQlFWazdTVUZEV2l4VFFVRlRMRU5CUVVNc1NVRkJWaXhEUVVGbExFbEJRVXNzUTBGQlFTeFBRVUZCTEVOQlFWTXNRMEZCUVN4RFFVRkJMRU5CUVRkQ08wRkJRMEVzVTBGQmFVSXNORWRCUVdwQ08wMUJRMGtzU1VGQllTeG5RMEZCWWp0QlFVRkJMR05CUVVFN08wMUJRMEVzVTBGQlV5eERRVUZETEVsQlFWWXNRMEZCWlN4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeEpRVUZETEVOQlFVRXNaVUZCUkN4RFFVRnBRaXhKUVVGTExFTkJRVUVzVDBGQlFTeERRVUZUTEVOQlFVRXNVMEZCUVN4RFFVRXZRaXhEUVVGb1FpeERRVUZtTzAxQlEwRXNXVUZCUVN4SlFVRm5RaXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4SlFVRkxMRU5CUVVFc1QwRkJRU3hEUVVGVExFTkJRVUVzVTBGQlFTeERRVUV2UWl4RFFVRkJMRWRCUVRaRExFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFXbENMRWxCUVVzc1EwRkJRU3huUWtGQlFTeERRVUZyUWl4RFFVRkJMRk5CUVVFc1EwRkJlRU1zUTBGQk4wTXNSMEZCYlVjN1FVRklka2c3U1VGSlFTeGpRVUZCTEVkQlFXbENMRmxCUVVFc1IwRkJaVHRKUVVOb1F5eExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMRk5CUVVRc1EwRkJWeXhKUVVGWUxFVkJRV2xDTEdOQlFXcENPMGxCUTFJc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmFVSXNSVUZCUVN4SFFVRkhMRk5CUVhCQ08wbEJRMEVzVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYjBJc1dVRkJZU3hEUVVGQkxFbEJRVUVzUTBGQlpDeEhRVUZ2UWl4TlFVRndRaXhIUVVGNVFpeERRVUZETEdOQlFXTXNRMEZCUXl4UFFVRm1MRU5CUVhWQ0xFTkJRWFpDTEVOQlFVUXNRMEZCZWtJc1IwRkJiMFFzVTBGQmNFUXNSMEZCTkVRc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlRpeERRVUZqTEVOQlFXUXNRMEZCUkN4RFFVRXZSVHRCUVVOQkxGZEJRVTg3UlVGaVJUczdjMEpCWldJc2JVSkJRVUVzUjBGQmMwSXNVMEZCUXl4SlFVRkVMRVZCUVU4c1owSkJRVkE3UVVGRGJFSXNVVUZCUVR0SlFVRkJMRmRCUVVFc1IwRkJZeXhKUVVGTExFTkJRVUVzWjBKQlFVRXNRMEZCYVVJc1EwRkJReXhOUVVGMlFpeERRVUU0UWl4VFFVRkRMRU5CUVVRN1lVRkJUU3hEUVVGQkxFZEJRVWs3U1VGQlZpeERRVUU1UWp0SlFVTmtMRTFCUVVFc1IwRkJVenRKUVVOVUxFbEJRVWNzVjBGQlZ5eERRVUZETEUxQlFWb3NSMEZCY1VJc2IwSkJRWGhDTzAxQlEwa3NUVUZCUVN4SFFVRlRMSEZDUVVSaU8wdEJRVUVzVFVGQlFUdE5RVWRKTEUxQlFVRXNSMEZCVXl4WFFVRlhMRU5CUVVNc1QwRklla0k3TzBGQlNVRXNWMEZCVHp0RlFWQlhPenR6UWtGVGRFSXNaVUZCUVN4SFFVRnBRaXhUUVVGRExFbEJRVVFzUlVGQlR5eEpRVUZRTzBGQlEySXNVVUZCUVR0SlFVRkJMRTFCUVVFc1IwRkJVeXhKUVVGRExFTkJRVUVzWTBGQlJDeERRVUZuUWl4SlFVRm9RaXhGUVVGelFpeEpRVUYwUWp0SlFVTlVMRXRCUVVFc1IwRkJVU3hKUVVGTExFTkJRVUVzVFVGQlFTeERRVUZQTEVOQlFVTXNUVUZCWWl4RFFVRnZRaXhUUVVGRExFTkJRVVE3WVVGQlRTeERRVUZCTEVkQlFVazdTVUZCVml4RFFVRndRanRYUVVOU0xFdEJRVXNzUTBGQlF5eExRVUZPTEVOQlFWa3NRMEZCV2l4RlFVRmxMRzlDUVVGbU8wVkJTR0U3TzNOQ1FVMXFRaXgzUWtGQlFTeEhRVUV5UWl4VFFVRkRMRWxCUVVRN1FVRkRka0lzVVVGQlFUdEpRVUZCTEVsQlFVTXNRMEZCUVN3d1FrRkJSQ3hEUVVFMFFpeEpRVUUxUWp0SlFVTkJMR3RDUVVGQkxFZEJRWEZDTEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVdsQ0xFbEJRV3BDTEVWQlFYVkNMR3RDUVVGMlFqdEpRVU55UWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeFJRVUZCTEVkQlFWRXNRMEZCUXl4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeHJRa0ZCYlVJc1EwRkJRU3hyUWtGQmEwSXNRMEZCUXl4TlFVRnVRaXhIUVVFMFFpeERRVUUxUWl4RFFVRnVReXhEUVVGRUxFTkJRVklzUjBGQk5FVXNVMEZCTlVVc1IwRkJiMFlzUTBGQlF5eEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRm5RaXhyUWtGQmJVSXNRMEZCUVN4RFFVRkJMRU5CUVc1RExFTkJRVVFzUTBGQmNrYzdTVUZEUVN4clFrRkJRU3hIUVVGeFFpeHJRa0ZCYlVJc1EwRkJRU3hEUVVGQkxFTkJRVzVDTEVkQlFYZENMR3RDUVVGdFFpeERRVUZCTEd0Q1FVRnJRaXhEUVVGRExFMUJRVzVDTEVkQlFUUkNMRU5CUVRWQ08wbEJRMmhGTEdOQlFVRXNSMEZCYVVJc1EwRkJReXhKUVVGRExFTkJRVUVzWjBKQlFVUXNRMEZCYTBJc2EwSkJRV3hDTEVWQlFYTkRMR2xDUVVGMFF5eERRVUZCTEVkQlFUSkVMRU5CUVRWRUxFTkJRVUVzUjBGQmFVVTdTVUZEYkVZc1YwRkJWeXhEUVVGRExFbEJRVm9zUTBGQmIwSXNhVUpCUVVRc1IwRkJiVUlzWTBGQmJrSXNSMEZCWjBNc1EwRkJReXhqUVVGakxFTkJRVU1zVDBGQlppeERRVUYxUWl4RFFVRjJRaXhEUVVGRUxFTkJRV2hETEVkQlFUSkVMRWRCUVRsRk8wRkJRMEVzVjBGQlR6dEZRVkJuUWpzN2MwSkJVek5DTERCQ1FVRkJMRWRCUVRKQ0xGTkJRVU1zU1VGQlJEdEJRVU4yUWl4UlFVRkJPMGxCUVVFc1RVRkJRU3hIUVVGVExFbEJRVU1zUTBGQlFTeGpRVUZFTEVOQlFXZENMRWxCUVdoQ0xFVkJRWE5DTERKQ1FVRjBRanRKUVVOVUxGbEJRVUVzUjBGQlpUdEJRVU5tTEZOQlFXbENMRFJIUVVGcVFqdE5RVU5KTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVd0Q0xFbEJRVXNzUTBGQlFTeE5RVUZCTEVOQlFWRXNRMEZCUVN4VFFVRkJMRU5CUVM5Q08wRkJSRW83VjBGRlFTeFhRVUZYTEVOQlFVTXNTVUZCV2l4RFFVRnZRaXd5UWtGQlJDeEhRVUUyUWl4SFFVRTNRaXhIUVVGblF5eFpRVUZ1UkR0RlFVeDFRanM3YzBKQlVUTkNMRmxCUVVFc1IwRkJaU3hUUVVGRExFbEJRVVE3UVVGRFdDeFJRVUZCTzBsQlFVRXNVMEZCUVN4SFFVRlpMRWxCUVVNc1EwRkJRU3hqUVVGRUxFTkJRV2RDTEVsQlFXaENMRVZCUVhOQ0xFOUJRWFJDTzBsQlExb3NVVUZCUVN4SFFVRlhPMGxCUTFnc1MwRkJRU3hIUVVGUk8wbEJRMUlzVVVGQlFTeEhRVUZYTzBGQlExZ3NVMEZCWjBJc01FZEJRV2hDTzAxQlEwa3NTVUZCV1N4UFFVRlBMRWxCUVVzc1EwRkJRU3hUUVVGQkxFTkJRVmNzUTBGQlFTeFJRVUZCTEVOQlFYWkNMRXRCUVhWRExGRkJRVzVFTzBGQlFVRXNhVUpCUVVFN08wMUJRMEVzUjBGQlFTeEhRVUZOTEVsQlFVc3NRMEZCUVN4VFFVRkJMRU5CUVZjc1EwRkJRU3hSUVVGQk8wMUJRM1JDTEZGQlFWRXNRMEZCUXl4SlFVRlVMRU5CUVdNc1IwRkJaRHROUVVOQkxFZEJRVUVzUjBGQlRTeE5RVUZCTEVOQlFVOHNSMEZCUnl4RFFVRkRMRTlCUVVvc1EwRkJXU3hIUVVGYUxFVkJRV2xDTEVWQlFXcENMRU5CUVZBN1RVRkRUaXhSUVVGQkxFbEJRVms3VFVGRFdpeExRVUZCTzBGQlRrbzdTVUZQUVN4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeE5RVUZCTEVkQlFVOHNVVUZCZUVJN1NVRkRRU3hWUVVGQkxFZEJRV0VzVVVGQlFTeEhRVUZYTzBsQlEzaENMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEZGQlFVRXNSMEZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGWUxFTkJRVzFDTEVOQlFXNUNMRU5CUVVRc1EwRkJla0k3UVVGRFFTeFhRVUZQTzBWQlprazdPM05DUVdsQ1ppeGpRVUZCTEVkQlFXbENMRk5CUVVNc1RVRkJSRHRCUVVOaUxGZEJRVk1zUTBGQlF5eERRVUZETEUxQlFVRXNSMEZCVXl4VFFVRldMRU5CUVc5Q0xFTkJRVU1zVDBGQmNrSXNRMEZCTmtJc1EwRkJOMElzUTBGQlJDeERRVUZCTEVkQlFXbERPMFZCUkRkQ096czdPenM3UVVGSGNrSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIEV2ZW50TWFuYWdlcjtcblxuRXZlbnRNYW5hZ2VyID0ge1xuICBzZW5kOiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICB2YXIgZXZlbnQ7XG4gICAgZXZlbnQgPSBuZXcgY2MuRXZlbnRDdXN0b20oZXZlbnROYW1lKTtcbiAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgZXZlbnQuc2V0VXNlckRhdGEoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBjYy5ldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0sXG4gIGxpc3RlbjogZnVuY3Rpb24oZXZlbnROYW1lLCBsaXN0ZW5GdW5jLCBub2RlT3JQcmlvcml0eSkge1xuICAgIHZhciBjY0xpc3RlbmVyO1xuICAgIGlmIChub2RlT3JQcmlvcml0eSA9PSBudWxsKSB7XG4gICAgICBub2RlT3JQcmlvcml0eSA9IDE7XG4gICAgfVxuICAgIGNjTGlzdGVuZXIgPSBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZSh7XG4gICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00sXG4gICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gbGlzdGVuRnVuYyhldmVudC5nZXRVc2VyRGF0YSgpLCBldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihjY0xpc3RlbmVyLCBub2RlT3JQcmlvcml0eSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5STllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyVjJaVzUwTDBGeWEwVjJaVzUwVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlF5eFRRVUZFTEVWQlFWa3NTVUZCV2p0QlFVTkdMRkZCUVVFN1NVRkJRU3hMUVVGQkxFZEJRVkVzU1VGQlNTeEZRVUZGTEVOQlFVTXNWMEZCVUN4RFFVRnRRaXhUUVVGdVFqdEpRVU5TTEVsQlFVa3NTVUZCUVN4TFFVRlJMRWxCUVZvN1RVRkRTU3hMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZyUWl4SlFVRnNRaXhGUVVSS096dFhRVVZCTEVWQlFVVXNRMEZCUXl4WlFVRlpMRU5CUVVNc1lVRkJhRUlzUTBGQk9FSXNTMEZCT1VJN1JVRktSU3hEUVVGT08wVkJTMEVzVFVGQlFTeEZRVUZSTEZOQlFVTXNVMEZCUkN4RlFVRlpMRlZCUVZvc1JVRkJkMElzWTBGQmVFSTdRVUZEU2l4UlFVRkJPenROUVVGQkxHbENRVUZyUWpzN1NVRkRiRUlzVlVGQlFTeEhRVUZoTEVWQlFVVXNRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJha0lzUTBGRFZEdE5RVUZCTEV0QlFVRXNSVUZCVHl4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRWGhDTzAxQlEwRXNVMEZCUVN4RlFVRlhMRk5CUkZnN1RVRkZRU3hSUVVGQkxFVkJRVlVzVTBGQlF5eExRVUZFTzBGQlEwNHNaVUZCVHl4VlFVRkJMRU5CUVZjc1MwRkJTeXhEUVVGRExGZEJRVTRzUTBGQlFTeERRVUZZTEVWQlFXZERMRXRCUVdoRE8wMUJSRVFzUTBGR1ZqdExRVVJUTzFkQlRXSXNSVUZCUlN4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGb1FpeERRVUUwUWl4VlFVRTFRaXhGUVVGM1F5eGpRVUY0UXp0RlFWSkpMRU5CVEZJN096dEJRV05LTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBFdmVudE5hbWVzO1xuXG5FdmVudE5hbWVzID0ge1xuICBHQU1FX1NUQVJUOiBcImdhbWUuc3RhcnRcIixcbiAgR0FNRV9FTkQ6IFwiZ2FtZS5lbmRcIixcbiAgR0FNRV9ORVhUX0xFVkVMOiBcImdhbWUubmV4dC5sZXZlbFwiLFxuICBHQU1FX0dFVF9SRVNVTFQ6IFwiZ2FtZS5nZXQucmVzdWx0XCIsXG4gIEdBTUVfSU5JVF9UQUJMRTogXCJnYW1lLmluaXQudGFibGVcIlxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE5hbWVzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5ST1lXMWxjeTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZkR0Z2ZDNVdmMzUjFaSGt2UVhKcllXUXZRWEpyWVdSSFlXMWxMM055WXk5bGRtVnVkQzlCY210RmRtVnVkRTVoYldWekxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZCT3p0QlFVRkJMRlZCUVVFc1IwRkRTVHRGUVVGQkxGVkJRVUVzUlVGQmEwSXNXVUZCYkVJN1JVRkRRU3hSUVVGQkxFVkJRV3RDTEZWQlJHeENPMFZCUlVFc1pVRkJRU3hGUVVGclFpeHBRa0ZHYkVJN1JVRkpRU3hsUVVGQkxFVkJRV3RDTEdsQ1FVcHNRanRGUVV0QkxHVkJRVUVzUlVGQmEwSXNhVUpCVEd4Q096czdRVUZQU2l4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiIsImdsb2JhbC55ZWFyID0gNjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WjJ4dlltRnNWbUZzZFdVdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaMnh2WW1Gc1ZtRnNkV1V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEUxQlFVMHNRMEZCUXl4SlFVRlFMRWRCUVdNaWZRPT1cbiIsImNjLmdhbWUub25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgR2FtZUxvZ2ljLCBnYW1lRGlhbG9nLCBnYW1lTG9naWNPYmosIHNjZW5lTWFuYWdlcjtcbiAgY2Mudmlldy5hZGp1c3RWaWV3UG9ydCh0cnVlKTtcbiAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgxMTM2LCA2NDAsIGNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwpO1xuICBjYy52aWV3LmVuYWJsZUF1dG9GdWxsU2NyZWVuKGZhbHNlKTtcbiAgY2Mudmlldy5yZXNpemVXaXRoQnJvd3NlclNpemUodHJ1ZSk7XG4gIGNjLkJ1aWxkZXJSZWFkZXIuc2V0UmVzb3VyY2VQYXRoKFwicmVzL1wiKTtcbiAgc2NlbmVNYW5hZ2VyID0gcmVxdWlyZShcIi4vdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZVwiKTtcbiAgc2NlbmVNYW5hZ2VyLmluaXQoKTtcbiAgZ2FtZURpYWxvZyA9IHJlcXVpcmUoJy4vY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZScpO1xuICBzY2VuZU1hbmFnZXIuYWRkTGF5ZXJUb1NjZW5lKGdhbWVEaWFsb2cpO1xuICBHYW1lTG9naWMgPSByZXF1aXJlKCcuL2NvbnRyb2wvQXJrR2FtZUxvZ2ljLmNvZmZlZScpO1xuICBnYW1lTG9naWNPYmogPSBuZXcgR2FtZUxvZ2ljKCk7XG4gIHJldHVybiBnYW1lTG9naWNPYmouaW5pdCgpO1xufTtcblxuY2MuZ2FtZS5ydW4oKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12YldGcGJpNWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTl0WVdsdUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVZJc1IwRkJhMElzVTBGQlFUdEJRVU5rTEUxQlFVRTdSVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRVklzUTBGQmRVSXNTVUZCZGtJN1JVRkRRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEhWQ1FVRlNMRU5CUVdkRExFbEJRV2hETEVWQlFYTkRMRWRCUVhSRExFVkJRVEpETEVWQlFVVXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eFJRVUV2UkR0RlFVTkJMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zYjBKQlFWSXNRMEZCTmtJc1MwRkJOMEk3UlVGRFFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMSEZDUVVGU0xFTkJRVGhDTEVsQlFUbENPMFZCUTBFc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eGxRVUZxUWl4RFFVRnBReXhOUVVGcVF6dEZRVVZCTEZsQlFVRXNSMEZCWlN4UFFVRkJMRU5CUVZFc1owTkJRVkk3UlVGRFppeFpRVUZaTEVOQlFVTXNTVUZCWWl4RFFVRkJPMFZCUlVFc1ZVRkJRU3hIUVVGaExFOUJRVUVzUTBGQlVTeG5RMEZCVWp0RlFVTmlMRmxCUVZrc1EwRkJReXhsUVVGaUxFTkJRVFpDTEZWQlFUZENPMFZCUlVFc1UwRkJRU3hIUVVGWkxFOUJRVUVzUTBGQlVTd3JRa0ZCVWp0RlFVTmFMRmxCUVVFc1IwRkJaU3hKUVVGSkxGTkJRVW9zUTBGQlFUdFRRVU5tTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVVFN1FVRm1ZenM3UVVGclFteENMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlVpeERRVUZCSW4wPVxuIiwidmFyIFVzZXJEYXRhO1xuXG5Vc2VyRGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVXNlckRhdGEoKSB7XG4gICAgdGhpcy5fc2NvcmUgPSAwO1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgfVxuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKF9zY29yZSkge1xuICAgIHRoaXMuX3Njb3JlID0gX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRTY29yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29yZTtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuc2V0Q291bnQgPSBmdW5jdGlvbihfY291bnQpIHtcbiAgICB0aGlzLl9jb3VudCA9IF9jb3VudDtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuZ2V0Q291bnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJEYXRhO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJEYXRhO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRWEpyVlhObGNrUmhkR0V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRTdPMEZCUVUwN1JVRkRWeXhyUWtGQlFUdEpRVU5VTEVsQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZVN1NVRkRWaXhKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTzBWQlJrUTdPM0ZDUVVsaUxGRkJRVUVzUjBGQlZTeFRRVUZETEUxQlFVUTdTVUZCUXl4SlFVRkRMRU5CUVVFc1UwRkJSRHRGUVVGRU96dHhRa0ZGVml4UlFVRkJMRWRCUVZVc1UwRkJRVHRYUVVGSExFbEJRVU1zUTBGQlFUdEZRVUZLT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlF5eE5RVUZFTzBsQlFVTXNTVUZCUXl4RFFVRkJMRk5CUVVRN1JVRkJSRHM3Y1VKQlJWWXNVVUZCUVN4SFFVRlZMRk5CUVVFN1YwRkJSeXhKUVVGRExFTkJRVUU3UlVGQlNqczdPenM3TzBGQlJXUXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIEJhbGFuY2VTaGVldCwgVGFibGVCYXNlLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuVGFibGVCYXNlID0gcmVxdWlyZShcIi4vVGFibGVCYXNlLmNvZmZlZVwiKTtcblxuQmFsYW5jZVNoZWV0ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKEJhbGFuY2VTaGVldCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQmFsYW5jZVNoZWV0KCkge1xuICAgIHJldHVybiBCYWxhbmNlU2hlZXQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi96Y2Z6Yl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldENhc2hWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFllYXJWYWx1ZSh0aGlzLl9kYXRhW1wi6LSn5biB6LWE6YeRKOS4h+WFgylcIl0pO1xuICB9O1xuXG4gIHJldHVybiBCYWxhbmNlU2hlZXQ7XG5cbn0pKFRhYmxlQmFzZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFsYW5jZVNoZWV0O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFtRnNZVzVqWlZOb1pXVjBMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDIxdlpHVnNMMEpoYkdGdVkyVlRhR1ZsZEM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRU3gxUWtGQlFUdEZRVUZCT3pzN1FVRkJRU3hUUVVGQkxFZEJRV0VzVDBGQlFTeERRVUZSTEc5Q1FVRlNPenRCUVVkUU96czdPenM3TzNsQ1FVTk1MRmRCUVVFc1IwRkJXU3hUUVVGQk8xZEJRMWdzVFVGQlFTeEhRVUZQTEVsQlFVTXNRMEZCUVN4VlFVRlNMRWRCUVcxQ0xHTkJRVzVDTEVkQlFXbERMRWxCUVVNc1EwRkJRU3hWUVVGc1F5eEhRVUUyUXp0RlFVUnNRenM3ZVVKQlIxb3NXVUZCUVN4SFFVRmpMRk5CUVVFN1YwRkRZaXhKUVVGRExFTkJRVUVzV1VGQlJDeERRVUZqTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1ZVRkJRU3hEUVVGeVFqdEZRVVJoT3pzN08wZEJTbGs3TzBGQlR6TkNMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIENhc2hGbG93U3RhdGVtZW50LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChDYXNoRmxvd1N0YXRlbWVudCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQ2FzaEZsb3dTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIENhc2hGbG93U3RhdGVtZW50Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQ2FzaEZsb3dTdGF0ZW1lbnQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi94amxsYl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICByZXR1cm4gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbn0pKFRhYmxlQmFzZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRXNORUpCUVVFN1JVRkJRVHM3TzBGQlFVRXNVMEZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3h2UWtGQlVqczdRVUZGVURzN096czdPenM0UWtGRlRDeFhRVUZCTEVkQlFXRXNVMEZCUVR0WFFVTmFMRTFCUVVFc1IwRkJUeXhKUVVGRExFTkJRVUVzVlVGQlVpeEhRVUZ0UWl4alFVRnVRaXhIUVVGcFF5eEpRVUZETEVOQlFVRXNWVUZCYkVNc1IwRkJOa003UlVGRWFrTTdPenM3UjBGR2EwSTdPMEZCUzJoRExFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgUHJvZml0U3RhdGVtZW50LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5Qcm9maXRTdGF0ZW1lbnQgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUHJvZml0U3RhdGVtZW50LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQcm9maXRTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIFByb2ZpdFN0YXRlbWVudC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFByb2ZpdFN0YXRlbWVudC5wcm90b3R5cGUuZ2V0RmlsZVBhdGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJyZXMvXCIgKyB0aGlzLl9zdG9ja1R5cGUgKyBcIl9qc29uL2xyYl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICByZXR1cm4gUHJvZml0U3RhdGVtZW50O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpdFN0YXRlbWVudDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZVSEp2Wm1sMFUzUmhkR1Z0Wlc1MExtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMjF2WkdWc0wxQnliMlpwZEZOMFlYUmxiV1Z1ZEM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRU3d3UWtGQlFUdEZRVUZCT3pzN1FVRkJRU3hUUVVGQkxFZEJRV0VzVDBGQlFTeERRVUZSTEc5Q1FVRlNPenRCUVVWUU96czdPenM3T3pSQ1FVTk1MRmRCUVVFc1IwRkJZU3hUUVVGQk8xZEJRMW9zVFVGQlFTeEhRVUZQTEVsQlFVTXNRMEZCUVN4VlFVRlNMRWRCUVcxQ0xGbEJRVzVDTEVkQlFTdENMRWxCUVVNc1EwRkJRU3hWUVVGb1F5eEhRVUV5UXp0RlFVUXZRanM3T3p0SFFVUm5RanM3UVVGSk9VSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIFRhYmxlQmFzZTtcblxuVGFibGVCYXNlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUYWJsZUJhc2UoX3N0b2NrVHlwZSwgX3N0b2NrQ29kZSkge1xuICAgIHRoaXMuX3N0b2NrVHlwZSA9IF9zdG9ja1R5cGU7XG4gICAgdGhpcy5fc3RvY2tDb2RlID0gX3N0b2NrQ29kZTtcbiAgICB0aGlzLl9kYXRhID0gW107XG4gICAgdGhpcy5fbG9hZEpzb24oKTtcbiAgfVxuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0RmlsZVBhdGggPSBmdW5jdGlvbigpIHt9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2xvYWRKc29uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbGVQYXRoO1xuICAgIGZpbGVQYXRoID0gdGhpcy5nZXRGaWxlUGF0aCgpO1xuICAgIHJldHVybiBjYy5sb2FkZXIubG9hZEpzb24oZmlsZVBhdGgsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9nZXRTaG93TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgcmV0dXJuICgobnVtYmVyIC8gMTAwMDAwKS50b0ZpeGVkKDIpKSArIFwiIOS6v1wiO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0Rm9ybWF0TnVtYmVyVGFibGUgPSBmdW5jdGlvbihudW1iZXJUYWJsZSkge1xuICAgIHZhciBmb3JtYXRUYWJsZSwgaSwgbGVuLCBudW1iZXI7XG4gICAgZm9ybWF0VGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBudW1iZXJUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbnVtYmVyID0gbnVtYmVyVGFibGVbaV07XG4gICAgICBmb3JtYXRUYWJsZS5wdXNoKHRoaXMuX2dldFNob3dOdW1iZXIobnVtYmVyKSk7XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXRUYWJsZTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldFllYXJWYWx1ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGluZGV4LCBpbmRleFRhYmxlLCBsZW4sIHJlZiwgdGltZVN0cjtcbiAgICBpbmRleFRhYmxlID0gW107XG4gICAgcmVmID0gdGhpcy5fZGF0YVtcIuaKpeWRiuaXpeacn1wiXTtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICB0aW1lU3RyID0gcmVmW2luZGV4XTtcbiAgICAgIGlmICh0aW1lU3RyLmluZGV4T2YoXCIxMi0zMVwiKSAhPT0gLTEpIHtcbiAgICAgICAgaW5kZXhUYWJsZS5wdXNoKGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4VGFibGU7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fZ2V0VmFsdWVMZW5ndGggPSBmdW5jdGlvbih2YWx1ZUxlbmd0aCkge1xuICAgIHZhciBsZW5ndGg7XG4gICAgaWYgKHZhbHVlTGVuZ3RoIDwgZ2xvYmFsLnllYXIpIHtcbiAgICAgIGxlbmd0aCA9IHZhbHVlTGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSBnbG9iYWwueWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldFllYXJWYWx1ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGxlbiwgdmFsdWVUYWJsZSwgeWVhckluZGV4VGFibGU7XG4gICAgeWVhckluZGV4VGFibGUgPSB0aGlzLmdldFllYXJWYWx1ZUluZGV4KCk7XG4gICAgdmFsdWVUYWJsZSA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHllYXJJbmRleFRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpbmRleCA9IHllYXJJbmRleFRhYmxlW2ldO1xuICAgICAgdmFsdWVUYWJsZS5wdXNoKGRhdGFbaW5kZXhdKTtcbiAgICB9XG4gICAgdmFsdWVUYWJsZSA9IHZhbHVlVGFibGUuc2xpY2UoMCwgdGhpcy5fZ2V0VmFsdWVMZW5ndGgodmFsdWVUYWJsZS5sZW5ndGgpKTtcbiAgICByZXR1cm4gdGhpcy5nZXRGb3JtYXROdW1iZXJUYWJsZSh2YWx1ZVRhYmxlKTtcbiAgfTtcblxuICByZXR1cm4gVGFibGVCYXNlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQmFzZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZWR0ZpYkdWQ1lYTmxMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDIxdlpHVnNMMVJoWW14bFFtRnpaUzVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCVFR0RlFVTlJMRzFDUVVGRExGVkJRVVFzUlVGQll5eFZRVUZrTzBsQlFVTXNTVUZCUXl4RFFVRkJMR0ZCUVVRN1NVRkJZU3hKUVVGRExFTkJRVUVzWVVGQlJEdEpRVU14UWl4SlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGVE8wbEJRMVFzU1VGQlF5eERRVUZCTEZOQlFVUXNRMEZCUVR0RlFVWlpPenR6UWtGSllpeFhRVUZCTEVkQlFXRXNVMEZCUVN4SFFVRkJPenR6UWtGRllpeFRRVUZCTEVkQlFWY3NVMEZCUVR0QlFVTldMRkZCUVVFN1NVRkJRU3hSUVVGQkxFZEJRVmNzU1VGQlF5eERRVUZCTEZkQlFVUXNRMEZCUVR0WFFVTllMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4UlFVRnVRaXhGUVVFMlFpeERRVUZCTEZOQlFVRXNTMEZCUVR0aFFVRkJMRk5CUVVNc1MwRkJSQ3hGUVVGUkxFbEJRVkk3WlVGRE5VSXNTMEZCUXl4RFFVRkJMRXRCUVVRc1IwRkJVenROUVVSdFFqdEpRVUZCTEVOQlFVRXNRMEZCUVN4RFFVRkJMRWxCUVVFc1EwRkJOMEk3UlVGR1ZUczdjMEpCVFZnc1kwRkJRU3hIUVVGcFFpeFRRVUZETEUxQlFVUTdRVUZEYUVJc1YwRkJVeXhEUVVGRExFTkJRVU1zVFVGQlFTeEhRVUZUTEUxQlFWWXNRMEZCYVVJc1EwRkJReXhQUVVGc1FpeERRVUV3UWl4RFFVRXhRaXhEUVVGRUxFTkJRVUVzUjBGQk9FSTdSVUZFZGtJN08zTkNRVWRxUWl4dlFrRkJRU3hIUVVGelFpeFRRVUZETEZkQlFVUTdRVUZEY2tJc1VVRkJRVHRKUVVGQkxGZEJRVUVzUjBGQll6dEJRVU5rTEZOQlFVRXNOa05CUVVFN08wMUJRME1zVjBGQlZ5eERRVUZETEVsQlFWb3NRMEZCYVVJc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNUVUZCYUVJc1EwRkJha0k3UVVGRVJEdEJRVVZCTEZkQlFVODdSVUZLWXpzN2MwSkJUWFJDTEdsQ1FVRkJMRWRCUVcxQ0xGTkJRVUU3UVVGRGJFSXNVVUZCUVR0SlFVRkJMRlZCUVVFc1IwRkJZVHRCUVVOaU8wRkJRVUVzVTBGQlFTeHhSRUZCUVRzN1RVRkRReXhKUVVGSExFOUJRVThzUTBGQlF5eFBRVUZTTEVOQlFXZENMRTlCUVdoQ0xFTkJRVUVzUzBGQk9FSXNRMEZCUXl4RFFVRnNRenRSUVVORExGVkJRVlVzUTBGQlF5eEpRVUZZTEVOQlFXZENMRXRCUVdoQ0xFVkJSRVE3TzBGQlJFUTdRVUZIUVN4WFFVRlBPMFZCVEZjN08zTkNRVTl1UWl4bFFVRkJMRWRCUVdsQ0xGTkJRVU1zVjBGQlJEdEJRVU5vUWl4UlFVRkJPMGxCUVVFc1NVRkJSeXhYUVVGQkxFZEJRV01zVFVGQlRTeERRVUZETEVsQlFYaENPMDFCUTBNc1RVRkJRU3hIUVVGVExGbEJSRlk3UzBGQlFTeE5RVUZCTzAxQlIwTXNUVUZCUVN4SFFVRlRMRTFCUVUwc1EwRkJReXhMUVVocVFqczdWMEZKUVR0RlFVeG5RanM3YzBKQlQycENMRmxCUVVFc1IwRkJZeXhUUVVGRExFbEJRVVE3UVVGRFlpeFJRVUZCTzBsQlFVRXNZMEZCUVN4SFFVRnBRaXhKUVVGRExFTkJRVUVzYVVKQlFVUXNRMEZCUVR0SlFVTnFRaXhWUVVGQkxFZEJRV0U3UVVGRFlpeFRRVUZCTEdkRVFVRkJPenROUVVORExGVkJRVlVzUTBGQlF5eEpRVUZZTEVOQlFXZENMRWxCUVVzc1EwRkJRU3hMUVVGQkxFTkJRWEpDTzBGQlJFUTdTVUZIUVN4VlFVRkJMRWRCUVdFc1ZVRkJWU3hEUVVGRExFdEJRVmdzUTBGQmFVSXNRMEZCYWtJc1JVRkJiMElzU1VGQlF5eERRVUZCTEdWQlFVUXNRMEZCYVVJc1ZVRkJWU3hEUVVGRExFMUJRVFZDTEVOQlFYQkNPMWRCUTJJc1NVRkJReXhEUVVGQkxHOUNRVUZFTEVOQlFYTkNMRlZCUVhSQ08wVkJVR0U3T3pzN096dEJRVk5tTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBMYXllck1hbmFnZXIsIExvYWRlcjtcblxuTGF5ZXJNYW5hZ2VyID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxheWVyU3RhY2sgPSBbXTtcbiAgICB0aGlzLnNjZW5lID0gbmV3IGNjLlNjZW5lKCk7XG4gICAgcmV0dXJuIGNjLmRpcmVjdG9yLnJ1blNjZW5lKHRoaXMuc2NlbmUpO1xuICB9LFxuICBjbGVhckxheWVyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5sZW5ndGggPSAwO1xuICB9LFxuICBhZGRMYXllclRvU2NlbmU6IGZ1bmN0aW9uKGNjYkxheWVyLCB6T3JkZXIpIHtcbiAgICB2YXIgbGF5b3V0LCBub2RlO1xuICAgIGlmICh6T3JkZXIgPT0gbnVsbCkge1xuICAgICAgek9yZGVyID0gMDtcbiAgICB9XG4gICAgbGF5b3V0ID0gbmV3IGNjdWkuTGF5b3V0KCk7XG4gICAgbGF5b3V0LnNldENvbnRlbnRTaXplKGNjLnNpemUoMTEzNiwgNjQwKSk7XG4gICAgbGF5b3V0LnNldFRvdWNoRW5hYmxlZCh0cnVlKTtcbiAgICBub2RlID0gbmV3IGNjLk5vZGUoKTtcbiAgICBub2RlLmFkZENoaWxkKGxheW91dCk7XG4gICAgbm9kZS5hZGRDaGlsZChjY2JMYXllcik7XG4gICAgdGhpcy5zY2VuZS5hZGRDaGlsZChub2RlLCB6T3JkZXIpO1xuICAgIHJldHVybiB0aGlzLmxheWVyU3RhY2sucHVzaChub2RlKTtcbiAgfSxcbiAgcmVtb3ZlVG9wTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0b3BMYXllcjtcbiAgICB0b3BMYXllciA9IHRoaXMubGF5ZXJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdGhpcy5zY2VuZS5yZW1vdmVDaGlsZCh0b3BMYXllciwgdHJ1ZSk7XG4gIH1cbn07XG5cbkxvYWRlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTG9hZGVyKGNjYkZpbGUxLCBjb250cm9sbGVyTmFtZTEpIHtcbiAgICB0aGlzLmNjYkZpbGUgPSBjY2JGaWxlMTtcbiAgICB0aGlzLmNvbnRyb2xsZXJOYW1lID0gY29udHJvbGxlck5hbWUxO1xuICB9XG5cbiAgTG9hZGVyLnByb3RvdHlwZS5zaG93RGlhbG9nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNjLkJ1aWxkZXJSZWFkZXIubG9hZCh0aGlzLmNjYkZpbGUpO1xuICB9O1xuXG4gIHJldHVybiBMb2FkZXI7XG5cbn0pKCk7XG5cbkxheWVyTWFuYWdlci5kZWZpbmVEaWFsb2cgPSBmdW5jdGlvbihjY2JGaWxlLCBjb250cm9sbGVyTmFtZSwgY29udHJvbGxlckNsYXNzKSB7XG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKGNvbnRyb2xsZXJOYW1lLCBuZXcgY29udHJvbGxlckNsYXNzKCkpO1xuICByZXR1cm4gbmV3IExvYWRlcihjY2JGaWxlLCBjb250cm9sbGVyTmFtZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheWVyTWFuYWdlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12ZEc5dmJITXZRWEpyVTJObGJtVk5ZVzVoWjJWeUxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMM1J2YjJ4ekwwRnlhMU5qWlc1bFRXRnVZV2RsY2k1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUTBFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlEwazdSVUZCUVN4SlFVRkJMRVZCUVUwc1UwRkJRVHRKUVVOR0xFbEJRVU1zUTBGQlFTeFZRVUZFTEVkQlFXTTdTVUZEWkN4SlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGVExFbEJRVWtzUlVGQlJTeERRVUZETEV0QlFWQXNRMEZCUVR0WFFVTlVMRVZCUVVVc1EwRkJReXhSUVVGUkxFTkJRVU1zVVVGQldpeERRVUZ4UWl4SlFVRkRMRU5CUVVFc1MwRkJkRUk3UlVGSVJTeERRVUZPTzBWQlMwRXNWVUZCUVN4RlFVRlpMRk5CUVVFN1NVRkRVaXhKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEdsQ1FVRlFMRU5CUVVFN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEUxQlFWb3NSMEZCY1VJN1JVRkdZaXhEUVV4YU8wVkJVMEVzWlVGQlFTeEZRVUZyUWl4VFFVRkRMRkZCUVVRc1JVRkJWeXhOUVVGWU8wRkJRMlFzVVVGQlFUczdUVUZFZVVJc1UwRkJVenM3U1VGRGJFTXNUVUZCUVN4SFFVRlRMRWxCUVVrc1NVRkJTU3hEUVVGRExFMUJRVlFzUTBGQlFUdEpRVU5VTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNTVUZCVWl4RlFVRmpMRWRCUVdRc1EwRkJkRUk3U1VGRFFTeE5RVUZOTEVOQlFVTXNaVUZCVUN4RFFVRjFRaXhKUVVGMlFqdEpRVVZCTEVsQlFVRXNSMEZCVFN4SlFVRkpMRVZCUVVVc1EwRkJReXhKUVVGUUxFTkJRVUU3U1VGRFRpeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRTFCUVdRN1NVRkRRU3hKUVVGSkxFTkJRVU1zVVVGQlRDeERRVUZqTEZGQlFXUTdTVUZGUVN4SlFVRkRMRU5CUVVFc1MwRkJTeXhEUVVGRExGRkJRVkFzUTBGQlowSXNTVUZCYUVJc1JVRkJjMElzVFVGQmRFSTdWMEZEUVN4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExFbEJRVm9zUTBGQmFVSXNTVUZCYWtJN1JVRldZeXhEUVZSc1FqdEZRWEZDUVN4alFVRkJMRVZCUVdkQ0xGTkJRVUU3UVVGRFdpeFJRVUZCTzBsQlFVRXNVVUZCUVN4SFFVRlhMRWxCUVVNc1EwRkJRU3hWUVVGVkxFTkJRVU1zUjBGQldpeERRVUZCTzFkQlExZ3NTVUZCUXl4RFFVRkJMRXRCUVVzc1EwRkJReXhYUVVGUUxFTkJRVzFDTEZGQlFXNUNMRVZCUVRaQ0xFbEJRVGRDTzBWQlJsa3NRMEZ5UW1oQ096czdRVUY1UWtVN1JVRkRWeXhuUWtGQlF5eFJRVUZFTEVWQlFWY3NaVUZCV0R0SlFVRkRMRWxCUVVNc1EwRkJRU3hWUVVGRU8wbEJRVlVzU1VGQlF5eERRVUZCTEdsQ1FVRkVPMFZCUVZnN08yMUNRVU5pTEZWQlFVRXNSMEZCWVN4VFFVRkJPMWRCUTFRc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhKUVVGRExFTkJRVUVzVDBGQmRrSTdSVUZFVXpzN096czdPMEZCUjJwQ0xGbEJRVmtzUTBGQlF5eFpRVUZpTEVkQlFUUkNMRk5CUVVNc1QwRkJSQ3hGUVVGVkxHTkJRVllzUlVGQk1FSXNaVUZCTVVJN1JVRkRlRUlzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGpRVVJLTEVWQlJVa3NTVUZCU1N4bFFVRktMRU5CUVVFc1EwRkdTanRUUVV0QkxFbEJRVWtzVFVGQlNpeERRVUZYTEU5QlFWZ3NSVUZCYjBJc1kwRkJjRUk3UVVGT2QwSTdPMEZCVVRWQ0xFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iXX0=
