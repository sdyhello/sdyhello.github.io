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
        return typeof obj.callback === "function" ? obj.callback(_this.findMatchConditionStock()) : void 0;
      };
    })(this));
  };

  GameLogic.prototype._filterROE = function(stockCode) {
    var aveRoe, roeTable;
    roeTable = this._getROE(stockCode);
    aveRoe = utils.getAverage(roeTable);
    if (aveRoe > 18) {
      return true;
    }
    return false;
  };

  GameLogic.prototype._filterProfitAddRatio = function(stockCode) {
    var profitAddRatio;
    profitAddRatio = this._profitObj[stockCode].getNetProfitAddRatio();
    if (profitAddRatio > 20) {
      return true;
    }
    return false;
  };

  GameLogic.prototype._filterPE = function(stockCode) {
    var pe;
    pe = this._profitObj[stockCode].getPE();
    console.log(pe, typeof pe, pe > 0);
    if ((0 < pe && pe < 35)) {
      return true;
    }
    return false;
  };

  GameLogic.prototype._getStockInfo = function(stockCode) {
    var PE, aveRoe, baseInfo, profitAddRatio, roeTable;
    baseInfo = this._profitObj[stockCode].getBaseInfo();
    profitAddRatio = this._profitObj[stockCode].getNetProfitAddRatio();
    roeTable = this._getROE(stockCode);
    aveRoe = utils.getAverage(roeTable);
    PE = this._profitObj[stockCode].getPE();
    return utils.addTab(stockCode) + utils.addTab(baseInfo) + utils.addTab(profitAddRatio) + utils.addTab(aveRoe) + utils.addTab("PE:" + PE) + "\n";
  };

  GameLogic.prototype.findMatchConditionStock = function() {
    var i, j, len, len1, matchStockTable, stockCode, stockInfoTable;
    matchStockTable = [];
    for (i = 0, len = g_stockTable.length; i < len; i++) {
      stockCode = g_stockTable[i];
      stockCode = stockCode.slice(2, 8);
      if (this._filterROE(stockCode) && this._filterProfitAddRatio(stockCode) && this._filterPE(stockCode)) {
        matchStockTable.push(stockCode);
      }
    }
    stockInfoTable = ["股票代码 \t 基本信息 \t 利润复合增长率 \t 平均ROE \t PE  统计时间:" + global.year + ", 总数:" + matchStockTable.length + "\n"];
    for (j = 0, len1 = matchStockTable.length; j < len1; j++) {
      stockCode = matchStockTable[j];
      stockInfoTable.push(this._getStockInfo(stockCode));
    }
    return stockInfoTable;
  };

  GameLogic.prototype._getROE = function(stockCode) {
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

  ProfitStatement.prototype.getPE = function() {
    var PE, earnPerShare, price;
    earnPerShare = this.getValue(this._data["基本每股收益"], true)[0];
    price = this.getSharePrice();
    PE = (price / earnPerShare).toFixed(2);
    return PE;
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

  TableBase.prototype.getStockCode = function() {
    return this._stockCode;
  };

  TableBase.prototype._loadJson = function() {
    var filePath;
    filePath = this.getFilePath();
    return cc.loader.loadJson(filePath, (function(_this) {
      return function(error, data) {
        return _this._data = data;
      };
    })(this));
  };

  TableBase.prototype.getBaseInfo = function() {
    return this._data["资料"][0] + "------" + this._data["资料"][2];
  };

  TableBase.prototype.getSharePrice = function() {
    return this._data["资料"][1];
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

  TableBase.prototype.getValue = function(data, doNotToInt) {
    var i, index, len, valueTable, yearIndexTable;
    yearIndexTable = this._getYearValueIndex();
    valueTable = [];
    for (i = 0, len = yearIndexTable.length; i < len; i++) {
      index = yearIndexTable[i];
      valueTable.push(data[index]);
    }
    valueTable = valueTable.slice(0, this._getValueLength(valueTable.length));
    if (doNotToInt) {
      return valueTable;
    }
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
  },
  addTab: function(value) {
    return value + "\t\t";
  }
};

module.exports = utils;


},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2NiVmlldy9BcmtNYWluRGlhbG9nLmNvZmZlZSIsInNyYy9jb250cm9sL0Fya0dhbWVMb2dpYy5jb2ZmZWUiLCJzcmMvZXZlbnQvQXJrRXZlbnRNYW5hZ2VyLmNvZmZlZSIsInNyYy9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZSIsInNyYy9nbG9iYWxWYWx1ZS5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiLCJzcmMvbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlIiwic3JjL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUiLCJzcmMvbW9kZWwvQ2FzaEZsb3dTdGF0ZW1lbnQuY29mZmVlIiwic3JjL21vZGVsL1Byb2ZpdFN0YXRlbWVudC5jb2ZmZWUiLCJzcmMvbW9kZWwvVGFibGVCYXNlLmNvZmZlZSIsInNyYy90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlIiwic3JjL3Rvb2xzL1Njcm9sbFZpZXcuY29mZmVlIiwic3JjL3Rvb2xzL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQXJrTWFpbkRpYWxvZywgQXJrU2Nyb2xsVmlldywgZXZlbnRNYW5hZ2VyLCBldmVudE5hbWVzLCBnX2NsaWNrX3RpbWVzO1xuXG5ldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TmFtZXMgPSByZXF1aXJlKCcuLi9ldmVudC9BcmtFdmVudE5hbWVzLmNvZmZlZScpO1xuXG5BcmtTY3JvbGxWaWV3ID0gcmVxdWlyZSgnLi4vdG9vbHMvU2Nyb2xsVmlldy5jb2ZmZWUnKTtcblxuZ19jbGlja190aW1lcyA9IDA7XG5cbkFya01haW5EaWFsb2cgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEFya01haW5EaWFsb2coKSB7fVxuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLm9uRGlkTG9hZEZyb21DQ0IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9kYXRUYWJsZSA9IFtdO1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Njcm9sbFZpZXcgPSBudWxsO1xuICAgIHRoaXMuX3N0b2NrQ29kZUVkaXRCb3ggPSBudWxsO1xuICAgIHJldHVybiB0aGlzLl95ZWFyc0VkaXRCb3ggPSBudWxsO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94ID0gdGhpcy5fY3JlYXRlRWRpdEJveCh0aGlzLmNjYl90ZXh0RmllbGRfMSk7XG4gICAgdGhpcy5yb290Tm9kZS5hZGRDaGlsZCh0aGlzLl9zdG9ja0NvZGVFZGl0Qm94KTtcbiAgICB0aGlzLl95ZWFyc0VkaXRCb3ggPSB0aGlzLl9jcmVhdGVFZGl0Qm94KHRoaXMuY2NiX3RleHRGaWVsZF8yKTtcbiAgICB0aGlzLnJvb3ROb2RlLmFkZENoaWxkKHRoaXMuX3llYXJzRWRpdEJveCk7XG4gICAgdGhpcy5faW5pdERhdGEoKTtcbiAgICB0aGlzLl9zY3JvbGxWaWV3ID0gQXJrU2Nyb2xsVmlldy5jcmVhdGVTY3JvbGxWaWV3KHRoaXMuY2NiX3Njcm9sbFZpZXcpO1xuICAgIHRoaXMucm9vdE5vZGUuYWRkQ2hpbGQodGhpcy5fc2Nyb2xsVmlldyk7XG4gICAgQXJrU2Nyb2xsVmlldy5pbml0RnJvbUNvbnRhaW5lcih0aGlzLl9zY3JvbGxWaWV3LCB0aGlzLmNjYl9yZXN1bHQpO1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLl9pbml0RGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3N0b2NrQ29kZUVkaXRCb3guc2V0U3RyaW5nKFwiMDAwNjUxXCIpO1xuICAgIHJldHVybiB0aGlzLl95ZWFyc0VkaXRCb3guc2V0U3RyaW5nKFwiNlwiKTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5fY3JlYXRlRWRpdEJveCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgZWRpdEJveDtcbiAgICBlZGl0Qm94ID0gbmV3IGNjLkVkaXRCb3goY2Muc2l6ZSgyMDAsIDUwKSk7XG4gICAgZWRpdEJveC5zZXRQb3NpdGlvbihub2RlLmdldFBvc2l0aW9uKCkpO1xuICAgIGVkaXRCb3guc2V0SW5wdXRNb2RlKGNjLkVESVRCT1hfSU5QVVRfTU9ERV9TSU5HTEVMSU5FKTtcbiAgICBlZGl0Qm94LnNldFJldHVyblR5cGUoY2MuS0VZQk9BUkRfUkVUVVJOVFlQRV9ET05FKTtcbiAgICBlZGl0Qm94LnNldElucHV0RmxhZyhjYy5FRElUQk9YX0lOUFVUX0ZMQUdfSU5JVElBTF9DQVBTX1NFTlRFTkNFKTtcbiAgICBlZGl0Qm94LnNldE1heExlbmd0aCgxMyk7XG4gICAgZWRpdEJveC5zZXRGb250KFwiQXJpYWxcIiwgMjYpO1xuICAgIGVkaXRCb3guc2V0Rm9udENvbG9yKGNjLmNvbG9yKDEwMCwgMTAwLCAyNTUsIDI1NSkpO1xuICAgIHJldHVybiBlZGl0Qm94O1xuICB9O1xuXG4gIEFya01haW5EaWFsb2cucHJvdG90eXBlLnNob3dSZXN1bHQgPSBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICB0aGlzLmNjYl9yZXN1bHQuc2V0U3RyaW5nKHJlc3VsdCk7XG4gICAgQXJrU2Nyb2xsVmlldy5pbml0RnJvbUNvbnRhaW5lcih0aGlzLl9zY3JvbGxWaWV3LCB0aGlzLmNjYl9yZXN1bHQpO1xuICAgIHJldHVybiBBcmtTY3JvbGxWaWV3LnNjcm9sbEp1bXBUb1RvcCh0aGlzLl9zY3JvbGxWaWV3KTtcbiAgfTtcblxuICBBcmtNYWluRGlhbG9nLnByb3RvdHlwZS5vbkNhbGMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RvY2tDb2RlLCB5ZWFycztcbiAgICBzdG9ja0NvZGUgPSB0aGlzLl9zdG9ja0NvZGVFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIHllYXJzID0gdGhpcy5feWVhcnNFZGl0Qm94LmdldFN0cmluZygpO1xuICAgIGdsb2JhbC55ZWFyID0geWVhcnM7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlci5zZW5kKGV2ZW50TmFtZXMuR0FNRV9HRVRfUkVTVUxULCB7XG4gICAgICBzdG9ja0NvZGU6IHN0b2NrQ29kZSxcbiAgICAgIGNhbGxiYWNrOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5zaG93UmVzdWx0KHN0cik7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKVxuICAgIH0pO1xuICB9O1xuXG4gIGNjLkJ1aWxkZXJSZWFkZXIucmVnaXN0ZXJDb250cm9sbGVyKFwiQXJrTWFpbkRpYWxvZ1wiLCBuZXcgQXJrTWFpbkRpYWxvZygpKTtcblxuICByZXR1cm4gQXJrTWFpbkRpYWxvZztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5CdWlsZGVyUmVhZGVyLmxvYWQoXCJyZXMvbWFpbi5jY2JpXCIpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZZMk5pVm1sbGR5OUJjbXROWVdsdVJHbGhiRzluTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyTmpZbFpwWlhjdlFYSnJUV0ZwYmtScFlXeHZaeTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUVdVc1QwRkJRU3hEUVVGUkxHbERRVUZTT3p0QlFVTm1MRlZCUVVFc1IwRkJZU3hQUVVGQkxFTkJRVkVzSzBKQlFWSTdPMEZCUTJJc1lVRkJRU3hIUVVGblFpeFBRVUZCTEVOQlFWRXNORUpCUVZJN08wRkJSV2hDTEdGQlFVRXNSMEZCWjBJN08wRkJSVlk3T3pzd1FrRkRSaXhuUWtGQlFTeEhRVUZyUWl4VFFVRkJPMGxCUTJRc1NVRkJReXhEUVVGQkxGTkJRVVFzUjBGQllUdEpRVU5pTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVVFN1YwRkRRU3hKUVVGRExFTkJRVUVzU1VGQlJDeERRVUZCTzBWQlNHTTdPekJDUVV0c1FpeE5RVUZCTEVkQlFWRXNVMEZCUVR0SlFVTktMRWxCUVVNc1EwRkJRU3hYUVVGRUxFZEJRV1U3U1VGRFppeEpRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJjVUk3VjBGRGNrSXNTVUZCUXl4RFFVRkJMR0ZCUVVRc1IwRkJhVUk3UlVGSVlqczdNRUpCUzFJc1NVRkJRU3hIUVVGTkxGTkJRVUU3U1VGRFJpeEpRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJjVUlzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJReXhEUVVGQkxHVkJRV3BDTzBsQlEzSkNMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4SlFVRkRMRU5CUVVFc2FVSkJRWEJDTzBsQlJVRXNTVUZCUXl4RFFVRkJMR0ZCUVVRc1IwRkJhVUlzU1VGQlF5eERRVUZCTEdOQlFVUXNRMEZCWjBJc1NVRkJReXhEUVVGQkxHVkJRV3BDTzBsQlEycENMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4SlFVRkRMRU5CUVVFc1lVRkJjRUk3U1VGRlFTeEpRVUZETEVOQlFVRXNVMEZCUkN4RFFVRkJPMGxCUlVFc1NVRkJReXhEUVVGQkxGZEJRVVFzUjBGQlpTeGhRVUZoTEVOQlFVTXNaMEpCUVdRc1EwRkJLMElzU1VGQlF5eERRVUZCTEdOQlFXaERPMGxCUTJZc1NVRkJReXhEUVVGQkxGRkJRVkVzUTBGQlF5eFJRVUZXTEVOQlFXMUNMRWxCUVVNc1EwRkJRU3hYUVVGd1FqdEpRVVZCTEdGQlFXRXNRMEZCUXl4cFFrRkJaQ3hEUVVGblF5eEpRVUZETEVOQlFVRXNWMEZCYWtNc1JVRkJPRU1zU1VGQlF5eERRVUZCTEZWQlFTOURPMFZCV2tVN096QkNRV2RDVGl4VFFVRkJMRWRCUVZjc1UwRkJRVHRKUVVOUUxFbEJRVU1zUTBGQlFTeHBRa0ZCYVVJc1EwRkJReXhUUVVGdVFpeERRVUUyUWl4UlFVRTNRanRYUVVOQkxFbEJRVU1zUTBGQlFTeGhRVUZoTEVOQlFVTXNVMEZCWml4RFFVRjVRaXhIUVVGNlFqdEZRVVpQT3pzd1FrRkpXQ3hqUVVGQkxFZEJRV2RDTEZOQlFVTXNTVUZCUkR0QlFVTmFMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzU1VGQlNTeEZRVUZGTEVOQlFVTXNUMEZCVUN4RFFVRmxMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlVpeEZRVUZoTEVWQlFXSXNRMEZCWmp0SlFVTldMRTlCUVU4c1EwRkJReXhYUVVGU0xFTkJRVzlDTEVsQlFVa3NRMEZCUXl4WFFVRk1MRU5CUVVFc1EwRkJjRUk3U1VGRFFTeFBRVUZQTEVOQlFVTXNXVUZCVWl4RFFVRnhRaXhGUVVGRkxFTkJRVU1zTmtKQlFYaENPMGxCUTBFc1QwRkJUeXhEUVVGRExHRkJRVklzUTBGQmMwSXNSVUZCUlN4RFFVRkRMSGRDUVVGNlFqdEpRVU5CTEU5QlFVOHNRMEZCUXl4WlFVRlNMRU5CUVhGQ0xFVkJRVVVzUTBGQlF5eDNRMEZCZUVJN1NVRkRRU3hQUVVGUExFTkJRVU1zV1VGQlVpeERRVUZ4UWl4RlFVRnlRanRKUVVOQkxFOUJRVThzUTBGQlF5eFBRVUZTTEVOQlFXZENMRTlCUVdoQ0xFVkJRWGxDTEVWQlFYcENPMGxCUTBFc1QwRkJUeXhEUVVGRExGbEJRVklzUTBGQmNVSXNSVUZCUlN4RFFVRkRMRXRCUVVnc1EwRkJVeXhIUVVGVUxFVkJRV01zUjBGQlpDeEZRVUZ0UWl4SFFVRnVRaXhGUVVGM1FpeEhRVUY0UWl4RFFVRnlRanRCUVVOQkxGZEJRVTg3UlVGVVN6czdNRUpCVjJoQ0xGVkJRVUVzUjBGQldTeFRRVUZETEUxQlFVUTdTVUZEVWl4SlFVRkRMRU5CUVVFc1ZVRkJWU3hEUVVGRExGTkJRVm9zUTBGQmMwSXNUVUZCZEVJN1NVRkRRU3hoUVVGaExFTkJRVU1zYVVKQlFXUXNRMEZCWjBNc1NVRkJReXhEUVVGQkxGZEJRV3BETEVWQlFUaERMRWxCUVVNc1EwRkJRU3hWUVVFdlF6dFhRVU5CTEdGQlFXRXNRMEZCUXl4bFFVRmtMRU5CUVRoQ0xFbEJRVU1zUTBGQlFTeFhRVUV2UWp0RlFVaFJPenN3UWtGTFdpeE5RVUZCTEVkQlFWRXNVMEZCUVR0QlFVTktMRkZCUVVFN1NVRkJRU3hUUVVGQkxFZEJRVmtzU1VGQlF5eERRVUZCTEdsQ1FVRnBRaXhEUVVGRExGTkJRVzVDTEVOQlFVRTdTVUZEV2l4TFFVRkJMRWRCUVZFc1NVRkJReXhEUVVGQkxHRkJRV0VzUTBGQlF5eFRRVUZtTEVOQlFVRTdTVUZEVWl4TlFVRk5MRU5CUVVNc1NVRkJVQ3hIUVVGak8xZEJSV1FzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCYTBJc1ZVRkJWU3hEUVVGRExHVkJRVGRDTEVWQlEwazdUVUZCUVN4VFFVRkJMRVZCUVZjc1UwRkJXRHROUVVOQkxGRkJRVUVzUlVGQlZTeERRVUZCTEZOQlFVRXNTMEZCUVR0bFFVRkJMRk5CUVVNc1IwRkJSRHRwUWtGRFRpeExRVUZETEVOQlFVRXNWVUZCUkN4RFFVRlpMRWRCUVZvN1VVRkVUVHROUVVGQkxFTkJRVUVzUTBGQlFTeERRVUZCTEVsQlFVRXNRMEZFVmp0TFFVUktPMFZCVEVrN08wVkJWVklzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4clFrRkJha0lzUTBGRFNTeGxRVVJLTEVWQlJVa3NTVUZCU1N4aFFVRktMRU5CUVVFc1EwRkdTanM3T3pzN08wRkJTMG9zVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZxUWl4RFFVRnpRaXhsUVVGMFFpSjlcbiIsInZhciBCYWxhbmNlU2hlZXQsIENhc2hGbG93U3RhdGVtZW50LCBHYW1lTG9naWMsIFByb2ZpdFN0YXRlbWVudCwgVXNlckRhdGEsIGV2ZW50TWFuYWdlciwgZXZlbnROYW1lcywgZ19zdG9ja1RhYmxlLCBzY2VuZU1hbmFnZXIsIHV0aWxzO1xuXG5zY2VuZU1hbmFnZXIgPSByZXF1aXJlKCcuLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlJyk7XG5cbmV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TWFuYWdlci5jb2ZmZWUnKTtcblxuZXZlbnROYW1lcyA9IHJlcXVpcmUoJy4uL2V2ZW50L0Fya0V2ZW50TmFtZXMuY29mZmVlJyk7XG5cblVzZXJEYXRhID0gcmVxdWlyZSgnLi4vbW9kZWwvQXJrVXNlckRhdGEuY29mZmVlJyk7XG5cbkJhbGFuY2VTaGVldCA9IHJlcXVpcmUoJy4uL21vZGVsL0JhbGFuY2VTaGVldC5jb2ZmZWUnKTtcblxuUHJvZml0U3RhdGVtZW50ID0gcmVxdWlyZSgnLi4vbW9kZWwvUHJvZml0U3RhdGVtZW50LmNvZmZlZScpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IHJlcXVpcmUoJy4uL21vZGVsL0Nhc2hGbG93U3RhdGVtZW50LmNvZmZlZScpO1xuXG5yZXF1aXJlKFwiLi4vZ2xvYmFsVmFsdWUuY29mZmVlXCIpO1xuXG51dGlscyA9IHJlcXVpcmUoJy4uL3Rvb2xzL3V0aWxzLmNvZmZlZScpO1xuXG5nX3N0b2NrVGFibGUgPSBbXCJTWjAwMDAwMVwiLCBcIlNaMDAwMDAyXCIsIFwiU1owMDAwMDhcIiwgXCJTWjAwMDA2MFwiLCBcIlNaMDAwMDYzXCIsIFwiU1owMDAwNjlcIiwgXCJTWjAwMDEwMFwiLCBcIlNaMDAwMTU3XCIsIFwiU1owMDAxNjZcIiwgXCJTWjAwMDMzM1wiLCBcIlNaMDAwMzM4XCIsIFwiU1owMDA0MDJcIiwgXCJTWjAwMDQxM1wiLCBcIlNaMDAwNDE1XCIsIFwiU1owMDA0MjNcIiwgXCJTWjAwMDQyNVwiLCBcIlNaMDAwNTAzXCIsIFwiU1owMDA1MzhcIiwgXCJTWjAwMDU0MFwiLCBcIlNaMDAwNTU5XCIsIFwiU1owMDA1NjhcIiwgXCJTWjAwMDYyM1wiLCBcIlNaMDAwNjI1XCIsIFwiU1owMDA2MjdcIiwgXCJTWjAwMDYzMFwiLCBcIlNaMDAwNjUxXCIsIFwiU1owMDA2NzFcIiwgXCJTWjAwMDY4NlwiLCBcIlNaMDAwNzA5XCIsIFwiU1owMDA3MjNcIiwgXCJTWjAwMDcyNVwiLCBcIlNaMDAwNzI4XCIsIFwiU1owMDA3MzhcIiwgXCJTWjAwMDc1MFwiLCBcIlNaMDAwNzY4XCIsIFwiU1owMDA3NzZcIiwgXCJTWjAwMDc4M1wiLCBcIlNaMDAwNzkyXCIsIFwiU1owMDA4MjZcIiwgXCJTWjAwMDgzOVwiLCBcIlNaMDAwODU4XCIsIFwiU1owMDA4NzZcIiwgXCJTWjAwMDg5NVwiLCBcIlNaMDAwODk4XCIsIFwiU1owMDA5MzhcIiwgXCJTWjAwMDk1OVwiLCBcIlNaMDAwOTYxXCIsIFwiU1owMDA5NjNcIiwgXCJTWjAwMDk4M1wiLCBcIlNaMDAxOTc5XCIsIFwiU1owMDIwMDdcIiwgXCJTWjAwMjAwOFwiLCBcIlNaMDAyMDI0XCIsIFwiU1owMDIwMjdcIiwgXCJTWjAwMjA0NFwiLCBcIlNaMDAyMDY1XCIsIFwiU1owMDIwNzRcIiwgXCJTWjAwMjA4MVwiLCBcIlNaMDAyMTQyXCIsIFwiU1owMDIxNDZcIiwgXCJTWjAwMjE1M1wiLCBcIlNaMDAyMTc0XCIsIFwiU1owMDIyMDJcIiwgXCJTWjAwMjIzMFwiLCBcIlNaMDAyMjM2XCIsIFwiU1owMDIyNDFcIiwgXCJTWjAwMjI1MlwiLCBcIlNaMDAyMjkyXCIsIFwiU1owMDIyOTRcIiwgXCJTWjAwMjMwNFwiLCBcIlNaMDAyMzEwXCIsIFwiU1owMDIzNTJcIiwgXCJTWjAwMjM4NVwiLCBcIlNaMDAyNDExXCIsIFwiU1owMDI0MTVcIiwgXCJTWjAwMjQyNFwiLCBcIlNaMDAyNDI2XCIsIFwiU1owMDI0NTBcIiwgXCJTWjAwMjQ1NlwiLCBcIlNaMDAyNDYwXCIsIFwiU1owMDI0NjVcIiwgXCJTWjAwMjQ2NlwiLCBcIlNaMDAyNDY4XCIsIFwiU1owMDI0NzBcIiwgXCJTWjAwMjQ3NVwiLCBcIlNaMDAyNTAwXCIsIFwiU1owMDI1MDhcIiwgXCJTWjAwMjU1NVwiLCBcIlNaMDAyNTU4XCIsIFwiU1owMDI1NzJcIiwgXCJTWjAwMjU5NFwiLCBcIlNaMDAyNjAxXCIsIFwiU1owMDI2MDJcIiwgXCJTWjAwMjYwOFwiLCBcIlNaMDAyNjI0XCIsIFwiU1owMDI2NzNcIiwgXCJTWjAwMjcxNFwiLCBcIlNaMDAyNzM2XCIsIFwiU1owMDI3MzlcIiwgXCJTWjAwMjc5N1wiLCBcIlNaMDAyODMxXCIsIFwiU1owMDI4MzlcIiwgXCJTWjAwMjg0MVwiLCBcIlNaMzAwMDAzXCIsIFwiU1ozMDAwMTVcIiwgXCJTWjMwMDAxN1wiLCBcIlNaMzAwMDI0XCIsIFwiU1ozMDAwMjdcIiwgXCJTWjMwMDAzM1wiLCBcIlNaMzAwMDU5XCIsIFwiU1ozMDAwNzBcIiwgXCJTWjMwMDA3MlwiLCBcIlNaMzAwMTIyXCIsIFwiU1ozMDAxMjRcIiwgXCJTWjMwMDEzNlwiLCBcIlNaMzAwMTQ0XCIsIFwiU1ozMDAyNTFcIiwgXCJTWjMwMDMxNVwiLCBcIlNINjAwMDAwXCIsIFwiU0g2MDAwMDhcIiwgXCJTSDYwMDAwOVwiLCBcIlNINjAwMDEwXCIsIFwiU0g2MDAwMTFcIiwgXCJTSDYwMDAxNVwiLCBcIlNINjAwMDE2XCIsIFwiU0g2MDAwMThcIiwgXCJTSDYwMDAxOVwiLCBcIlNINjAwMDIxXCIsIFwiU0g2MDAwMjNcIiwgXCJTSDYwMDAyOFwiLCBcIlNINjAwMDI5XCIsIFwiU0g2MDAwMzBcIiwgXCJTSDYwMDAzMVwiLCBcIlNINjAwMDM2XCIsIFwiU0g2MDAwMzhcIiwgXCJTSDYwMDA0OFwiLCBcIlNINjAwMDUwXCIsIFwiU0g2MDAwNjFcIiwgXCJTSDYwMDA2NlwiLCBcIlNINjAwMDY4XCIsIFwiU0g2MDAwNzRcIiwgXCJTSDYwMDA4NVwiLCBcIlNINjAwMDg5XCIsIFwiU0g2MDAxMDBcIiwgXCJTSDYwMDEwNFwiLCBcIlNINjAwMTA5XCIsIFwiU0g2MDAxMTFcIiwgXCJTSDYwMDExNVwiLCBcIlNINjAwMTE4XCIsIFwiU0g2MDAxNTNcIiwgXCJTSDYwMDE1N1wiLCBcIlNINjAwMTcwXCIsIFwiU0g2MDAxNzdcIiwgXCJTSDYwMDE4OFwiLCBcIlNINjAwMTk2XCIsIFwiU0g2MDAyMDhcIiwgXCJTSDYwMDIxOVwiLCBcIlNINjAwMjIxXCIsIFwiU0g2MDAyMzNcIiwgXCJTSDYwMDI3MVwiLCBcIlNINjAwMjc2XCIsIFwiU0g2MDAyOTdcIiwgXCJTSDYwMDMwOVwiLCBcIlNINjAwMzMyXCIsIFwiU0g2MDAzNDBcIiwgXCJTSDYwMDM1MlwiLCBcIlNINjAwMzYyXCIsIFwiU0g2MDAzNjlcIiwgXCJTSDYwMDM3MlwiLCBcIlNINjAwMzczXCIsIFwiU0g2MDAzNzZcIiwgXCJTSDYwMDM4M1wiLCBcIlNINjAwMzkwXCIsIFwiU0g2MDA0MDZcIiwgXCJTSDYwMDQxNVwiLCBcIlNINjAwNDM2XCIsIFwiU0g2MDA0ODJcIiwgXCJTSDYwMDQ4NVwiLCBcIlNINjAwNDg5XCIsIFwiU0g2MDA0OThcIiwgXCJTSDYwMDUxOFwiLCBcIlNINjAwNTE5XCIsIFwiU0g2MDA1MjJcIiwgXCJTSDYwMDUzNVwiLCBcIlNINjAwNTQ3XCIsIFwiU0g2MDA1NDlcIiwgXCJTSDYwMDU3MFwiLCBcIlNINjAwNTgzXCIsIFwiU0g2MDA1ODVcIiwgXCJTSDYwMDU4OFwiLCBcIlNINjAwNjA2XCIsIFwiU0g2MDA2MzdcIiwgXCJTSDYwMDY0OVwiLCBcIlNINjAwNjYwXCIsIFwiU0g2MDA2NjNcIiwgXCJTSDYwMDY3NFwiLCBcIlNINjAwNjgyXCIsIFwiU0g2MDA2ODVcIiwgXCJTSDYwMDY4OFwiLCBcIlNINjAwNjkwXCIsIFwiU0g2MDA3MDNcIiwgXCJTSDYwMDcwNFwiLCBcIlNINjAwNzA1XCIsIFwiU0g2MDA3MzlcIiwgXCJTSDYwMDc0MVwiLCBcIlNINjAwNzk1XCIsIFwiU0g2MDA4MDRcIiwgXCJTSDYwMDgxNlwiLCBcIlNINjAwODIwXCIsIFwiU0g2MDA4MjdcIiwgXCJTSDYwMDgzN1wiLCBcIlNINjAwODcxXCIsIFwiU0g2MDA4ODZcIiwgXCJTSDYwMDg4N1wiLCBcIlNINjAwODkzXCIsIFwiU0g2MDA4OTVcIiwgXCJTSDYwMDkwMFwiLCBcIlNINjAwOTA5XCIsIFwiU0g2MDA5MTlcIiwgXCJTSDYwMDkyNlwiLCBcIlNINjAwOTU4XCIsIFwiU0g2MDA5NTlcIiwgXCJTSDYwMDk3N1wiLCBcIlNINjAwOTk5XCIsIFwiU0g2MDEwMDZcIiwgXCJTSDYwMTAwOVwiLCBcIlNINjAxMDEyXCIsIFwiU0g2MDEwMThcIiwgXCJTSDYwMTAyMVwiLCBcIlNINjAxMDg4XCIsIFwiU0g2MDEwOTlcIiwgXCJTSDYwMTExMVwiLCBcIlNINjAxMTE3XCIsIFwiU0g2MDExMThcIiwgXCJTSDYwMTE1NVwiLCBcIlNINjAxMTYzXCIsIFwiU0g2MDExNjZcIiwgXCJTSDYwMTE2OVwiLCBcIlNINjAxMTg2XCIsIFwiU0g2MDExOThcIiwgXCJTSDYwMTIxMVwiLCBcIlNINjAxMjEyXCIsIFwiU0g2MDEyMTZcIiwgXCJTSDYwMTIyNVwiLCBcIlNINjAxMjI4XCIsIFwiU0g2MDEyMjlcIiwgXCJTSDYwMTI4OFwiLCBcIlNINjAxMzE4XCIsIFwiU0g2MDEzMjhcIiwgXCJTSDYwMTMzM1wiLCBcIlNINjAxMzM2XCIsIFwiU0g2MDEzNzVcIiwgXCJTSDYwMTM3N1wiLCBcIlNINjAxMzkwXCIsIFwiU0g2MDEzOThcIiwgXCJTSDYwMTU1NVwiLCBcIlNINjAxNjAwXCIsIFwiU0g2MDE2MDFcIiwgXCJTSDYwMTYwN1wiLCBcIlNINjAxNjA4XCIsIFwiU0g2MDE2MTFcIiwgXCJTSDYwMTYxOFwiLCBcIlNINjAxNjI4XCIsIFwiU0g2MDE2MzNcIiwgXCJTSDYwMTY2OFwiLCBcIlNINjAxNjY5XCIsIFwiU0g2MDE2ODhcIiwgXCJTSDYwMTcxOFwiLCBcIlNINjAxNzI3XCIsIFwiU0g2MDE3NjZcIiwgXCJTSDYwMTc4OFwiLCBcIlNINjAxODAwXCIsIFwiU0g2MDE4MThcIiwgXCJTSDYwMTg1N1wiLCBcIlNINjAxODY2XCIsIFwiU0g2MDE4NzJcIiwgXCJTSDYwMTg3N1wiLCBcIlNINjAxODc4XCIsIFwiU0g2MDE4ODFcIiwgXCJTSDYwMTg4OFwiLCBcIlNINjAxODk4XCIsIFwiU0g2MDE4OTlcIiwgXCJTSDYwMTkwMVwiLCBcIlNINjAxOTE5XCIsIFwiU0g2MDE5MzNcIiwgXCJTSDYwMTkzOVwiLCBcIlNINjAxOTU4XCIsIFwiU0g2MDE5NjZcIiwgXCJTSDYwMTk4NVwiLCBcIlNINjAxOTg4XCIsIFwiU0g2MDE5ODlcIiwgXCJTSDYwMTk5MVwiLCBcIlNINjAxOTkyXCIsIFwiU0g2MDE5OTdcIiwgXCJTSDYwMTk5OFwiLCBcIlNINjAzMTYwXCIsIFwiU0g2MDM3OTlcIiwgXCJTSDYwMzgzM1wiLCBcIlNINjAzODU4XCIsIFwiU0g2MDM5OTNcIl07XG5cbkdhbWVMb2dpYyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gR2FtZUxvZ2ljKCkge31cblxuICBHYW1lTG9naWMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9iYWxhbmNlT2JqID0ge307XG4gICAgdGhpcy5fcHJvZml0T2JqID0ge307XG4gICAgdGhpcy5fY2FzaEZsb3dPYmogPSB7fTtcbiAgICB0aGlzLl9yZWdpc3RlckV2ZW50cygpO1xuICAgIHJldHVybiB0aGlzLl9pbml0VGFibGUoKTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBldmVudE1hbmFnZXIubGlzdGVuKGV2ZW50TmFtZXMuR0FNRV9HRVRfUkVTVUxULCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmouY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IG9iai5jYWxsYmFjayhfdGhpcy5maW5kTWF0Y2hDb25kaXRpb25TdG9jaygpKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2ZpbHRlclJPRSA9IGZ1bmN0aW9uKHN0b2NrQ29kZSkge1xuICAgIHZhciBhdmVSb2UsIHJvZVRhYmxlO1xuICAgIHJvZVRhYmxlID0gdGhpcy5fZ2V0Uk9FKHN0b2NrQ29kZSk7XG4gICAgYXZlUm9lID0gdXRpbHMuZ2V0QXZlcmFnZShyb2VUYWJsZSk7XG4gICAgaWYgKGF2ZVJvZSA+IDE4KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIEdhbWVMb2dpYy5wcm90b3R5cGUuX2ZpbHRlclByb2ZpdEFkZFJhdGlvID0gZnVuY3Rpb24oc3RvY2tDb2RlKSB7XG4gICAgdmFyIHByb2ZpdEFkZFJhdGlvO1xuICAgIHByb2ZpdEFkZFJhdGlvID0gdGhpcy5fcHJvZml0T2JqW3N0b2NrQ29kZV0uZ2V0TmV0UHJvZml0QWRkUmF0aW8oKTtcbiAgICBpZiAocHJvZml0QWRkUmF0aW8gPiAyMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9maWx0ZXJQRSA9IGZ1bmN0aW9uKHN0b2NrQ29kZSkge1xuICAgIHZhciBwZTtcbiAgICBwZSA9IHRoaXMuX3Byb2ZpdE9ialtzdG9ja0NvZGVdLmdldFBFKCk7XG4gICAgY29uc29sZS5sb2cocGUsIHR5cGVvZiBwZSwgcGUgPiAwKTtcbiAgICBpZiAoKDAgPCBwZSAmJiBwZSA8IDM1KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9nZXRTdG9ja0luZm8gPSBmdW5jdGlvbihzdG9ja0NvZGUpIHtcbiAgICB2YXIgUEUsIGF2ZVJvZSwgYmFzZUluZm8sIHByb2ZpdEFkZFJhdGlvLCByb2VUYWJsZTtcbiAgICBiYXNlSW5mbyA9IHRoaXMuX3Byb2ZpdE9ialtzdG9ja0NvZGVdLmdldEJhc2VJbmZvKCk7XG4gICAgcHJvZml0QWRkUmF0aW8gPSB0aGlzLl9wcm9maXRPYmpbc3RvY2tDb2RlXS5nZXROZXRQcm9maXRBZGRSYXRpbygpO1xuICAgIHJvZVRhYmxlID0gdGhpcy5fZ2V0Uk9FKHN0b2NrQ29kZSk7XG4gICAgYXZlUm9lID0gdXRpbHMuZ2V0QXZlcmFnZShyb2VUYWJsZSk7XG4gICAgUEUgPSB0aGlzLl9wcm9maXRPYmpbc3RvY2tDb2RlXS5nZXRQRSgpO1xuICAgIHJldHVybiB1dGlscy5hZGRUYWIoc3RvY2tDb2RlKSArIHV0aWxzLmFkZFRhYihiYXNlSW5mbykgKyB1dGlscy5hZGRUYWIocHJvZml0QWRkUmF0aW8pICsgdXRpbHMuYWRkVGFiKGF2ZVJvZSkgKyB1dGlscy5hZGRUYWIoXCJQRTpcIiArIFBFKSArIFwiXFxuXCI7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5maW5kTWF0Y2hDb25kaXRpb25TdG9jayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBqLCBsZW4sIGxlbjEsIG1hdGNoU3RvY2tUYWJsZSwgc3RvY2tDb2RlLCBzdG9ja0luZm9UYWJsZTtcbiAgICBtYXRjaFN0b2NrVGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBnX3N0b2NrVGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHN0b2NrQ29kZSA9IGdfc3RvY2tUYWJsZVtpXTtcbiAgICAgIHN0b2NrQ29kZSA9IHN0b2NrQ29kZS5zbGljZSgyLCA4KTtcbiAgICAgIGlmICh0aGlzLl9maWx0ZXJST0Uoc3RvY2tDb2RlKSAmJiB0aGlzLl9maWx0ZXJQcm9maXRBZGRSYXRpbyhzdG9ja0NvZGUpICYmIHRoaXMuX2ZpbHRlclBFKHN0b2NrQ29kZSkpIHtcbiAgICAgICAgbWF0Y2hTdG9ja1RhYmxlLnB1c2goc3RvY2tDb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RvY2tJbmZvVGFibGUgPSBbXCLogqHnpajku6PnoIEgXFx0IOWfuuacrOS/oeaBryBcXHQg5Yip5ram5aSN5ZCI5aKe6ZW/546HIFxcdCDlubPlnYdST0UgXFx0IFBFICDnu5/orqHml7bpl7Q6XCIgKyBnbG9iYWwueWVhciArIFwiLCDmgLvmlbA6XCIgKyBtYXRjaFN0b2NrVGFibGUubGVuZ3RoICsgXCJcXG5cIl07XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IG1hdGNoU3RvY2tUYWJsZS5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIHN0b2NrQ29kZSA9IG1hdGNoU3RvY2tUYWJsZVtqXTtcbiAgICAgIHN0b2NrSW5mb1RhYmxlLnB1c2godGhpcy5fZ2V0U3RvY2tJbmZvKHN0b2NrQ29kZSkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RvY2tJbmZvVGFibGU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5fZ2V0Uk9FID0gZnVuY3Rpb24oc3RvY2tDb2RlKSB7XG4gICAgdmFyIGksIGluZGV4LCBsZW4sIG5ldEFzc2V0cywgbmV0QXNzZXRzVGFibGUsIG5ldFByb2ZpdHNUYWJsZSwgcm9lLCByb2VUYWJsZTtcbiAgICBuZXRBc3NldHNUYWJsZSA9IHRoaXMuX2JhbGFuY2VPYmpbc3RvY2tDb2RlXS5nZXROZXRBc3NldHMoKTtcbiAgICBuZXRQcm9maXRzVGFibGUgPSB0aGlzLl9wcm9maXRPYmpbc3RvY2tDb2RlXS5nZXROZXRQcm9maXRUYWJsZSgpO1xuICAgIHJvZVRhYmxlID0gW107XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSBuZXRBc3NldHNUYWJsZS5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICBuZXRBc3NldHMgPSBuZXRBc3NldHNUYWJsZVtpbmRleF07XG4gICAgICBpZiAoaW5kZXggPj0gbmV0QXNzZXRzVGFibGUubGVuZ3RoIC0gMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJvZSA9ICgobmV0UHJvZml0c1RhYmxlW2luZGV4XSAvICgobmV0QXNzZXRzICsgbmV0QXNzZXRzVGFibGVbaW5kZXggKyAxXSkgLyAyKSkgKiAxMDApLnRvRml4ZWQoMik7XG4gICAgICByb2VUYWJsZS5wdXNoKHJvZSArIFwiXFx0XCIpO1xuICAgIH1cbiAgICByZXR1cm4gcm9lVGFibGU7XG4gIH07XG5cbiAgR2FtZUxvZ2ljLnByb3RvdHlwZS5nZXRSZWNlaXZhYmxlVHVybm92ZXJEYXlzID0gZnVuY3Rpb24oc3RvY2tDb2RlKSB7XG4gICAgdmFyIGRheXMsIGRheXNUYWJsZSwgaSwgaW5Db21lVmFsdWVUYWJsZSwgaW5kZXgsIGxlbiwgcmVjZWl2YWJsZVZhbHVlLCByZWNlaXZhYmxlVmFsdWVUYWJsZTtcbiAgICByZWNlaXZhYmxlVmFsdWVUYWJsZSA9IHRoaXMuX2JhbGFuY2VPYmpbc3RvY2tDb2RlXS5nZXRSZWNlaXZhYmxlVmFsdWUoKTtcbiAgICBpbkNvbWVWYWx1ZVRhYmxlID0gdGhpcy5fcHJvZml0T2JqW3N0b2NrQ29kZV0uZ2V0SW5jb21lVmFsdWUoKTtcbiAgICBkYXlzVGFibGUgPSBbXCLlupTmlLbotKbmrL7lkajovazlpKnmlbBcIiArIFwiXFx0XCJdO1xuICAgIGNvbnNvbGUubG9nKHJlY2VpdmFibGVWYWx1ZVRhYmxlLCBpbkNvbWVWYWx1ZVRhYmxlKTtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IHJlY2VpdmFibGVWYWx1ZVRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIHJlY2VpdmFibGVWYWx1ZSA9IHJlY2VpdmFibGVWYWx1ZVRhYmxlW2luZGV4XTtcbiAgICAgIGlmIChpbmRleCA+PSByZWNlaXZhYmxlVmFsdWVUYWJsZS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGF5cyA9IDM2MCAvIGluQ29tZVZhbHVlVGFibGVbaW5kZXhdICogKHJlY2VpdmFibGVWYWx1ZSArIHJlY2VpdmFibGVWYWx1ZVRhYmxlW2luZGV4ICsgMV0pIC8gMjtcbiAgICAgIGRheXNUYWJsZS5wdXNoKGRheXMgKyBcIlxcdFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGRheXNUYWJsZTtcbiAgfTtcblxuICBHYW1lTG9naWMucHJvdG90eXBlLl9pbml0VGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGlyLCBpLCBsZW4sIHN0b2NrQ29kZTtcbiAgICBkaXIgPSBcImhzMzAwXCI7XG4gICAgZm9yIChpID0gMCwgbGVuID0gZ19zdG9ja1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzdG9ja0NvZGUgPSBnX3N0b2NrVGFibGVbaV07XG4gICAgICBzdG9ja0NvZGUgPSBzdG9ja0NvZGUuc2xpY2UoMiwgOCk7XG4gICAgICB0aGlzLl9iYWxhbmNlT2JqW3N0b2NrQ29kZV0gPSBuZXcgQmFsYW5jZVNoZWV0KGRpciwgc3RvY2tDb2RlKTtcbiAgICAgIHRoaXMuX3Byb2ZpdE9ialtzdG9ja0NvZGVdID0gbmV3IFByb2ZpdFN0YXRlbWVudChkaXIsIHN0b2NrQ29kZSk7XG4gICAgICB0aGlzLl9jYXNoRmxvd09ialtzdG9ja0NvZGVdID0gbmV3IENhc2hGbG93U3RhdGVtZW50KGRpciwgc3RvY2tDb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEdhbWVMb2dpYztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lTG9naWM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlkyOXVkSEp2YkM5QmNtdEhZVzFsVEc5bmFXTXVZMjltWm1WbElpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhNaU9sc2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12WTI5dWRISnZiQzlCY210SFlXMWxURzluYVdNdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVUU3TzBGQlFVRXNXVUZCUVN4SFFVRnJRaXhQUVVGQkxFTkJRVkVzYVVOQlFWSTdPMEZCUTJ4Q0xGbEJRVUVzUjBGQmEwSXNUMEZCUVN4RFFVRlJMR2xEUVVGU096dEJRVU5zUWl4VlFVRkJMRWRCUVd0Q0xFOUJRVUVzUTBGQlVTd3JRa0ZCVWpzN1FVRkRiRUlzVVVGQlFTeEhRVUZyUWl4UFFVRkJMRU5CUVZFc05rSkJRVkk3TzBGQlJXeENMRmxCUVVFc1IwRkJhMElzVDBGQlFTeERRVUZSTERoQ1FVRlNPenRCUVVOc1FpeGxRVUZCTEVkQlFYRkNMRTlCUVVFc1EwRkJVU3hwUTBGQlVqczdRVUZEY2tJc2FVSkJRVUVzUjBGQmRVSXNUMEZCUVN4RFFVRlJMRzFEUVVGU096dEJRVVYyUWl4UFFVRkJMRU5CUVZFc2RVSkJRVkk3TzBGQlEwRXNTMEZCUVN4SFFVRlJMRTlCUVVFc1EwRkJVU3gxUWtGQlVqczdRVUZIVWl4WlFVRkJMRWRCUVdVc1EwRkJReXhWUVVGRUxFVkJRVmtzVlVGQldpeEZRVUYxUWl4VlFVRjJRaXhGUVVGclF5eFZRVUZzUXl4RlFVRTJReXhWUVVFM1F5eEZRVUYzUkN4VlFVRjRSQ3hGUVVGdFJTeFZRVUZ1UlN4RlFVRTRSU3hWUVVFNVJTeEZRVUY1Uml4VlFVRjZSaXhGUVVGdlJ5eFZRVUZ3Unl4RlFVRXJSeXhWUVVFdlJ5eEZRVUV3U0N4VlFVRXhTQ3hGUVVGeFNTeFZRVUZ5U1N4RlFVRm5TaXhWUVVGb1NpeEZRVUV5U2l4VlFVRXpTaXhGUVVGelN5eFZRVUYwU3l4RlFVRnBUQ3hWUVVGcVRDeEZRVUUwVEN4VlFVRTFUQ3hGUVVGMVRTeFZRVUYyVFN4RlFVRnJUaXhWUVVGc1RpeEZRVUUyVGl4VlFVRTNUaXhGUVVGM1R5eFZRVUY0VHl4RlFVRnRVQ3hWUVVGdVVDeEZRVUU0VUN4VlFVRTVVQ3hGUVVGNVVTeFZRVUY2VVN4RlFVRnZVaXhWUVVGd1VpeEZRVUVyVWl4VlFVRXZVaXhGUVVFd1V5eFZRVUV4VXl4RlFVRnhWQ3hWUVVGeVZDeEZRVUZuVlN4VlFVRm9WU3hGUVVFeVZTeFZRVUV6VlN4RlFVRnpWaXhWUVVGMFZpeEZRVUZwVnl4VlFVRnFWeXhGUVVFMFZ5eFZRVUUxVnl4RlFVRjFXQ3hWUVVGMldDeEZRVUZyV1N4VlFVRnNXU3hGUVVFMldTeFZRVUUzV1N4RlFVRjNXaXhWUVVGNFdpeEZRVUZ0WVN4VlFVRnVZU3hGUVVFNFlTeFZRVUU1WVN4RlFVRjVZaXhWUVVGNllpeEZRVUZ2WXl4VlFVRndZeXhGUVVFcll5eFZRVUV2WXl4RlFVRXdaQ3hWUVVFeFpDeEZRVUZ4WlN4VlFVRnlaU3hGUVVGblppeFZRVUZvWml4RlFVRXlaaXhWUVVFelppeEZRVUZ6WjBJc1ZVRkJkR2RDTEVWQlFXbG9RaXhWUVVGcWFFSXNSVUZCTkdoQ0xGVkJRVFZvUWl4RlFVRjFhVUlzVlVGQmRtbENMRVZCUVd0cVFpeFZRVUZzYWtJc1JVRkJObXBDTEZWQlFUZHFRaXhGUVVGM2EwSXNWVUZCZUd0Q0xFVkJRVzFzUWl4VlFVRnViRUlzUlVGQk9HeENMRlZCUVRsc1FpeEZRVUY1YlVJc1ZVRkJlbTFDTEVWQlFXOXVRaXhWUVVGd2JrSXNSVUZCSzI1Q0xGVkJRUzl1UWl4RlFVRXdiMElzVlVGQk1XOUNMRVZCUVhGd1FpeFZRVUZ5Y0VJc1JVRkJaM0ZDTEZWQlFXaHhRaXhGUVVFeWNVSXNWVUZCTTNGQ0xFVkJRWE55UWl4VlFVRjBja0lzUlVGQmFYTkNMRlZCUVdwelFpeEZRVUUwYzBJc1ZVRkJOWE5DTEVWQlFYVjBRaXhWUVVGMmRFSXNSVUZCYTNWQ0xGVkJRV3gxUWl4RlFVRTJkVUlzVlVGQk4zVkNMRVZCUVhkMlFpeFZRVUY0ZGtJc1JVRkJiWGRDTEZWQlFXNTNRaXhGUVVFNGQwSXNWVUZCT1hkQ0xFVkJRWGw0UWl4VlFVRjZlRUlzUlVGQmIzbENMRlZCUVhCNVFpeEZRVUVyZVVJc1ZVRkJMM2xDTEVWQlFUQjZRaXhWUVVFeGVrSXNSVUZCY1RCQ0xGVkJRWEl3UWl4RlFVRm5NVUlzVlVGQmFERkNMRVZCUVRJeFFpeFZRVUV6TVVJc1JVRkJjekpDTEZWQlFYUXlRaXhGUVVGcE0wSXNWVUZCYWpOQ0xFVkJRVFF6UWl4VlFVRTFNMElzUlVGQmRUUkNMRlZCUVhZMFFpeEZRVUZyTlVJc1ZVRkJiRFZDTEVWQlFUWTFRaXhWUVVFM05VSXNSVUZCZHpaQ0xGVkJRWGcyUWl4RlFVRnROMElzVlVGQmJqZENMRVZCUVRnM1FpeFZRVUU1TjBJc1JVRkJlVGhDTEZWQlFYbzRRaXhGUVVGdk9VSXNWVUZCY0RsQ0xFVkJRU3M1UWl4VlFVRXZPVUlzUlVGQk1DdENMRlZCUVRFclFpeEZRVUZ4TDBJc1ZVRkJjaTlDTEVWQlFXZG5ReXhWUVVGb1owTXNSVUZCTW1kRExGVkJRVE5uUXl4RlFVRnphRU1zVlVGQmRHaERMRVZCUVdscFF5eFZRVUZxYVVNc1JVRkJOR2xETEZWQlFUVnBReXhGUVVGMWFrTXNWVUZCZG1wRExFVkJRV3RyUXl4VlFVRnNhME1zUlVGQk5tdERMRlZCUVRkclF5eEZRVUYzYkVNc1ZVRkJlR3hETEVWQlFXMXRReXhWUVVGdWJVTXNSVUZCT0cxRExGVkJRVGx0UXl4RlFVRjVia01zVlVGQmVtNURMRVZCUVc5dlF5eFZRVUZ3YjBNc1JVRkJLMjlETEZWQlFTOXZReXhGUVVFd2NFTXNWVUZCTVhCRExFVkJRWEZ4UXl4VlFVRnljVU1zUlVGQlozSkRMRlZCUVdoeVF5eEZRVUV5Y2tNc1ZVRkJNM0pETEVWQlFYTnpReXhWUVVGMGMwTXNSVUZCYVhSRExGVkJRV3AwUXl4RlFVRTBkRU1zVlVGQk5YUkRMRVZCUVhWMVF5eFZRVUYyZFVNc1JVRkJhM1pETEZWQlFXeDJReXhGUVVFMmRrTXNWVUZCTjNaRExFVkJRWGQzUXl4VlFVRjRkME1zUlVGQmJYaERMRlZCUVc1NFF5eEZRVUU0ZUVNc1ZVRkJPWGhETEVWQlFYbDVReXhWUVVGNmVVTXNSVUZCYjNwRExGVkJRWEI2UXl4RlFVRXJla01zVlVGQkwzcERMRVZCUVRBd1F5eFZRVUV4TUVNc1JVRkJjVEZETEZWQlFYSXhReXhGUVVGbk1rTXNWVUZCYURKRExFVkJRVEl5UXl4VlFVRXpNa01zUlVGQmN6TkRMRlZCUVhRelF5eEZRVUZwTkVNc1ZVRkJhalJETEVWQlFUUTBReXhWUVVFMU5FTXNSVUZCZFRWRExGVkJRWFkxUXl4RlFVRnJOa01zVlVGQmJEWkRMRVZCUVRZMlF5eFZRVUUzTmtNc1JVRkJkemRETEZWQlFYZzNReXhGUVVGdE9FTXNWVUZCYmpoRExFVkJRVGc0UXl4VlFVRTVPRU1zUlVGQmVUbERMRlZCUVhvNVF5eEZRVUZ2SzBNc1ZVRkJjQ3RETEVWQlFTc3JReXhWUVVFdkswTXNSVUZCTUM5RExGVkJRVEV2UXl4RlFVRnhaMFFzVlVGQmNtZEVMRVZCUVdkb1JDeFZRVUZvYUVRc1JVRkJNbWhFTEZWQlFUTm9SQ3hGUVVGemFVUXNWVUZCZEdsRUxFVkJRV2xxUkN4VlFVRnFha1FzUlVGQk5HcEVMRlZCUVRWcVJDeEZRVUYxYTBRc1ZVRkJkbXRFTEVWQlFXdHNSQ3hWUVVGc2JFUXNSVUZCTm14RUxGVkJRVGRzUkN4RlFVRjNiVVFzVlVGQmVHMUVMRVZCUVcxdVJDeFZRVUZ1YmtRc1JVRkJPRzVFTEZWQlFUbHVSQ3hGUVVGNWIwUXNWVUZCZW05RUxFVkJRVzl3UkN4VlFVRndjRVFzUlVGQkszQkVMRlZCUVM5d1JDeEZRVUV3Y1VRc1ZVRkJNWEZFTEVWQlFYRnlSQ3hWUVVGeWNrUXNSVUZCWjNORUxGVkJRV2h6UkN4RlFVRXljMFFzVlVGQk0zTkVMRVZCUVhOMFJDeFZRVUYwZEVRc1JVRkJhWFZFTEZWQlFXcDFSQ3hGUVVFMGRVUXNWVUZCTlhWRUxFVkJRWFYyUkN4VlFVRjJka1FzUlVGQmEzZEVMRlZCUVd4M1JDeEZRVUUyZDBRc1ZVRkJOM2RFTEVWQlFYZDRSQ3hWUVVGNGVFUXNSVUZCYlhsRUxGVkJRVzU1UkN4RlFVRTRlVVFzVlVGQk9YbEVMRVZCUVhsNlJDeFZRVUY2ZWtRc1JVRkJiekJFTEZWQlFYQXdSQ3hGUVVFck1FUXNWVUZCTHpCRUxFVkJRVEF4UkN4VlFVRXhNVVFzUlVGQmNUSkVMRlZCUVhJeVJDeEZRVUZuTTBRc1ZVRkJhRE5FTEVWQlFUSXpSQ3hWUVVFek0wUXNSVUZCY3pSRUxGVkJRWFEwUkN4RlFVRnBOVVFzVlVGQmFqVkVMRVZCUVRRMVJDeFZRVUUxTlVRc1JVRkJkVFpFTEZWQlFYWTJSQ3hGUVVGck4wUXNWVUZCYkRkRUxFVkJRVFkzUkN4VlFVRTNOMFFzUlVGQmR6aEVMRlZCUVhnNFJDeEZRVUZ0T1VRc1ZVRkJiamxFTEVWQlFUZzVSQ3hWUVVFNU9VUXNSVUZCZVN0RUxGVkJRWG9yUkN4RlFVRnZMMFFzVlVGQmNDOUVMRVZCUVNzdlJDeFZRVUV2TDBRc1JVRkJNR2RGTEZWQlFURm5SU3hGUVVGeGFFVXNWVUZCY21oRkxFVkJRV2RwUlN4VlFVRm9hVVVzUlVGQk1tbEZMRlZCUVROcFJTeEZRVUZ6YWtVc1ZVRkJkR3BGTEVWQlFXbHJSU3hWUVVGcWEwVXNSVUZCTkd0RkxGVkJRVFZyUlN4RlFVRjFiRVVzVlVGQmRteEZMRVZCUVd0dFJTeFZRVUZzYlVVc1JVRkJObTFGTEZWQlFUZHRSU3hGUVVGM2JrVXNWVUZCZUc1RkxFVkJRVzF2UlN4VlFVRnViMFVzUlVGQk9HOUZMRlZCUVRsdlJTeEZRVUY1Y0VVc1ZVRkJlbkJGTEVWQlFXOXhSU3hWUVVGd2NVVXNSVUZCSzNGRkxGVkJRUzl4UlN4RlFVRXdja1VzVlVGQk1YSkZMRVZCUVhGelJTeFZRVUZ5YzBVc1JVRkJaM1JGTEZWQlFXaDBSU3hGUVVFeWRFVXNWVUZCTTNSRkxFVkJRWE4xUlN4VlFVRjBkVVVzUlVGQmFYWkZMRlZCUVdwMlJTeEZRVUUwZGtVc1ZVRkJOWFpGTEVWQlFYVjNSU3hWUVVGMmQwVXNSVUZCYTNoRkxGVkJRV3g0UlN4RlFVRTJlRVVzVlVGQk4zaEZMRVZCUVhkNVJTeFZRVUY0ZVVVc1JVRkJiWHBGTEZWQlFXNTZSU3hGUVVFNGVrVXNWVUZCT1hwRkxFVkJRWGt3UlN4VlFVRjZNRVVzUlVGQmJ6RkZMRlZCUVhBeFJTeEZRVUVyTVVVc1ZVRkJMekZGTEVWQlFUQXlSU3hWUVVFeE1rVXNSVUZCY1RORkxGVkJRWEl6UlN4RlFVRm5ORVVzVlVGQmFEUkZMRVZCUVRJMFJTeFZRVUV6TkVVc1JVRkJjelZGTEZWQlFYUTFSU3hGUVVGcE5rVXNWVUZCYWpaRkxFVkJRVFEyUlN4VlFVRTFOa1VzUlVGQmRUZEZMRlZCUVhZM1JTeEZRVUZyT0VVc1ZVRkJiRGhGTEVWQlFUWTRSU3hWUVVFM09FVXNSVUZCZHpsRkxGVkJRWGc1UlN4RlFVRnRLMFVzVlVGQmJpdEZMRVZCUVRnclJTeFZRVUU1SzBVc1JVRkJlUzlGTEZWQlFYb3ZSU3hGUVVGdlowWXNWVUZCY0dkR0xFVkJRU3RuUml4VlFVRXZaMFlzUlVGQk1HaEdMRlZCUVRGb1JpeEZRVUZ4YVVZc1ZVRkJjbWxHTEVWQlFXZHFSaXhWUVVGb2FrWXNSVUZCTW1wR0xGVkJRVE5xUml4RlFVRnphMFlzVlVGQmRHdEdMRVZCUVdsc1JpeFZRVUZxYkVZc1JVRkJOR3hHTEZWQlFUVnNSaXhGUVVGMWJVWXNWVUZCZG0xR0xFVkJRV3R1Uml4VlFVRnNia1lzUlVGQk5tNUdMRlZCUVRkdVJpeEZRVUYzYjBZc1ZVRkJlRzlHTEVWQlFXMXdSaXhWUVVGdWNFWXNSVUZCT0hCR0xGVkJRVGx3Uml4RlFVRjVjVVlzVlVGQmVuRkdMRVZCUVc5eVJpeFZRVUZ3Y2tZc1JVRkJLM0pHTEZWQlFTOXlSaXhGUVVFd2MwWXNWVUZCTVhOR0xFVkJRWEYwUml4VlFVRnlkRVlzUlVGQlozVkdMRlZCUVdoMVJpeEZRVUV5ZFVZc1ZVRkJNM1ZHTEVWQlFYTjJSaXhWUVVGMGRrWXNSVUZCYVhkR0xGVkJRV3AzUml4RlFVRTBkMFlzVlVGQk5YZEdMRVZCUVhWNFJpeFZRVUYyZUVZc1JVRkJhM2xHTEZWQlFXeDVSaXhGUVVFMmVVWXNWVUZCTjNsR0xFVkJRWGQ2Uml4VlFVRjRla1lzUlVGQmJUQkdMRlZCUVc0d1JpeEZRVUU0TUVZc1ZVRkJPVEJHTEVWQlFYa3hSaXhWUVVGNk1VWXNSVUZCYnpKR0xGVkJRWEF5Uml4RlFVRXJNa1lzVlVGQkx6SkdMRVZCUVRBelJpeFZRVUV4TTBZc1JVRkJjVFJHTEZWQlFYSTBSaXhGUVVGbk5VWXNWVUZCYURWR0xFVkJRVEkxUml4VlFVRXpOVVlzUlVGQmN6WkdMRlZCUVhRMlJpeEZRVUZwTjBZc1ZVRkJhamRHTEVWQlFUUTNSaXhWUVVFMU4wWXNSVUZCZFRoR0xGVkJRWFk0Uml4RlFVRnJPVVlzVlVGQmJEbEdMRVZCUVRZNVJpeFZRVUUzT1VZc1JVRkJkeXRHTEZWQlFYZ3JSaXhGUVVGdEwwWXNWVUZCYmk5R0xFVkJRVGd2Uml4VlFVRTVMMFlzUlVGQmVXZEhMRlZCUVhwblJ5eEZRVUZ2YUVjc1ZVRkJjR2hITEVWQlFTdG9SeXhWUVVFdmFFY3NSVUZCTUdsSExGVkJRVEZwUnl4RlFVRnhha2NzVlVGQmNtcEhMRVZCUVdkclJ5eFZRVUZvYTBjc1JVRkJNbXRITEZWQlFUTnJSeXhGUVVGemJFY3NWVUZCZEd4SExFVkJRV2x0Unl4VlFVRnFiVWNzUlVGQk5HMUhMRlZCUVRWdFJ5eEZRVUYxYmtjc1ZVRkJkbTVITEVWQlFXdHZSeXhWUVVGc2IwY3NSVUZCTm05SExGVkJRVGR2Unl4RlFVRjNjRWNzVlVGQmVIQkhMRVZCUVcxeFJ5eFZRVUZ1Y1Vjc1JVRkJPSEZITEZWQlFUbHhSeXhGUVVGNWNrY3NWVUZCZW5KSExFVkJRVzl6Unl4VlFVRndjMGNzUlVGQkszTkhMRlZCUVM5elJ5eEZRVUV3ZEVjc1ZVRkJNWFJIT3p0QlFVZFVPenM3YzBKQlEwWXNTVUZCUVN4SFFVRk5MRk5CUVVFN1NVRkRSaXhKUVVGRExFTkJRVUVzVjBGQlJDeEhRVUZsTzBsQlEyWXNTVUZCUXl4RFFVRkJMRlZCUVVRc1IwRkJZenRKUVVOa0xFbEJRVU1zUTBGQlFTeFpRVUZFTEVkQlFXZENPMGxCUTJoQ0xFbEJRVU1zUTBGQlFTeGxRVUZFTEVOQlFVRTdWMEZEUVN4SlFVRkRMRU5CUVVFc1ZVRkJSQ3hEUVVGQk8wVkJURVU3TzNOQ1FVOU9MR1ZCUVVFc1IwRkJhVUlzVTBGQlFUdFhRVVZpTEZsQlFWa3NRMEZCUXl4TlFVRmlMRU5CUVc5Q0xGVkJRVlVzUTBGQlF5eGxRVUV2UWl4RlFVRm5SQ3hEUVVGQkxGTkJRVUVzUzBGQlFUdGhRVUZCTEZOQlFVTXNSMEZCUkR0dlJFRkROVU1zUjBGQlJ5eERRVUZETEZOQlFWVXNTMEZCUXl4RFFVRkJMSFZDUVVGRUxFTkJRVUU3VFVGRU9FSTdTVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQkxFTkJRV2hFTzBWQlJtRTdPM05DUVUxcVFpeFZRVUZCTEVkQlFWa3NVMEZCUXl4VFFVRkVPMEZCUTFJc1VVRkJRVHRKUVVGQkxGRkJRVUVzUjBGQlZ5eEpRVUZETEVOQlFVRXNUMEZCUkN4RFFVRlRMRk5CUVZRN1NVRkRXQ3hOUVVGQkxFZEJRVk1zUzBGQlN5eERRVUZETEZWQlFVNHNRMEZCYVVJc1VVRkJha0k3U1VGRFZDeEpRVUZITEUxQlFVRXNSMEZCVXl4RlFVRmFPMEZCUTBrc1lVRkJUeXhMUVVSWU96dEJRVVZCTEZkQlFVODdSVUZNUXpzN2MwSkJUMW9zY1VKQlFVRXNSMEZCZFVJc1UwRkJReXhUUVVGRU8wRkJRMjVDTEZGQlFVRTdTVUZCUVN4alFVRkJMRWRCUVdsQ0xFbEJRVU1zUTBGQlFTeFZRVUZYTEVOQlFVRXNVMEZCUVN4RFFVRlZMRU5CUVVNc2IwSkJRWFpDTEVOQlFVRTdTVUZEYWtJc1NVRkJSeXhqUVVGQkxFZEJRV2xDTEVWQlFYQkNPMEZCUTBrc1lVRkJUeXhMUVVSWU96dEJRVVZCTEZkQlFVODdSVUZLV1RzN2MwSkJUWFpDTEZOQlFVRXNSMEZCVnl4VFFVRkRMRk5CUVVRN1FVRkRVQ3hSUVVGQk8wbEJRVUVzUlVGQlFTeEhRVUZMTEVsQlFVTXNRMEZCUVN4VlFVRlhMRU5CUVVFc1UwRkJRU3hEUVVGVkxFTkJRVU1zUzBGQmRrSXNRMEZCUVR0SlFVTk1MRTlCUVU4c1EwRkJReXhIUVVGU0xFTkJRVmtzUlVGQldpeEZRVUZuUWl4UFFVRlBMRVZCUVhaQ0xFVkJRVFpDTEVWQlFVRXNSMEZCU3l4RFFVRnNRenRKUVVOQkxFbEJRVWNzUTBGQlFTeERRVUZCTEVkQlFVa3NSVUZCU2l4SlFVRkpMRVZCUVVvc1IwRkJVeXhGUVVGVUxFTkJRVWc3UVVGRFNTeGhRVUZQTEV0QlJGZzdPMEZCUlVFc1YwRkJUenRGUVV4Qk96dHpRa0ZQV0N4aFFVRkJMRWRCUVdVc1UwRkJReXhUUVVGRU8wRkJRMWdzVVVGQlFUdEpRVUZCTEZGQlFVRXNSMEZCVnl4SlFVRkRMRU5CUVVFc1ZVRkJWeXhEUVVGQkxGTkJRVUVzUTBGQlZTeERRVUZETEZkQlFYWkNMRU5CUVVFN1NVRkRXQ3hqUVVGQkxFZEJRV2xDTEVsQlFVTXNRMEZCUVN4VlFVRlhMRU5CUVVFc1UwRkJRU3hEUVVGVkxFTkJRVU1zYjBKQlFYWkNMRU5CUVVFN1NVRkZha0lzVVVGQlFTeEhRVUZYTEVsQlFVTXNRMEZCUVN4UFFVRkVMRU5CUVZNc1UwRkJWRHRKUVVOWUxFMUJRVUVzUjBGQlV5eExRVUZMTEVOQlFVTXNWVUZCVGl4RFFVRnBRaXhSUVVGcVFqdEpRVVZVTEVWQlFVRXNSMEZCVFN4SlFVRkRMRU5CUVVFc1ZVRkJWeXhEUVVGQkxGTkJRVUVzUTBGQlZTeERRVUZETEV0QlFYWkNMRU5CUVVFN1FVRkRUaXhYUVVGUExFdEJRVXNzUTBGQlF5eE5RVUZPTEVOQlFXRXNVMEZCWWl4RFFVRkJMRWRCUVRCQ0xFdEJRVXNzUTBGQlF5eE5RVUZPTEVOQlFXRXNVVUZCWWl4RFFVRXhRaXhIUVVOSUxFdEJRVXNzUTBGQlF5eE5RVUZPTEVOQlFXRXNZMEZCWWl4RFFVUkhMRWRCUXpSQ0xFdEJRVXNzUTBGQlF5eE5RVUZPTEVOQlFXRXNUVUZCWWl4RFFVUTFRaXhIUVVOdFJDeExRVUZMTEVOQlFVTXNUVUZCVGl4RFFVRmhMRXRCUVVFc1IwRkJUU3hGUVVGdVFpeERRVVJ1UkN4SFFVTTRSVHRGUVZReFJUczdjMEpCVjJZc2RVSkJRVUVzUjBGQmVVSXNVMEZCUVR0QlFVTnlRaXhSUVVGQk8wbEJRVUVzWlVGQlFTeEhRVUZyUWp0QlFVTnNRaXhUUVVGQkxEaERRVUZCT3p0TlFVTkpMRk5CUVVFc1IwRkJXU3hUUVVGVExFTkJRVU1zUzBGQlZpeERRVUZuUWl4RFFVRm9RaXhGUVVGdFFpeERRVUZ1UWp0TlFVTmFMRWxCUVVjc1NVRkJReXhEUVVGQkxGVkJRVVFzUTBGQldTeFRRVUZhTEVOQlFVRXNTVUZCTWtJc1NVRkJReXhEUVVGQkxIRkNRVUZFTEVOQlFYVkNMRk5CUVhaQ0xFTkJRVE5DTEVsQlFXbEZMRWxCUVVNc1EwRkJRU3hUUVVGRUxFTkJRVmNzVTBGQldDeERRVUZ3UlR0UlFVTkpMR1ZCUVdVc1EwRkJReXhKUVVGb1FpeERRVUZ4UWl4VFFVRnlRaXhGUVVSS096dEJRVVpLTzBsQlMwRXNZMEZCUVN4SFFVRnBRaXhEUVVGRExDdERRVUZCTEVkQlFXZEVMRTFCUVUwc1EwRkJReXhKUVVGMlJDeEhRVUUwUkN4UFFVRTFSQ3hIUVVGdFJTeGxRVUZsTEVOQlFVTXNUVUZCYmtZc1IwRkJNRVlzU1VGQk0wWTdRVUZEYWtJc1UwRkJRU3h0UkVGQlFUczdUVUZEU1N4alFVRmpMRU5CUVVNc1NVRkJaaXhEUVVGdlFpeEpRVUZETEVOQlFVRXNZVUZCUkN4RFFVRmxMRk5CUVdZc1EwRkJjRUk3UVVGRVNqdEJRVVZCTEZkQlFVODdSVUZXWXpzN2MwSkJXWHBDTEU5QlFVRXNSMEZCVXl4VFFVRkRMRk5CUVVRN1FVRkRUQ3hSUVVGQk8wbEJRVUVzWTBGQlFTeEhRVUZwUWl4SlFVRkRMRU5CUVVFc1YwRkJXU3hEUVVGQkxGTkJRVUVzUTBGQlZTeERRVUZETEZsQlFYaENMRU5CUVVFN1NVRkRha0lzWlVGQlFTeEhRVUZyUWl4SlFVRkRMRU5CUVVFc1ZVRkJWeXhEUVVGQkxGTkJRVUVzUTBGQlZTeERRVUZETEdsQ1FVRjJRaXhEUVVGQk8wbEJRMnhDTEZGQlFVRXNSMEZCVnp0QlFVTllMRk5CUVVFc1owVkJRVUU3TzAxQlEwa3NTVUZCVXl4TFFVRkJMRWxCUVZNc1kwRkJZeXhEUVVGRExFMUJRV1lzUjBGQmQwSXNRMEZCTVVNN1FVRkJRU3hqUVVGQk96dE5RVU5CTEVkQlFVRXNSMEZCVFN4RFFVRkRMRU5CUVVNc1pVRkJaMElzUTBGQlFTeExRVUZCTEVOQlFXaENMRWRCUVhsQ0xFTkJRVU1zUTBGQlF5eFRRVUZCTEVkQlFWa3NZMEZCWlN4RFFVRkJMRXRCUVVFc1IwRkJVU3hEUVVGU0xFTkJRVFZDTEVOQlFVRXNSMEZCTUVNc1EwRkJNME1zUTBGQk1VSXNRMEZCUVN4SFFVRXlSU3hIUVVFMVJTeERRVUZuUml4RFFVRkRMRTlCUVdwR0xFTkJRWGxHTEVOQlFYcEdPMDFCUTA0c1VVRkJVU3hEUVVGRExFbEJRVlFzUTBGQll5eEhRVUZCTEVkQlFVMHNTVUZCY0VJN1FVRklTanRCUVVsQkxGZEJRVTg3UlVGU1JqczdjMEpCVlZRc2VVSkJRVUVzUjBGQk1rSXNVMEZCUXl4VFFVRkVPMEZCUTNaQ0xGRkJRVUU3U1VGQlFTeHZRa0ZCUVN4SFFVRjFRaXhKUVVGRExFTkJRVUVzVjBGQldTeERRVUZCTEZOQlFVRXNRMEZCVlN4RFFVRkRMR3RDUVVGNFFpeERRVUZCTzBsQlEzWkNMR2RDUVVGQkxFZEJRVzFDTEVsQlFVTXNRMEZCUVN4VlFVRlhMRU5CUVVFc1UwRkJRU3hEUVVGVkxFTkJRVU1zWTBGQmRrSXNRMEZCUVR0SlFVTnVRaXhUUVVGQkxFZEJRVmtzUTBGQlF5eFZRVUZCTEVkQlFXRXNTVUZCWkR0SlFVTmFMRTlCUVU4c1EwRkJReXhIUVVGU0xFTkJRVmtzYjBKQlFWb3NSVUZCYTBNc1owSkJRV3hETzBGQlEwRXNVMEZCUVN4elJVRkJRVHM3VFVGRFNTeEpRVUZUTEV0QlFVRXNTVUZCVXl4dlFrRkJiMElzUTBGQlF5eE5RVUZ5UWl4SFFVRTRRaXhEUVVGb1JEdEJRVUZCTEdOQlFVRTdPMDFCUTBFc1NVRkJRU3hIUVVGUExFZEJRVUVzUjBGQlRTeG5Ra0ZCYVVJc1EwRkJRU3hMUVVGQkxFTkJRWFpDTEVkQlFXZERMRU5CUVVNc1pVRkJRU3hIUVVGclFpeHZRa0ZCY1VJc1EwRkJRU3hMUVVGQkxFZEJRVkVzUTBGQlVpeERRVUY0UXl4RFFVRm9ReXhIUVVGelJqdE5RVU0zUml4VFFVRlRMRU5CUVVNc1NVRkJWaXhEUVVGbExFbEJRVUVzUjBGQlR5eEpRVUYwUWp0QlFVaEtPMEZCU1VFc1YwRkJUenRGUVZSblFqczdjMEpCVnpOQ0xGVkJRVUVzUjBGQldTeFRRVUZCTzBGQlExSXNVVUZCUVR0SlFVRkJMRWRCUVVFc1IwRkJUVHRCUVVOT0xGTkJRVUVzT0VOQlFVRTdPMDFCUTBrc1UwRkJRU3hIUVVGWkxGTkJRVk1zUTBGQlF5eExRVUZXTEVOQlFXZENMRU5CUVdoQ0xFVkJRVzFDTEVOQlFXNUNPMDFCUTFvc1NVRkJReXhEUVVGQkxGZEJRVmtzUTBGQlFTeFRRVUZCTEVOQlFXSXNSMEZCTUVJc1NVRkJTU3haUVVGS0xFTkJRV2xDTEVkQlFXcENMRVZCUVhOQ0xGTkJRWFJDTzAxQlF6RkNMRWxCUVVNc1EwRkJRU3hWUVVGWExFTkJRVUVzVTBGQlFTeERRVUZhTEVkQlFYbENMRWxCUVVrc1pVRkJTaXhEUVVGdlFpeEhRVUZ3UWl4RlFVRjVRaXhUUVVGNlFqdE5RVU42UWl4SlFVRkRMRU5CUVVFc1dVRkJZU3hEUVVGQkxGTkJRVUVzUTBGQlpDeEhRVUV5UWl4SlFVRkpMR2xDUVVGS0xFTkJRWE5DTEVkQlFYUkNMRVZCUVRKQ0xGTkJRVE5DTzBGQlNpOUNPMFZCUmxFN096czdPenRCUVZOb1FpeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUo5XG4iLCJ2YXIgRXZlbnRNYW5hZ2VyO1xuXG5FdmVudE1hbmFnZXIgPSB7XG4gIHNlbmQ6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIHZhciBldmVudDtcbiAgICBldmVudCA9IG5ldyBjYy5FdmVudEN1c3RvbShldmVudE5hbWUpO1xuICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICBldmVudC5zZXRVc2VyRGF0YShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGNjLmV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfSxcbiAgbGlzdGVuOiBmdW5jdGlvbihldmVudE5hbWUsIGxpc3RlbkZ1bmMsIG5vZGVPclByaW9yaXR5KSB7XG4gICAgdmFyIGNjTGlzdGVuZXI7XG4gICAgaWYgKG5vZGVPclByaW9yaXR5ID09IG51bGwpIHtcbiAgICAgIG5vZGVPclByaW9yaXR5ID0gMTtcbiAgICB9XG4gICAgY2NMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLkNVU1RPTSxcbiAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLFxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5GdW5jKGV2ZW50LmdldFVzZXJEYXRhKCksIGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGNjTGlzdGVuZXIsIG5vZGVPclByaW9yaXR5KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE1hbmFnZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlpYWmxiblF2UVhKclJYWmxiblJOWVc1aFoyVnlMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDJWMlpXNTBMMEZ5YTBWMlpXNTBUV0Z1WVdkbGNpNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVRzN1FVRkJRU3haUVVGQkxFZEJRMGs3UlVGQlFTeEpRVUZCTEVWQlFVMHNVMEZCUXl4VFFVRkVMRVZCUVZrc1NVRkJXanRCUVVOR0xGRkJRVUU3U1VGQlFTeExRVUZCTEVkQlFWRXNTVUZCU1N4RlFVRkZMRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeFRRVUZ1UWp0SlFVTlNMRWxCUVVrc1NVRkJRU3hMUVVGUkxFbEJRVm83VFVGRFNTeExRVUZMTEVOQlFVTXNWMEZCVGl4RFFVRnJRaXhKUVVGc1FpeEZRVVJLT3p0WFFVVkJMRVZCUVVVc1EwRkJReXhaUVVGWkxFTkJRVU1zWVVGQmFFSXNRMEZCT0VJc1MwRkJPVUk3UlVGS1JTeERRVUZPTzBWQlMwRXNUVUZCUVN4RlFVRlJMRk5CUVVNc1UwRkJSQ3hGUVVGWkxGVkJRVm9zUlVGQmQwSXNZMEZCZUVJN1FVRkRTaXhSUVVGQk96dE5RVUZCTEdsQ1FVRnJRanM3U1VGRGJFSXNWVUZCUVN4SFFVRmhMRVZCUVVVc1EwRkJReXhoUVVGaExFTkJRVU1zVFVGQmFrSXNRMEZEVkR0TlFVRkJMRXRCUVVFc1JVRkJUeXhGUVVGRkxFTkJRVU1zWVVGQllTeERRVUZETEUxQlFYaENPMDFCUTBFc1UwRkJRU3hGUVVGWExGTkJSRmc3VFVGRlFTeFJRVUZCTEVWQlFWVXNVMEZCUXl4TFFVRkVPMEZCUTA0c1pVRkJUeXhWUVVGQkxFTkJRVmNzUzBGQlN5eERRVUZETEZkQlFVNHNRMEZCUVN4RFFVRllMRVZCUVdkRExFdEJRV2hETzAxQlJFUXNRMEZHVmp0TFFVUlRPMWRCVFdJc1JVRkJSU3hEUVVGRExGbEJRVmtzUTBGQlF5eFhRVUZvUWl4RFFVRTBRaXhWUVVFMVFpeEZRVUYzUXl4alFVRjRRenRGUVZKSkxFTkJURkk3T3p0QlFXTktMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSW4wPVxuIiwidmFyIEV2ZW50TmFtZXM7XG5cbkV2ZW50TmFtZXMgPSB7XG4gIEdBTUVfU1RBUlQ6IFwiZ2FtZS5zdGFydFwiLFxuICBHQU1FX0VORDogXCJnYW1lLmVuZFwiLFxuICBHQU1FX05FWFRfTEVWRUw6IFwiZ2FtZS5uZXh0LmxldmVsXCIsXG4gIEdBTUVfR0VUX1JFU1VMVDogXCJnYW1lLmdldC5yZXN1bHRcIixcbiAgR0FNRV9JTklUX1RBQkxFOiBcImdhbWUuaW5pdC50YWJsZVwiXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TmFtZXM7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdlpYWmxiblF2UVhKclJYWmxiblJPWVcxbGN5NWpiMlptWldVaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXZWWE5sY25NdmRHRnZkM1V2YzNSMVpIa3ZRWEpyWVdRdlFYSnJZV1JIWVcxbEwzTnlZeTlsZG1WdWRDOUJjbXRGZG1WdWRFNWhiV1Z6TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkJPenRCUVVGQkxGVkJRVUVzUjBGRFNUdEZRVUZCTEZWQlFVRXNSVUZCYTBJc1dVRkJiRUk3UlVGRFFTeFJRVUZCTEVWQlFXdENMRlZCUkd4Q08wVkJSVUVzWlVGQlFTeEZRVUZyUWl4cFFrRkdiRUk3UlVGSlFTeGxRVUZCTEVWQlFXdENMR2xDUVVwc1FqdEZRVXRCTEdWQlFVRXNSVUZCYTBJc2FVSkJUR3hDT3pzN1FVRlBTaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlKOVxuIiwiZ2xvYmFsLnllYXIgPSA2O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZaMnh2WW1Gc1ZtRnNkV1V1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdloyeHZZbUZzVm1Gc2RXVXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTFCUVUwc1EwRkJReXhKUVVGUUxFZEJRV01pZlE9PVxuIiwiY2MuZ2FtZS5vblN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBHYW1lTG9naWMsIGdhbWVEaWFsb2csIGdhbWVMb2dpY09iaiwgc2NlbmVNYW5hZ2VyO1xuICBjYy52aWV3LmFkanVzdFZpZXdQb3J0KHRydWUpO1xuICBjYy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKDExMzYsIDY0MCwgY2MuUmVzb2x1dGlvblBvbGljeS5TSE9XX0FMTCk7XG4gIGNjLnZpZXcuZW5hYmxlQXV0b0Z1bGxTY3JlZW4oZmFsc2UpO1xuICBjYy52aWV3LnJlc2l6ZVdpdGhCcm93c2VyU2l6ZSh0cnVlKTtcbiAgY2MuQnVpbGRlclJlYWRlci5zZXRSZXNvdXJjZVBhdGgoXCJyZXMvXCIpO1xuICBzY2VuZU1hbmFnZXIgPSByZXF1aXJlKFwiLi90b29scy9BcmtTY2VuZU1hbmFnZXIuY29mZmVlXCIpO1xuICBzY2VuZU1hbmFnZXIuaW5pdCgpO1xuICBnYW1lRGlhbG9nID0gcmVxdWlyZSgnLi9jY2JWaWV3L0Fya01haW5EaWFsb2cuY29mZmVlJyk7XG4gIHNjZW5lTWFuYWdlci5hZGRMYXllclRvU2NlbmUoZ2FtZURpYWxvZyk7XG4gIEdhbWVMb2dpYyA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmtHYW1lTG9naWMuY29mZmVlJyk7XG4gIGdhbWVMb2dpY09iaiA9IG5ldyBHYW1lTG9naWMoKTtcbiAgcmV0dXJuIGdhbWVMb2dpY09iai5pbml0KCk7XG59O1xuXG5jYy5nYW1lLnJ1bigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiV0ZwYmk1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdlZYTmxjbk12ZEdGdmQzVXZjM1IxWkhrdlFYSnJZV1F2UVhKcllXUkhZVzFsTDNOeVl5OXRZV2x1TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVklzUjBGQmEwSXNVMEZCUVR0QlFVTmtMRTFCUVVFN1JVRkJRU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEdOQlFWSXNRMEZCZFVJc1NVRkJka0k3UlVGRFFTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMSFZDUVVGU0xFTkJRV2RETEVsQlFXaERMRVZCUVhORExFZEJRWFJETEVWQlFUSkRMRVZCUVVVc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4UlFVRXZSRHRGUVVOQkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNiMEpCUVZJc1EwRkJOa0lzUzBGQk4wSTdSVUZEUVN4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExIRkNRVUZTTEVOQlFUaENMRWxCUVRsQ08wVkJRMEVzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4bFFVRnFRaXhEUVVGcFF5eE5RVUZxUXp0RlFVVkJMRmxCUVVFc1IwRkJaU3hQUVVGQkxFTkJRVkVzWjBOQlFWSTdSVUZEWml4WlFVRlpMRU5CUVVNc1NVRkJZaXhEUVVGQk8wVkJSVUVzVlVGQlFTeEhRVUZoTEU5QlFVRXNRMEZCVVN4blEwRkJVanRGUVVOaUxGbEJRVmtzUTBGQlF5eGxRVUZpTEVOQlFUWkNMRlZCUVRkQ08wVkJSVUVzVTBGQlFTeEhRVUZaTEU5QlFVRXNRMEZCVVN3clFrRkJVanRGUVVOYUxGbEJRVUVzUjBGQlpTeEpRVUZKTEZOQlFVb3NRMEZCUVR0VFFVTm1MRmxCUVZrc1EwRkJReXhKUVVGaUxFTkJRVUU3UVVGbVl6czdRVUZyUW14Q0xFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCVWl4RFFVRkJJbjA9XG4iLCJ2YXIgVXNlckRhdGE7XG5cblVzZXJEYXRhID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBVc2VyRGF0YSgpIHtcbiAgICB0aGlzLl9zY29yZSA9IDA7XG4gICAgdGhpcy5fY291bnQgPSAwO1xuICB9XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLnNldFNjb3JlID0gZnVuY3Rpb24oX3Njb3JlKSB7XG4gICAgdGhpcy5fc2NvcmUgPSBfc2NvcmU7XG4gIH07XG5cbiAgVXNlckRhdGEucHJvdG90eXBlLmdldFNjb3JlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlO1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5zZXRDb3VudCA9IGZ1bmN0aW9uKF9jb3VudCkge1xuICAgIHRoaXMuX2NvdW50ID0gX2NvdW50O1xuICB9O1xuXG4gIFVzZXJEYXRhLnByb3RvdHlwZS5nZXRDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudDtcbiAgfTtcblxuICByZXR1cm4gVXNlckRhdGE7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckRhdGE7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UVhKclZYTmxja1JoZEdFdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZiVzlrWld3dlFYSnJWWE5sY2tSaGRHRXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVFN08wRkJRVTA3UlVGRFZ5eHJRa0ZCUVR0SlFVTlVMRWxCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVlU3U1VGRFZpeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlZPMFZCUmtRN08zRkNRVWxpTEZGQlFVRXNSMEZCVlN4VFFVRkRMRTFCUVVRN1NVRkJReXhKUVVGRExFTkJRVUVzVTBGQlJEdEZRVUZFT3p0eFFrRkZWaXhSUVVGQkxFZEJRVlVzVTBGQlFUdFhRVUZITEVsQlFVTXNRMEZCUVR0RlFVRktPenR4UWtGRlZpeFJRVUZCTEVkQlFWVXNVMEZCUXl4TlFVRkVPMGxCUVVNc1NVRkJReXhEUVVGQkxGTkJRVVE3UlVGQlJEczdjVUpCUlZZc1VVRkJRU3hIUVVGVkxGTkJRVUU3VjBGQlJ5eEpRVUZETEVOQlFVRTdSVUZCU2pzN096czdPMEZCUldRc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlmUT09XG4iLCJ2YXIgQmFsYW5jZVNoZWV0LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cblRhYmxlQmFzZSA9IHJlcXVpcmUoXCIuL1RhYmxlQmFzZS5jb2ZmZWVcIik7XG5cbkJhbGFuY2VTaGVldCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChCYWxhbmNlU2hlZXQsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIEJhbGFuY2VTaGVldCgpIHtcbiAgICByZXR1cm4gQmFsYW5jZVNoZWV0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5nZXRGaWxlUGF0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInJlcy9cIiArIHRoaXMuX3N0b2NrVHlwZSArIFwiX2pzb24vemNmemJfXCIgKyB0aGlzLl9zdG9ja0NvZGUgKyBcIi5qc29uXCI7XG4gIH07XG5cbiAgQmFsYW5jZVNoZWV0LnByb3RvdHlwZS5nZXRDYXNoVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi6LSn5biB6LWE6YeRKOS4h+WFgylcIl0pO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0VG90YWxBc3NldHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi6LWE5Lqn5oC76K6hKOS4h+WFgylcIl0pO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0TmV0QXNzZXRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuW9kuWxnuS6juavjeWFrOWPuOiCoeS4nOadg+ebiuWQiOiuoSjkuIflhYMpXCJdKTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLl9nZXROb05lZWRDYWxjSXRlbXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW1wi6LWE5paZXCIsIFwi5oql5ZGK5pel5pyfXCJdO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0UmVjZWl2YWJsZVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuW6lOaUtui0puasvijkuIflhYMpXCJdKTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmR1bXBQZXJjZW50VGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXNzZXRzUGVyY2VudFRhYmxlLCBjZWxWYWx1ZSwgaSwgaW5kZXgsIGtleSwgbGVuLCBwZXJjZW50LCBwZXJjZW50VGFibGUsIHJlZiwgcmVmMSwgdG90YWxBc3NldHMsIHZhbHVlO1xuICAgIHRvdGFsQXNzZXRzID0gdGhpcy5nZXRUb3RhbEFzc2V0cygpO1xuICAgIGFzc2V0c1BlcmNlbnRUYWJsZSA9IFtdO1xuICAgIHJlZiA9IHRoaXMuX2RhdGE7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWx1ZSA9IHJlZltrZXldO1xuICAgICAgcGVyY2VudFRhYmxlID0gW2tleSArIFwiXFx0XFx0XFx0XFx0XFx0XCJdO1xuICAgICAgaWYgKHZhbHVlWzBdID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4T2YuY2FsbCh0aGlzLl9nZXROb05lZWRDYWxjSXRlbXMoKSwga2V5KSA+PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVmMSA9IHRoaXMuZ2V0VmFsdWUodmFsdWUpO1xuICAgICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgICAgY2VsVmFsdWUgPSByZWYxW2luZGV4XTtcbiAgICAgICAgcGVyY2VudCA9IGNlbFZhbHVlIC8gdG90YWxBc3NldHNbaW5kZXhdICogMTAwO1xuICAgICAgICBwZXJjZW50VGFibGUucHVzaChwZXJjZW50LnRvRml4ZWQoMikpO1xuICAgICAgICBwZXJjZW50VGFibGUucHVzaChcIlxcdFxcdFxcdFxcdFwiKTtcbiAgICAgIH1cbiAgICAgIHBlcmNlbnRUYWJsZS5wdXNoKFwiXFxuXCIpO1xuICAgICAgYXNzZXRzUGVyY2VudFRhYmxlLnB1c2gocGVyY2VudFRhYmxlKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXNzZXRzUGVyY2VudFRhYmxlLCBudWxsLCBcIlxcdFwiKSk7XG4gICAgcmV0dXJuIGFzc2V0c1BlcmNlbnRUYWJsZTtcbiAgfTtcblxuICBCYWxhbmNlU2hlZXQucHJvdG90eXBlLmdldEN1cnJlbnRSYXRpbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50QXNzZXRzLCBjdXJyZW50QXNzZXRzVGFibGUsIGN1cnJlbnREZWJ0c1RhYmxlLCBjdXJyZW50UmF0aW8sIGksIGluZGV4LCBsZW47XG4gICAgY3VycmVudEFzc2V0c1RhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5rWB5Yqo6LWE5Lqn5ZCI6K6hKOS4h+WFgylcIl0pO1xuICAgIGN1cnJlbnREZWJ0c1RhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5rWB5Yqo6LSf5YC65ZCI6K6hKOS4h+WFgylcIl0pO1xuICAgIGN1cnJlbnRSYXRpbyA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gY3VycmVudEFzc2V0c1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIGN1cnJlbnRBc3NldHMgPSBjdXJyZW50QXNzZXRzVGFibGVbaW5kZXhdO1xuICAgICAgY3VycmVudFJhdGlvLnB1c2goKGN1cnJlbnRBc3NldHMgLyBjdXJyZW50RGVidHNUYWJsZVtpbmRleF0pLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudFJhdGlvO1xuICB9O1xuXG4gIEJhbGFuY2VTaGVldC5wcm90b3R5cGUuZ2V0UXVpY2tSYXRpbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50QXNzZXRzLCBjdXJyZW50QXNzZXRzVGFibGUsIGN1cnJlbnREZWJ0c1RhYmxlLCBpLCBpbmRleCwgaW52ZW50b3J5VGFibGUsIGxlbiwgcXVpY2tSYXRpbztcbiAgICBjdXJyZW50QXNzZXRzVGFibGUgPSB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLmtYHliqjotYTkuqflkIjorqEo5LiH5YWDKVwiXSk7XG4gICAgY3VycmVudERlYnRzVGFibGUgPSB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLmtYHliqjotJ/lgLrlkIjorqEo5LiH5YWDKVwiXSk7XG4gICAgaW52ZW50b3J5VGFibGUgPSB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLlrZjotKco5LiH5YWDKVwiXSk7XG4gICAgcXVpY2tSYXRpbyA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gMCwgbGVuID0gY3VycmVudEFzc2V0c1RhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaW5kZXggPSArK2kpIHtcbiAgICAgIGN1cnJlbnRBc3NldHMgPSBjdXJyZW50QXNzZXRzVGFibGVbaW5kZXhdO1xuICAgICAgcXVpY2tSYXRpby5wdXNoKCgoY3VycmVudEFzc2V0cyAtIGludmVudG9yeVRhYmxlW2luZGV4XSkgLyBjdXJyZW50RGVidHNUYWJsZVtpbmRleF0pLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICByZXR1cm4gcXVpY2tSYXRpbztcbiAgfTtcblxuICByZXR1cm4gQmFsYW5jZVNoZWV0O1xuXG59KShUYWJsZUJhc2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGFuY2VTaGVldDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZRbUZzWVc1alpWTm9aV1YwTG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwyMXZaR1ZzTDBKaGJHRnVZMlZUYUdWbGRDNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4MVFrRkJRVHRGUVVGQk96czdPMEZCUVVFc1UwRkJRU3hIUVVGaExFOUJRVUVzUTBGQlVTeHZRa0ZCVWpzN1FVRkhVRHM3T3pzN096dDVRa0ZEVEN4WFFVRkJMRWRCUVZrc1UwRkJRVHRYUVVOWUxFMUJRVUVzUjBGQlR5eEpRVUZETEVOQlFVRXNWVUZCVWl4SFFVRnRRaXhqUVVGdVFpeEhRVUZwUXl4SlFVRkRMRU5CUVVFc1ZVRkJiRU1zUjBGQk5rTTdSVUZFYkVNN08zbENRVWRhTEZsQlFVRXNSMEZCWXl4VFFVRkJPMWRCUVVjc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRlZCUVVFc1EwRkJha0k3UlVGQlNEczdlVUpCUldRc1kwRkJRU3hIUVVGblFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZWQlFVRXNRMEZCYWtJN1JVRkJTRHM3ZVVKQlJXaENMRmxCUVVFc1IwRkJZeXhUUVVGQk8xZEJRVWNzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxHdENRVUZCTEVOQlFXcENPMFZCUVVnN08zbENRVVZrTEcxQ1FVRkJMRWRCUVhGQ0xGTkJRVUU3VjBGQlJ5eERRVUZETEVsQlFVUXNSVUZCVHl4TlFVRlFPMFZCUVVnN08zbENRVVZ5UWl4clFrRkJRU3hIUVVGdlFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZWQlFVRXNRMEZCYWtJN1JVRkJTRHM3ZVVKQlJYQkNMR2RDUVVGQkxFZEJRV3RDTEZOQlFVRTdRVUZEYWtJc1VVRkJRVHRKUVVGQkxGZEJRVUVzUjBGQll5eEpRVUZETEVOQlFVRXNZMEZCUkN4RFFVRkJPMGxCUTJRc2EwSkJRVUVzUjBGQmNVSTdRVUZEY2tJN1FVRkJRU3hUUVVGQkxGVkJRVUU3TzAxQlEwTXNXVUZCUVN4SFFVRmxMRU5CUVVNc1IwRkJRU3hIUVVGTkxGbEJRVkE3VFVGRFppeEpRVUZaTEV0QlFVMHNRMEZCUVN4RFFVRkJMRU5CUVU0c1MwRkJXU3hEUVVGNFFqdEJRVUZCTEdsQ1FVRkJPenROUVVOQkxFbEJRVmtzWVVGQlR5eEpRVUZETEVOQlFVRXNiVUpCUVVRc1EwRkJRU3hEUVVGUUxFVkJRVUVzUjBGQlFTeE5RVUZhTzBGQlFVRXNhVUpCUVVFN08wRkJRMEU3UVVGQlFTeFhRVUZCTEhORVFVRkJPenRSUVVORExFOUJRVUVzUjBGQlZTeFJRVUZCTEVkQlFWY3NWMEZCV1N4RFFVRkJMRXRCUVVFc1EwRkJka0lzUjBGQlowTTdVVUZETVVNc1dVRkJXU3hEUVVGRExFbEJRV0lzUTBGQmEwSXNUMEZCVHl4RFFVRkRMRTlCUVZJc1EwRkJaMElzUTBGQmFFSXNRMEZCYkVJN1VVRkRRU3haUVVGWkxFTkJRVU1zU1VGQllpeERRVUZyUWl4VlFVRnNRanRCUVVoRU8wMUJTVUVzV1VGQldTeERRVUZETEVsQlFXSXNRMEZCYTBJc1NVRkJiRUk3VFVGRFFTeHJRa0ZCYTBJc1EwRkJReXhKUVVGdVFpeERRVUYzUWl4WlFVRjRRanRCUVZSRU8wbEJWVUVzVDBGQlR5eERRVUZETEVkQlFWSXNRMEZCV1N4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExHdENRVUZtTEVWQlFXMURMRWxCUVc1RExFVkJRWGxETEVsQlFYcERMRU5CUVZvN1FVRkRRU3hYUVVGUE8wVkJaRlU3TzNsQ1FXZENiRUlzWlVGQlFTeEhRVUZwUWl4VFFVRkJPMEZCUTJoQ0xGRkJRVUU3U1VGQlFTeHJRa0ZCUVN4SFFVRnhRaXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1dVRkJRU3hEUVVGcVFqdEpRVU55UWl4cFFrRkJRU3hIUVVGdlFpeEpRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRWxCUVVNc1EwRkJRU3hMUVVGTkxFTkJRVUVzV1VGQlFTeERRVUZxUWp0SlFVTndRaXhaUVVGQkxFZEJRV1U3UVVGRFppeFRRVUZCTEc5RlFVRkJPenROUVVORExGbEJRVmtzUTBGQlF5eEpRVUZpTEVOQlFXdENMRU5CUVVNc1lVRkJRU3hIUVVGblFpeHBRa0ZCYTBJc1EwRkJRU3hMUVVGQkxFTkJRVzVETEVOQlFUQkRMRU5CUVVNc1QwRkJNME1zUTBGQmJVUXNRMEZCYmtRc1EwRkJiRUk3UVVGRVJEdFhRVVZCTzBWQlRtZENPenQ1UWtGUmFrSXNZVUZCUVN4SFFVRmxMRk5CUVVFN1FVRkRaQ3hSUVVGQk8wbEJRVUVzYTBKQlFVRXNSMEZCY1VJc1NVRkJReXhEUVVGQkxGRkJRVVFzUTBGQlZTeEpRVUZETEVOQlFVRXNTMEZCVFN4RFFVRkJMRmxCUVVFc1EwRkJha0k3U1VGRGNrSXNhVUpCUVVFc1IwRkJiMElzU1VGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxGbEJRVUVzUTBGQmFrSTdTVUZEY0VJc1kwRkJRU3hIUVVGcFFpeEpRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRWxCUVVNc1EwRkJRU3hMUVVGTkxFTkJRVUVzVVVGQlFTeERRVUZxUWp0SlFVTnFRaXhWUVVGQkxFZEJRV0U3UVVGRFlpeFRRVUZCTEc5RlFVRkJPenROUVVORExGVkJRVlVzUTBGQlF5eEpRVUZZTEVOQlFXZENMRU5CUVVNc1EwRkJReXhoUVVGQkxFZEJRV2RDTEdOQlFXVXNRMEZCUVN4TFFVRkJMRU5CUVdoRExFTkJRVUVzUjBGQk1FTXNhVUpCUVd0Q0xFTkJRVUVzUzBGQlFTeERRVUUzUkN4RFFVRnZSU3hEUVVGRExFOUJRWEpGTEVOQlFUWkZMRU5CUVRkRkxFTkJRV2hDTzBGQlJFUTdWMEZGUVR0RlFWQmpPenM3TzBkQmRFTlhPenRCUVN0RE0wSXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIENhc2hGbG93U3RhdGVtZW50LCBUYWJsZUJhc2UsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5UYWJsZUJhc2UgPSByZXF1aXJlKFwiLi9UYWJsZUJhc2UuY29mZmVlXCIpO1xuXG5DYXNoRmxvd1N0YXRlbWVudCA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChDYXNoRmxvd1N0YXRlbWVudCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gQ2FzaEZsb3dTdGF0ZW1lbnQoKSB7XG4gICAgcmV0dXJuIENhc2hGbG93U3RhdGVtZW50Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgQ2FzaEZsb3dTdGF0ZW1lbnQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi94amxsYl9cIiArIHRoaXMuX3N0b2NrQ29kZSArIFwiLmpzb25cIjtcbiAgfTtcblxuICByZXR1cm4gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbn0pKFRhYmxlQmFzZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzaEZsb3dTdGF0ZW1lbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2UTJGemFFWnNiM2RUZEdGMFpXMWxiblF1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRXNORUpCUVVFN1JVRkJRVHM3TzBGQlFVRXNVMEZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3h2UWtGQlVqczdRVUZGVURzN096czdPenM0UWtGRlRDeFhRVUZCTEVkQlFXRXNVMEZCUVR0WFFVTmFMRTFCUVVFc1IwRkJUeXhKUVVGRExFTkJRVUVzVlVGQlVpeEhRVUZ0UWl4alFVRnVRaXhIUVVGcFF5eEpRVUZETEVOQlFVRXNWVUZCYkVNc1IwRkJOa003UlVGRWFrTTdPenM3UjBGR2EwSTdPMEZCUzJoRExFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJbjA9XG4iLCJ2YXIgUHJvZml0U3RhdGVtZW50LCBUYWJsZUJhc2UsIHV0aWxzLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuVGFibGVCYXNlID0gcmVxdWlyZShcIi4vVGFibGVCYXNlLmNvZmZlZVwiKTtcblxudXRpbHMgPSByZXF1aXJlKCcuLi90b29scy91dGlscy5jb2ZmZWUnKTtcblxuUHJvZml0U3RhdGVtZW50ID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFByb2ZpdFN0YXRlbWVudCwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUHJvZml0U3RhdGVtZW50KCkge1xuICAgIHJldHVybiBQcm9maXRTdGF0ZW1lbnQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBQcm9maXRTdGF0ZW1lbnQucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwicmVzL1wiICsgdGhpcy5fc3RvY2tUeXBlICsgXCJfanNvbi9scmJfXCIgKyB0aGlzLl9zdG9ja0NvZGUgKyBcIi5qc29uXCI7XG4gIH07XG5cbiAgUHJvZml0U3RhdGVtZW50LnByb3RvdHlwZS5nZXRJbmNvbWVWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKHRoaXMuX2RhdGFbXCLokKXkuJrmlLblhaUo5LiH5YWDKVwiXSk7XG4gIH07XG5cbiAgUHJvZml0U3RhdGVtZW50LnByb3RvdHlwZS5nZXROZXRQcm9maXRBZGRSYXRpbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZGRSYXRpbywgYWRkVGltZXMsIG5ldFByb2ZpdFRhYmxlO1xuICAgIG5ldFByb2ZpdFRhYmxlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLl9kYXRhW1wi5YeA5Yip5ramKOS4h+WFgylcIl0pO1xuICAgIGFkZFRpbWVzID0gbmV0UHJvZml0VGFibGVbMF0gLyBuZXRQcm9maXRUYWJsZVtuZXRQcm9maXRUYWJsZS5sZW5ndGggLSAxXTtcbiAgICBhZGRSYXRpbyA9IHV0aWxzLmdldENvbXBvdW5kUmF0ZShhZGRUaW1lcywgZ2xvYmFsLnllYXIpO1xuICAgIGFkZFJhdGlvID0gKChhZGRSYXRpbyAtIDEpICogMTAwKS50b0ZpeGVkKDIpO1xuICAgIHJldHVybiBhZGRSYXRpbztcbiAgfTtcblxuICBQcm9maXRTdGF0ZW1lbnQucHJvdG90eXBlLmdldE5ldFByb2ZpdFRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuWHgOWIqea2pijkuIflhYMpXCJdKTtcbiAgfTtcblxuICBQcm9maXRTdGF0ZW1lbnQucHJvdG90eXBlLmdldFBFID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIFBFLCBlYXJuUGVyU2hhcmUsIHByaWNlO1xuICAgIGVhcm5QZXJTaGFyZSA9IHRoaXMuZ2V0VmFsdWUodGhpcy5fZGF0YVtcIuWfuuacrOavj+iCoeaUtuebilwiXSwgdHJ1ZSlbMF07XG4gICAgcHJpY2UgPSB0aGlzLmdldFNoYXJlUHJpY2UoKTtcbiAgICBQRSA9IChwcmljZSAvIGVhcm5QZXJTaGFyZSkudG9GaXhlZCgyKTtcbiAgICByZXR1cm4gUEU7XG4gIH07XG5cbiAgcmV0dXJuIFByb2ZpdFN0YXRlbWVudDtcblxufSkoVGFibGVCYXNlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9maXRTdGF0ZW1lbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDFWelpYSnpMM1JoYjNkMUwzTjBkV1I1TDBGeWEyRmtMMEZ5YTJGa1IyRnRaUzl6Y21NdmJXOWtaV3d2VUhKdlptbDBVM1JoZEdWdFpXNTBMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDIxdlpHVnNMMUJ5YjJacGRGTjBZWFJsYldWdWRDNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNTVUZCUVN4cFEwRkJRVHRGUVVGQk96czdRVUZCUVN4VFFVRkJMRWRCUVdFc1QwRkJRU3hEUVVGUkxHOUNRVUZTT3p0QlFVTmlMRXRCUVVFc1IwRkJWU3hQUVVGQkxFTkJRVkVzZFVKQlFWSTdPMEZCUlVvN096czdPenM3TkVKQlEwd3NWMEZCUVN4SFFVRmhMRk5CUVVFN1YwRkRXaXhOUVVGQkxFZEJRVThzU1VGQlF5eERRVUZCTEZWQlFWSXNSMEZCYlVJc1dVRkJia0lzUjBGQkswSXNTVUZCUXl4RFFVRkJMRlZCUVdoRExFZEJRVEpETzBWQlJDOUNPenMwUWtGSFlpeGpRVUZCTEVkQlFXZENMRk5CUVVFN1YwRkJSeXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1ZVRkJRU3hEUVVGcVFqdEZRVUZJT3pzMFFrRkZhRUlzYjBKQlFVRXNSMEZCYzBJc1UwRkJRVHRCUVVOeVFpeFJRVUZCTzBsQlFVRXNZMEZCUVN4SFFVRnBRaXhKUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEVsQlFVTXNRMEZCUVN4TFFVRk5MRU5CUVVFc1UwRkJRU3hEUVVGcVFqdEpRVU5xUWl4UlFVRkJMRWRCUVZjc1kwRkJaU3hEUVVGQkxFTkJRVUVzUTBGQlppeEhRVUZ2UWl4alFVRmxMRU5CUVVFc1kwRkJZeXhEUVVGRExFMUJRV1lzUjBGQmQwSXNRMEZCZUVJN1NVRkRPVU1zVVVGQlFTeEhRVUZYTEV0QlFVc3NRMEZCUXl4bFFVRk9MRU5CUVhOQ0xGRkJRWFJDTEVWQlFXZERMRTFCUVUwc1EwRkJReXhKUVVGMlF6dEpRVU5ZTEZGQlFVRXNSMEZCVnl4RFFVRkRMRU5CUVVNc1VVRkJRU3hIUVVGWExFTkJRVm9zUTBGQlFTeEhRVUZwUWl4SFFVRnNRaXhEUVVGelFpeERRVUZETEU5QlFYWkNMRU5CUVN0Q0xFTkJRUzlDTzFkQlExZzdSVUZNY1VJN096UkNRVTkwUWl4cFFrRkJRU3hIUVVGdlFpeFRRVUZCTzFkQlFVY3NTVUZCUXl4RFFVRkJMRkZCUVVRc1EwRkJWU3hKUVVGRExFTkJRVUVzUzBGQlRTeERRVUZCTEZOQlFVRXNRMEZCYWtJN1JVRkJTRHM3TkVKQlJYQkNMRXRCUVVFc1IwRkJUeXhUUVVGQk8wRkJRMDRzVVVGQlFUdEpRVUZCTEZsQlFVRXNSMEZCWlN4SlFVRkRMRU5CUVVFc1VVRkJSQ3hEUVVGVkxFbEJRVU1zUTBGQlFTeExRVUZOTEVOQlFVRXNVVUZCUVN4RFFVRnFRaXhGUVVFMFFpeEpRVUUxUWl4RFFVRnJReXhEUVVGQkxFTkJRVUU3U1VGRGFrUXNTMEZCUVN4SFFVRlJMRWxCUVVNc1EwRkJRU3hoUVVGRUxFTkJRVUU3U1VGRFVpeEZRVUZCTEVkQlFVc3NRMEZCUXl4TFFVRkJMRWRCUVZFc1dVRkJWQ3hEUVVGelFpeERRVUZETEU5QlFYWkNMRU5CUVN0Q0xFTkJRUzlDTzFkQlEwdzdSVUZLVFRzN096dEhRV1p6UWpzN1FVRnpRamxDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBUYWJsZUJhc2U7XG5cblRhYmxlQmFzZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGFibGVCYXNlKF9zdG9ja1R5cGUsIF9zdG9ja0NvZGUpIHtcbiAgICB0aGlzLl9zdG9ja1R5cGUgPSBfc3RvY2tUeXBlO1xuICAgIHRoaXMuX3N0b2NrQ29kZSA9IF9zdG9ja0NvZGU7XG4gICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIHRoaXMuX2xvYWRKc29uKCk7XG4gIH1cblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldEZpbGVQYXRoID0gZnVuY3Rpb24oKSB7fTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldFN0b2NrQ29kZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zdG9ja0NvZGU7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fbG9hZEpzb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsZVBhdGg7XG4gICAgZmlsZVBhdGggPSB0aGlzLmdldEZpbGVQYXRoKCk7XG4gICAgcmV0dXJuIGNjLmxvYWRlci5sb2FkSnNvbihmaWxlUGF0aCwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0QmFzZUluZm8gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVtcIui1hOaWmVwiXVswXSArIFwiLS0tLS0tXCIgKyB0aGlzLl9kYXRhW1wi6LWE5paZXCJdWzJdO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuZ2V0U2hhcmVQcmljZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhW1wi6LWE5paZXCJdWzFdO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2dldFNob3dOdW1iZXIgPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgICByZXR1cm4gKChudW1iZXIgLyAxMDAwMDApLnRvRml4ZWQoMikpICsgXCIg5Lq/XCI7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5nZXRGb3JtYXROdW1iZXJUYWJsZSA9IGZ1bmN0aW9uKG51bWJlclRhYmxlKSB7XG4gICAgdmFyIGZvcm1hdFRhYmxlLCBpLCBsZW4sIG51bWJlcjtcbiAgICBmb3JtYXRUYWJsZSA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IG51bWJlclRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXJUYWJsZVtpXTtcbiAgICAgIGZvcm1hdFRhYmxlLnB1c2godGhpcy5fZ2V0U2hvd051bWJlcihudW1iZXIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdFRhYmxlO1xuICB9O1xuXG4gIFRhYmxlQmFzZS5wcm90b3R5cGUuX2dldFllYXJWYWx1ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGluZGV4LCBpbmRleFRhYmxlLCBsZW4sIHJlZiwgdGltZVN0cjtcbiAgICBpbmRleFRhYmxlID0gW107XG4gICAgcmVmID0gdGhpcy5fZGF0YVtcIuaKpeWRiuaXpeacn1wiXTtcbiAgICBmb3IgKGluZGV4ID0gaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGluZGV4ID0gKytpKSB7XG4gICAgICB0aW1lU3RyID0gcmVmW2luZGV4XTtcbiAgICAgIGlmICh0aW1lU3RyLmluZGV4T2YoXCIxMi0zMVwiKSAhPT0gLTEpIHtcbiAgICAgICAgaW5kZXhUYWJsZS5wdXNoKGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4VGFibGU7XG4gIH07XG5cbiAgVGFibGVCYXNlLnByb3RvdHlwZS5fZ2V0VmFsdWVMZW5ndGggPSBmdW5jdGlvbih2YWx1ZUxlbmd0aCkge1xuICAgIHZhciBsZW5ndGg7XG4gICAgaWYgKHZhbHVlTGVuZ3RoIDwgZ2xvYmFsLnllYXIpIHtcbiAgICAgIGxlbmd0aCA9IHZhbHVlTGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSBnbG9iYWwueWVhcjtcbiAgICB9XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLl9mb3JtYXRUb0ludCA9IGZ1bmN0aW9uKHZhbHVlVGFibGUpIHtcbiAgICB2YXIgaSwgaW50VGFibGUsIGxlbiwgdmFsdWU7XG4gICAgaW50VGFibGUgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSB2YWx1ZVRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlVGFibGVbaV07XG4gICAgICBpbnRUYWJsZS5wdXNoKHBhcnNlSW50KHZhbHVlKSk7XG4gICAgfVxuICAgIHJldHVybiBpbnRUYWJsZTtcbiAgfTtcblxuICBUYWJsZUJhc2UucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oZGF0YSwgZG9Ob3RUb0ludCkge1xuICAgIHZhciBpLCBpbmRleCwgbGVuLCB2YWx1ZVRhYmxlLCB5ZWFySW5kZXhUYWJsZTtcbiAgICB5ZWFySW5kZXhUYWJsZSA9IHRoaXMuX2dldFllYXJWYWx1ZUluZGV4KCk7XG4gICAgdmFsdWVUYWJsZSA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHllYXJJbmRleFRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpbmRleCA9IHllYXJJbmRleFRhYmxlW2ldO1xuICAgICAgdmFsdWVUYWJsZS5wdXNoKGRhdGFbaW5kZXhdKTtcbiAgICB9XG4gICAgdmFsdWVUYWJsZSA9IHZhbHVlVGFibGUuc2xpY2UoMCwgdGhpcy5fZ2V0VmFsdWVMZW5ndGgodmFsdWVUYWJsZS5sZW5ndGgpKTtcbiAgICBpZiAoZG9Ob3RUb0ludCkge1xuICAgICAgcmV0dXJuIHZhbHVlVGFibGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9mb3JtYXRUb0ludCh2YWx1ZVRhYmxlKTtcbiAgfTtcblxuICByZXR1cm4gVGFibGVCYXNlO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQmFzZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12Ylc5a1pXd3ZWR0ZpYkdWQ1lYTmxMbU52Wm1abFpTSXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OTBZVzkzZFM5emRIVmtlUzlCY210aFpDOUJjbXRoWkVkaGJXVXZjM0pqTDIxdlpHVnNMMVJoWW14bFFtRnpaUzVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCVFR0RlFVTlJMRzFDUVVGRExGVkJRVVFzUlVGQll5eFZRVUZrTzBsQlFVTXNTVUZCUXl4RFFVRkJMR0ZCUVVRN1NVRkJZU3hKUVVGRExFTkJRVUVzWVVGQlJEdEpRVU14UWl4SlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGVE8wbEJRMVFzU1VGQlF5eERRVUZCTEZOQlFVUXNRMEZCUVR0RlFVWlpPenR6UWtGSllpeFhRVUZCTEVkQlFXRXNVMEZCUVN4SFFVRkJPenR6UWtGRllpeFpRVUZCTEVkQlFXTXNVMEZCUVR0WFFVRkhMRWxCUVVNc1EwRkJRVHRGUVVGS096dHpRa0ZGWkN4VFFVRkJMRWRCUVZjc1UwRkJRVHRCUVVOV0xGRkJRVUU3U1VGQlFTeFJRVUZCTEVkQlFWY3NTVUZCUXl4RFFVRkJMRmRCUVVRc1EwRkJRVHRYUVVOWUxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhSUVVGdVFpeEZRVUUyUWl4RFFVRkJMRk5CUVVFc1MwRkJRVHRoUVVGQkxGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdaVUZETlVJc1MwRkJReXhEUVVGQkxFdEJRVVFzUjBGQlV6dE5RVVJ0UWp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUVzUTBGQk4wSTdSVUZHVlRzN2MwSkJTMWdzVjBGQlFTeEhRVUZoTEZOQlFVRTdWMEZCUnl4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxFbEJRVUVzUTBGQlRTeERRVUZCTEVOQlFVRXNRMEZCWWl4SFFVRnJRaXhSUVVGc1FpeEhRVUUyUWl4SlFVRkRMRU5CUVVFc1MwRkJUU3hEUVVGQkxFbEJRVUVzUTBGQlRTeERRVUZCTEVOQlFVRTdSVUZCTjBNN08zTkNRVVZpTEdGQlFVRXNSMEZCWlN4VFFVRkJPMWRCUVVjc1NVRkJReXhEUVVGQkxFdEJRVTBzUTBGQlFTeEpRVUZCTEVOQlFVMHNRMEZCUVN4RFFVRkJPMFZCUVdoQ096dHpRa0ZGWml4alFVRkJMRWRCUVdsQ0xGTkJRVU1zVFVGQlJEdEJRVU5vUWl4WFFVRlRMRU5CUVVNc1EwRkJReXhOUVVGQkxFZEJRVk1zVFVGQlZpeERRVUZwUWl4RFFVRkRMRTlCUVd4Q0xFTkJRVEJDTEVOQlFURkNMRU5CUVVRc1EwRkJRU3hIUVVFNFFqdEZRVVIyUWpzN2MwSkJSMnBDTEc5Q1FVRkJMRWRCUVhOQ0xGTkJRVU1zVjBGQlJEdEJRVU55UWl4UlFVRkJPMGxCUVVFc1YwRkJRU3hIUVVGak8wRkJRMlFzVTBGQlFTdzJRMEZCUVRzN1RVRkRReXhYUVVGWExFTkJRVU1zU1VGQldpeERRVUZwUWl4SlFVRkRMRU5CUVVFc1kwRkJSQ3hEUVVGblFpeE5RVUZvUWl4RFFVRnFRanRCUVVSRU8wRkJSVUVzVjBGQlR6dEZRVXBqT3p0elFrRk5kRUlzYTBKQlFVRXNSMEZCYjBJc1UwRkJRVHRCUVVOdVFpeFJRVUZCTzBsQlFVRXNWVUZCUVN4SFFVRmhPMEZCUTJJN1FVRkJRU3hUUVVGQkxIRkVRVUZCT3p0TlFVTkRMRWxCUVVjc1QwRkJUeXhEUVVGRExFOUJRVklzUTBGQlowSXNUMEZCYUVJc1EwRkJRU3hMUVVFNFFpeERRVUZETEVOQlFXeERPMUZCUTBNc1ZVRkJWU3hEUVVGRExFbEJRVmdzUTBGQlowSXNTMEZCYUVJc1JVRkVSRHM3UVVGRVJEdEJRVWRCTEZkQlFVODdSVUZNV1RzN2MwSkJUM0JDTEdWQlFVRXNSMEZCYVVJc1UwRkJReXhYUVVGRU8wRkJRMmhDTEZGQlFVRTdTVUZCUVN4SlFVRkhMRmRCUVVFc1IwRkJZeXhOUVVGTkxFTkJRVU1zU1VGQmVFSTdUVUZEUXl4TlFVRkJMRWRCUVZNc1dVRkVWanRMUVVGQkxFMUJRVUU3VFVGSFF5eE5RVUZCTEVkQlFWTXNUVUZCVFN4RFFVRkRMRXRCU0dwQ096dFhRVWxCTzBWQlRHZENPenR6UWtGUGFrSXNXVUZCUVN4SFFVRmpMRk5CUVVNc1ZVRkJSRHRCUVVOaUxGRkJRVUU3U1VGQlFTeFJRVUZCTEVkQlFWYzdRVUZEV0N4VFFVRkJMRFJEUVVGQk96dE5RVU5ETEZGQlFWRXNRMEZCUXl4SlFVRlVMRU5CUVdNc1VVRkJRU3hEUVVGVExFdEJRVlFzUTBGQlpEdEJRVVJFTzBGQlJVRXNWMEZCVHp0RlFVcE5PenR6UWtGTlpDeFJRVUZCTEVkQlFWVXNVMEZCUXl4SlFVRkVMRVZCUVU4c1ZVRkJVRHRCUVVOVUxGRkJRVUU3U1VGQlFTeGpRVUZCTEVkQlFXbENMRWxCUVVNc1EwRkJRU3hyUWtGQlJDeERRVUZCTzBsQlEycENMRlZCUVVFc1IwRkJZVHRCUVVOaUxGTkJRVUVzWjBSQlFVRTdPMDFCUTBNc1ZVRkJWU3hEUVVGRExFbEJRVmdzUTBGQlowSXNTVUZCU3l4RFFVRkJMRXRCUVVFc1EwRkJja0k3UVVGRVJEdEpRVWRCTEZWQlFVRXNSMEZCWVN4VlFVRlZMRU5CUVVNc1MwRkJXQ3hEUVVGcFFpeERRVUZxUWl4RlFVRnZRaXhKUVVGRExFTkJRVUVzWlVGQlJDeERRVUZwUWl4VlFVRlZMRU5CUVVNc1RVRkJOVUlzUTBGQmNFSTdTVUZEWWl4SlFVRkhMRlZCUVVnN1FVRkRReXhoUVVGUExGZEJSRkk3TzBGQlJVRXNWMEZCVHl4SlFVRkRMRU5CUVVFc1dVRkJSQ3hEUVVGakxGVkJRV1E3UlVGVVJUczdPenM3TzBGQlYxZ3NUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpZlE9PVxuIiwidmFyIExheWVyTWFuYWdlciwgTG9hZGVyO1xuXG5MYXllck1hbmFnZXIgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGF5ZXJTdGFjayA9IFtdO1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgY2MuU2NlbmUoKTtcbiAgICByZXR1cm4gY2MuZGlyZWN0b3IucnVuU2NlbmUodGhpcy5zY2VuZSk7XG4gIH0sXG4gIGNsZWFyTGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICByZXR1cm4gdGhpcy5sYXllclN0YWNrLmxlbmd0aCA9IDA7XG4gIH0sXG4gIGFkZExheWVyVG9TY2VuZTogZnVuY3Rpb24oY2NiTGF5ZXIsIHpPcmRlcikge1xuICAgIHZhciBsYXlvdXQsIG5vZGU7XG4gICAgaWYgKHpPcmRlciA9PSBudWxsKSB7XG4gICAgICB6T3JkZXIgPSAwO1xuICAgIH1cbiAgICBsYXlvdXQgPSBuZXcgY2N1aS5MYXlvdXQoKTtcbiAgICBsYXlvdXQuc2V0Q29udGVudFNpemUoY2Muc2l6ZSgxMTM2LCA2NDApKTtcbiAgICBsYXlvdXQuc2V0VG91Y2hFbmFibGVkKHRydWUpO1xuICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuICAgIG5vZGUuYWRkQ2hpbGQobGF5b3V0KTtcbiAgICBub2RlLmFkZENoaWxkKGNjYkxheWVyKTtcbiAgICB0aGlzLnNjZW5lLmFkZENoaWxkKG5vZGUsIHpPcmRlcik7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTdGFjay5wdXNoKG5vZGUpO1xuICB9LFxuICByZW1vdmVUb3BMYXllcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRvcExheWVyO1xuICAgIHRvcExheWVyID0gdGhpcy5sYXllclN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0aGlzLnNjZW5lLnJlbW92ZUNoaWxkKHRvcExheWVyLCB0cnVlKTtcbiAgfVxufTtcblxuTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMb2FkZXIoY2NiRmlsZTEsIGNvbnRyb2xsZXJOYW1lMSkge1xuICAgIHRoaXMuY2NiRmlsZSA9IGNjYkZpbGUxO1xuICAgIHRoaXMuY29udHJvbGxlck5hbWUgPSBjb250cm9sbGVyTmFtZTE7XG4gIH1cblxuICBMb2FkZXIucHJvdG90eXBlLnNob3dEaWFsb2cgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2MuQnVpbGRlclJlYWRlci5sb2FkKHRoaXMuY2NiRmlsZSk7XG4gIH07XG5cbiAgcmV0dXJuIExvYWRlcjtcblxufSkoKTtcblxuTGF5ZXJNYW5hZ2VyLmRlZmluZURpYWxvZyA9IGZ1bmN0aW9uKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lLCBjb250cm9sbGVyQ2xhc3MpIHtcbiAgY2MuQnVpbGRlclJlYWRlci5yZWdpc3RlckNvbnRyb2xsZXIoY29udHJvbGxlck5hbWUsIG5ldyBjb250cm9sbGVyQ2xhc3MoKSk7XG4gIHJldHVybiBuZXcgTG9hZGVyKGNjYkZpbGUsIGNvbnRyb2xsZXJOYW1lKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5ZXJNYW5hZ2VyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdlFYSnJVMk5sYm1WTllXNWhaMlZ5TG1OdlptWmxaU0lzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTkwWVc5M2RTOXpkSFZrZVM5QmNtdGhaQzlCY210aFpFZGhiV1V2YzNKakwzUnZiMnh6TDBGeWExTmpaVzVsVFdGdVlXZGxjaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEVzU1VGQlFUczdRVUZCUVN4WlFVRkJMRWRCUTBrN1JVRkJRU3hKUVVGQkxFVkJRVTBzVTBGQlFUdEpRVU5HTEVsQlFVTXNRMEZCUVN4VlFVRkVMRWRCUVdNN1NVRkRaQ3hKUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZUTEVsQlFVa3NSVUZCUlN4RFFVRkRMRXRCUVZBc1EwRkJRVHRYUVVOVUxFVkJRVVVzUTBGQlF5eFJRVUZSTEVOQlFVTXNVVUZCV2l4RFFVRnhRaXhKUVVGRExFTkJRVUVzUzBGQmRFSTdSVUZJUlN4RFFVRk9PMFZCUzBFc1ZVRkJRU3hGUVVGWkxGTkJRVUU3U1VGRFVpeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMR2xDUVVGUUxFTkJRVUU3VjBGRFFTeEpRVUZETEVOQlFVRXNWVUZCVlN4RFFVRkRMRTFCUVZvc1IwRkJjVUk3UlVGR1lpeERRVXhhTzBWQlUwRXNaVUZCUVN4RlFVRnJRaXhUUVVGRExGRkJRVVFzUlVGQlZ5eE5RVUZZTzBGQlEyUXNVVUZCUVRzN1RVRkVlVUlzVTBGQlV6czdTVUZEYkVNc1RVRkJRU3hIUVVGVExFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFWUXNRMEZCUVR0SlFVTlVMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1NVRkJVaXhGUVVGakxFZEJRV1FzUTBGQmRFSTdTVUZEUVN4TlFVRk5MRU5CUVVNc1pVRkJVQ3hEUVVGMVFpeEpRVUYyUWp0SlFVVkJMRWxCUVVFc1IwRkJUU3hKUVVGSkxFVkJRVVVzUTBGQlF5eEpRVUZRTEVOQlFVRTdTVUZEVGl4SlFVRkpMRU5CUVVNc1VVRkJUQ3hEUVVGakxFMUJRV1E3U1VGRFFTeEpRVUZKTEVOQlFVTXNVVUZCVEN4RFFVRmpMRkZCUVdRN1NVRkZRU3hKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEZGQlFWQXNRMEZCWjBJc1NVRkJhRUlzUlVGQmMwSXNUVUZCZEVJN1YwRkRRU3hKUVVGRExFTkJRVUVzVlVGQlZTeERRVUZETEVsQlFWb3NRMEZCYVVJc1NVRkJha0k3UlVGV1l5eERRVlJzUWp0RlFYRkNRU3hqUVVGQkxFVkJRV2RDTEZOQlFVRTdRVUZEV2l4UlFVRkJPMGxCUVVFc1VVRkJRU3hIUVVGWExFbEJRVU1zUTBGQlFTeFZRVUZWTEVOQlFVTXNSMEZCV2l4RFFVRkJPMWRCUTFnc1NVRkJReXhEUVVGQkxFdEJRVXNzUTBGQlF5eFhRVUZRTEVOQlFXMUNMRkZCUVc1Q0xFVkJRVFpDTEVsQlFUZENPMFZCUmxrc1EwRnlRbWhDT3pzN1FVRjVRa1U3UlVGRFZ5eG5Ra0ZCUXl4UlFVRkVMRVZCUVZjc1pVRkJXRHRKUVVGRExFbEJRVU1zUTBGQlFTeFZRVUZFTzBsQlFWVXNTVUZCUXl4RFFVRkJMR2xDUVVGRU8wVkJRVmc3TzIxQ1FVTmlMRlZCUVVFc1IwRkJZU3hUUVVGQk8xZEJRMVFzUlVGQlJTeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRnFRaXhEUVVGelFpeEpRVUZETEVOQlFVRXNUMEZCZGtJN1JVRkVVenM3T3pzN08wRkJSMnBDTEZsQlFWa3NRMEZCUXl4WlFVRmlMRWRCUVRSQ0xGTkJRVU1zVDBGQlJDeEZRVUZWTEdOQlFWWXNSVUZCTUVJc1pVRkJNVUk3UlVGRGVFSXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhyUWtGQmFrSXNRMEZEU1N4alFVUktMRVZCUlVrc1NVRkJTU3hsUVVGS0xFTkJRVUVzUTBGR1NqdFRRVXRCTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTlCUVZnc1JVRkJiMElzWTBGQmNFSTdRVUZPZDBJN08wRkJVVFZDTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0luMD1cbiIsInZhciBTY3JvbGxWaWV3O1xuXG5TY3JvbGxWaWV3ID0ge1xuICBjcmVhdGVTY3JvbGxWaWV3OiBmdW5jdGlvbih0YXJnZXROb2RlKSB7XG4gICAgdmFyIGNvbnRhaW5lciwgc2Nyb2xsVmlldywgc2l6ZTtcbiAgICBzaXplID0gdGFyZ2V0Tm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgIGNvbnRhaW5lciA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgc2Nyb2xsVmlldyA9IG5ldyBjYy5TY3JvbGxWaWV3KHNpemUsIGNvbnRhaW5lcik7XG4gICAgc2Nyb2xsVmlldy5zZXRQb3NpdGlvbih0YXJnZXROb2RlLmdldFBvc2l0aW9uKCkpO1xuICAgIHNjcm9sbFZpZXcuc2V0RGlyZWN0aW9uKGNjLlNDUk9MTFZJRVdfRElSRUNUSU9OX1ZFUlRJQ0FMKTtcbiAgICBzY3JvbGxWaWV3LnNldFRvdWNoRW5hYmxlZCh0cnVlKTtcbiAgICByZXR1cm4gc2Nyb2xsVmlldztcbiAgfSxcbiAgaW5pdEZyb21Db250YWluZXI6IGZ1bmN0aW9uKHNjcm9sbFZpZXcsIGlubmVyKSB7XG4gICAgdmFyIGNvbnRhaW5lcjtcbiAgICBpbm5lci5zZXRQb3NpdGlvbih7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH0pO1xuICAgIGlubmVyLnNldEFuY2hvclBvaW50KHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfSk7XG4gICAgaW5uZXIucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgIGNvbnRhaW5lciA9IHNjcm9sbFZpZXcuZ2V0Q29udGFpbmVyKCk7XG4gICAgY29udGFpbmVyLnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xuICAgIGNvbnRhaW5lci5zZXRDb250ZW50U2l6ZShpbm5lci5nZXRDb250ZW50U2l6ZSgpKTtcbiAgICByZXR1cm4gY29udGFpbmVyLmFkZENoaWxkKGlubmVyKTtcbiAgfSxcbiAgc2Nyb2xsSnVtcFRvVG9wOiBmdW5jdGlvbihzY3JvbGxWaWV3KSB7XG4gICAgdmFyIGNvbnRhaW5lciwgb2Zmc2V0O1xuICAgIGNvbnRhaW5lciA9IHNjcm9sbFZpZXcuZ2V0Q29udGFpbmVyKCk7XG4gICAgb2Zmc2V0ID0gc2Nyb2xsVmlldy5nZXRWaWV3U2l6ZSgpLmhlaWdodCAtIGNvbnRhaW5lci5nZXRDb250ZW50U2l6ZSgpLmhlaWdodDtcbiAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgcmV0dXJuIHNjcm9sbFZpZXcuc2V0Q29udGVudE9mZnNldCh7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IG9mZnNldFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzY3JvbGxWaWV3LnNldENvbnRlbnRPZmZzZXQoe1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Nyb2xsVmlldztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12ZEc5dmJITXZVMk55YjJ4c1ZtbGxkeTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2VlhObGNuTXZkR0Z2ZDNVdmMzUjFaSGt2UVhKcllXUXZRWEpyWVdSSFlXMWxMM055WXk5MGIyOXNjeTlUWTNKdmJHeFdhV1YzTG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkJPenRCUVVGQkxGVkJRVUVzUjBGRFNUdEZRVUZCTEdkQ1FVRkJMRVZCUVd0Q0xGTkJRVU1zVlVGQlJEdEJRVU5rTEZGQlFVRTdTVUZCUVN4SlFVRkJMRWRCUVU4c1ZVRkJWU3hEUVVGRExHTkJRVmdzUTBGQlFUdEpRVU5RTEZOQlFVRXNSMEZCV1N4SlFVRkpMRVZCUVVVc1EwRkJReXhKUVVGUUxFTkJRVUU3U1VGRFdpeFZRVUZCTEVkQlFXRXNTVUZCU1N4RlFVRkZMRU5CUVVNc1ZVRkJVQ3hEUVVGclFpeEpRVUZzUWl4RlFVRjNRaXhUUVVGNFFqdEpRVU5pTEZWQlFWVXNRMEZCUXl4WFFVRllMRU5CUVhWQ0xGVkJRVlVzUTBGQlF5eFhRVUZZTEVOQlFVRXNRMEZCZGtJN1NVRkRRU3hWUVVGVkxFTkJRVU1zV1VGQldDeERRVUYzUWl4RlFVRkZMRU5CUVVNc05rSkJRVE5DTzBsQlEwRXNWVUZCVlN4RFFVRkRMR1ZCUVZnc1EwRkJNa0lzU1VGQk0wSTdWMEZEUVR0RlFWQmpMRU5CUVd4Q08wVkJVMEVzYVVKQlFVRXNSVUZCYlVJc1UwRkJReXhWUVVGRUxFVkJRV0VzUzBGQllqdEJRVU5tTEZGQlFVRTdTVUZCUVN4TFFVRkxMRU5CUVVNc1YwRkJUaXhEUVVGclFqdE5RVUZETEVOQlFVRXNSVUZCUnl4RFFVRktPMDFCUVU4c1EwRkJRU3hGUVVGSExFTkJRVlk3UzBGQmJFSTdTVUZEUVN4TFFVRkxMRU5CUVVNc1kwRkJUaXhEUVVGeFFqdE5RVUZETEVOQlFVRXNSVUZCUnl4RFFVRktPMDFCUVU4c1EwRkJRU3hGUVVGSExFTkJRVlk3UzBGQmNrSTdTVUZEUVN4TFFVRkxMRU5CUVVNc1owSkJRVTRzUTBGQlFUdEpRVU5CTEZOQlFVRXNSMEZCV1N4VlFVRlZMRU5CUVVNc1dVRkJXQ3hEUVVGQk8wbEJRMW9zVTBGQlV5eERRVUZETEdsQ1FVRldMRU5CUVRSQ0xFbEJRVFZDTzBsQlEwRXNVMEZCVXl4RFFVRkRMR05CUVZZc1EwRkJlVUlzUzBGQlN5eERRVUZETEdOQlFVNHNRMEZCUVN4RFFVRjZRanRYUVVOQkxGTkJRVk1zUTBGQlF5eFJRVUZXTEVOQlFXMUNMRXRCUVc1Q08wVkJVR1VzUTBGVWJrSTdSVUZyUWtFc1pVRkJRU3hGUVVGcFFpeFRRVUZETEZWQlFVUTdRVUZEWWl4UlFVRkJPMGxCUVVFc1UwRkJRU3hIUVVGWkxGVkJRVlVzUTBGQlF5eFpRVUZZTEVOQlFVRTdTVUZEV2l4TlFVRkJMRWRCUVZNc1ZVRkJWU3hEUVVGRExGZEJRVmdzUTBGQlFTeERRVUYzUWl4RFFVRkRMRTFCUVhwQ0xFZEJRV3RETEZOQlFWTXNRMEZCUXl4alFVRldMRU5CUVVFc1EwRkJNRUlzUTBGQlF6dEpRVU4wUlN4SlFVRkhMRTFCUVVFc1IwRkJVeXhEUVVGYU8yRkJRMGtzVlVGQlZTeERRVUZETEdkQ1FVRllMRU5CUVRSQ08xRkJRVU1zUTBGQlFTeEZRVUZITEVOQlFVbzdVVUZCVHl4RFFVRkJMRVZCUVVjc1RVRkJWanRQUVVFMVFpeEZRVVJLTzB0QlFVRXNUVUZCUVR0aFFVZEpMRlZCUVZVc1EwRkJReXhuUWtGQldDeERRVUUwUWp0UlFVRkRMRU5CUVVFc1JVRkJSeXhEUVVGS08xRkJRVThzUTBGQlFTeEZRVUZITEVOQlFWWTdUMEZCTlVJc1JVRklTanM3UlVGSVlTeERRV3hDYWtJN096dEJRVEJDU2l4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiIsInZhciB1dGlscztcblxudXRpbHMgPSB7XG4gIGdldENvbXBvdW5kUmF0ZTogZnVuY3Rpb24oYWRkUmF0ZSwgdGltZSkge1xuICAgIHJldHVybiBNYXRoLmV4cCgxIC8gdGltZSAqIE1hdGgubG9nKGFkZFJhdGUpKTtcbiAgfSxcbiAgZ2V0QXZlcmFnZTogZnVuY3Rpb24odGFibGUpIHtcbiAgICB2YXIgYXZlLCBpLCBsZW4sIHRvdGFsLCB2YWx1ZTtcbiAgICB0b3RhbCA9IDA7XG4gICAgZm9yIChpID0gMCwgbGVuID0gdGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhbHVlID0gdGFibGVbaV07XG4gICAgICB0b3RhbCArPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgfVxuICAgIGF2ZSA9ICh0b3RhbCAvIHRhYmxlLmxlbmd0aCkudG9GaXhlZCgyKTtcbiAgICByZXR1cm4gYXZlO1xuICB9LFxuICBhZGRUYWI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICsgXCJcXHRcXHRcIjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB1dGlscztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lMMVZ6WlhKekwzUmhiM2QxTDNOMGRXUjVMMEZ5YTJGa0wwRnlhMkZrUjJGdFpTOXpjbU12ZEc5dmJITXZkWFJwYkhNdVkyOW1abVZsSWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUwxVnpaWEp6TDNSaGIzZDFMM04wZFdSNUwwRnlhMkZrTDBGeWEyRmtSMkZ0WlM5emNtTXZkRzl2YkhNdmRYUnBiSE11WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVRTdPMEZCUVVFc1MwRkJRU3hIUVVOSk8wVkJRVUVzWlVGQlFTeEZRVUZwUWl4VFFVRkRMRTlCUVVRc1JVRkJWU3hKUVVGV08wRkJRMklzVjBGQlR5eEpRVUZKTEVOQlFVTXNSMEZCVEN4RFFVRlRMRU5CUVVFc1IwRkJTU3hKUVVGS0xFZEJRVmNzU1VGQlNTeERRVUZETEVkQlFVd3NRMEZCVXl4UFFVRlVMRU5CUVhCQ08wVkJSRTBzUTBGQmFrSTdSVUZIUVN4VlFVRkJMRVZCUVZrc1UwRkJReXhMUVVGRU8wRkJRMUlzVVVGQlFUdEpRVUZCTEV0QlFVRXNSMEZCVVR0QlFVTlNMRk5CUVVFc2RVTkJRVUU3TzAxQlEwa3NTMEZCUVN4SlFVRlRMRkZCUVVFc1EwRkJVeXhMUVVGVU8wRkJSR0k3U1VGRlFTeEhRVUZCTEVkQlFVMHNRMEZCUXl4TFFVRkJMRWRCUVZFc1MwRkJTeXhEUVVGRExFMUJRV1lzUTBGQmMwSXNRMEZCUXl4UFFVRjJRaXhEUVVFclFpeERRVUV2UWp0WFFVTk9PMFZCVEZFc1EwRklXanRGUVZWQkxFMUJRVUVzUlVGQlVTeFRRVUZETEV0QlFVUTdWMEZEU2l4TFFVRkJMRWRCUVZFN1JVRkVTaXhEUVZaU096czdRVUZoU2l4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSjlcbiJdfQ==
