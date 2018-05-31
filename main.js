(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var ArkMainDialog, ArkScrollView, eventManager, eventNames, g_click_times;

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

ArkScrollView = require('../tools/ScrollView.coffee');

g_click_times = 0;

ArkMainDialog = (function() {
  function ArkMainDialog() {}

  ArkMainDialog.prototype.onDidLoadFromCCB = function() {
    this._datTable = [];
    this._reset();
    return this.init();
  };

  ArkMainDialog.prototype._reset = function() {
    this._scrollView = null;
    this._stockCodeEditBox = null;
    return this._yearsEditBox = null;
  };

  ArkMainDialog.prototype.init = function() {
    this._stockCodeEditBox = this._createEditBox(this.ccb_textField_1);
    this.rootNode.addChild(this._stockCodeEditBox);
    this._yearsEditBox = this._createEditBox(this.ccb_textField_2);
    this.rootNode.addChild(this._yearsEditBox);
    this._initData();
    this._scrollView = ArkScrollView.createScrollView(this.ccb_scrollView);
    this.rootNode.addChild(this._scrollView);
    ArkScrollView.initFromContainer(this._scrollView, this.ccb_result);
  };

  ArkMainDialog.prototype._initData = function() {
    this._stockCodeEditBox.setString("000651");
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
    this.ccb_result.setString(result);
    ArkScrollView.initFromContainer(this._scrollView, this.ccb_result);
    return ArkScrollView.scrollJumpToTop(this._scrollView);
  };

  ArkMainDialog.prototype.onCalc = function() {
    var stockCode, years;
    stockCode = this._stockCodeEditBox.getString();
    years = this._yearsEditBox.getString();
    global.year = years;
    return eventManager.send(eventNames.GAME_GET_RESULT, {
      stockCode: stockCode,
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


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../event/ArkEventManager.coffee":3,"../event/ArkEventNames.coffee":4,"../tools/ScrollView.coffee":13}],2:[function(require,module,exports){
(function (global){
var BalanceSheet, CashFlowStatement, GameLogic, ProfitStatement, UserData, eventManager, eventNames, g_stockTable, sceneManager, utils;

sceneManager = require('../tools/ArkSceneManager.coffee');

eventManager = require('../event/ArkEventManager.coffee');

eventNames = require('../event/ArkEventNames.coffee');

UserData = require('../model/ArkUserData.coffee');

BalanceSheet = require('../model/BalanceSheet.coffee');

ProfitStatement = require('../model/ProfitStatement.coffee');

CashFlowStatement = require('../model/CashFlowStatement.coffee');

require("../globalValue.coffee");

utils = require('../tools/utils.coffee');

g_stockTable = ["SZ000001", "SZ000002", "SZ000008", "SZ000060", "SZ000063", "SZ000069", "SZ000100", "SZ000157", "SZ000166", "SZ000333", "SZ000338", "SZ000402", "SZ000413", "SZ000415", "SZ000423", "SZ000425", "SZ000503", "SZ000538", "SZ000540", "SZ000559", "SZ000568", "SZ000623", "SZ000625", "SZ000627", "SZ000630", "SZ000651", "SZ000671", "SZ000686", "SZ000709", "SZ000723", "SZ000725", "SZ000728", "SZ000738", "SZ000750", "SZ000768", "SZ000776", "SZ000783", "SZ000792", "SZ000826", "SZ000839", "SZ000858", "SZ000876", "SZ000895", "SZ000898", "SZ000938", "SZ000959", "SZ000961", "SZ000963", "SZ000983", "SZ001979", "SZ002007", "SZ002008", "SZ002024", "SZ002027", "SZ002044", "SZ002065", "SZ002074", "SZ002081", "SZ002142", "SZ002146", "SZ002153", "SZ002174", "SZ002202", "SZ002230", "SZ002236", "SZ002241", "SZ002252", "SZ002292", "SZ002294", "SZ002304", "SZ002310", "SZ002352", "SZ002385", "SZ002411", "SZ002415", "SZ002424", "SZ002426", "SZ002450", "SZ002456", "SZ002460", "SZ002465", "SZ002466", "SZ002468", "SZ002470", "SZ002475", "SZ002500", "SZ002508", "SZ002555", "SZ002558", "SZ002572", "SZ002594", "SZ002601", "SZ002602", "SZ002608", "SZ002624", "SZ002673", "SZ002714", "SZ002736", "SZ002739", "SZ002797", "SZ002831", "SZ002839", "SZ002841", "SZ300003", "SZ300015", "SZ300017", "SZ300024", "SZ300027", "SZ300033", "SZ300059", "SZ300070", "SZ300072", "SZ300122", "SZ300124", "SZ300136", "SZ300144", "SZ300251", "SZ300315", "SH600000", "SH600008", "SH600009", "SH600010", "SH600011", "SH600015", "SH600016", "SH600018", "SH600019", "SH600021", "SH600023", "SH600028", "SH600029", "SH600030", "SH600031", "SH600036", "SH600038", "SH600048", "SH600050", "SH600061", "SH600066", "SH600068", "SH600074", "SH600085", "SH600089", "SH600100", "SH600104", "SH600109", "SH600111", "SH600115", "SH600118", "SH600153", "SH600157", "SH600170", "SH600177", "SH600188", "SH600196", "SH600208", "SH600219", "SH600221", "SH600233", "SH600271", "SH600276", "SH600297", "SH600309", "SH600332", "SH600340", "SH600352", "SH600362", "SH600369", "SH600372", "SH600373", "SH600376", "SH600383", "SH600390", "SH600406", "SH600415", "SH600436", "SH600482", "SH600485", "SH600489", "SH600498", "SH600518", "SH600519", "SH600522", "SH600535", "SH600547", "SH600549", "SH600570", "SH600583", "SH600585", "SH600588", "SH600606", "SH600637", "SH600649", "SH600660", "SH600663", "SH600674", "SH600682", "SH600685", "SH600688", "SH600690", "SH600703", "SH600704", "SH600705", "SH600739", "SH600741", "SH600795", "SH600804", "SH600816", "SH600820", "SH600827", "SH600837", "SH600871", "SH600886", "SH600887", "SH600893", "SH600895", "SH600900", "SH600909", "SH600919", "SH600926", "SH600958", "SH600959", "SH600977", "SH600999", "SH601006", "SH601009", "SH601012", "SH601018", "SH601021", "SH601088", "SH601099", "SH601111", "SH601117", "SH601118", "SH601155", "SH601163", "SH601166", "SH601169", "SH601186", "SH601198", "SH601211", "SH601212", "SH601216", "SH601225", "SH601228", "SH601229", "SH601288", "SH601318", "SH601328", "SH601333", "SH601336", "SH601375", "SH601377", "SH601390", "SH601398", "SH601555", "SH601600", "SH601601", "SH601607", "SH601608", "SH601611", "SH601618", "SH601628", "SH601633", "SH601668", "SH601669", "SH601688", "SH601718", "SH601727", "SH601766", "SH601788", "SH601800", "SH601818", "SH601857", "SH601866", "SH601872", "SH601877", "SH601878", "SH601881", "SH601888", "SH601898", "SH601899", "SH601901", "SH601919", "SH601933", "SH601939", "SH601958", "SH601966", "SH601985", "SH601988", "SH601989", "SH601991", "SH601992", "SH601997", "SH601998", "SH603160", "SH603799", "SH603833", "SH603858", "SH603993"];

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
        return typeof obj.callback === "function" ? obj.callback(_this.filterStock()) : void 0;
      };
    })(this));
  };

  GameLogic.prototype.filterStock = function() {
    var aveRoe, i, info, len, roeTable, stockCode, stockInfo;
    stockInfo = [];
    for (i = 0, len = g_stockTable.length; i < len; i++) {
      stockCode = g_stockTable[i];
      stockCode = stockCode.slice(2, 8);
      roeTable = this.getROE(stockCode);
      aveRoe = utils.getAverage(roeTable);
      if (aveRoe > 18) {
        info = this._balanceObj[stockCode].getInfo();
        stockInfo.push(info + ("" + aveRoe) + global.year + "\n");
      }
    }
    return stockInfo;
  };

  GameLogic.prototype.getROE = function(stockCode) {
    var i, index, len, netAssets, netAssetsTable, netProfitsTable, roe, roeTable;
    netAssetsTable = this._balanceObj[stockCode].getNetAssets();
    netProfitsTable = this._profitObj[stockCode].getNetProfitTable();
    roeTable = [];
    for (index = i = 0, len = netAssetsTable.length; i < len; index = ++i) {
      netAssets = netAssetsTable[index];
      if (index >= netAssetsTable.length - 1) {
        break;
      }
      roe = ((netProfitsTable[index] / ((netAssets + netAssetsTable[index + 1]) / 2)) * 100).toFixed(2);
      roeTable.push(roe + "\t");
    }
    return roeTable;
  };

  GameLogic.prototype.getReceivableTurnoverDays = function(stockCode) {
    var days, daysTable, i, inComeValueTable, index, len, receivableValue, receivableValueTable;
    receivableValueTable = this._balanceObj[stockCode].getReceivableValue();
    inComeValueTable = this._profitObj[stockCode].getIncomeValue();
    daysTable = ["应收账款周转天数" + "\t"];
    console.log(receivableValueTable, inComeValueTable);
    for (index = i = 0, len = receivableValueTable.length; i < len; index = ++i) {
      receivableValue = receivableValueTable[index];
      if (index >= receivableValueTable.length - 1) {
        break;
      }
      days = 360 / inComeValueTable[index] * (receivableValue + receivableValueTable[index + 1]) / 2;
      daysTable.push(days + "\t");
    }
    return daysTable;
  };

  GameLogic.prototype._initTable = function() {
    var dir, i, len, stockCode;
    dir = "hs300";
    for (i = 0, len = g_stockTable.length; i < len; i++) {
      stockCode = g_stockTable[i];
      stockCode = stockCode.slice(2, 8);
      this._balanceObj[stockCode] = new BalanceSheet(dir, stockCode);
      this._profitObj[stockCode] = new ProfitStatement(dir, stockCode);
      this._cashFlowObj[stockCode] = new CashFlowStatement(dir, stockCode);
    }
  };

  return GameLogic;

})();

module.exports = GameLogic;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../event/ArkEventManager.coffee":3,"../event/ArkEventNames.coffee":4,"../globalValue.coffee":5,"../model/ArkUserData.coffee":7,"../model/BalanceSheet.coffee":8,"../model/CashFlowStatement.coffee":9,"../model/ProfitStatement.coffee":10,"../tools/ArkSceneManager.coffee":12,"../tools/utils.coffee":14}],3:[function(require,module,exports){
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

  BalanceSheet.prototype.getNetAssets = function() {
    return this.getValue(this._data["归属于母公司股东权益合计(万元)"]);
  };

  BalanceSheet.prototype._getNoNeedCalcItems = function() {
    return ["资料", "报告日期"];
  };

  BalanceSheet.prototype.getReceivableValue = function() {
    return this.getValue(this._data["应收账款(万元)"]);
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

  BalanceSheet.prototype.getCurrentRatio = function() {
    var currentAssets, currentAssetsTable, currentDebtsTable, currentRatio, i, index, len;
    currentAssetsTable = this.getValue(this._data["流动资产合计(万元)"]);
    currentDebtsTable = this.getValue(this._data["流动负债合计(万元)"]);
    currentRatio = [];
    for (index = i = 0, len = currentAssetsTable.length; i < len; index = ++i) {
      currentAssets = currentAssetsTable[index];
      currentRatio.push((currentAssets / currentDebtsTable[index]).toFixed(2));
    }
    return currentRatio;
  };

  BalanceSheet.prototype.getQuickRatio = function() {
    var currentAssets, currentAssetsTable, currentDebtsTable, i, index, inventoryTable, len, quickRatio;
    currentAssetsTable = this.getValue(this._data["流动资产合计(万元)"]);
    currentDebtsTable = this.getValue(this._data["流动负债合计(万元)"]);
    inventoryTable = this.getValue(this._data["存货(万元)"]);
    quickRatio = [];
    for (index = i = 0, len = currentAssetsTable.length; i < len; index = ++i) {
      currentAssets = currentAssetsTable[index];
      quickRatio.push(((currentAssets - inventoryTable[index]) / currentDebtsTable[index]).toFixed(2));
    }
    return quickRatio;
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
(function (global){
var ProfitStatement, TableBase, utils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TableBase = require("./TableBase.coffee");

utils = require('../tools/utils.coffee');

ProfitStatement = (function(superClass) {
  extend(ProfitStatement, superClass);

  function ProfitStatement() {
    return ProfitStatement.__super__.constructor.apply(this, arguments);
  }

  ProfitStatement.prototype.getFilePath = function() {
    return "res/" + this._stockType + "_json/lrb_" + this._stockCode + ".json";
  };

  ProfitStatement.prototype.getIncomeValue = function() {
    return this.getValue(this._data["营业收入(万元)"]);
  };

  ProfitStatement.prototype.getNetProfitAddRatio = function() {
    var addRatio, addTimes, netProfitTable;
    netProfitTable = this.getValue(this._data["净利润(万元)"]);
    addTimes = netProfitTable[0] / netProfitTable[netProfitTable.length - 1];
    addRatio = utils.getCompoundRate(addTimes, global.year);
    addRatio = ((addRatio - 1) * 100).toFixed(2);
    return addRatio;
  };

  ProfitStatement.prototype.getNetProfitTable = function() {
    return this.getValue(this._data["净利润(万元)"]);
  };

  return ProfitStatement;

})(TableBase);

module.exports = ProfitStatement;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../tools/utils.coffee":14,"./TableBase.coffee":11}],11:[function(require,module,exports){
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

  TableBase.prototype.getInfo = function() {
    return this._data["资料"][0] + "------" + this._data["资料"][2];
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

  TableBase.prototype._formatToInt = function(valueTable) {
    var i, intTable, len, value;
    intTable = [];
    for (i = 0, len = valueTable.length; i < len; i++) {
      value = valueTable[i];
      intTable.push(parseInt(value));
    }
    return intTable;
  };

  TableBase.prototype.getValue = function(data) {
    var i, index, len, valueTable, yearIndexTable;
    yearIndexTable = this._getYearValueIndex();
    valueTable = [];
    for (i = 0, len = yearIndexTable.length; i < len; i++) {
      index = yearIndexTable[i];
      valueTable.push(data[index]);
    }
    valueTable = valueTable.slice(0, this._getValueLength(valueTable.length));
    return this._formatToInt(valueTable);
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


},{}],13:[function(require,module,exports){
var ScrollView;

ScrollView = {
  createScrollView: function(targetNode) {
    var container, scrollView, size;
    size = targetNode.getContentSize();
    container = new cc.Node();
    scrollView = new cc.ScrollView(size, container);
    scrollView.setPosition(targetNode.getPosition());
    scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
    scrollView.setTouchEnabled(true);
    return scrollView;
  },
  initFromContainer: function(scrollView, inner) {
    var container;
    inner.setPosition({
      x: 0,
      y: 0
    });
    inner.setAnchorPoint({
      x: 0,
      y: 0
    });
    inner.removeFromParent();
    container = scrollView.getContainer();
    container.setContentSize(inner.getContentSize());
    return container.addChild(inner);
  },
  scrollJumpToTop: function(scrollView) {
    var container, offset;
    container = scrollView.getContainer();
    offset = scrollView.getViewSize().height - container.getContentSize().height;
    if (offset < 0) {
      return scrollView.setContentOffset({
        x: 0,
        y: offset
      });
    } else {
      return scrollView.setContentOffset({
        x: 0,
        y: 0
      });
    }
  }
};

module.exports = ScrollView;


},{}],14:[function(require,module,exports){
var utils;

utils = {
  getCompoundRate: function(addRate, time) {
    return Math.exp(1 / time * Math.log(addRate));
  },
  getAverage: function(table) {
    var ave, i, len, total, value;
    total = 0;
    for (i = 0, len = table.length; i < len; i++) {
      value = table[i];
      total += parseInt(value);
    }
    ave = (total / table.length).toFixed(2);
    return ave;
  }
};

module.exports = utils;


},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9nbG9iYWxWYWx1ZS5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiLCJzcmMvbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlIiwic3JjL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUiLCJzcmMvbW9kZWwvQ2FzaEZsb3dTdGF0ZW1lbnQuY29mZmVlIiwic3JjL21vZGVsL1Byb2ZpdFN0YXRlbWVudC5jb2ZmZWUiLCJzcmMvbW9kZWwvVGFibGVCYXNlLmNvZmZlZSIsInNyYy90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlIiwic3JjL3Rvb2xzL1Njcm9sbFZpZXcuY29mZmVlIiwic3JjL3Rvb2xzL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEFya01haW5EaWFsb2csIEFya1Njcm9sbFZpZXcsIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcywgZ19jbGlja190aW1lcztcblxuZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZScpO1xuXG5ldmVudE5hbWVzID0gcmVxdWlyZSgnLi4vZXZlbnQvQXJrRXZlbnROYW1lcy5jb2ZmZWUnKTtcblxuQXJrU2Nyb2xsVmlldyA9IHJlcXVpcmUoJy4uL3Rvb2xzL1Njcm9sbFZpZXcuY29mZmVlJyk7XG5cbmdfY2xpY2tfdGltZXMgPSAwO1xuXG5BcmtNYWluRGlhbG9nID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBBcmtNYWluRGlhbG9nKCkge31cblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5vbkRpZExvYWRGcm9tQ0NCID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fZGF0VGFibGUgPSBbXTtcbiAgICB0aGlzLl9yZXNldCgpO1xuICAgIHJldHVybiB0aGlzLmluaXQoKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5fcmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zY3JvbGxWaWV3ID0gbnVsbDtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5feWVhcnNFZGl0Qm94ID0gbnVsbDtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fc3RvY2tDb2RlRWRpdEJveCA9IHRoaXMuX2NyZWF0ZUVkaXRCb3godGhpcy5jY2JfdGV4dEZpZWxkXzEpO1xuICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQodGhpcy5fc3RvY2tDb2RlRWRpdEJveCk7XG4gICAgdGhpcy5feWVhcnNFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMik7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl95ZWFyc0VkaXRCb3gpO1xuICAgIHRoaXMuX2luaXREYXRhKCk7XG4gICAgdGhpcy5fc2Nyb2xsVmlldyA9IEFya1Njcm9sbFZpZXcuY3JlYXRlU2Nyb2xsVmlldyh0aGlzLmNjYl9zY3JvbGxWaWV3KTtcbiAgICB0aGlzLnJvb3ROb2RlLmFkZENoaWxkKHRoaXMuX3Njcm9sbFZpZXcpO1xuICAgIEFya1Njcm9sbFZpZXcuaW5pdEZyb21Db250YWluZXIodGhpcy5fc2Nyb2xsVmlldywgdGhpcy5jY2JfcmVzdWx0KTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5faW5pdERhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LnNldFN0cmluZyhcIjAwMDY1MVwiKTtcbiAgICByZXR1cm4gdGhpcy5feWVhcnNFZGl0Qm94LnNldFN0cmluZyhcIjZcIik7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUuX2NyZWF0ZUVkaXRCb3ggPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIGVkaXRCb3g7XG4gICAgZWRpdEJveCA9IG5ldyBjYy5FZGl0Qm94KGNjLnNpemUoMjAwLCA1MCkpO1xuICAgIGVkaXRCb3guc2V0UG9zaXRpb24obm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICBlZGl0Qm94LnNldElucHV0TW9kZShjYy5FRElUQk9YX0lOUFVUX01PREVfU0lOR0xFTElORSk7XG4gICAgZWRpdEJveC5zZXRSZXR1cm5UeXBlKGNjLktFWUJPQVJEX1JFVFVSTlRZUEVfRE9ORSk7XG4gICAgZWRpdEJveC5zZXRJbnB1dEZsYWcoY2MuRURJVEJPWF9JTlBVVF9GTEFHX0lOSVRJQUxfQ0FQU19TRU5URU5DRSk7XG4gICAgZWRpdEJveC5zZXRNYXhMZW5ndGgoMTMpO1xuICAgIGVkaXRCb3guc2V0Rm9udChcIkFyaWFsXCIsIDI2KTtcbiAgICBlZGl0Qm94LnNldEZvbnRDb2xvcihjYy5jb2xvcigxMDAsIDEwMCwgMjU1LCAyNTUpKTtcbiAgICByZXR1cm4gZWRpdEJveDtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5zaG93UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgdGhpcy5jY2JfcmVzdWx0LnNldFN0cmluZyhyZXN1bHQpO1xuICAgIEFya1Njcm9sbFZpZXcuaW5pdEZyb21Db250YWluZXIodGhpcy5fc2Nyb2xsVmlldywgdGhpcy5jY2JfcmVzdWx0KTtcbiAgICByZXR1cm4gQXJrU2Nyb2xsVmlldy5zY3JvbGxKdW1wVG9Ub3AodGhpcy5fc2Nyb2xsVmlldyk7XG4gIH07XG5cbiAgQXJrTWFpbkRpYWxvZy5wcm90b3R5cGUub25DYWxjID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0b2NrQ29kZSwgeWVhcnM7XG4gICAgc3RvY2tDb2RlID0gdGhpcy5fc3RvY2tDb2RlRWRpdEJveC5nZXRTdHJpbmcoKTtcbiAgICB5ZWFycyA9IHRoaXMuX3llYXJzRWRpdEJveC5nZXRTdHJpbmcoKTtcbiAgICBnbG9iYWwueWVhciA9IHllYXJzO1xuICAgIHJldHVybiBldmVudE1hbmFnZXIuc2VuZChldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwge1xuICAgICAgc3RvY2tDb2RlOiBzdG9ja0NvZGUsXG4gICAgICBjYWxsYmFjazogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuc2hvd1Jlc3VsdChzdHIpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcylcbiAgICB9KTtcbiAgfTtcblxuICBjYy5CdWlsZGVyUmVhZGVyLnJlZ2lzdGVyQ29udHJvbGxlcihcIkFya01haW5EaWFsb2dcIiwgbmV3IEFya01haW5EaWFsb2coKSk7XG5cbiAgcmV0dXJuIEFya01haW5EaWFsb2c7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQnVpbGRlclJlYWRlci5sb2FkKFwicmVzL21haW4uY2NiaVwiKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTJOaVZtbGxkeTlCY210TllXbHVSR2xoYkc5bkxtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMk5qWWxacFpYY3ZRWEpyVFdGcGJrUnBZV3h2Wnk1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRVHM3UVVGQlFTeFpRVUZCTEVkQlFXVXNUMEZCUVN4RFFVRlJMR2xEUVVGU096dEJRVU5tTEZWQlFVRXNSMEZCWVN4UFFVRkJMRU5CUVZFc0swSkJRVkk3TzBGQlEySXNZVUZCUVN4SFFVRm5RaXhQUVVGQkxFTkJRVkVzTkVKQlFWSTdPMEZCUldoQ0xHRkJRVUVzUjBGQlowSTdPMEZCUlZZN096c3dRa0ZEUml4blFrRkJRU3hIUVVGclFpeFRRVUZCTzBsQlEyUXNTVUZCUXl4RFFVRkJMRk5CUVVRc1IwRkJZVHRKUVVOaUxFbEJRVU1zUTBGQlFTeE5RVUZFTEVOQlFVRTdWMEZEUVN4SlFVRkRMRU5CUVVFc1NVRkJSQ3hEUVVGQk8wVkJTR003T3pCQ1FVdHNRaXhOUVVGQkxFZEJRVkVzVTBGQlFUdEpRVU5LTEVsQlFVTXNRMEZCUVN4WFFVRkVMRWRCUVdVN1NVRkRaaXhKUVVGRExFTkJRVUVzYVVKQlFVUXNSMEZCY1VJN1YwRkRja0lzU1VGQlF5eERRVUZCTEdGQlFVUXNSMEZCYVVJN1JVRklZanM3TUVKQlMxSXNTVUZCUVN4SFFVRk5MRk5CUVVFN1NVRkRSaXhKUVVGRExFTkJRVUVzYVVKQlFVUXNSMEZCY1VJc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCUXl4RFFVRkJMR1ZCUVdwQ08wbEJRM0pDTEVsQlFVTXNRMEZCUVN4UlFVRlJMRU5CUVVNc1VVRkJWaXhEUVVGdFFpeEpRVUZETEVOQlFVRXNhVUpCUVhCQ08wbEJSVUVzU1VGQlF5eERRVUZCTEdGQlFVUXNSMEZCYVVJc1NVRkJReXhEUVVGQkxHTkJRVVFzUTBGQlowSXNTVUZCUXl4RFFVRkJMR1ZCUVdwQ08wbEJRMnBDTEVsQlFVTXNRMEZCUVN4UlFVRlJMRU5CUVVNc1VVRkJWaXhEUVVGdFFpeEpRVUZETEVOQlFVRXNZVUZCY0VJN1NVRkZRU3hKUVVGRExFTkJRVUVzVTBGQlJDeERRVUZCTzBsQlJVRXNTVUZCUXl4RFFVRkJMRmRCUVVRc1IwRkJaU3hoUVVGaExFTkJRVU1zWjBKQlFXUXNRMEZCSzBJc1NVRkJReXhEUVVGQkxHTkJRV2hETzBsQlEyWXNTVUZCUXl4RFFVRkJMRkZCUVZFc1EwRkJReXhSUVVGV0xFTkJRVzFDTEVsQlFVTXNRMEZCUVN4WFFVRndRanRKUVVWQkxHRkJRV0VzUTBGQlF5eHBRa0ZCWkN4RFFVRm5ReXhKUVVGRExFTkJRVUVzVjBGQmFrTXNSVUZCT0VNc1NVRkJReXhEUVVGQkxGVkJRUzlETzBWQldrVTdPekJDUVdkQ1RpeFRRVUZCTEVkQlFWY3NVMEZCUVR0SlFVTlFMRWxCUVVNc1EwRkJRU3hwUWtGQmFVSXNRMEZCUXl4VFFVRnVRaXhEUVVFMlFpeFJRVUUzUWp0WFFVTkJMRWxCUVVNc1EwRkJRU3hoUVVGaExFTkJRVU1zVTBGQlppeERRVUY1UWl4SFFVRjZRanRGUVVaUE96c3dRa0ZKV0N4alFVRkJMRWRCUVdkQ0xGTkJRVU1zU1VGQlJEdEJRVU5hTEZGQlFVRTdTVUZCUVN4UFFVRkJMRWRCUVZVc1NVRkJTU3hGUVVGRkxFTkJRVU1zVDBGQlVDeERRVUZsTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1IwRkJVaXhGUVVGaExFVkJRV0lzUTBGQlpqdEpRVU5XTEU5QlFVOHNRMEZCUXl4WFFVRlNMRU5CUVc5Q0xFbEJRVWtzUTBGQlF5eFhRVUZNTEVOQlFVRXNRMEZCY0VJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRkZMRU5CUVVNc05rSkJRWGhDTzBsQlEwRXNUMEZCVHl4RFFVRkRMR0ZCUVZJc1EwRkJjMElzUlVGQlJTeERRVUZETEhkQ1FVRjZRanRKUVVOQkxFOUJRVThzUTBGQlF5eFpRVUZTTEVOQlFYRkNMRVZCUVVVc1EwRkJReXgzUTBGQmVFSTdTVUZEUVN4UFFVRlBMRU5CUVVNc1dVRkJVaXhEUVVGeFFpeEZRVUZ5UWp0SlFVTkJMRTlCUVU4c1EwRkJReXhQUVVGU0xFTkJRV2RDTEU5QlFXaENMRVZCUVhsQ0xFVkJRWHBDTzBsQlEwRXNUMEZCVHl4RFFVRkRMRmxCUVZJc1EwRkJjVUlzUlVGQlJTeERRVUZETEV0QlFVZ3NRMEZCVXl4SFFVRlVMRVZCUVdNc1IwRkJaQ3hGUVVGdFFpeEhRVUZ1UWl4RlFVRjNRaXhIUVVGNFFpeERRVUZ5UWp0QlFVTkJMRmRCUVU4N1JVRlVTenM3TUVKQlYyaENMRlZCUVVFc1IwRkJXU3hUUVVGRExFMUJRVVE3U1VGRFVpeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRk5CUVZvc1EwRkJjMElzVFVGQmRFSTdTVUZEUVN4aFFVRmhMRU5CUVVNc2FVSkJRV1FzUTBGQlowTXNTVUZCUXl4RFFVRkJMRmRCUVdwRExFVkJRVGhETEVsQlFVTXNRMEZCUVN4VlFVRXZRenRYUVVOQkxHRkJRV0VzUTBGQlF5eGxRVUZrTEVOQlFUaENMRWxCUVVNc1EwRkJRU3hYUVVFdlFqdEZRVWhST3pzd1FrRkxXaXhOUVVGQkxFZEJRVkVzVTBGQlFUdEJRVU5LTEZGQlFVRTdTVUZCUVN4VFFVRkJMRWRCUVZrc1NVRkJReXhEUVVGQkxHbENRVUZwUWl4RFFVRkRMRk5CUVc1Q0xFTkJRVUU3U1VGRFdpeExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMR0ZCUVdFc1EwRkJReXhUUVVGbUxFTkJRVUU3U1VGRFVpeE5RVUZOTEVOQlFVTXNTVUZCVUN4SFFVRmpPMWRCUldRc1dVRkJXU3hEUVVGRExFbEJRV0lzUTBGQmEwSXNWVUZCVlN4RFFVRkRMR1ZCUVRkQ0xFVkJRMGs3VFVGQlFTeFRRVUZCTEVWQlFWY3NVMEZCV0R0TlFVTkJMRkZCUVVFc1JVRkJWU3hEUVVGQkxGTkJRVUVzUzBGQlFUdGxRVUZCTEZOQlFVTXNSMEZCUkR0cFFrRkRUaXhMUVVGRExFTkJRVUVzVlVGQlJDeERRVUZaTEVkQlFWbzdVVUZFVFR0TlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUVzUTBGRVZqdExRVVJLTzBWQlRFazdPMFZCVlZJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eHJRa0ZCYWtJc1EwRkRTU3hsUVVSS0xFVkJSVWtzU1VGQlNTeGhRVUZLTEVOQlFVRXNRMEZHU2pzN096czdPMEZCUzBvc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhKUVVGcVFpeERRVUZ6UWl4bFFVRjBRaUo5XG4iLCJ2YXIgQmFsYW5jZVNoZWV0LCBDYXNoRmxvd1N0YXRlbWVudCwgR2FtZUxvZ2ljLCBQcm9maXRTdGF0ZW1lbnQsIFVzZXJEYXRhLCBldmVudE1hbmFnZXIsIGV2ZW50TmFtZXMsIGdfc3RvY2tUYWJsZSwgc2NlbmVNYW5hZ2VyLCB1dGlscztcblxuc2NlbmVNYW5hZ2VyID0gcmVxdWlyZSgnLi4vdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZScpO1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5Vc2VyRGF0YSA9IHJlcXVpcmUoJy4uL21vZGVsL0Fya1VzZXJEYXRhLmNvZmZlZScpO1xuXG5CYWxhbmNlU2hlZXQgPSByZXF1aXJlKCcuLi9tb2RlbC9CYWxhbmNlU2hlZXQuY29mZmVlJyk7XG5cblByb2ZpdFN0YXRlbWVudCA9IHJlcXVpcmUoJy4uL21vZGVsL1Byb2ZpdFN0YXRlbWVudC5jb2ZmZWUnKTtcblxuQ2FzaEZsb3dTdGF0ZW1lbnQgPSByZXF1aXJlKCcuLi9tb2RlbC9DYXNoRmxvd1N0YXRlbWVudC5jb2ZmZWUnKTtcblxucmVxdWlyZShcIi4uL2dsb2JhbFZhbHVlLmNvZmZlZVwiKTtcblxudXRpbHMgPSByZXF1aXJlKCcuLi90b29scy91dGlscy5jb2ZmZWUnKTtcblxuZ19zdG9ja1RhYmxlID0gW1wiU1owMDAwMDFcIiwgXCJTWjAwMDAwMlwiLCBcIlNaMDAwMDA4XCIsIFwiU1owMDAwNjBcIiwgXCJTWjAwMDA2M1wiLCBcIlNaMDAwMDY5XCIsIFwiU1owMDAxMDBcIiwgXCJTWjAwMDE1N1wiLCBcIlNaMDAwMTY2XCIsIFwiU1owMDAzMzNcIiwgXCJTWjAwMDMzOFwiLCBcIlNaMDAwNDAyXCIsIFwiU1owMDA0MTNcIiwgXCJTWjAwMDQxNVwiLCBcIlNaMDAwNDIzXCIsIFwiU1owMDA0MjVcIiwgXCJTWjAwMDUwM1wiLCBcIlNaMDAwNTM4XCIsIFwiU1owMDA1NDBcIiwgXCJTWjAwMDU1OVwiLCBcIlNaMDAwNTY4XCIsIFwiU1owMDA2MjNcIiwgXCJTWjAwMDYyNVwiLCBcIlNaMDAwNjI3XCIsIFwiU1owMDA2MzBcIiwgXCJTWjAwMDY1MVwiLCBcIlNaMDAwNjcxXCIsIFwiU1owMDA2ODZcIiwgXCJTWjAwMDcwOVwiLCBcIlNaMDAwNzIzXCIsIFwiU1owMDA3MjVcIiwgXCJTWjAwMDcyOFwiLCBcIlNaMDAwNzM4XCIsIFwiU1owMDA3NTBcIiwgXCJTWjAwMDc2OFwiLCBcIlNaMDAwNzc2XCIsIFwiU1owMDA3ODNcIiwgXCJTWjAwMDc5MlwiLCBcIlNaMDAwODI2XCIsIFwiU1owMDA4MzlcIiwgXCJTWjAwMDg1OFwiLCBcIlNaMDAwODc2XCIsIFwiU1owMDA4OTVcIiwgXCJTWjAwMDg5OFwiLCBcIlNaMDAwOTM4XCIsIFwiU1owMDA5NTlcIiwgXCJTWjAwMDk2MVwiLCBcIlNaMDAwOTYzXCIsIFwiU1owMDA5ODNcIiwgXCJTWjAwMTk3OVwiLCBcIlNaMDAyMDA3XCIsIFwiU1owMDIwMDhcIiwgXCJTWjAwMjAyNFwiLCBcIlNaMDAyMDI3XCIsIFwiU1owMDIwNDRcIiwgXCJTWjAwMjA2NVwiLCBcIlNaMDAyMDc0XCIsIFwiU1owMDIwODFcIiwgXCJTWjAwMjE0MlwiLCBcIlNaMDAyMTQ2XCIsIFwiU1owMDIxNTNcIiwgXCJTWjAwMjE3NFwiLCBcIlNaMDAyMjAyXCIsIFwiU1owMDIyMzBcIiwgXCJTWjAwMjIzNlwiLCBcIlNaMDAyMjQxXCIsIFwiU1owMDIyNTJcIiwgXCJTWjAwMjI5MlwiLCBcIlNaMDAyMjk0XCIsIFwiU1owMDIzMDRcIiwgXCJTWjAwMjMxMFwiLCBcIlNaMDAyMzUyXCIsIFwiU1owMDIzODVcIiwgXCJTWjAwMjQxMVwiLCBcIlNaMDAyNDE1XCIsIFwiU1owMDI0MjRcIiwgXCJTWjAwMjQyNlwiLCBcIlNaMDAyNDUwXCIsIFwiU1owMDI0NTZcIiwgXCJTWjAwMjQ2MFwiLCBcIlNaMDAyNDY1XCIsIFwiU1owMDI0NjZcIiwgXCJTWjAwMjQ2OFwiLCBcIlNaMDAyNDcwXCIsIFwiU1owMDI0NzVcIiwgXCJTWjAwMjUwMFwiLCBcIlNaMDAyNTA4XCIsIFwiU1owMDI1NTVcIiwgXCJTWjAwMjU1OFwiLCBcIlNaMDAyNTcyXCIsIFwiU1owMDI1OTRcIiwgXCJTWjAwMjYwMVwiLCBcIlNaMDAyNjAyXCIsIFwiU1owMDI2MDhcIiwgXCJTWjAwMjYyNFwiLCBcIlNaMDAyNjczXCIsIFwiU1owMDI3MTRcIiwgXCJTWjAwMjczNlwiLCBcIlNaMDAyNzM5XCIsIFwiU1owMDI3OTdcIiwgXCJTWjAwMjgzMVwiLCBcIlNaMDAyODM5XCIsIFwiU1owMDI4NDFcIiwgXCJTWjMwMDAwM1wiLCBcIlNaMzAwMDE1XCIsIFwiU1ozMDAwMTdcIiwgXCJTWjMwMDAyNFwiLCBcIlNaMzAwMDI3XCIsIFwiU1ozMDAwMzNcIiwgXCJTWjMwMDA1OVwiLCBcIlNaMzAwMDcwXCIsIFwiU1ozMDAwNzJcIiwgXCJTWjMwMDEyMlwiLCBcIlNaMzAwMTI0XCIsIFwiU1ozMDAxMzZcIiwgXCJTWjMwMDE0NFwiLCBcIlNaMzAwMjUxXCIsIFwiU1ozMDAzMTVcIiwgXCJTSDYwMDAwMFwiLCBcIlNINjAwMDA4XCIsIFwiU0g2MDAwMDlcIiwgXCJTSDYwMDAxMFwiLCBcIlNINjAwMDExXCIsIFwiU0g2MDAwMTVcIiwgXCJTSDYwMDAxNlwiLCBcIlNINjAwMDE4XCIsIFwiU0g2MDAwMTlcIiwgXCJTSDYwMDAyMVwiLCBcIlNINjAwMDIzXCIsIFwiU0g2MDAwMjhcIiwgXCJTSDYwMDAyOVwiLCBcIlNINjAwMDMwXCIsIFwiU0g2MDAwMzFcIiwgXCJTSDYwMDAzNlwiLCBcIlNINjAwMDM4XCIsIFwiU0g2MDAwNDhcIiwgXCJTSDYwMDA1MFwiLCBcIlNINjAwMDYxXCIsIFwiU0g2MDAwNjZcIiwgXCJTSDYwMDA2OFwiLCBcIlNINjAwMDc0XCIsIFwiU0g2MDAwODVcIiwgXCJTSDYwMDA4OVwiLCBcIlNINjAwMTAwXCIsIFwiU0g2MDAxMDRcIiwgXCJTSDYwMDEwOVwiLCBcIlNINjAwMTExXCIsIFwiU0g2MDAxMTVcIiwgXCJTSDYwMDExOFwiLCBcIlNINjAwMTUzXCIsIFwiU0g2MDAxNTdcIiwgXCJTSDYwMDE3MFwiLCBcIlNINjAwMTc3XCIsIFwiU0g2MDAxODhcIiwgXCJTSDYwMDE5NlwiLCBcIlNINjAwMjA4XCIsIFwiU0g2MDAyMTlcIiwgXCJTSDYwMDIyMVwiLCBcIlNINjAwMjMzXCIsIFwiU0g2MDAyNzFcIiwgXCJTSDYwMDI3NlwiLCBcIlNINjAwMjk3XCIsIFwiU0g2MDAzMDlcIiwgXCJTSDYwMDMzMlwiLCBcIlNINjAwMzQwXCIsIFwiU0g2MDAzNTJcIiwgXCJTSDYwMDM2MlwiLCBcIlNINjAwMzY5XCIsIFwiU0g2MDAzNzJcIiwgXCJTSDYwMDM3M1wiLCBcIlNINjAwMzc2XCIsIFwiU0g2MDAzODNcIiwgXCJTSDYwMDM5MFwiLCBcIlNINjAwNDA2XCIsIFwiU0g2MDA0MTVcIiwgXCJTSDYwMDQzNlwiLCBcIlNINjAwNDgyXCIsIFwiU0g2MDA0ODVcIiwgXCJTSDYwMDQ4OVwiLCBcIlNINjAwNDk4XCIsIFwiU0g2MDA1MThcIiwgXCJTSDYwMDUxOVwiLCBcIlNINjAwNTIyXCIsIFwiU0g2MDA1MzVcIiwgXCJTSDYwMDU0N1wiLCBcIlNINjAwNTQ5XCIsIFwiU0g2MDA1NzBcIiwgXCJTSDYwMDU4M1wiLCBcIlNINjAwNTg1XCIsIFwiU0g2MDA1ODhcIiwgXCJTSDYwMDYwNlwiLCBcIlNINjAwNjM3XCIsIFwiU0g2MDA2NDlcIiwgXCJTSDYwMDY2MFwiLCBcIlNINjAwNjYzXCIsIFwiU0g2MDA2NzRcIiwgXCJTSDYwMDY4MlwiLCBcIlNINjAwNjg1XCIsIFwiU0g2MDA2ODhcIiwgXCJTSDYwMDY5MFwiLCBcIlNINjAwNzAzXCIsIFwiU0g2MDA3MDRcIiwgXCJTSDYwMDcwNVwiLCBcIlNINjAwNzM5XCIsIFwiU0g2MDA3NDFcIiwgXCJTSDYwMDc5NVwiLCBcIlNINjAwODA0XCIsIFwiU0g2MDA4MTZcIiwgXCJTSDYwMDgyMFwiLCBcIlNINjAwODI3XCIsIFwiU0g2MDA4MzdcIiwgXCJTSDYwMDg3MVwiLCBcIlNINjAwODg2XCIsIFwiU0g2MDA4ODdcIiwgXCJTSDYwMDg5M1wiLCBcIlNINjAwODk1XCIsIFwiU0g2MDA5MDBcIiwgXCJTSDYwMDkwOVwiLCBcIlNINjAwOTE5XCIsIFwiU0g2MDA5MjZcIiwgXCJTSDYwMDk1OFwiLCBcIlNINjAwOTU5XCIsIFwiU0g2MDA5NzdcIiwgXCJTSDYwMDk5OVwiLCBcIlNINjAxMDA2XCIsIFwiU0g2MDEwMDlcIiwgXCJTSDYwMTAxMlwiLCBcIlNINjAxMDE4XCIsIFwiU0g2MDEwMjFcIiwgXCJTSDYwMTA4OFwiLCBcIlNINjAxMDk5XCIsIFwiU0g2MDExMTFcIiwgXCJTSDYwMTExN1wiLCBcIlNINjAxMTE4XCIsIFwiU0g2MDExNTVcIiwgXCJTSDYwMTE2M1wiLCBcIlNINjAxMTY2XCIsIFwiU0g2MDExNjlcIiwgXCJTSDYwMTE4NlwiLCBcIlNINjAxMTk4XCIsIFwiU0g2MDEyMTFcIiwgXCJTSDYwMTIxMlwiLCBcIlNINjAxMjE2XCIsIFwiU0g2MDEyMjVcIiwgXCJTSDYwMTIyOFwiLCBcIlNINjAxMjI5XCIsIFwiU0g2MDEyODhcIiwgXCJTSDYwMTMxOFwiLCBcIlNINjAxMzI4XCIsIFwiU0g2MDEzMzNcIiwgXCJTSDYwMTMzNlwiLCBcIlNINjAxMzc1XCIsIFwiU0g2MDEzNzdcIiwgXCJTSDYwMTM5MFwiLCBcIlNINjAxMzk4XCIsIFwiU0g2MDE1NTVcIiwgXCJTSDYwMTYwMFwiLCBcIlNINjAxNjAxXCIsIFwiU0g2MDE2MDdcIiwgXCJTSDYwMTYwOFwiLCBcIlNINjAxNjExXCIsIFwiU0g2MDE2MThcIiwgXCJTSDYwMTYyOFwiLCBcIlNINjAxNjMzXCIsIFwiU0g2MDE2NjhcIiwgXCJTSDYwMTY2OVwiLCBcIlNINjAxNjg4XCIsIFwiU0g2MDE3MThcIiwgXCJTSDYwMTcyN1wiLCBcIlNINjAxNzY2XCIsIFwiU0g2MDE3ODhcIiwgXCJTSDYwMTgwMFwiLCBcIlNINjAxODE4XCIsIFwiU0g2MDE4NTdcIiwgXCJTSDYwMTg2NlwiLCBcIlNINjAxODcyXCIsIFwiU0g2MDE4NzdcIiwgXCJTSDYwMTg3OFwiLCBcIlNINjAxODgxXCIsIFwiU0g2MDE4ODhcIiwgXCJTSDYwMTg5OFwiLCBcIlNINjAxODk5XCIsIFwiU0g2MDE5MDFcIiwgXCJTSDYwMTkxOVwiLCBcIlNINjAxOTMzXCIsIFwiU0g2MDE5MzlcIiwgXCJTSDYwMTk1OFwiLCBcIlNINjAxOTY2XCIsIFwiU0g2MDE5ODVcIiwgXCJTSDYwMTk4OFwiLCBcIlNINjAxOTg5XCIsIFwiU0g2MDE5OTFcIiwgXCJTSDYwMTk5MlwiLCBcIlNINjAxOTk3XCIsIFwiU0g2MDE5OThcIiwgXCJTSDYwMzE2MFwiLCBcIlNINjAzNzk5XCIsIFwiU0g2MDM4MzNcIiwgXCJTSDYwMzg1OFwiLCBcIlNINjAzOTkzXCJdO1xuXG5HYW1lTG9naWMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEdhbWVMb2dpYygpIHt9XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fYmFsYW5jZU9iaiA9IHt9O1xuICAgIHRoaXMuX3Byb2ZpdE9iaiA9IHt9O1xuICAgIHRoaXMuX2Nhc2hGbG93T2JqID0ge307XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMoKTtcbiAgICByZXR1cm4gdGhpcy5faW5pdFRhYmxlKCk7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fcmVnaXN0ZXJFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZXZlbnRNYW5hZ2VyLmxpc3RlbihldmVudE5hbWVzLkdBTUVfR0VUX1JFU1VMVCwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqLmNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgPyBvYmouY2FsbGJhY2soX3RoaXMuZmlsdGVyU3RvY2soKSkgOiB2b2lkIDA7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLmZpbHRlclN0b2NrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF2ZVJvZSwgaSwgaW5mbywgbGVuLCByb2VUYWJsZSwgc3RvY2tDb2RlLCBzdG9ja0luZm87XG4gICAgc3RvY2tJbmZvID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gZ19zdG9ja1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdG9ja0NvZGUgPSBnX3N0b2NrVGFibGVbaV07XG4gICAgICBzdG9ja0NvZGUgPSBzdG9ja0NvZGUuc2xpY2UoMiwgOCk7XG4gICAgICByb2VUYWJsZSA9IHRoaXMuZ2V0Uk9FKHN0b2NrQ29kZSk7XG4gICAgICBhdmVSb2UgPSB1dGlscy5nZXRBdmVyYWdlKHJvZVRhYmxlKTtcbiAgICAgIGlmIChhdmVSb2UgPiAxOCkge1xuICAgICAgICBpbmZvID0gdGhpcy5fYmFsYW5jZU9ialtzdG9ja0NvZGVdLmdldEluZm8oKTtcbiAgICAgICAgc3RvY2tJbmZvLnB1c2goaW5mbyArIChcIlwiICsgYXZlUm9lKSArIGdsb2JhbC55ZWFyICsgXCJcXG5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdG9ja0luZm87XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5nZXRST0UgPSBmdW5jdGlvbihzdG9ja0NvZGUpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGxlbiwgbmV0QXNzZXRzLCBuZXRBc3NldHNUYWJsZSwgbmV0UHJvZml0c1RhYmxlLCByb2UsIHJvZVRhYmxlO1xuICAgIG5ldEFzc2V0c1RhYmxlID0gdGhpcy5fYmFsYW5jZU9ialtzdG9ja0NvZGVdLmdldE5ldEFzc2V0cygpO1xuICAgIG5ldFByb2ZpdHNUYWJsZSA9IHRoaXMuX3Byb2ZpdE9ialtzdG9ja0NvZGVdLmdldE5ldFByb2ZpdFRhYmxlKCk7XG4gICAgcm9lVGFibGUgPSBbXTtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IG5ldEFzc2V0c1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIG5ldEFzc2V0cyA9IG5ldEFzc2V0c1RhYmxlW2luZGV4XTtcbiAgICAgIGlmIChpbmRleCA+PSBuZXRBc3NldHNUYWJsZS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcm9lID0gKChuZXRQcm9maXRzVGFibGVbaW5kZXhdIC8gKChuZXRBc3NldHMgKyBuZXRBc3NldHNUYWJsZVtpbmRleCArIDFdKSAvIDIpKSAqIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgIHJvZVRhYmxlLnB1c2gocm9lICsgXCJcXHRcIik7XG4gICAgfVxuICAgIHJldHVybiByb2VUYWJsZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLmdldFJlY2VpdmFibGVUdXJub3ZlckRheXMgPSBmdW5jdGlvbihzdG9ja0NvZGUpIHtcbiAgICB2YXIgZGF5cywgZGF5c1RhYmxlLCBpLCBpbkNvbWVWYWx1ZVRhYmxlLCBpbmRleCwgbGVuLCByZWNlaXZhYmxlVmFsdWUsIHJlY2VpdmFibGVWYWx1ZVRhYmxlO1xuICAgIHJlY2VpdmFibGVWYWx1ZVRhYmxlID0gdGhpcy5fYmFsYW5jZU9ialtzdG9ja0NvZGVdLmdldFJlY2VpdmFibGVWYWx1ZSgpO1xuICAgIGluQ29tZVZhbHVlVGFibGUgPSB0aGlzLl9wcm9maXRPYmpbc3RvY2tDb2RlXS5nZXRJbmNvbWVWYWx1ZSgpO1xuICAgIGRheXNUYWJsZSA9IFtcIuW6lOaUtui0puasvuWRqOi9rOWkqeaVsFwiICsgXCJcXHRcIl07XG4gICAgY29uc29sZS5sb2cocmVjZWl2YWJsZVZhbHVlVGFibGUsIGluQ29tZVZhbHVlVGFibGUpO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gcmVjZWl2YWJsZVZhbHVlVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuICAgICAgcmVjZWl2YWJsZVZhbHVlID0gcmVjZWl2YWJsZVZhbHVlVGFibGVbaW5kZXhdO1xuICAgICAgaWYgKGluZGV4ID49IHJlY2VpdmFibGVWYWx1ZVRhYmxlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkYXlzID0gMzYwIC8gaW5Db21lVmFsdWVUYWJsZVtpbmRleF0gKiAocmVjZWl2YWJsZVZhbHVlICsgcmVjZWl2YWJsZVZhbHVlVGFibGVbaW5kZXggKyAxXSkgLyAyO1xuICAgICAgZGF5c1RhYmxlLnB1c2goZGF5cyArIFwiXFx0XCIpO1xuICAgIH1cbiAgICByZXR1cm4gZGF5c1RhYmxlO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2luaXRUYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkaXIsIGksIGxlbiwgc3RvY2tDb2RlO1xuICAgIGRpciA9IFwiaHMzMDBcIjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBnX3N0b2NrVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0b2NrQ29kZSA9IGdfc3RvY2tUYWJsZVtpXTtcbiAgICAgIHN0b2NrQ29kZSA9IHN0b2NrQ29kZS5zbGljZSgyLCA4KTtcbiAgICAgIHRoaXMuX2JhbGFuY2VPYmpbc3RvY2tDb2RlXSA9IG5ldyBCYWxhbmNlU2hlZXQoZGlyLCBzdG9ja0NvZGUpO1xuICAgICAgdGhpcy5fcHJvZml0T2JqW3N0b2NrQ29kZV0gPSBuZXcgUHJvZml0U3RhdGVtZW50KGRpciwgc3RvY2tDb2RlKTtcbiAgICAgIHRoaXMuX2Nhc2hGbG93T2JqW3N0b2NrQ29kZV0gPSBuZXcgQ2FzaEZsb3dTdGF0ZW1lbnQoZGlyLCBzdG9ja0NvZGUpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gR2FtZUxvZ2ljO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMb2dpYztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTI5dWRISnZiQzlCY210SFlXMWxURzluYVdNdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMjl1ZEhKdmJDOUJjbXRIWVcxbFRHOW5hV011WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRTdPMEZCUVVFc1dVRkJRU3hIUVVGclFpeFBRVUZCTEVOQlFWRXNhVU5CUVZJN08wRkJRMnhDTEZsQlFVRXNSMEZCYTBJc1QwRkJRU3hEUVVGUkxHbERRVUZTT3p0QlFVTnNRaXhWUVVGQkxFZEJRV3RDTEU5QlFVRXNRMEZCVVN3clFrRkJVanM3UVVGRGJFSXNVVUZCUVN4SFFVRnJRaXhQUVVGQkxFTkJRVkVzTmtKQlFWSTdPMEZCUld4Q0xGbEJRVUVzUjBGQmEwSXNUMEZCUVN4RFFVRlJMRGhDUVVGU096dEJRVU5zUWl4bFFVRkJMRWRCUVhGQ0xFOUJRVUVzUTBGQlVTeHBRMEZCVWpzN1FVRkRja0lzYVVKQlFVRXNSMEZCZFVJc1QwRkJRU3hEUVVGUkxHMURRVUZTT3p0QlFVVjJRaXhQUVVGQkxFTkJRVkVzZFVKQlFWSTdPMEZCUTBFc1MwRkJRU3hIUVVGUkxFOUJRVUVzUTBGQlVTeDFRa0ZCVWpzN1FVRkhVaXhaUVVGQkxFZEJRV1VzUTBGQlF5eFZRVUZFTEVWQlFWa3NWVUZCV2l4RlFVRjFRaXhWUVVGMlFpeEZRVUZyUXl4VlFVRnNReXhGUVVFMlF5eFZRVUUzUXl4RlFVRjNSQ3hWUVVGNFJDeEZRVUZ0UlN4VlFVRnVSU3hGUVVFNFJTeFZRVUU1UlN4RlFVRjVSaXhWUVVGNlJpeEZRVUZ2Unl4VlFVRndSeXhGUVVFclJ5eFZRVUV2Unl4RlFVRXdTQ3hWUVVFeFNDeEZRVUZ4U1N4VlFVRnlTU3hGUVVGblNpeFZRVUZvU2l4RlFVRXlTaXhWUVVFelNpeEZRVUZ6U3l4VlFVRjBTeXhGUVVGcFRDeFZRVUZxVEN4RlFVRTBUQ3hWUVVFMVRDeEZRVUYxVFN4VlFVRjJUU3hGUVVGclRpeFZRVUZzVGl4RlFVRTJUaXhWUVVFM1RpeEZRVUYzVHl4VlFVRjRUeXhGUVVGdFVDeFZRVUZ1VUN4RlFVRTRVQ3hWUVVFNVVDeEZRVUY1VVN4VlFVRjZVU3hGUVVGdlVpeFZRVUZ3VWl4RlFVRXJVaXhWUVVFdlVpeEZRVUV3VXl4VlFVRXhVeXhGUVVGeFZDeFZRVUZ5VkN4RlFVRm5WU3hWUVVGb1ZTeEZRVUV5VlN4VlFVRXpWU3hGUVVGelZpeFZRVUYwVml4RlFVRnBWeXhWUVVGcVZ5eEZRVUUwVnl4VlFVRTFWeXhGUVVGMVdDeFZRVUYyV0N4RlFVRnJXU3hWUVVGc1dTeEZRVUUyV1N4VlFVRTNXU3hGUVVGM1dpeFZRVUY0V2l4RlFVRnRZU3hWUVVGdVlTeEZRVUU0WVN4VlFVRTVZU3hGUVVGNVlpeFZRVUY2WWl4RlFVRnZZeXhWUVVGd1l5eEZRVUVyWXl4VlFVRXZZeXhGUVVFd1pDeFZRVUV4WkN4RlFVRnhaU3hWUVVGeVpTeEZRVUZuWml4VlFVRm9aaXhGUVVFeVppeFZRVUV6Wml4RlFVRnpaMElzVlVGQmRHZENMRVZCUVdsb1FpeFZRVUZxYUVJc1JVRkJOR2hDTEZWQlFUVm9RaXhGUVVGMWFVSXNWVUZCZG1sQ0xFVkJRV3RxUWl4VlFVRnNha0lzUlVGQk5tcENMRlZCUVRkcVFpeEZRVUYzYTBJc1ZVRkJlR3RDTEVWQlFXMXNRaXhWUVVGdWJFSXNSVUZCT0d4Q0xGVkJRVGxzUWl4RlFVRjViVUlzVlVGQmVtMUNMRVZCUVc5dVFpeFZRVUZ3YmtJc1JVRkJLMjVDTEZWQlFTOXVRaXhGUVVFd2IwSXNWVUZCTVc5Q0xFVkJRWEZ3UWl4VlFVRnljRUlzUlVGQlozRkNMRlZCUVdoeFFpeEZRVUV5Y1VJc1ZVRkJNM0ZDTEVWQlFYTnlRaXhWUVVGMGNrSXNSVUZCYVhOQ0xGVkJRV3B6UWl4RlFVRTBjMElzVlVGQk5YTkNMRVZCUVhWMFFpeFZRVUYyZEVJc1JVRkJhM1ZDTEZWQlFXeDFRaXhGUVVFMmRVSXNWVUZCTjNWQ0xFVkJRWGQyUWl4VlFVRjRka0lzUlVGQmJYZENMRlZCUVc1M1FpeEZRVUU0ZDBJc1ZVRkJPWGRDTEVWQlFYbDRRaXhWUVVGNmVFSXNSVUZCYjNsQ0xGVkJRWEI1UWl4RlFVRXJlVUlzVlVGQkwzbENMRVZCUVRCNlFpeFZRVUV4ZWtJc1JVRkJjVEJDTEZWQlFYSXdRaXhGUVVGbk1VSXNWVUZCYURGQ0xFVkJRVEl4UWl4VlFVRXpNVUlzUlVGQmN6SkNMRlZCUVhReVFpeEZRVUZwTTBJc1ZVRkJhak5DTEVWQlFUUXpRaXhWUVVFMU0wSXNSVUZCZFRSQ0xGVkJRWFkwUWl4RlFVRnJOVUlzVlVGQmJEVkNMRVZCUVRZMVFpeFZRVUUzTlVJc1JVRkJkelpDTEZWQlFYZzJRaXhGUVVGdE4wSXNWVUZCYmpkQ0xFVkJRVGczUWl4VlFVRTVOMElzUlVGQmVUaENMRlZCUVhvNFFpeEZRVUZ2T1VJc1ZVRkJjRGxDTEVWQlFTczVRaXhWUVVFdk9VSXNSVUZCTUN0Q0xGVkJRVEVyUWl4RlFVRnhMMElzVlVGQmNpOUNMRVZCUVdkblF5eFZRVUZvWjBNc1JVRkJNbWRETEZWQlFUTm5ReXhGUVVGemFFTXNWVUZCZEdoRExFVkJRV2xwUXl4VlFVRnFhVU1zUlVGQk5HbERMRlZCUVRWcFF5eEZRVUYxYWtNc1ZVRkJkbXBETEVWQlFXdHJReXhWUVVGc2EwTXNSVUZCTm10RExGVkJRVGRyUXl4RlFVRjNiRU1zVlVGQmVHeERMRVZCUVcxdFF5eFZRVUZ1YlVNc1JVRkJPRzFETEZWQlFUbHRReXhGUVVGNWJrTXNWVUZCZW01RExFVkJRVzl2UXl4VlFVRndiME1zUlVGQksyOURMRlZCUVM5dlF5eEZRVUV3Y0VNc1ZVRkJNWEJETEVWQlFYRnhReXhWUVVGeWNVTXNSVUZCWjNKRExGVkJRV2h5UXl4RlFVRXlja01zVlVGQk0zSkRMRVZCUVhOelF5eFZRVUYwYzBNc1JVRkJhWFJETEZWQlFXcDBReXhGUVVFMGRFTXNWVUZCTlhSRExFVkJRWFYxUXl4VlFVRjJkVU1zUlVGQmEzWkRMRlZCUVd4MlF5eEZRVUUyZGtNc1ZVRkJOM1pETEVWQlFYZDNReXhWUVVGNGQwTXNSVUZCYlhoRExGVkJRVzU0UXl4RlFVRTRlRU1zVlVGQk9YaERMRVZCUVhsNVF5eFZRVUY2ZVVNc1JVRkJiM3BETEZWQlFYQjZReXhGUVVFcmVrTXNWVUZCTDNwRExFVkJRVEF3UXl4VlFVRXhNRU1zUlVGQmNURkRMRlZCUVhJeFF5eEZRVUZuTWtNc1ZVRkJhREpETEVWQlFUSXlReXhWUVVFek1rTXNSVUZCY3pORExGVkJRWFF6UXl4RlFVRnBORU1zVlVGQmFqUkRMRVZCUVRRMFF5eFZRVUUxTkVNc1JVRkJkVFZETEZWQlFYWTFReXhGUVVGck5rTXNWVUZCYkRaRExFVkJRVFkyUXl4VlFVRTNOa01zUlVGQmR6ZERMRlZCUVhnM1F5eEZRVUZ0T0VNc1ZVRkJiamhETEVWQlFUZzRReXhWUVVFNU9FTXNSVUZCZVRsRExGVkJRWG81UXl4RlFVRnZLME1zVlVGQmNDdERMRVZCUVNzclF5eFZRVUV2SzBNc1JVRkJNQzlETEZWQlFURXZReXhGUVVGeFowUXNWVUZCY21kRUxFVkJRV2RvUkN4VlFVRm9hRVFzUlVGQk1taEVMRlZCUVROb1JDeEZRVUZ6YVVRc1ZVRkJkR2xFTEVWQlFXbHFSQ3hWUVVGcWFrUXNSVUZCTkdwRUxGVkJRVFZxUkN4RlFVRjFhMFFzVlVGQmRtdEVMRVZCUVd0c1JDeFZRVUZzYkVRc1JVRkJObXhFTEZWQlFUZHNSQ3hGUVVGM2JVUXNWVUZCZUcxRUxFVkJRVzF1UkN4VlFVRnVia1FzUlVGQk9HNUVMRlZCUVRsdVJDeEZRVUY1YjBRc1ZVRkJlbTlFTEVWQlFXOXdSQ3hWUVVGd2NFUXNSVUZCSzNCRUxGVkJRUzl3UkN4RlFVRXdjVVFzVlVGQk1YRkVMRVZCUVhGeVJDeFZRVUZ5Y2tRc1JVRkJaM05FTEZWQlFXaHpSQ3hGUVVFeWMwUXNWVUZCTTNORUxFVkJRWE4wUkN4VlFVRjBkRVFzUlVGQmFYVkVMRlZCUVdwMVJDeEZRVUUwZFVRc1ZVRkJOWFZFTEVWQlFYVjJSQ3hWUVVGMmRrUXNSVUZCYTNkRUxGVkJRV3gzUkN4RlFVRTJkMFFzVlVGQk4zZEVMRVZCUVhkNFJDeFZRVUY0ZUVRc1JVRkJiWGxFTEZWQlFXNTVSQ3hGUVVFNGVVUXNWVUZCT1hsRUxFVkJRWGw2UkN4VlFVRjZla1FzUlVGQmJ6QkVMRlZCUVhBd1JDeEZRVUVyTUVRc1ZVRkJMekJFTEVWQlFUQXhSQ3hWUVVFeE1VUXNSVUZCY1RKRUxGVkJRWEl5UkN4RlFVRm5NMFFzVlVGQmFETkVMRVZCUVRJelJDeFZRVUV6TTBRc1JVRkJjelJFTEZWQlFYUTBSQ3hGUVVGcE5VUXNWVUZCYWpWRUxFVkJRVFExUkN4VlFVRTFOVVFzUlVGQmRUWkVMRlZCUVhZMlJDeEZRVUZyTjBRc1ZVRkJiRGRFTEVWQlFUWTNSQ3hWUVVFM04wUXNSVUZCZHpoRUxGVkJRWGc0UkN4RlFVRnRPVVFzVlVGQmJqbEVMRVZCUVRnNVJDeFZRVUU1T1VRc1JVRkJlU3RFTEZWQlFYb3JSQ3hGUVVGdkwwUXNWVUZCY0M5RUxFVkJRU3N2UkN4VlFVRXZMMFFzUlVGQk1HZEZMRlZCUVRGblJTeEZRVUZ4YUVVc1ZVRkJjbWhGTEVWQlFXZHBSU3hWUVVGb2FVVXNSVUZCTW1sRkxGVkJRVE5wUlN4RlFVRnpha1VzVlVGQmRHcEZMRVZCUVdsclJTeFZRVUZxYTBVc1JVRkJOR3RGTEZWQlFUVnJSU3hGUVVGMWJFVXNWVUZCZG14RkxFVkJRV3R0UlN4VlFVRnNiVVVzUlVGQk5tMUZMRlZCUVRkdFJTeEZRVUYzYmtVc1ZVRkJlRzVGTEVWQlFXMXZSU3hWUVVGdWIwVXNSVUZCT0c5RkxGVkJRVGx2UlN4RlFVRjVjRVVzVlVGQmVuQkZMRVZCUVc5eFJTeFZRVUZ3Y1VVc1JVRkJLM0ZGTEZWQlFTOXhSU3hGUVVFd2NrVXNWVUZCTVhKRkxFVkJRWEZ6UlN4VlFVRnljMFVzUlVGQlozUkZMRlZCUVdoMFJTeEZRVUV5ZEVVc1ZVRkJNM1JGTEVWQlFYTjFSU3hWUVVGMGRVVXNSVUZCYVhaRkxGVkJRV3AyUlN4RlFVRTBka1VzVlVGQk5YWkZMRVZCUVhWM1JTeFZRVUYyZDBVc1JVRkJhM2hGTEZWQlFXeDRSU3hGUVVFMmVFVXNWVUZCTjNoRkxFVkJRWGQ1UlN4VlFVRjRlVVVzUlVGQmJYcEZMRlZCUVc1NlJTeEZRVUU0ZWtVc1ZVRkJPWHBGTEVWQlFYa3dSU3hWUVVGNk1FVXNSVUZCYnpGRkxGVkJRWEF4UlN4RlFVRXJNVVVzVlVGQkx6RkZMRVZCUVRBeVJTeFZRVUV4TWtVc1JVRkJjVE5GTEZWQlFYSXpSU3hGUVVGbk5FVXNWVUZCYURSRkxFVkJRVEkwUlN4VlFVRXpORVVzUlVGQmN6VkZMRlZCUVhRMVJTeEZRVUZwTmtVc1ZVRkJhalpGTEVWQlFUUTJSU3hWUVVFMU5rVXNSVUZCZFRkRkxGVkJRWFkzUlN4RlFVRnJPRVVzVlVGQmJEaEZMRVZCUVRZNFJTeFZRVUUzT0VVc1JVRkJkemxGTEZWQlFYZzVSU3hGUVVGdEswVXNWVUZCYml0RkxFVkJRVGdyUlN4VlFVRTVLMFVzUlVGQmVTOUZMRlZCUVhvdlJTeEZRVUZ2WjBZc1ZVRkJjR2RHTEVWQlFTdG5SaXhWUVVFdlowWXNSVUZCTUdoR0xGVkJRVEZvUml4RlFVRnhhVVlzVlVGQmNtbEdMRVZCUVdkcVJpeFZRVUZvYWtZc1JVRkJNbXBHTEZWQlFUTnFSaXhGUVVGemEwWXNWVUZCZEd0R0xFVkJRV2xzUml4VlFVRnFiRVlzUlVGQk5HeEdMRlZCUVRWc1JpeEZRVUYxYlVZc1ZVRkJkbTFHTEVWQlFXdHVSaXhWUVVGc2JrWXNSVUZCTm01R0xGVkJRVGR1Uml4RlFVRjNiMFlzVlVGQmVHOUdMRVZCUVcxd1JpeFZRVUZ1Y0VZc1JVRkJPSEJHTEZWQlFUbHdSaXhGUVVGNWNVWXNWVUZCZW5GR0xFVkJRVzl5Uml4VlFVRndja1lzUlVGQkszSkdMRlZCUVM5eVJpeEZRVUV3YzBZc1ZVRkJNWE5HTEVWQlFYRjBSaXhWUVVGeWRFWXNSVUZCWjNWR0xGVkJRV2gxUml4RlFVRXlkVVlzVlVGQk0zVkdMRVZCUVhOMlJpeFZRVUYwZGtZc1JVRkJhWGRHTEZWQlFXcDNSaXhGUVVFMGQwWXNWVUZCTlhkR0xFVkJRWFY0Uml4VlFVRjJlRVlzUlVGQmEzbEdMRlZCUVd4NVJpeEZRVUUyZVVZc1ZVRkJOM2xHTEVWQlFYZDZSaXhWUVVGNGVrWXNSVUZCYlRCR0xGVkJRVzR3Uml4RlFVRTRNRVlzVlVGQk9UQkdMRVZCUVhreFJpeFZRVUY2TVVZc1JVRkJiekpHTEZWQlFYQXlSaXhGUVVFck1rWXNWVUZCTHpKR0xFVkJRVEF6Uml4VlFVRXhNMFlzUlVGQmNUUkdMRlZCUVhJMFJpeEZRVUZuTlVZc1ZVRkJhRFZHTEVWQlFUSTFSaXhWUVVFek5VWXNSVUZCY3paR0xGVkJRWFEyUml4RlFVRnBOMFlzVlVGQmFqZEdMRVZCUVRRM1JpeFZRVUUxTjBZc1JVRkJkVGhHTEZWQlFYWTRSaXhGUVVGck9VWXNWVUZCYkRsR0xFVkJRVFk1Uml4VlFVRTNPVVlzUlVGQmR5dEdMRlZCUVhnclJpeEZRVUZ0TDBZc1ZVRkJiaTlHTEVWQlFUZ3ZSaXhWUVVFNUwwWXNSVUZCZVdkSExGVkJRWHBuUnl4RlFVRnZhRWNzVlVGQmNHaEhMRVZCUVN0b1J5eFZRVUV2YUVjc1JVRkJNR2xITEZWQlFURnBSeXhGUVVGeGFrY3NWVUZCY21wSExFVkJRV2RyUnl4VlFVRm9hMGNzUlVGQk1tdEhMRlZCUVROclJ5eEZRVUZ6YkVjc1ZVRkJkR3hITEVWQlFXbHRSeXhWUVVGcWJVY3NSVUZCTkcxSExGVkJRVFZ0Unl4RlFVRjFia2NzVlVGQmRtNUhMRVZCUVd0dlJ5eFZRVUZzYjBjc1JVRkJObTlITEZWQlFUZHZSeXhGUVVGM2NFY3NWVUZCZUhCSExFVkJRVzF4Unl4VlFVRnVjVWNzUlVGQk9IRkhMRlZCUVRseFJ5eEZRVUY1Y2tjc1ZVRkJlbkpITEVWQlFXOXpSeXhWUVVGd2MwY3NSVUZCSzNOSExGVkJRUzl6Unl4RlFVRXdkRWNzVlVGQk1YUkhPenRCUVVkVU96czdjMEpCUTBZc1NVRkJRU3hIUVVGTkxGTkJRVUU3U1VGRFJpeEpRVUZETEVOQlFVRXNWMEZCUkN4SFFVRmxPMGxCUTJZc1NVRkJReXhEUVVGQkxGVkJRVVFzUjBGQll6dEpRVU5rTEVsQlFVTXNRMEZCUVN4WlFVRkVMRWRCUVdkQ08wbEJRMmhDTEVsQlFVTXNRMEZCUVN4bFFVRkVMRU5CUVVFN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlJDeERRVUZCTzBWQlRFVTdPM05DUVU5T0xHVkJRVUVzUjBGQmFVSXNVMEZCUVR0WFFVVmlMRmxCUVZrc1EwRkJReXhOUVVGaUxFTkJRVzlDTEZWQlFWVXNRMEZCUXl4bFFVRXZRaXhGUVVGblJDeERRVUZCTEZOQlFVRXNTMEZCUVR0aFFVRkJMRk5CUVVNc1IwRkJSRHR2UkVGRE5VTXNSMEZCUnl4RFFVRkRMRk5CUVZVc1MwRkJReXhEUVVGQkxGZEJRVVFzUTBGQlFUdE5RVVE0UWp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUVzUTBGQmFFUTdSVUZHWVRzN2MwSkJUV3BDTEZkQlFVRXNSMEZCWVN4VFFVRkJPMEZCUTFRc1VVRkJRVHRKUVVGQkxGTkJRVUVzUjBGQldUdEJRVU5hTEZOQlFVRXNPRU5CUVVFN08wMUJRMGtzVTBGQlFTeEhRVUZaTEZOQlFWTXNRMEZCUXl4TFFVRldMRU5CUVdkQ0xFTkJRV2hDTEVWQlFXMUNMRU5CUVc1Q08wMUJRMW9zVVVGQlFTeEhRVUZYTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVZFc1UwRkJVanROUVVOWUxFMUJRVUVzUjBGQlV5eExRVUZMTEVOQlFVTXNWVUZCVGl4RFFVRnBRaXhSUVVGcVFqdE5RVU5VTEVsQlFVY3NUVUZCUVN4SFFVRlRMRVZCUVZvN1VVRkRTU3hKUVVGQkxFZEJRVThzU1VGQlF5eERRVUZCTEZkQlFWa3NRMEZCUVN4VFFVRkJMRU5CUVZVc1EwRkJReXhQUVVGNFFpeERRVUZCTzFGQlExQXNVMEZCVXl4RFFVRkRMRWxCUVZZc1EwRkJaU3hKUVVGQkxFZEJRVThzUTBGQlFTeEZRVUZCTEVkQlFVY3NUVUZCU0N4RFFVRlFMRWRCUVhGQ0xFMUJRVTBzUTBGQlF5eEpRVUUxUWl4SFFVRnRReXhKUVVGc1JDeEZRVVpLT3p0QlFVcEtPMEZCVDBFc1YwRkJUenRGUVZSRk96dHpRa0ZYWWl4TlFVRkJMRWRCUVZFc1UwRkJReXhUUVVGRU8wRkJRMG9zVVVGQlFUdEpRVUZCTEdOQlFVRXNSMEZCYVVJc1NVRkJReXhEUVVGQkxGZEJRVmtzUTBGQlFTeFRRVUZCTEVOQlFWVXNRMEZCUXl4WlFVRjRRaXhEUVVGQk8wbEJRMnBDTEdWQlFVRXNSMEZCYTBJc1NVRkJReXhEUVVGQkxGVkJRVmNzUTBGQlFTeFRRVUZCTEVOQlFWVXNRMEZCUXl4cFFrRkJka0lzUTBGQlFUdEpRVU5zUWl4UlFVRkJMRWRCUVZjN1FVRkRXQ3hUUVVGQkxHZEZRVUZCT3p0TlFVTkpMRWxCUVZNc1MwRkJRU3hKUVVGVExHTkJRV01zUTBGQlF5eE5RVUZtTEVkQlFYZENMRU5CUVRGRE8wRkJRVUVzWTBGQlFUczdUVUZEUVN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExHVkJRV2RDTEVOQlFVRXNTMEZCUVN4RFFVRm9RaXhIUVVGNVFpeERRVUZETEVOQlFVTXNVMEZCUVN4SFFVRlpMR05CUVdVc1EwRkJRU3hMUVVGQkxFZEJRVkVzUTBGQlVpeERRVUUxUWl4RFFVRkJMRWRCUVRCRExFTkJRVE5ETEVOQlFURkNMRU5CUVVFc1IwRkJNa1VzUjBGQk5VVXNRMEZCWjBZc1EwRkJReXhQUVVGcVJpeERRVUY1Uml4RFFVRjZSanROUVVOT0xGRkJRVkVzUTBGQlF5eEpRVUZVTEVOQlFXTXNSMEZCUVN4SFFVRk5MRWxCUVhCQ08wRkJTRW83UVVGSlFTeFhRVUZQTzBWQlVrZzdPM05DUVZWU0xIbENRVUZCTEVkQlFUSkNMRk5CUVVNc1UwRkJSRHRCUVVOMlFpeFJRVUZCTzBsQlFVRXNiMEpCUVVFc1IwRkJkVUlzU1VGQlF5eERRVUZCTEZkQlFWa3NRMEZCUVN4VFFVRkJMRU5CUVZVc1EwRkJReXhyUWtGQmVFSXNRMEZCUVR0SlFVTjJRaXhuUWtGQlFTeEhRVUZ0UWl4SlFVRkRMRU5CUVVFc1ZVRkJWeXhEUVVGQkxGTkJRVUVzUTBGQlZTeERRVUZETEdOQlFYWkNMRU5CUVVFN1NVRkRia0lzVTBGQlFTeEhRVUZaTEVOQlFVTXNWVUZCUVN4SFFVRmhMRWxCUVdRN1NVRkRXaXhQUVVGUExFTkJRVU1zUjBGQlVpeERRVUZaTEc5Q1FVRmFMRVZCUVd0RExHZENRVUZzUXp0QlFVTkJMRk5CUVVFc2MwVkJRVUU3TzAxQlEwa3NTVUZCVXl4TFFVRkJMRWxCUVZNc2IwSkJRVzlDTEVOQlFVTXNUVUZCY2tJc1IwRkJPRUlzUTBGQmFFUTdRVUZCUVN4alFVRkJPenROUVVOQkxFbEJRVUVzUjBGQlR5eEhRVUZCTEVkQlFVMHNaMEpCUVdsQ0xFTkJRVUVzUzBGQlFTeERRVUYyUWl4SFFVRm5ReXhEUVVGRExHVkJRVUVzUjBGQmEwSXNiMEpCUVhGQ0xFTkJRVUVzUzBGQlFTeEhRVUZSTEVOQlFWSXNRMEZCZUVNc1EwRkJhRU1zUjBGQmMwWTdUVUZETjBZc1UwRkJVeXhEUVVGRExFbEJRVllzUTBGQlpTeEpRVUZCTEVkQlFVOHNTVUZCZEVJN1FVRklTanRCUVVsQkxGZEJRVTg3UlVGVVowSTdPM05DUVZjelFpeFZRVUZCTEVkQlFWa3NVMEZCUVR0QlFVTlNMRkZCUVVFN1NVRkJRU3hIUVVGQkxFZEJRVTA3UVVGRFRpeFRRVUZCTERoRFFVRkJPenROUVVOSkxGTkJRVUVzUjBGQldTeFRRVUZUTEVOQlFVTXNTMEZCVml4RFFVRm5RaXhEUVVGb1FpeEZRVUZ0UWl4RFFVRnVRanROUVVOYUxFbEJRVU1zUTBGQlFTeFhRVUZaTEVOQlFVRXNVMEZCUVN4RFFVRmlMRWRCUVRCQ0xFbEJRVWtzV1VGQlNpeERRVUZwUWl4SFFVRnFRaXhGUVVGelFpeFRRVUYwUWp0TlFVTXhRaXhKUVVGRExFTkJRVUVzVlVGQlZ5eERRVUZCTEZOQlFVRXNRMEZCV2l4SFFVRjVRaXhKUVVGSkxHVkJRVW9zUTBGQmIwSXNSMEZCY0VJc1JVRkJlVUlzVTBGQmVrSTdUVUZEZWtJc1NVRkJReXhEUVVGQkxGbEJRV0VzUTBGQlFTeFRRVUZCTEVOQlFXUXNSMEZCTWtJc1NVRkJTU3hwUWtGQlNpeERRVUZ6UWl4SFFVRjBRaXhGUVVFeVFpeFRRVUV6UWp0QlFVb3ZRanRGUVVaUk96czdPenM3UVVGVGFFSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIEV2ZW50TWFuYWdlcjtcblxuRXZlbnRNYW5hZ2VyID0ge1xuICBzZW5kOiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICB2YXIgZXZlbnQ7XG4gICAgZXZlbnQgPSBuZXcgY2MuRXZlbnRDdXN0b20oZXZlbnROYW1lKTtcbiAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgZXZlbnQuc2V0VXNlckRhdGEoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBjYy5ldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0sXG4gIGxpc3RlbjogZnVuY3Rpb24oZXZlbnROYW1lLCBsaXN0ZW5GdW5jLCBub2RlT3JQcmlvcml0eSkge1xuICAgIHZhciBjY0xpc3RlbmVyO1xuICAgIGlmIChub2RlT3JQcmlvcml0eSA9PSBudWxsKSB7XG4gICAgICBub2RlT3JQcmlvcml0eSA9IDE7XG4gICAgfVxuICAgIGNjTGlzdGVuZXIgPSBjYy5FdmVudExpc3RlbmVyLmNyZWF0ZSh7XG4gICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5DVVNUT00sXG4gICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gbGlzdGVuRnVuYyhldmVudC5nZXRVc2VyRGF0YSgpLCBldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihjY0xpc3RlbmVyLCBub2RlT3JQcmlvcml0eSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5STllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyVjJaVzUwTDBGeWEwVjJaVzUwVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlF5eFRRVUZFTEVWQlFWa3NTVUZCV2p0QlFVTkdMRkZCUVVFN1NVRkJRU3hMUVVGQkxFZEJRVkVzU1VGQlNTeEZRVUZGTEVOQlFVTXNWMEZCVUN4RFFVRnRRaXhUUVVGdVFqdEpRVU5TTEVsQlFVa3NTVUZCUVN4TFFVRlJMRWxCUVZvN1RVRkRTU3hMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZyUWl4SlFVRnNRaXhGUVVSS096dFhRVVZCTEVWQlFVVXNRMEZCUXl4WlFVRlpMRU5CUVVNc1lVRkJhRUlzUTBGQk9FSXNTMEZCT1VJN1JVRktSU3hEUVVGT08wVkJTMEVzVFVGQlFTeEZRVUZSTEZOQlFVTXNVMEZCUkN4RlFVRlpMRlZCUVZvc1JVRkJkMElzWTBGQmVFSTdRVUZEU2l4UlFVRkJPenROUVVGQkxHbENRVUZyUWpzN1NVRkRiRUlzVlVGQlFTeEhRVUZoTEVWQlFVVXNRMEZCUXl4aFFVRmhMRU5CUVVNc1RVRkJha0lzUTBGRFZEdE5RVUZCTEV0QlFVRXNSVUZCVHl4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRWGhDTzAxQlEwRXNVMEZCUVN4RlFVRlhMRk5CUkZnN1RVRkZRU3hSUVVGQkxFVkJRVlVzVTBGQlF5eExRVUZFTzBGQlEwNHNaVUZCVHl4VlFVRkJMRU5CUVZjc1MwRkJTeXhEUVVGRExGZEJRVTRzUTBGQlFTeERRVUZZTEVWQlFXZERMRXRCUVdoRE8wMUJSRVFzUTBGR1ZqdExRVVJUTzFkQlRXSXNSVUZCUlN4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGb1FpeERRVUUwUWl4VlFVRTFRaXhGUVVGM1F5eGpRVUY0UXp0RlFWSkpMRU5CVEZJN096dEJRV05LTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBFdmVudE5hbWVzO1xuXG5FdmVudE5hbWVzID0ge1xuICBHQU1FX1NUQVJUOiBcImdhbWUuc3RhcnRcIixcbiAgR0FNRV9FTkQ6IFwiZ2FtZS5lbmRcIixcbiAgR0FNRV9ORVhUX0xFVkVMOiBcImdhbWUubmV4dC5sZXZlbFwiLFxuICBHQU1FX0dFVF9SRVNVTFQ6IFwiZ2FtZS5nZXQucmVzdWx0XCIsXG4gIEdBTUVfSU5JVF9UQUJMRTogXCJnYW1lLmluaXQudGFibGVcIlxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE5hbWVzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaWFpsYm5RdlFYSnJSWFpsYm5ST1lXMWxjeTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZkR0Z2ZDNVdmMzUjFaSGt2UVhKcllXUXZRWEpyWVdSSFlXMWxMM055WXk5bGRtVnVkQzlCY210RmRtVnVkRTVoYldWekxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZCT3p0QlFVRkJMRlZCUVVFc1IwRkRTVHRGUVVGQkxGVkJRVUVzUlVGQmEwSXNXVUZCYkVJN1JVRkRRU3hSUVVGQkxFVkJRV3RDTEZWQlJHeENPMFZCUlVFc1pVRkJRU3hGUVVGclFpeHBRa0ZHYkVJN1JVRkpRU3hsUVVGQkxFVkJRV3RDTEdsQ1FVcHNRanRGUVV0QkxHVkJRVUVzUlVGQmEwSXNhVUpCVEd4Q096czdRVUZQU2l4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiIsImdsb2JhbC55ZWFyID0gNjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WjJ4dlltRnNWbUZzZFdVdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaMnh2WW1Gc1ZtRnNkV1V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEUxQlFVMHNRMEZCUXl4SlFVRlFMRWRCUVdNaWZRPT1cbiIsImNjLmdhbWUub25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgR2FtZUxvZ2ljLCBnYW1lRGlhbG9nLCBnYW1lTG9naWNPYmosIHNjZW5lTWFuYWdlcjtcbiAgY2Mudmlldy5hZGp1c3RWaWV3UG9ydCh0cnVlKTtcbiAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgxMTM2LCA2NDAsIGNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwpO1xuICBjYy52aWV3LmVuYWJsZUF1dG9GdWxsU2NyZWVuKGZhbHNlKTtcbiAgY2Mudmlldy5yZXNpemVXaXRoQnJvd3NlclNpemUodHJ1ZSk7XG4gIGNjLkJ1aWxkZXJSZWFkZXIuc2V0UmVzb3VyY2VQYXRoKFwicmVzL1wiKTtcbiAgc2NlbmVNYW5hZ2VyID0gcmVxdWlyZShcIi4vdG9vbHMvQXJrU2NlbmVNYW5hZ2VyLmNvZmZlZVwiKTtcbiAgc2NlbmVNYW5hZ2VyLmluaXQoKTtcbiAgZ2FtZURpYWxvZyA9IHJlcXVpcmUoJy4vY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZScpO1xuICBzY2VuZU1hbmFnZXIuYWRkTGF5ZXJUb1NjZW5lKGdhbWVEaWFsb2cpO1xuICBHYW1lTG9naWMgPSByZXF1aXJlKCcuL2NvbnRyb2wvQXJrR2FtZUxvZ2ljLmNvZmZlZScpO1xuICBnYW1lTG9naWNPYmogPSBuZXcgR2FtZUxvZ2ljKCk7XG4gIHJldHVybiBnYW1lTG9naWNPYmouaW5pdCgpO1xufTtcblxuY2MuZ2FtZS5ydW4oKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12YldGcGJpNWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTl0WVdsdUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVZJc1IwRkJhMElzVTBGQlFUdEJRVU5rTEUxQlFVRTdSVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRVklzUTBGQmRVSXNTVUZCZGtJN1JVRkRRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEhWQ1FVRlNMRU5CUVdkRExFbEJRV2hETEVWQlFYTkRMRWRCUVhSRExFVkJRVEpETEVWQlFVVXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eFJRVUV2UkR0RlFVTkJMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zYjBKQlFWSXNRMEZCTmtJc1MwRkJOMEk3UlVGRFFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMSEZDUVVGU0xFTkJRVGhDTEVsQlFUbENPMFZCUTBFc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eGxRVUZxUWl4RFFVRnBReXhOUVVGcVF6dEZRVVZCTEZsQlFVRXNSMEZCWlN4UFFVRkJMRU5CUVZFc1owTkJRVkk3UlVGRFppeFpRVUZaTEVOQlFVTXNTVUZCWWl4RFFVRkJPMFZCUlVFc1ZVRkJRU3hIUVVGaExFOUJRVUVzUTBGQlVTeG5RMEZCVWp0RlFVTmlMRmxCUVZrc1EwRkJReXhsUVVGaUxFTkJRVFpDTEZWQlFUZENPMFZCUlVFc1UwRkJRU3hIUVVGWkxFOUJRVUVzUTBGQlVTd3JRa0ZCVWp0RlFVTmFMRmxCUVVFc1IwRkJaU3hKUVVGSkxGTkJRVW9zUTBGQlFUdFRRVU5tTEZsQlFWa3NRMEZCUXl4SlFVRmlMRU5CUVVFN1FVRm1ZenM3UVVGclFteENMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlVpeERRVUZCSW4wPVxuIiwidmFyIFVzZXJEYXRhO1xuXG5Vc2VyRGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVXNlckRhdGEoKSB7XG4gICAgdGhpcy5fc2NvcmUgPSAwO1xuICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgfVxuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRTY29yZSA9IGZ1bmN0aW9uKF9zY29yZSkge1xuICAgIHRoaXMuX3Njb3JlID0gX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRTY29yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29yZTtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuc2V0Q291bnQgPSBmdW5jdGlvbihfY291bnQpIHtcbiAgICB0aGlzLl9jb3VudCA9IF9jb3VudDtcbiAgfTtcblxuICBVc2VyRGF0YS5wcm90b3R5cGUuZ2V0Q291bnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnQ7XG4gIH07XG5cbiAgcmV0dXJuIFVzZXJEYXRhO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJEYXRhO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRWEpyVlhObGNrUmhkR0V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRTdPMEZCUVUwN1JVRkRWeXhyUWtGQlFUdEpRVU5VTEVsQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZVN1NVRkRWaXhKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTzBWQlJrUTdPM0ZDUVVsaUxGRkJRVUVzUjBGQlZTeFRRVUZETEUxQlFVUTdTVUZCUXl4SlFVRkRMRU5CUVVFc1UwRkJSRHRGUVVGRU96dHhRa0ZGVml4UlFVRkJMRWRCUVZVc1UwRkJRVHRYUVVGSExFbEJRVU1zUTBGQlFUdEZRVUZLT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlF5eE5RVUZFTzBsQlFVTXNTVUZCUXl4RFFVRkJMRk5CUVVRN1JVRkJSRHM3Y1VKQlJWWXNVVUZCUVN4SFFVRlZMRk5CUVVFN1YwRkJSeXhKUVVGRExFTkJRVUU3UlVGQlNqczdPenM3TzBGQlJXUXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIEJhbGFuY2VTaGVldCwgVGFibGVCYXNlLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5CYWxhbmNlU2hlZXQgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQmFsYW5jZVNoZWV0LCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBCYWxhbmNlU2hlZXQoKSB7XG4gICAgcmV0dXJuIEJhbGFuY2VTaGVldC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0RmlsZVBhdGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJyZXMvXCIgKyB0aGlzLl9zdG9ja1R5cGUgKyBcIl9qc29uL3pjZnpiX1wiICsgdGhpcy5fc3RvY2tDb2RlICsgXCIuanNvblwiO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0Q2FzaFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIui0p+W4gei1hOmHkSjkuIflhYMpXCJdKTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldFRvdGFsQXNzZXRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIui1hOS6p+aAu+iuoSjkuIflhYMpXCJdKTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldE5ldEFzc2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLlvZLlsZ7kuo7mr43lhazlj7jogqHkuJzmnYPnm4rlkIjorqEo5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5fZ2V0Tm9OZWVkQ2FsY0l0ZW1zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtcIui1hOaWmVwiLCBcIuaKpeWRiuaXpeacn1wiXTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldFJlY2VpdmFibGVWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLlupTmlLbotKbmrL4o5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5kdW1wUGVyY2VudFRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFzc2V0c1BlcmNlbnRUYWJsZSwgY2VsVmFsdWUsIGksIGluZGV4LCBrZXksIGxlbiwgcGVyY2VudCwgcGVyY2VudFRhYmxlLCByZWYsIHJlZjEsIHRvdGFsQXNzZXRzLCB2YWx1ZTtcbiAgICB0b3RhbEFzc2V0cyA9IHRoaXMuZ2V0VG90YWxBc3NldHMoKTtcbiAgICBhc3NldHNQZXJjZW50VGFibGUgPSBbXTtcbiAgICByZWYgPSB0aGlzLl9kYXRhO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsdWUgPSByZWZba2V5XTtcbiAgICAgIHBlcmNlbnRUYWJsZSA9IFtrZXkgKyBcIlxcdFxcdFxcdFxcdFxcdFwiXTtcbiAgICAgIGlmICh2YWx1ZVswXSA9PT0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpbmRleE9mLmNhbGwodGhpcy5fZ2V0Tm9OZWVkQ2FsY0l0ZW1zKCksIGtleSkgPj0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlZjEgPSB0aGlzLmdldFZhbHVlKHZhbHVlKTtcbiAgICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gcmVmMS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICAgIGNlbFZhbHVlID0gcmVmMVtpbmRleF07XG4gICAgICAgIHBlcmNlbnQgPSBjZWxWYWx1ZSAvIHRvdGFsQXNzZXRzW2luZGV4XSAqIDEwMDtcbiAgICAgICAgcGVyY2VudFRhYmxlLnB1c2gocGVyY2VudC50b0ZpeGVkKDIpKTtcbiAgICAgICAgcGVyY2VudFRhYmxlLnB1c2goXCJcXHRcXHRcXHRcXHRcIik7XG4gICAgICB9XG4gICAgICBwZXJjZW50VGFibGUucHVzaChcIlxcblwiKTtcbiAgICAgIGFzc2V0c1BlcmNlbnRUYWJsZS5wdXNoKHBlcmNlbnRUYWJsZSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGFzc2V0c1BlcmNlbnRUYWJsZSwgbnVsbCwgXCJcXHRcIikpO1xuICAgIHJldHVybiBhc3NldHNQZXJjZW50VGFibGU7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5nZXRDdXJyZW50UmF0aW8gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudEFzc2V0cywgY3VycmVudEFzc2V0c1RhYmxlLCBjdXJyZW50RGVidHNUYWJsZSwgY3VycmVudFJhdGlvLCBpLCBpbmRleCwgbGVuO1xuICAgIGN1cnJlbnRBc3NldHNUYWJsZSA9IHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIua1geWKqOi1hOS6p+WQiOiuoSjkuIflhYMpXCJdKTtcbiAgICBjdXJyZW50RGVidHNUYWJsZSA9IHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIua1geWKqOi0n+WAuuWQiOiuoSjkuIflhYMpXCJdKTtcbiAgICBjdXJyZW50UmF0aW8gPSBbXTtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IGN1cnJlbnRBc3NldHNUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICBjdXJyZW50QXNzZXRzID0gY3VycmVudEFzc2V0c1RhYmxlW2luZGV4XTtcbiAgICAgIGN1cnJlbnRSYXRpby5wdXNoKChjdXJyZW50QXNzZXRzIC8gY3VycmVudERlYnRzVGFibGVbaW5kZXhdKS50b0ZpeGVkKDIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnRSYXRpbztcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldFF1aWNrUmF0aW8gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudEFzc2V0cywgY3VycmVudEFzc2V0c1RhYmxlLCBjdXJyZW50RGVidHNUYWJsZSwgaSwgaW5kZXgsIGludmVudG9yeVRhYmxlLCBsZW4sIHF1aWNrUmF0aW87XG4gICAgY3VycmVudEFzc2V0c1RhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5rWB5Yqo6LWE5Lqn5ZCI6K6hKOS4h+WFgylcIl0pO1xuICAgIGN1cnJlbnREZWJ0c1RhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5rWB5Yqo6LSf5YC65ZCI6K6hKOS4h+WFgylcIl0pO1xuICAgIGludmVudG9yeVRhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5a2Y6LSnKOS4h+WFgylcIl0pO1xuICAgIHF1aWNrUmF0aW8gPSBbXTtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IGN1cnJlbnRBc3NldHNUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICBjdXJyZW50QXNzZXRzID0gY3VycmVudEFzc2V0c1RhYmxlW2luZGV4XTtcbiAgICAgIHF1aWNrUmF0aW8ucHVzaCgoKGN1cnJlbnRBc3NldHMgLSBpbnZlbnRvcnlUYWJsZVtpbmRleF0pIC8gY3VycmVudERlYnRzVGFibGVbaW5kZXhdKS50b0ZpeGVkKDIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHF1aWNrUmF0aW87XG4gIH07XG5cbiAgcmV0dXJuIEJhbGFuY2VTaGVldDtcblxufSkoVGFibGVCYXNlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWxhbmNlU2hlZXQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UW1Gc1lXNWpaVk5vWldWMExtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMjF2WkdWc0wwSmhiR0Z1WTJWVGFHVmxkQzVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFTeDFRa0ZCUVR0RlFVRkJPenM3TzBGQlFVRXNVMEZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3h2UWtGQlVqczdRVUZIVURzN096czdPenQ1UWtGRFRDeFhRVUZCTEVkQlFWa3NVMEZCUVR0WFFVTllMRTFCUVVFc1IwRkJUeXhKUVVGRExFTkJRVUVzVlVGQlVpeEhRVUZ0UWl4alFVRnVRaXhIUVVGcFF5eEpRVUZETEVOQlFVRXNWVUZCYkVNc1IwRkJOa003UlVGRWJFTTdPM2xDUVVkYUxGbEJRVUVzUjBGQll5eFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZWQlFVRXNRMEZCYWtJN1JVRkJTRHM3ZVVKQlJXUXNZMEZCUVN4SFFVRm5RaXhUUVVGQk8xZEJRVWNzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxGVkJRVUVzUTBGQmFrSTdSVUZCU0RzN2VVSkJSV2hDTEZsQlFVRXNSMEZCWXl4VFFVRkJPMWRCUVVjc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMR3RDUVVGQkxFTkJRV3BDTzBWQlFVZzdPM2xDUVVWa0xHMUNRVUZCTEVkQlFYRkNMRk5CUVVFN1YwRkJSeXhEUVVGRExFbEJRVVFzUlVGQlR5eE5RVUZRTzBWQlFVZzdPM2xDUVVWeVFpeHJRa0ZCUVN4SFFVRnZRaXhUUVVGQk8xZEJRVWNzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxGVkJRVUVzUTBGQmFrSTdSVUZCU0RzN2VVSkJSWEJDTEdkQ1FVRkJMRWRCUVd0Q0xGTkJRVUU3UVVGRGFrSXNVVUZCUVR0SlFVRkJMRmRCUVVFc1IwRkJZeXhKUVVGRExFTkJRVUVzWTBGQlJDeERRVUZCTzBsQlEyUXNhMEpCUVVFc1IwRkJjVUk3UVVGRGNrSTdRVUZCUVN4VFFVRkJMRlZCUVVFN08wMUJRME1zV1VGQlFTeEhRVUZsTEVOQlFVTXNSMEZCUVN4SFFVRk5MRmxCUVZBN1RVRkRaaXhKUVVGWkxFdEJRVTBzUTBGQlFTeERRVUZCTEVOQlFVNHNTMEZCV1N4RFFVRjRRanRCUVVGQkxHbENRVUZCT3p0TlFVTkJMRWxCUVZrc1lVRkJUeXhKUVVGRExFTkJRVUVzYlVKQlFVUXNRMEZCUVN4RFFVRlFMRVZCUVVFc1IwRkJRU3hOUVVGYU8wRkJRVUVzYVVKQlFVRTdPMEZCUTBFN1FVRkJRU3hYUVVGQkxITkVRVUZCT3p0UlFVTkRMRTlCUVVFc1IwRkJWU3hSUVVGQkxFZEJRVmNzVjBGQldTeERRVUZCTEV0QlFVRXNRMEZCZGtJc1IwRkJaME03VVVGRE1VTXNXVUZCV1N4RFFVRkRMRWxCUVdJc1EwRkJhMElzVDBGQlR5eERRVUZETEU5QlFWSXNRMEZCWjBJc1EwRkJhRUlzUTBGQmJFSTdVVUZEUVN4WlFVRlpMRU5CUVVNc1NVRkJZaXhEUVVGclFpeFZRVUZzUWp0QlFVaEVPMDFCU1VFc1dVRkJXU3hEUVVGRExFbEJRV0lzUTBGQmEwSXNTVUZCYkVJN1RVRkRRU3hyUWtGQmEwSXNRMEZCUXl4SlFVRnVRaXhEUVVGM1FpeFpRVUY0UWp0QlFWUkVPMGxCVlVFc1QwRkJUeXhEUVVGRExFZEJRVklzUTBGQldTeEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMR3RDUVVGbUxFVkJRVzFETEVsQlFXNURMRVZCUVhsRExFbEJRWHBETEVOQlFWbzdRVUZEUVN4WFFVRlBPMFZCWkZVN08zbENRV2RDYkVJc1pVRkJRU3hIUVVGcFFpeFRRVUZCTzBGQlEyaENMRkZCUVVFN1NVRkJRU3hyUWtGQlFTeEhRVUZ4UWl4SlFVRkRMRU5CUVVFc1VVRkJSQ3hEUVVGVkxFbEJRVU1zUTBGQlFTeExRVUZOTEVOQlFVRXNXVUZCUVN4RFFVRnFRanRKUVVOeVFpeHBRa0ZCUVN4SFFVRnZRaXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1dVRkJRU3hEUVVGcVFqdEpRVU53UWl4WlFVRkJMRWRCUVdVN1FVRkRaaXhUUVVGQkxHOUZRVUZCT3p0TlFVTkRMRmxCUVZrc1EwRkJReXhKUVVGaUxFTkJRV3RDTEVOQlFVTXNZVUZCUVN4SFFVRm5RaXhwUWtGQmEwSXNRMEZCUVN4TFFVRkJMRU5CUVc1RExFTkJRVEJETEVOQlFVTXNUMEZCTTBNc1EwRkJiVVFzUTBGQmJrUXNRMEZCYkVJN1FVRkVSRHRYUVVWQk8wVkJUbWRDT3p0NVFrRlJha0lzWVVGQlFTeEhRVUZsTEZOQlFVRTdRVUZEWkN4UlFVRkJPMGxCUVVFc2EwSkJRVUVzUjBGQmNVSXNTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZsQlFVRXNRMEZCYWtJN1NVRkRja0lzYVVKQlFVRXNSMEZCYjBJc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRmxCUVVFc1EwRkJha0k3U1VGRGNFSXNZMEZCUVN4SFFVRnBRaXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1VVRkJRU3hEUVVGcVFqdEpRVU5xUWl4VlFVRkJMRWRCUVdFN1FVRkRZaXhUUVVGQkxHOUZRVUZCT3p0TlFVTkRMRlZCUVZVc1EwRkJReXhKUVVGWUxFTkJRV2RDTEVOQlFVTXNRMEZCUXl4aFFVRkJMRWRCUVdkQ0xHTkJRV1VzUTBGQlFTeExRVUZCTEVOQlFXaERMRU5CUVVFc1IwRkJNRU1zYVVKQlFXdENMRU5CUVVFc1MwRkJRU3hEUVVFM1JDeERRVUZ2UlN4RFFVRkRMRTlCUVhKRkxFTkJRVFpGTEVOQlFUZEZMRU5CUVdoQ08wRkJSRVE3VjBGRlFUdEZRVkJqT3pzN08wZEJkRU5YT3p0QlFTdERNMElzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiIsInZhciBDYXNoRmxvd1N0YXRlbWVudCwgVGFibGVCYXNlLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuVGFibGVCYXNlID0gcmVxdWlyZShcIi4vVGFibGVCYXNlLmNvZmZlZVwiKTtcblxuQ2FzaEZsb3dTdGF0ZW1lbnQgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoQ2FzaEZsb3dTdGF0ZW1lbnQsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIENhc2hGbG93U3RhdGVtZW50KCkge1xuICAgIHJldHVybiBDYXNoRmxvd1N0YXRlbWVudC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIENhc2hGbG93U3RhdGVtZW50LnByb3RvdHlwZS5nZXRGaWxlUGF0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInJlcy9cIiArIHRoaXMuX3N0b2NrVHlwZSArIFwiX2pzb24veGpsbGJfXCIgKyB0aGlzLl9zdG9ja0NvZGUgKyBcIi5qc29uXCI7XG4gIH07XG5cbiAgcmV0dXJuIENhc2hGbG93U3RhdGVtZW50O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhc2hGbG93U3RhdGVtZW50O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlEyRnphRVpzYjNkVGRHRjBaVzFsYm5RdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlEyRnphRVpzYjNkVGRHRjBaVzFsYm5RdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUVzTkVKQlFVRTdSVUZCUVRzN08wRkJRVUVzVTBGQlFTeEhRVUZoTEU5QlFVRXNRMEZCVVN4dlFrRkJVanM3UVVGRlVEczdPenM3T3pzNFFrRkZUQ3hYUVVGQkxFZEJRV0VzVTBGQlFUdFhRVU5hTEUxQlFVRXNSMEZCVHl4SlFVRkRMRU5CUVVFc1ZVRkJVaXhIUVVGdFFpeGpRVUZ1UWl4SFFVRnBReXhKUVVGRExFTkJRVUVzVlVGQmJFTXNSMEZCTmtNN1JVRkVha003T3pzN1IwRkdhMEk3TzBGQlMyaERMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIFByb2ZpdFN0YXRlbWVudCwgVGFibGVCYXNlLCB1dGlscyxcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cblRhYmxlQmFzZSA9IHJlcXVpcmUoXCIuL1RhYmxlQmFzZS5jb2ZmZWVcIik7XG5cbnV0aWxzID0gcmVxdWlyZSgnLi4vdG9vbHMvdXRpbHMuY29mZmVlJyk7XG5cblByb2ZpdFN0YXRlbWVudCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChQcm9maXRTdGF0ZW1lbnQsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFByb2ZpdFN0YXRlbWVudCgpIHtcbiAgICByZXR1cm4gUHJvZml0U3RhdGVtZW50Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgUHJvZml0U3RhdGVtZW50LnByb3RvdHlwZS5nZXRGaWxlUGF0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInJlcy9cIiArIHRoaXMuX3N0b2NrVHlwZSArIFwiX2pzb24vbHJiX1wiICsgdGhpcy5fc3RvY2tDb2RlICsgXCIuanNvblwiO1xuICB9O1xuXG4gIFByb2ZpdFN0YXRlbWVudC5wcm90b3R5cGUuZ2V0SW5jb21lVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi6JCl5Lia5pS25YWlKOS4h+WFgylcIl0pO1xuICB9O1xuXG4gIFByb2ZpdFN0YXRlbWVudC5wcm90b3R5cGUuZ2V0TmV0UHJvZml0QWRkUmF0aW8gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWRkUmF0aW8sIGFkZFRpbWVzLCBuZXRQcm9maXRUYWJsZTtcbiAgICBuZXRQcm9maXRUYWJsZSA9IHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuWHgOWIqea2pijkuIflhYMpXCJdKTtcbiAgICBhZGRUaW1lcyA9IG5ldFByb2ZpdFRhYmxlWzBdIC8gbmV0UHJvZml0VGFibGVbbmV0UHJvZml0VGFibGUubGVuZ3RoIC0gMV07XG4gICAgYWRkUmF0aW8gPSB1dGlscy5nZXRDb21wb3VuZFJhdGUoYWRkVGltZXMsIGdsb2JhbC55ZWFyKTtcbiAgICBhZGRSYXRpbyA9ICgoYWRkUmF0aW8gLSAxKSAqIDEwMCkudG9GaXhlZCgyKTtcbiAgICByZXR1cm4gYWRkUmF0aW87XG4gIH07XG5cbiAgUHJvZml0U3RhdGVtZW50LnByb3RvdHlwZS5nZXROZXRQcm9maXRUYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLlh4DliKnmtqYo5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgcmV0dXJuIFByb2ZpdFN0YXRlbWVudDtcblxufSkoVGFibGVCYXNlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9maXRTdGF0ZW1lbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2VUhKdlptbDBVM1JoZEdWdFpXNTBMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDIxdlpHVnNMMUJ5YjJacGRGTjBZWFJsYldWdWRDNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4cFEwRkJRVHRGUVVGQk96czdRVUZCUVN4VFFVRkJMRWRCUVdFc1QwRkJRU3hEUVVGUkxHOUNRVUZTT3p0QlFVTmlMRXRCUVVFc1IwRkJWU3hQUVVGQkxFTkJRVkVzZFVKQlFWSTdPMEZCUlVvN096czdPenM3TkVKQlEwd3NWMEZCUVN4SFFVRmhMRk5CUVVFN1YwRkRXaXhOUVVGQkxFZEJRVThzU1VGQlF5eERRVUZCTEZWQlFWSXNSMEZCYlVJc1dVRkJia0lzUjBGQkswSXNTVUZCUXl4RFFVRkJMRlZCUVdoRExFZEJRVEpETzBWQlJDOUNPenMwUWtGSFlpeGpRVUZCTEVkQlFXZENMRk5CUVVFN1YwRkJSeXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1ZVRkJRU3hEUVVGcVFqdEZRVUZJT3pzMFFrRkZhRUlzYjBKQlFVRXNSMEZCYzBJc1UwRkJRVHRCUVVOeVFpeFJRVUZCTzBsQlFVRXNZMEZCUVN4SFFVRnBRaXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1UwRkJRU3hEUVVGcVFqdEpRVU5xUWl4UlFVRkJMRWRCUVZjc1kwRkJaU3hEUVVGQkxFTkJRVUVzUTBGQlppeEhRVUZ2UWl4alFVRmxMRU5CUVVFc1kwRkJZeXhEUVVGRExFMUJRV1lzUjBGQmQwSXNRMEZCZUVJN1NVRkRPVU1zVVVGQlFTeEhRVUZYTEV0QlFVc3NRMEZCUXl4bFFVRk9MRU5CUVhOQ0xGRkJRWFJDTEVWQlFXZERMRTFCUVUwc1EwRkJReXhKUVVGMlF6dEpRVU5ZTEZGQlFVRXNSMEZCVnl4RFFVRkRMRU5CUVVNc1VVRkJRU3hIUVVGWExFTkJRVm9zUTBGQlFTeEhRVUZwUWl4SFFVRnNRaXhEUVVGelFpeERRVUZETEU5QlFYWkNMRU5CUVN0Q0xFTkJRUzlDTzFkQlExZzdSVUZNY1VJN096UkNRVTkwUWl4cFFrRkJRU3hIUVVGdlFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZOQlFVRXNRMEZCYWtJN1JVRkJTRHM3T3p0SFFXSlRPenRCUVdVNVFpeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUo5XG4iLCJ2YXIgVGFibGVCYXNlO1xuXG5UYWJsZUJhc2UgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRhYmxlQmFzZShfc3RvY2tUeXBlLCBfc3RvY2tDb2RlKSB7XG4gICAgdGhpcy5fc3RvY2tUeXBlID0gX3N0b2NrVHlwZTtcbiAgICB0aGlzLl9zdG9ja0NvZGUgPSBfc3RvY2tDb2RlO1xuICAgIHRoaXMuX2RhdGEgPSBbXTtcbiAgICB0aGlzLl9sb2FkSnNvbigpO1xuICB9XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5nZXRGaWxlUGF0aCA9IGZ1bmN0aW9uKCkge307XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fbG9hZEpzb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsZVBhdGg7XG4gICAgZmlsZVBhdGggPSB0aGlzLmdldEZpbGVQYXRoKCk7XG4gICAgcmV0dXJuIGNjLmxvYWRlci5sb2FkSnNvbihmaWxlUGF0aCwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0SW5mbyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhW1wi6LWE5paZXCJdWzBdICsgXCItLS0tLS1cIiArIHRoaXMuX2RhdGFbXCLotYTmlplcIl1bMl07XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fZ2V0U2hvd051bWJlciA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgIHJldHVybiAoKG51bWJlciAvIDEwMDAwMCkudG9GaXhlZCgyKSkgKyBcIiDkur9cIjtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldEZvcm1hdE51bWJlclRhYmxlID0gZnVuY3Rpb24obnVtYmVyVGFibGUpIHtcbiAgICB2YXIgZm9ybWF0VGFibGUsIGksIGxlbiwgbnVtYmVyO1xuICAgIGZvcm1hdFRhYmxlID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gbnVtYmVyVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG51bWJlciA9IG51bWJlclRhYmxlW2ldO1xuICAgICAgZm9ybWF0VGFibGUucHVzaCh0aGlzLl9nZXRTaG93TnVtYmVyKG51bWJlcikpO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0VGFibGU7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fZ2V0WWVhclZhbHVlSW5kZXggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGluZGV4VGFibGUsIGxlbiwgcmVmLCB0aW1lU3RyO1xuICAgIGluZGV4VGFibGUgPSBbXTtcbiAgICByZWYgPSB0aGlzLl9kYXRhW1wi5oql5ZGK5pel5pyfXCJdO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIHRpbWVTdHIgPSByZWZbaW5kZXhdO1xuICAgICAgaWYgKHRpbWVTdHIuaW5kZXhPZihcIjEyLTMxXCIpICE9PSAtMSkge1xuICAgICAgICBpbmRleFRhYmxlLnB1c2goaW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXhUYWJsZTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9nZXRWYWx1ZUxlbmd0aCA9IGZ1bmN0aW9uKHZhbHVlTGVuZ3RoKSB7XG4gICAgdmFyIGxlbmd0aDtcbiAgICBpZiAodmFsdWVMZW5ndGggPCBnbG9iYWwueWVhcikge1xuICAgICAgbGVuZ3RoID0gdmFsdWVMZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IGdsb2JhbC55ZWFyO1xuICAgIH1cbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2Zvcm1hdFRvSW50ID0gZnVuY3Rpb24odmFsdWVUYWJsZSkge1xuICAgIHZhciBpLCBpbnRUYWJsZSwgbGVuLCB2YWx1ZTtcbiAgICBpbnRUYWJsZSA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHZhbHVlVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhbHVlID0gdmFsdWVUYWJsZVtpXTtcbiAgICAgIGludFRhYmxlLnB1c2gocGFyc2VJbnQodmFsdWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGludFRhYmxlO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGksIGluZGV4LCBsZW4sIHZhbHVlVGFibGUsIHllYXJJbmRleFRhYmxlO1xuICAgIHllYXJJbmRleFRhYmxlID0gdGhpcy5fZ2V0WWVhclZhbHVlSW5kZXgoKTtcbiAgICB2YWx1ZVRhYmxlID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0geWVhckluZGV4VGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGluZGV4ID0geWVhckluZGV4VGFibGVbaV07XG4gICAgICB2YWx1ZVRhYmxlLnB1c2goZGF0YVtpbmRleF0pO1xuICAgIH1cbiAgICB2YWx1ZVRhYmxlID0gdmFsdWVUYWJsZS5zbGljZSgwLCB0aGlzLl9nZXRWYWx1ZUxlbmd0aCh2YWx1ZVRhYmxlLmxlbmd0aCkpO1xuICAgIHJldHVybiB0aGlzLl9mb3JtYXRUb0ludCh2YWx1ZVRhYmxlKTtcbiAgfTtcblxuICByZXR1cm4gVGFibGVCYXNlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQmFzZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZWR0ZpYkdWQ1lYTmxMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDIxdlpHVnNMMVJoWW14bFFtRnpaUzVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCVFR0RlFVTlJMRzFDUVVGRExGVkJRVVFzUlVGQll5eFZRVUZrTzBsQlFVTXNTVUZCUXl4RFFVRkJMR0ZCUVVRN1NVRkJZU3hKUVVGRExFTkJRVUVzWVVGQlJEdEpRVU14UWl4SlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGVE8wbEJRMVFzU1VGQlF5eERRVUZCTEZOQlFVUXNRMEZCUVR0RlFVWlpPenR6UWtGSllpeFhRVUZCTEVkQlFXRXNVMEZCUVN4SFFVRkJPenR6UWtGRllpeFRRVUZCTEVkQlFWY3NVMEZCUVR0QlFVTldMRkZCUVVFN1NVRkJRU3hSUVVGQkxFZEJRVmNzU1VGQlF5eERRVUZCTEZkQlFVUXNRMEZCUVR0WFFVTllMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4UlFVRnVRaXhGUVVFMlFpeERRVUZCTEZOQlFVRXNTMEZCUVR0aFFVRkJMRk5CUVVNc1MwRkJSQ3hGUVVGUkxFbEJRVkk3WlVGRE5VSXNTMEZCUXl4RFFVRkJMRXRCUVVRc1IwRkJVenROUVVSdFFqdEpRVUZCTEVOQlFVRXNRMEZCUVN4RFFVRkJMRWxCUVVFc1EwRkJOMEk3UlVGR1ZUczdjMEpCUzFnc1QwRkJRU3hIUVVGVExGTkJRVUU3VjBGQlJ5eEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRWxCUVVFc1EwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQllpeEhRVUZyUWl4UlFVRnNRaXhIUVVFMlFpeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRWxCUVVFc1EwRkJUU3hEUVVGQkxFTkJRVUU3UlVGQk4wTTdPM05DUVVWVUxHTkJRVUVzUjBGQmFVSXNVMEZCUXl4TlFVRkVPMEZCUTJoQ0xGZEJRVk1zUTBGQlF5eERRVUZETEUxQlFVRXNSMEZCVXl4TlFVRldMRU5CUVdsQ0xFTkJRVU1zVDBGQmJFSXNRMEZCTUVJc1EwRkJNVUlzUTBGQlJDeERRVUZCTEVkQlFUaENPMFZCUkhaQ096dHpRa0ZIYWtJc2IwSkJRVUVzUjBGQmMwSXNVMEZCUXl4WFFVRkVPMEZCUTNKQ0xGRkJRVUU3U1VGQlFTeFhRVUZCTEVkQlFXTTdRVUZEWkN4VFFVRkJMRFpEUVVGQk96dE5RVU5ETEZkQlFWY3NRMEZCUXl4SlFVRmFMRU5CUVdsQ0xFbEJRVU1zUTBGQlFTeGpRVUZFTEVOQlFXZENMRTFCUVdoQ0xFTkJRV3BDTzBGQlJFUTdRVUZGUVN4WFFVRlBPMFZCU21NN08zTkNRVTEwUWl4clFrRkJRU3hIUVVGdlFpeFRRVUZCTzBGQlEyNUNMRkZCUVVFN1NVRkJRU3hWUVVGQkxFZEJRV0U3UVVGRFlqdEJRVUZCTEZOQlFVRXNjVVJCUVVFN08wMUJRME1zU1VGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVWl4RFFVRm5RaXhQUVVGb1FpeERRVUZCTEV0QlFUaENMRU5CUVVNc1EwRkJiRU03VVVGRFF5eFZRVUZWTEVOQlFVTXNTVUZCV0N4RFFVRm5RaXhMUVVGb1FpeEZRVVJFT3p0QlFVUkVPMEZCUjBFc1YwRkJUenRGUVV4Wk96dHpRa0ZQY0VJc1pVRkJRU3hIUVVGcFFpeFRRVUZETEZkQlFVUTdRVUZEYUVJc1VVRkJRVHRKUVVGQkxFbEJRVWNzVjBGQlFTeEhRVUZqTEUxQlFVMHNRMEZCUXl4SlFVRjRRanROUVVORExFMUJRVUVzUjBGQlV5eFpRVVJXTzB0QlFVRXNUVUZCUVR0TlFVZERMRTFCUVVFc1IwRkJVeXhOUVVGTkxFTkJRVU1zUzBGSWFrSTdPMWRCU1VFN1JVRk1aMEk3TzNOQ1FVOXFRaXhaUVVGQkxFZEJRV01zVTBGQlF5eFZRVUZFTzBGQlEySXNVVUZCUVR0SlFVRkJMRkZCUVVFc1IwRkJWenRCUVVOWUxGTkJRVUVzTkVOQlFVRTdPMDFCUTBNc1VVRkJVU3hEUVVGRExFbEJRVlFzUTBGQll5eFJRVUZCTEVOQlFWTXNTMEZCVkN4RFFVRmtPMEZCUkVRN1FVRkZRU3hYUVVGUE8wVkJTazA3TzNOQ1FVMWtMRkZCUVVFc1IwRkJWU3hUUVVGRExFbEJRVVE3UVVGRFZDeFJRVUZCTzBsQlFVRXNZMEZCUVN4SFFVRnBRaXhKUVVGRExFTkJRVUVzYTBKQlFVUXNRMEZCUVR0SlFVTnFRaXhWUVVGQkxFZEJRV0U3UVVGRFlpeFRRVUZCTEdkRVFVRkJPenROUVVORExGVkJRVlVzUTBGQlF5eEpRVUZZTEVOQlFXZENMRWxCUVVzc1EwRkJRU3hMUVVGQkxFTkJRWEpDTzBGQlJFUTdTVUZIUVN4VlFVRkJMRWRCUVdFc1ZVRkJWU3hEUVVGRExFdEJRVmdzUTBGQmFVSXNRMEZCYWtJc1JVRkJiMElzU1VGQlF5eERRVUZCTEdWQlFVUXNRMEZCYVVJc1ZVRkJWU3hEUVVGRExFMUJRVFZDTEVOQlFYQkNPMWRCUTJJc1NVRkJReXhEUVVGQkxGbEJRVVFzUTBGQll5eFZRVUZrTzBWQlVGTTdPenM3T3p0QlFWTllMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIExheWVyTWFuYWdlciwgTG9hZGVyO1xuXG5MYXllck1hbmFnZXIgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGF5ZXJTdGFjayA9IFtdO1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgY2MuU2NlbmUoKTtcbiAgICByZXR1cm4gY2MuZGlyZWN0b3IucnVuU2NlbmUodGhpcy5zY2VuZSk7XG4gIH0sXG4gIGNsZWFyTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICByZXR1cm4gdGhpcy5sYXllclN0YWNrLmxlbmd0aCA9IDA7XG4gIH0sXG4gIGFkZExheWVyVG9TY2VuZTogZnVuY3Rpb24oY2NiTGF5ZXIsIHpPcmRlcikge1xuICAgIHZhciBsYXlvdXQsIG5vZGU7XG4gICAgaWYgKHpPcmRlciA9PSBudWxsKSB7XG4gICAgICB6T3JkZXIgPSAwO1xuICAgIH1cbiAgICBsYXlvdXQgPSBuZXcgY2N1aS5MYXlvdXQoKTtcbiAgICBsYXlvdXQuc2V0Q29udGVudFNpemUoY2Muc2l6ZSgxMTM2LCA2NDApKTtcbiAgICBsYXlvdXQuc2V0VG91Y2hFbmFibGVkKHRydWUpO1xuICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuICAgIG5vZGUuYWRkQ2hpbGQobGF5b3V0KTtcbiAgICBub2RlLmFkZENoaWxkKGNjYkxheWVyKTtcbiAgICB0aGlzLnNjZW5lLmFkZENoaWxkKG5vZGUsIHpPcmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5wdXNoKG5vZGUpO1xuICB9LFxuICByZW1vdmVUb3BMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRvcExheWVyO1xuICAgIHRvcExheWVyID0gdGhpcy5sYXllclN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0aGlzLnNjZW5lLnJlbW92ZUNoaWxkKHRvcExheWVyLCB0cnVlKTtcbiAgfVxufTtcblxuTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMb2FkZXIoY2NiRmlsZTEsIGNvbnRyb2xsZXJOYW1lMSkge1xuICAgIHRoaXMuY2NiRmlsZSA9IGNjYkZpbGUxO1xuICAgIHRoaXMuY29udHJvbGxlck5hbWUgPSBjb250cm9sbGVyTmFtZTE7XG4gIH1cblxuICBMb2FkZXIucHJvdG90eXBlLnNob3dEaWFsb2cgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2MuQnVpbGRlclJlYWRlci5sb2FkKHRoaXMuY2NiRmlsZSk7XG4gIH07XG5cbiAgcmV0dXJuIExvYWRlcjtcblxufSkoKTtcblxuTGF5ZXJNYW5hZ2VyLmRlZmluZURpYWxvZyA9IGZ1bmN0aW9uKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQ2xhc3MpIHtcbiAgY2MuQnVpbGRlclJlYWRlci5yZWdpc3RlckNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIG5ldyBjb250cm9sbGVyQ2xhc3MoKSk7XG4gIHJldHVybiBuZXcgTG9hZGVyKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdlFYSnJVMk5sYm1WTllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwzUnZiMnh6TDBGeWExTmpaVzVsVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlFUdEpRVU5HTEVsQlFVTXNRMEZCUVN4VlFVRkVMRWRCUVdNN1NVRkRaQ3hKUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRXRCUVZBc1EwRkJRVHRYUVVOVUxFVkJRVVVzUTBGQlF5eFJRVUZSTEVOQlFVTXNVVUZCV2l4RFFVRnhRaXhKUVVGRExFTkJRVUVzUzBGQmRFSTdSVUZJUlN4RFFVRk9PMFZCUzBFc1ZVRkJRU3hGUVVGWkxGTkJRVUU3U1VGRFVpeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMR2xDUVVGUUxFTkJRVUU3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRTFCUVZvc1IwRkJjVUk3UlVGR1lpeERRVXhhTzBWQlUwRXNaVUZCUVN4RlFVRnJRaXhUUVVGRExGRkJRVVFzUlVGQlZ5eE5RVUZZTzBGQlEyUXNVVUZCUVRzN1RVRkVlVUlzVTBGQlV6czdTVUZEYkVNc1RVRkJRU3hIUVVGVExFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFWUXNRMEZCUVR0SlFVTlVMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1NVRkJVaXhGUVVGakxFZEJRV1FzUTBGQmRFSTdTVUZEUVN4TlFVRk5MRU5CUVVNc1pVRkJVQ3hEUVVGMVFpeEpRVUYyUWp0SlFVVkJMRWxCUVVFc1IwRkJUU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZRTEVOQlFVRTdTVUZEVGl4SlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxFMUJRV1E3U1VGRFFTeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRkZCUVdRN1NVRkZRU3hKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEZGQlFWQXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNUVUZCZEVJN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEVsQlFWb3NRMEZCYVVJc1NVRkJha0k3UlVGV1l5eERRVlJzUWp0RlFYRkNRU3hqUVVGQkxFVkJRV2RDTEZOQlFVRTdRVUZEV2l4UlFVRkJPMGxCUVVFc1VVRkJRU3hIUVVGWExFbEJRVU1zUTBGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV2l4RFFVRkJPMWRCUTFnc1NVRkJReXhEUVVGQkxFdEJRVXNzUTBGQlF5eFhRVUZRTEVOQlFXMUNMRkZCUVc1Q0xFVkJRVFpDTEVsQlFUZENPMFZCUmxrc1EwRnlRbWhDT3pzN1FVRjVRa1U3UlVGRFZ5eG5Ra0ZCUXl4UlFVRkVMRVZCUVZjc1pVRkJXRHRKUVVGRExFbEJRVU1zUTBGQlFTeFZRVUZFTzBsQlFWVXNTVUZCUXl4RFFVRkJMR2xDUVVGRU8wVkJRVmc3TzIxQ1FVTmlMRlZCUVVFc1IwRkJZU3hUUVVGQk8xZEJRMVFzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRnFRaXhEUVVGelFpeEpRVUZETEVOQlFVRXNUMEZCZGtJN1JVRkVVenM3T3pzN08wRkJSMnBDTEZsQlFWa3NRMEZCUXl4WlFVRmlMRWRCUVRSQ0xGTkJRVU1zVDBGQlJDeEZRVUZWTEdOQlFWWXNSVUZCTUVJc1pVRkJNVUk3UlVGRGVFSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhyUWtGQmFrSXNRMEZEU1N4alFVUktMRVZCUlVrc1NVRkJTU3hsUVVGS0xFTkJRVUVzUTBGR1NqdFRRVXRCTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTlCUVZnc1JVRkJiMElzWTBGQmNFSTdRVUZPZDBJN08wRkJVVFZDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBTY3JvbGxWaWV3O1xuXG5TY3JvbGxWaWV3ID0ge1xuICBjcmVhdGVTY3JvbGxWaWV3OiBmdW5jdGlvbih0YXJnZXROb2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lciwgc2Nyb2xsVmlldywgc2l6ZTtcbiAgICBzaXplID0gdGFyZ2V0Tm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgIGNvbnRhaW5lciA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgc2Nyb2xsVmlldyA9IG5ldyBjYy5TY3JvbGxWaWV3KHNpemUsIGNvbnRhaW5lcik7XG4gICAgc2Nyb2xsVmlldy5zZXRQb3NpdGlvbih0YXJnZXROb2RlLmdldFBvc2l0aW9uKCkpO1xuICAgIHNjcm9sbFZpZXcuc2V0RGlyZWN0aW9uKGNjLlNDUk9MTFZJRVdfRElSRUNUSU9OX1ZFUlRJQ0FMKTtcbiAgICBzY3JvbGxWaWV3LnNldFRvdWNoRW5hYmxlZCh0cnVlKTtcbiAgICByZXR1cm4gc2Nyb2xsVmlldztcbiAgfSxcbiAgaW5pdEZyb21Db250YWluZXI6IGZ1bmN0aW9uKHNjcm9sbFZpZXcsIGlubmVyKSB7XG4gICAgdmFyIGNvbnRhaW5lcjtcbiAgICBpbm5lci5zZXRQb3NpdGlvbih7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH0pO1xuICAgIGlubmVyLnNldEFuY2hvclBvaW50KHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSk7XG4gICAgaW5uZXIucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgIGNvbnRhaW5lciA9IHNjcm9sbFZpZXcuZ2V0Q29udGFpbmVyKCk7XG4gICAgY29udGFpbmVyLnNldENvbnRlbnRTaXplKGlubmVyLmdldENvbnRlbnRTaXplKCkpO1xuICAgIHJldHVybiBjb250YWluZXIuYWRkQ2hpbGQoaW5uZXIpO1xuICB9LFxuICBzY3JvbGxKdW1wVG9Ub3A6IGZ1bmN0aW9uKHNjcm9sbFZpZXcpIHtcbiAgICB2YXIgY29udGFpbmVyLCBvZmZzZXQ7XG4gICAgY29udGFpbmVyID0gc2Nyb2xsVmlldy5nZXRDb250YWluZXIoKTtcbiAgICBvZmZzZXQgPSBzY3JvbGxWaWV3LmdldFZpZXdTaXplKCkuaGVpZ2h0IC0gY29udGFpbmVyLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICByZXR1cm4gc2Nyb2xsVmlldy5zZXRDb250ZW50T2Zmc2V0KHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogb2Zmc2V0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNjcm9sbFZpZXcuc2V0Q29udGVudE9mZnNldCh7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxWaWV3O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdlUyTnliMnhzVm1sbGR5NWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTkwYjI5c2N5OVRZM0p2Ykd4V2FXVjNMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZEU1R0RlFVRkJMR2RDUVVGQkxFVkJRV3RDTEZOQlFVTXNWVUZCUkR0QlFVTmtMRkZCUVVFN1NVRkJRU3hKUVVGQkxFZEJRVThzVlVGQlZTeERRVUZETEdOQlFWZ3NRMEZCUVR0SlFVTlFMRk5CUVVFc1IwRkJXU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZRTEVOQlFVRTdTVUZEV2l4VlFVRkJMRWRCUVdFc1NVRkJTU3hGUVVGRkxFTkJRVU1zVlVGQlVDeERRVUZyUWl4SlFVRnNRaXhGUVVGM1FpeFRRVUY0UWp0SlFVTmlMRlZCUVZVc1EwRkJReXhYUVVGWUxFTkJRWFZDTEZWQlFWVXNRMEZCUXl4WFFVRllMRU5CUVVFc1EwRkJka0k3U1VGRFFTeFZRVUZWTEVOQlFVTXNXVUZCV0N4RFFVRjNRaXhGUVVGRkxFTkJRVU1zTmtKQlFUTkNPMGxCUTBFc1ZVRkJWU3hEUVVGRExHVkJRVmdzUTBGQk1rSXNTVUZCTTBJN1YwRkRRVHRGUVZCakxFTkJRV3hDTzBWQlUwRXNhVUpCUVVFc1JVRkJiVUlzVTBGQlF5eFZRVUZFTEVWQlFXRXNTMEZCWWp0QlFVTm1MRkZCUVVFN1NVRkJRU3hMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZyUWp0TlFVRkRMRU5CUVVFc1JVRkJSeXhEUVVGS08wMUJRVThzUTBGQlFTeEZRVUZITEVOQlFWWTdTMEZCYkVJN1NVRkRRU3hMUVVGTExFTkJRVU1zWTBGQlRpeERRVUZ4UWp0TlFVRkRMRU5CUVVFc1JVRkJSeXhEUVVGS08wMUJRVThzUTBGQlFTeEZRVUZITEVOQlFWWTdTMEZCY2tJN1NVRkRRU3hMUVVGTExFTkJRVU1zWjBKQlFVNHNRMEZCUVR0SlFVTkJMRk5CUVVFc1IwRkJXU3hWUVVGVkxFTkJRVU1zV1VGQldDeERRVUZCTzBsQlExb3NVMEZCVXl4RFFVRkRMR05CUVZZc1EwRkJlVUlzUzBGQlN5eERRVUZETEdOQlFVNHNRMEZCUVN4RFFVRjZRanRYUVVOQkxGTkJRVk1zUTBGQlF5eFJRVUZXTEVOQlFXMUNMRXRCUVc1Q08wVkJUbVVzUTBGVWJrSTdSVUZwUWtFc1pVRkJRU3hGUVVGcFFpeFRRVUZETEZWQlFVUTdRVUZEWWl4UlFVRkJPMGxCUVVFc1UwRkJRU3hIUVVGWkxGVkJRVlVzUTBGQlF5eFpRVUZZTEVOQlFVRTdTVUZEV2l4TlFVRkJMRWRCUVZNc1ZVRkJWU3hEUVVGRExGZEJRVmdzUTBGQlFTeERRVUYzUWl4RFFVRkRMRTFCUVhwQ0xFZEJRV3RETEZOQlFWTXNRMEZCUXl4alFVRldMRU5CUVVFc1EwRkJNRUlzUTBGQlF6dEpRVU4wUlN4SlFVRkhMRTFCUVVFc1IwRkJVeXhEUVVGYU8yRkJRMGtzVlVGQlZTeERRVUZETEdkQ1FVRllMRU5CUVRSQ08xRkJRVU1zUTBGQlFTeEZRVUZITEVOQlFVbzdVVUZCVHl4RFFVRkJMRVZCUVVjc1RVRkJWanRQUVVFMVFpeEZRVVJLTzB0QlFVRXNUVUZCUVR0aFFVZEpMRlZCUVZVc1EwRkJReXhuUWtGQldDeERRVUUwUWp0UlFVRkRMRU5CUVVFc1JVRkJSeXhEUVVGS08xRkJRVThzUTBGQlFTeEZRVUZITEVOQlFWWTdUMEZCTlVJc1JVRklTanM3UlVGSVlTeERRV3BDYWtJN096dEJRWGxDU2l4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiIsInZhciB1dGlscztcblxudXRpbHMgPSB7XG4gIGdldENvbXBvdW5kUmF0ZTogZnVuY3Rpb24oYWRkUmF0ZSwgdGltZSkge1xuICAgIHJldHVybiBNYXRoLmV4cCgxIC8gdGltZSAqIE1hdGgubG9nKGFkZFJhdGUpKTtcbiAgfSxcbiAgZ2V0QXZlcmFnZTogZnVuY3Rpb24odGFibGUpIHtcbiAgICB2YXIgYXZlLCBpLCBsZW4sIHRvdGFsLCB2YWx1ZTtcbiAgICB0b3RhbCA9IDA7XG4gICAgZm9yIChpID0gMCwgbGVuID0gdGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhbHVlID0gdGFibGVbaV07XG4gICAgICB0b3RhbCArPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgfVxuICAgIGF2ZSA9ICh0b3RhbCAvIHRhYmxlLmxlbmd0aCkudG9GaXhlZCgyKTtcbiAgICByZXR1cm4gYXZlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdmRYUnBiSE11WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmRHOXZiSE12ZFhScGJITXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFN08wRkJRVUVzUzBGQlFTeEhRVU5KTzBWQlFVRXNaVUZCUVN4RlFVRnBRaXhUUVVGRExFOUJRVVFzUlVGQlZTeEpRVUZXTzBGQlEySXNWMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJUQ3hEUVVGVExFTkJRVUVzUjBGQlNTeEpRVUZLTEVkQlFWY3NTVUZCU1N4RFFVRkRMRWRCUVV3c1EwRkJVeXhQUVVGVUxFTkJRWEJDTzBWQlJFMHNRMEZCYWtJN1JVRkhRU3hWUVVGQkxFVkJRVmtzVTBGQlF5eExRVUZFTzBGQlExSXNVVUZCUVR0SlFVRkJMRXRCUVVFc1IwRkJVVHRCUVVOU0xGTkJRVUVzZFVOQlFVRTdPMDFCUTBrc1MwRkJRU3hKUVVGVExGRkJRVUVzUTBGQlV5eExRVUZVTzBGQlJHSTdTVUZGUVN4SFFVRkJMRWRCUVUwc1EwRkJReXhMUVVGQkxFZEJRVkVzUzBGQlN5eERRVUZETEUxQlFXWXNRMEZCYzBJc1EwRkJReXhQUVVGMlFpeERRVUVyUWl4RFFVRXZRanRYUVVOT08wVkJURkVzUTBGSVdqczdPMEZCVTBvc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlmUT09XG4iXX0=
