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
    container.removeAllChildren(true);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9nbG9iYWxWYWx1ZS5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiLCJzcmMvbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlIiwic3JjL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUiLCJzcmMvbW9kZWwvQ2FzaEZsb3dTdGF0ZW1lbnQuY29mZmVlIiwic3JjL21vZGVsL1Byb2ZpdFN0YXRlbWVudC5jb2ZmZWUiLCJzcmMvbW9kZWwvVGFibGVCYXNlLmNvZmZlZSIsInNyYy90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlIiwic3JjL3Rvb2xzL1Njcm9sbFZpZXcuY29mZmVlIiwic3JjL3Rvb2xzL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgQXJrU2Nyb2xsVmlldywgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2NsaWNrX3RpbWVzO1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5BcmtTY3JvbGxWaWV3ID0gcmVxdWlyZSgnLi4vdG9vbHMvU2Nyb2xsVmlldy5jb2ZmZWUnKTtcblxuZ19jbGlja190aW1lcyA9IDA7XG5cbkFya01haW5EaWFsb2cgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEFya01haW5EaWFsb2coKSB7fVxuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLm9uRGlkTG9hZEZyb21DQ0IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9kYXRUYWJsZSA9IFtdO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Njcm9sbFZpZXcgPSBudWxsO1xuICAgIHRoaXMuX3N0b2NrQ29kZUVkaXRCb3ggPSBudWxsO1xuICAgIHJldHVybiB0aGlzLl95ZWFyc0VkaXRCb3ggPSBudWxsO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMSk7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl9zdG9ja0NvZGVFZGl0Qm94KTtcbiAgICB0aGlzLl95ZWFyc0VkaXRCb3ggPSB0aGlzLl9jcmVhdGVFZGl0Qm94KHRoaXMuY2NiX3RleHRGaWVsZF8yKTtcbiAgICB0aGlzLnJvb3ROb2RlLmFkZENoaWxkKHRoaXMuX3llYXJzRWRpdEJveCk7XG4gICAgdGhpcy5faW5pdERhdGEoKTtcbiAgICB0aGlzLl9zY3JvbGxWaWV3ID0gQXJrU2Nyb2xsVmlldy5jcmVhdGVTY3JvbGxWaWV3KHRoaXMuY2NiX3Njcm9sbFZpZXcpO1xuICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQodGhpcy5fc2Nyb2xsVmlldyk7XG4gICAgQXJrU2Nyb2xsVmlldy5pbml0RnJvbUNvbnRhaW5lcih0aGlzLl9zY3JvbGxWaWV3LCB0aGlzLmNjYl9yZXN1bHQpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9pbml0RGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3N0b2NrQ29kZUVkaXRCb3guc2V0U3RyaW5nKFwiMDAwNjUxXCIpO1xuICAgIHJldHVybiB0aGlzLl95ZWFyc0VkaXRCb3guc2V0U3RyaW5nKFwiNlwiKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5fY3JlYXRlRWRpdEJveCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgZWRpdEJveDtcbiAgICBlZGl0Qm94ID0gbmV3IGNjLkVkaXRCb3goY2Muc2l6ZSgyMDAsIDUwKSk7XG4gICAgZWRpdEJveC5zZXRQb3NpdGlvbihub2RlLmdldFBvc2l0aW9uKCkpO1xuICAgIGVkaXRCb3guc2V0SW5wdXRNb2RlKGNjLkVESVRCT1hfSU5QVVRfTU9ERV9TSU5HTEVMSU5FKTtcbiAgICBlZGl0Qm94LnNldFJldHVyblR5cGUoY2MuS0VZQk9BUkRfUkVUVVJOVFlQRV9ET05FKTtcbiAgICBlZGl0Qm94LnNldElucHV0RmxhZyhjYy5FRElUQk9YX0lOUFVUX0ZMQUdfSU5JVElBTF9DQVBTX1NFTlRFTkNFKTtcbiAgICBlZGl0Qm94LnNldE1heExlbmd0aCgxMyk7XG4gICAgZWRpdEJveC5zZXRGb250KFwiQXJpYWxcIiwgMjYpO1xuICAgIGVkaXRCb3guc2V0Rm9udENvbG9yKGNjLmNvbG9yKDEwMCwgMTAwLCAyNTUsIDI1NSkpO1xuICAgIHJldHVybiBlZGl0Qm94O1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLnNob3dSZXN1bHQgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICB0aGlzLmNjYl9yZXN1bHQuc2V0U3RyaW5nKHJlc3VsdCk7XG4gICAgQXJrU2Nyb2xsVmlldy5pbml0RnJvbUNvbnRhaW5lcih0aGlzLl9zY3JvbGxWaWV3LCB0aGlzLmNjYl9yZXN1bHQpO1xuICAgIHJldHVybiBBcmtTY3JvbGxWaWV3LnNjcm9sbEp1bXBUb1RvcCh0aGlzLl9zY3JvbGxWaWV3KTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5vbkNhbGMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RvY2tDb2RlLCB5ZWFycztcbiAgICBzdG9ja0NvZGUgPSB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIHllYXJzID0gdGhpcy5feWVhcnNFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIGdsb2JhbC55ZWFyID0geWVhcnM7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5zZW5kKGV2ZW50TmFtZXMuR0FNRV9HRVRfUkVTVUxULCB7XG4gICAgICBzdG9ja0NvZGU6IHN0b2NrQ29kZSxcbiAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5zaG93UmVzdWx0KHN0cik7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKVxuICAgIH0pO1xuICB9O1xuXG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKFwiQXJrTWFpbkRpYWxvZ1wiLCBuZXcgQXJrTWFpbkRpYWxvZygpKTtcblxuICByZXR1cm4gQXJrTWFpbkRpYWxvZztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5CdWlsZGVyUmVhZGVyLmxvYWQoXCJyZXMvbWFpbi5jY2JpXCIpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMk5pVm1sbGR5OUJjbXROWVdsdVJHbGhiRzluTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyTmpZbFpwWlhjdlFYSnJUV0ZwYmtScFlXeHZaeTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUVdVc1QwRkJRU3hEUVVGUkxHbERRVUZTT3p0QlFVTm1MRlZCUVVFc1IwRkJZU3hQUVVGQkxFTkJRVkVzSzBKQlFWSTdPMEZCUTJJc1lVRkJRU3hIUVVGblFpeFBRVUZCTEVOQlFWRXNORUpCUVZJN08wRkJSV2hDTEdGQlFVRXNSMEZCWjBJN08wRkJSVlk3T3pzd1FrRkRSaXhuUWtGQlFTeEhRVUZyUWl4VFFVRkJPMGxCUTJRc1NVRkJReXhEUVVGQkxGTkJRVVFzUjBGQllUdEpRVU5pTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVVFN1YwRkRRU3hKUVVGRExFTkJRVUVzU1VGQlJDeERRVUZCTzBWQlNHTTdPekJDUVV0c1FpeE5RVUZCTEVkQlFWRXNVMEZCUVR0SlFVTktMRWxCUVVNc1EwRkJRU3hYUVVGRUxFZEJRV1U3U1VGRFppeEpRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJjVUk3VjBGRGNrSXNTVUZCUXl4RFFVRkJMR0ZCUVVRc1IwRkJhVUk3UlVGSVlqczdNRUpCUzFJc1NVRkJRU3hIUVVGTkxGTkJRVUU3U1VGRFJpeEpRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJjVUlzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJReXhEUVVGQkxHVkJRV3BDTzBsQlEzSkNMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4SlFVRkRMRU5CUVVFc2FVSkJRWEJDTzBsQlJVRXNTVUZCUXl4RFFVRkJMR0ZCUVVRc1IwRkJhVUlzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJReXhEUVVGQkxHVkJRV3BDTzBsQlEycENMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4SlFVRkRMRU5CUVVFc1lVRkJjRUk3U1VGRlFTeEpRVUZETEVOQlFVRXNVMEZCUkN4RFFVRkJPMGxCUlVFc1NVRkJReXhEUVVGQkxGZEJRVVFzUjBGQlpTeGhRVUZoTEVOQlFVTXNaMEpCUVdRc1EwRkJLMElzU1VGQlF5eERRVUZCTEdOQlFXaERPMGxCUTJZc1NVRkJReXhEUVVGQkxGRkJRVkVzUTBGQlF5eFJRVUZXTEVOQlFXMUNMRWxCUVVNc1EwRkJRU3hYUVVGd1FqdEpRVVZCTEdGQlFXRXNRMEZCUXl4cFFrRkJaQ3hEUVVGblF5eEpRVUZETEVOQlFVRXNWMEZCYWtNc1JVRkJPRU1zU1VGQlF5eERRVUZCTEZWQlFTOURPMFZCV2tVN096QkNRV2RDVGl4VFFVRkJMRWRCUVZjc1UwRkJRVHRKUVVOUUxFbEJRVU1zUTBGQlFTeHBRa0ZCYVVJc1EwRkJReXhUUVVGdVFpeERRVUUyUWl4UlFVRTNRanRYUVVOQkxFbEJRVU1zUTBGQlFTeGhRVUZoTEVOQlFVTXNVMEZCWml4RFFVRjVRaXhIUVVGNlFqdEZRVVpQT3pzd1FrRkpXQ3hqUVVGQkxFZEJRV2RDTEZOQlFVTXNTVUZCUkR0QlFVTmFMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzU1VGQlNTeEZRVUZGTEVOQlFVTXNUMEZCVUN4RFFVRmxMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlVpeEZRVUZoTEVWQlFXSXNRMEZCWmp0SlFVTldMRTlCUVU4c1EwRkJReXhYUVVGU0xFTkJRVzlDTEVsQlFVa3NRMEZCUXl4WFFVRk1MRU5CUVVFc1EwRkJjRUk3U1VGRFFTeFBRVUZQTEVOQlFVTXNXVUZCVWl4RFFVRnhRaXhGUVVGRkxFTkJRVU1zTmtKQlFYaENPMGxCUTBFc1QwRkJUeXhEUVVGRExHRkJRVklzUTBGQmMwSXNSVUZCUlN4RFFVRkRMSGRDUVVGNlFqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5eDNRMEZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRnlRanRKUVVOQkxFOUJRVThzUTBGQlF5eFBRVUZTTEVOQlFXZENMRTlCUVdoQ0xFVkJRWGxDTEVWQlFYcENPMGxCUTBFc1QwRkJUeXhEUVVGRExGbEJRVklzUTBGQmNVSXNSVUZCUlN4RFFVRkRMRXRCUVVnc1EwRkJVeXhIUVVGVUxFVkJRV01zUjBGQlpDeEZRVUZ0UWl4SFFVRnVRaXhGUVVGM1FpeEhRVUY0UWl4RFFVRnlRanRCUVVOQkxGZEJRVTg3UlVGVVN6czdNRUpCVjJoQ0xGVkJRVUVzUjBGQldTeFRRVUZETEUxQlFVUTdTVUZEVWl4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExGTkJRVm9zUTBGQmMwSXNUVUZCZEVJN1NVRkRRU3hoUVVGaExFTkJRVU1zYVVKQlFXUXNRMEZCWjBNc1NVRkJReXhEUVVGQkxGZEJRV3BETEVWQlFUaERMRWxCUVVNc1EwRkJRU3hWUVVFdlF6dFhRVU5CTEdGQlFXRXNRMEZCUXl4bFFVRmtMRU5CUVRoQ0xFbEJRVU1zUTBGQlFTeFhRVUV2UWp0RlFVaFJPenN3UWtGTFdpeE5RVUZCTEVkQlFWRXNVMEZCUVR0QlFVTktMRkZCUVVFN1NVRkJRU3hUUVVGQkxFZEJRVmtzU1VGQlF5eERRVUZCTEdsQ1FVRnBRaXhEUVVGRExGTkJRVzVDTEVOQlFVRTdTVUZEV2l4TFFVRkJMRWRCUVZFc1NVRkJReXhEUVVGQkxHRkJRV0VzUTBGQlF5eFRRVUZtTEVOQlFVRTdTVUZEVWl4TlFVRk5MRU5CUVVNc1NVRkJVQ3hIUVVGak8xZEJSV1FzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCYTBJc1ZVRkJWU3hEUVVGRExHVkJRVGRDTEVWQlEwazdUVUZCUVN4VFFVRkJMRVZCUVZjc1UwRkJXRHROUVVOQkxGRkJRVUVzUlVGQlZTeERRVUZCTEZOQlFVRXNTMEZCUVR0bFFVRkJMRk5CUVVNc1IwRkJSRHRwUWtGRFRpeExRVUZETEVOQlFVRXNWVUZCUkN4RFFVRlpMRWRCUVZvN1VVRkVUVHROUVVGQkxFTkJRVUVzUTBGQlFTeERRVUZCTEVsQlFVRXNRMEZFVmp0TFFVUktPMFZCVEVrN08wVkJWVklzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGxRVVJLTEVWQlJVa3NTVUZCU1N4aFFVRktMRU5CUVVFc1EwRkdTanM3T3pzN08wRkJTMG9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhsUVVGMFFpSjlcbiIsInZhciBCYWxhbmNlU2hlZXQsIENhc2hGbG93U3RhdGVtZW50LCBHYW1lTG9naWMsIFByb2ZpdFN0YXRlbWVudCwgVXNlckRhdGEsIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcywgZ19zdG9ja1RhYmxlLCBzY2VuZU1hbmFnZXIsIHV0aWxzO1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbkJhbGFuY2VTaGVldCA9IHJlcXVpcmUoJy4uL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUnKTtcblxuUHJvZml0U3RhdGVtZW50ID0gcmVxdWlyZSgnLi4vbW9kZWwvUHJvZml0U3RhdGVtZW50LmNvZmZlZScpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IHJlcXVpcmUoJy4uL21vZGVsL0Nhc2hGbG93U3RhdGVtZW50LmNvZmZlZScpO1xuXG5yZXF1aXJlKFwiLi4vZ2xvYmFsVmFsdWUuY29mZmVlXCIpO1xuXG51dGlscyA9IHJlcXVpcmUoJy4uL3Rvb2xzL3V0aWxzLmNvZmZlZScpO1xuXG5nX3N0b2NrVGFibGUgPSBbXCJTWjAwMDAwMVwiLCBcIlNaMDAwMDAyXCIsIFwiU1owMDAwMDhcIiwgXCJTWjAwMDA2MFwiLCBcIlNaMDAwMDYzXCIsIFwiU1owMDAwNjlcIiwgXCJTWjAwMDEwMFwiLCBcIlNaMDAwMTU3XCIsIFwiU1owMDAxNjZcIiwgXCJTWjAwMDMzM1wiLCBcIlNaMDAwMzM4XCIsIFwiU1owMDA0MDJcIiwgXCJTWjAwMDQxM1wiLCBcIlNaMDAwNDE1XCIsIFwiU1owMDA0MjNcIiwgXCJTWjAwMDQyNVwiLCBcIlNaMDAwNTAzXCIsIFwiU1owMDA1MzhcIiwgXCJTWjAwMDU0MFwiLCBcIlNaMDAwNTU5XCIsIFwiU1owMDA1NjhcIiwgXCJTWjAwMDYyM1wiLCBcIlNaMDAwNjI1XCIsIFwiU1owMDA2MjdcIiwgXCJTWjAwMDYzMFwiLCBcIlNaMDAwNjUxXCIsIFwiU1owMDA2NzFcIiwgXCJTWjAwMDY4NlwiLCBcIlNaMDAwNzA5XCIsIFwiU1owMDA3MjNcIiwgXCJTWjAwMDcyNVwiLCBcIlNaMDAwNzI4XCIsIFwiU1owMDA3MzhcIiwgXCJTWjAwMDc1MFwiLCBcIlNaMDAwNzY4XCIsIFwiU1owMDA3NzZcIiwgXCJTWjAwMDc4M1wiLCBcIlNaMDAwNzkyXCIsIFwiU1owMDA4MjZcIiwgXCJTWjAwMDgzOVwiLCBcIlNaMDAwODU4XCIsIFwiU1owMDA4NzZcIiwgXCJTWjAwMDg5NVwiLCBcIlNaMDAwODk4XCIsIFwiU1owMDA5MzhcIiwgXCJTWjAwMDk1OVwiLCBcIlNaMDAwOTYxXCIsIFwiU1owMDA5NjNcIiwgXCJTWjAwMDk4M1wiLCBcIlNaMDAxOTc5XCIsIFwiU1owMDIwMDdcIiwgXCJTWjAwMjAwOFwiLCBcIlNaMDAyMDI0XCIsIFwiU1owMDIwMjdcIiwgXCJTWjAwMjA0NFwiLCBcIlNaMDAyMDY1XCIsIFwiU1owMDIwNzRcIiwgXCJTWjAwMjA4MVwiLCBcIlNaMDAyMTQyXCIsIFwiU1owMDIxNDZcIiwgXCJTWjAwMjE1M1wiLCBcIlNaMDAyMTc0XCIsIFwiU1owMDIyMDJcIiwgXCJTWjAwMjIzMFwiLCBcIlNaMDAyMjM2XCIsIFwiU1owMDIyNDFcIiwgXCJTWjAwMjI1MlwiLCBcIlNaMDAyMjkyXCIsIFwiU1owMDIyOTRcIiwgXCJTWjAwMjMwNFwiLCBcIlNaMDAyMzEwXCIsIFwiU1owMDIzNTJcIiwgXCJTWjAwMjM4NVwiLCBcIlNaMDAyNDExXCIsIFwiU1owMDI0MTVcIiwgXCJTWjAwMjQyNFwiLCBcIlNaMDAyNDI2XCIsIFwiU1owMDI0NTBcIiwgXCJTWjAwMjQ1NlwiLCBcIlNaMDAyNDYwXCIsIFwiU1owMDI0NjVcIiwgXCJTWjAwMjQ2NlwiLCBcIlNaMDAyNDY4XCIsIFwiU1owMDI0NzBcIiwgXCJTWjAwMjQ3NVwiLCBcIlNaMDAyNTAwXCIsIFwiU1owMDI1MDhcIiwgXCJTWjAwMjU1NVwiLCBcIlNaMDAyNTU4XCIsIFwiU1owMDI1NzJcIiwgXCJTWjAwMjU5NFwiLCBcIlNaMDAyNjAxXCIsIFwiU1owMDI2MDJcIiwgXCJTWjAwMjYwOFwiLCBcIlNaMDAyNjI0XCIsIFwiU1owMDI2NzNcIiwgXCJTWjAwMjcxNFwiLCBcIlNaMDAyNzM2XCIsIFwiU1owMDI3MzlcIiwgXCJTWjAwMjc5N1wiLCBcIlNaMDAyODMxXCIsIFwiU1owMDI4MzlcIiwgXCJTWjAwMjg0MVwiLCBcIlNaMzAwMDAzXCIsIFwiU1ozMDAwMTVcIiwgXCJTWjMwMDAxN1wiLCBcIlNaMzAwMDI0XCIsIFwiU1ozMDAwMjdcIiwgXCJTWjMwMDAzM1wiLCBcIlNaMzAwMDU5XCIsIFwiU1ozMDAwNzBcIiwgXCJTWjMwMDA3MlwiLCBcIlNaMzAwMTIyXCIsIFwiU1ozMDAxMjRcIiwgXCJTWjMwMDEzNlwiLCBcIlNaMzAwMTQ0XCIsIFwiU1ozMDAyNTFcIiwgXCJTWjMwMDMxNVwiLCBcIlNINjAwMDAwXCIsIFwiU0g2MDAwMDhcIiwgXCJTSDYwMDAwOVwiLCBcIlNINjAwMDEwXCIsIFwiU0g2MDAwMTFcIiwgXCJTSDYwMDAxNVwiLCBcIlNINjAwMDE2XCIsIFwiU0g2MDAwMThcIiwgXCJTSDYwMDAxOVwiLCBcIlNINjAwMDIxXCIsIFwiU0g2MDAwMjNcIiwgXCJTSDYwMDAyOFwiLCBcIlNINjAwMDI5XCIsIFwiU0g2MDAwMzBcIiwgXCJTSDYwMDAzMVwiLCBcIlNINjAwMDM2XCIsIFwiU0g2MDAwMzhcIiwgXCJTSDYwMDA0OFwiLCBcIlNINjAwMDUwXCIsIFwiU0g2MDAwNjFcIiwgXCJTSDYwMDA2NlwiLCBcIlNINjAwMDY4XCIsIFwiU0g2MDAwNzRcIiwgXCJTSDYwMDA4NVwiLCBcIlNINjAwMDg5XCIsIFwiU0g2MDAxMDBcIiwgXCJTSDYwMDEwNFwiLCBcIlNINjAwMTA5XCIsIFwiU0g2MDAxMTFcIiwgXCJTSDYwMDExNVwiLCBcIlNINjAwMTE4XCIsIFwiU0g2MDAxNTNcIiwgXCJTSDYwMDE1N1wiLCBcIlNINjAwMTcwXCIsIFwiU0g2MDAxNzdcIiwgXCJTSDYwMDE4OFwiLCBcIlNINjAwMTk2XCIsIFwiU0g2MDAyMDhcIiwgXCJTSDYwMDIxOVwiLCBcIlNINjAwMjIxXCIsIFwiU0g2MDAyMzNcIiwgXCJTSDYwMDI3MVwiLCBcIlNINjAwMjc2XCIsIFwiU0g2MDAyOTdcIiwgXCJTSDYwMDMwOVwiLCBcIlNINjAwMzMyXCIsIFwiU0g2MDAzNDBcIiwgXCJTSDYwMDM1MlwiLCBcIlNINjAwMzYyXCIsIFwiU0g2MDAzNjlcIiwgXCJTSDYwMDM3MlwiLCBcIlNINjAwMzczXCIsIFwiU0g2MDAzNzZcIiwgXCJTSDYwMDM4M1wiLCBcIlNINjAwMzkwXCIsIFwiU0g2MDA0MDZcIiwgXCJTSDYwMDQxNVwiLCBcIlNINjAwNDM2XCIsIFwiU0g2MDA0ODJcIiwgXCJTSDYwMDQ4NVwiLCBcIlNINjAwNDg5XCIsIFwiU0g2MDA0OThcIiwgXCJTSDYwMDUxOFwiLCBcIlNINjAwNTE5XCIsIFwiU0g2MDA1MjJcIiwgXCJTSDYwMDUzNVwiLCBcIlNINjAwNTQ3XCIsIFwiU0g2MDA1NDlcIiwgXCJTSDYwMDU3MFwiLCBcIlNINjAwNTgzXCIsIFwiU0g2MDA1ODVcIiwgXCJTSDYwMDU4OFwiLCBcIlNINjAwNjA2XCIsIFwiU0g2MDA2MzdcIiwgXCJTSDYwMDY0OVwiLCBcIlNINjAwNjYwXCIsIFwiU0g2MDA2NjNcIiwgXCJTSDYwMDY3NFwiLCBcIlNINjAwNjgyXCIsIFwiU0g2MDA2ODVcIiwgXCJTSDYwMDY4OFwiLCBcIlNINjAwNjkwXCIsIFwiU0g2MDA3MDNcIiwgXCJTSDYwMDcwNFwiLCBcIlNINjAwNzA1XCIsIFwiU0g2MDA3MzlcIiwgXCJTSDYwMDc0MVwiLCBcIlNINjAwNzk1XCIsIFwiU0g2MDA4MDRcIiwgXCJTSDYwMDgxNlwiLCBcIlNINjAwODIwXCIsIFwiU0g2MDA4MjdcIiwgXCJTSDYwMDgzN1wiLCBcIlNINjAwODcxXCIsIFwiU0g2MDA4ODZcIiwgXCJTSDYwMDg4N1wiLCBcIlNINjAwODkzXCIsIFwiU0g2MDA4OTVcIiwgXCJTSDYwMDkwMFwiLCBcIlNINjAwOTA5XCIsIFwiU0g2MDA5MTlcIiwgXCJTSDYwMDkyNlwiLCBcIlNINjAwOTU4XCIsIFwiU0g2MDA5NTlcIiwgXCJTSDYwMDk3N1wiLCBcIlNINjAwOTk5XCIsIFwiU0g2MDEwMDZcIiwgXCJTSDYwMTAwOVwiLCBcIlNINjAxMDEyXCIsIFwiU0g2MDEwMThcIiwgXCJTSDYwMTAyMVwiLCBcIlNINjAxMDg4XCIsIFwiU0g2MDEwOTlcIiwgXCJTSDYwMTExMVwiLCBcIlNINjAxMTE3XCIsIFwiU0g2MDExMThcIiwgXCJTSDYwMTE1NVwiLCBcIlNINjAxMTYzXCIsIFwiU0g2MDExNjZcIiwgXCJTSDYwMTE2OVwiLCBcIlNINjAxMTg2XCIsIFwiU0g2MDExOThcIiwgXCJTSDYwMTIxMVwiLCBcIlNINjAxMjEyXCIsIFwiU0g2MDEyMTZcIiwgXCJTSDYwMTIyNVwiLCBcIlNINjAxMjI4XCIsIFwiU0g2MDEyMjlcIiwgXCJTSDYwMTI4OFwiLCBcIlNINjAxMzE4XCIsIFwiU0g2MDEzMjhcIiwgXCJTSDYwMTMzM1wiLCBcIlNINjAxMzM2XCIsIFwiU0g2MDEzNzVcIiwgXCJTSDYwMTM3N1wiLCBcIlNINjAxMzkwXCIsIFwiU0g2MDEzOThcIiwgXCJTSDYwMTU1NVwiLCBcIlNINjAxNjAwXCIsIFwiU0g2MDE2MDFcIiwgXCJTSDYwMTYwN1wiLCBcIlNINjAxNjA4XCIsIFwiU0g2MDE2MTFcIiwgXCJTSDYwMTYxOFwiLCBcIlNINjAxNjI4XCIsIFwiU0g2MDE2MzNcIiwgXCJTSDYwMTY2OFwiLCBcIlNINjAxNjY5XCIsIFwiU0g2MDE2ODhcIiwgXCJTSDYwMTcxOFwiLCBcIlNINjAxNzI3XCIsIFwiU0g2MDE3NjZcIiwgXCJTSDYwMTc4OFwiLCBcIlNINjAxODAwXCIsIFwiU0g2MDE4MThcIiwgXCJTSDYwMTg1N1wiLCBcIlNINjAxODY2XCIsIFwiU0g2MDE4NzJcIiwgXCJTSDYwMTg3N1wiLCBcIlNINjAxODc4XCIsIFwiU0g2MDE4ODFcIiwgXCJTSDYwMTg4OFwiLCBcIlNINjAxODk4XCIsIFwiU0g2MDE4OTlcIiwgXCJTSDYwMTkwMVwiLCBcIlNINjAxOTE5XCIsIFwiU0g2MDE5MzNcIiwgXCJTSDYwMTkzOVwiLCBcIlNINjAxOTU4XCIsIFwiU0g2MDE5NjZcIiwgXCJTSDYwMTk4NVwiLCBcIlNINjAxOTg4XCIsIFwiU0g2MDE5ODlcIiwgXCJTSDYwMTk5MVwiLCBcIlNINjAxOTkyXCIsIFwiU0g2MDE5OTdcIiwgXCJTSDYwMTk5OFwiLCBcIlNINjAzMTYwXCIsIFwiU0g2MDM3OTlcIiwgXCJTSDYwMzgzM1wiLCBcIlNINjAzODU4XCIsIFwiU0g2MDM5OTNcIl07XG5cbkdhbWVMb2dpYyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gR2FtZUxvZ2ljKCkge31cblxuICBHYW1lTG9naWMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9iYWxhbmNlT2JqID0ge307XG4gICAgdGhpcy5fcHJvZml0T2JqID0ge307XG4gICAgdGhpcy5fY2FzaEZsb3dPYmogPSB7fTtcbiAgICB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuICAgIHJldHVybiB0aGlzLl9pbml0VGFibGUoKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBldmVudE1hbmFnZXIubGlzdGVuKGV2ZW50TmFtZXMuR0FNRV9HRVRfUkVTVUxULCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmouY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IG9iai5jYWxsYmFjayhfdGhpcy5maWx0ZXJTdG9jaygpKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuZmlsdGVyU3RvY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXZlUm9lLCBpLCBpbmZvLCBsZW4sIHJvZVRhYmxlLCBzdG9ja0NvZGUsIHN0b2NrSW5mbztcbiAgICBzdG9ja0luZm8gPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBnX3N0b2NrVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0b2NrQ29kZSA9IGdfc3RvY2tUYWJsZVtpXTtcbiAgICAgIHN0b2NrQ29kZSA9IHN0b2NrQ29kZS5zbGljZSgyLCA4KTtcbiAgICAgIHJvZVRhYmxlID0gdGhpcy5nZXRST0Uoc3RvY2tDb2RlKTtcbiAgICAgIGF2ZVJvZSA9IHV0aWxzLmdldEF2ZXJhZ2Uocm9lVGFibGUpO1xuICAgICAgaWYgKGF2ZVJvZSA+IDE4KSB7XG4gICAgICAgIGluZm8gPSB0aGlzLl9iYWxhbmNlT2JqW3N0b2NrQ29kZV0uZ2V0SW5mbygpO1xuICAgICAgICBzdG9ja0luZm8ucHVzaChpbmZvICsgKFwiXCIgKyBhdmVSb2UpICsgZ2xvYmFsLnllYXIgKyBcIlxcblwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0b2NrSW5mbztcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLmdldFJPRSA9IGZ1bmN0aW9uKHN0b2NrQ29kZSkge1xuICAgIHZhciBpLCBpbmRleCwgbGVuLCBuZXRBc3NldHMsIG5ldEFzc2V0c1RhYmxlLCBuZXRQcm9maXRzVGFibGUsIHJvZSwgcm9lVGFibGU7XG4gICAgbmV0QXNzZXRzVGFibGUgPSB0aGlzLl9iYWxhbmNlT2JqW3N0b2NrQ29kZV0uZ2V0TmV0QXNzZXRzKCk7XG4gICAgbmV0UHJvZml0c1RhYmxlID0gdGhpcy5fcHJvZml0T2JqW3N0b2NrQ29kZV0uZ2V0TmV0UHJvZml0VGFibGUoKTtcbiAgICByb2VUYWJsZSA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gbmV0QXNzZXRzVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuICAgICAgbmV0QXNzZXRzID0gbmV0QXNzZXRzVGFibGVbaW5kZXhdO1xuICAgICAgaWYgKGluZGV4ID49IG5ldEFzc2V0c1RhYmxlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByb2UgPSAoKG5ldFByb2ZpdHNUYWJsZVtpbmRleF0gLyAoKG5ldEFzc2V0cyArIG5ldEFzc2V0c1RhYmxlW2luZGV4ICsgMV0pIC8gMikpICogMTAwKS50b0ZpeGVkKDIpO1xuICAgICAgcm9lVGFibGUucHVzaChyb2UgKyBcIlxcdFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJvZVRhYmxlO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuZ2V0UmVjZWl2YWJsZVR1cm5vdmVyRGF5cyA9IGZ1bmN0aW9uKHN0b2NrQ29kZSkge1xuICAgIHZhciBkYXlzLCBkYXlzVGFibGUsIGksIGluQ29tZVZhbHVlVGFibGUsIGluZGV4LCBsZW4sIHJlY2VpdmFibGVWYWx1ZSwgcmVjZWl2YWJsZVZhbHVlVGFibGU7XG4gICAgcmVjZWl2YWJsZVZhbHVlVGFibGUgPSB0aGlzLl9iYWxhbmNlT2JqW3N0b2NrQ29kZV0uZ2V0UmVjZWl2YWJsZVZhbHVlKCk7XG4gICAgaW5Db21lVmFsdWVUYWJsZSA9IHRoaXMuX3Byb2ZpdE9ialtzdG9ja0NvZGVdLmdldEluY29tZVZhbHVlKCk7XG4gICAgZGF5c1RhYmxlID0gW1wi5bqU5pS26LSm5qy+5ZGo6L2s5aSp5pWwXCIgKyBcIlxcdFwiXTtcbiAgICBjb25zb2xlLmxvZyhyZWNlaXZhYmxlVmFsdWVUYWJsZSwgaW5Db21lVmFsdWVUYWJsZSk7XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWNlaXZhYmxlVmFsdWVUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICByZWNlaXZhYmxlVmFsdWUgPSByZWNlaXZhYmxlVmFsdWVUYWJsZVtpbmRleF07XG4gICAgICBpZiAoaW5kZXggPj0gcmVjZWl2YWJsZVZhbHVlVGFibGUubGVuZ3RoIC0gMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRheXMgPSAzNjAgLyBpbkNvbWVWYWx1ZVRhYmxlW2luZGV4XSAqIChyZWNlaXZhYmxlVmFsdWUgKyByZWNlaXZhYmxlVmFsdWVUYWJsZVtpbmRleCArIDFdKSAvIDI7XG4gICAgICBkYXlzVGFibGUucHVzaChkYXlzICsgXCJcXHRcIik7XG4gICAgfVxuICAgIHJldHVybiBkYXlzVGFibGU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5faW5pdFRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRpciwgaSwgbGVuLCBzdG9ja0NvZGU7XG4gICAgZGlyID0gXCJoczMwMFwiO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGdfc3RvY2tUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RvY2tDb2RlID0gZ19zdG9ja1RhYmxlW2ldO1xuICAgICAgc3RvY2tDb2RlID0gc3RvY2tDb2RlLnNsaWNlKDIsIDgpO1xuICAgICAgdGhpcy5fYmFsYW5jZU9ialtzdG9ja0NvZGVdID0gbmV3IEJhbGFuY2VTaGVldChkaXIsIHN0b2NrQ29kZSk7XG4gICAgICB0aGlzLl9wcm9maXRPYmpbc3RvY2tDb2RlXSA9IG5ldyBQcm9maXRTdGF0ZW1lbnQoZGlyLCBzdG9ja0NvZGUpO1xuICAgICAgdGhpcy5fY2FzaEZsb3dPYmpbc3RvY2tDb2RlXSA9IG5ldyBDYXNoRmxvd1N0YXRlbWVudChkaXIsIHN0b2NrQ29kZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBHYW1lTG9naWM7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZUxvZ2ljO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMjl1ZEhKdmJDOUJjbXRIWVcxbFRHOW5hV011WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyOXVkSEp2YkM5QmNtdEhZVzFsVEc5bmFXTXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFN08wRkJRVUVzV1VGQlFTeEhRVUZyUWl4UFFVRkJMRU5CUVZFc2FVTkJRVkk3TzBGQlEyeENMRmxCUVVFc1IwRkJhMElzVDBGQlFTeERRVUZSTEdsRFFVRlNPenRCUVVOc1FpeFZRVUZCTEVkQlFXdENMRTlCUVVFc1EwRkJVU3dyUWtGQlVqczdRVUZEYkVJc1VVRkJRU3hIUVVGclFpeFBRVUZCTEVOQlFWRXNOa0pCUVZJN08wRkJSV3hDTEZsQlFVRXNSMEZCYTBJc1QwRkJRU3hEUVVGUkxEaENRVUZTT3p0QlFVTnNRaXhsUVVGQkxFZEJRWEZDTEU5QlFVRXNRMEZCVVN4cFEwRkJVanM3UVVGRGNrSXNhVUpCUVVFc1IwRkJkVUlzVDBGQlFTeERRVUZSTEcxRFFVRlNPenRCUVVWMlFpeFBRVUZCTEVOQlFWRXNkVUpCUVZJN08wRkJRMEVzUzBGQlFTeEhRVUZSTEU5QlFVRXNRMEZCVVN4MVFrRkJVanM3UVVGSFVpeFpRVUZCTEVkQlFXVXNRMEZCUXl4VlFVRkVMRVZCUVZrc1ZVRkJXaXhGUVVGMVFpeFZRVUYyUWl4RlFVRnJReXhWUVVGc1F5eEZRVUUyUXl4VlFVRTNReXhGUVVGM1JDeFZRVUY0UkN4RlFVRnRSU3hWUVVGdVJTeEZRVUU0UlN4VlFVRTVSU3hGUVVGNVJpeFZRVUY2Uml4RlFVRnZSeXhWUVVGd1J5eEZRVUVyUnl4VlFVRXZSeXhGUVVFd1NDeFZRVUV4U0N4RlFVRnhTU3hWUVVGeVNTeEZRVUZuU2l4VlFVRm9TaXhGUVVFeVNpeFZRVUV6U2l4RlFVRnpTeXhWUVVGMFN5eEZRVUZwVEN4VlFVRnFUQ3hGUVVFMFRDeFZRVUUxVEN4RlFVRjFUU3hWUVVGMlRTeEZRVUZyVGl4VlFVRnNUaXhGUVVFMlRpeFZRVUUzVGl4RlFVRjNUeXhWUVVGNFR5eEZRVUZ0VUN4VlFVRnVVQ3hGUVVFNFVDeFZRVUU1VUN4RlFVRjVVU3hWUVVGNlVTeEZRVUZ2VWl4VlFVRndVaXhGUVVFclVpeFZRVUV2VWl4RlFVRXdVeXhWUVVFeFV5eEZRVUZ4VkN4VlFVRnlWQ3hGUVVGblZTeFZRVUZvVlN4RlFVRXlWU3hWUVVFelZTeEZRVUZ6Vml4VlFVRjBWaXhGUVVGcFZ5eFZRVUZxVnl4RlFVRTBWeXhWUVVFMVZ5eEZRVUYxV0N4VlFVRjJXQ3hGUVVGcldTeFZRVUZzV1N4RlFVRTJXU3hWUVVFM1dTeEZRVUYzV2l4VlFVRjRXaXhGUVVGdFlTeFZRVUZ1WVN4RlFVRTRZU3hWUVVFNVlTeEZRVUY1WWl4VlFVRjZZaXhGUVVGdll5eFZRVUZ3WXl4RlFVRXJZeXhWUVVFdll5eEZRVUV3WkN4VlFVRXhaQ3hGUVVGeFpTeFZRVUZ5WlN4RlFVRm5aaXhWUVVGb1ppeEZRVUV5Wml4VlFVRXpaaXhGUVVGelowSXNWVUZCZEdkQ0xFVkJRV2xvUWl4VlFVRnFhRUlzUlVGQk5HaENMRlZCUVRWb1FpeEZRVUYxYVVJc1ZVRkJkbWxDTEVWQlFXdHFRaXhWUVVGc2FrSXNSVUZCTm1wQ0xGVkJRVGRxUWl4RlFVRjNhMElzVlVGQmVHdENMRVZCUVcxc1FpeFZRVUZ1YkVJc1JVRkJPR3hDTEZWQlFUbHNRaXhGUVVGNWJVSXNWVUZCZW0xQ0xFVkJRVzl1UWl4VlFVRndia0lzUlVGQksyNUNMRlZCUVM5dVFpeEZRVUV3YjBJc1ZVRkJNVzlDTEVWQlFYRndRaXhWUVVGeWNFSXNSVUZCWjNGQ0xGVkJRV2h4UWl4RlFVRXljVUlzVlVGQk0zRkNMRVZCUVhOeVFpeFZRVUYwY2tJc1JVRkJhWE5DTEZWQlFXcHpRaXhGUVVFMGMwSXNWVUZCTlhOQ0xFVkJRWFYwUWl4VlFVRjJkRUlzUlVGQmEzVkNMRlZCUVd4MVFpeEZRVUUyZFVJc1ZVRkJOM1ZDTEVWQlFYZDJRaXhWUVVGNGRrSXNSVUZCYlhkQ0xGVkJRVzUzUWl4RlFVRTRkMElzVlVGQk9YZENMRVZCUVhsNFFpeFZRVUY2ZUVJc1JVRkJiM2xDTEZWQlFYQjVRaXhGUVVFcmVVSXNWVUZCTDNsQ0xFVkJRVEI2UWl4VlFVRXhla0lzUlVGQmNUQkNMRlZCUVhJd1FpeEZRVUZuTVVJc1ZVRkJhREZDTEVWQlFUSXhRaXhWUVVFek1VSXNSVUZCY3pKQ0xGVkJRWFF5UWl4RlFVRnBNMElzVlVGQmFqTkNMRVZCUVRRelFpeFZRVUUxTTBJc1JVRkJkVFJDTEZWQlFYWTBRaXhGUVVGck5VSXNWVUZCYkRWQ0xFVkJRVFkxUWl4VlFVRTNOVUlzUlVGQmR6WkNMRlZCUVhnMlFpeEZRVUZ0TjBJc1ZVRkJiamRDTEVWQlFUZzNRaXhWUVVFNU4wSXNSVUZCZVRoQ0xGVkJRWG80UWl4RlFVRnZPVUlzVlVGQmNEbENMRVZCUVNzNVFpeFZRVUV2T1VJc1JVRkJNQ3RDTEZWQlFURXJRaXhGUVVGeEwwSXNWVUZCY2k5Q0xFVkJRV2RuUXl4VlFVRm9aME1zUlVGQk1tZERMRlZCUVROblF5eEZRVUZ6YUVNc1ZVRkJkR2hETEVWQlFXbHBReXhWUVVGcWFVTXNSVUZCTkdsRExGVkJRVFZwUXl4RlFVRjFha01zVlVGQmRtcERMRVZCUVd0clF5eFZRVUZzYTBNc1JVRkJObXRETEZWQlFUZHJReXhGUVVGM2JFTXNWVUZCZUd4RExFVkJRVzF0UXl4VlFVRnViVU1zUlVGQk9HMURMRlZCUVRsdFF5eEZRVUY1YmtNc1ZVRkJlbTVETEVWQlFXOXZReXhWUVVGd2IwTXNSVUZCSzI5RExGVkJRUzl2UXl4RlFVRXdjRU1zVlVGQk1YQkRMRVZCUVhGeFF5eFZRVUZ5Y1VNc1JVRkJaM0pETEZWQlFXaHlReXhGUVVFeWNrTXNWVUZCTTNKRExFVkJRWE56UXl4VlFVRjBjME1zUlVGQmFYUkRMRlZCUVdwMFF5eEZRVUUwZEVNc1ZVRkJOWFJETEVWQlFYVjFReXhWUVVGMmRVTXNSVUZCYTNaRExGVkJRV3gyUXl4RlFVRTJka01zVlVGQk4zWkRMRVZCUVhkM1F5eFZRVUY0ZDBNc1JVRkJiWGhETEZWQlFXNTRReXhGUVVFNGVFTXNWVUZCT1hoRExFVkJRWGw1UXl4VlFVRjZlVU1zUlVGQmIzcERMRlZCUVhCNlF5eEZRVUVyZWtNc1ZVRkJMM3BETEVWQlFUQXdReXhWUVVFeE1FTXNSVUZCY1RGRExGVkJRWEl4UXl4RlFVRm5Na01zVlVGQmFESkRMRVZCUVRJeVF5eFZRVUV6TWtNc1JVRkJjek5ETEZWQlFYUXpReXhGUVVGcE5FTXNWVUZCYWpSRExFVkJRVFEwUXl4VlFVRTFORU1zUlVGQmRUVkRMRlZCUVhZMVF5eEZRVUZyTmtNc1ZVRkJiRFpETEVWQlFUWTJReXhWUVVFM05rTXNSVUZCZHpkRExGVkJRWGczUXl4RlFVRnRPRU1zVlVGQmJqaERMRVZCUVRnNFF5eFZRVUU1T0VNc1JVRkJlVGxETEZWQlFYbzVReXhGUVVGdkswTXNWVUZCY0N0RExFVkJRU3NyUXl4VlFVRXZLME1zUlVGQk1DOURMRlZCUVRFdlF5eEZRVUZ4WjBRc1ZVRkJjbWRFTEVWQlFXZG9SQ3hWUVVGb2FFUXNSVUZCTW1oRUxGVkJRVE5vUkN4RlFVRnphVVFzVlVGQmRHbEVMRVZCUVdscVJDeFZRVUZxYWtRc1JVRkJOR3BFTEZWQlFUVnFSQ3hGUVVGMWEwUXNWVUZCZG10RUxFVkJRV3RzUkN4VlFVRnNiRVFzUlVGQk5teEVMRlZCUVRkc1JDeEZRVUYzYlVRc1ZVRkJlRzFFTEVWQlFXMXVSQ3hWUVVGdWJrUXNSVUZCT0c1RUxGVkJRVGx1UkN4RlFVRjViMFFzVlVGQmVtOUVMRVZCUVc5d1JDeFZRVUZ3Y0VRc1JVRkJLM0JFTEZWQlFTOXdSQ3hGUVVFd2NVUXNWVUZCTVhGRUxFVkJRWEZ5UkN4VlFVRnlja1FzUlVGQlozTkVMRlZCUVdoelJDeEZRVUV5YzBRc1ZVRkJNM05FTEVWQlFYTjBSQ3hWUVVGMGRFUXNSVUZCYVhWRUxGVkJRV3AxUkN4RlFVRTBkVVFzVlVGQk5YVkVMRVZCUVhWMlJDeFZRVUYyZGtRc1JVRkJhM2RFTEZWQlFXeDNSQ3hGUVVFMmQwUXNWVUZCTjNkRUxFVkJRWGQ0UkN4VlFVRjRlRVFzUlVGQmJYbEVMRlZCUVc1NVJDeEZRVUU0ZVVRc1ZVRkJPWGxFTEVWQlFYbDZSQ3hWUVVGNmVrUXNSVUZCYnpCRUxGVkJRWEF3UkN4RlFVRXJNRVFzVlVGQkx6QkVMRVZCUVRBeFJDeFZRVUV4TVVRc1JVRkJjVEpFTEZWQlFYSXlSQ3hGUVVGbk0wUXNWVUZCYURORUxFVkJRVEl6UkN4VlFVRXpNMFFzUlVGQmN6UkVMRlZCUVhRMFJDeEZRVUZwTlVRc1ZVRkJhalZFTEVWQlFUUTFSQ3hWUVVFMU5VUXNSVUZCZFRaRUxGVkJRWFkyUkN4RlFVRnJOMFFzVlVGQmJEZEVMRVZCUVRZM1JDeFZRVUUzTjBRc1JVRkJkemhFTEZWQlFYZzRSQ3hGUVVGdE9VUXNWVUZCYmpsRUxFVkJRVGc1UkN4VlFVRTVPVVFzUlVGQmVTdEVMRlZCUVhvclJDeEZRVUZ2TDBRc1ZVRkJjQzlFTEVWQlFTc3ZSQ3hWUVVFdkwwUXNSVUZCTUdkRkxGVkJRVEZuUlN4RlFVRnhhRVVzVlVGQmNtaEZMRVZCUVdkcFJTeFZRVUZvYVVVc1JVRkJNbWxGTEZWQlFUTnBSU3hGUVVGemFrVXNWVUZCZEdwRkxFVkJRV2xyUlN4VlFVRnFhMFVzUlVGQk5HdEZMRlZCUVRWclJTeEZRVUYxYkVVc1ZVRkJkbXhGTEVWQlFXdHRSU3hWUVVGc2JVVXNSVUZCTm0xRkxGVkJRVGR0UlN4RlFVRjNia1VzVlVGQmVHNUZMRVZCUVcxdlJTeFZRVUZ1YjBVc1JVRkJPRzlGTEZWQlFUbHZSU3hGUVVGNWNFVXNWVUZCZW5CRkxFVkJRVzl4UlN4VlFVRndjVVVzUlVGQkszRkZMRlZCUVM5eFJTeEZRVUV3Y2tVc1ZVRkJNWEpGTEVWQlFYRnpSU3hWUVVGeWMwVXNSVUZCWjNSRkxGVkJRV2gwUlN4RlFVRXlkRVVzVlVGQk0zUkZMRVZCUVhOMVJTeFZRVUYwZFVVc1JVRkJhWFpGTEZWQlFXcDJSU3hGUVVFMGRrVXNWVUZCTlhaRkxFVkJRWFYzUlN4VlFVRjJkMFVzUlVGQmEzaEZMRlZCUVd4NFJTeEZRVUUyZUVVc1ZVRkJOM2hGTEVWQlFYZDVSU3hWUVVGNGVVVXNSVUZCYlhwRkxGVkJRVzU2UlN4RlFVRTRla1VzVlVGQk9YcEZMRVZCUVhrd1JTeFZRVUY2TUVVc1JVRkJiekZGTEZWQlFYQXhSU3hGUVVFck1VVXNWVUZCTHpGRkxFVkJRVEF5UlN4VlFVRXhNa1VzUlVGQmNUTkZMRlZCUVhJelJTeEZRVUZuTkVVc1ZVRkJhRFJGTEVWQlFUSTBSU3hWUVVFek5FVXNSVUZCY3pWRkxGVkJRWFExUlN4RlFVRnBOa1VzVlVGQmFqWkZMRVZCUVRRMlJTeFZRVUUxTmtVc1JVRkJkVGRGTEZWQlFYWTNSU3hGUVVGck9FVXNWVUZCYkRoRkxFVkJRVFk0UlN4VlFVRTNPRVVzUlVGQmR6bEZMRlZCUVhnNVJTeEZRVUZ0SzBVc1ZVRkJiaXRGTEVWQlFUZ3JSU3hWUVVFNUswVXNSVUZCZVM5RkxGVkJRWG92UlN4RlFVRnZaMFlzVlVGQmNHZEdMRVZCUVN0blJpeFZRVUV2WjBZc1JVRkJNR2hHTEZWQlFURm9SaXhGUVVGeGFVWXNWVUZCY21sR0xFVkJRV2RxUml4VlFVRm9ha1lzUlVGQk1tcEdMRlZCUVROcVJpeEZRVUZ6YTBZc1ZVRkJkR3RHTEVWQlFXbHNSaXhWUVVGcWJFWXNSVUZCTkd4R0xGVkJRVFZzUml4RlFVRjFiVVlzVlVGQmRtMUdMRVZCUVd0dVJpeFZRVUZzYmtZc1JVRkJObTVHTEZWQlFUZHVSaXhGUVVGM2IwWXNWVUZCZUc5R0xFVkJRVzF3Uml4VlFVRnVjRVlzUlVGQk9IQkdMRlZCUVRsd1JpeEZRVUY1Y1VZc1ZVRkJlbkZHTEVWQlFXOXlSaXhWUVVGd2NrWXNSVUZCSzNKR0xGVkJRUzl5Uml4RlFVRXdjMFlzVlVGQk1YTkdMRVZCUVhGMFJpeFZRVUZ5ZEVZc1JVRkJaM1ZHTEZWQlFXaDFSaXhGUVVFeWRVWXNWVUZCTTNWR0xFVkJRWE4yUml4VlFVRjBka1lzUlVGQmFYZEdMRlZCUVdwM1JpeEZRVUUwZDBZc1ZVRkJOWGRHTEVWQlFYVjRSaXhWUVVGMmVFWXNSVUZCYTNsR0xGVkJRV3g1Uml4RlFVRTJlVVlzVlVGQk4zbEdMRVZCUVhkNlJpeFZRVUY0ZWtZc1JVRkJiVEJHTEZWQlFXNHdSaXhGUVVFNE1FWXNWVUZCT1RCR0xFVkJRWGt4Uml4VlFVRjZNVVlzUlVGQmJ6SkdMRlZCUVhBeVJpeEZRVUVyTWtZc1ZVRkJMekpHTEVWQlFUQXpSaXhWUVVFeE0wWXNSVUZCY1RSR0xGVkJRWEkwUml4RlFVRm5OVVlzVlVGQmFEVkdMRVZCUVRJMVJpeFZRVUV6TlVZc1JVRkJjelpHTEZWQlFYUTJSaXhGUVVGcE4wWXNWVUZCYWpkR0xFVkJRVFEzUml4VlFVRTFOMFlzUlVGQmRUaEdMRlZCUVhZNFJpeEZRVUZyT1VZc1ZVRkJiRGxHTEVWQlFUWTVSaXhWUVVFM09VWXNSVUZCZHl0R0xGVkJRWGdyUml4RlFVRnRMMFlzVlVGQmJpOUdMRVZCUVRndlJpeFZRVUU1TDBZc1JVRkJlV2RITEZWQlFYcG5SeXhGUVVGdmFFY3NWVUZCY0doSExFVkJRU3RvUnl4VlFVRXZhRWNzUlVGQk1HbEhMRlZCUVRGcFJ5eEZRVUZ4YWtjc1ZVRkJjbXBITEVWQlFXZHJSeXhWUVVGb2EwY3NSVUZCTW10SExGVkJRVE5yUnl4RlFVRnpiRWNzVlVGQmRHeEhMRVZCUVdsdFJ5eFZRVUZxYlVjc1JVRkJORzFITEZWQlFUVnRSeXhGUVVGMWJrY3NWVUZCZG01SExFVkJRV3R2Unl4VlFVRnNiMGNzUlVGQk5tOUhMRlZCUVRkdlJ5eEZRVUYzY0Vjc1ZVRkJlSEJITEVWQlFXMXhSeXhWUVVGdWNVY3NSVUZCT0hGSExGVkJRVGx4Unl4RlFVRjVja2NzVlVGQmVuSkhMRVZCUVc5elJ5eFZRVUZ3YzBjc1JVRkJLM05ITEZWQlFTOXpSeXhGUVVFd2RFY3NWVUZCTVhSSE96dEJRVWRVT3pzN2MwSkJRMFlzU1VGQlFTeEhRVUZOTEZOQlFVRTdTVUZEUml4SlFVRkRMRU5CUVVFc1YwRkJSQ3hIUVVGbE8wbEJRMllzU1VGQlF5eERRVUZCTEZWQlFVUXNSMEZCWXp0SlFVTmtMRWxCUVVNc1EwRkJRU3haUVVGRUxFZEJRV2RDTzBsQlEyaENMRWxCUVVNc1EwRkJRU3hsUVVGRUxFTkJRVUU3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCUkN4RFFVRkJPMFZCVEVVN08zTkNRVTlPTEdWQlFVRXNSMEZCYVVJc1UwRkJRVHRYUVVWaUxGbEJRVmtzUTBGQlF5eE5RVUZpTEVOQlFXOUNMRlZCUVZVc1EwRkJReXhsUVVFdlFpeEZRVUZuUkN4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUjBGQlJEdHZSRUZETlVNc1IwRkJSeXhEUVVGRExGTkJRVlVzUzBGQlF5eERRVUZCTEZkQlFVUXNRMEZCUVR0TlFVUTRRanRKUVVGQkxFTkJRVUVzUTBGQlFTeERRVUZCTEVsQlFVRXNRMEZCYUVRN1JVRkdZVHM3YzBKQlRXcENMRmRCUVVFc1IwRkJZU3hUUVVGQk8wRkJRMVFzVVVGQlFUdEpRVUZCTEZOQlFVRXNSMEZCV1R0QlFVTmFMRk5CUVVFc09FTkJRVUU3TzAxQlEwa3NVMEZCUVN4SFFVRlpMRk5CUVZNc1EwRkJReXhMUVVGV0xFTkJRV2RDTEVOQlFXaENMRVZCUVcxQ0xFTkJRVzVDTzAxQlExb3NVVUZCUVN4SFFVRlhMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzVTBGQlVqdE5RVU5ZTEUxQlFVRXNSMEZCVXl4TFFVRkxMRU5CUVVNc1ZVRkJUaXhEUVVGcFFpeFJRVUZxUWp0TlFVTlVMRWxCUVVjc1RVRkJRU3hIUVVGVExFVkJRVm83VVVGRFNTeEpRVUZCTEVkQlFVOHNTVUZCUXl4RFFVRkJMRmRCUVZrc1EwRkJRU3hUUVVGQkxFTkJRVlVzUTBGQlF5eFBRVUY0UWl4RFFVRkJPMUZCUTFBc1UwRkJVeXhEUVVGRExFbEJRVllzUTBGQlpTeEpRVUZCTEVkQlFVOHNRMEZCUVN4RlFVRkJMRWRCUVVjc1RVRkJTQ3hEUVVGUUxFZEJRWEZDTEUxQlFVMHNRMEZCUXl4SlFVRTFRaXhIUVVGdFF5eEpRVUZzUkN4RlFVWktPenRCUVVwS08wRkJUMEVzVjBGQlR6dEZRVlJGT3p0elFrRlhZaXhOUVVGQkxFZEJRVkVzVTBGQlF5eFRRVUZFTzBGQlEwb3NVVUZCUVR0SlFVRkJMR05CUVVFc1IwRkJhVUlzU1VGQlF5eERRVUZCTEZkQlFWa3NRMEZCUVN4VFFVRkJMRU5CUVZVc1EwRkJReXhaUVVGNFFpeERRVUZCTzBsQlEycENMR1ZCUVVFc1IwRkJhMElzU1VGQlF5eERRVUZCTEZWQlFWY3NRMEZCUVN4VFFVRkJMRU5CUVZVc1EwRkJReXhwUWtGQmRrSXNRMEZCUVR0SlFVTnNRaXhSUVVGQkxFZEJRVmM3UVVGRFdDeFRRVUZCTEdkRlFVRkJPenROUVVOSkxFbEJRVk1zUzBGQlFTeEpRVUZUTEdOQlFXTXNRMEZCUXl4TlFVRm1MRWRCUVhkQ0xFTkJRVEZETzBGQlFVRXNZMEZCUVRzN1RVRkRRU3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEdWQlFXZENMRU5CUVVFc1MwRkJRU3hEUVVGb1FpeEhRVUY1UWl4RFFVRkRMRU5CUVVNc1UwRkJRU3hIUVVGWkxHTkJRV1VzUTBGQlFTeExRVUZCTEVkQlFWRXNRMEZCVWl4RFFVRTFRaXhEUVVGQkxFZEJRVEJETEVOQlFUTkRMRU5CUVRGQ0xFTkJRVUVzUjBGQk1rVXNSMEZCTlVVc1EwRkJaMFlzUTBGQlF5eFBRVUZxUml4RFFVRjVSaXhEUVVGNlJqdE5RVU5PTEZGQlFWRXNRMEZCUXl4SlFVRlVMRU5CUVdNc1IwRkJRU3hIUVVGTkxFbEJRWEJDTzBGQlNFbzdRVUZKUVN4WFFVRlBPMFZCVWtnN08zTkNRVlZTTEhsQ1FVRkJMRWRCUVRKQ0xGTkJRVU1zVTBGQlJEdEJRVU4yUWl4UlFVRkJPMGxCUVVFc2IwSkJRVUVzUjBGQmRVSXNTVUZCUXl4RFFVRkJMRmRCUVZrc1EwRkJRU3hUUVVGQkxFTkJRVlVzUTBGQlF5eHJRa0ZCZUVJc1EwRkJRVHRKUVVOMlFpeG5Ra0ZCUVN4SFFVRnRRaXhKUVVGRExFTkJRVUVzVlVGQlZ5eERRVUZCTEZOQlFVRXNRMEZCVlN4RFFVRkRMR05CUVhaQ0xFTkJRVUU3U1VGRGJrSXNVMEZCUVN4SFFVRlpMRU5CUVVNc1ZVRkJRU3hIUVVGaExFbEJRV1E3U1VGRFdpeFBRVUZQTEVOQlFVTXNSMEZCVWl4RFFVRlpMRzlDUVVGYUxFVkJRV3RETEdkQ1FVRnNRenRCUVVOQkxGTkJRVUVzYzBWQlFVRTdPMDFCUTBrc1NVRkJVeXhMUVVGQkxFbEJRVk1zYjBKQlFXOUNMRU5CUVVNc1RVRkJja0lzUjBGQk9FSXNRMEZCYUVRN1FVRkJRU3hqUVVGQk96dE5RVU5CTEVsQlFVRXNSMEZCVHl4SFFVRkJMRWRCUVUwc1owSkJRV2xDTEVOQlFVRXNTMEZCUVN4RFFVRjJRaXhIUVVGblF5eERRVUZETEdWQlFVRXNSMEZCYTBJc2IwSkJRWEZDTEVOQlFVRXNTMEZCUVN4SFFVRlJMRU5CUVZJc1EwRkJlRU1zUTBGQmFFTXNSMEZCYzBZN1RVRkROMFlzVTBGQlV5eERRVUZETEVsQlFWWXNRMEZCWlN4SlFVRkJMRWRCUVU4c1NVRkJkRUk3UVVGSVNqdEJRVWxCTEZkQlFVODdSVUZVWjBJN08zTkNRVmN6UWl4VlFVRkJMRWRCUVZrc1UwRkJRVHRCUVVOU0xGRkJRVUU3U1VGQlFTeEhRVUZCTEVkQlFVMDdRVUZEVGl4VFFVRkJMRGhEUVVGQk96dE5RVU5KTEZOQlFVRXNSMEZCV1N4VFFVRlRMRU5CUVVNc1MwRkJWaXhEUVVGblFpeERRVUZvUWl4RlFVRnRRaXhEUVVGdVFqdE5RVU5hTEVsQlFVTXNRMEZCUVN4WFFVRlpMRU5CUVVFc1UwRkJRU3hEUVVGaUxFZEJRVEJDTEVsQlFVa3NXVUZCU2l4RFFVRnBRaXhIUVVGcVFpeEZRVUZ6UWl4VFFVRjBRanROUVVNeFFpeEpRVUZETEVOQlFVRXNWVUZCVnl4RFFVRkJMRk5CUVVFc1EwRkJXaXhIUVVGNVFpeEpRVUZKTEdWQlFVb3NRMEZCYjBJc1IwRkJjRUlzUlVGQmVVSXNVMEZCZWtJN1RVRkRla0lzU1VGQlF5eERRVUZCTEZsQlFXRXNRMEZCUVN4VFFVRkJMRU5CUVdRc1IwRkJNa0lzU1VGQlNTeHBRa0ZCU2l4RFFVRnpRaXhIUVVGMFFpeEZRVUV5UWl4VFFVRXpRanRCUVVvdlFqdEZRVVpST3pzN096czdRVUZUYUVJc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlmUT09XG4iLCJ2YXIgRXZlbnRNYW5hZ2VyO1xuXG5FdmVudE1hbmFnZXIgPSB7XG4gIHNlbmQ6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIHZhciBldmVudDtcbiAgICBldmVudCA9IG5ldyBjYy5FdmVudEN1c3RvbShldmVudE5hbWUpO1xuICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICBldmVudC5zZXRVc2VyRGF0YShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSxcbiAgbGlzdGVuOiBmdW5jdGlvbihldmVudE5hbWUsIGxpc3RlbkZ1bmMsIG5vZGVPclByaW9yaXR5KSB7XG4gICAgdmFyIGNjTGlzdGVuZXI7XG4gICAgaWYgKG5vZGVPclByaW9yaXR5ID09IG51bGwpIHtcbiAgICAgIG5vZGVPclByaW9yaXR5ID0gMTtcbiAgICB9XG4gICAgY2NMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLkNVU1RPTSxcbiAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5GdW5jKGV2ZW50LmdldFVzZXJEYXRhKCksIGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGNjTGlzdGVuZXIsIG5vZGVPclByaW9yaXR5KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE1hbmFnZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlpYWmxiblF2UVhKclJYWmxiblJOWVc1aFoyVnlMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDJWMlpXNTBMMEZ5YTBWMlpXNTBUV0Z1WVdkbGNpNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRMGs3UlVGQlFTeEpRVUZCTEVWQlFVMHNVMEZCUXl4VFFVRkVMRVZCUVZrc1NVRkJXanRCUVVOR0xGRkJRVUU3U1VGQlFTeExRVUZCTEVkQlFWRXNTVUZCU1N4RlFVRkZMRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeFRRVUZ1UWp0SlFVTlNMRWxCUVVrc1NVRkJRU3hMUVVGUkxFbEJRVm83VFVGRFNTeExRVUZMTEVOQlFVTXNWMEZCVGl4RFFVRnJRaXhKUVVGc1FpeEZRVVJLT3p0WFFVVkJMRVZCUVVVc1EwRkJReXhaUVVGWkxFTkJRVU1zWVVGQmFFSXNRMEZCT0VJc1MwRkJPVUk3UlVGS1JTeERRVUZPTzBWQlMwRXNUVUZCUVN4RlFVRlJMRk5CUVVNc1UwRkJSQ3hGUVVGWkxGVkJRVm9zUlVGQmQwSXNZMEZCZUVJN1FVRkRTaXhSUVVGQk96dE5RVUZCTEdsQ1FVRnJRanM3U1VGRGJFSXNWVUZCUVN4SFFVRmhMRVZCUVVVc1EwRkJReXhoUVVGaExFTkJRVU1zVFVGQmFrSXNRMEZEVkR0TlFVRkJMRXRCUVVFc1JVRkJUeXhGUVVGRkxFTkJRVU1zWVVGQllTeERRVUZETEUxQlFYaENPMDFCUTBFc1UwRkJRU3hGUVVGWExGTkJSRmc3VFVGRlFTeFJRVUZCTEVWQlFWVXNVMEZCUXl4TFFVRkVPMEZCUTA0c1pVRkJUeXhWUVVGQkxFTkJRVmNzUzBGQlN5eERRVUZETEZkQlFVNHNRMEZCUVN4RFFVRllMRVZCUVdkRExFdEJRV2hETzAxQlJFUXNRMEZHVmp0TFFVUlRPMWRCVFdJc1JVRkJSU3hEUVVGRExGbEJRVmtzUTBGQlF5eFhRVUZvUWl4RFFVRTBRaXhWUVVFMVFpeEZRVUYzUXl4alFVRjRRenRGUVZKSkxFTkJURkk3T3p0QlFXTktMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIEV2ZW50TmFtZXM7XG5cbkV2ZW50TmFtZXMgPSB7XG4gIEdBTUVfU1RBUlQ6IFwiZ2FtZS5zdGFydFwiLFxuICBHQU1FX0VORDogXCJnYW1lLmVuZFwiLFxuICBHQU1FX05FWFRfTEVWRUw6IFwiZ2FtZS5uZXh0LmxldmVsXCIsXG4gIEdBTUVfR0VUX1JFU1VMVDogXCJnYW1lLmdldC5yZXN1bHRcIixcbiAgR0FNRV9JTklUX1RBQkxFOiBcImdhbWUuaW5pdC50YWJsZVwiXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TmFtZXM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlpYWmxiblF2UVhKclJYWmxiblJPWVcxbGN5NWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTlsZG1WdWRDOUJjbXRGZG1WdWRFNWhiV1Z6TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkJPenRCUVVGQkxGVkJRVUVzUjBGRFNUdEZRVUZCTEZWQlFVRXNSVUZCYTBJc1dVRkJiRUk3UlVGRFFTeFJRVUZCTEVWQlFXdENMRlZCUkd4Q08wVkJSVUVzWlVGQlFTeEZRVUZyUWl4cFFrRkdiRUk3UlVGSlFTeGxRVUZCTEVWQlFXdENMR2xDUVVwc1FqdEZRVXRCTEdWQlFVRXNSVUZCYTBJc2FVSkJUR3hDT3pzN1FVRlBTaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlKOVxuIiwiZ2xvYmFsLnllYXIgPSA2O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaMnh2WW1Gc1ZtRnNkV1V1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdloyeHZZbUZzVm1Gc2RXVXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTFCUVUwc1EwRkJReXhKUVVGUUxFZEJRV01pZlE9PVxuIiwiY2MuZ2FtZS5vblN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBHYW1lTG9naWMsIGdhbWVEaWFsb2csIGdhbWVMb2dpY09iaiwgc2NlbmVNYW5hZ2VyO1xuICBjYy52aWV3LmFkanVzdFZpZXdQb3J0KHRydWUpO1xuICBjYy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKDExMzYsIDY0MCwgY2MuUmVzb2x1dGlvblBvbGljeS5TSE9XX0FMTCk7XG4gIGNjLnZpZXcuZW5hYmxlQXV0b0Z1bGxTY3JlZW4oZmFsc2UpO1xuICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcbiAgY2MuQnVpbGRlclJlYWRlci5zZXRSZXNvdXJjZVBhdGgoXCJyZXMvXCIpO1xuICBzY2VuZU1hbmFnZXIgPSByZXF1aXJlKFwiLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlXCIpO1xuICBzY2VuZU1hbmFnZXIuaW5pdCgpO1xuICBnYW1lRGlhbG9nID0gcmVxdWlyZSgnLi9jY2JWaWV3L0Fya01haW5EaWFsb2cuY29mZmVlJyk7XG4gIHNjZW5lTWFuYWdlci5hZGRMYXllclRvU2NlbmUoZ2FtZURpYWxvZyk7XG4gIEdhbWVMb2dpYyA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmtHYW1lTG9naWMuY29mZmVlJyk7XG4gIGdhbWVMb2dpY09iaiA9IG5ldyBHYW1lTG9naWMoKTtcbiAgcmV0dXJuIGdhbWVMb2dpY09iai5pbml0KCk7XG59O1xuXG5jYy5nYW1lLnJ1bigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiV0ZwYmk1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OXRZV2x1TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVklzUjBGQmEwSXNVMEZCUVR0QlFVTmtMRTFCUVVFN1JVRkJRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFWSXNRMEZCZFVJc1NVRkJka0k3UlVGRFFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMSFZDUVVGU0xFTkJRV2RETEVsQlFXaERMRVZCUVhORExFZEJRWFJETEVWQlFUSkRMRVZCUVVVc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UlFVRXZSRHRGUVVOQkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNiMEpCUVZJc1EwRkJOa0lzUzBGQk4wSTdSVUZEUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExIRkNRVUZTTEVOQlFUaENMRWxCUVRsQ08wVkJRMEVzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4bFFVRnFRaXhEUVVGcFF5eE5RVUZxUXp0RlFVVkJMRmxCUVVFc1IwRkJaU3hQUVVGQkxFTkJRVkVzWjBOQlFWSTdSVUZEWml4WlFVRlpMRU5CUVVNc1NVRkJZaXhEUVVGQk8wVkJSVUVzVlVGQlFTeEhRVUZoTEU5QlFVRXNRMEZCVVN4blEwRkJVanRGUVVOaUxGbEJRVmtzUTBGQlF5eGxRVUZpTEVOQlFUWkNMRlZCUVRkQ08wVkJSVUVzVTBGQlFTeEhRVUZaTEU5QlFVRXNRMEZCVVN3clFrRkJVanRGUVVOYUxGbEJRVUVzUjBGQlpTeEpRVUZKTEZOQlFVb3NRMEZCUVR0VFFVTm1MRmxCUVZrc1EwRkJReXhKUVVGaUxFTkJRVUU3UVVGbVl6czdRVUZyUW14Q0xFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCVWl4RFFVRkJJbjA9XG4iLCJ2YXIgVXNlckRhdGE7XG5cblVzZXJEYXRhID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBVc2VyRGF0YSgpIHtcbiAgICB0aGlzLl9zY29yZSA9IDA7XG4gICAgdGhpcy5fY291bnQgPSAwO1xuICB9XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oX3Njb3JlKSB7XG4gICAgdGhpcy5fc2NvcmUgPSBfc2NvcmU7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLmdldFNjb3JlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRDb3VudCA9IGZ1bmN0aW9uKF9jb3VudCkge1xuICAgIHRoaXMuX2NvdW50ID0gX2NvdW50O1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudDtcbiAgfTtcblxuICByZXR1cm4gVXNlckRhdGE7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckRhdGE7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UVhKclZYTmxja1JoZEdFdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFN08wRkJRVTA3UlVGRFZ5eHJRa0ZCUVR0SlFVTlVMRWxCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVlU3U1VGRFZpeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlZPMFZCUmtRN08zRkNRVWxpTEZGQlFVRXNSMEZCVlN4VFFVRkRMRTFCUVVRN1NVRkJReXhKUVVGRExFTkJRVUVzVTBGQlJEdEZRVUZFT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlFUdFhRVUZITEVsQlFVTXNRMEZCUVR0RlFVRktPenR4UWtGRlZpeFJRVUZCTEVkQlFWVXNVMEZCUXl4TlFVRkVPMGxCUVVNc1NVRkJReXhEUVVGQkxGTkJRVVE3UlVGQlJEczdjVUpCUlZZc1VVRkJRU3hIUVVGVkxGTkJRVUU3VjBGQlJ5eEpRVUZETEVOQlFVRTdSVUZCU2pzN096czdPMEZCUldRc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlmUT09XG4iLCJ2YXIgQmFsYW5jZVNoZWV0LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cblRhYmxlQmFzZSA9IHJlcXVpcmUoXCIuL1RhYmxlQmFzZS5jb2ZmZWVcIik7XG5cbkJhbGFuY2VTaGVldCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCYWxhbmNlU2hlZXQsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEJhbGFuY2VTaGVldCgpIHtcbiAgICByZXR1cm4gQmFsYW5jZVNoZWV0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5nZXRGaWxlUGF0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInJlcy9cIiArIHRoaXMuX3N0b2NrVHlwZSArIFwiX2pzb24vemNmemJfXCIgKyB0aGlzLl9zdG9ja0NvZGUgKyBcIi5qc29uXCI7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5nZXRDYXNoVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi6LSn5biB6LWE6YeRKOS4h+WFgylcIl0pO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0VG90YWxBc3NldHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi6LWE5Lqn5oC76K6hKOS4h+WFgylcIl0pO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0TmV0QXNzZXRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuW9kuWxnuS6juavjeWFrOWPuOiCoeS4nOadg+ebiuWQiOiuoSjkuIflhYMpXCJdKTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLl9nZXROb05lZWRDYWxjSXRlbXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW1wi6LWE5paZXCIsIFwi5oql5ZGK5pel5pyfXCJdO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0UmVjZWl2YWJsZVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuW6lOaUtui0puasvijkuIflhYMpXCJdKTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmR1bXBQZXJjZW50VGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXNzZXRzUGVyY2VudFRhYmxlLCBjZWxWYWx1ZSwgaSwgaW5kZXgsIGtleSwgbGVuLCBwZXJjZW50LCBwZXJjZW50VGFibGUsIHJlZiwgcmVmMSwgdG90YWxBc3NldHMsIHZhbHVlO1xuICAgIHRvdGFsQXNzZXRzID0gdGhpcy5nZXRUb3RhbEFzc2V0cygpO1xuICAgIGFzc2V0c1BlcmNlbnRUYWJsZSA9IFtdO1xuICAgIHJlZiA9IHRoaXMuX2RhdGE7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWx1ZSA9IHJlZltrZXldO1xuICAgICAgcGVyY2VudFRhYmxlID0gW2tleSArIFwiXFx0XFx0XFx0XFx0XFx0XCJdO1xuICAgICAgaWYgKHZhbHVlWzBdID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLl9nZXROb05lZWRDYWxjSXRlbXMoKSwga2V5KSA+PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVmMSA9IHRoaXMuZ2V0VmFsdWUodmFsdWUpO1xuICAgICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgICAgY2VsVmFsdWUgPSByZWYxW2luZGV4XTtcbiAgICAgICAgcGVyY2VudCA9IGNlbFZhbHVlIC8gdG90YWxBc3NldHNbaW5kZXhdICogMTAwO1xuICAgICAgICBwZXJjZW50VGFibGUucHVzaChwZXJjZW50LnRvRml4ZWQoMikpO1xuICAgICAgICBwZXJjZW50VGFibGUucHVzaChcIlxcdFxcdFxcdFxcdFwiKTtcbiAgICAgIH1cbiAgICAgIHBlcmNlbnRUYWJsZS5wdXNoKFwiXFxuXCIpO1xuICAgICAgYXNzZXRzUGVyY2VudFRhYmxlLnB1c2gocGVyY2VudFRhYmxlKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXNzZXRzUGVyY2VudFRhYmxlLCBudWxsLCBcIlxcdFwiKSk7XG4gICAgcmV0dXJuIGFzc2V0c1BlcmNlbnRUYWJsZTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldEN1cnJlbnRSYXRpbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50QXNzZXRzLCBjdXJyZW50QXNzZXRzVGFibGUsIGN1cnJlbnREZWJ0c1RhYmxlLCBjdXJyZW50UmF0aW8sIGksIGluZGV4LCBsZW47XG4gICAgY3VycmVudEFzc2V0c1RhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5rWB5Yqo6LWE5Lqn5ZCI6K6hKOS4h+WFgylcIl0pO1xuICAgIGN1cnJlbnREZWJ0c1RhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5rWB5Yqo6LSf5YC65ZCI6K6hKOS4h+WFgylcIl0pO1xuICAgIGN1cnJlbnRSYXRpbyA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gY3VycmVudEFzc2V0c1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIGN1cnJlbnRBc3NldHMgPSBjdXJyZW50QXNzZXRzVGFibGVbaW5kZXhdO1xuICAgICAgY3VycmVudFJhdGlvLnB1c2goKGN1cnJlbnRBc3NldHMgLyBjdXJyZW50RGVidHNUYWJsZVtpbmRleF0pLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFJhdGlvO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0UXVpY2tSYXRpbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50QXNzZXRzLCBjdXJyZW50QXNzZXRzVGFibGUsIGN1cnJlbnREZWJ0c1RhYmxlLCBpLCBpbmRleCwgaW52ZW50b3J5VGFibGUsIGxlbiwgcXVpY2tSYXRpbztcbiAgICBjdXJyZW50QXNzZXRzVGFibGUgPSB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLmtYHliqjotYTkuqflkIjorqEo5LiH5YWDKVwiXSk7XG4gICAgY3VycmVudERlYnRzVGFibGUgPSB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLmtYHliqjotJ/lgLrlkIjorqEo5LiH5YWDKVwiXSk7XG4gICAgaW52ZW50b3J5VGFibGUgPSB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLlrZjotKco5LiH5YWDKVwiXSk7XG4gICAgcXVpY2tSYXRpbyA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gY3VycmVudEFzc2V0c1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIGN1cnJlbnRBc3NldHMgPSBjdXJyZW50QXNzZXRzVGFibGVbaW5kZXhdO1xuICAgICAgcXVpY2tSYXRpby5wdXNoKCgoY3VycmVudEFzc2V0cyAtIGludmVudG9yeVRhYmxlW2luZGV4XSkgLyBjdXJyZW50RGVidHNUYWJsZVtpbmRleF0pLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICByZXR1cm4gcXVpY2tSYXRpbztcbiAgfTtcblxuICByZXR1cm4gQmFsYW5jZVNoZWV0O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGFuY2VTaGVldDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRbUZzWVc1alpWTm9aV1YwTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyMXZaR1ZzTDBKaGJHRnVZMlZUYUdWbGRDNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4MVFrRkJRVHRGUVVGQk96czdPMEZCUVVFc1UwRkJRU3hIUVVGaExFOUJRVUVzUTBGQlVTeHZRa0ZCVWpzN1FVRkhVRHM3T3pzN096dDVRa0ZEVEN4WFFVRkJMRWRCUVZrc1UwRkJRVHRYUVVOWUxFMUJRVUVzUjBGQlR5eEpRVUZETEVOQlFVRXNWVUZCVWl4SFFVRnRRaXhqUVVGdVFpeEhRVUZwUXl4SlFVRkRMRU5CUVVFc1ZVRkJiRU1zUjBGQk5rTTdSVUZFYkVNN08zbENRVWRhTEZsQlFVRXNSMEZCWXl4VFFVRkJPMWRCUVVjc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRlZCUVVFc1EwRkJha0k3UlVGQlNEczdlVUpCUldRc1kwRkJRU3hIUVVGblFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZWQlFVRXNRMEZCYWtJN1JVRkJTRHM3ZVVKQlJXaENMRmxCUVVFc1IwRkJZeXhUUVVGQk8xZEJRVWNzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxHdENRVUZCTEVOQlFXcENPMFZCUVVnN08zbENRVVZrTEcxQ1FVRkJMRWRCUVhGQ0xGTkJRVUU3VjBGQlJ5eERRVUZETEVsQlFVUXNSVUZCVHl4TlFVRlFPMFZCUVVnN08zbENRVVZ5UWl4clFrRkJRU3hIUVVGdlFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZWQlFVRXNRMEZCYWtJN1JVRkJTRHM3ZVVKQlJYQkNMR2RDUVVGQkxFZEJRV3RDTEZOQlFVRTdRVUZEYWtJc1VVRkJRVHRKUVVGQkxGZEJRVUVzUjBGQll5eEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRkJPMGxCUTJRc2EwSkJRVUVzUjBGQmNVSTdRVUZEY2tJN1FVRkJRU3hUUVVGQkxGVkJRVUU3TzAxQlEwTXNXVUZCUVN4SFFVRmxMRU5CUVVNc1IwRkJRU3hIUVVGTkxGbEJRVkE3VFVGRFppeEpRVUZaTEV0QlFVMHNRMEZCUVN4RFFVRkJMRU5CUVU0c1MwRkJXU3hEUVVGNFFqdEJRVUZCTEdsQ1FVRkJPenROUVVOQkxFbEJRVmtzWVVGQlR5eEpRVUZETEVOQlFVRXNiVUpCUVVRc1EwRkJRU3hEUVVGUUxFVkJRVUVzUjBGQlFTeE5RVUZhTzBGQlFVRXNhVUpCUVVFN08wRkJRMEU3UVVGQlFTeFhRVUZCTEhORVFVRkJPenRSUVVORExFOUJRVUVzUjBGQlZTeFJRVUZCTEVkQlFWY3NWMEZCV1N4RFFVRkJMRXRCUVVFc1EwRkJka0lzUjBGQlowTTdVVUZETVVNc1dVRkJXU3hEUVVGRExFbEJRV0lzUTBGQmEwSXNUMEZCVHl4RFFVRkRMRTlCUVZJc1EwRkJaMElzUTBGQmFFSXNRMEZCYkVJN1VVRkRRU3haUVVGWkxFTkJRVU1zU1VGQllpeERRVUZyUWl4VlFVRnNRanRCUVVoRU8wMUJTVUVzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCYTBJc1NVRkJiRUk3VFVGRFFTeHJRa0ZCYTBJc1EwRkJReXhKUVVGdVFpeERRVUYzUWl4WlFVRjRRanRCUVZSRU8wbEJWVUVzVDBGQlR5eERRVUZETEVkQlFWSXNRMEZCV1N4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExHdENRVUZtTEVWQlFXMURMRWxCUVc1RExFVkJRWGxETEVsQlFYcERMRU5CUVZvN1FVRkRRU3hYUVVGUE8wVkJaRlU3TzNsQ1FXZENiRUlzWlVGQlFTeEhRVUZwUWl4VFFVRkJPMEZCUTJoQ0xGRkJRVUU3U1VGQlFTeHJRa0ZCUVN4SFFVRnhRaXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1dVRkJRU3hEUVVGcVFqdEpRVU55UWl4cFFrRkJRU3hIUVVGdlFpeEpRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRWxCUVVNc1EwRkJRU3hMUVVGTkxFTkJRVUVzV1VGQlFTeERRVUZxUWp0SlFVTndRaXhaUVVGQkxFZEJRV1U3UVVGRFppeFRRVUZCTEc5RlFVRkJPenROUVVORExGbEJRVmtzUTBGQlF5eEpRVUZpTEVOQlFXdENMRU5CUVVNc1lVRkJRU3hIUVVGblFpeHBRa0ZCYTBJc1EwRkJRU3hMUVVGQkxFTkJRVzVETEVOQlFUQkRMRU5CUVVNc1QwRkJNME1zUTBGQmJVUXNRMEZCYmtRc1EwRkJiRUk3UVVGRVJEdFhRVVZCTzBWQlRtZENPenQ1UWtGUmFrSXNZVUZCUVN4SFFVRmxMRk5CUVVFN1FVRkRaQ3hSUVVGQk8wbEJRVUVzYTBKQlFVRXNSMEZCY1VJc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRmxCUVVFc1EwRkJha0k3U1VGRGNrSXNhVUpCUVVFc1IwRkJiMElzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxGbEJRVUVzUTBGQmFrSTdTVUZEY0VJc1kwRkJRU3hIUVVGcFFpeEpRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRWxCUVVNc1EwRkJRU3hMUVVGTkxFTkJRVUVzVVVGQlFTeERRVUZxUWp0SlFVTnFRaXhWUVVGQkxFZEJRV0U3UVVGRFlpeFRRVUZCTEc5RlFVRkJPenROUVVORExGVkJRVlVzUTBGQlF5eEpRVUZZTEVOQlFXZENMRU5CUVVNc1EwRkJReXhoUVVGQkxFZEJRV2RDTEdOQlFXVXNRMEZCUVN4TFFVRkJMRU5CUVdoRExFTkJRVUVzUjBGQk1FTXNhVUpCUVd0Q0xFTkJRVUVzUzBGQlFTeERRVUUzUkN4RFFVRnZSU3hEUVVGRExFOUJRWEpGTEVOQlFUWkZMRU5CUVRkRkxFTkJRV2hDTzBGQlJFUTdWMEZGUVR0RlFWQmpPenM3TzBkQmRFTlhPenRCUVN0RE0wSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIENhc2hGbG93U3RhdGVtZW50LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChDYXNoRmxvd1N0YXRlbWVudCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQ2FzaEZsb3dTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIENhc2hGbG93U3RhdGVtZW50Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQ2FzaEZsb3dTdGF0ZW1lbnQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi94amxsYl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICByZXR1cm4gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbn0pKFRhYmxlQmFzZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRXNORUpCUVVFN1JVRkJRVHM3TzBGQlFVRXNVMEZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3h2UWtGQlVqczdRVUZGVURzN096czdPenM0UWtGRlRDeFhRVUZCTEVkQlFXRXNVMEZCUVR0WFFVTmFMRTFCUVVFc1IwRkJUeXhKUVVGRExFTkJRVUVzVlVGQlVpeEhRVUZ0UWl4alFVRnVRaXhIUVVGcFF5eEpRVUZETEVOQlFVRXNWVUZCYkVNc1IwRkJOa003UlVGRWFrTTdPenM3UjBGR2EwSTdPMEZCUzJoRExFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgUHJvZml0U3RhdGVtZW50LCBUYWJsZUJhc2UsIHV0aWxzLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuVGFibGVCYXNlID0gcmVxdWlyZShcIi4vVGFibGVCYXNlLmNvZmZlZVwiKTtcblxudXRpbHMgPSByZXF1aXJlKCcuLi90b29scy91dGlscy5jb2ZmZWUnKTtcblxuUHJvZml0U3RhdGVtZW50ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFByb2ZpdFN0YXRlbWVudCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUHJvZml0U3RhdGVtZW50KCkge1xuICAgIHJldHVybiBQcm9maXRTdGF0ZW1lbnQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBQcm9maXRTdGF0ZW1lbnQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi9scmJfXCIgKyB0aGlzLl9zdG9ja0NvZGUgKyBcIi5qc29uXCI7XG4gIH07XG5cbiAgUHJvZml0U3RhdGVtZW50LnByb3RvdHlwZS5nZXRJbmNvbWVWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLokKXkuJrmlLblhaUo5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgUHJvZml0U3RhdGVtZW50LnByb3RvdHlwZS5nZXROZXRQcm9maXRBZGRSYXRpbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZGRSYXRpbywgYWRkVGltZXMsIG5ldFByb2ZpdFRhYmxlO1xuICAgIG5ldFByb2ZpdFRhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5YeA5Yip5ramKOS4h+WFgylcIl0pO1xuICAgIGFkZFRpbWVzID0gbmV0UHJvZml0VGFibGVbMF0gLyBuZXRQcm9maXRUYWJsZVtuZXRQcm9maXRUYWJsZS5sZW5ndGggLSAxXTtcbiAgICBhZGRSYXRpbyA9IHV0aWxzLmdldENvbXBvdW5kUmF0ZShhZGRUaW1lcywgZ2xvYmFsLnllYXIpO1xuICAgIGFkZFJhdGlvID0gKChhZGRSYXRpbyAtIDEpICogMTAwKS50b0ZpeGVkKDIpO1xuICAgIHJldHVybiBhZGRSYXRpbztcbiAgfTtcblxuICBQcm9maXRTdGF0ZW1lbnQucHJvdG90eXBlLmdldE5ldFByb2ZpdFRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuWHgOWIqea2pijkuIflhYMpXCJdKTtcbiAgfTtcblxuICByZXR1cm4gUHJvZml0U3RhdGVtZW50O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpdFN0YXRlbWVudDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZVSEp2Wm1sMFUzUmhkR1Z0Wlc1MExtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMjF2WkdWc0wxQnliMlpwZEZOMFlYUmxiV1Z1ZEM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1NVRkJRU3hwUTBGQlFUdEZRVUZCT3pzN1FVRkJRU3hUUVVGQkxFZEJRV0VzVDBGQlFTeERRVUZSTEc5Q1FVRlNPenRCUVVOaUxFdEJRVUVzUjBGQlZTeFBRVUZCTEVOQlFWRXNkVUpCUVZJN08wRkJSVW83T3pzN096czdORUpCUTB3c1YwRkJRU3hIUVVGaExGTkJRVUU3VjBGRFdpeE5RVUZCTEVkQlFVOHNTVUZCUXl4RFFVRkJMRlZCUVZJc1IwRkJiVUlzV1VGQmJrSXNSMEZCSzBJc1NVRkJReXhEUVVGQkxGVkJRV2hETEVkQlFUSkRPMFZCUkM5Q096czBRa0ZIWWl4alFVRkJMRWRCUVdkQ0xGTkJRVUU3VjBGQlJ5eEpRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRWxCUVVNc1EwRkJRU3hMUVVGTkxFTkJRVUVzVlVGQlFTeERRVUZxUWp0RlFVRklPenMwUWtGRmFFSXNiMEpCUVVFc1IwRkJjMElzVTBGQlFUdEJRVU55UWl4UlFVRkJPMGxCUVVFc1kwRkJRU3hIUVVGcFFpeEpRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRWxCUVVNc1EwRkJRU3hMUVVGTkxFTkJRVUVzVTBGQlFTeERRVUZxUWp0SlFVTnFRaXhSUVVGQkxFZEJRVmNzWTBGQlpTeERRVUZCTEVOQlFVRXNRMEZCWml4SFFVRnZRaXhqUVVGbExFTkJRVUVzWTBGQll5eERRVUZETEUxQlFXWXNSMEZCZDBJc1EwRkJlRUk3U1VGRE9VTXNVVUZCUVN4SFFVRlhMRXRCUVVzc1EwRkJReXhsUVVGT0xFTkJRWE5DTEZGQlFYUkNMRVZCUVdkRExFMUJRVTBzUTBGQlF5eEpRVUYyUXp0SlFVTllMRkZCUVVFc1IwRkJWeXhEUVVGRExFTkJRVU1zVVVGQlFTeEhRVUZYTEVOQlFWb3NRMEZCUVN4SFFVRnBRaXhIUVVGc1FpeERRVUZ6UWl4RFFVRkRMRTlCUVhaQ0xFTkJRU3RDTEVOQlFTOUNPMWRCUTFnN1JVRk1jVUk3T3pSQ1FVOTBRaXhwUWtGQlFTeEhRVUZ2UWl4VFFVRkJPMWRCUVVjc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRk5CUVVFc1EwRkJha0k3UlVGQlNEczdPenRIUVdKVE96dEJRV1U1UWl4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiIsInZhciBUYWJsZUJhc2U7XG5cblRhYmxlQmFzZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGFibGVCYXNlKF9zdG9ja1R5cGUsIF9zdG9ja0NvZGUpIHtcbiAgICB0aGlzLl9zdG9ja1R5cGUgPSBfc3RvY2tUeXBlO1xuICAgIHRoaXMuX3N0b2NrQ29kZSA9IF9zdG9ja0NvZGU7XG4gICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIHRoaXMuX2xvYWRKc29uKCk7XG4gIH1cblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7fTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9sb2FkSnNvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWxlUGF0aDtcbiAgICBmaWxlUGF0aCA9IHRoaXMuZ2V0RmlsZVBhdGgoKTtcbiAgICByZXR1cm4gY2MubG9hZGVyLmxvYWRKc29uKGZpbGVQYXRoLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5nZXRJbmZvID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbXCLotYTmlplcIl1bMF0gKyBcIi0tLS0tLVwiICsgdGhpcy5fZGF0YVtcIui1hOaWmVwiXVsyXTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9nZXRTaG93TnVtYmVyID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgcmV0dXJuICgobnVtYmVyIC8gMTAwMDAwKS50b0ZpeGVkKDIpKSArIFwiIOS6v1wiO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0Rm9ybWF0TnVtYmVyVGFibGUgPSBmdW5jdGlvbihudW1iZXJUYWJsZSkge1xuICAgIHZhciBmb3JtYXRUYWJsZSwgaSwgbGVuLCBudW1iZXI7XG4gICAgZm9ybWF0VGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBudW1iZXJUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbnVtYmVyID0gbnVtYmVyVGFibGVbaV07XG4gICAgICBmb3JtYXRUYWJsZS5wdXNoKHRoaXMuX2dldFNob3dOdW1iZXIobnVtYmVyKSk7XG4gICAgfVxuICAgIHJldHVybiBmb3JtYXRUYWJsZTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9nZXRZZWFyVmFsdWVJbmRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBpbmRleCwgaW5kZXhUYWJsZSwgbGVuLCByZWYsIHRpbWVTdHI7XG4gICAgaW5kZXhUYWJsZSA9IFtdO1xuICAgIHJlZiA9IHRoaXMuX2RhdGFbXCLmiqXlkYrml6XmnJ9cIl07XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpbmRleCA9ICsraSkge1xuICAgICAgdGltZVN0ciA9IHJlZltpbmRleF07XG4gICAgICBpZiAodGltZVN0ci5pbmRleE9mKFwiMTItMzFcIikgIT09IC0xKSB7XG4gICAgICAgIGluZGV4VGFibGUucHVzaChpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleFRhYmxlO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2dldFZhbHVlTGVuZ3RoID0gZnVuY3Rpb24odmFsdWVMZW5ndGgpIHtcbiAgICB2YXIgbGVuZ3RoO1xuICAgIGlmICh2YWx1ZUxlbmd0aCA8IGdsb2JhbC55ZWFyKSB7XG4gICAgICBsZW5ndGggPSB2YWx1ZUxlbmd0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gZ2xvYmFsLnllYXI7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fZm9ybWF0VG9JbnQgPSBmdW5jdGlvbih2YWx1ZVRhYmxlKSB7XG4gICAgdmFyIGksIGludFRhYmxlLCBsZW4sIHZhbHVlO1xuICAgIGludFRhYmxlID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gdmFsdWVUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFsdWUgPSB2YWx1ZVRhYmxlW2ldO1xuICAgICAgaW50VGFibGUucHVzaChwYXJzZUludCh2YWx1ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gaW50VGFibGU7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgaSwgaW5kZXgsIGxlbiwgdmFsdWVUYWJsZSwgeWVhckluZGV4VGFibGU7XG4gICAgeWVhckluZGV4VGFibGUgPSB0aGlzLl9nZXRZZWFyVmFsdWVJbmRleCgpO1xuICAgIHZhbHVlVGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB5ZWFySW5kZXhUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaW5kZXggPSB5ZWFySW5kZXhUYWJsZVtpXTtcbiAgICAgIHZhbHVlVGFibGUucHVzaChkYXRhW2luZGV4XSk7XG4gICAgfVxuICAgIHZhbHVlVGFibGUgPSB2YWx1ZVRhYmxlLnNsaWNlKDAsIHRoaXMuX2dldFZhbHVlTGVuZ3RoKHZhbHVlVGFibGUubGVuZ3RoKSk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdFRvSW50KHZhbHVlVGFibGUpO1xuICB9O1xuXG4gIHJldHVybiBUYWJsZUJhc2U7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVCYXNlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlZHRmliR1ZDWVhObExtTnZabVpsWlNJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5MFlXOTNkUzl6ZEhWa2VTOUJjbXRoWkM5QmNtdGhaRWRoYldVdmMzSmpMMjF2WkdWc0wxUmhZbXhsUW1GelpTNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlEwRXNTVUZCUVRzN1FVRkJUVHRGUVVOUkxHMUNRVUZETEZWQlFVUXNSVUZCWXl4VlFVRmtPMGxCUVVNc1NVRkJReXhEUVVGQkxHRkJRVVE3U1VGQllTeEpRVUZETEVOQlFVRXNZVUZCUkR0SlFVTXhRaXhKUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZUTzBsQlExUXNTVUZCUXl4RFFVRkJMRk5CUVVRc1EwRkJRVHRGUVVaWk96dHpRa0ZKWWl4WFFVRkJMRWRCUVdFc1UwRkJRU3hIUVVGQk96dHpRa0ZGWWl4VFFVRkJMRWRCUVZjc1UwRkJRVHRCUVVOV0xGRkJRVUU3U1VGQlFTeFJRVUZCTEVkQlFWY3NTVUZCUXl4RFFVRkJMRmRCUVVRc1EwRkJRVHRYUVVOWUxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhSUVVGdVFpeEZRVUUyUWl4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdaVUZETlVJc1MwRkJReXhEUVVGQkxFdEJRVVFzUjBGQlV6dE5RVVJ0UWp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUVzUTBGQk4wSTdSVUZHVlRzN2MwSkJTMWdzVDBGQlFTeEhRVUZUTEZOQlFVRTdWMEZCUnl4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxFbEJRVUVzUTBGQlRTeERRVUZCTEVOQlFVRXNRMEZCWWl4SFFVRnJRaXhSUVVGc1FpeEhRVUUyUWl4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxFbEJRVUVzUTBGQlRTeERRVUZCTEVOQlFVRTdSVUZCTjBNN08zTkNRVVZVTEdOQlFVRXNSMEZCYVVJc1UwRkJReXhOUVVGRU8wRkJRMmhDTEZkQlFWTXNRMEZCUXl4RFFVRkRMRTFCUVVFc1IwRkJVeXhOUVVGV0xFTkJRV2xDTEVOQlFVTXNUMEZCYkVJc1EwRkJNRUlzUTBGQk1VSXNRMEZCUkN4RFFVRkJMRWRCUVRoQ08wVkJSSFpDT3p0elFrRkhha0lzYjBKQlFVRXNSMEZCYzBJc1UwRkJReXhYUVVGRU8wRkJRM0pDTEZGQlFVRTdTVUZCUVN4WFFVRkJMRWRCUVdNN1FVRkRaQ3hUUVVGQkxEWkRRVUZCT3p0TlFVTkRMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEVsQlFVTXNRMEZCUVN4alFVRkVMRU5CUVdkQ0xFMUJRV2hDTEVOQlFXcENPMEZCUkVRN1FVRkZRU3hYUVVGUE8wVkJTbU03TzNOQ1FVMTBRaXhyUWtGQlFTeEhRVUZ2UWl4VFFVRkJPMEZCUTI1Q0xGRkJRVUU3U1VGQlFTeFZRVUZCTEVkQlFXRTdRVUZEWWp0QlFVRkJMRk5CUVVFc2NVUkJRVUU3TzAxQlEwTXNTVUZCUnl4UFFVRlBMRU5CUVVNc1QwRkJVaXhEUVVGblFpeFBRVUZvUWl4RFFVRkJMRXRCUVRoQ0xFTkJRVU1zUTBGQmJFTTdVVUZEUXl4VlFVRlZMRU5CUVVNc1NVRkJXQ3hEUVVGblFpeExRVUZvUWl4RlFVUkVPenRCUVVSRU8wRkJSMEVzVjBGQlR6dEZRVXhaT3p0elFrRlBjRUlzWlVGQlFTeEhRVUZwUWl4VFFVRkRMRmRCUVVRN1FVRkRhRUlzVVVGQlFUdEpRVUZCTEVsQlFVY3NWMEZCUVN4SFFVRmpMRTFCUVUwc1EwRkJReXhKUVVGNFFqdE5RVU5ETEUxQlFVRXNSMEZCVXl4WlFVUldPMHRCUVVFc1RVRkJRVHROUVVkRExFMUJRVUVzUjBGQlV5eE5RVUZOTEVOQlFVTXNTMEZJYWtJN08xZEJTVUU3UlVGTVowSTdPM05DUVU5cVFpeFpRVUZCTEVkQlFXTXNVMEZCUXl4VlFVRkVPMEZCUTJJc1VVRkJRVHRKUVVGQkxGRkJRVUVzUjBGQlZ6dEJRVU5ZTEZOQlFVRXNORU5CUVVFN08wMUJRME1zVVVGQlVTeERRVUZETEVsQlFWUXNRMEZCWXl4UlFVRkJMRU5CUVZNc1MwRkJWQ3hEUVVGa08wRkJSRVE3UVVGRlFTeFhRVUZQTzBWQlNrMDdPM05DUVUxa0xGRkJRVUVzUjBGQlZTeFRRVUZETEVsQlFVUTdRVUZEVkN4UlFVRkJPMGxCUVVFc1kwRkJRU3hIUVVGcFFpeEpRVUZETEVOQlFVRXNhMEpCUVVRc1EwRkJRVHRKUVVOcVFpeFZRVUZCTEVkQlFXRTdRVUZEWWl4VFFVRkJMR2RFUVVGQk96dE5RVU5ETEZWQlFWVXNRMEZCUXl4SlFVRllMRU5CUVdkQ0xFbEJRVXNzUTBGQlFTeExRVUZCTEVOQlFYSkNPMEZCUkVRN1NVRkhRU3hWUVVGQkxFZEJRV0VzVlVGQlZTeERRVUZETEV0QlFWZ3NRMEZCYVVJc1EwRkJha0lzUlVGQmIwSXNTVUZCUXl4RFFVRkJMR1ZCUVVRc1EwRkJhVUlzVlVGQlZTeERRVUZETEUxQlFUVkNMRU5CUVhCQ08xZEJRMklzU1VGQlF5eERRVUZCTEZsQlFVUXNRMEZCWXl4VlFVRmtPMFZCVUZNN096czdPenRCUVZOWUxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgTGF5ZXJNYW5hZ2VyLCBMb2FkZXI7XG5cbkxheWVyTWFuYWdlciA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sYXllclN0YWNrID0gW107XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBjYy5TY2VuZSgpO1xuICAgIHJldHVybiBjYy5kaXJlY3Rvci5ydW5TY2VuZSh0aGlzLnNjZW5lKTtcbiAgfSxcbiAgY2xlYXJMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2VuZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgIHJldHVybiB0aGlzLmxheWVyU3RhY2subGVuZ3RoID0gMDtcbiAgfSxcbiAgYWRkTGF5ZXJUb1NjZW5lOiBmdW5jdGlvbihjY2JMYXllciwgek9yZGVyKSB7XG4gICAgdmFyIGxheW91dCwgbm9kZTtcbiAgICBpZiAoek9yZGVyID09IG51bGwpIHtcbiAgICAgIHpPcmRlciA9IDA7XG4gICAgfVxuICAgIGxheW91dCA9IG5ldyBjY3VpLkxheW91dCgpO1xuICAgIGxheW91dC5zZXRDb250ZW50U2l6ZShjYy5zaXplKDExMzYsIDY0MCkpO1xuICAgIGxheW91dC5zZXRUb3VjaEVuYWJsZWQodHJ1ZSk7XG4gICAgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgbm9kZS5hZGRDaGlsZChsYXlvdXQpO1xuICAgIG5vZGUuYWRkQ2hpbGQoY2NiTGF5ZXIpO1xuICAgIHRoaXMuc2NlbmUuYWRkQ2hpbGQobm9kZSwgek9yZGVyKTtcbiAgICByZXR1cm4gdGhpcy5sYXllclN0YWNrLnB1c2gobm9kZSk7XG4gIH0sXG4gIHJlbW92ZVRvcExheWVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdG9wTGF5ZXI7XG4gICAgdG9wTGF5ZXIgPSB0aGlzLmxheWVyU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRoaXMuc2NlbmUucmVtb3ZlQ2hpbGQodG9wTGF5ZXIsIHRydWUpO1xuICB9XG59O1xuXG5Mb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIExvYWRlcihjY2JGaWxlMSwgY29udHJvbGxlck5hbWUxKSB7XG4gICAgdGhpcy5jY2JGaWxlID0gY2NiRmlsZTE7XG4gICAgdGhpcy5jb250cm9sbGVyTmFtZSA9IGNvbnRyb2xsZXJOYW1lMTtcbiAgfVxuXG4gIExvYWRlci5wcm90b3R5cGUuc2hvd0RpYWxvZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjYy5CdWlsZGVyUmVhZGVyLmxvYWQodGhpcy5jY2JGaWxlKTtcbiAgfTtcblxuICByZXR1cm4gTG9hZGVyO1xuXG59KSgpO1xuXG5MYXllck1hbmFnZXIuZGVmaW5lRGlhbG9nID0gZnVuY3Rpb24oY2NiRmlsZSwgY29udHJvbGxlck5hbWUsIGNvbnRyb2xsZXJDbGFzcykge1xuICBjYy5CdWlsZGVyUmVhZGVyLnJlZ2lzdGVyQ29udHJvbGxlcihjb250cm9sbGVyTmFtZSwgbmV3IGNvbnRyb2xsZXJDbGFzcygpKTtcbiAgcmV0dXJuIG5ldyBMb2FkZXIoY2NiRmlsZSwgY29udHJvbGxlck5hbWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXllck1hbmFnZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmRHOXZiSE12UVhKclUyTmxibVZOWVc1aFoyVnlMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDNSdmIyeHpMMEZ5YTFOalpXNWxUV0Z1WVdkbGNpNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlEwRXNTVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRMGs3UlVGQlFTeEpRVUZCTEVWQlFVMHNVMEZCUVR0SlFVTkdMRWxCUVVNc1EwRkJRU3hWUVVGRUxFZEJRV003U1VGRFpDeEpRVUZETEVOQlFVRXNTMEZCUkN4SFFVRlRMRWxCUVVrc1JVRkJSU3hEUVVGRExFdEJRVkFzUTBGQlFUdFhRVU5VTEVWQlFVVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1VVRkJXaXhEUVVGeFFpeEpRVUZETEVOQlFVRXNTMEZCZEVJN1JVRklSU3hEUVVGT08wVkJTMEVzVlVGQlFTeEZRVUZaTEZOQlFVRTdTVUZEVWl4SlFVRkRMRU5CUVVFc1MwRkJTeXhEUVVGRExHbENRVUZRTEVOQlFVRTdWMEZEUVN4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExFMUJRVm9zUjBGQmNVSTdSVUZHWWl4RFFVeGFPMFZCVTBFc1pVRkJRU3hGUVVGclFpeFRRVUZETEZGQlFVUXNSVUZCVnl4TlFVRllPMEZCUTJRc1VVRkJRVHM3VFVGRWVVSXNVMEZCVXpzN1NVRkRiRU1zVFVGQlFTeEhRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTFCUVZRc1EwRkJRVHRKUVVOVUxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzU1VGQlVpeEZRVUZqTEVkQlFXUXNRMEZCZEVJN1NVRkRRU3hOUVVGTkxFTkJRVU1zWlVGQlVDeERRVUYxUWl4SlFVRjJRanRKUVVWQkxFbEJRVUVzUjBGQlRTeEpRVUZKTEVWQlFVVXNRMEZCUXl4SlFVRlFMRU5CUVVFN1NVRkRUaXhKUVVGSkxFTkJRVU1zVVVGQlRDeERRVUZqTEUxQlFXUTdTVUZEUVN4SlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxGRkJRV1E3U1VGRlFTeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMRkZCUVZBc1EwRkJaMElzU1VGQmFFSXNSVUZCYzBJc1RVRkJkRUk3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRWxCUVZvc1EwRkJhVUlzU1VGQmFrSTdSVUZXWXl4RFFWUnNRanRGUVhGQ1FTeGpRVUZCTEVWQlFXZENMRk5CUVVFN1FVRkRXaXhSUVVGQk8wbEJRVUVzVVVGQlFTeEhRVUZYTEVsQlFVTXNRMEZCUVN4VlFVRlZMRU5CUVVNc1IwRkJXaXhEUVVGQk8xZEJRMWdzU1VGQlF5eERRVUZCTEV0QlFVc3NRMEZCUXl4WFFVRlFMRU5CUVcxQ0xGRkJRVzVDTEVWQlFUWkNMRWxCUVRkQ08wVkJSbGtzUTBGeVFtaENPenM3UVVGNVFrVTdSVUZEVnl4blFrRkJReXhSUVVGRUxFVkJRVmNzWlVGQldEdEpRVUZETEVsQlFVTXNRMEZCUVN4VlFVRkVPMGxCUVZVc1NVRkJReXhEUVVGQkxHbENRVUZFTzBWQlFWZzdPMjFDUVVOaUxGVkJRVUVzUjBGQllTeFRRVUZCTzFkQlExUXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhKUVVGcVFpeERRVUZ6UWl4SlFVRkRMRU5CUVVFc1QwRkJka0k3UlVGRVV6czdPenM3TzBGQlIycENMRmxCUVZrc1EwRkJReXhaUVVGaUxFZEJRVFJDTEZOQlFVTXNUMEZCUkN4RlFVRlZMR05CUVZZc1JVRkJNRUlzWlVGQk1VSTdSVUZEZUVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eHJRa0ZCYWtJc1EwRkRTU3hqUVVSS0xFVkJSVWtzU1VGQlNTeGxRVUZLTEVOQlFVRXNRMEZHU2p0VFFVdEJMRWxCUVVrc1RVRkJTaXhEUVVGWExFOUJRVmdzUlVGQmIwSXNZMEZCY0VJN1FVRk9kMEk3TzBGQlVUVkNMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIFNjcm9sbFZpZXc7XG5cblNjcm9sbFZpZXcgPSB7XG4gIGNyZWF0ZVNjcm9sbFZpZXc6IGZ1bmN0aW9uKHRhcmdldE5vZGUpIHtcbiAgICB2YXIgY29udGFpbmVyLCBzY3JvbGxWaWV3LCBzaXplO1xuICAgIHNpemUgPSB0YXJnZXROb2RlLmdldENvbnRlbnRTaXplKCk7XG4gICAgY29udGFpbmVyID0gbmV3IGNjLk5vZGUoKTtcbiAgICBzY3JvbGxWaWV3ID0gbmV3IGNjLlNjcm9sbFZpZXcoc2l6ZSwgY29udGFpbmVyKTtcbiAgICBzY3JvbGxWaWV3LnNldFBvc2l0aW9uKHRhcmdldE5vZGUuZ2V0UG9zaXRpb24oKSk7XG4gICAgc2Nyb2xsVmlldy5zZXREaXJlY3Rpb24oY2MuU0NST0xMVklFV19ESVJFQ1RJT05fVkVSVElDQUwpO1xuICAgIHNjcm9sbFZpZXcuc2V0VG91Y2hFbmFibGVkKHRydWUpO1xuICAgIHJldHVybiBzY3JvbGxWaWV3O1xuICB9LFxuICBpbml0RnJvbUNvbnRhaW5lcjogZnVuY3Rpb24oc2Nyb2xsVmlldywgaW5uZXIpIHtcbiAgICB2YXIgY29udGFpbmVyO1xuICAgIGlubmVyLnNldFBvc2l0aW9uKHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSk7XG4gICAgaW5uZXIuc2V0QW5jaG9yUG9pbnQoe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9KTtcbiAgICBpbm5lci5yZW1vdmVGcm9tUGFyZW50KCk7XG4gICAgY29udGFpbmVyID0gc2Nyb2xsVmlldy5nZXRDb250YWluZXIoKTtcbiAgICBjb250YWluZXIucmVtb3ZlQWxsQ2hpbGRyZW4odHJ1ZSk7XG4gICAgY29udGFpbmVyLnNldENvbnRlbnRTaXplKGlubmVyLmdldENvbnRlbnRTaXplKCkpO1xuICAgIHJldHVybiBjb250YWluZXIuYWRkQ2hpbGQoaW5uZXIpO1xuICB9LFxuICBzY3JvbGxKdW1wVG9Ub3A6IGZ1bmN0aW9uKHNjcm9sbFZpZXcpIHtcbiAgICB2YXIgY29udGFpbmVyLCBvZmZzZXQ7XG4gICAgY29udGFpbmVyID0gc2Nyb2xsVmlldy5nZXRDb250YWluZXIoKTtcbiAgICBvZmZzZXQgPSBzY3JvbGxWaWV3LmdldFZpZXdTaXplKCkuaGVpZ2h0IC0gY29udGFpbmVyLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0O1xuICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICByZXR1cm4gc2Nyb2xsVmlldy5zZXRDb250ZW50T2Zmc2V0KHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogb2Zmc2V0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNjcm9sbFZpZXcuc2V0Q29udGVudE9mZnNldCh7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxWaWV3O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdlUyTnliMnhzVm1sbGR5NWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTkwYjI5c2N5OVRZM0p2Ykd4V2FXVjNMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZEU1R0RlFVRkJMR2RDUVVGQkxFVkJRV3RDTEZOQlFVTXNWVUZCUkR0QlFVTmtMRkZCUVVFN1NVRkJRU3hKUVVGQkxFZEJRVThzVlVGQlZTeERRVUZETEdOQlFWZ3NRMEZCUVR0SlFVTlFMRk5CUVVFc1IwRkJXU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZRTEVOQlFVRTdTVUZEV2l4VlFVRkJMRWRCUVdFc1NVRkJTU3hGUVVGRkxFTkJRVU1zVlVGQlVDeERRVUZyUWl4SlFVRnNRaXhGUVVGM1FpeFRRVUY0UWp0SlFVTmlMRlZCUVZVc1EwRkJReXhYUVVGWUxFTkJRWFZDTEZWQlFWVXNRMEZCUXl4WFFVRllMRU5CUVVFc1EwRkJka0k3U1VGRFFTeFZRVUZWTEVOQlFVTXNXVUZCV0N4RFFVRjNRaXhGUVVGRkxFTkJRVU1zTmtKQlFUTkNPMGxCUTBFc1ZVRkJWU3hEUVVGRExHVkJRVmdzUTBGQk1rSXNTVUZCTTBJN1YwRkRRVHRGUVZCakxFTkJRV3hDTzBWQlUwRXNhVUpCUVVFc1JVRkJiVUlzVTBGQlF5eFZRVUZFTEVWQlFXRXNTMEZCWWp0QlFVTm1MRkZCUVVFN1NVRkJRU3hMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZyUWp0TlFVRkRMRU5CUVVFc1JVRkJSeXhEUVVGS08wMUJRVThzUTBGQlFTeEZRVUZITEVOQlFWWTdTMEZCYkVJN1NVRkRRU3hMUVVGTExFTkJRVU1zWTBGQlRpeERRVUZ4UWp0TlFVRkRMRU5CUVVFc1JVRkJSeXhEUVVGS08wMUJRVThzUTBGQlFTeEZRVUZITEVOQlFWWTdTMEZCY2tJN1NVRkRRU3hMUVVGTExFTkJRVU1zWjBKQlFVNHNRMEZCUVR0SlFVTkJMRk5CUVVFc1IwRkJXU3hWUVVGVkxFTkJRVU1zV1VGQldDeERRVUZCTzBsQlExb3NVMEZCVXl4RFFVRkRMR2xDUVVGV0xFTkJRVFJDTEVsQlFUVkNPMGxCUTBFc1UwRkJVeXhEUVVGRExHTkJRVllzUTBGQmVVSXNTMEZCU3l4RFFVRkRMR05CUVU0c1EwRkJRU3hEUVVGNlFqdFhRVU5CTEZOQlFWTXNRMEZCUXl4UlFVRldMRU5CUVcxQ0xFdEJRVzVDTzBWQlVHVXNRMEZVYmtJN1JVRnJRa0VzWlVGQlFTeEZRVUZwUWl4VFFVRkRMRlZCUVVRN1FVRkRZaXhSUVVGQk8wbEJRVUVzVTBGQlFTeEhRVUZaTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVVFN1NVRkRXaXhOUVVGQkxFZEJRVk1zVlVGQlZTeERRVUZETEZkQlFWZ3NRMEZCUVN4RFFVRjNRaXhEUVVGRExFMUJRWHBDTEVkQlFXdERMRk5CUVZNc1EwRkJReXhqUVVGV0xFTkJRVUVzUTBGQk1FSXNRMEZCUXp0SlFVTjBSU3hKUVVGSExFMUJRVUVzUjBGQlV5eERRVUZhTzJGQlEwa3NWVUZCVlN4RFFVRkRMR2RDUVVGWUxFTkJRVFJDTzFGQlFVTXNRMEZCUVN4RlFVRkhMRU5CUVVvN1VVRkJUeXhEUVVGQkxFVkJRVWNzVFVGQlZqdFBRVUUxUWl4RlFVUktPMHRCUVVFc1RVRkJRVHRoUVVkSkxGVkJRVlVzUTBGQlF5eG5Ra0ZCV0N4RFFVRTBRanRSUVVGRExFTkJRVUVzUlVGQlJ5eERRVUZLTzFGQlFVOHNRMEZCUVN4RlFVRkhMRU5CUVZZN1QwRkJOVUlzUlVGSVNqczdSVUZJWVN4RFFXeENha0k3T3p0QlFUQkNTaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlKOVxuIiwidmFyIHV0aWxzO1xuXG51dGlscyA9IHtcbiAgZ2V0Q29tcG91bmRSYXRlOiBmdW5jdGlvbihhZGRSYXRlLCB0aW1lKSB7XG4gICAgcmV0dXJuIE1hdGguZXhwKDEgLyB0aW1lICogTWF0aC5sb2coYWRkUmF0ZSkpO1xuICB9LFxuICBnZXRBdmVyYWdlOiBmdW5jdGlvbih0YWJsZSkge1xuICAgIHZhciBhdmUsIGksIGxlbiwgdG90YWwsIHZhbHVlO1xuICAgIHRvdGFsID0gMDtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB0YWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFsdWUgPSB0YWJsZVtpXTtcbiAgICAgIHRvdGFsICs9IHBhcnNlSW50KHZhbHVlKTtcbiAgICB9XG4gICAgYXZlID0gKHRvdGFsIC8gdGFibGUubGVuZ3RoKS50b0ZpeGVkKDIpO1xuICAgIHJldHVybiBhdmU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmRHOXZiSE12ZFhScGJITXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12ZEc5dmJITXZkWFJwYkhNdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUU3TzBGQlFVRXNTMEZCUVN4SFFVTkpPMFZCUVVFc1pVRkJRU3hGUVVGcFFpeFRRVUZETEU5QlFVUXNSVUZCVlN4SlFVRldPMEZCUTJJc1YwRkJUeXhKUVVGSkxFTkJRVU1zUjBGQlRDeERRVUZUTEVOQlFVRXNSMEZCU1N4SlFVRktMRWRCUVZjc1NVRkJTU3hEUVVGRExFZEJRVXdzUTBGQlV5eFBRVUZVTEVOQlFYQkNPMFZCUkUwc1EwRkJha0k3UlVGSFFTeFZRVUZCTEVWQlFWa3NVMEZCUXl4TFFVRkVPMEZCUTFJc1VVRkJRVHRKUVVGQkxFdEJRVUVzUjBGQlVUdEJRVU5TTEZOQlFVRXNkVU5CUVVFN08wMUJRMGtzUzBGQlFTeEpRVUZUTEZGQlFVRXNRMEZCVXl4TFFVRlVPMEZCUkdJN1NVRkZRU3hIUVVGQkxFZEJRVTBzUTBGQlF5eExRVUZCTEVkQlFWRXNTMEZCU3l4RFFVRkRMRTFCUVdZc1EwRkJjMElzUTBGQlF5eFBRVUYyUWl4RFFVRXJRaXhEUVVFdlFqdFhRVU5PTzBWQlRGRXNRMEZJV2pzN08wRkJVMG9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaWZRPT1cbiJdfQ==
