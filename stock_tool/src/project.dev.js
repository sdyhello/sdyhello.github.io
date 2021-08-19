window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  BalanceSheet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "09f50iLw0hHUoO/qbxcXS6G", "BalanceSheet");
    (function() {
      var BalanceSheet, TableBase, TitleName, utils, extend = function(child, parent) {
        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty, indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) if (i in this && this[i] === item) return i;
        return -1;
      };
      TableBase = require("./TableBase");
      utils = require("../tools/utils");
      TitleName = require("../title");
      BalanceSheet = function(superClass) {
        extend(BalanceSheet, superClass);
        function BalanceSheet() {
          return BalanceSheet.__super__.constructor.apply(this, arguments);
        }
        BalanceSheet.prototype.getFilePath = function() {
          return "allA/zcfzb_" + this._stockCode;
        };
        BalanceSheet.prototype.getFirstColTitle = function() {
          return TitleName.getBalanceTitle();
        };
        BalanceSheet.prototype.getCashValue = function() {
          return this.getValue(this._data["\u8d27\u5e01\u8d44\u91d1(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getTotalAssets = function() {
          return this.getValue(this._data["\u8d44\u4ea7\u603b\u8ba1(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getTotalDebts = function() {
          return this.getValue(this._data["\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getNetAssets = function() {
          return this.getValue(this._data["\u5f52\u5c5e\u4e8e\u6bcd\u516c\u53f8\u80a1\u4e1c\u6743\u76ca\u5408\u8ba1(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype._getNoNeedCalcItems = function() {
          return [ "\u8d44\u6599", "\u62a5\u544a\u65e5\u671f", "\u5e94\u6536\u51fa\u53e3\u9000\u7a0e(\u4e07\u5143)" ];
        };
        BalanceSheet.prototype.getReceivableValue = function() {
          return this.getValue(this._data["\u5e94\u6536\u8d26\u6b3e(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getFixedAssets = function() {
          return this.getValue(this._data["\u56fa\u5b9a\u8d44\u4ea7(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getInventory = function() {
          return this.getValue(this._data["\u5b58\u8d27(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getStockHolderEquity = function() {
          return this.getValue(this._data["\u6240\u6709\u8005\u6743\u76ca(\u6216\u80a1\u4e1c\u6743\u76ca)\u5408\u8ba1(\u4e07\u5143)"]);
        };
        BalanceSheet.prototype.getStaffPayment = function() {
          var valueTable;
          valueTable = this.getValue(this._data["\u5e94\u4ed8\u804c\u5de5\u85aa\u916c(\u4e07\u5143)"]);
          return valueTable[0] - valueTable[1];
        };
        BalanceSheet.prototype.getAssetsTop10Key = function() {
          var assetsPercentTable, disAbleTable, i, key, keyValue, len, percent, ref, sortedObjKeys, top10Key, totalAssets, useAbleTable, value;
          totalAssets = this.getTotalAssets();
          assetsPercentTable = {};
          ref = this._data;
          for (key in ref) {
            value = ref[key];
            if (indexOf.call(this._getNoNeedCalcItems(), key) >= 0) continue;
            if ("\u8d44\u4ea7\u603b\u8ba1(\u4e07\u5143)" === key) break;
            keyValue = this.getValue(value, null, false)[0];
            percent = keyValue / totalAssets[0] * 100;
            assetsPercentTable[key] = percent.toFixed(2);
          }
          sortedObjKeys = Object.keys(assetsPercentTable).sort(function(a, b) {
            return assetsPercentTable[b] - assetsPercentTable[a];
          });
          useAbleTable = [];
          disAbleTable = [ "\u56fa\u5b9a\u8d44\u4ea7\u51c0\u503c(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u539f\u503c(\u4e07\u5143)", "\u672a\u5206\u914d\u5229\u6da6(\u4e07\u5143)", "\u76c8\u4f59\u516c\u79ef(\u4e07\u5143)", "\u8d44\u672c\u516c\u79ef(\u4e07\u5143)", "\u5c11\u6570\u80a1\u4e1c\u6743\u76ca(\u4e07\u5143)", "\u5b9e\u6536\u8d44\u672c(\u6216\u80a1\u672c)(\u4e07\u5143)" ];
          for (i = 0, len = sortedObjKeys.length; i < len; i++) {
            key = sortedObjKeys[i];
            if (-1 !== key.indexOf("\u8ba1")) continue;
            if (indexOf.call(disAbleTable, key) >= 0) continue;
            useAbleTable.push(key);
          }
          top10Key = useAbleTable.slice(0, 10);
          return top10Key;
        };
        BalanceSheet.prototype._getDebtsTop10Key = function() {
          var asstesTotalIndex, countIndex, debtsPercentTable, i, key, keyValue, len, percent, ref, ref1, sortedObjKeys, top10Key, totalDebts, useAbleTable, value;
          totalDebts = this.getTotalDebts();
          debtsPercentTable = {};
          asstesTotalIndex = 0;
          countIndex = 0;
          ref = this._data;
          for (key in ref) {
            value = ref[key];
            "\u8d44\u4ea7\u603b\u8ba1(\u4e07\u5143)" === key && (asstesTotalIndex = countIndex + 1);
            countIndex++;
          }
          countIndex = 0;
          ref1 = this._data;
          for (key in ref1) {
            value = ref1[key];
            if (countIndex < asstesTotalIndex) {
              countIndex++;
              continue;
            }
            if ("\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)" === key) break;
            keyValue = this.getValue(value, null, false)[0];
            percent = keyValue / totalDebts[0] * 100;
            debtsPercentTable[key] = percent.toFixed(2);
          }
          sortedObjKeys = Object.keys(debtsPercentTable).sort(function(a, b) {
            return debtsPercentTable[b] - debtsPercentTable[a];
          });
          useAbleTable = [];
          for (i = 0, len = sortedObjKeys.length; i < len; i++) {
            key = sortedObjKeys[i];
            if (-1 !== key.indexOf("\u8ba1")) continue;
            useAbleTable.push(key);
          }
          top10Key = useAbleTable.slice(0, 10);
          return top10Key;
        };
        BalanceSheet.prototype.getTop10 = function() {
          var dataValue, endPos, i, key, len, ratioTable, top10ChangeInfo, top10Key, totalAssets;
          top10Key = this.getAssetsTop10Key();
          totalAssets = this.getTotalAssets();
          top10ChangeInfo = [];
          for (i = 0, len = top10Key.length; i < len; i++) {
            key = top10Key[i];
            dataValue = this.getValue(this._data[key]);
            endPos = key.indexOf("(");
            key = key.slice(0, endPos);
            ratioTable = utils.getRatioTable(dataValue, totalAssets);
            if (ratioTable[0] < 5) continue;
            top10ChangeInfo.push("\n" + key + ":" + ratioTable[0] + "%");
          }
          return top10ChangeInfo;
        };
        BalanceSheet.prototype.getCurrentRatio = function() {
          var currentAssets, currentAssetsTable, currentDebtsTable, currentRatio, i, index, len;
          currentAssetsTable = this.getValue(this._data["\u6d41\u52a8\u8d44\u4ea7\u5408\u8ba1(\u4e07\u5143)"]);
          currentDebtsTable = this.getValue(this._data["\u6d41\u52a8\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)"]);
          currentRatio = [];
          for (index = i = 0, len = currentAssetsTable.length; i < len; index = ++i) {
            currentAssets = currentAssetsTable[index];
            currentRatio.push((currentAssets / currentDebtsTable[index]).toFixed(2));
          }
          return currentRatio;
        };
        BalanceSheet.prototype.getQuickRatio = function() {
          var currentAssets, currentAssetsTable, currentDebtsTable, i, index, inventoryTable, len, quickRatio;
          currentAssetsTable = this.getValue(this._data["\u6d41\u52a8\u8d44\u4ea7\u5408\u8ba1(\u4e07\u5143)"]);
          currentDebtsTable = this.getValue(this._data["\u6d41\u52a8\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)"]);
          inventoryTable = this.getValue(this._data["\u5b58\u8d27(\u4e07\u5143)"]);
          quickRatio = [];
          for (index = i = 0, len = currentAssetsTable.length; i < len; index = ++i) {
            currentAssets = currentAssetsTable[index];
            quickRatio.push(((currentAssets - inventoryTable[index]) / currentDebtsTable[index]).toFixed(2));
          }
          return quickRatio;
        };
        BalanceSheet.prototype._getAverageData = function(dataTable) {
          var averageData, averageTable, i, index, len, value;
          averageTable = [];
          for (index = i = 0, len = dataTable.length; i < len; index = ++i) {
            value = dataTable[index];
            if (index >= dataTable.length - 1) break;
            averageData = (dataTable[index] + dataTable[index + 1]) / 2;
            averageTable.push(averageData);
          }
          return averageTable;
        };
        BalanceSheet.prototype.getAverageInventoryTable = function() {
          var inventoryTable;
          inventoryTable = this.getValue(this._data["\u5b58\u8d27(\u4e07\u5143)"]);
          return this._getAverageData(inventoryTable);
        };
        BalanceSheet.prototype.getAveragePayable = function() {
          var payableTable;
          payableTable = this.getValue(this._data["\u5e94\u4ed8\u8d26\u6b3e(\u4e07\u5143)"]);
          return this._getAverageData(payableTable);
        };
        BalanceSheet.prototype.getAverageTotalAssets = function() {
          var totalAssetsTable;
          totalAssetsTable = this.getTotalAssets();
          return this._getAverageData(totalAssetsTable);
        };
        BalanceSheet.prototype.getInvestAssets = function() {
          var endInvest, financial, longInvest;
          financial = this.getValue(this._data["\u53ef\u4f9b\u51fa\u552e\u91d1\u878d\u8d44\u4ea7(\u4e07\u5143)"])[0];
          endInvest = this.getValue(this._data["\u6301\u6709\u81f3\u5230\u671f\u6295\u8d44(\u4e07\u5143)"])[0];
          longInvest = this.getValue(this._data["\u957f\u671f\u80a1\u6743\u6295\u8d44(\u4e07\u5143)"])[0];
          return ((financial + endInvest + longInvest) / this.getTotalAssets()[0] * 100).toFixed(2);
        };
        BalanceSheet.prototype.getGoodWill = function() {
          var goodWill;
          goodWill = this.getValue(this._data["\u5546\u8a89(\u4e07\u5143)"])[0];
          return goodWill;
        };
        BalanceSheet.prototype.getStockHolderMoney = function() {
          var number1, number2;
          number1 = this.getValue(this._data["\u5b9e\u6536\u8d44\u672c(\u6216\u80a1\u672c)(\u4e07\u5143)"])[0];
          number2 = this.getValue(this._data["\u8d44\u672c\u516c\u79ef(\u4e07\u5143)"])[0];
          return number1 + number2;
        };
        BalanceSheet.prototype.getEarnMoney = function() {
          var number3, number4;
          number3 = this.getValue(this._data["\u76c8\u4f59\u516c\u79ef(\u4e07\u5143)"])[0];
          number4 = this.getValue(this._data["\u672a\u5206\u914d\u5229\u6da6(\u4e07\u5143)"])[0];
          return number3 + number4;
        };
        BalanceSheet.prototype.getNetAssetsStruct = function() {
          var earnMoney, result, stockHolderMoney;
          stockHolderMoney = this.getStockHolderMoney();
          earnMoney = this.getEarnMoney();
          result = earnMoney / stockHolderMoney;
          return result.toFixed(2);
        };
        BalanceSheet.prototype.getTop10AllYearPercent = function() {
          var dataValue, endPos, i, isAddLine, j, key, len, len1, maxLength, needLength, ratio, ratioIndex, ratioTable, top10ChangeInfo, top10Key, totalAssets, totalPercentTable, valueDisplayTable;
          top10Key = this.getAssetsTop10Key();
          totalAssets = this.getTotalAssets();
          top10ChangeInfo = [];
          maxLength = 8;
          totalPercentTable = [];
          valueDisplayTable = [];
          isAddLine = false;
          for (i = 0, len = top10Key.length; i < len; i++) {
            key = top10Key[i];
            dataValue = this.getValue(this._data[key]);
            endPos = key.indexOf("(");
            key = key.slice(0, endPos);
            needLength = maxLength - key.length;
            while (needLength > 0) {
              key += "\u4e00";
              needLength--;
            }
            ratioTable = utils.getRatioTable(dataValue, totalAssets);
            for (ratioIndex = j = 0, len1 = ratioTable.length; j < len1; ratioIndex = ++j) {
              ratio = ratioTable[ratioIndex];
              null == totalPercentTable[ratioIndex] && (totalPercentTable[ratioIndex] = 0);
              totalPercentTable[ratioIndex] += parseFloat(ratio);
              totalPercentTable[ratioIndex] = Math.floor(100 * totalPercentTable[ratioIndex]) / 100;
            }
            if (ratioTable[0] < 5 && false === isAddLine) {
              top10ChangeInfo.push("-------------------------------------------------------------------------");
              top10ChangeInfo.push("\u4e00\u4e00\u603b\u8ba1\u4e00\u4e00\u4e00:" + utils.addTabInTable(totalPercentTable));
              top10ChangeInfo.push("-------------------------------------------------------------------------");
              isAddLine = true;
            }
            top10ChangeInfo.push(key + ":" + utils.addTabInTable(ratioTable));
            valueDisplayTable.push(key + ":" + utils.getValueDillion(dataValue));
          }
          top10ChangeInfo.push("\u603b\u8ba1\u4e00\u4e00\u4e00\u4e00\u4e00\u4e00:" + utils.addTabInTable(totalPercentTable));
          top10ChangeInfo.push("\u603b\u8d44\u4ea7\u589e\u957f\u7387\u4e00\u4e00:" + utils.addTabInTable(utils.getAddRatioTable(totalAssets)));
          top10ChangeInfo.push(valueDisplayTable);
          return top10ChangeInfo;
        };
        BalanceSheet.prototype.getTop10DebtAllYearPercent = function() {
          var dataValue, endPos, i, isAddLine, j, key, len, len1, maxLength, needLength, ratio, ratioIndex, ratioTable, top10ChangeInfo, top10Key, totalDebts, totalPercentTable, valueDisplayTable;
          top10Key = this._getDebtsTop10Key();
          totalDebts = this.getTotalDebts();
          top10ChangeInfo = [];
          maxLength = 8;
          totalPercentTable = [];
          valueDisplayTable = [];
          isAddLine = false;
          for (i = 0, len = top10Key.length; i < len; i++) {
            key = top10Key[i];
            dataValue = this.getValue(this._data[key]);
            endPos = key.indexOf("(");
            key = key.slice(0, endPos);
            needLength = maxLength - key.length;
            while (needLength > 0) {
              key += "\u4e00";
              needLength--;
            }
            ratioTable = utils.getRatioTable(dataValue, totalDebts);
            for (ratioIndex = j = 0, len1 = ratioTable.length; j < len1; ratioIndex = ++j) {
              ratio = ratioTable[ratioIndex];
              null == totalPercentTable[ratioIndex] && (totalPercentTable[ratioIndex] = 0);
              totalPercentTable[ratioIndex] += parseFloat(ratio);
              totalPercentTable[ratioIndex] = Math.floor(100 * totalPercentTable[ratioIndex]) / 100;
            }
            if (ratioTable[0] < 5 && false === isAddLine) {
              top10ChangeInfo.push("-------------------------------------------------------------------------");
              top10ChangeInfo.push("\u4e00\u4e00\u603b\u8ba1\u4e00\u4e00\u4e00:" + utils.addTabInTable(totalPercentTable));
              top10ChangeInfo.push("-------------------------------------------------------------------------");
              isAddLine = true;
            }
            top10ChangeInfo.push(key + ":" + utils.addTabInTable(ratioTable));
            valueDisplayTable.push(key + ":" + utils.getValueDillion(dataValue));
          }
          top10ChangeInfo.push("\u603b\u8ba1\u4e00\u4e00\u4e00\u4e00\u4e00\u4e00:" + utils.addTabInTable(totalPercentTable));
          top10ChangeInfo.push(valueDisplayTable);
          return top10ChangeInfo;
        };
        BalanceSheet.prototype.getCashValuePercent = function() {
          var cash, chaiChuZiJing, totalAssets;
          cash = this.getCashValue();
          chaiChuZiJing = this.getValue(this._data["\u62c6\u51fa\u8d44\u91d1(\u4e07\u5143)"]);
          cash = utils.addTable(cash, chaiChuZiJing);
          totalAssets = this.getTotalAssets();
          return utils.getRatioTable(cash, totalAssets);
        };
        BalanceSheet.prototype.getYingShouPiaoJuPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5e94\u6536\u7968\u636e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getStockAssetsInTotalAssets = function() {
          var stockAssets, totalAssetsTable;
          stockAssets = this.getValue(this._data["\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(stockAssets, totalAssetsTable);
        };
        BalanceSheet.prototype.getYingShouPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5e94\u6536\u8d26\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getYuFuPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u9884\u4ed8\u6b3e\u9879(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getQiTaYingShouPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5176\u4ed6\u5e94\u6536\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getChunHuoPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5b58\u8d27(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getChangeQiGuQuanPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u957f\u671f\u80a1\u6743\u6295\u8d44(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getFixedAssetsWithTotalAssetsRatio = function() {
          var fixedAssetsTable, totalAssetsTable;
          fixedAssetsTable = this.getFixedAssets();
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(fixedAssetsTable, totalAssetsTable);
        };
        BalanceSheet.prototype.getZaiJiangPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5728\u5efa\u5de5\u7a0b(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getWuXingPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u65e0\u5f62\u8d44\u4ea7(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getShangYuPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5546\u8a89(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getChangQiDaiTanPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u957f\u671f\u5f85\u644a\u8d39\u7528(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getQiTaFeiLiuDongPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getDuanQiJieKuanPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u77ed\u671f\u501f\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getYingFuPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5e94\u4ed8\u8d26\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getAdvanceReceiptsPercent = function() {
          var advanceReceiptsTable, totalAssetsTable;
          advanceReceiptsTable = this.getValue(this._data["\u9884\u6536\u8d26\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(advanceReceiptsTable, totalAssetsTable);
        };
        BalanceSheet.prototype.getHeTongFuZaiPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5408\u540c\u8d1f\u503a(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getQiTaYingFuPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5176\u4ed6\u5e94\u4ed8\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getChangeQiJieKuanPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u957f\u671f\u501f\u6b3e(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getYingFuZhaiQuan = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u5e94\u4ed8\u503a\u5238(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getWeiFenPeiPercent = function() {
          var singleData, totalAssetsTable;
          singleData = this.getValue(this._data["\u672a\u5206\u914d\u5229\u6da6(\u4e07\u5143)"]);
          totalAssetsTable = this.getTotalAssets();
          return utils.getRatioTable(singleData, totalAssetsTable);
        };
        BalanceSheet.prototype.getFinancialLeverage = function() {
          var netAssets, totalAssetsTable;
          totalAssetsTable = this.getTotalAssets();
          netAssets = this.getStockHolderEquity();
          return utils.getRatioTable(totalAssetsTable, netAssets, 1);
        };
        BalanceSheet.prototype.getInterestDebt = function() {
          var debtTable, totalAssets;
          debtTable = this.getInterestDebtNum();
          totalAssets = this.getTotalAssets();
          return utils.getRatioTable(debtTable, totalAssets);
        };
        BalanceSheet.prototype.getInterestDebtNum = function() {
          var data, debtTable, i, index, len, value1, value2, value3;
          value1 = this.getValue(this._data["\u77ed\u671f\u501f\u6b3e(\u4e07\u5143)"]);
          value2 = this.getValue(this._data["\u957f\u671f\u501f\u6b3e(\u4e07\u5143)"]);
          value3 = this.getValue(this._data["\u5e94\u4ed8\u503a\u5238(\u4e07\u5143)"]);
          debtTable = [];
          for (index = i = 0, len = value1.length; i < len; index = ++i) {
            data = value1[index];
            debtTable.push(value1[index] + value2[index] + value3[index]);
          }
          return debtTable;
        };
        BalanceSheet.prototype.getFuZhaiHeJi = function() {
          var totalAssets, value1;
          value1 = this.getValue(this._data["\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)"]);
          totalAssets = this.getTotalAssets();
          return utils.getRatioTable(value1, totalAssets);
        };
        return BalanceSheet;
      }(TableBase);
      module.exports = BalanceSheet;
    }).call(this);
    cc._RF.pop();
  }, {
    "../title": "title",
    "../tools/utils": "utils",
    "./TableBase": "TableBase"
  } ],
  CashFlowStatement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6045QzM+FCo6TaoLGgsZo1", "CashFlowStatement");
    (function() {
      var CashFlowStatement, TableBase, TitleName, utils, extend = function(child, parent) {
        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      TableBase = require("./TableBase");
      TitleName = require("../title");
      utils = require("../tools/utils");
      CashFlowStatement = function(superClass) {
        extend(CashFlowStatement, superClass);
        function CashFlowStatement() {
          return CashFlowStatement.__super__.constructor.apply(this, arguments);
        }
        CashFlowStatement.prototype.getFirstColTitle = function() {
          return TitleName.getCashFlowTitle();
        };
        CashFlowStatement.prototype.getFilePath = function() {
          return "allA/xjllb_" + this._stockCode;
        };
        CashFlowStatement.prototype.getWorkCashFlow = function() {
          return this.getValue(this._data["\u7ecf\u8425\u6d3b\u52a8\u4ea7\u751f\u7684\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getPayStaffCash = function() {
          return this.getValue(this._data["\u652f\u4ed8\u7ed9\u804c\u5de5\u4ee5\u53ca\u4e3a\u804c\u5de5\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)"])[0];
        };
        CashFlowStatement.prototype.getCapitalExpenditure = function() {
          return this.getValue(this._data["\u8d2d\u5efa\u56fa\u5b9a\u8d44\u4ea7\u3001\u65e0\u5f62\u8d44\u4ea7\u548c\u5176\u4ed6\u957f\u671f\u8d44\u4ea7\u6240\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getSellGoodsMoney = function() {
          return this.getValue(this._data["\u9500\u552e\u5546\u54c1\u3001\u63d0\u4f9b\u52b3\u52a1\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getChuShouGuDingZiChan = function() {
          return this.getValue(this._data["\u5904\u7f6e\u56fa\u5b9a\u8d44\u4ea7\u3001\u65e0\u5f62\u8d44\u4ea7\u548c\u5176\u4ed6\u957f\u671f\u8d44\u4ea7\u6240\u6536\u56de\u7684\u73b0\u91d1\u51c0\u989d(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getTouZiHuoDong = function() {
          return this.getValue(this._data["\u6295\u8d44\u6d3b\u52a8\u4ea7\u751f\u7684\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getChouZiHuoDong = function() {
          return this.getValue(this._data["\u7b79\u8d44\u6d3b\u52a8\u4ea7\u751f\u7684\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getIPOMoney = function() {
          return this.getValue(this._data["\u5438\u6536\u6295\u8d44\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)"]);
        };
        CashFlowStatement.prototype.getFreeMoneyFlow = function() {
          var i, index, len, result, value, value1, value2;
          value1 = this.getWorkCashFlow();
          value2 = this.getCapitalExpenditure();
          result = [];
          for (index = i = 0, len = value1.length; i < len; index = ++i) {
            value = value1[index];
            result.push(value - value2[index]);
          }
          return result;
        };
        CashFlowStatement.prototype.getChouZiTotal = function() {
          var valueTable;
          valueTable = this.getChouZiHuoDong();
          return utils.getSummation(valueTable);
        };
        CashFlowStatement.prototype.getTouZiTotal = function() {
          var valueTable;
          valueTable = this.getTouZiHuoDong();
          return utils.getSummation(valueTable);
        };
        CashFlowStatement.prototype.getWorkCashFlowTotal = function() {
          var valueTable;
          valueTable = this.getWorkCashFlow();
          return utils.getSummation(valueTable);
        };
        return CashFlowStatement;
      }(TableBase);
      module.exports = CashFlowStatement;
    }).call(this);
    cc._RF.pop();
  }, {
    "../title": "title",
    "../tools/utils": "utils",
    "./TableBase": "TableBase"
  } ],
  CompanyInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8689agK4zNOGIe+HeKRHemq", "CompanyInfo");
    (function() {
      var allStockCodeTable, companyInfoTable, industryGroup, nameTable, subNewStockTable, utils;
      utils = require("./tools/utils");
      companyInfoTable = [];
      subNewStockTable = [];
      allStockCodeTable = [];
      industryGroup = {};
      nameTable = {
        preloadCsv: function(time) {
          return nameTable._initCompanyInfo(time);
        },
        _initCompanyInfo: function(time) {
          return cc.loader.loadRes("companyInfo", function(_this) {
            return function(error, data) {
              var useTime;
              if (null == data) {
                console.log("load company failed !!");
                return;
              }
              useTime = new Date().getTime() - time;
              cc.log("load company info ok :" + useTime);
              return companyInfoTable = utils.csvToArray(data);
            };
          }(this));
        },
        getCompanyInfoByCode: function(targetCode) {
          var companyInfo, i, len;
          for (i = 0, len = companyInfoTable.length; i < len; i++) {
            companyInfo = companyInfoTable[i];
            if ("" === companyInfo[0]) continue;
            if (targetCode === companyInfo[0]) return companyInfo;
          }
          return [ "", "", "", "", "", "", "", "", "" ];
        }
      };
      module.exports = nameTable;
    }).call(this);
    cc._RF.pop();
  }, {
    "./tools/utils": "utils"
  } ],
  ProfitStatement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a9261LsNhFENZ/SqVtuLBCO", "ProfitStatement");
    (function() {
      var ProfitStatement, TableBase, TitleName, global, utils, extend = function(child, parent) {
        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      TableBase = require("./TableBase");
      utils = require("../tools/utils");
      TitleName = require("../title");
      global = require("../globalValue");
      ProfitStatement = function(superClass) {
        extend(ProfitStatement, superClass);
        function ProfitStatement() {
          return ProfitStatement.__super__.constructor.apply(this, arguments);
        }
        ProfitStatement.prototype.getFilePath = function() {
          return "allA/lrb_" + this._stockCode;
        };
        ProfitStatement.prototype.getFirstColTitle = function() {
          return TitleName.getProfitTitle();
        };
        ProfitStatement.prototype.getIncomeValue = function() {
          return this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getOperatingCosts = function() {
          return this.getValue(this._data["\u8425\u4e1a\u6210\u672c(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getYingYeZongChengBen = function() {
          return this.getValue(this._data["\u8425\u4e1a\u603b\u6210\u672c(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getProfitTotal = function() {
          return this.getValue(this._data["\u5229\u6da6\u603b\u989d(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getIncomeProfit = function() {
          return this.getValue(this._data["\u8425\u4e1a\u5229\u6da6(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getRDFee = function() {
          return this.getValue(this._data["\u7814\u53d1\u8d39\u7528(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getIncomeTax = function() {
          return this.getValue(this._data["\u6240\u5f97\u7a0e\u8d39\u7528(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getYingyeShuijin = function() {
          return this.getValue(this._data["\u8425\u4e1a\u7a0e\u91d1\u53ca\u9644\u52a0(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getPercentStructure = function() {
          var aTable, allIncome, allIncomeTable, bTable, cTable, caiwuTable, chengBenTable, dTable, eTable, fTable, gTable, guanliTable, hTable, i, iTable, index, j, len, len1, qitaTable, shuiJinTable, totalChengBenTable, xiaoshouTable, yanfaTable, yingyeliruiTable;
          allIncomeTable = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          aTable = this.getValue(this._data["\u8425\u4e1a\u6210\u672c(\u4e07\u5143)"]);
          bTable = this.getValue(this._data["\u8425\u4e1a\u7a0e\u91d1\u53ca\u9644\u52a0(\u4e07\u5143)"]);
          cTable = this.getValue(this._data["\u9500\u552e\u8d39\u7528(\u4e07\u5143)"]);
          dTable = this.getValue(this._data["\u7ba1\u7406\u8d39\u7528(\u4e07\u5143)"]);
          eTable = this.getValue(this._data["\u7814\u53d1\u8d39\u7528(\u4e07\u5143)"]);
          fTable = this.getValue(this._data["\u8d22\u52a1\u8d39\u7528(\u4e07\u5143)"]);
          gTable = this.getValue(this._data["\u8425\u4e1a\u5229\u6da6(\u4e07\u5143)"]);
          hTable = this.getValue(this._data["\u8425\u4e1a\u603b\u6210\u672c(\u4e07\u5143)"]);
          iTable = [];
          for (index = i = 0, len = allIncomeTable.length; i < len; index = ++i) {
            allIncome = allIncomeTable[index];
            iTable.push(gTable[index] + hTable[index] - allIncome);
          }
          totalChengBenTable = [];
          chengBenTable = [];
          shuiJinTable = [];
          xiaoshouTable = [];
          guanliTable = [];
          yanfaTable = [];
          caiwuTable = [];
          yingyeliruiTable = [];
          qitaTable = [];
          for (index = j = 0, len1 = allIncomeTable.length; j < len1; index = ++j) {
            allIncome = allIncomeTable[index];
            totalChengBenTable.push("\t" + utils.getPercent(hTable[index], allIncome) + "%\t");
            chengBenTable.push("\t" + utils.getPercent(aTable[index], allIncome) + "%\t");
            shuiJinTable.push("\t" + utils.getPercent(bTable[index], allIncome) + "%\t");
            xiaoshouTable.push("\t" + utils.getPercent(cTable[index], allIncome) + "%\t");
            guanliTable.push("\t" + utils.getPercent(dTable[index], allIncome) + "%\t");
            yanfaTable.push("\t" + utils.getPercent(eTable[index], allIncome) + "%\t");
            caiwuTable.push("\t" + utils.getPercent(fTable[index], allIncome) + "%\t");
            yingyeliruiTable.push("\t" + utils.getPercent(gTable[index], allIncome) + "%\t");
            qitaTable.push("\t" + utils.getPercent(iTable[index], allIncome) + "%\t");
          }
          return "\n\u8425\u4e1a\u6536\u5165\u62c6\u89e3\uff08\u5e74\uff09\uff1a \n\u6210\u672c\u8425\u4e1a\u603b\u6210\u672c: " + totalChengBenTable + " \n\u6210\u672c\u4e4b\u8425\u4e1a\u6210\u672c: " + chengBenTable + "% \n\u6210\u672c\u4e4b\u7a0e\u91d1\u9644\u52a0: " + shuiJinTable + "% \n\u6210\u672c\u4e4b\u9500\u552e\u8d39\u7528: " + xiaoshouTable + "% \n\u6210\u672c\u4e4b\u7ba1\u7406\u8d39\u7528: " + guanliTable + "% \n\u6210\u672c\u4e4b\u7814\u53d1\u8d39\u7528: " + yanfaTable + "% \n\u6210\u672c\u4e4b\u8d22\u52a1\u8d39\u7528: " + caiwuTable + "% \n\n\u8425\u4e1a\u5229\u6da6: " + yingyeliruiTable + "% \n\u5176\u4ed6: " + qitaTable + "% \n";
        };
        ProfitStatement.prototype._getSingleValueTable = function(data, year) {
          var oneQuarter, quarterIndexTable, singleValueTable, threeQuarter, twoQuarter, valueTable;
          quarterIndexTable = [];
          quarterIndexTable.push(year + "-12-31");
          quarterIndexTable.push(year + "-09-30");
          quarterIndexTable.push(year + "-06-30");
          quarterIndexTable.push(year + "-03-31");
          valueTable = this.getAllQuarterValue(data, quarterIndexTable);
          singleValueTable = [];
          oneQuarter = valueTable[0] - valueTable[1];
          twoQuarter = valueTable[1] - valueTable[2];
          threeQuarter = valueTable[2] - valueTable[3];
          isNaN(oneQuarter) && (oneQuarter = -1);
          isNaN(twoQuarter) && (twoQuarter = -1);
          isNaN(threeQuarter) && (threeQuarter = -1);
          singleValueTable.push(oneQuarter);
          singleValueTable.push(twoQuarter);
          singleValueTable.push(threeQuarter);
          singleValueTable.push(valueTable[3]);
          return singleValueTable;
        };
        ProfitStatement.prototype._getCurrentYearAndLastYear = function() {
          var currentYear, lastYear, nowDate, nowYear, tempTime, yearTable;
          nowDate = new Date();
          nowYear = nowDate.getFullYear();
          tempTime = new Date(nowYear, 4);
          nowDate.getTime() < tempTime && (nowYear -= 1);
          yearTable = this.getTimeTitle();
          currentYear = yearTable[0].slice(1, 5);
          lastYear = nowYear - 1;
          if (nowYear === currentYear) currentYear = nowYear; else {
            lastYear = currentYear;
            currentYear = nowYear;
          }
          return [ currentYear, lastYear ];
        };
        ProfitStatement.prototype._getDisRatioInfo = function(currentYearValue, lastYearValue, displayKey) {
          var compareInfo, currentYear, disRatioTable, lastYear, ref;
          ref = this._getCurrentYearAndLastYear(), currentYear = ref[0], lastYear = ref[1];
          disRatioTable = utils.getDisRatioTable(currentYearValue, lastYearValue);
          compareInfo = [ "\n" + displayKey + "\t", "\t\t\u56db\u5b63\u5ea6", "\t\t\t\t\u4e09\u5b63\u5ea6", "\t\t\t\t\u4e8c\u5b63\u5ea6", "\t\t\t\t\u4e00\u5b63\u5ea6" ];
          compareInfo.push("\n" + currentYear + ": " + utils.getValueDillion(currentYearValue));
          compareInfo.push("\n" + lastYear + ": " + utils.getValueDillion(lastYearValue));
          compareInfo.push("\n\u589e\u957f\u7387: " + disRatioTable);
          compareInfo.push("\n");
          return compareInfo;
        };
        ProfitStatement.prototype._getCompareInfo = function(financeKey, displayKey) {
          var currentYear, currentYearValue, lastYear, lastYearValue, ref;
          ref = this._getCurrentYearAndLastYear(), currentYear = ref[0], lastYear = ref[1];
          currentYearValue = this._getSingleValueTable(this._data[financeKey], currentYear);
          lastYearValue = this._getSingleValueTable(this._data[financeKey], lastYear);
          return this._getDisRatioInfo(currentYearValue, lastYearValue, displayKey);
        };
        ProfitStatement.prototype.getQuarterIncome = function() {
          return this._getCompareInfo("\u8425\u4e1a\u603b\u6536\u5165(\u4e07\u5143)", "\u8425\u4e1a\u6536\u5165");
        };
        ProfitStatement.prototype.getQuarterNetProfit = function() {
          return this._getCompareInfo("\u5f52\u5c5e\u4e8e\u6bcd\u516c\u53f8\u6240\u6709\u8005\u7684\u51c0\u5229\u6da6(\u4e07\u5143)", "\u51c0\u5229\u6da6");
        };
        ProfitStatement.prototype.getQuarterTotalCost = function() {
          return this._getCompareInfo("\u8425\u4e1a\u603b\u6210\u672c(\u4e07\u5143)", "\u603b\u6210\u672c");
        };
        ProfitStatement.prototype.getQuarterOperatingProfit = function() {
          return this._getCompareInfo("\u8425\u4e1a\u5229\u6da6(\u4e07\u5143)", "\u8425\u4e1a\u5229\u6da6");
        };
        ProfitStatement.prototype.getOtherIncome = function() {
          var currentDisTable, currentOperatingProfit, currentYear, currentYearCost, currentYearIncome, lastDisTable, lastOperatingProfit, lastYear, lastYearCost, lastYearIncome, ref;
          ref = this._getCurrentYearAndLastYear(), currentYear = ref[0], lastYear = ref[1];
          currentYearIncome = this._getSingleValueTable(this._data["\u8425\u4e1a\u603b\u6536\u5165(\u4e07\u5143)"], currentYear);
          currentYearCost = this._getSingleValueTable(this._data["\u8425\u4e1a\u603b\u6210\u672c(\u4e07\u5143)"], currentYear);
          currentOperatingProfit = this._getSingleValueTable(this._data["\u8425\u4e1a\u5229\u6da6(\u4e07\u5143)"], currentYear);
          currentDisTable = utils.getDisTable(currentYearIncome, currentYearCost);
          currentDisTable = utils.getDisTable(currentOperatingProfit, currentDisTable);
          lastYearIncome = this._getSingleValueTable(this._data["\u8425\u4e1a\u603b\u6536\u5165(\u4e07\u5143)"], lastYear);
          lastYearCost = this._getSingleValueTable(this._data["\u8425\u4e1a\u603b\u6210\u672c(\u4e07\u5143)"], lastYear);
          lastOperatingProfit = this._getSingleValueTable(this._data["\u8425\u4e1a\u5229\u6da6(\u4e07\u5143)"], lastYear);
          lastDisTable = utils.getDisTable(lastYearIncome, lastYearCost);
          lastDisTable = utils.getDisTable(lastOperatingProfit, lastDisTable);
          return this._getDisRatioInfo(currentDisTable, lastDisTable, "\u5176\u4ed6\u6536\u76ca");
        };
        ProfitStatement.prototype.getNetProfitAddRatio = function() {
          var addRatio, addTimes, netProfitTable;
          netProfitTable = this.getNetProfitTable();
          addTimes = netProfitTable[0] / netProfitTable[netProfitTable.length - 1];
          addRatio = utils.getCompoundRate(Math.abs(addTimes), netProfitTable.length - 1);
          addRatio = (100 * (addRatio - 1)).toFixed(2);
          return addRatio;
        };
        ProfitStatement.prototype.getCoreProfitCompoundAddRatio = function() {
          var addRatio, addTimes, coreProfit;
          coreProfit = this.getCoreProfit();
          addTimes = coreProfit[0] / coreProfit[coreProfit.length - 1];
          addRatio = utils.getCompoundRate(Math.abs(addTimes), coreProfit.length - 1);
          addRatio = (100 * (addRatio - 1)).toFixed(2);
          return addRatio;
        };
        ProfitStatement.prototype.getIncomeAddRatio = function() {
          var addRatio, addTimes, incomeValueTable;
          incomeValueTable = this.getIncomeValue();
          addTimes = incomeValueTable[0] / incomeValueTable[incomeValueTable.length - 1];
          addRatio = utils.getCompoundRate(Math.abs(addTimes), incomeValueTable.length - 1);
          addRatio = (100 * (addRatio - 1)).toFixed(2);
          return addRatio;
        };
        ProfitStatement.prototype.getNetProfitTable = function(doNotToInt, isOnlyYear) {
          return this.getValue(this._data["\u5f52\u5c5e\u4e8e\u6bcd\u516c\u53f8\u6240\u6709\u8005\u7684\u51c0\u5229\u6da6(\u4e07\u5143)"], doNotToInt, isOnlyYear);
        };
        ProfitStatement.prototype.getNetProfitAllTable = function() {
          return this.getValue(this._data["\u51c0\u5229\u6da6(\u4e07\u5143)"]);
        };
        ProfitStatement.prototype.getNetProfitYoy = function() {
          var profitTable;
          profitTable = this.getNetProfitTable();
          return utils.getAddRatioTable(profitTable);
        };
        ProfitStatement.prototype.getIncomeYoy = function() {
          var incomeTable;
          incomeTable = this.getIncomeValue();
          return utils.getAddRatioTable(incomeTable);
        };
        ProfitStatement.prototype.getNetProfitRatio = function() {
          var incomeValue, netProfit;
          netProfit = this.getNetProfitAllTable();
          incomeValue = this.getIncomeValue();
          return utils.getRatioTable(netProfit, incomeValue);
        };
        ProfitStatement.prototype.getGrossProfitRatio = function() {
          var grossProfitRatio, grossProfitRatioTable, i, incomeValue, incomeValueTable, index, len, operatingCostsTable;
          incomeValueTable = this.getIncomeValue();
          operatingCostsTable = this.getOperatingCosts();
          grossProfitRatioTable = [];
          for (index = i = 0, len = incomeValueTable.length; i < len; index = ++i) {
            incomeValue = incomeValueTable[index];
            grossProfitRatio = ((incomeValue - operatingCostsTable[index]) / incomeValue * 100).toFixed(2);
            grossProfitRatioTable.push(grossProfitRatio);
          }
          return grossProfitRatioTable;
        };
        ProfitStatement.prototype.getPE = function() {
          var PE, earnPerShare, price;
          earnPerShare = this.getValue(this._data["\u57fa\u672c\u6bcf\u80a1\u6536\u76ca"], true)[0];
          price = this.getSharePrice();
          PE = (price / earnPerShare).toFixed(2);
          return PE;
        };
        ProfitStatement.prototype.getCoreProfit = function() {
          var a, b, c, coreProfitTable, d, e, f, g, i, index, len, operatingProfit, value;
          a = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          b = this.getValue(this._data["\u8425\u4e1a\u6210\u672c(\u4e07\u5143)"]);
          c = this.getValue(this._data["\u8425\u4e1a\u7a0e\u91d1\u53ca\u9644\u52a0(\u4e07\u5143)"]);
          d = this.getValue(this._data["\u9500\u552e\u8d39\u7528(\u4e07\u5143)"]);
          e = this.getValue(this._data["\u7ba1\u7406\u8d39\u7528(\u4e07\u5143)"]);
          f = this.getValue(this._data["\u8d22\u52a1\u8d39\u7528(\u4e07\u5143)"]);
          g = this.getRDFee();
          coreProfitTable = [];
          for (index = i = 0, len = a.length; i < len; index = ++i) {
            value = a[index];
            operatingProfit = a[index] - b[index] - c[index] - d[index] - e[index] - f[index] - g[index];
            b[index] || (operatingProfit = 0);
            coreProfitTable.push(operatingProfit);
          }
          return coreProfitTable;
        };
        ProfitStatement.prototype.getOperatingProfitRatio = function() {
          var a, coreProfit;
          coreProfit = this.getCoreProfit();
          a = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          return utils.getRatioTable(coreProfit, a);
        };
        ProfitStatement.prototype.getYingYeLiRuiLu = function() {
          var totalProfit, yingYe;
          totalProfit = this.getIncomeValue();
          yingYe = this.getIncomeProfit();
          return utils.getRatioTable(yingYe, totalProfit);
        };
        ProfitStatement.prototype.getCoreProfitRatio = function() {
          var coreProfit, totalProfit;
          totalProfit = this.getProfitTotal();
          coreProfit = this.getCoreProfit();
          return utils.getRatioTable(coreProfit, totalProfit);
        };
        ProfitStatement.prototype.getCoreProfitAddRatio = function() {
          var coreProfit;
          coreProfit = this.getCoreProfit();
          return utils.getAddRatioTable(coreProfit);
        };
        ProfitStatement.prototype.getExpenseRatio = function() {
          var RDFeeTable, expenseRatio, expenseRatioTable, i, incomeValue, incomeValueTable, index, len, manageFeeTable, moneyFeeTable, sellingFeeTable, totalFee;
          sellingFeeTable = this.getValue(this._data["\u9500\u552e\u8d39\u7528(\u4e07\u5143)"]);
          manageFeeTable = this.getValue(this._data["\u7ba1\u7406\u8d39\u7528(\u4e07\u5143)"]);
          RDFeeTable = this.getValue(this._data["\u7814\u53d1\u8d39\u7528(\u4e07\u5143)"]);
          moneyFeeTable = this.getValue(this._data["\u8d22\u52a1\u8d39\u7528(\u4e07\u5143)"]);
          incomeValueTable = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          expenseRatioTable = [];
          for (index = i = 0, len = incomeValueTable.length; i < len; index = ++i) {
            incomeValue = incomeValueTable[index];
            totalFee = sellingFeeTable[index] + manageFeeTable[index] + RDFeeTable[index] + moneyFeeTable[index];
            expenseRatio = (totalFee / incomeValue * 100).toFixed(2);
            expenseRatioTable.push(expenseRatio);
          }
          return expenseRatioTable;
        };
        ProfitStatement.prototype.getSellingFeeRatio = function() {
          var incomeValueTable, sellingFeeTable;
          sellingFeeTable = this.getValue(this._data["\u9500\u552e\u8d39\u7528(\u4e07\u5143)"]);
          incomeValueTable = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          return utils.getRatioTable(sellingFeeTable, incomeValueTable);
        };
        ProfitStatement.prototype.getManageFeeRatio = function() {
          var incomeValueTable, manageFeeTable;
          manageFeeTable = this.getValue(this._data["\u7ba1\u7406\u8d39\u7528(\u4e07\u5143)"]);
          incomeValueTable = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          return utils.getRatioTable(manageFeeTable, incomeValueTable);
        };
        ProfitStatement.prototype.getMoneyFeeRatio = function() {
          var incomeValueTable, moneyFeeTable;
          moneyFeeTable = this.getValue(this._data["\u8d22\u52a1\u8d39\u7528(\u4e07\u5143)"]);
          incomeValueTable = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          return utils.getRatioTable(moneyFeeTable, incomeValueTable);
        };
        ProfitStatement.prototype.getRDFeeRatio = function() {
          var incomeValueTable, moneyFeeTable;
          moneyFeeTable = this.getValue(this._data["\u7814\u53d1\u8d39\u7528(\u4e07\u5143)"]);
          incomeValueTable = this.getValue(this._data["\u8425\u4e1a\u6536\u5165(\u4e07\u5143)"]);
          return utils.getRatioTable(moneyFeeTable, incomeValueTable);
        };
        ProfitStatement.prototype.getIncomeTaxRatio = function() {
          var incomeProfit, incomeTax;
          incomeTax = this.getIncomeTax();
          incomeProfit = this.getIncomeProfit();
          return utils.getRatioTable(incomeTax, incomeProfit);
        };
        ProfitStatement.prototype.getYingyeShuijinTax = function() {
          var incomeValueTable, shuijin;
          shuijin = this.getYingyeShuijin();
          incomeValueTable = this.getIncomeValue();
          return utils.getRatioTable(shuijin, incomeValueTable);
        };
        ProfitStatement.prototype.getIncomeValueAddRatio = function() {
          var incomeValueTable;
          incomeValueTable = this.getIncomeValue();
          return utils.getAddRatioTable(incomeValueTable);
        };
        return ProfitStatement;
      }(TableBase);
      module.exports = ProfitStatement;
    }).call(this);
    cc._RF.pop();
  }, {
    "../globalValue": "globalValue",
    "../title": "title",
    "../tools/utils": "utils",
    "./TableBase": "TableBase"
  } ],
  SameIndustryCompany: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0070d33KipEu54iiqasXOcS", "SameIndustryCompany");
    (function() {
      var DianJieYeTable, DongLiDianChi, FujiTable, GeMoTable, GuTable, LiDianSheBei, LiStockTable, SanYuanTable, ZhengCheZhiZhao;
      LiStockTable = [ "002460", "002466", "002497", "002240", "002192", "000155", "300390", "002176", "002756", "600499", "000408", "000762", "600773" ];
      GuTable = [ "603993", "603799", "300618" ];
      SanYuanTable = [ "002340", "300919", "002125", "300073", "688005", "600549", "300769", "603906", "002145" ];
      GeMoTable = [ "002812", "300568", "002080" ];
      FujiTable = [ "603659", "600884", "300035", "688388", "600110", "688116" ];
      DianJieYeTable = [ "002709", "002407", "002759", "002326", "603026", "300037", "002091" ];
      LiDianSheBei = [ "300450", "688006", "300457", "688155" ];
      DongLiDianChi = [ "300750", "002594", "002074", "300014", "002245" ];
      ZhengCheZhiZhao = [ "300124", "300432", "002402", "002139" ];
      module.exports = LiStockTable;
    }).call(this);
    cc._RF.pop();
  }, {} ],
  StockInfoTable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0ef06eY2mhEi5NfSVJooy3I", "StockInfoTable");
    (function() {
      var allStockCodeTable, industryGroup, nameTable, stockInfoTable, subNewStockTable, utils;
      utils = require("./tools/utils");
      stockInfoTable = [];
      subNewStockTable = [];
      allStockCodeTable = [];
      industryGroup = {};
      nameTable = {
        getStockInfoTable: function() {
          return stockInfoTable;
        },
        preloadCsv: function(time) {
          nameTable._initStockInfo(time);
          return nameTable._initSubNewStocks();
        },
        _initStockInfo: function(time) {
          return cc.loader.loadRes("stockInfo", function(_this) {
            return function(error, data) {
              var useTime;
              if (null == data) {
                console.log("load stockInfo failed !!");
                return;
              }
              useTime = new Date().getTime() - time;
              cc.log("load stock info ok:" + useTime);
              stockInfoTable = utils.csvToArray(data);
              return _this._groupWithIndustry();
            };
          }(this));
        },
        _initSubNewStocks: function() {
          return cc.loader.loadRes("latest30", function(_this) {
            return function(error, data) {
              if (null == data) {
                console.log("load sub new stock failed !!");
                return;
              }
              cc.log("load sub new stock info ok");
              return subNewStockTable = utils.csvToArray(data);
            };
          }(this));
        },
        getSubNewStockTable: function() {
          var i, len, stockCode, stockInfo, subNewStocks;
          subNewStocks = [];
          for (i = 0, len = subNewStockTable.length; i < len; i++) {
            stockInfo = subNewStockTable[i];
            if ("" === stockInfo[0]) continue;
            stockCode = Number(stockInfo[0].slice(0, 6));
            if (isNaN(stockCode)) continue;
            subNewStocks.push(stockInfo[0].slice(0, 6));
          }
          return subNewStocks;
        },
        getAllCodeTable: function() {
          var allStockCode, i, len, stockCode, stockInfo;
          allStockCode = [];
          if (allStockCodeTable.length > 0) return allStockCodeTable;
          for (i = 0, len = stockInfoTable.length; i < len; i++) {
            stockInfo = stockInfoTable[i];
            if ("" === stockInfo[0]) continue;
            stockCode = Number(stockInfo[0].slice(0, 6));
            if (isNaN(stockCode)) continue;
            allStockCode.push(stockInfo[0].slice(0, 6));
          }
          allStockCodeTable = allStockCode;
          return allStockCode;
        },
        _groupWithIndustry: function() {
          var i, len, name, stockCode, stockInfo;
          for (i = 0, len = stockInfoTable.length; i < len; i++) {
            stockInfo = stockInfoTable[i];
            if ("" === stockInfo[0] || null === stockInfo[0]) continue;
            if ("" === stockInfo[3]) continue;
            stockCode = Number(stockInfo[0].slice(0, 6));
            if (isNaN(stockCode)) continue;
            null == industryGroup[name = stockInfo[3]] && (industryGroup[name] = []);
            industryGroup[stockInfo[3]].push(stockInfo[0].slice(0, 6));
          }
        },
        getStockTableByIndutry: function(industry) {
          return industryGroup[industry];
        },
        getInfoTime: function() {
          var time;
          time = stockInfoTable[0][4].slice(-10);
          return time;
        }
      };
      module.exports = nameTable;
    }).call(this);
    cc._RF.pop();
  }, {
    "./tools/utils": "utils"
  } ],
  TableBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d46f9liB2VOtrzmvW4f1wYF", "TableBase");
    (function() {
      var StockInfoTable, TableBase, global, utils;
      StockInfoTable = require("../StockInfoTable");
      global = require("../globalValue");
      utils = require("../tools/utils");
      TableBase = function() {
        function TableBase(_stockCode) {
          this._stockCode = _stockCode;
          this._data = null;
          this._stockInfo = [];
          this._dataObj = {};
          this._setStockInfo();
          this._loadJson();
        }
        TableBase.prototype.getFilePath = function() {};
        TableBase.prototype.getFirstColTitle = function() {};
        TableBase.prototype.getStockCode = function() {
          return this._stockCode;
        };
        TableBase.prototype.getExistYears = function() {
          return this._existYears;
        };
        TableBase.prototype.isLoadFinish = function() {
          return null != this._data;
        };
        TableBase.prototype._loadJson = function() {
          var filePath;
          filePath = this.getFilePath();
          return cc.loader.loadRes(filePath, function(_this) {
            return function(error, data) {
              var dataTable;
              if (null != error) {
                console.log("load " + _this._stockCode + " failed !!");
                _this._setLoadStatus();
                return;
              }
              dataTable = utils.csvToArray(data);
              _this._data = dataTable;
              _this._data.unshift(_this._stockInfo);
              _this._initTable(_this.getFirstColTitle());
              return _this._setLoadStatus();
            };
          }(this));
        };
        TableBase.prototype._setLoadStatus = function() {
          global.count += 1;
          if (3 === global.count) {
            global.count = 0;
            global.canLoad = true;
          }
        };
        TableBase.prototype._initTable = function(title) {
          this._replaceFirstColTitle(title);
          this._replaceNullCell();
          return this._changeToObj();
        };
        TableBase.prototype._replaceFirstColTitle = function(title) {
          var i, index, item, len, ref;
          ref = this._data;
          for (index = i = 0, len = ref.length; i < len; index = ++i) {
            item = ref[index];
            item[0] = title[index];
          }
        };
        TableBase.prototype._replaceNullCell = function() {
          var count, i, index, item, j, len, len1, ref, value;
          ref = this._data;
          for (index = i = 0, len = ref.length; i < len; index = ++i) {
            item = ref[index];
            for (count = j = 0, len1 = item.length; j < len1; count = ++j) {
              value = item[count];
              "--" === value && (item[count] = 0);
            }
          }
        };
        TableBase.prototype._changeToObj = function() {
          var i, item, len, ref;
          ref = this._data;
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            if (null == item[0]) continue;
            this._dataObj[item[0]] = item.slice(1, item.length);
          }
          return this._data = this._dataObj;
        };
        TableBase.prototype.getStockName = function() {
          return this._data["\u8d44\u6599"][0];
        };
        TableBase.prototype.getBaseInfo = function() {
          return this._stockCode + "------" + this._data["\u8d44\u6599"][0] + "------" + this._data["\u8d44\u6599"][2] + "------\u8d22\u62a5\u65f6\u95f4" + this.getTimeTitle()[0];
        };
        TableBase.prototype.getStockInfo = function() {
          return this._data["\u8d44\u6599"][0];
        };
        TableBase.prototype.getIndustry = function() {
          return this._data["\u8d44\u6599"][2];
        };
        TableBase.prototype.getSharePrice = function() {
          return this._data["\u8d44\u6599"][1];
        };
        TableBase.prototype.getTotalMarketValue = function() {
          return this._data["\u8d44\u6599"][3];
        };
        TableBase.prototype.getOnMarketTimeNumber = function() {
          return this._data["\u8d44\u6599"][5];
        };
        TableBase.prototype.getMainBusiness = function() {
          var originString;
          originString = this._data["\u8d44\u6599"][7];
          return originString;
        };
        TableBase.prototype.getOnMarketTime = function() {
          var day, month, timeStr, year;
          timeStr = this._data["\u8d44\u6599"][5];
          if (!timeStr) return "";
          year = timeStr.slice(0, 4);
          month = timeStr.slice(4, 6);
          day = timeStr.slice(6, 8);
          return year + "\u5e74" + month + "\u6708" + day + "\u65e5";
        };
        TableBase.prototype.getPETTM = function() {
          return Number(this._data["\u8d44\u6599"][6]).toFixed(2);
        };
        TableBase.prototype._getShowNumber = function(number) {
          return (number / 1e5).toFixed(2) + " \u4ebf";
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
          ref = this._data["\u62a5\u544a\u65e5\u671f"];
          for (index = i = 0, len = ref.length; i < len; index = ++i) {
            timeStr = ref[index];
            -1 !== timeStr.indexOf("12-31") && indexTable.push(index);
          }
          if (!global.isShowMid) return indexTable;
          -1 !== this._data["\u62a5\u544a\u65e5\u671f"][0].indexOf("06-30") && indexTable.unshift(0);
          -1 !== this._data["\u62a5\u544a\u65e5\u671f"][0].indexOf("09-30") && indexTable.unshift(1);
          return indexTable;
        };
        TableBase.prototype._getValueLength = function(valueLength) {
          var length;
          length = valueLength < global.year ? valueLength : global.year;
          this._existYears = length;
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
        TableBase.prototype.getAllQuarterValue = function(data, quarterDate) {
          var date, dateIndex, i, len, valueTable;
          valueTable = [];
          for (i = 0, len = quarterDate.length; i < len; i++) {
            date = quarterDate[i];
            dateIndex = this._data["\u62a5\u544a\u65e5\u671f"].indexOf(date);
            valueTable.push(data[dateIndex]);
          }
          return this._formatToInt(valueTable);
        };
        TableBase.prototype.getValue = function(data, doNotToInt, isOnlyYear) {
          var i, index, len, valueTable, yearIndexTable;
          if (null == data) return;
          yearIndexTable = this._getYearValueIndex(isOnlyYear);
          valueTable = [];
          for (i = 0, len = yearIndexTable.length; i < len; i++) {
            index = yearIndexTable[i];
            valueTable.push(data[index]);
          }
          valueTable = valueTable.slice(0, this._getValueLength(valueTable.length));
          if (doNotToInt) return valueTable;
          return this._formatToInt(valueTable);
        };
        TableBase.prototype._setStockInfo = function() {
          var i, info, infoTable, j, len, len1, value;
          infoTable = StockInfoTable.getStockInfoTable();
          for (i = 0, len = infoTable.length; i < len; i++) {
            info = infoTable[i];
            if (-1 !== info[0].indexOf("" + this._stockCode)) {
              for (j = 0, len1 = info.length; j < len1; j++) {
                value = info[j];
                this._stockInfo.push(value);
              }
              break;
            }
          }
        };
        TableBase.prototype.getTimeTitle = function() {
          var i, index, indexTable, j, len, len1, time, timeTable, yearTable;
          indexTable = this._getYearValueIndex(false);
          timeTable = [];
          for (i = 0, len = indexTable.length; i < len; i++) {
            index = indexTable[i];
            timeTable.push(this._data["\u62a5\u544a\u65e5\u671f"][index]);
          }
          timeTable = timeTable.slice(0, this._getValueLength(timeTable.length));
          yearTable = [];
          for (j = 0, len1 = timeTable.length; j < len1; j++) {
            time = timeTable[j];
            yearTable.push("[" + time.slice(0, 7) + "]");
          }
          return yearTable;
        };
        return TableBase;
      }();
      module.exports = TableBase;
    }).call(this);
    cc._RF.pop();
  }, {
    "../StockInfoTable": "StockInfoTable",
    "../globalValue": "globalValue",
    "../tools/utils": "utils"
  } ],
  defaultSelfSelect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "148443PwMlGm7fXwfXmjfmQ", "defaultSelfSelect");
    (function() {
      var LiStockTable, defaultSelectStocks;
      defaultSelectStocks = [ "300750", "300274", "601012", "688363", "002812", "002821", "002594", "600438", "603259", "000661", "300015", "300760", "600036", "300595", "000568", "300347", "600276", "000858", "600763", "601888", "603288" ];
      LiStockTable = [ "002460", "002466", "002497", "002240", "002192", "000155", "300390", "002176", "002756", "600499", "000408", "000762", "600773", "603993", "603799", "300618", "002340", "300919", "002125", "300073", "688005", "600549", "300769", "603906", "002145", "002812", "300568", "002080", "603659", "600884", "300035", "688388", "600110", "688116", "002709", "002407", "002759", "002326", "603026", "300037", "002091", "300450", "688006", "300457", "688155", "300750", "002594", "002074", "300014", "002245", "300124", "300432", "002402", "002139" ];
      module.exports = defaultSelectStocks;
    }).call(this);
    cc._RF.pop();
  }, {} ],
  filter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b5f2sfFEZGDYGp36uO3hfv", "filter");
    (function() {
      var BalanceSheet, CashFlowStatement, ProfitStatement, StockInfoTable, global, utils, indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) if (i in this && this[i] === item) return i;
        return -1;
      };
      BalanceSheet = require("../model/BalanceSheet");
      ProfitStatement = require("../model/ProfitStatement");
      CashFlowStatement = require("../model/CashFlowStatement");
      utils = require("../tools/utils");
      global = require("../globalValue");
      StockInfoTable = require("../StockInfoTable");
      cc.Class({
        extends: cc.Component,
        properties: {
          m_filter_1: cc.Node,
          m_filter_2: cc.Node,
          m_tips: cc.Label,
          m_input_node: cc.Node,
          m_display_node: cc.Node,
          m_display_label: cc.Label
        },
        onLoad: function() {
          var i, index, ref;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("filter");
          this._debugStockCode = "002821";
          "undefined" !== typeof cocosAnalytics && null !== cocosAnalytics && null != (ref = cocosAnalytics.CAEvent) && ref.onEvent({
            eventName: "\u7b5b\u9009\u4e2a\u80a1"
          });
          this._editboxObjTable = [];
          this._editboxDataObj = {};
          this._filterNameTable = [ {
            name: "\u5e73\u5747ROE(\u4f8b:15)",
            key: "roe"
          }, {
            name: "\u6838\u5229\u590d\u589e\u7387(10)",
            key: "coreProfitAdd"
          }, {
            name: "\u51c0\u5229\u7387(10)",
            key: "netProfitRatio"
          }, {
            name: "\u81ea\u7531\u73b0\u91d1\u6d41(0.9)",
            key: "freeCash"
          }, {
            name: "\u5e02\u76c8\u7387(\u4f8b:30)",
            key: "pe"
          }, {
            name: "\u9500 / \u6536\u5165 (1)",
            key: "incomeQuality"
          }, {
            name: "\u7edf\u8ba1\u65f6\u95f4(\u4f8b:6)",
            key: "time"
          }, {
            name: "\u5f85\u5f00\u53d1...",
            key: ""
          }, {
            name: "\u5f85\u5f00\u53d1...",
            key: ""
          }, {
            name: "\u5f85\u5f00\u53d1...",
            key: ""
          } ];
          this._editboxDataObj = cc.sys.localStorage.getItem("filterObj_new");
          null == this._editboxDataObj ? this._editboxDataObj = {
            profitAddRatio: "12",
            incomeAddRatio: "15",
            roe: "15",
            pe: "40",
            time: global.year,
            incomeQuality: "0.8",
            coreProfitAdd: "20",
            grossProfitRatio: "-1",
            freeCash: "0.9",
            netProfitRatio: "20",
            debt: "1",
            stockAsstes: "-1",
            "": "-1"
          } : this._editboxDataObj = JSON.parse(this._editboxDataObj);
          this.m_input_node.active = true;
          this.m_display_node.active = false;
          for (index = i = 1; i <= 5; index = ++i) {
            this._setEventHandler(this.m_filter_1, index);
            this._setEventHandler(this.m_filter_2, index);
          }
          return this._initAndLoadTable();
        },
        _initAndLoadTable: function() {
          this._balanceObj = {};
          this._profitObj = {};
          this._cashFlowObj = {};
          return global.canLoad = true;
        },
        _setEventHandler: function(node, index) {
          var editTitle, editboxNode, editboxObj;
          editTitle = node.getChildByName("filterItem_" + index).getChildByName("filterName");
          editboxNode = editTitle.getChildByName("inputLabel");
          editboxObj = editboxNode.getComponent("cc.EditBox");
          this._editboxObjTable.push(editboxObj);
          this._addEditBoxEventHandler(editboxObj);
          this._initFilterName(editTitle, this._editboxObjTable.length - 1);
          return this._initEditBoxPlaceholder(editboxObj, this._editboxObjTable.length - 1);
        },
        _initEditBoxPlaceholder: function(editboxObj, index) {
          return editboxObj.placeholder = this._editboxDataObj[this._filterNameTable[index].key];
        },
        _initFilterName: function(labelObj, index) {
          return labelObj.getComponent(cc.Label).string = this._filterNameTable[index].name;
        },
        onReFilter: function() {
          this.m_input_node.active = true;
          return this.m_display_node.active = false;
        },
        onReturn: function() {
          return cc.director.loadScene("welcome");
        },
        onContinueFilter: function() {
          return this._filterStock();
        },
        _addEditBoxEventHandler: function(editboxObj) {
          var editboxEventHandler;
          editboxEventHandler = new cc.Component.EventHandler();
          editboxEventHandler.target = this.node;
          editboxEventHandler.component = "filter";
          editboxEventHandler.handler = "onTextChanged";
          editboxEventHandler.customEventData = {
            key: this._filterNameTable[this._editboxObjTable.length - 1].key
          };
          return editboxObj.editingDidEnded.push(editboxEventHandler);
        },
        onTextChanged: function(editbox, customEventData) {
          this._editboxDataObj[customEventData.key] = editbox.string;
          return cc.log("@_editboxDataObj[customEventData.key]:" + this._editboxDataObj[customEventData.key]);
        },
        onSubmit: function() {
          var advanceReceipt, cashTurnoverDays, coreProfitAdd, debt, freeCash, grossProfitRatio, incomeQuality, netProfitQuality, netProfitRatio, pe, profitAddRatio, receivableTurnoverDays, roe, stockAsstes;
          this.m_input_node.active = false;
          this.m_display_node.active = true;
          this._filterStock();
          profitAddRatio = this._editboxDataObj.profitAddRatio;
          incomeQuality = this._editboxDataObj.incomeQuality;
          coreProfitAdd = this._editboxDataObj.coreProfitAdd;
          grossProfitRatio = this._editboxDataObj.grossProfitRatio;
          netProfitRatio = this._editboxDataObj.netProfitRatio;
          freeCash = this._editboxDataObj.freeCash;
          stockAsstes = this._editboxDataObj.stockAsstes;
          roe = this._editboxDataObj.roe;
          pe = this._editboxDataObj.pe;
          advanceReceipt = this._editboxDataObj.advanceReceipt;
          receivableTurnoverDays = this._editboxDataObj.receivableTurnoverDays;
          netProfitQuality = this._editboxDataObj.netProfitQuality;
          debt = this._editboxDataObj.debt;
          cashTurnoverDays = this._editboxDataObj.cashTurnoverDays;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("onFilter", {
            profitAddRatio: profitAddRatio,
            incomeQuality: incomeQuality,
            roe: roe,
            pe: pe,
            advanceReceipt: advanceReceipt,
            receivableTurnoverDays: receivableTurnoverDays,
            netProfitQuality: netProfitQuality,
            debt: debt,
            cashTurnoverDays: cashTurnoverDays
          });
          return cc.sys.localStorage.setItem("filterObj_new", JSON.stringify(this._editboxDataObj));
        },
        _filterStock: function() {
          var advanceReceipt, cashTurnoverDays, coreProfitAdd, debt, freeCash, grossProfitRatio, incomeAddRatio, incomeQuality, info, netProfitQuality, netProfitRatio, options, pe, profitAddRatio, receivableTurnoverDays, roe, stockAsstes;
          options = this._editboxDataObj;
          profitAddRatio = parseFloat(options.profitAddRatio) || -1;
          incomeQuality = parseFloat(options.incomeQuality) || -1;
          coreProfitAdd = parseFloat(options.coreProfitAdd) || -1;
          grossProfitRatio = parseFloat(options.grossProfitRatio) || -1;
          stockAsstes = parseFloat(options.stockAsstes) || -1;
          netProfitRatio = parseFloat(options.netProfitRatio) || -1;
          freeCash = parseFloat(options.freeCash) || -1;
          roe = parseFloat(options.roe) || -1;
          pe = parseFloat(options.pe) || -1;
          advanceReceipt = parseFloat(options.advanceReceipt) || -1;
          receivableTurnoverDays = parseFloat(options.receivableTurnoverDays) || -1;
          netProfitQuality = parseFloat(options.netProfitQuality) || -1;
          debt = parseFloat(options.debt) || -1;
          options.time && (global.year = parseFloat(options.time));
          cashTurnoverDays = parseFloat(options.cashTurnoverDays);
          incomeAddRatio = parseFloat(options.incomeAddRatio) || -1;
          info = this.findMatchConditionStock(coreProfitAdd, roe, netProfitRatio, freeCash, pe);
          return this.m_display_label.string = info;
        },
        _getArkadValuePercent: function(stockCode) {
          var ArkadVaule, netProfit, netProfitTable, percent, totalMarketValue;
          netProfitTable = this._profitObj[stockCode].getNetProfitTable(true, true);
          netProfit = parseInt(netProfitTable[0]) / 1e4;
          ArkadVaule = netProfit / .02;
          totalMarketValue = this._balanceObj[stockCode].getTotalMarketValue();
          percent = (totalMarketValue / ArkadVaule).toFixed(2);
          if (percent > .5) return console.log(this._profitObj[stockCode].getBaseInfo(), "percent :" + percent);
        },
        findMatchConditionStock: function(coreProfitAdd, roe, netProfitRatio, freeCash, pe) {
          var allStockCodeTable, i, len, matchStockTable, stockCode;
          matchStockTable = [];
          allStockCodeTable = StockInfoTable.getAllCodeTable();
          cc.log("pararm :" + [ coreProfitAdd, roe, netProfitRatio, freeCash, pe ]);
          for (i = 0, len = allStockCodeTable.length; i < len; i++) {
            stockCode = allStockCodeTable[i];
            if (!this._isAllTableLoadFinish(stockCode)) continue;
            stockCode === this._debugStockCode && cc.log("find code 0 ");
            if (!this._filterROE(stockCode, roe)) continue;
            stockCode === this._debugStockCode && cc.log("find code 1 ");
            if (!this._filterPE(stockCode, pe)) continue;
            stockCode === this._debugStockCode && cc.log("find code 2 ");
            if (!this._filterCoreProfitAddRatio(stockCode, coreProfitAdd)) continue;
            stockCode === this._debugStockCode && cc.log("find code 3 ");
            if (!this._filterNetProfitRatio(stockCode, netProfitRatio)) continue;
            stockCode === this._debugStockCode && cc.log("find code 4 ");
            if (!this._filterFreeCash(stockCode, freeCash)) continue;
            stockCode === this._debugStockCode && cc.log("find code 5 ");
            matchStockTable.push(stockCode);
          }
          return this._getStockTableInfo(matchStockTable);
        },
        _filterNetProfitRatio: function(stockCode, netProfitRatio) {
          var netProfitRatioTable, value;
          if (-1 === netProfitRatio) return true;
          netProfitRatioTable = this._profitObj[stockCode].getNetProfitRatio();
          value = utils.getAverage(netProfitRatioTable);
          stockCode === this._debugStockCode && cc.log("filter code neet profit ratio :" + [ value, netProfitRatio ]);
          if (value > netProfitRatio) return true;
          return false;
        },
        _filterFreeCash: function(stockCode, freeCashRatio) {
          var onMarketYear, ratio;
          if (-1 === freeCashRatio) return true;
          onMarketYear = this._balanceObj[stockCode].getOnMarketTime().slice(0, 4);
          ratio = this._getFreeCashRatio(stockCode);
          stockCode === this._debugStockCode && cc.log("filter code free cash :" + [ ratio, freeCashRatio ]);
          if (ratio > freeCashRatio) return true;
          return false;
        },
        _getFreeCashRatio: function(stockCode) {
          var freeCash, profit, ratio;
          freeCash = utils.getSummation(this._cashFlowObj[stockCode].getFreeMoneyFlow());
          profit = utils.getSummation(this._profitObj[stockCode].getNetProfitTable());
          ratio = freeCash / profit;
          return ratio;
        },
        _loadTable: function(dir) {
          var beginTime, loadFile, stockTable, totalIndex;
          totalIndex = 0;
          stockTable = "allA" === dir ? StockInfoTable.getAllCodeTable() : "sub_new" === dir ? StockInfoTable.getSubNewStockTable() : utils.getStockTable(dir);
          beginTime = new Date();
          this._loadingFileStatus = true;
          loadFile = function(_this) {
            return function() {
              var dis, isExist, now, ref, stockCode;
              if (!global.canLoad) return;
              global.canLoad = false;
              if (totalIndex >= stockTable.length) {
                _this.unschedule(loadFile);
                now = new Date();
                dis = now - beginTime;
                _this.m_tips.string = "load over: use time " + Math.floor(dis / 1e3) + "s";
                _this._loadingFileStatus = false;
                return;
              }
              stockCode = stockTable[totalIndex];
              isExist = _this._checkStockExist(stockCode);
              if (isExist) {
                "allA" === dir || "sub_new" === dir || (stockCode = stockCode.slice(2, 8));
                _this.m_tips.string = "loading ..." + stockCode + "... " + totalIndex + "/" + stockTable.length;
                (null != (ref = _this._balanceObj[stockCode]) ? ref.isLoadFinish() : void 0) ? global.canLoad = true : _this._loadFileToObj(stockCode);
              } else global.canLoad = true;
              return totalIndex++;
            };
          }(this);
          this.schedule(loadFile, 0);
          return loadFile();
        },
        _checkStockExist: function(stockCode) {
          return true;
        },
        _loadFileToObj: function(stockCode) {
          this._balanceObj[stockCode] = new BalanceSheet(stockCode);
          this._profitObj[stockCode] = new ProfitStatement(stockCode);
          return this._cashFlowObj[stockCode] = new CashFlowStatement(stockCode);
        },
        _isAllTableLoadFinish: function(stockCode) {
          var balance, cashFlow, profit, ref, ref1, ref2;
          balance = null != (ref = this._balanceObj[stockCode]) ? ref.isLoadFinish() : void 0;
          profit = null != (ref1 = this._profitObj[stockCode]) ? ref1.isLoadFinish() : void 0;
          cashFlow = null != (ref2 = this._cashFlowObj[stockCode]) ? ref2.isLoadFinish() : void 0;
          return balance && profit && cashFlow;
        },
        _filterNetProfitQuality: function(stockCode, netProfitQuality) {
          var aveRatio, ratioTable;
          if (-1 === netProfitQuality) return true;
          ratioTable = this._getNetProfitQuality(stockCode);
          aveRatio = utils.getAverage(ratioTable);
          if (aveRatio > netProfitQuality) return true;
          return false;
        },
        _filterROE: function(stockCode, needRoe) {
          var aveRoe, roeTable;
          if (-1 === needRoe) return true;
          roeTable = this._getROE(stockCode);
          aveRoe = utils.getAverage(roeTable);
          stockCode === this._debugStockCode && cc.log("filter code roe :" + [ aveRoe, needRoe ]);
          if (aveRoe > needRoe) return true;
          return false;
        },
        _filterProfitAddRatio: function(stockCode, needRatio) {
          var profitAddRatio;
          if (-1 === needRatio) return true;
          profitAddRatio = this._profitObj[stockCode].getNetProfitAddRatio();
          if (profitAddRatio > needRatio) return true;
          return false;
        },
        _filterIncomeAddRatio: function(stockCode, needRatio) {
          var profitAddRatio;
          if (-1 === needRatio) return true;
          profitAddRatio = this._profitObj[stockCode].getIncomeAddRatio();
          if (profitAddRatio > needRatio) return true;
          return false;
        },
        _filterPE: function(stockCode, maxPe) {
          var pe;
          if (-1 === maxPe) return true;
          pe = this._profitObj[stockCode].getPETTM();
          if (0 < pe && pe < maxPe) return true;
          return false;
        },
        _filterInterestDebt: function(stockCode, limitInterestDebt) {
          var interestDebt;
          if (-1 === limitInterestDebt) return true;
          interestDebt = utils.getAverage(this._balanceObj[stockCode].getInterestDebt());
          if (Number(interestDebt) < limitInterestDebt) return true;
          return false;
        },
        _filterReceivableTurnoverDays: function(stockCode, receivableTurnoverDays) {
          var day;
          if (-1 === receivableTurnoverDays) return true;
          day = this._getReceivableTurnOverDays(stockCode);
          if (day < receivableTurnoverDays) return true;
          return false;
        },
        _filterAdvanceReceiptsPercent: function(stockCode, advanceReceipt) {
          var percent;
          if (-1 === advanceReceipt) return true;
          percent = this._getAdvanceReceiptsPercent(stockCode);
          if (percent >= advanceReceipt) return true;
          return false;
        },
        _filterCashTurnoverDays: function(stockCode, cashTurnoverDays) {
          var curCashTurnoverDays;
          if (-1 === cashTurnoverDays) return true;
          curCashTurnoverDays = this._getCashTurnoverDays(stockCode);
          if (curCashTurnoverDays <= cashTurnoverDays) return true;
          return false;
        },
        _filterIncomeQuality: function(stockCode, incomeQuality) {
          var quality;
          if (-1 === incomeQuality) return true;
          quality = this._getIncomeQuality(stockCode);
          if (Number(quality) > incomeQuality) return true;
          return false;
        },
        _filterCoreProfitAddRatio: function(stockCode, coreProfitAddRatio) {
          var num;
          if (-1 === coreProfitAddRatio) return true;
          num = this._profitObj[stockCode].getCoreProfitCompoundAddRatio();
          stockCode === this._debugStockCode && cc.log("filter code core profit add ratio :" + [ num, coreProfitAddRatio ]);
          if (num > coreProfitAddRatio) return true;
          return false;
        },
        _filterGrossProfitRatio: function(stockCode, ratio) {
          if (-1 === ratio) return true;
          if (Number(utils.getAverage(this._profitObj[stockCode].getGrossProfitRatio())) > ratio) return true;
          return false;
        },
        _filterStockAsstes: function(stockCode, need) {
          if (-1 === need) return true;
          cc.log("stock :" + [ Number(this._balanceObj[stockCode].getStockAssetsInTotalAssets()[0]) ]);
          if (Number(this._balanceObj[stockCode].getStockAssetsInTotalAssets()[0]) > need) return true;
          return false;
        },
        _getCoreProfitAddRatio: function(stockCode) {
          return this._profitObj[stockCode].getCoreProfitCompoundAddRatio();
        },
        _getIncomeQuality: function(stockCode) {
          var incomeValueTable, quality, sellGoodsGetMoneyTable;
          incomeValueTable = this._profitObj[stockCode].getIncomeValue();
          sellGoodsGetMoneyTable = this._cashFlowObj[stockCode].getSellGoodsMoney();
          quality = utils.getAverage(utils.getRatioTable(sellGoodsGetMoneyTable, incomeValueTable, 1));
          return quality;
        },
        _getAdvanceReceiptsPercent: function(stockCode) {
          return this._balanceObj[stockCode].getAdvanceReceiptsPercent()[0];
        },
        _getROE: function(stockCode) {
          var i, index, len, netAssets, netAssetsTable, netProfitsTable, roe, roeTable;
          netAssetsTable = this._balanceObj[stockCode].getNetAssets();
          netProfitsTable = this._profitObj[stockCode].getNetProfitTable();
          roeTable = [];
          for (index = i = 0, len = netAssetsTable.length; i < len; index = ++i) {
            netAssets = netAssetsTable[index];
            if (index >= netAssetsTable.length - 1) break;
            roe = (netProfitsTable[index] / ((netAssets + netAssetsTable[index + 1]) / 2) * 100).toFixed(2);
            roeTable.push(roe + "\t");
          }
          return roeTable;
        },
        _getNetProfitQuality: function(stockCode) {
          var i, index, len, netProfit, netProfitTable, ratioTable, workCashFlowTable;
          netProfitTable = this._profitObj[stockCode].getNetProfitTable();
          workCashFlowTable = this._cashFlowObj[stockCode].getWorkCashFlow();
          ratioTable = [];
          for (index = i = 0, len = netProfitTable.length; i < len; index = ++i) {
            netProfit = netProfitTable[index];
            ratioTable.push((workCashFlowTable[index] / netProfit).toFixed(2));
          }
          return ratioTable;
        },
        _getStockTableInfo: function(matchStockTable) {
          var advanceReceipt, debt, i, incomeAddRatio, len, length, netProfitQuality, pe, profitAddRatio, receivableTurnoverDays, roe, stockCode, stockInfoTable;
          profitAddRatio = this._editboxDataObj.profitAddRatio;
          roe = this._editboxDataObj.roe;
          pe = this._editboxDataObj.pe;
          advanceReceipt = this._editboxDataObj.advanceReceipt;
          receivableTurnoverDays = this._editboxDataObj.receivableTurnoverDays;
          netProfitQuality = this._editboxDataObj.netProfitQuality;
          debt = this._editboxDataObj.debt;
          incomeAddRatio = this._editboxDataObj.incomeAddRatio;
          stockInfoTable = [];
          stockInfoTable.push("\u6838\u5229\u590d\u589e\u7387: " + this._editboxDataObj.coreProfitAdd);
          stockInfoTable.push("ROE:" + roe);
          stockInfoTable.push("\u51c0\u5229\u7387: " + this._editboxDataObj.netProfitRatio);
          stockInfoTable.push("\u81ea\u7531\u73b0\u91d1\u7387: " + this._editboxDataObj.freeCash);
          cc.log("info :" + JSON.stringify(this._editboxDataObj));
          stockInfoTable.push("PE:" + pe);
          stockInfoTable.push("\n\u80a1\u7968\u4ee3\u7801 \t \u57fa\u672c\u4fe1\u606f \t \u6240\u5c5e\u884c\u4e1a \t \t  \t  \u603b\u6570:" + matchStockTable.length);
          for (i = 0, len = matchStockTable.length; i < len; i++) {
            stockCode = matchStockTable[i];
            stockInfoTable.push(this._getStockInfo(stockCode));
          }
          console.log(stockInfoTable);
          length = stockInfoTable.length;
          if (stockInfoTable.length > 100) {
            stockInfoTable = stockInfoTable.slice(0, 100);
            stockInfoTable.push("too many stock:" + length);
          }
          return stockInfoTable;
        },
        _getStockInfo: function(stockCode) {
          var PE, aveRoe, baseInfo, coreProfitAddRatio, jingLiLv, roeTable, totalScore, xianJingLiu;
          baseInfo = this._profitObj[stockCode].getStockName() + "----" + this._profitObj[stockCode].getIndustry();
          coreProfitAddRatio = this._getCoreProfitAddRatio(stockCode);
          roeTable = this._getROE(stockCode);
          aveRoe = utils.getAverage(roeTable);
          PE = this._profitObj[stockCode].getPETTM();
          jingLiLv = this._profitObj[stockCode].getNetProfitRatio()[0];
          xianJingLiu = this._getFreeCashRatio(stockCode).toFixed(2);
          totalScore = Number(coreProfitAddRatio) + Number(aveRoe) + Number(jingLiLv) + 100 * Number(xianJingLiu);
          return "\n" + utils.addTab(this._profitObj[stockCode].getStockCode()) + utils.addTab("\u603b\u5206:" + totalScore.toFixed(2)) + utils.addTab(baseInfo) + utils.addTab("\u6838\u5229\u590d\u589e\u7387:" + coreProfitAddRatio) + utils.addTab("roe:" + aveRoe) + utils.addTab("\u51c0\u5229\u7387:" + jingLiLv) + utils.addTab("\u81ea\u7531\u73b0\u91d1\u6bd4:" + xianJingLiu) + utils.addTab("PE:" + PE) + utils.addTab("\u4e0a\u5e02:" + this._profitObj[stockCode].getOnMarketTime()) + "\u65f6:" + this._balanceObj[stockCode].getExistYears();
        },
        _getReceivableTurnOverDays: function(stockCode) {
          var day, inComeValueTable, receivableValueTable;
          console.log("stockCode:" + stockCode);
          receivableValueTable = this._balanceObj[stockCode].getReceivableValue();
          inComeValueTable = this._profitObj[stockCode].getIncomeValue();
          day = 360 / inComeValueTable[0] * (receivableValueTable[0] + receivableValueTable[1]) / 2;
          day = day.toFixed(2);
          return day;
        },
        _getInventoryTurnoverDays: function(stockCode) {
          var averageInventory, day, operatingCosts;
          averageInventory = this._balanceObj[stockCode].getAverageInventoryTable()[0];
          operatingCosts = this._profitObj[stockCode].getOperatingCosts()[0];
          day = (360 / (operatingCosts / averageInventory)).toFixed(2);
          return day;
        },
        _getPayableTurnoverDays: function(stockCode) {
          var averagePayable, day, operatingCosts;
          averagePayable = this._balanceObj[stockCode].getAveragePayable()[0];
          operatingCosts = this._profitObj[stockCode].getOperatingCosts()[0];
          day = (360 / (operatingCosts / averagePayable)).toFixed(2);
          return day;
        },
        _getCashTurnoverDays: function(stockCode) {
          var cashTurnoverDays, inventoryTurnoverDays, payableTurnoverDays, receivableTurnoverDays;
          receivableTurnoverDays = this._getReceivableTurnOverDays(stockCode);
          inventoryTurnoverDays = this._getInventoryTurnoverDays(stockCode);
          payableTurnoverDays = this._getPayableTurnoverDays(stockCode);
          cashTurnoverDays = parseFloat(receivableTurnoverDays) + parseFloat(inventoryTurnoverDays) - parseFloat(payableTurnoverDays);
          return cashTurnoverDays.toFixed(2);
        },
        _loadTableByType: function(dir) {
          if (this._loadingFileStatus) return;
          global.canLoad = true;
          return this._loadTable(dir);
        },
        onLoad800: function() {
          return this._loadTableByType("hs800");
        },
        onLoad1000: function() {
          return this._loadTableByType("zz1000");
        },
        onLoadAll: function() {
          return this._loadTableByType("allA");
        },
        onLoadSubNew: function() {
          return this._loadTableByType("sub_new");
        },
        _filterIncomeChengBen: function(stockCode) {
          var cost, costTable, i, income, incomeTable, index, len;
          incomeTable = this._cashFlowObj[stockCode].getSellGoodsMoney();
          costTable = this._profitObj[stockCode].getYingYeZongChengBen();
          for (index = i = 0, len = incomeTable.length; i < len; index = ++i) {
            income = incomeTable[index];
            cost = costTable[index];
            if (!(income > cost)) return false;
          }
          return true;
        },
        _totalMarketMin100: function(stockCode) {
          var totalMarketValue;
          totalMarketValue = this._balanceObj[stockCode].getTotalMarketValue();
          if (totalMarketValue < 100) return true;
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {
    "../StockInfoTable": "StockInfoTable",
    "../globalValue": "globalValue",
    "../model/BalanceSheet": "BalanceSheet",
    "../model/CashFlowStatement": "CashFlowStatement",
    "../model/ProfitStatement": "ProfitStatement",
    "../tools/utils": "utils"
  } ],
  globalValue: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7ab64pi+8BHwo5m+hF9oHkt", "globalValue");
    (function() {
      module.exports = {
        year: 6,
        count: 0,
        canLoad: true,
        isNoAd: false,
        isShowMid: false
      };
    }).call(this);
    cc._RF.pop();
  }, {} ],
  help: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2c127553xJv6zt7yT4wfBh", "help");
    (function() {
      var global;
      global = require("../globalValue");
      cc.Class({
        extends: cc.Component,
        properties: {
          m_help_content: cc.Label,
          m_no_ad_tips: cc.Label
        },
        update: function(dt) {},
        onFollow: function() {
          this._clickFollowCount++;
          if (this._clickFollowCount < 3) return;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("clearAd");
          global.isNoAd = true;
          cc.sys.localStorage.setItem("isNoAd", true);
          return this.m_no_ad_tips.string = "\u611f\u8c22\u5173\u6ce8\uff0c\u754c\u9762\u5e7f\u544a\u5df2\u6e05\u9664";
        },
        onLoad: function() {
          var ref;
          this._clickFollowCount = 0;
          this.m_no_ad_tips.string = "\u5173\u6ce8\u5fae\u4fe1\u516c\u4f17\u53f7\uff0c\u53ef\u6e05\u9664\u5e7f\u544a";
          this.m_help_content.string = "\u6838\u5fc3\u529f\u80fd\u4ecb\u7ecd\uff1a\n\n \u5e7f\u544a\uff1a\u6b22\u8fce\u5173\u6ce8\u5fae\u4fe1\u516c\u4f17\u53f7\uff1aArkad\u7684\u5c0f\u4e66\u7ae5\n\n \u57fa\u672c\u67e5\u8be2\uff1a 1\u3001\u5148\u8f93\u5165\u4ee3\u7801\u6216\u540d\u79f0\uff0c\u67e5\u8be2\u4e00\u5bb6\u4f01\u4e1a 2\u3001\u70b9\u51fb\u5c4f\u5e55\u4e0a\u65b9--\x3e\u52a0\u8f7d<--\u6309\u94ae\uff0c\u7528\u4e8e\u52a0\u8f7d\u540c\u884c\u4e1a\u7684\u4f01\u4e1a\u6570\u636e 3\u3001\u518d\u6b21\u70b9\u51fb\u83b7\u53d6\u4fe1\u606f\u6309\u94ae\uff0c\u5f97\u5230\u884c\u4e1a\u7684\u5404\u79cd\u6570\u636e \u5176\u4ed6\u529f\u80fd\uff1a 1\u3001\u6838\u5fc3\u6307\u6807\u56db\u4e2a \uff1a\u5229\u6da6\u589e\u957f\u7387\uff0c ROE\uff0c \u51c0\u5229\u7387\uff0c\u81ea\u7531\u73b0\u91d1\u6d41\u5360\u6bd4\uff0c\u91c7\u7528\u5386\u5e74\u5e73\u5747\n 2\u3001\u4e2a\u80a1\u8bc4\u5206\u529f\u80fd\uff0c\u901a\u8fc7\u8d44\u4ea7\u8d1f\u503a\u8868\uff0c\u5229\u6da6\u542b\u91d1\u91cf\uff0cROE\u7b49\uff0c\u5feb\u901f\u8bc4\u5206\uff0c\u5e76\u5217\u51fa\u91cd\u5927\u52a0\u5206\u9879\u548c\u51cf\u5206\u9879\uff0c\u4e3a\u8fdb\u4e00\u6b65\u7814\u7a76\u4f01\u4e1a\u63d0\u4f9b\u7ebf\u7d22\n \u4e00\u3001\u67e5\u8be2\u5355\u4e2a\u80a1\u7968\u7684\u57fa\u672c\u4fe1\u606f\n 1\u3001\u6253\u5f00\u67e5\u8be2\u9875\u9762\n 2\u3001\u5728\u80a1\u7968\u4ee3\u7801\u540e\u9762\u7684\u8f93\u5165\u6846\u5185\u8f93\u5165\u80a1\u7968\u4ee3\u7801\u6216\u540d\u79f0\u67e5\u8be2\n 3\u3001\u5982\u679c\u60f3\u6539\u53d8\u7edf\u8ba1\u65f6\u95f4\uff0c\u5219\u5728\u65f6\u95f4\u540e\u9762\u7684\u8f93\u5165\u6846\u5185\u8f93\u5165\u5bf9\u5e94\u7684\u5e74\u6570\n 4\u3001\u6838\u5fc3\u6570\u636e\uff0c\u8d44\u4ea7\u8d1f\u503a\u8868\u3001\u5229\u6da6\u8868\u3001\u73b0\u91d1\u6d41\u91cf\u8868\u3001\u8425\u8fd0\u80fd\u529b\u7b49\u7684\u6570\u636e\u89e3\u6790\n 5\u3001\u89e3\u5229\u6da6\u8868\uff0c\u6536\u5165\u767e\u5206\u6bd4\u62c6\u89e3\uff0c\u5355\u5b63\u5ea6\u6536\u5165\u589e\u957f\u60c5\u51b5\u7b49\n 6\u3001\u968f\u673a\u4e00\u4e0b\uff0c\u6709\u65f6\u5019\u60f3\u770b\u6570\u636e\uff0c\u4f46\u4e0d\u60f3\u8f93\u5165\u56fa\u5b9a\u7684\u4ee3\u7801\uff0c\u5c31\u778e\u627e\u4e00\u4e2a\u770b\n 7\u3001\u9010\u884c\u5bf9\u6bd4\uff0c\u5c06\u4e24\u5bb6\u516c\u53f8\u627e\u51fa\u6765\uff0c\u6309\u8d44\u4ea7\u8d1f\u503a\u8868\u53ca\u5176\u4ed6\u6307\u6807\u8fdb\u884c\u4e00\u4e00\u5bf9\u6bd4 \u4e8c\u3001\u67e5\u8be2\u884c\u4e1a\u5bf9\u6bd4\u6570\u636e\n 1\u3001\u5728\u67e5\u8be2\u4e2a\u80a1\u7684\u57fa\u7840\u4e0a\uff0c\u70b9\u51fb\u9875\u9762\u4e0a\u65b9\u7684\u52a0\u8f7d\n 2\u3001\u52a0\u8f7d\u5b8c\u6210\u540e\u70b9\u51fb\u884c\u4e1a\u5bf9\u6bd4\u6309\u94ae\uff0c\u4fbf\u53ef\u4ee5\u770b\u5230\u6570\u636e\n \u4e09\u3001\u7b5b\u9009\u80a1\u7968\n 1\u3001\u70b9\u51fb\u7b5b\u9009\u6309\u94ae\uff0c\u8fdb\u5165\u6761\u4ef6\u7f16\u8f91\u754c\u9762\n 2\u3001\u5728\u5bf9\u5e94\u7684\u9879\u586b\u5165\u76f8\u5e94\u6570\u636e\uff0c\u6ce8\u610f\uff1a\u8fd9\u4e2a\u5730\u65b9\u6ca1\u6709\u505a\u8fb9\u754c\u5904\u7406\uff0c\u8bf7\u6309\u63d0\u793a\u586b\uff0c\u4e0d\u7136\u4f1a\u51fa\u9519\uff08\u61d2\u5f97\u5904\u7406\uff09\uff0c\u82e5\u4e0d\u60f3\u8ba9\u67d0\u4e2a\u6761\u4ef6\u751f\u6548\uff0c\u53ef\u4ee5\u586b  \u201c-1\u201d\uff0c\u7136\u540e\u70b9\u51fb\u786e\u5b9a\u3002\n 3\u3001\u5728\u663e\u793a\u754c\u9762\uff0c\u9ed8\u8ba4\u4e0d\u52a0\u8f7d\uff0c\u53ef\u81ea\u5df1\u9009\u62e9\u52a0\u8f7d\u6caa\u6df1300\uff0c\u4e2d\u8bc11000\uff0c\u6240\u6709\u80a1\u7968\u3002\n \u6ce8\uff1a\u52a0\u8f7d\u5b8c\u6210\u540e\uff0c\u9700\u8981\u70b9\u51fb\u7ee7\u7eed\u7b5b\u9009\u6309\u94ae\uff0c\u624d\u4f1a\u5237\u65b0\u7b5b\u9009\u7ed3\u679c\u3002\n \u5982\u679c\u5728\u4f7f\u7528\u8fc7\u7a0b\u4e2d\u6709\u4efb\u4f55\u7591\u95ee\uff0c\u6b22\u8fce\u54a8\u8be2\u3002\n\u8c22\u8c22\u652f\u6301\uff01:-)";
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("help");
          return "undefined" !== typeof cocosAnalytics && null !== cocosAnalytics && null != (ref = cocosAnalytics.CAEvent) ? ref.onEvent({
            eventName: "\u6253\u5f00\u5e2e\u52a9"
          }) : void 0;
        },
        onReturn: function() {
          return cc.director.loadScene("welcome");
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {
    "../globalValue": "globalValue"
  } ],
  histogram: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe9e00JJkVHbb35WvmmjvFr", "histogram");
    (function() {
      var indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) if (i in this && this[i] === item) return i;
        return -1;
      };
      cc.Class({
        extends: cc.Component,
        properties: {
          m_up_color: cc.Node,
          m_down_color: cc.Node,
          m_up_label: cc.Label,
          m_down_label: cc.Label,
          m_name: cc.Label,
          m_up_name: cc.Label,
          m_down_name: cc.Label,
          m_assets_left: cc.Label,
          m_assets_right: cc.Label
        },
        onLoad: function() {},
        setHistogramStatus: function(graphItem) {
          var leftName, leftNum, rightName, rightNum, specialItemNameTable, subjectName, subjectNumLeft, subjectNumRight;
          subjectName = graphItem.subjectName, subjectNumLeft = graphItem.subjectNumLeft, 
          subjectNumRight = graphItem.subjectNumRight, leftName = graphItem.leftName, rightName = graphItem.rightName, 
          leftNum = graphItem.leftNum, rightNum = graphItem.rightNum;
          console.log(JSON.stringify(graphItem));
          this.m_name.string = subjectName;
          this.m_up_name.string = leftName + ": ";
          this.m_down_name.string = rightName + ": ";
          this.m_up_color.setContentSize(cc.size(3 * subjectNumLeft, 15));
          this.m_down_color.setContentSize(cc.size(3 * subjectNumRight, 15));
          specialItemNameTable = [ "\u603b\u5f97\u5206", "\n\u6743\u76ca\u4e58\u6570", "\n\u8425\u6536\u542b\u91d1\u91cf", "\n\u6838\u5fc3\u5229\u6da6\u5360\u6bd4", "\nROE" ];
          if (indexOf.call(specialItemNameTable, subjectName) < 0) {
            this.m_assets_left.string = leftNum;
            this.m_assets_right.string = rightNum;
          } else {
            this.m_assets_left.string = "";
            this.m_assets_right.string = "";
          }
          this.m_up_label.string = subjectNumLeft;
          return this.m_down_label.string = subjectNumRight;
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {} ],
  profitPanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2df25UeEzNGMp+wRCyVufBA", "profitPanel");
    (function() {
      var BalanceSheet, CashFlowStatement, ProfitStatement, StockInfoTable, global, utils;
      BalanceSheet = require("../model/BalanceSheet");
      ProfitStatement = require("../model/ProfitStatement");
      CashFlowStatement = require("../model/CashFlowStatement");
      utils = require("../tools/utils");
      global = require("../globalValue");
      StockInfoTable = require("../StockInfoTable");
      cc.Class({
        extends: cc.Component,
        properties: {
          m_info: cc.Label,
          m_input_code: cc.EditBox
        },
        start: function() {
          return this.onClickButton();
        },
        onLoad: function() {
          this._balanceObj = {};
          this._profitObj = {};
          this._cashFlowObj = {};
          this._randomStockCode = null;
          this._stockCode = cc.sys.localStorage.getItem("stockCode_new") || "600519";
          this.m_input_code.placeholder = this._stockCode;
          this.onClickButton();
          return this._addEditBoxEventHandler(this.m_input_code, "code");
        },
        _addEditBoxEventHandler: function(editboxObj, type) {
          var editboxEventHandler;
          editboxEventHandler = new cc.Component.EventHandler();
          editboxEventHandler.target = this.node;
          editboxEventHandler.component = "profitPanel";
          editboxEventHandler.handler = "onTextChanged";
          editboxEventHandler.customEventData = type;
          return editboxObj.editingDidEnded.push(editboxEventHandler);
        },
        onTextChanged: function(editbox, customEventData) {
          "code" === customEventData && "" !== editbox.string && (this._stockCode = editbox.string);
        },
        onClickButton: function() {
          var info;
          if (isNaN(Number(this._stockCode)) || "" === this._stockCode) {
            this._stockCode = this._getStockCodeByName(this._stockCode);
            if ("" !== this._stockCode) {
              cc.sys.localStorage.setItem("stockCode_new", this._stockCode);
              info = this._getProfitInfo(this._stockCode);
              return this.m_info.string = info;
            }
            return this.m_info.string = "\n\n\n\u8bf7\u8f93\u5165\u6570\u5b57\u7684\u80a1\u7968\u4ee3\u7801,\u6216\u6b63\u786e\u7684\u80a1\u7968\u540d\u79f0\uff0c\u4e0d\u80fd\u542b\u6709\u5176\u4ed6\u7b26\u53f7";
          }
          true;
          cc.sys.localStorage.setItem("stockCode_new", this._stockCode);
          info = this._getProfitInfo(this._stockCode);
          return this.m_info.string = info;
        },
        _getProfitInfo: function(stockCode) {
          var incomeTable, infoTable, operatingProfitTable, otherIncomeTable, profitTable, totalCostTable;
          infoTable = [];
          if (!this._isAllTableLoadFinish(stockCode)) {
            this._loadFileToObj(stockCode);
            return "\n\n\n\n\n\n\t\t\t\u52a0\u8f7d\u4e86------" + stockCode + "------\u6240\u9700\u6587\u4ef6\uff0c\u8bf7\u91cd\u65b0\u70b9\u51fb----\u201c\u83b7\u53d6\u4fe1\u606f\u201d-----\u6765\u67e5\u770b\u4fe1\u606f\uff01";
          }
          infoTable = [];
          infoTable.push(this._profitObj[stockCode].getBaseInfo());
          infoTable.push(this._profitObj[stockCode].getPercentStructure());
          incomeTable = this._profitObj[stockCode].getQuarterIncome();
          infoTable = infoTable.concat(incomeTable);
          totalCostTable = this._profitObj[stockCode].getQuarterTotalCost();
          infoTable = infoTable.concat(totalCostTable);
          otherIncomeTable = this._profitObj[stockCode].getOtherIncome();
          infoTable = infoTable.concat(otherIncomeTable);
          operatingProfitTable = this._profitObj[stockCode].getQuarterOperatingProfit();
          infoTable = infoTable.concat(operatingProfitTable);
          profitTable = this._profitObj[stockCode].getQuarterNetProfit();
          infoTable = infoTable.concat(profitTable);
          console.log(infoTable);
          utils.webCopyString(infoTable);
          return infoTable;
        },
        _isAllTableLoadFinish: function(stockCode) {
          var balance, cashFlow, profit, ref, ref1, ref2;
          balance = null != (ref = this._balanceObj[stockCode]) ? ref.isLoadFinish() : void 0;
          profit = null != (ref1 = this._profitObj[stockCode]) ? ref1.isLoadFinish() : void 0;
          cashFlow = null != (ref2 = this._cashFlowObj[stockCode]) ? ref2.isLoadFinish() : void 0;
          return balance && profit && cashFlow;
        },
        _loadFileToObj: function(stockCode) {
          this._balanceObj[stockCode] = new BalanceSheet(stockCode);
          this._profitObj[stockCode] = new ProfitStatement(stockCode);
          return this._cashFlowObj[stockCode] = new CashFlowStatement(stockCode);
        },
        onRandomLook: function() {
          var info, stockIndex, stockTable;
          if (null === this._randomStockCode) {
            stockTable = StockInfoTable.getAllCodeTable();
            stockIndex = utils.getRandomInt(0, stockTable.length);
            this._randomStockCode = stockTable[stockIndex];
          }
          info = this._getProfitInfo(this._randomStockCode);
          "object" === typeof info && (this._randomStockCode = null);
          this._stockCode = this._randomStockCode;
          this.m_input_code.placeholder = this._stockCode;
          return this.m_info.string = info;
        },
        onReturn: function() {
          return cc.director.loadScene("query");
        },
        _getStockCodeByName: function(name) {
          var i, info, infoTable, len, stockCode;
          infoTable = StockInfoTable.getStockInfoTable();
          for (i = 0, len = infoTable.length; i < len; i++) {
            info = infoTable[i];
            if (null == info) continue;
            if (null == info[1]) continue;
            if (-1 !== info[1].indexOf(name)) {
              stockCode = info[0].slice(0, 6);
              return stockCode;
            }
          }
          return "";
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {
    "../StockInfoTable": "StockInfoTable",
    "../globalValue": "globalValue",
    "../model/BalanceSheet": "BalanceSheet",
    "../model/CashFlowStatement": "CashFlowStatement",
    "../model/ProfitStatement": "ProfitStatement",
    "../tools/utils": "utils"
  } ],
  query: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae791K6BuhPVq9zIQTCW/Vd", "query");
    (function() {
      var BalanceSheet, CashFlowStatement, CompanyInfoTable, ProfitStatement, SameIndustryCompany, StockInfoTable, defaultSelectStocks, global, selectStocks, utils, indexOf = [].indexOf || function(item) {
        for (var i = 0, l = this.length; i < l; i++) if (i in this && this[i] === item) return i;
        return -1;
      };
      BalanceSheet = require("../model/BalanceSheet");
      ProfitStatement = require("../model/ProfitStatement");
      CashFlowStatement = require("../model/CashFlowStatement");
      utils = require("../tools/utils");
      global = require("../globalValue");
      StockInfoTable = require("../StockInfoTable");
      CompanyInfoTable = require("../CompanyInfo");
      selectStocks = require("../selectStock");
      defaultSelectStocks = require("../defaultSelfSelect");
      SameIndustryCompany = require("../SameIndustryCompany");
      cc.Class({
        extends: cc.Component,
        properties: {
          m_info: cc.Label,
          m_input_code: cc.EditBox,
          m_input_time: cc.EditBox,
          m_input_subject_code: cc.EditBox,
          m_tips: cc.Label,
          m_ad_tips: cc.Label,
          m_query_node: cc.Node,
          m_industry_node: cc.Node,
          m_industry_info: cc.Label,
          m_baseInfo_node: cc.Node,
          m_subject_node: cc.Node,
          m_subject_info_node: cc.Node,
          m_baseInfo_info: cc.Label,
          m_ad_icon: cc.Node,
          m_subject_scroll_node: cc.Node,
          m_prefab_histogram: cc.Prefab,
          m_toggle_node: cc.Toggle,
          m_self_select_stock_node: cc.Node,
          m_prefab_select_code: cc.Prefab,
          m_self_select_stock_panel: cc.Node,
          m_history_content_node: cc.Node,
          m_history_panel: cc.Node,
          m_no_active_panel: cc.Node
        },
        onLoad: function() {
          this._init();
          this._addEditBoxEventHandler(this.m_input_code, "code");
          this._addEditBoxEventHandler(this.m_input_time, "time");
          this._addEditBoxEventHandler(this.m_input_subject_code, "subject_compare");
          return this._addEditBoxEventHandler(this.m_toggle_node, "toggle");
        },
        _preLoad: function() {
          StockInfoTable.preloadCsv();
          return CompanyInfoTable.preloadCsv();
        },
        _init: function() {
          var isSelfUse, ref;
          this.m_query_node.active = true;
          this.m_industry_node.active = false;
          this.m_baseInfo_node.active = false;
          this.m_subject_node.active = false;
          this.m_no_active_panel.active = false;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          this._randomStockCode = null;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("query");
          "undefined" !== typeof cocosAnalytics && null !== cocosAnalytics && null != (ref = cocosAnalytics.CAEvent) && ref.onEvent({
            eventName: "\u6253\u5f00\u67e5\u8be2\u754c\u9762"
          });
          this._balanceObj = {};
          this._profitObj = {};
          this._cashFlowObj = {};
          this._industryInfo = {};
          this._stockCode = cc.sys.localStorage.getItem("stockCode_new") || "600519";
          this._subjectCode = "600519";
          this.m_input_time.placeholder = global.year;
          this.m_input_code.placeholder = this._stockCode;
          this.m_toggle_node.isChecked = false;
          this._prepareToSaveCsvFileTable = [];
          this._prepareToSaveCsvFileTable.push([ "\u4f01\u4e1a\u540d\u79f0", "\u6838\u5fc3\u5229\u6da6", "6\u5e74\u8425\u6536\u590d\u5408\u589e\u957f\u7387", "6\u5e74\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387", "\u51c0\u5229\u7387", "ROE", "\u73b0\u91d1\u5468\u8f6c\u5929\u6570", "\u4e09\u9879\u8d39\u7528\u7387", "\u6536\u73b0\u6bd4" ]);
          this._adStringMin = "\u5fae\u4fe1\u516c\u4f17\u53f7:\u5927\u718a\u732b\u6295\u8d44";
          if (true === global.isNoAd) {
            this.m_info.string = "\u8f93\u5165  -----\u201c\u80a1\u7968\u4ee3\u7801\u201d-----  \u540e\uff0c\u70b9\u51fb ----- \u201c\u83b7\u53d6\u4fe1\u606f\u201d ----- \u67e5\u770b...";
            this.m_ad_icon.active = false;
          }
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          isSelfUse && (this.m_ad_tips.string = "");
          this._preLoadSelfSelectCode();
          this._threePageUseTable = [];
          this._rankPercentObj = {};
          this._industryLoadStatus = {};
          this._scoreRankTable = [];
          this._tryOpenAdCount = 3;
          return this._isToolActive = false;
        },
        _addEditBoxEventHandler: function(editboxObj, type) {
          var editboxEventHandler;
          editboxEventHandler = new cc.Component.EventHandler();
          editboxEventHandler.target = this.node;
          editboxEventHandler.component = "query";
          editboxEventHandler.handler = "onTextChanged";
          editboxEventHandler.customEventData = type;
          return "toggle" === type ? editboxObj.checkEvents.push(editboxEventHandler) : editboxObj.editingDidEnded.push(editboxEventHandler);
        },
        onTextChanged: function(editbox, customEventData) {
          var year;
          if ("code" === customEventData) "" !== editbox.string && (this._stockCode = editbox.string); else if ("time" === customEventData) {
            year = parseInt(editbox.string);
            if (isNaN(year)) return;
            global.year = year;
          } else "subject_compare" === customEventData ? "" !== editbox.string && (this._subjectCode = editbox.string) : "toggle" === customEventData && (global.isShowMid = !global.isShowMid);
        },
        onTongHangLook: function() {
          var codeTable, lookCode;
          null == this._stockIndex && (this._stockIndex = 0);
          null == this._lastTongHangCode && (this._lastTongHangCode = 0);
          codeTable = this._getIndustryAverage(this._stockCode, "\u83b7\u53d6\u4ee3\u7801");
          this._lastTongHangCode !== codeTable[0] && (this._stockIndex = 0);
          this._stockIndex >= codeTable.length && (this._stockIndex = 0);
          lookCode = codeTable[this._stockIndex++];
          this._compareOnebyOne(this._stockCode, lookCode);
          return this._lastTongHangCode = codeTable[0];
        },
        onRandomLook: function() {
          var info, stockIndex, stockTable;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          if (null === this._randomStockCode) {
            stockTable = StockInfoTable.getAllCodeTable();
            stockIndex = utils.getRandomInt(0, stockTable.length);
            this._randomStockCode = stockTable[stockIndex];
          }
          cc.sys.localStorage.setItem("stockCode_new", this._randomStockCode);
          info = this.getStockDetailInfo(this._randomStockCode);
          if ("object" === typeof info) {
            "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("randomLook", {
              info: this._profitObj[this._randomStockCode].getBaseInfo()
            });
            this._randomStockCode = null;
          }
          if (null != this._randomStockCode) {
            this._stockCode = this._randomStockCode;
            this.m_input_code.placeholder = this._stockCode;
          }
          return this.m_info.string = info;
        },
        onScoreFilter: function() {
          var allStockInfo, stockInfo;
          stockInfo = [];
          allStockInfo = this._lookAllStock(stockInfo);
          return this.m_info.string = allStockInfo;
        },
        onReturn: function() {
          return cc.director.loadScene("welcome");
        },
        onLookIndustryInfo: function() {
          var allRankInfo, isSelfUse, ref, stockCode;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("lookIndustryInfo");
          "undefined" !== typeof cocosAnalytics && null !== cocosAnalytics && null != (ref = cocosAnalytics.CAEvent) && ref.onEvent({
            eventName: "\u67e5\u770b\u884c\u4e1a\u5bf9\u6bd4"
          });
          this.m_query_node.active = false;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          this.m_industry_node.active = true;
          this.m_baseInfo_node.active = false;
          this.onClickButton();
          stockCode = this._stockCode;
          this.m_industry_info.string = "";
          this._industryInfo = {};
          this._getIndustryAverage(stockCode, "\u6838\u5fc3\u5229\u6da6");
          this._getIndustryAverage(stockCode, "\u8425\u6536\u590d\u5408\u589e\u957f\u7387");
          this._getIndustryAverage(stockCode, "\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387");
          this._getIndustryAverage(stockCode, "\u51c0\u5229\u7387");
          this._getIndustryAverage(stockCode, "\u51c0\u8d44\u4ea7\u6536\u76ca\u7387");
          this._getIndustryAverage(stockCode, "\u73b0\u91d1\u5468\u8f6c");
          this._getIndustryAverage(stockCode, "\u8d39\u7528\u7387");
          this._getIndustryAverage(stockCode, "\u6536\u73b0\u6bd4");
          this._getIndustryAverage(stockCode, "\u5e02\u76c8\u7387TTM");
          this._isToolActive && console.log(this._industryInfo);
          this.m_industry_info.string = JSON.stringify(this._industryInfo, null, 4);
          this._industryInfo["\u8bc4\u5206\u6392\u884c"] = this._scoreRankTable;
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          if (isSelfUse) {
            allRankInfo = JSON.stringify(this._industryInfo, null, 4);
            return utils.webCopyString(allRankInfo);
          }
        },
        onIndustryReturn: function() {
          this.m_query_node.active = true;
          this.m_industry_node.active = false;
          return this.m_baseInfo_node.active = false;
        },
        onLookBaseInfo: function() {
          var ref;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("lookCoreInfo", {
            info: null != (ref = this._profitObj[this._stockCode]) ? ref.getBaseInfo() : void 0
          });
          this.m_query_node.active = false;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          this.m_industry_node.active = false;
          this.m_baseInfo_node.active = true;
          return this._getBaseInfo();
        },
        onBaseInfoReturn: function() {
          this.m_query_node.active = true;
          this.m_industry_node.active = false;
          this.m_baseInfo_node.active = false;
          this.m_self_select_stock_panel.active = false;
          return this.m_history_panel.active = false;
        },
        onSubjectCompare: function() {
          this.m_query_node.active = false;
          this.m_industry_node.active = false;
          this.m_baseInfo_node.active = false;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          return this.m_subject_node.active = true;
        },
        _createHistogramNode: function(graphItem) {
          var histogramNode;
          histogramNode = cc.instantiate(this.m_prefab_histogram);
          histogramNode.getComponent("histogram").setHistogramStatus(graphItem);
          return histogramNode;
        },
        _getScoreInString: function(str) {
          if (str.indexOf("-------\u52a0\u5206") > 0) return Number(str.substring(str.indexOf("\u5f53\u524d\u503c") + 5, str.indexOf("-------\u52a0\u5206") - 1));
          if (str.indexOf("-------\u51cf\u5206") > 0) return Number(str.substring(str.indexOf("\u5f53\u524d\u503c") + 5, str.indexOf("-------\u51cf\u5206") - 1));
          if (str.indexOf("-------\u9700\u8981") > 0) return Number(str.substring(str.indexOf("\u5f53\u524d\u503c") + 5, str.indexOf("-------\u9700\u8981") - 1));
          if (str.indexOf("------- \u6b63\u5e38") > 0) return Number(str.substring(str.indexOf("\u5f53\u524d\u503c") + 5, str.indexOf("------- \u6b63\u5e38") - 1));
          return null;
        },
        _getTotalScoreByStr: function(strTable) {
          var firstPos, score, totalScoreStr;
          totalScoreStr = strTable[strTable.length - 3];
          firstPos = totalScoreStr.indexOf("\u603b\u5f97\u5206") + 5;
          score = totalScoreStr.substring(firstPos, totalScoreStr.indexOf("\u5206", firstPos));
          return score;
        },
        onBeginSubjectCompare: function() {
          return this._compareOnebyOne(this._stockCode, this._subjectCode);
        },
        _addOtherInfo: function(leftCode, leftTable, rightCode, rightTable) {
          leftTable.push(this._getStaffInfo(leftCode));
          return rightTable.push(this._getStaffInfo(rightCode));
        },
        _compareOnebyOne: function(leftCode, rightCode) {
          var allGraphItems, allSubject, graphItem, group, index, info, j, k, leftName, leftNum, leftSubject, leftTotalScore, len, len1, node, ref, ref1, ref2, ref3, rightName, rightNum, rightSubject, rightTotalScore, subjectName, subjectNumLeft, subjectNumRight;
          (isNaN(Number(rightCode)) || "" === rightCode) && (rightCode = this._getStockCodeByName(rightCode));
          if (!this._isAllTableLoadFinish(leftCode)) {
            this._loadFileToObj(leftCode);
            return this.m_subject_info_node.getComponent("cc.Label").string = "\n\n\n\n\n\n\t\t\t\t\t\u52a0\u8f7d\u4e86------" + leftCode + "------\u6240\u9700\u6587\u4ef6\uff0c\u8bf7\u91cd\u65b0\u70b9\u51fb----\u201c\u83b7\u53d6\u4fe1\u606f\u201d-----\u6765\u67e5\u770b\u4fe1\u606f\uff01";
          }
          if (!this._isAllTableLoadFinish(rightCode)) {
            this._loadFileToObj(rightCode);
            return this.m_subject_info_node.getComponent("cc.Label").string = "\n\n\n\n\n\n\t\t\t\t\t\u52a0\u8f7d\u4e86------" + rightCode + "------\u6240\u9700\u6587\u4ef6\uff0c\u8bf7\u91cd\u65b0\u70b9\u51fb----\u201c\u83b7\u53d6\u4fe1\u606f\u201d-----\u6765\u67e5\u770b\u4fe1\u606f\uff01";
          }
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("onSubjectCompare", {
            info: [ null != (ref = this._profitObj[leftCode]) ? ref.getStockName() : void 0, null != (ref1 = this._profitObj[rightCode]) ? ref1.getStockName() : void 0 ]
          });
          leftSubject = [];
          rightSubject = [];
          this.m_subject_scroll_node.removeAllChildren();
          this._getScore(leftCode, leftSubject, false, 0, true);
          this._getScore(rightCode, rightSubject, false, 0, true);
          leftTotalScore = this._getTotalScoreByStr(leftSubject);
          rightTotalScore = this._getTotalScoreByStr(rightSubject);
          this._addOtherInfo(leftCode, leftSubject, rightCode, rightSubject);
          allSubject = [];
          leftName = null != (ref2 = this._profitObj[leftCode]) ? ref2.getStockName() : void 0;
          rightName = null != (ref3 = this._profitObj[rightCode]) ? ref3.getStockName() : void 0;
          node = this._createHistogramNode({
            subjectName: "\u603b\u5f97\u5206",
            subjectNumLeft: leftTotalScore,
            subjectNumRight: rightTotalScore,
            leftName: leftName,
            rightName: rightName
          });
          this.m_subject_scroll_node.addChild(node);
          node.setPosition(cc.Vec2(200, 0));
          allGraphItems = [];
          for (index = j = 0, len = leftSubject.length; j < len; index = ++j) {
            info = leftSubject[index];
            if (0 === index) continue;
            subjectNumLeft = this._getScoreInString(info);
            if (null != subjectNumLeft) {
              subjectNumRight = this._getScoreInString(rightSubject[index]);
              subjectName = info.substring(0, info.indexOf("-"));
              leftNum = utils.getValueDillion(subjectNumLeft * this._balanceObj[leftCode].getTotalAssets()[0] / 100);
              rightNum = utils.getValueDillion(subjectNumRight * this._balanceObj[rightCode].getTotalAssets()[0] / 100);
              allGraphItems.push({
                subjectName: subjectName,
                subjectNumLeft: subjectNumLeft,
                subjectNumRight: subjectNumRight,
                leftName: leftName,
                rightName: rightName,
                leftNum: leftNum,
                rightNum: rightNum
              });
            } else {
              allSubject.push(info + "-----" + leftName);
              allSubject.push(rightSubject[index] + "-----" + rightName);
              allSubject.push("\n");
            }
          }
          this._isToolActive && console.log(allSubject);
          group = [];
          for (k = 0, len1 = allGraphItems.length; k < len1; k++) {
            graphItem = allGraphItems[k];
            group.push(graphItem);
            if (2 === group.length) {
              this._createGroupPanel(group);
              group = [];
            } else index === allGraphItems.length - 1 && this._createGroupPanel(group);
          }
          node = cc.instantiate(this.m_subject_info_node);
          this.m_subject_scroll_node.addChild(node);
          return node.getComponent("cc.Label").string = allSubject;
        },
        _createGroupPanel: function(group) {
          var graphItem, histogramNode, index, j, len, node;
          node = new cc.Node();
          node.setAnchorPoint(cc.Vec2(0, 0));
          node.setContentSize(cc.size(800, 60));
          for (index = j = 0, len = group.length; j < len; index = ++j) {
            graphItem = group[index];
            histogramNode = this._createHistogramNode(graphItem);
            histogramNode.setPosition(cc.Vec2(520 * index, 0));
            node.addChild(histogramNode);
          }
          return this.m_subject_scroll_node.addChild(node);
        },
        onSubjectReturn: function() {
          this.m_query_node.active = true;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          this.m_industry_node.active = false;
          this.m_baseInfo_node.active = false;
          return this.m_subject_node.active = false;
        },
        _lookStockInSelectTable: function() {
          var allStockInfo, info, j, len, stockName;
          allStockInfo = {};
          for (j = 0, len = selectStocks.length; j < len; j++) {
            stockName = selectStocks[j];
            this._stockCode = this._getStockCodeByName(stockName);
            if ("" !== this._stockCode) {
              cc.sys.localStorage.setItem("stockCode_new", this._stockCode);
              info = this.getStockDetailInfo(this._stockCode);
              if ("object" === typeof info) {
                null == allStockInfo[stockName] && (allStockInfo[stockName] = []);
                allStockInfo[stockName].push(info[2]);
                allStockInfo[stockName].push(info[3]);
                allStockInfo[stockName].push(info[7]);
                allStockInfo[stockName].push(info[8]);
                allStockInfo[stockName].push(info[9]);
                allStockInfo[stockName].push(info[10]);
              }
            }
          }
          this._isToolActive && console.log("select stocks info :" + JSON.stringify(allStockInfo, null, 4));
        },
        setStockCode: function(stockCode) {
          return this._stockCode = stockCode;
        },
        onClickButton: function() {
          var info;
          this.m_self_select_stock_panel.active = false;
          this.m_history_panel.active = false;
          if (isNaN(Number(this._stockCode)) || "" === this._stockCode) {
            this._stockCode = this._getStockCodeByName(this._stockCode);
            if ("" !== this._stockCode) {
              cc.sys.localStorage.setItem("stockCode_new", this._stockCode);
              info = this.getStockDetailInfo(this._stockCode);
              "object" === typeof info && "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("normalLook", {
                info: this._profitObj[this._stockCode].getBaseInfo()
              });
              return this.m_info.string = info;
            }
            return this.m_info.string = "\n\n\n\u8bf7\u8f93\u5165\u6570\u5b57\u7684\u80a1\u7968\u4ee3\u7801,\u6216\u6b63\u786e\u7684\u80a1\u7968\u540d\u79f0\uff0c\u4e0d\u80fd\u542b\u6709\u5176\u4ed6\u7b26\u53f7";
          }
          true;
          cc.sys.localStorage.setItem("stockCode_new", this._stockCode);
          info = this.getStockDetailInfo(this._stockCode);
          "object" === typeof info && "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("normalLook", {
            info: this._profitObj[this._stockCode].getBaseInfo()
          });
          return this.m_info.string = info;
        },
        _getStockCodeByName: function(name) {
          var info, infoTable, j, len, stockCode;
          infoTable = StockInfoTable.getStockInfoTable();
          for (j = 0, len = infoTable.length; j < len; j++) {
            info = infoTable[j];
            if (null == info) continue;
            if (null == info[1]) continue;
            if (-1 !== info[1].indexOf(name)) {
              stockCode = info[0].slice(0, 6);
              return stockCode;
            }
          }
          return "";
        },
        _getAdvanceReceiptsPercent: function(stockCode) {
          return this._balanceObj[stockCode].getAdvanceReceiptsPercent()[0];
        },
        _getReceivableTurnOverDays: function(stockCode) {
          var daysTable, j, len, ratio, ratioTable;
          ratioTable = this._getRecievableTurnRatio(stockCode);
          daysTable = [];
          for (j = 0, len = ratioTable.length; j < len; j++) {
            ratio = ratioTable[j];
            daysTable.push((360 / ratio).toFixed(2));
          }
          return daysTable;
        },
        _getRecievableTurnRatio: function(stockCode) {
          var averageRecievable, day, daysTable, inComeValueTable, index, j, len, receivable, receivableValueTable;
          receivableValueTable = this._balanceObj[stockCode].getReceivableValue();
          inComeValueTable = this._profitObj[stockCode].getIncomeValue();
          daysTable = [];
          for (index = j = 0, len = receivableValueTable.length; j < len; index = ++j) {
            receivable = receivableValueTable[index];
            averageRecievable = (receivableValueTable[index] + receivableValueTable[index + 1]) / 2;
            day = (inComeValueTable[index] / averageRecievable).toFixed(2);
            daysTable.push(day);
          }
          return daysTable;
        },
        _isAllTableLoadFinish: function(stockCode) {
          var balance, cashFlow, profit, ref, ref1, ref2;
          balance = null != (ref = this._balanceObj[stockCode]) ? ref.isLoadFinish() : void 0;
          profit = null != (ref1 = this._profitObj[stockCode]) ? ref1.isLoadFinish() : void 0;
          cashFlow = null != (ref2 = this._cashFlowObj[stockCode]) ? ref2.isLoadFinish() : void 0;
          return balance && profit && cashFlow;
        },
        _getROE: function(stockCode) {
          var index, j, len, netAssets, netAssetsTable, netProfitsTable, roe, roeTable;
          netAssetsTable = this._balanceObj[stockCode].getNetAssets();
          netProfitsTable = this._profitObj[stockCode].getNetProfitTable();
          roeTable = [];
          for (index = j = 0, len = netAssetsTable.length; j < len; index = ++j) {
            netAssets = netAssetsTable[index];
            if (index >= netAssetsTable.length - 1) break;
            roe = (netProfitsTable[index] / ((netAssets + netAssetsTable[index + 1]) / 2) * 100).toFixed(2);
            roeTable.push(roe);
          }
          return roeTable;
        },
        _loadFileToObj: function(stockCode) {
          this._balanceObj[stockCode] = new BalanceSheet(stockCode);
          this._profitObj[stockCode] = new ProfitStatement(stockCode);
          return this._cashFlowObj[stockCode] = new CashFlowStatement(stockCode);
        },
        getStockDetailInfo: function(stockCode) {
          var PE, aveRoe, baseScore, copyInfo, coreProfitAddRatio, earnMoney, freeCashRatio, importInfo, infoTable, isSelfUse, j, netProfitAddRatio, netProfitRatio, overTheYearScore, ref, ref1, ref2, stockHolderMoney, stockPrice, threePageInfo, threePageInfoStatus, totalAssets, totalDebts, totalStockValue, yearIndex;
          infoTable = [];
          if ("998666" === stockCode) {
            cc.sys.localStorage.setItem("self_use", true);
            return "ad_clear";
          }
          if ("999666" === stockCode) {
            cc.sys.localStorage.setItem("self_use", false);
            return "ad_show";
          }
          if ("929520" === stockCode) {
            cc.sys.localStorage.setItem("threee_page_status", "ok");
            return "open_threee_page";
          }
          if ("929521" === stockCode) {
            cc.sys.localStorage.setItem("threee_page_status", "no");
            return "close_threee_page";
          }
          if ("835769" === stockCode) {
            cc.sys.localStorage.setItem("active_status", true);
            this.m_no_active_panel.active = false;
            return "\u6fc0\u6d3b\u6210\u529f";
          }
          if (!this._isAllTableLoadFinish(stockCode)) {
            this._loadFileToObj(stockCode);
            return "\n\n\n\n\n\n\t\t\t\t\t\u52a0\u8f7d\u4e86------" + stockCode + "------\u6240\u9700\u6587\u4ef6\uff0c\u8bf7\u91cd\u65b0\u70b9\u51fb----\u201c\u83b7\u53d6\u4fe1\u606f\u201d-----\u6765\u67e5\u770b\u4fe1\u606f\uff01";
          }
          this._companyInfo = CompanyInfoTable.getCompanyInfoByCode(stockCode);
          this._addOpenCount();
          this._tryOpenAd();
          this._tryShowActiveCodePanel();
          this._onAddHistroyQuery(stockCode);
          infoTable.push("\n\u57fa\u672c\u4fe1\u606f:   " + this._profitObj[stockCode].getBaseInfo());
          infoTable.push("\n\u4e0a\u5e02\u65f6\u95f4\uff1a " + this._profitObj[stockCode].getOnMarketTime());
          PE = this._profitObj[stockCode].getPETTM();
          stockPrice = this._profitObj[stockCode].getSharePrice();
          totalAssets = utils.getValueDillion(this._balanceObj[stockCode].getTotalAssets()[0]);
          totalStockValue = utils.addBillionUnit(this._balanceObj[stockCode].getTotalMarketValue());
          totalDebts = utils.getValueDillion(this._balanceObj[stockCode].getTotalDebts()[0]);
          infoTable.push("\nPETTM:" + PE + "\t\u5bf9\u5e94\u80a1\u4ef7:" + stockPrice + ", \u603b\u8d44\u4ea7\uff1a" + totalAssets + "\uff0c \u603b\u8d1f\u503a:" + totalDebts + ", \u603b\u5e02\u503c\uff1a" + totalStockValue);
          infoTable.push("\n" + this._getStaffInfo(stockCode));
          ref = this._getMostImportantData(stockCode), coreProfitAddRatio = ref.coreProfitAddRatio, 
          netProfitRatio = ref.netProfitRatio, aveRoe = ref.aveRoe, freeCashRatio = ref.freeCashRatio, 
          netProfitAddRatio = ref.netProfitAddRatio;
          importInfo = [];
          importInfo.push("\n--------------------\u91cd\u8981\u6570\u636e--------------------");
          importInfo.push("\n\u4e00\u4e00\u8425\u6536\u590d\u5408\u589e\u957f\u7387: (" + this._profitObj[stockCode].getIncomeAddRatio() + "%),\u6700\u65b0\u5e74\u4efd: (" + this._profitObj[stockCode].getIncomeYoy()[0] + "%)");
          importInfo.push("\n\u4e00\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387: ( " + netProfitAddRatio + "%), \u6700\u65b0\u5e74\u4efd\uff1a(" + this._profitObj[stockCode].getNetProfitYoy()[0] + "%)");
          importInfo.push("\n\u4e00\u4e00\u4e00\u4e00\u4e00\u5e73\u5747ROE: ( " + aveRoe + "% )\uff0c\u6700\u65b0\u5e74\u4efd:( " + this._getROE(stockCode)[0] + "% )");
          importInfo.push("\n\u4e00\u4e00\u4e00\u4e00\u5e73\u5747\u51c0\u5229\u7387: ( " + netProfitRatio + "% )\uff0c\u6700\u65b0\u5e74\u4efd:( " + this._profitObj[stockCode].getNetProfitRatio()[0] + "% )");
          importInfo.push("\n\u4e00\u4e00\u4e00\u81ea\u7531\u73b0\u91d1\u5360\u6bd4: ( " + freeCashRatio + "% ), \u6700\u65b0\u5e74\u4efd: ( " + (this._cashFlowObj[stockCode].getFreeMoneyFlow()[0] / this._profitObj[stockCode].getNetProfitTable()[0] * 100).toFixed(2) + "% )");
          importInfo.push("\n\u7edf\u8ba1\u65f6\u95f4\uff1a" + this._balanceObj[stockCode].getExistYears() + "\u5e74\n");
          infoTable = infoTable.concat(importInfo);
          baseScore = parseFloat(coreProfitAddRatio) + parseFloat(netProfitRatio) + 3 * parseFloat(aveRoe) + parseFloat(freeCashRatio);
          infoTable.push("\n\u6570\u636e\u5f97\u5206\uff1a" + Math.floor(baseScore) + ", \u7edf\u8ba1\u65f6\u95f4\uff1a" + this._balanceObj[stockCode].getExistYears() + "\u5e74");
          threePageInfo = this._addThreeMinitePage(stockCode, importInfo, netProfitAddRatio, aveRoe, netProfitRatio, freeCashRatio);
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          if (isSelfUse) {
            copyInfo = threePageInfo;
            utils.webCopyString(copyInfo);
          }
          infoTable.push(threePageInfo);
          this._isToolActive && console.log(threePageInfo);
          this._getScore(stockCode, infoTable, false, 0);
          threePageInfoStatus = cc.sys.localStorage.getItem("threee_page_status") || "";
          overTheYearScore = [];
          overTheYearScore.push("\n" + this._profitObj[stockCode].getStockName() + ": ");
          for (yearIndex = j = 0, ref1 = global.year; 0 <= ref1 ? j < ref1 : j > ref1; yearIndex = 0 <= ref1 ? ++j : --j) overTheYearScore.push(this._getScore(stockCode, [], true, yearIndex).toFixed(2) + "\u5206  ");
          this._isToolActive && console.log("overTheYearScore:" + JSON.stringify(overTheYearScore));
          infoTable.push("\n\u5386\u5e74\u8d22\u52a1\u8bc4\u5206\uff1a" + overTheYearScore);
          infoTable.push("\n\u6295\u8d44\u6027\u8d44\u4ea7\u5360\u6bd4: " + this._balanceObj[stockCode].getInvestAssets() + "%");
          infoTable.push("\n\u6709\u606f\u8d1f\u503a: \u5360\u603b\u8d44\u4ea7\u6bd4\u7387: " + this._balanceObj[stockCode].getInterestDebt()[0] + "%, \u91d1\u989d\uff1a" + utils.getValueDillion(this._balanceObj[stockCode].getInterestDebtNum()[0]));
          infoTable.push("\n\u8d44\u672c\u5f00\u652f\u5360\u51c0\u5229\u6da6\u6bd4\uff1a" + this._getCapitalExpenditureRatio(stockCode) + "%");
          stockHolderMoney = utils.getValueDillion(this._balanceObj[stockCode].getStockHolderMoney());
          earnMoney = utils.getValueDillion(this._balanceObj[stockCode].getEarnMoney());
          infoTable.push("\n\u8d5a\u7684\u94b1:" + earnMoney + ", \u4ece\u80a1\u4e1c\u90a3\u62ff\u7684\u94b1:" + stockHolderMoney + ", \u6bd4\u4f8b: " + this._balanceObj[stockCode].getNetAssetsStruct());
          infoTable.push("\n\u5546\u8a89:" + utils.getValueDillion(this._balanceObj[stockCode].getGoodWill()) + ", \u5360\u603b\u8d44\u4ea7\u6bd4\u4f8b:" + this._getGoodWillPercent(stockCode) + "%");
          infoTable.push("\n\u9884\u6536\u8d26\u6b3e\u5360\u603b\u8d44\u4ea7\u6bd4\u4f8b: " + this._getAdvanceReceiptsPercent(stockCode) + "%");
          infoTable.push("\n\u5e94\u6536\u8d26\u6b3e\u5468\u8f6c\u5929\u6570: " + this._getReceivableTurnOverDays(stockCode)[0]);
          infoTable.push("\n\u5b58\u8d27\u5468\u8f6c\u5929\u6570:" + this._getInventoryTurnoverDays(stockCode)[0] + "\u5929");
          infoTable.push("\n\u5e94\u4ed8\u8d26\u6b3e\u5468\u8f6c\u5929\u6570:" + this._getPayableTurnoverDays(stockCode)[0] + " \u5929");
          infoTable.push("\n\u73b0\u91d1\u5468\u8f6c\u5929\u6570\uff1a" + this._getCashTurnoverDays(stockCode) + " \u5929");
          infoTable.push("\n\u51c0\u5229\u6da6\uff08\u591a\uff09\uff0c\u603b\u548c\uff1a" + utils.getValueDillion(utils.getSummation(this._profitObj[stockCode].getNetProfitTable())) + "\uff0c " + utils.getValueDillion(this._profitObj[stockCode].getNetProfitTable()));
          infoTable.push("\n\u6bdb\u5229\u7387\uff08\u5355\uff09: " + this._profitObj[stockCode].getGrossProfitRatio()[0]);
          infoTable.push("\n\u51c0\u5229\u7387\uff08\u5355\uff09: " + this._profitObj[stockCode].getNetProfitRatio()[0]);
          infoTable.push("\n\u6838\u5fc3\u5229\u6da6\u7387 : " + this._profitObj[stockCode].getOperatingProfitRatio()[0] + " %");
          infoTable.push("\n\u6838\u5fc3\u5229\u6da6\u5360\u5229\u6da6\u603b\u989d\u6bd4\u4f8b:" + this._profitObj[stockCode].getCoreProfitRatio() + " %");
          infoTable.push("\n \u4e09\u9879\u8d39\u7528\u7387\uff1a" + this._profitObj[stockCode].getExpenseRatio()[0] + " %");
          infoTable.push("\n\u5e74\u51c0\u5229\u6da6\u589e\u957f\u7387:   " + this._profitObj[stockCode].getNetProfitYoy());
          infoTable.push("\n\u8425\u6536\u590d\u5408\u589e\u957f\u7387\uff1a" + this._profitObj[stockCode].getIncomeAddRatio() + "%");
          infoTable.push("\n\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387:   " + this._profitObj[stockCode].getNetProfitAddRatio() + "%");
          infoTable.push("\n\u6838\u5fc3\u5229\u6da6\u590d\u5408\u589e\u957f\u7387: " + this._profitObj[stockCode].getCoreProfitCompoundAddRatio() + "%");
          infoTable.push("\n\u8425\u6536\u542b\u91d1\u91cf: " + this._getIncomeQuality(stockCode) + ", \u5e73\u5747\uff1a" + utils.getAverage(this._getIncomeQuality(stockCode)));
          infoTable.push("\n\u73b0\u91d1\u6d41\u91cf\u6bd4\u51c0\u5229\u6da6:   " + this._getNetProfitQuality(stockCode) + "\u5e73\u5747:" + utils.getAverage(this._getNetProfitQuality(stockCode)));
          infoTable.push("\n\u5386\u5e74ROE:   " + this._getROE(stockCode) + "\u5e73\u5747: " + utils.getAverage(this._getROE(stockCode)) + "%");
          infoTable.push("\nROE\u5206\u89e3-----\x3e\u51c0\u5229\u7387: " + this._profitObj[stockCode].getNetProfitRatio()[0] + ", \u603b\u8d44\u4ea7\u5468\u8f6c\u7387:" + this._getTotalAssetsTurnoverRatio(stockCode)[0] + ", \u8d22\u52a1\u6760\u6746:" + this._balanceObj[stockCode].getFinancialLeverage()[0]);
          infoTable.push("\n\u7ecf\u8425\u6d3b\u52a8\u73b0\u91d1\u603b\u989d:" + utils.getValueDillion(this._cashFlowObj[stockCode].getWorkCashFlowTotal()));
          infoTable.push("\n\u6295\u8d44\u6d3b\u52a8\u6d3b\u52a8\u73b0\u91d1\u603b\u989d:" + utils.getValueDillion(this._cashFlowObj[stockCode].getTouZiTotal()));
          infoTable.push("\n\u7b79\u8d44\u6d3b\u52a8\u73b0\u91d1\u603b\u989d:" + utils.getValueDillion(this._cashFlowObj[stockCode].getChouZiTotal()));
          infoTable.push("\n\u81ea\u7531\u73b0\u91d1\u6d41\uff0c\u603b\u8ba1\uff1a" + utils.getValueDillion(utils.getSummation(this._cashFlowObj[stockCode].getFreeMoneyFlow())) + ", " + utils.getValueDillion(this._cashFlowObj[stockCode].getFreeMoneyFlow()));
          infoTable.push("\n\u7edf\u8ba1\u65f6\u95f4\uff1a " + this._balanceObj[stockCode].getExistYears() + "\u5e74");
          "undefined" !== typeof cocosAnalytics && null !== cocosAnalytics && null != (ref2 = cocosAnalytics.CAEvent) && ref2.onEvent({
            eventName: "\u67e5\u8be2\u4e2a\u80a1",
            info: this._profitObj[stockCode].getBaseInfo()
          });
          this._isToolActive && console.log(infoTable);
          false === global.isNoAd && infoTable.push("\n\u626b\u4e00\u626b\uff0c\u5173\u6ce8\u5fae\u4fe1\u516c\u4f17\u53f7\uff0c\u548c\u6211\u4e00\u8d77\u6765\u63a2\u8ba8\u6295\u8d44\u7406\u5ff5\u548c\u4f01\u4e1a\u5206\u6790\u7684\u65b9\u6cd5");
          return infoTable;
        },
        _getAveRoe: function(stockCode) {
          var aveRoe, profit1, profit2, roeTable;
          roeTable = this._getROE(stockCode);
          aveRoe = utils.getAverage(roeTable);
          profit1 = this._profitObj[stockCode].getNetProfitTable()[0];
          profit2 = this._profitObj[stockCode].getNetProfitTable()[1];
          profit1 < 0 && aveRoe > 0 && profit2 < 0 && (aveRoe *= -1);
          return aveRoe;
        },
        _getAveNetProfitRatio: function(stockCode) {
          var aveNetProfitRatio, netProfitRatio;
          netProfitRatio = this._profitObj[stockCode].getNetProfitRatio();
          aveNetProfitRatio = utils.getAverage(netProfitRatio);
          return aveNetProfitRatio;
        },
        _getMostImportantData: function(stockCode) {
          var aveNetProfitRatio, aveRoe, coreProfitAddRatio, freeCashRatio, netProfitAddRatio;
          coreProfitAddRatio = this._profitObj[stockCode].getCoreProfitCompoundAddRatio();
          netProfitAddRatio = this._profitObj[stockCode].getNetProfitAddRatio();
          aveNetProfitRatio = this._getAveNetProfitRatio(stockCode);
          aveRoe = this._getAveRoe(stockCode);
          freeCashRatio = this._getFreeCashRatio(stockCode).toFixed(2);
          return {
            coreProfitAddRatio: coreProfitAddRatio,
            netProfitRatio: aveNetProfitRatio,
            aveRoe: aveRoe,
            freeCashRatio: freeCashRatio,
            netProfitAddRatio: netProfitAddRatio
          };
        },
        _getFreeCashRatio: function(stockCode) {
          var freeCash, profit, ratio;
          freeCash = utils.getSummation(this._cashFlowObj[stockCode].getFreeMoneyFlow());
          profit = utils.getSummation(this._profitObj[stockCode].getNetProfitTable());
          ratio = freeCash / profit;
          return 100 * ratio;
        },
        _getStaffInfo: function(stockCode) {
          var j, len, perIncome, perProfit, staffInfo, staffInfoTable, staffNumber;
          staffNumber = 0;
          staffInfoTable = StockInfoTable.getStockInfoTable();
          for (j = 0, len = staffInfoTable.length; j < len; j++) {
            staffInfo = staffInfoTable[j];
            if (-1 !== staffInfo[0].indexOf(stockCode)) {
              staffNumber = staffInfo[5];
              break;
            }
          }
          staffNumber = staffNumber.replace(/[^0-9]/gi, "");
          perIncome = (this._profitObj[stockCode].getIncomeValue()[0] / staffNumber).toFixed(2);
          perProfit = (this._profitObj[stockCode].getNetProfitTable()[0] / staffNumber).toFixed(2);
          return "\u5728\u804c\u5458\u5de5\uff1a" + staffNumber + " \u4eba, \u4eba\u5747\u521b\u6536\uff1a" + perIncome + " \u4e07\u5143, \u4eba\u5747\u521b\u5229: " + perProfit + " \u4e07\u5143";
        },
        _getAllPayStaffMoney: function(stockCode, staffNumber, isGetNumber) {
          var average, string, totalValue, value1, value2;
          value1 = this._balanceObj[stockCode].getStaffPayment();
          value2 = this._cashFlowObj[stockCode].getPayStaffCash();
          totalValue = value1 + value2;
          average = (totalValue / staffNumber / 12).toFixed(2);
          string = "\u85aa\u916c\u603b\u989d\uff1a" + utils.getValueDillion(totalValue) + "\uff0c\u5360\u51c0\u5229\u6da6\u6bd4\u4f8b\uff1a" + (totalValue / this._profitObj[stockCode].getNetProfitTable()[0]).toFixed(2);
          if (isGetNumber) return average;
          return string;
        },
        _getNetProfitQuality: function(stockCode) {
          var index, j, len, netProfit, netProfitTable, ratioTable, workCashFlowTable;
          netProfitTable = this._profitObj[stockCode].getNetProfitTable();
          workCashFlowTable = this._cashFlowObj[stockCode].getWorkCashFlow();
          ratioTable = [];
          for (index = j = 0, len = netProfitTable.length; j < len; index = ++j) {
            netProfit = netProfitTable[index];
            ratioTable.push((workCashFlowTable[index] / netProfit * 100).toFixed(2));
          }
          return ratioTable;
        },
        _getReceivableInIncomeRatio: function(stockCode) {
          var incomeValueTable, receivableTable;
          receivableTable = this._balanceObj[stockCode].getReceivableValue();
          incomeValueTable = this._profitObj[stockCode].getIncomeValue();
          return utils.getRatioTable(receivableTable, incomeValueTable);
        },
        _getIncomeQuality: function(stockCode) {
          var incomeValueTable, sellGoodsGetMoneyTable;
          incomeValueTable = this._profitObj[stockCode].getIncomeValue();
          sellGoodsGetMoneyTable = this._cashFlowObj[stockCode].getSellGoodsMoney();
          return utils.getRatioTable(sellGoodsGetMoneyTable, incomeValueTable);
        },
        _getInventoryTurnoverDays: function(stockCode) {
          var daysTable, inventoryRatioTable, j, len, ratio;
          inventoryRatioTable = this._getInventoryTurnoverRatio(stockCode);
          daysTable = [];
          for (j = 0, len = inventoryRatioTable.length; j < len; j++) {
            ratio = inventoryRatioTable[j];
            daysTable.push((360 / ratio).toFixed(2));
          }
          return daysTable;
        },
        _getInventoryTurnoverRatio: function(stockCode) {
          var averageInventory, operatingCosts;
          averageInventory = this._balanceObj[stockCode].getAverageInventoryTable();
          operatingCosts = this._profitObj[stockCode].getOperatingCosts();
          return utils.getRatioTable(operatingCosts, averageInventory, 1);
        },
        _getPayableTurnoverRatio: function(stockCode) {
          var averagePayable, operatingCosts;
          averagePayable = this._balanceObj[stockCode].getAveragePayable();
          operatingCosts = this._profitObj[stockCode].getOperatingCosts();
          return utils.getRatioTable(operatingCosts, averagePayable, 1);
        },
        _getPayableTurnoverDays: function(stockCode) {
          var daysTable, j, len, payableRatioTable, ratio;
          payableRatioTable = this._getPayableTurnoverRatio(stockCode);
          daysTable = [];
          for (j = 0, len = payableRatioTable.length; j < len; j++) {
            ratio = payableRatioTable[j];
            if (isNaN(ratio) || 0 === Number(ratio)) {
              daysTable.push(0);
              continue;
            }
            daysTable.push((360 / ratio).toFixed(2));
          }
          return daysTable;
        },
        _getCashTurnoverDays: function(stockCode) {
          var cashTurnoverDays, inventoryTurnoverDays, payableTurnoverDays, receivableTurnoverDays;
          receivableTurnoverDays = this._getReceivableTurnOverDays(stockCode)[0];
          inventoryTurnoverDays = this._getInventoryTurnoverDays(stockCode)[0];
          payableTurnoverDays = this._getPayableTurnoverDays(stockCode)[0];
          if ("Infinity" === receivableTurnoverDays || "Infinity" === inventoryTurnoverDays || "Infinity" === payableTurnoverDays) return 0;
          cashTurnoverDays = parseFloat(receivableTurnoverDays) + parseFloat(inventoryTurnoverDays) - parseFloat(payableTurnoverDays);
          return cashTurnoverDays.toFixed(2);
        },
        _getTotalAssetsTurnoverRatio: function(stockCode) {
          var averageTotalAssets, inComeValueTable;
          averageTotalAssets = this._balanceObj[stockCode].getAverageTotalAssets();
          inComeValueTable = this._profitObj[stockCode].getIncomeValue();
          return utils.getRatioTable(inComeValueTable, averageTotalAssets, 1);
        },
        _getCapitalExpenditureRatio: function(stockCode) {
          var capitalExpenditure, captialSummation, netProfit, netProfitSummation;
          capitalExpenditure = this._cashFlowObj[stockCode].getCapitalExpenditure();
          netProfit = this._profitObj[stockCode].getNetProfitAllTable();
          captialSummation = utils.getSummation(capitalExpenditure);
          netProfitSummation = utils.getSummation(netProfit);
          return (captialSummation / netProfitSummation * 100).toFixed(2);
        },
        _getAssetsPercent: function(stockCode) {
          var assetName, assets, assetsNameTable, base, j, len;
          assetsNameTable = [ "\u8d27\u5e01\u8d44\u91d1", "\u5e94\u6536\u7968\u636e", "\u5e94\u6536\u8d26\u6b3e", "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7", "\u9884\u4ed8\u6b3e\u9879", "\u5176\u4ed6\u5e94\u6536\u6b3e", "\u5b58\u8d27", "\u957f\u671f\u80a1\u6743\u6295\u8d44", "\u56fa\u5b9a\u8d44\u4ea7", "\u5728\u5efa\u5de5\u7a0b", "\u65e0\u5f62\u8d44\u4ea7", "\u5546\u8a89", "\u957f\u671f\u5f85\u644a\u8d39\u7528", "\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7", "\u77ed\u671f\u501f\u6b3e", "\u5e94\u4ed8\u8d26\u6b3e", "\u9884\u6536\u8d26\u6b3e", "\u5176\u4ed6\u5e94\u4ed8\u6b3e", "\u957f\u671f\u501f\u6b3e", "\u5e94\u4ed8\u503a\u5238", "\u672a\u5206\u914d\u5229\u6da6", "\u6743\u76ca\u4e58\u6570", "\u8425\u6536\u542b\u91d1\u91cf", "\u6838\u5fc3\u5229\u6da6\u5360\u6bd4", "ROE" ];
          for (j = 0, len = assetsNameTable.length; j < len; j++) {
            assetName = assetsNameTable[j];
            null == (base = this._assetsTotalObject)[assetName] && (base[assetName] = []);
            switch (assetName) {
             case "\u8d27\u5e01\u8d44\u91d1":
              assets = Number(this._balanceObj[stockCode].getCashValuePercent()[0]);
              break;

             case "\u5e94\u6536\u7968\u636e":
              assets = Number(this._balanceObj[stockCode].getYingShouPiaoJuPercent()[0]);
              break;

             case "\u5e94\u6536\u8d26\u6b3e":
              assets = Number(this._balanceObj[stockCode].getYingShouPercent()[0]);
              break;

             case "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7":
              assets = Number(this._balanceObj[stockCode].getStockAssetsInTotalAssets()[0]);
              break;

             case "\u9884\u4ed8\u6b3e\u9879":
              assets = Number(this._balanceObj[stockCode].getYuFuPercent()[0]);
              break;

             case "\u5176\u4ed6\u5e94\u6536\u6b3e":
              assets = Number(this._balanceObj[stockCode].getQiTaYingShouPercent()[0]);
              break;

             case "\u5b58\u8d27":
              assets = Number(this._balanceObj[stockCode].getChunHuoPercent()[0]);
              break;

             case "\u957f\u671f\u80a1\u6743\u6295\u8d44":
              assets = Number(this._balanceObj[stockCode].getChangeQiGuQuanPercent()[0]);
              break;

             case "\u56fa\u5b9a\u8d44\u4ea7":
              assets = Number(this._balanceObj[stockCode].getFixedAssetsWithTotalAssetsRatio()[0]);
              break;

             case "\u5728\u5efa\u5de5\u7a0b":
              assets = Number(this._balanceObj[stockCode].getZaiJiangPercent()[0]);
              break;

             case "\u65e0\u5f62\u8d44\u4ea7":
              assets = Number(this._balanceObj[stockCode].getWuXingPercent()[0]);
              break;

             case "\u5546\u8a89":
              assets = Number(this._balanceObj[stockCode].getShangYuPercent()[0]);
              break;

             case "\u957f\u671f\u5f85\u644a\u8d39\u7528":
              assets = Number(this._balanceObj[stockCode].getChangQiDaiTanPercent()[0]);
              break;

             case "\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7":
              assets = Number(this._balanceObj[stockCode].getQiTaFeiLiuDongPercent()[0]);
              break;

             case "\u77ed\u671f\u501f\u6b3e":
              assets = Number(this._balanceObj[stockCode].getDuanQiJieKuanPercent()[0]);
              break;

             case "\u5e94\u4ed8\u8d26\u6b3e":
              assets = Number(this._balanceObj[stockCode].getYingFuPercent()[0]);
              break;

             case "\u9884\u6536\u8d26\u6b3e":
              assets = Number(this._balanceObj[stockCode].getAdvanceReceiptsPercent()[0]);
              break;

             case "\u5176\u4ed6\u5e94\u4ed8\u6b3e":
              assets = Number(this._balanceObj[stockCode].getQiTaYingFuPercent()[0]);
              break;

             case "\u957f\u671f\u501f\u6b3e":
              assets = Number(this._balanceObj[stockCode].getChangeQiJieKuanPercent()[0]);
              break;

             case "\u672a\u5206\u914d\u5229\u6da6":
              assets = Number(this._balanceObj[stockCode].getWeiFenPeiPercent()[0]);
              break;

             case "\u6743\u76ca\u4e58\u6570":
              assets = Number(this._balanceObj[stockCode].getFinancialLeverage()[0]);
              break;

             case "\u5e94\u4ed8\u503a\u5238":
              assets = Number(this._balanceObj[stockCode].getYingFuZhaiQuan()[0]);
              break;

             case "\u8425\u6536\u542b\u91d1\u91cf":
              assets = Number(this._getIncomeQuality(stockCode)[0]);
              break;

             case "\u6838\u5fc3\u5229\u6da6\u5360\u6bd4":
              assets = Number(this._profitObj[stockCode].getCoreProfitRatio()[0]);
              break;

             case "ROE":
              assets = Number(this._getROE(stockCode)[0]);
            }
            if (isNaN(assets)) {
              assets = 0;
              cc.log("ERROR, assets is 0");
              return;
            }
            this._assetsTotalObject[assetName].push(assets);
          }
        },
        _calcAverage: function() {
          var assetName, assetTable, middleNum, ref, total;
          ref = this._assetsTotalObject;
          for (assetName in ref) {
            assetTable = ref[assetName];
            total = 0;
            assetTable.sort(function(a, b) {
              return a - b;
            });
            middleNum = assetTable[Math.floor(assetTable.length / 2)];
            cc.log("ASSETS assetName:" + assetName + ", length:" + assetTable.length + ", \u4e2d\u4f4d\u6570" + middleNum);
          }
        },
        _lookAllStock: function(stockInfo) {
          var PE, baseInfo, industry, j, k, len, len1, marketValue, matchScoreCodeTable, matchStockInfo, maxScore, profitAdd, ref, stockCode, totalScore;
          matchScoreCodeTable = [];
          this._assetsTotalObject = {};
          ref = StockInfoTable.getAllCodeTable();
          for (j = 0, len = ref.length; j < len; j++) {
            stockCode = ref[j];
            if (!this._isAllTableLoadFinish(stockCode)) continue;
            this._getAssetsPercent(stockCode);
            totalScore = this._getScore(stockCode, [], true, 0);
            maxScore = this._stockCode < 1e3 ? this._stockCode : 150;
            cc.log(this._stockCode, maxScore);
            totalScore > maxScore && matchScoreCodeTable.push({
              totalScore: totalScore.toFixed(2),
              stockCode: stockCode
            });
          }
          this._calcAverage();
          matchScoreCodeTable.sort(function(a, b) {
            return b.totalScore - a.totalScore;
          });
          for (k = 0, len1 = matchScoreCodeTable.length; k < len1; k++) {
            matchStockInfo = matchScoreCodeTable[k];
            stockCode = matchStockInfo.stockCode;
            totalScore = matchStockInfo.totalScore;
            profitAdd = this._getAverageNetProfitYoy(stockCode);
            PE = this._profitObj[stockCode].getPETTM();
            marketValue = utils.addBillionUnit(this._balanceObj[stockCode].getTotalMarketValue());
            baseInfo = stockCode + "---" + this._balanceObj[stockCode].getStockName();
            industry = this._balanceObj[stockCode].getIndustry();
            baseInfo = baseInfo + "---" + industry + "---" + marketValue;
            stockInfo.push("\n" + baseInfo + " --- \u603b\u5f97\u5206 :" + totalScore + ", PE:" + PE + ", \u5229\u6da6\u589e\u957f\u7387\uff1a" + profitAdd);
          }
          this._isToolActive && console.log("stockInfo:" + JSON.stringify(stockInfo));
          return stockInfo;
        },
        _getIndustryAverage: function(originStockCode, type) {
          var base, code, codeForRank, currentIndustry, index, industry, industryMiddleNum, info, info1, info2, info3, info4, info5, j, k, key, keyValue, l, lastStockCode, len, len1, len2, m, mostHigher, mostLower, orderInfo, rankNum, rankNumForRank, ref, sameIndustryInfo, sameIndustryInfoObj, sameIndustryStockCode, sortedObjKeys, stockCode, topStockCode, topTenCodeTable, topTenInfoObj, topTenInfoTable, unitChar, value;
          industry = this._balanceObj[originStockCode].getIndustry();
          indexOf.call(SameIndustryCompany, originStockCode) >= 0 && (industry = "\u65b0\u80fd\u6e90\u4ea7\u4e1a\u94fe");
          sameIndustryInfo = [];
          sameIndustryStockCode = [];
          sameIndustryInfoObj = {};
          ref = StockInfoTable.getAllCodeTable();
          for (j = 0, len = ref.length; j < len; j++) {
            stockCode = ref[j];
            if (!this._isAllTableLoadFinish(stockCode)) continue;
            currentIndustry = this._balanceObj[stockCode].getIndustry();
            indexOf.call(SameIndustryCompany, stockCode) >= 0 && (currentIndustry = "\u65b0\u80fd\u6e90\u4ea7\u4e1a\u94fe");
            if (currentIndustry === industry) {
              sameIndustryStockCode.push(stockCode);
              switch (type) {
               case "\u8d27\u5e01\u8d44\u91d1":
                value = this._balanceObj[stockCode].getCashValuePercent()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u56fa\u5b9a\u8d44\u4ea7":
                value = this._balanceObj[stockCode].getFixedAssetsWithTotalAssetsRatio()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5b58\u8d27\u5468\u8f6c\u5929\u6570":
                value = this._getInventoryTurnoverDays(stockCode)[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5b58\u8d27":
                value = this._balanceObj[stockCode].getChunHuoPercent()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5e94\u6536\u8d26\u6b3e\u5468\u8f6c\u5929\u6570":
                value = this._getReceivableTurnOverDays(stockCode)[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5e94\u6536\u8d26\u6b3e":
                value = this._balanceObj[stockCode].getYingShouPercent()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u9884\u6536\u8d26\u6b3e":
                value = this._getAdvanceReceiptsPercent(stockCode);
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u6bdb\u5229\u7387":
                value = this._profitObj[stockCode].getGrossProfitRatio()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u51c0\u5229\u7387":
                value = this._profitObj[stockCode].getNetProfitRatio()[0];
                if (-1 !== value.indexOf("Infinity")) continue;
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5e73\u5747\u6708\u85aa":
                value = (1e4 * this._getStaffInfo(stockCode, true)).toFixed(2);
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5e94\u4ed8\u8d26\u6b3e":
                value = this._getPayableTurnoverDays(stockCode)[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u73b0\u91d1\u5468\u8f6c":
                value = this._getCashTurnoverDays(stockCode);
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u6838\u5fc3\u5229\u6da6\u7387":
                value = this._profitObj[stockCode].getOperatingProfitRatio()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u6838\u5fc3\u5229\u6da6":
                value = this._profitObj[stockCode].getCoreProfit()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u8d39\u7528\u7387":
                value = this._profitObj[stockCode].getExpenseRatio()[0];
                if (-1 !== value.indexOf("Infinity")) continue;
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u4f30\u503c\u6bd4":
                value = this._getArkadValuePercent(stockCode);
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u8d22\u52a1\u8bc4\u5206":
                value = this._getScore(stockCode, [], true, 0);
                sameIndustryInfoObj[stockCode] = value.toFixed(2);
                sameIndustryInfo.push(value);
                break;

               case "\u5e02\u76c8\u7387TTM":
                value = this._profitObj[stockCode].getPETTM();
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387":
                value = this._profitObj[stockCode].getNetProfitAddRatio();
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u8425\u6536\u590d\u5408\u589e\u957f\u7387":
                value = this._profitObj[stockCode].getIncomeAddRatio();
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u81ea\u7531\u73b0\u91d1\u6bd4\u7387":
                value = this._getFreeCashRatio(stockCode).toFixed(2);
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u51c0\u8d44\u4ea7\u6536\u76ca\u7387":
                value = this._getROE(stockCode)[0];
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u603b\u8d44\u4ea7\u5468\u8f6c\u7387":
                value = this._getTotalAssetsTurnoverRatio(stockCode)[0];
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u6760\u6746\u7387":
                value = this._balanceObj[stockCode].getFinancialLeverage()[0];
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u51c0\u5229\u6da6":
                value = this._profitObj[stockCode].getNetProfitTable()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7":
                value = this._balanceObj[stockCode].getStockAssetsInTotalAssets()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u957f\u671f\u80a1\u6743\u6295\u8d44":
                value = this._balanceObj[stockCode].getChangeQiGuQuanPercent()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u5546\u8a89":
                value = this._balanceObj[stockCode].getShangYuPercent()[0];
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
                break;

               case "\u6536\u73b0\u6bd4":
                value = this._getIncomeQuality(stockCode)[0];
                if (-1 !== value.indexOf("Infinity")) continue;
                if (isNaN(value)) continue;
                sameIndustryInfoObj[stockCode] = value;
                sameIndustryInfo.push(value);
              }
            }
          }
          if ("\u83b7\u53d6\u4ee3\u7801" === type) return sameIndustryStockCode;
          sameIndustryStockCode.sort(function(_this) {
            return function(a, b) {
              return _this._balanceObj[b].getTotalMarketValue() - _this._balanceObj[a].getTotalMarketValue();
            };
          }(this));
          if ("\u603b\u5e02\u503c\u6392\u540d" === type) return sameIndustryStockCode.indexOf(originStockCode) + 1;
          topTenCodeTable = sameIndustryStockCode.slice(0, 10);
          if ("\u524d\u5341\u4f01\u4e1a" === type) return sameIndustryStockCode;
          if (0 === sameIndustryInfo.length) return [ "\u6700\u591a\u54c8" ];
          topTenInfoTable = [];
          for (index = k = 0; k < 10; index = ++k) {
            if (index >= topTenCodeTable.length) break;
            topTenInfoTable.push(sameIndustryInfoObj[topTenCodeTable[index]]);
          }
          topTenInfoObj = {};
          for (code in sameIndustryInfoObj) {
            value = sameIndustryInfoObj[code];
            indexOf.call(topTenCodeTable, code) >= 0 && (topTenInfoObj[code] = value);
          }
          unitChar = "%";
          "\u73b0\u91d1\u5468\u8f6c" === type && (unitChar = "\u5929");
          "\u5e02\u76c8\u7387TTM" === type && (unitChar = "");
          "\u6838\u5fc3\u5229\u6da6" === type && (unitChar = "");
          info2 = "\u5e02\u503c\u524d" + topTenInfoTable.length + "\u5e73\u5747\u503c\uff1a" + utils.getAverage(topTenInfoTable) + unitChar;
          sortedObjKeys = Object.keys(sameIndustryInfoObj).sort(function(a, b) {
            if ("\u5e94\u6536\u8d26\u6b3e" === type || "\u6760\u6746\u7387" === type || "\u73b0\u91d1\u5468\u8f6c" === type || "\u8d39\u7528\u7387" === type || "\u5e02\u76c8\u7387TTM" === type) return sameIndustryInfoObj[a] - sameIndustryInfoObj[b];
            return sameIndustryInfoObj[b] - sameIndustryInfoObj[a];
          });
          topStockCode = sortedObjKeys[0];
          lastStockCode = sortedObjKeys[sortedObjKeys.length - 1];
          mostHigher = sameIndustryInfoObj[topStockCode];
          mostLower = sameIndustryInfoObj[lastStockCode];
          if ("\u6838\u5fc3\u5229\u6da6" === type) {
            mostHigher = utils.getValueDillion(mostHigher);
            mostLower = utils.getValueDillion(mostLower);
          }
          info4 = "\n\t\u6700\u9ad8: " + this._balanceObj[topStockCode].getStockName() + "\uff1a" + mostHigher + unitChar;
          info5 = "\t\u6700\u4f4e: " + this._balanceObj[lastStockCode].getStockName() + "\uff1a" + mostLower + unitChar;
          rankNum = sortedObjKeys.indexOf(originStockCode) + 1;
          info1 = "\t" + sameIndustryInfo.length + "\u5bb6\u540c\u884c\uff0c\u6392\u540d\uff1a" + rankNum;
          if ("\u8425\u6536\u590d\u5408\u589e\u957f\u7387" === type || "\u6838\u5fc3\u5229\u6da6" === type || "\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387" === type || "\u51c0\u5229\u7387" === type || "\u51c0\u8d44\u4ea7\u6536\u76ca\u7387" === type || "\u8d39\u7528\u7387" === type || "\u73b0\u91d1\u5468\u8f6c" === type || "\u6536\u73b0\u6bd4" === type || "\u5e02\u76c8\u7387TTM" === type) for (l = 0, 
          len1 = sortedObjKeys.length; l < len1; l++) {
            codeForRank = sortedObjKeys[l];
            null == (base = this._rankPercentObj)[codeForRank] && (base[codeForRank] = []);
            rankNumForRank = sortedObjKeys.indexOf(codeForRank);
            this._rankPercentObj[codeForRank].push(rankNumForRank / (sameIndustryInfo.length - 1));
          }
          industryMiddleNum = sameIndustryInfoObj[sortedObjKeys[Math.floor(sortedObjKeys.length / 2)]];
          "\u6838\u5fc3\u5229\u6da6" === type && (industryMiddleNum = utils.getValueDillion(industryMiddleNum));
          info3 = "\t\u884c\u4e1a\u4e2d\u4f4d\u6570: " + industryMiddleNum + unitChar;
          orderInfo = [];
          for (index = m = 0, len2 = sortedObjKeys.length; m < len2; index = ++m) {
            key = sortedObjKeys[index];
            keyValue = sameIndustryInfoObj[key];
            "\u51c0\u5229\u6da6" !== type && "\u6838\u5fc3\u5229\u6da6" !== type || (keyValue = utils.getValueDillion(keyValue));
            info = index + 1 + "\u3001" + this._balanceObj[key].getStockName() + ":    " + keyValue;
            if (key === originStockCode) {
              orderInfo.push("--------" + info + "--------");
              continue;
            }
            orderInfo.push(info);
          }
          this._industryInfo["\u603b\u5e02\u503c\u6392\u884c"] = this._getIndustryBaseInfo(sameIndustryStockCode);
          "\u8425\u6536\u590d\u5408\u589e\u957f\u7387" !== type && "\u6838\u5fc3\u5229\u6da6" !== type && "\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387" !== type && "\u51c0\u5229\u7387" !== type && "\u51c0\u8d44\u4ea7\u6536\u76ca\u7387" !== type && "\u73b0\u91d1\u5468\u8f6c\u5929\u6570" !== type && "\u8d39\u7528\u7387" !== type && "\u6536\u73b0\u6bd4" !== type && "\u5e02\u76c8\u7387TTM" !== type || (this._industryInfo[type] = orderInfo);
          return [ info1 + info3 + info4 + info5, industryMiddleNum, rankNum ];
        },
        _getIndustryBaseInfo: function(sameIndustryStockCode, noAdd) {
          var index, info, infoTable, j, len, stock;
          sameIndustryStockCode.sort(function(_this) {
            return function(a, b) {
              return _this._balanceObj[b].getTotalMarketValue() - _this._balanceObj[a].getTotalMarketValue();
            };
          }(this));
          infoTable = [];
          for (index = j = 0, len = sameIndustryStockCode.length; j < len; index = ++j) {
            stock = sameIndustryStockCode[index];
            info = index + 1 + ": " + stock + "_" + this._balanceObj[stock].getStockName() + "_\u603b\u5e02\u503c\uff1a" + utils.addBillionUnit(this._balanceObj[stock].getTotalMarketValue());
            if (stock === this._stockCode && true !== noAdd) {
              infoTable.push("--------" + info + "--------");
              continue;
            }
            infoTable.push(info);
          }
          return infoTable;
        },
        _getGoodWillPercent: function(stockCode) {
          var goodWill, percent, totalAssets;
          totalAssets = this._balanceObj[stockCode].getTotalAssets()[0];
          goodWill = this._balanceObj[stockCode].getGoodWill();
          percent = (goodWill / totalAssets * 100).toFixed(2);
          return percent;
        },
        _loadTable: function(dir, table) {
          var beginTime, loadFile, stockTable, totalIndex;
          totalIndex = 0;
          stockTable = null != table ? table : "allA" === dir ? StockInfoTable.getAllCodeTable() : utils.getStockTable(dir);
          beginTime = new Date();
          this._loadingFileStatus = true;
          loadFile = function(_this) {
            return function() {
              var dis, isExist, now, ref, stockCode;
              if (!global.canLoad) return;
              global.canLoad = false;
              if (totalIndex >= stockTable.length) {
                _this.unschedule(loadFile);
                now = new Date();
                dis = now - beginTime;
                _this.m_tips.string = "load over , use time " + Math.floor(dis / 1e3) + "s";
                _this._loadingFileStatus = false;
                return;
              }
              stockCode = stockTable[totalIndex];
              isExist = _this._checkStockExist(stockCode);
              if (isExist) {
                null == dir || "allA" === dir || (stockCode = stockCode.slice(2, 8));
                _this.m_tips.string = "loading ..." + stockCode + "... " + totalIndex + "/" + stockTable.length;
                (null != (ref = _this._balanceObj[stockCode]) ? ref.isLoadFinish() : void 0) ? global.canLoad = true : _this._loadFileToObj(stockCode);
              } else global.canLoad = true;
              return totalIndex++;
            };
          }(this);
          this.schedule(loadFile, 0);
          return loadFile();
        },
        _checkStockExist: function(stockCode) {
          return true;
        },
        _loadTableByType: function(dir) {
          if (this._loadingFileStatus) return;
          global.canLoad = true;
          return this._loadTable(dir);
        },
        _getArkadValuePercent: function(stockCode) {
          var ArkadVaule, averageNetProfit, i, j, netProfitTable, totalMarketValue, totalNetProfit;
          netProfitTable = this._profitObj[stockCode].getNetProfitTable(true, true);
          totalNetProfit = 0;
          for (i = j = 0; j <= 2; i = ++j) totalNetProfit += parseInt(netProfitTable[i]);
          averageNetProfit = totalNetProfit / 1e4 / 3;
          ArkadVaule = averageNetProfit / .02;
          totalMarketValue = this._balanceObj[stockCode].getTotalMarketValue();
          return (totalMarketValue / ArkadVaule).toFixed(2);
        },
        _getBaseInfo: function() {
          var disTanceLength, infoTable, stockCode;
          infoTable = [];
          stockCode = this._stockCode;
          infoTable.push("\u57fa\u672c\u4fe1\u606f\uff1a          " + this._profitObj[stockCode].getBaseInfo());
          infoTable.push("\n\u65f6\u95f4:           " + this._profitObj[stockCode].getTimeTitle());
          infoTable.push("\n----------------------  \u8d44\u4ea7\u8d1f\u503a\u8868Top 10 ----------------------------");
          infoTable.push("\n" + JSON.stringify(this._balanceObj[stockCode].getTop10AllYearPercent(), null, 4));
          infoTable.push("\n" + JSON.stringify(this._balanceObj[stockCode].getTop10DebtAllYearPercent(), null, 4));
          infoTable.push("\n----------------------\u8425\u8fd0\u80fd\u529b----------------------------");
          disTanceLength = 10;
          infoTable.push("\n" + utils.addFengGeFu("\u8d27\u5e01\u8d44\u91d1\u5360\u603b\u8d44\u4ea7", disTanceLength) + ": " + utils.addTabInTable(this._balanceObj[stockCode].getCashValuePercent()));
          infoTable.push("\n" + utils.addFengGeFu("\u5e94\u6536\u8d26\u6b3e\u5360\u6536\u5165\u6bd4", disTanceLength) + ": " + utils.addTabInTable(this._getReceivableInIncomeRatio(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u6709\u606f\u8d1f\u503a\u7387", disTanceLength) + ": " + utils.addTabInTable(this._balanceObj[stockCode].getInterestDebt()));
          infoTable.push("\n" + utils.addFengGeFu("\u56fa\u5b9a\u8d44\u4ea7\u5360\u603b\u8d44\u4ea7", disTanceLength) + ": " + utils.addTabInTable(this._balanceObj[stockCode].getFixedAssetsWithTotalAssetsRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u9884\u6536\u8d26\u6b3e\u5360\u603b\u8d44\u4ea7", disTanceLength) + ": " + utils.addTabInTable(this._balanceObj[stockCode].getAdvanceReceiptsPercent()));
          infoTable.push("\n" + utils.addFengGeFu("\u5e94\u6536\u6b3e\u5468\u8f6c\u7387", disTanceLength) + ": " + utils.addTabInTable(this._getRecievableTurnRatio(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u5e94\u6536\u6b3e\u5468\u8f6c\u5929\u6570", disTanceLength) + ": " + utils.addTabInTable(this._getReceivableTurnOverDays(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u5b58\u8d27\u5468\u8f6c\u7387", disTanceLength) + ": " + utils.addTabInTable(this._getInventoryTurnoverRatio(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u5b58\u8d27\u5468\u8f6c\u5929\u6570", disTanceLength) + ": " + utils.addTabInTable(this._getInventoryTurnoverDays(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u5e94\u4ed8\u6b3e\u5468\u8f6c\u7387", disTanceLength) + ": " + utils.addTabInTable(this._getPayableTurnoverRatio(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u5e94\u4ed8\u6b3e\u5468\u8f6c\u5929\u6570", disTanceLength) + ": " + utils.addTabInTable(this._getPayableTurnoverDays(stockCode)));
          infoTable.push("\n----------------------\u5229\u6da6\u8868----------------------------");
          infoTable.push("\n" + utils.addFengGeFu("\u8425\u4e1a\u6536\u5165", disTanceLength) + ": " + utils.getValueDillion(this._profitObj[stockCode].getIncomeValue()));
          infoTable.push("\n" + utils.addFengGeFu("\u8425\u4e1a\u6536\u5165\u589e\u957f", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getIncomeValueAddRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u51c0\u5229\u6da6", disTanceLength) + ": " + utils.getValueDillion(this._profitObj[stockCode].getNetProfitTable()));
          infoTable.push("\n" + utils.addFengGeFu("\u51c0\u5229\u6da6\u589e\u957f\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getNetProfitYoy()));
          infoTable.push("\n" + utils.addFengGeFu("\u6838\u5fc3\u6da6\u589e\u957f\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getCoreProfitAddRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u5229\u6da6\u603b\u989d", disTanceLength) + ": " + utils.getValueDillion(this._profitObj[stockCode].getProfitTotal()));
          infoTable.push("\n" + utils.addFengGeFu("\u6838\u5fc3\u5229\u6da6", disTanceLength) + ": " + utils.getValueDillion(this._profitObj[stockCode].getCoreProfit()));
          infoTable.push("\n" + utils.addFengGeFu("\u6838\u5fc3\u5229\u6da6\u5360\u6bd4", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getCoreProfitRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u8425\u4e1a\u5229\u6da6\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getYingYeLiRuiLu()));
          infoTable.push("\n" + utils.addFengGeFu("\u7a0e\u91d1\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getYingyeShuijinTax()));
          infoTable.push("\n" + utils.addFengGeFu("\u6240\u5f97\u7a0e\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getIncomeTaxRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u6bdb\u5229\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getGrossProfitRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u51c0\u5229\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getNetProfitRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u4e09\u9879\u8d39\u7528\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getExpenseRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u9500\u552e\u8d39\u7528\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getSellingFeeRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u7ba1\u7406\u8d39\u7528\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getManageFeeRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u7814\u53d1\u8d39\u7528\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getRDFeeRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u8d22\u52a1\u8d39\u7528\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getMoneyFeeRatio()));
          infoTable.push("\n----------------------\u73b0\u91d1\u6d41\u91cf\u8868----------------------------");
          infoTable.push("\n" + utils.addFengGeFu("\u7ecf\u8425\u6d3b\u52a8\u73b0\u91d1\u51c0\u989d", disTanceLength) + ": " + utils.getValueDillion(this._cashFlowObj[stockCode].getWorkCashFlow()));
          infoTable.push("\n" + utils.addFengGeFu("\u6295\u8d44\u6d3b\u52a8\u73b0\u91d1\u51c0\u989d", disTanceLength) + ": " + utils.getValueDillion(this._cashFlowObj[stockCode].getTouZiHuoDong()));
          infoTable.push("\n" + utils.addFengGeFu("\u7b79\u8d44\u6d3b\u52a8\u73b0\u91d1\u51c0\u989d", disTanceLength) + ": " + utils.getValueDillion(this._cashFlowObj[stockCode].getChouZiHuoDong()));
          infoTable.push("\n" + utils.addFengGeFu("\u8d2d\u5efa\u8d44\u4ea7\u652f\u4ed8\u7684\u73b0\u91d1", disTanceLength) + ": " + utils.getValueDillion(this._cashFlowObj[stockCode].getCapitalExpenditure()));
          infoTable.push("\n" + utils.addFengGeFu("\u51fa\u552e\u8d44\u4ea7\u6536\u5230\u7684\u73b0\u91d1", disTanceLength) + ": " + utils.getValueDillion(this._cashFlowObj[stockCode].getChuShouGuDingZiChan()));
          infoTable.push("\n" + utils.addFengGeFu("\u5438\u6536\u6295\u8d44\u53d6\u5f97\u7684\u73b0\u91d1", disTanceLength) + ": " + utils.getValueDillion(this._cashFlowObj[stockCode].getIPOMoney()));
          infoTable.push("\n" + utils.addFengGeFu("\u6536\u73b0\u6bd4", disTanceLength) + ":" + utils.addTabInTable(this._getIncomeQuality(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u7ecf\u8425\u73b0\u91d1\u6bd4\u51c0\u5229\u6da6", disTanceLength) + ": " + utils.addTabInTable(this._getNetProfitQuality(stockCode)));
          infoTable.push("\n----------------------\u51c0\u8d44\u4ea7\u6536\u76ca\u7387----------------------------");
          infoTable.push("\n" + utils.addFengGeFu("\u51c0\u8d44\u4ea7\u6536\u76ca\u7387", disTanceLength) + ": " + utils.addTabInTable(this._getROE(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u51c0\u5229\u6da6\u7387", disTanceLength) + ": " + utils.addTabInTable(this._profitObj[stockCode].getNetProfitRatio()));
          infoTable.push("\n" + utils.addFengGeFu("\u603b\u8d44\u4ea7\u5468\u8f6c\u7387", disTanceLength) + ": " + utils.addTabInTable(this._getTotalAssetsTurnoverRatio(stockCode)));
          infoTable.push("\n" + utils.addFengGeFu("\u6743\u76ca\u4e58\u6570", disTanceLength) + ": " + utils.addTabInTable(this._balanceObj[stockCode].getFinancialLeverage()));
          this._isToolActive && console.log("baseInfo:" + infoTable);
          utils.webCopyString(infoTable);
          return this.m_baseInfo_info.string = infoTable;
        },
        onLoad800: function() {
          return this._loadTableByType("hs800");
        },
        onLoad500: function() {
          return this._loadTableByType("zz500");
        },
        onLoad1000: function() {
          return this._loadTableByType("zz1000");
        },
        onLoadAll: function() {
          return this._loadIndustryStock(this._stockCode);
        },
        _loadIndustryStock: function(stockCode) {
          var base, currentIndustry;
          if ("" === stockCode) return;
          if (!this._isAllTableLoadFinish(stockCode)) {
            this._loadFileToObj(stockCode);
            return;
          }
          currentIndustry = this._balanceObj[stockCode].getIndustry();
          if (1 === this._industryLoadStatus[currentIndustry]) return;
          global.canLoad = true;
          null == (base = this._industryLoadStatus)[currentIndustry] && (base[currentIndustry] = 1);
          return this._loadTable(null, StockInfoTable.getStockTableByIndutry(currentIndustry));
        },
        _getAverageNetProfitYoy: function(stockCode) {
          var j, len, netProfitYoy, netProfitYoyTable, profitAdd;
          netProfitYoyTable = this._profitObj[stockCode].getNetProfitYoy();
          for (j = 0, len = netProfitYoyTable.length; j < len; j++) {
            netProfitYoy = netProfitYoyTable[j];
            if (netProfitYoy < 0) return 0;
          }
          profitAdd = utils.getAverage(netProfitYoyTable);
          return profitAdd;
        },
        _getFengGeFu: function(itemName) {
          var disNum, length, maxNum, str;
          length = itemName.length;
          maxNum = 22;
          disNum = maxNum - 3 * length;
          str = "";
          while (disNum > 0) {
            str += "-";
            disNum--;
          }
          return str;
        },
        _calcScore: function(itemName, selfNum, average, infoTable, moreThanTenAddItem, moreThanTenSubItem) {
          var addOrSubMaxScore, disNum, middleItem, moreIsGoodItem, originDisNum, score;
          moreIsGoodItem = [ "\u8d27\u5e01\u8d44\u91d1", "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7", "\u9884\u6536\u8d26\u6b3e", "\u5e94\u4ed8\u8d26\u6b3e", "\u8425\u6536\u542b\u91d1\u91cf", "\u6838\u5fc3\u5229\u6da6\u5360\u6bd4", "ROE" ];
          middleItem = [ "\u957f\u671f\u80a1\u6743\u6295\u8d44", "\u5728\u5efa\u5de5\u7a0b", "\u6743\u76ca\u4e58\u6570", "\u672a\u5206\u914d\u5229\u6da6", "\u5e94\u6536\u7968\u636e" ];
          disNum = selfNum - average;
          originDisNum = (selfNum - average).toFixed(2);
          "ROE" === itemName && (disNum *= 3);
          addOrSubMaxScore = 7;
          score = 0;
          if (Math.abs(disNum) < 3 && !(indexOf.call(middleItem, itemName) >= 0)) {
            score += 5;
            infoTable.push("\n" + itemName + this._getFengGeFu(itemName) + "\u4e2d\u4f4d\u6570(" + average + ")-------\u5f53\u524d\u503c:(" + selfNum + ")------- \u6b63\u5e38 + 5");
          } else if (indexOf.call(moreIsGoodItem, itemName) >= 0) if (disNum > 0) {
            disNum += 2;
            score += disNum;
            disNum >= addOrSubMaxScore && (moreThanTenAddItem[itemName] = selfNum.toFixed(2));
            infoTable.push("\n" + itemName + this._getFengGeFu(itemName) + "\u4e2d\u4f4d\u6570(" + average + ")------- \u5f53\u524d\u503c:(" + selfNum + ")-------\u52a0\u5206\uff08" + disNum.toFixed(2) + ")");
          } else {
            score -= Math.abs(disNum);
            Math.abs(disNum) > addOrSubMaxScore && (moreThanTenSubItem[itemName] = selfNum.toFixed(2));
            infoTable.push("\n" + itemName + this._getFengGeFu(itemName) + "\u4e2d\u4f4d\u6570(" + average + ")------- \u5f53\u524d\u503c:(" + selfNum + ")-------\u51cf\u5206 (-" + Math.abs(disNum.toFixed(2)) + ")");
          } else if (indexOf.call(middleItem, itemName) >= 0) {
            score += 0;
            infoTable.push("\n" + itemName + this._getFengGeFu(itemName) + "\u4e2d\u4f4d\u6570(" + average + ")------- \u5f53\u524d\u503c:(" + selfNum + ")-------\u9700\u8981\u89c2\u5bdf");
          } else if (disNum < 0) {
            disNum -= 2;
            score += Math.abs(disNum);
            Math.abs(disNum) >= addOrSubMaxScore && (moreThanTenAddItem[itemName] = selfNum.toFixed(2));
            infoTable.push("\n" + itemName + this._getFengGeFu(itemName) + "\u4e2d\u4f4d\u6570(" + average + ")------- \u5f53\u524d\u503c:(" + selfNum + ")-------\u52a0\u5206 (" + Math.abs(disNum).toFixed(2) + ")");
          } else {
            score -= disNum;
            disNum > addOrSubMaxScore && (moreThanTenSubItem[itemName] = selfNum.toFixed(2));
            infoTable.push("\n" + itemName + this._getFengGeFu(itemName) + "\u4e2d\u4f4d\u6570(" + average + ")------- \u5f53\u524d\u503c:(" + selfNum + ")-------\u51cf\u5206 (-" + Math.abs(disNum.toFixed(2)) + ")");
          }
          return score;
        },
        _getScore: function(stockCode, infoTable, needScore, year, onlyNeedScore) {
          var PE, assetName, assetsNameTable, assetsNum, assetsTotalPercent, debtPercent, debtTotalPercent, j, len, marketAverageObj, maxScore, moreThanTenAddItem, moreThanTenSubItem, profit, profitAdd, returnInfo, totalScore;
          infoTable.push("\n\n-------------\u8d22\u52a1\u9762\u8bc4\u5206------------");
          marketAverageObj = {
            "\u8d27\u5e01\u8d44\u91d1": 13.79,
            "\u5e94\u6536\u7968\u636e": .06,
            "\u5e94\u6536\u8d26\u6b3e": 10.92,
            "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7": .02,
            "\u9884\u4ed8\u6b3e\u9879": .82,
            "\u5176\u4ed6\u5e94\u6536\u6b3e": .63,
            "\u5b58\u8d27": 10.24,
            "\u957f\u671f\u80a1\u6743\u6295\u8d44": .7,
            "\u56fa\u5b9a\u8d44\u4ea7": 15.31,
            "\u5728\u5efa\u5de5\u7a0b": 1.16,
            "\u65e0\u5f62\u8d44\u4ea7": 3.2,
            "\u5546\u8a89": .03,
            "\u957f\u671f\u5f85\u644a\u8d39\u7528": .16,
            "\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7": .36,
            "\u77ed\u671f\u501f\u6b3e": 5.22,
            "\u5e94\u4ed8\u8d26\u6b3e": 7.59,
            "\u9884\u6536\u8d26\u6b3e": 1.18,
            "\u5176\u4ed6\u5e94\u4ed8\u6b3e": 1.57,
            "\u957f\u671f\u501f\u6b3e": .3,
            "\u5e94\u4ed8\u503a\u5238": 0,
            "\u6709\u606f\u8d1f\u503a": 5.52,
            "\u672a\u5206\u914d\u5229\u6da6": 16.02,
            "\u6743\u76ca\u4e58\u6570": 1.71,
            "\u8425\u6536\u542b\u91d1\u91cf": 100.5,
            "\u6838\u5fc3\u5229\u6da6\u5360\u6bd4": 88.63,
            ROE: 7.33
          };
          assetsNameTable = [ "\u8d27\u5e01\u8d44\u91d1", "\u5e94\u6536\u7968\u636e", "\u5e94\u6536\u8d26\u6b3e", "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7", "\u9884\u4ed8\u6b3e\u9879", "\u5176\u4ed6\u5e94\u6536\u6b3e", "\u5b58\u8d27", "\u957f\u671f\u80a1\u6743\u6295\u8d44", "\u56fa\u5b9a\u8d44\u4ea7", "\u5728\u5efa\u5de5\u7a0b", "\u65e0\u5f62\u8d44\u4ea7", "\u5546\u8a89", "\u957f\u671f\u5f85\u644a\u8d39\u7528", "\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7", "\u5e94\u4ed8\u8d26\u6b3e", "\u9884\u6536\u8d26\u6b3e", "\u5176\u4ed6\u5e94\u4ed8\u6b3e", "\u6709\u606f\u8d1f\u503a", "\u6743\u76ca\u4e58\u6570", "\u8425\u6536\u542b\u91d1\u91cf", "\u6838\u5fc3\u5229\u6da6\u5360\u6bd4", "ROE" ];
          totalScore = 0;
          assetsTotalPercent = 0;
          debtTotalPercent = 0;
          moreThanTenAddItem = {};
          moreThanTenSubItem = {};
          for (j = 0, len = assetsNameTable.length; j < len; j++) {
            assetName = assetsNameTable[j];
            switch (assetName) {
             case "\u8d27\u5e01\u8d44\u91d1":
              assetsNum = Number(this._balanceObj[stockCode].getCashValuePercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5e94\u6536\u7968\u636e":
              assetsNum = Number(this._balanceObj[stockCode].getYingShouPiaoJuPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5e94\u6536\u8d26\u6b3e":
              assetsNum = Number(this._balanceObj[stockCode].getYingShouPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7":
              assetsNum = Number(this._balanceObj[stockCode].getStockAssetsInTotalAssets()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u9884\u4ed8\u6b3e\u9879":
              assetsNum = Number(this._balanceObj[stockCode].getYuFuPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5176\u4ed6\u5e94\u6536\u6b3e":
              assetsNum = Number(this._balanceObj[stockCode].getQiTaYingShouPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5b58\u8d27":
              assetsNum = Number(this._balanceObj[stockCode].getChunHuoPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u957f\u671f\u80a1\u6743\u6295\u8d44":
              assetsNum = Number(this._balanceObj[stockCode].getChangeQiGuQuanPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u56fa\u5b9a\u8d44\u4ea7":
              assetsNum = Number(this._balanceObj[stockCode].getFixedAssetsWithTotalAssetsRatio()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5728\u5efa\u5de5\u7a0b":
              assetsNum = Number(this._balanceObj[stockCode].getZaiJiangPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u65e0\u5f62\u8d44\u4ea7":
              assetsNum = Number(this._balanceObj[stockCode].getWuXingPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5546\u8a89":
              assetsNum = Number(this._balanceObj[stockCode].getShangYuPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u957f\u671f\u5f85\u644a\u8d39\u7528":
              assetsNum = Number(this._balanceObj[stockCode].getChangQiDaiTanPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7":
              assetsNum = Number(this._balanceObj[stockCode].getQiTaFeiLiuDongPercent()[year]);
              assetsTotalPercent += assetsNum;
              break;

             case "\u5e94\u4ed8\u8d26\u6b3e":
              assetsNum = Number(this._balanceObj[stockCode].getYingFuPercent()[year]);
              debtTotalPercent += assetsNum;
              break;

             case "\u9884\u6536\u8d26\u6b3e":
              assetsNum = Number(this._balanceObj[stockCode].getAdvanceReceiptsPercent()[year]);
              debtTotalPercent += assetsNum;
              break;

             case "\u5176\u4ed6\u5e94\u4ed8\u6b3e":
              assetsNum = Number(this._balanceObj[stockCode].getQiTaYingFuPercent()[year]);
              debtTotalPercent += assetsNum;
              break;

             case "\u672a\u5206\u914d\u5229\u6da6":
              assetsNum = Number(this._balanceObj[stockCode].getWeiFenPeiPercent()[year]);
              break;

             case "\u6743\u76ca\u4e58\u6570":
              assetsNum = Number(this._balanceObj[stockCode].getFinancialLeverage()[year]);
              break;

             case "\u6709\u606f\u8d1f\u503a":
              assetsNum = Number(this._balanceObj[stockCode].getInterestDebt()[year]);
              debtTotalPercent += assetsNum;
              break;

             case "\u8425\u6536\u542b\u91d1\u91cf":
              assetsNum = Number(this._getIncomeQuality(stockCode)[year]);
              assetsNum > 150 && (assetsNum = 150);
              break;

             case "\u6838\u5fc3\u5229\u6da6\u5360\u6bd4":
              assetsNum = Number(this._profitObj[stockCode].getCoreProfitRatio()[year]);
              assetsNum > 100 && (assetsNum = 100);
              assetsNum < 30 && (assetsNum = 30);
              break;

             case "ROE":
              assetsNum = Number(this._getROE(stockCode)[year]);
              profit = this._profitObj[stockCode].getNetProfitTable()[year];
              profit < 0 && (assetsNum = 0);
              assetsNum > 50 && (assetsNum = 50);
              assetsNum < 0 && (assetsNum = 0);
            }
            if (isNaN(assetsNum)) continue;
            totalScore += this._calcScore(assetName, assetsNum, marketAverageObj[assetName], infoTable, moreThanTenAddItem, moreThanTenSubItem);
          }
          debtPercent = debtTotalPercent / this._balanceObj[stockCode].getFuZhaiHeJi()[year];
          debtPercent = (100 * debtPercent).toFixed(2);
          infoTable.push("\n\u4f01\u4e1a: " + this._balanceObj[stockCode].getStockName() + ",  \u603b\u5f97\u5206 :" + totalScore.toFixed(2) + "\u5206, \t\t\t\t\u7edf\u8ba1\u8d44\u4ea7\u5360\u6bd4:" + assetsTotalPercent.toFixed(2) + "%, \t\t\t\t\u7edf\u8ba1\u8d1f\u503a\u5360\u603b\u8d1f\u503a:" + debtPercent + "%");
          infoTable.push("\n\u91cd\u5927\u52a0\u5206\u9879\uff1a" + JSON.stringify(moreThanTenAddItem));
          infoTable.push("\n\u91cd\u5927\u51cf\u5206\u9879: " + JSON.stringify(moreThanTenSubItem));
          this._threePageUseTable = [];
          this._threePageUseTable.push("\n\u4f01\u4e1a: " + this._balanceObj[stockCode].getStockName() + ",  \u603b\u5f97\u5206 :" + totalScore.toFixed(2) + "\u5206, \u8be6\u7ec6\u8bc4\u5206\u7ec6\u5219\u53ef\u524d\u5f80\u5c0f\u5de5\u5177\u67e5, \u5de5\u5177\u5730\u5740\u89c1\u6587\u672b");
          this._threePageUseTable.push("\n\u91cd\u5927\u52a0\u5206\u9879(%)\uff1a" + JSON.stringify(moreThanTenAddItem));
          this._threePageUseTable.push("\n\u91cd\u5927\u51cf\u5206\u9879(%): " + JSON.stringify(moreThanTenSubItem));
          if (onlyNeedScore) return;
          infoTable.unshift("\n\u4f01\u4e1a: " + this._balanceObj[stockCode].getStockName() + ",  \u603b\u5f97\u5206 :" + totalScore.toFixed(2) + "\u5206, \t\t\t\t\u7edf\u8ba1\u8d44\u4ea7\u5360\u6bd4:" + assetsTotalPercent.toFixed(2) + "%, \t\t\t\t\u7edf\u8ba1\u8d1f\u503a\u5360\u603b\u8d1f\u503a:" + debtPercent + "%");
          infoTable.push("\n\u6ce8\u610f\uff0c\u91cd\u5927\u52a0\u51cf\u5206\u9879\uff0c\u5c31\u662f\u770b\u8d22\u62a5\u65f6\u9700\u8981\u6ce8\u610f\u7684\u5730\u65b9\uff0c\u7ed3\u5408\u9644\u6ce8\u548c\u4f01\u4e1a\u5b9e\u9645\u7ecf\u8425\uff0c\u770b\u6570\u636e\u7684\u5408\u7406\u6027\uff01");
          infoTable.push("\n\u58f0\u660e\uff1a");
          infoTable.push("\n1\u3001\u6570\u636e\u6765\u6e90\uff0c\u516c\u53f8\u5e74\u62a5\uff0c\u771f\u5b9e\u53ef\u9760\u3002");
          infoTable.push("\n2\u3001\u672c\u5de5\u5177\u4ec5\u5bf9\u8d22\u52a1\u505a\u51fa\u8bc4\u5206\uff0c\u4e0d\u6d89\u53ca\u4f01\u4e1a\u7ecf\u8425,\u8bc4\u5206\u4ec5\u4f9b\u53c2\u8003");
          infoTable.push("\n3\u3001\u8bc4\u5206\u80fd\u5927\u6982\u63cf\u8ff0\u51fa\u4f01\u4e1a\u7684\u8d22\u52a1\u72b6\u51b5\uff0c\u5b9e\u9645\u8fd0\u7528\u9700\u7ed3\u5408\u4f01\u4e1a\u7ecf\u8425\u60c5\u51b5");
          false === global.isNoAd && infoTable.push("\n4\u3001\u6b22\u8fce\u5173\u6ce8\u5fae\u4fe1\u516c\u4f17\u53f7\uff1aArkad\u7684\u5c0f\u4e66\u7ae5\uff0c\u81ea\u5df1\u67e5\u8be2\u66f4\u591a\u4f01\u4e1a\u7684\u8bc4\u5206");
          infoTable.push("\n");
          infoTable.push("\n\n\u7279\u522b\u63d0\u793a\uff1a\u56e0\u5404\u4e2a\u884c\u4e1a\u7684\u8d44\u4ea7\u8d1f\u503a\u7ed3\u6784\u4e0d\u540c\uff0c\u6545\u67d0\u4e9b\u884c\u4e1a\u65e0\u6cd5\u4f5c\u51fa\u6b63\u786e\u8bc4\u5206");
          infoTable.push("\n\u82e5\u53d1\u73b0\u7edf\u8ba1\u8d44\u4ea7\u5360\u6bd4\u975e\u5e38\u4f4e\uff0c\u5c31\u8bf4\u660e\u4e0d\u9002\u5408\u8fd9\u5957\u7b97\u6cd5\u3002\u5df2\u77e5\u4e0d\u5339\u914d\u884c\u4e1a\uff1a\u94f6\u884c\uff0c\u4fdd\u9669\uff0c\u5730\u4ea7");
          infoTable.push("\n");
          returnInfo = "";
          maxScore = this._stockCode < 1e3 ? this._stockCode : 150;
          profitAdd = this._getAverageNetProfitYoy(stockCode);
          PE = this._profitObj[stockCode].getPETTM();
          totalScore > maxScore && (returnInfo = "\n" + this._balanceObj[stockCode].getBaseInfo() + ":\u603b\u5f97\u5206 :" + totalScore.toFixed(2) + ", PE:" + PE + ", \u5229\u6da6\u589e\u957f\u7387\uff1a" + profitAdd);
          return needScore ? totalScore : returnInfo;
        },
        _getSelfSelectStockTable: function() {
          var selfSelectTable;
          selfSelectTable = cc.sys.localStorage.getItem("selfSelect") || [];
          0 !== selfSelectTable.length && (selfSelectTable = JSON.parse(selfSelectTable));
          return selfSelectTable;
        },
        onAddSelfSelect: function() {
          var ref, selfSelectTable;
          selfSelectTable = this._getSelfSelectStockTable();
          if (ref = this._stockCode, indexOf.call(selfSelectTable, ref) >= 0) return;
          selfSelectTable.push(this._stockCode);
          return cc.sys.localStorage.setItem("selfSelect", JSON.stringify(selfSelectTable));
        },
        _createSelfSelectStockNode: function(stockCode, index, fromPanel) {
          var name, selectCodeNode, stockInfo;
          selectCodeNode = cc.instantiate(this.m_prefab_select_code);
          if (this._isAllTableLoadFinish(stockCode)) {
            name = this._balanceObj[stockCode].getStockName();
            stockInfo = "(" + (index + 1) + ")---" + stockCode + "---" + name;
          } else stockInfo = "";
          selectCodeNode.getComponent("selfSelect").setStockInfo(stockCode, stockInfo, fromPanel);
          selectCodeNode.getComponent("selfSelect").mainDialog = this;
          return selectCodeNode;
        },
        _tryLoadFile: function(stockCode) {
          cc.log("load file :" + stockCode);
          return this._loadFileToObj(stockCode);
        },
        _createSelfSelectStockList: function() {
          var index, j, len, node, selfSelectTable, stockCode;
          this.m_self_select_stock_node.removeAllChildren();
          selfSelectTable = this._getSelfSelectStockTable();
          for (index = j = 0, len = selfSelectTable.length; j < len; index = ++j) {
            stockCode = selfSelectTable[index];
            node = this._createSelfSelectStockNode(stockCode, index);
            node.x = -540;
            this.m_self_select_stock_node.addChild(node);
          }
        },
        onOpenSelfSelectPanel: function() {
          if (false === this.m_self_select_stock_panel.active) {
            this.m_history_panel.active = false;
            this.m_self_select_stock_panel.active = true;
            return this._createSelfSelectStockList();
          }
          return this.m_self_select_stock_panel.active = false;
        },
        onGetSelectStockInfo: function(stockCode) {
          this.onOpenSelfSelectPanel();
          this.setStockCode(stockCode);
          return this.onClickButton();
        },
        onDeleteSelectStock: function(targetStockCode) {
          var index, j, selfSelectTable, stockCode;
          selfSelectTable = this._getSelfSelectStockTable();
          for (index = j = selfSelectTable.length - 1; j >= 0; index = j += -1) {
            stockCode = selfSelectTable[index];
            stockCode === targetStockCode && selfSelectTable.splice(index, 1);
          }
          cc.sys.localStorage.setItem("selfSelect", JSON.stringify(selfSelectTable));
          return this._createSelfSelectStockList();
        },
        onMakeOneTop: function(targetStockCode) {
          var index, j, selfSelectTable, stockCode;
          selfSelectTable = this._getSelfSelectStockTable();
          for (index = j = selfSelectTable.length - 1; j >= 0; index = j += -1) {
            stockCode = selfSelectTable[index];
            if (stockCode === targetStockCode) {
              selfSelectTable.splice(index, 1);
              break;
            }
          }
          selfSelectTable.unshift(targetStockCode);
          cc.sys.localStorage.setItem("selfSelect", JSON.stringify(selfSelectTable));
          return this._createSelfSelectStockList();
        },
        _preLoadSelfSelectCode: function() {
          var defaultStock, j, len, selfSelectTable;
          selfSelectTable = this._getSelfSelectStockTable();
          if (0 === selfSelectTable.length) {
            for (j = 0, len = defaultSelectStocks.length; j < len; j++) {
              defaultStock = defaultSelectStocks[j];
              selfSelectTable.push(defaultStock);
            }
            cc.sys.localStorage.setItem("selfSelect", JSON.stringify(selfSelectTable));
          }
          global.canLoad = true;
          return this._loadTable(null, selfSelectTable);
        },
        _preLoadSameCompanyCode: function() {
          var defaultStock, j, len, sameCompanyTable;
          sameCompanyTable = [];
          for (j = 0, len = SameIndustryCompany.length; j < len; j++) {
            defaultStock = SameIndustryCompany[j];
            sameCompanyTable.push(defaultStock);
          }
          global.canLoad = true;
          return this._loadTable(null, sameCompanyTable);
        },
        _getHistroyStockTable: function() {
          var histroyQueryTable;
          histroyQueryTable = cc.sys.localStorage.getItem("histroy_query") || [];
          0 !== histroyQueryTable.length && (histroyQueryTable = JSON.parse(histroyQueryTable));
          histroyQueryTable = histroyQueryTable.slice(0, 50);
          return histroyQueryTable;
        },
        _onAddHistroyQuery: function(stockCode) {
          var histroyQueryTable;
          histroyQueryTable = this._getHistroyStockTable();
          if (indexOf.call(histroyQueryTable, stockCode) >= 0) return;
          histroyQueryTable.unshift(stockCode);
          return cc.sys.localStorage.setItem("histroy_query", JSON.stringify(histroyQueryTable));
        },
        _createHistoryStockList: function() {
          var index, j, len, node, selfSelectTable, stockCode;
          this.m_history_content_node.removeAllChildren();
          selfSelectTable = this._getHistroyStockTable();
          for (index = j = 0, len = selfSelectTable.length; j < len; index = ++j) {
            stockCode = selfSelectTable[index];
            node = this._createSelfSelectStockNode(stockCode, index, "history");
            node.x = -540;
            this.m_history_content_node.addChild(node);
          }
        },
        onOpenHistoryPanel: function() {
          if (false === this.m_history_panel.active) {
            this._preLoadHistoryCode();
            this.m_history_panel.active = true;
            this.m_self_select_stock_panel.active = false;
            return this._createHistoryStockList();
          }
          return this.m_history_panel.active = false;
        },
        onGetHistoryStockInfo: function(stockCode) {
          this.onOpenHistoryPanel();
          this.setStockCode(stockCode);
          return this.onClickButton();
        },
        _preLoadHistoryCode: function() {
          var historyTable;
          if (true === this._loadHistoryStatus) return;
          this._loadHistoryStatus = true;
          historyTable = this._getHistroyStockTable();
          global.canLoad = true;
          return this._loadTable(null, historyTable);
        },
        onOpenProfitPanel: function() {
          return cc.director.loadScene("profit");
        },
        _addOpenCount: function() {
          var openCount;
          openCount = cc.sys.localStorage.getItem("openCount") || 0;
          openCount = Number(openCount);
          openCount += 1;
          cc.log("open count :" + openCount);
          return cc.sys.localStorage.setItem("openCount", openCount);
        },
        _tryOpenAd: function() {
          var isNoAd, openCount;
          openCount = cc.sys.localStorage.getItem("openCount") || 0;
          openCount = Number(openCount);
          isNoAd = cc.sys.localStorage.getItem("isNoAd") || false;
          isNoAd = Boolean(isNoAd);
          if (openCount > this._tryOpenAdCount && false === isNoAd) {
            this.m_ad_icon.active = true;
            return this.m_ad_tips.string = this._adStringMin;
          }
        },
        _tryShowActiveCodePanel: function() {
          var isActive, openCount;
          return;
        },
        _getGoodJobTopTen: function(stockCode, isGetRank) {
          var afterCalcObj, baseInfo, code, index, info, j, k, key, keyValue, len, len1, onMarketTime, orderInfo, ref, sortedObjKeys, topTen, value;
          afterCalcObj = {};
          ref = this._rankPercentObj;
          for (code in ref) {
            value = ref[code];
            afterCalcObj[code] = Math.floor(100 * (1 - utils.getAverage(value)));
          }
          sortedObjKeys = Object.keys(afterCalcObj).sort(function(a, b) {
            return afterCalcObj[b] - afterCalcObj[a];
          });
          if (isGetRank) return sortedObjKeys.indexOf(stockCode) + 1;
          this._scoreRankTable = [];
          for (index = j = 0, len = sortedObjKeys.length; j < len; index = ++j) {
            key = sortedObjKeys[index];
            keyValue = afterCalcObj[key];
            onMarketTime = "_" + this._profitObj[key].getOnMarketTime();
            baseInfo = key + "_" + this._balanceObj[key].getStockName() + onMarketTime;
            info = "\n" + (index + 1) + "\u3001" + baseInfo + "---\x3e: " + keyValue + "%";
            this._scoreRankTable.push(info);
          }
          topTen = sortedObjKeys.slice(0, 10);
          orderInfo = [];
          for (index = k = 0, len1 = topTen.length; k < len1; index = ++k) {
            key = topTen[index];
            keyValue = afterCalcObj[key];
            onMarketTime = "_" + this._profitObj[key].getOnMarketTime();
            baseInfo = key + "_" + this._balanceObj[key].getStockName() + onMarketTime;
            info = "\n" + (index + 1) + "\u3001" + baseInfo + "---\x3e: " + keyValue + "%";
            orderInfo.push(info);
          }
          return orderInfo;
        },
        _getCommentString: function(itemName, selfNum, middleNum, rankNum, allCompanyCount, isMinIsGood) {
          var addString, badEndChar, goodEndChar, isSelfUse, middleBadEndChar, middleEndChar, moreThanMiddlePercent, rankPercent, shouXianAddString;
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          if (!isSelfUse) return "";
          if (0 === rankNum || 0 === selfNum) return "\u6570\u636e\u8ba1\u7b97\u53ef\u80fd\u6709\u95ee\u9898\uff0c\u6b64\u9879\u65e0\u6cd5\u8bc4\u4ef7";
          if ("\u6838\u5fc3\u5229\u6da6" === itemName) {
            selfNum = selfNum.replace(/[^0-9.]/gi, "");
            middleNum = middleNum.replace(/[^0-9.]/gi, "");
          }
          moreThanMiddlePercent = Math.abs(Math.floor((selfNum - middleNum) / middleNum * 100));
          moreThanMiddlePercent <= 10 ? moreThanMiddlePercent = "\u4e00\u70b9\u70b9" : 10 < moreThanMiddlePercent && moreThanMiddlePercent < 40 ? moreThanMiddlePercent = 10 * Math.floor(moreThanMiddlePercent / 10) + "%+" : 40 <= moreThanMiddlePercent && moreThanMiddlePercent < 60 ? moreThanMiddlePercent = "50%\u5de6\u53f3" : 60 <= moreThanMiddlePercent && moreThanMiddlePercent < 80 ? moreThanMiddlePercent = 10 * Math.floor(moreThanMiddlePercent / 10) + "%+\uff0c\u4e00\u534a\u4ee5\u4e0a" : 80 <= moreThanMiddlePercent && moreThanMiddlePercent < 100 ? moreThanMiddlePercent = 10 * Math.floor(moreThanMiddlePercent / 10) + "%+\uff0c\u63a5\u8fd1\u4e00\u500d" : 100 <= moreThanMiddlePercent && moreThanMiddlePercent < 200 ? moreThanMiddlePercent = "\u4e00\u500d\u4ee5\u4e0a" : moreThanMiddlePercent >= 200 && (moreThanMiddlePercent = Math.floor(moreThanMiddlePercent / 100) + "\u500d\u591a");
          if (1 === rankNum) return itemName + "\u5728\u884c\u4e1a\u6392\u540d\u7b2c\u4e00\uff0c\u53ef\u4ee5\u8bf4\u76f8\u5f53\u4f18\u79c0\u4e86\u3002\u4ece\u7edd\u5bf9\u503c\u4e0a\u770b\uff0c\u8d85\u8d8a\u884c\u4e1a\u4e2d\u4f4d\u6570" + moreThanMiddlePercent + "\uff0c\u5389\u5bb3";
          if (selfNum === middleNum) return itemName + "\u5904\u4e8e\u884c\u4e1a\u4e2d\u4f4d\u6570\uff0c\u4e0d\u591a\u4e0d\u5c11\uff0c\u7b97\u4e2d\u7b49\u5427";
          rankPercent = (rankNum - 1) / allCompanyCount * 100;
          badEndChar = [ "\u5f88\u5dee\u4e86\u54c8", "\u5f88\u5dee\u561b", "\u5f88\u5dee\u4e86\u54e6", "\u7b80\u76f4\u4e0d\u60f3\u770b", "\u6570\u636e\u7b97\u9519\u4e86\uff1f" ];
          goodEndChar = [ "\u4f18\u79c0", "\u76f8\u5f53\u4f18\u79c0", "\u975e\u5e38\u4f18\u79c0", "\u597d\u5bb6\u4f19", "nice" ];
          middleEndChar = [ "\u8fd8\u53ef\u4ee5", "\u8fd8\u884c\u5427", "\u8fd8\u4e0d\u9519", "just so so", "\u5c06\u5c31\u80fd\u770b" ];
          middleBadEndChar = [ "\u7565\u5dee\u5427", "\u6709\u70b9\u5dee", "\u6bd4\u8f83\u5dee\u54af", "\u62d6\u540e\u817f\u5440", "\u5403\u9762" ];
          shouXianAddString = "";
          selfNum >= 100 && (shouXianAddString = ", \u4f46\u7edd\u5bf9\u503c\u5df2\u7ecf\u8d85\u8fc7100%\uff0c\u574f\u8d26\u98ce\u9669\u6bd4\u8f83\u4f4e\uff0c\u4e0d\u7528\u4e8e\u7ea0\u7ed3\u6392\u540d\u54c8");
          "\u6536\u73b0\u6bd4" !== itemName && (shouXianAddString = "");
          if (rankPercent < 25) {
            addString = "\u4ece\u6570\u503c\u4e0a\u770b\uff0c\u8d85\u8d8a\u884c\u4e1a\u4e2d\u4f4d\u6570" + moreThanMiddlePercent + ", ";
            isMinIsGood && (addString = "");
            return itemName + "\u5728\u884c\u4e1a\u4e2d\u5904\u4e8e\u9876\u5c16\u4f4d\u7f6e\uff0c\u6392\u540d\u7b2c" + rankNum + ", " + addString + goodEndChar[utils.getRandomInt(0, 4)];
          }
          if (25 <= rankPercent && rankPercent < 50) {
            addString = "\u4ece\u6570\u503c\u4e0a\u770b\uff0c\u8d85\u8d8a\u884c\u4e1a\u4e2d\u4f4d\u6570" + moreThanMiddlePercent + ", ";
            isMinIsGood && (addString = "");
            return itemName + "\u5728\u884c\u4e1a\u4e2d\u5904\u4e8e\u4e2d\u4e0a\u5c42\uff0c\u6392\u540d\u7b2c" + rankNum + ", " + addString + middleEndChar[utils.getRandomInt(0, 4)];
          }
          if (50 <= rankPercent && rankPercent < 75) {
            addString = "\u4ece\u6570\u503c\u4e0a\u770b\uff0c\u4f4e\u4e8e\u884c\u4e1a\u4e2d\u4f4d\u6570" + moreThanMiddlePercent + ", ";
            isMinIsGood && (addString = "");
            return itemName + "\u5728\u884c\u4e1a\u4e2d\u5904\u4e8e\u4e2d\u4e0b\u4f4d\u7f6e\uff0c\u6392\u540d\u7b2c" + rankNum + ", " + addString + middleBadEndChar[utils.getRandomInt(0, 4)] + shouXianAddString;
          }
          if (75 <= rankPercent && rankPercent < 100) {
            addString = "\u4f4e\u4e8e\u884c\u4e1a\u4e2d\u4f4d\u6570" + moreThanMiddlePercent + ", ";
            isMinIsGood && (addString = "");
            return itemName + "\u5728\u884c\u4e1a\u4e2d\u5904\u4e8e\u57ab\u5e95\u4f4d\u7f6e\uff0c\u6392\u540d\u7b2c" + rankNum + "\uff0c \u5012\u6570\u7b2c" + (allCompanyCount + 1 - rankNum) + ", " + addString + badEndChar[utils.getRandomInt(0, 4)] + shouXianAddString;
          }
          if (rankNum === allCompanyCount) {
            addString = "\u4f4e\u4e8e\u884c\u4e1a\u4e2d\u4f4d\u6570" + moreThanMiddlePercent + ", ";
            isMinIsGood && (addString = "");
            return "\u8fd9" + itemName + "\u5728\u884c\u4e1a\u4e2d\u6700\u5dee\uff0c\u6392\u540d\u5012\u6570\u7b2c\u4e00, " + addString + "\u975e\u5e38\u5dee" + shouXianAddString;
          }
        },
        _getLastSuggest: function(stockCode, percent, rank, allCompanyCount) {
          var addTips, dateTime, day, isSelfUse, month, timeStr, year;
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          if (!isSelfUse) return "";
          timeStr = this._profitObj[stockCode].getOnMarketTimeNumber();
          if (0 === timeStr) return "";
          year = timeStr.slice(0, 4);
          month = timeStr.slice(4, 6);
          day = timeStr.slice(6, 8);
          dateTime = new Date(year, month, day).getTime();
          addTips = "";
          dateTime > new Date(2019, 11, 31).getTime() && (addTips = "\u7279\u522b\u63d0\u9192\uff1a\u8fd9\u662f\u4e00\u53ea\u6b21\u65b0\u80a1\uff0c\u8d22\u52a1\u6570\u636e\u6709\u7f8e\u5316\u7684\u53ef\u80fd");
          if (1 === rank && allCompanyCount >= 5) return "\u7efc\u5408\u6392\u540d\u5728\u884c\u4e1a\u5185\u7b2c\u4e00\u540d\uff0c\u4e00\u5b9a\u6709\u8fc7\u4eba\u4e4b\u5904\uff0c\u5f3a\u70c8\u63a8\u8350\uff0c\u53ef\u7ed3\u5408\u4f01\u4e1a\u7684\u4e1a\u52a1\u5206\u6790\u5206\u6790\uff0c\u53ef\u80fd\u662f\u4e2a\u597d\u6807\u7684\u3002" + addTips;
          if (percent <= 30) return "\u7efc\u5408\u6392\u540d\u592a\u5dee\u4e86\uff0c\u6570\u636e\u6ca1\u7b97\u9519\u5427\uff1f\u53ef\u4ee5\u770b\u770b\u4e1a\u52a1\uff0c\u6709\u6ca1\u6709\u8f6c\u673a";
          if (percent <= 50) return "\u7efc\u5408\u6392\u540d\u6709\u70b9\u5dee\uff0c\u597d\u597d\u56de\u5fc6\u4e00\u4e0b\u4e70\u5165\u903b\u8f91\u662f\u5565, \u662f\u5426\u7ecf\u5f97\u8d77\u63a8\u6572\uff0c\u4e5f\u6709\u53ef\u80fd\u662f\u8d22\u52a1\u65b9\u9762\u8868\u73b0\u5dee\uff0c\u5b9e\u9645\u4e1a\u52a1\u8fd8\u633a\u597d " + addTips;
          if (50 < percent && percent <= 70) return "\u7efc\u5408\u6392\u540d\u4e2d\u7b49\u504f\u4e0a\uff0c\u53ef\u4ee5\u82b1\u65f6\u95f4\u4e86\u89e3\u4e00\u4e0b\uff0c\u6216\u8bb8\u6709\u6295\u8d44\u673a\u4f1a, " + addTips;
          if (70 < percent && percent <= 80) return "\u7efc\u5408\u6392\u540d\u8f83\u9ad8\uff0c\u63a8\u8350\u5173\u6ce8\uff0c\u6216\u8bb8\u662f\u4e2a\u4e0d\u9519\u7684\u6295\u8d44\u673a\u4f1a, " + addTips;
          if (percent > 80) return "\u7efc\u5408\u6392\u540d\u5f88\u9ad8\uff0c\u5f3a\u70c8\u63a8\u8350\uff0c\u7ed3\u5408\u4f01\u4e1a\u7ecf\u8425\u5206\u6790\u5206\u6790\uff0c\u53ef\u80fd\u6709\u641e\u5934, " + addTips;
          return "";
        },
        _getPEComment: function(stockCode) {
          var isSelfUse, pe;
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          if (!isSelfUse) return "";
          pe = this._profitObj[stockCode].getPETTM();
          if (pe < 0) return "\u4e8f\u94b1\u7684\u4f01\u4e1a\uff0cPE\u4f30\u503c\u5df2\u7ecf\u5931\u6548\u4e86";
          if (pe <= 20) return "\u4f30\u503c\u4e0d\u8d35\uff0c\u5904\u4e8e\u4f4e\u4f30\u533a\u57df\uff0c\u53ef\u4ee5\u627e\u4e00\u627e\u4f30\u503c\u4f4e\u7684\u539f\u56e0";
          if (20 < pe && pe <= 40) return "\u4f30\u503c\u5728\u5408\u7406\u8303\u56f4\uff0c\u4e0d\u7528\u8fc7\u4e8e\u62c5\u5fc3";
          if (40 < pe && pe <= 60) return "\u4f30\u503c\u5408\u7406\u504f\u8d35\uff0c\u5e02\u573a\u770b\u597d\u516c\u53f8\u7684\u4ec0\u4e48\u4e1a\u52a1\u5462\uff1f";
          if (60 < pe && pe <= 100) return "\u4f30\u503c\u592a\u8d35\u4e86\uff0c\u8981\u6ce8\u610f\u98ce\u9669\u5440\uff0c\u662f\u6709\u4ec0\u4e48\u597d\u7684\u9884\u671f\u5417\uff1f";
          if (pe > 100) return "\u8fd9\u96be\u9053\u5c31\u662f\u4f20\u8bf4\u4e2d\u7684\u4f18\u8d28\u8d5b\u9053\uff1f\u4f60\u4e0d\u8981\u6015\u9ad8\uff0c\u4f60\u8981\u662f\u6015\u9ad8\uff0c\u90a3\u4f60\u5c31\u662f\u82e6\u547d\u4eba\uff0c\u54c8\u54c8\uff0c\u5f00\u4e2a\u73a9\u7b11\u3002\u4ec1\u8005\u89c1\u4ec1\uff0c\u667a\u8005\u89c1\u667a\uff0c\u5927\u5bb6\u81ea\u5df1\u8003\u8651\u54c8";
        },
        _getAssetsComment: function() {
          var isSelfUse;
          isSelfUse = cc.sys.localStorage.getItem("self_use") || false;
          if (!isSelfUse) return "";
          return "\u8d44\u4ea7\u8d1f\u503a\u8868\u5927\u5bb6\u53ef\u4ee5\u7ed3\u5408\u4f01\u4e1a\u7684\u5546\u4e1a\u6a21\u5f0f\uff0c\u5224\u65ad\u4e00\u4e0b\u5404\u9879\u8d44\u4ea7\u7684\u5408\u7406\u6027\u3002";
        },
        _addThreeMinitePage: function(stockCode, importInfo, netProfitAddRatio, aveRoe, netProfitRatio, freeCashRatio) {
          var allCompanyCount, assertsTop10Key, commentString0, commentString1, commentString2, commentString3, commentString4, commentString5, commentString6, commentString7, commentString8, endPos, goodRankItem, index, industryInfo0, industryInfo1, industryInfo2, industryInfo3, industryInfo4, industryInfo5, industryInfo6, industryInfo7, industryInfo8, itemNameTable, j, k, len, len1, middleNum0, middleNum1, middleNum2, middleNum3, middleNum4, middleNum5, middleNum6, middleNum7, middleNum8, page, rank, rankNum0, rankNum1, rankNum2, rankNum3, rankNum4, rankNum5, rankNum6, rankNum7, rankNum8, rankTable, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, sameIndustryStockCode, selfInfo0, selfInfo1, selfInfo2, selfInfo3, selfInfo4, selfInfo5, selfInfo6, selfInfo7, selfInfo8, stock, top10StockInfo, topOneKey, topTenStockCodeTable;
          assertsTop10Key = this._balanceObj[stockCode].getAssetsTop10Key();
          topOneKey = assertsTop10Key[0];
          endPos = topOneKey.indexOf("(");
          topOneKey = topOneKey.slice(0, endPos);
          this._rankPercentObj = {};
          sameIndustryStockCode = this._getIndustryAverage(stockCode, "\u524d\u5341\u4f01\u4e1a");
          topTenStockCodeTable = sameIndustryStockCode.slice(0, 10);
          top10StockInfo = "";
          ref = this._getIndustryBaseInfo(topTenStockCodeTable, true);
          for (j = 0, len = ref.length; j < len; j++) {
            stock = ref[j];
            top10StockInfo += stock;
            top10StockInfo += "\n";
          }
          allCompanyCount = sameIndustryStockCode.length;
          selfInfo0 = utils.getValueDillion(this._profitObj[stockCode].getCoreProfit()[0]);
          selfInfo1 = this._profitObj[stockCode].getIncomeAddRatio();
          selfInfo2 = netProfitAddRatio;
          selfInfo3 = this._profitObj[stockCode].getNetProfitRatio()[0];
          -1 !== selfInfo3.indexOf("Infinity") && (selfInfo3 = 0);
          selfInfo4 = this._getROE(stockCode)[0];
          selfInfo5 = this._getCashTurnoverDays(stockCode);
          selfInfo6 = this._profitObj[stockCode].getExpenseRatio()[0];
          -1 !== selfInfo6.indexOf("Infinity") && (selfInfo6 = 0);
          selfInfo7 = this._getIncomeQuality(stockCode)[0];
          isNaN(selfInfo7) && (selfInfo7 = 0);
          selfInfo8 = this._profitObj[stockCode].getPETTM();
          this._prepareToSaveCsvFileTable.push([ this._balanceObj[stockCode].getStockName(), selfInfo0, selfInfo1, selfInfo2, selfInfo3, selfInfo4, selfInfo5, selfInfo6, selfInfo7 ]);
          cc.log("prepare csv", JSON.stringify(this._prepareToSaveCsvFileTable));
          ref1 = this._getIndustryAverage(stockCode, "\u6838\u5fc3\u5229\u6da6"), industryInfo0 = ref1[0], 
          middleNum0 = ref1[1], rankNum0 = ref1[2];
          ref2 = this._getIndustryAverage(stockCode, "\u8425\u6536\u590d\u5408\u589e\u957f\u7387"), 
          industryInfo1 = ref2[0], middleNum1 = ref2[1], rankNum1 = ref2[2];
          ref3 = this._getIndustryAverage(stockCode, "\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387"), 
          industryInfo2 = ref3[0], middleNum2 = ref3[1], rankNum2 = ref3[2];
          ref4 = this._getIndustryAverage(stockCode, "\u51c0\u5229\u7387"), industryInfo3 = ref4[0], 
          middleNum3 = ref4[1], rankNum3 = ref4[2];
          ref5 = this._getIndustryAverage(stockCode, "\u51c0\u8d44\u4ea7\u6536\u76ca\u7387"), 
          industryInfo4 = ref5[0], middleNum4 = ref5[1], rankNum4 = ref5[2];
          ref6 = this._getIndustryAverage(stockCode, "\u73b0\u91d1\u5468\u8f6c"), industryInfo5 = ref6[0], 
          middleNum5 = ref6[1], rankNum5 = ref6[2];
          ref7 = this._getIndustryAverage(stockCode, "\u8d39\u7528\u7387"), industryInfo6 = ref7[0], 
          middleNum6 = ref7[1], rankNum6 = ref7[2];
          ref8 = this._getIndustryAverage(stockCode, "\u6536\u73b0\u6bd4"), industryInfo7 = ref8[0], 
          middleNum7 = ref8[1], rankNum7 = ref8[2];
          ref9 = this._getIndustryAverage(stockCode, "\u5e02\u76c8\u7387TTM"), industryInfo8 = ref9[0], 
          middleNum8 = ref9[1], rankNum8 = ref9[2];
          goodRankItem = [];
          itemNameTable = [ "\u6838\u5fc3\u5229\u6da6", "\u8425\u6536\u590d\u5408\u589e\u957f\u7387", "\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387", "\u51c0\u5229\u7387", "\u51c0\u8d44\u4ea7\u6536\u76ca\u7387", "\u73b0\u91d1\u5468\u8f6c\u5929\u6570", "\u8d39\u7528\u7387", "\u6536\u73b0\u6bd4", "\u5e02\u76c8\u7387TTM" ];
          rankTable = [ rankNum0, rankNum1, rankNum2, rankNum3, rankNum4, rankNum5, rankNum6, rankNum7, rankNum8 ];
          for (index = k = 0, len1 = rankTable.length; k < len1; index = ++k) {
            rank = rankTable[index];
            rank <= 3 && goodRankItem.push(itemNameTable[index]);
          }
          0 === goodRankItem.length && (goodRankItem = "\u65e0");
          commentString0 = this._getCommentString("\u6838\u5fc3\u5229\u6da6", selfInfo0, middleNum0, rankNum0, allCompanyCount);
          commentString1 = this._getCommentString("\u8425\u6536\u590d\u5408\u589e\u957f\u7387", selfInfo1, middleNum1, rankNum1, allCompanyCount);
          commentString2 = this._getCommentString("\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387", selfInfo2, middleNum2, rankNum2, allCompanyCount);
          commentString3 = this._getCommentString("\u51c0\u5229\u7387", selfInfo3, middleNum3, rankNum3, allCompanyCount);
          commentString4 = this._getCommentString("\u51c0\u8d44\u4ea7\u6536\u76ca\u7387", selfInfo4, middleNum4, rankNum4, allCompanyCount);
          commentString5 = this._getCommentString("\u73b0\u91d1\u5468\u8f6c\u5929\u6570", selfInfo5, middleNum5, rankNum5, allCompanyCount, true);
          commentString6 = this._getCommentString("\u8d39\u7528\u7387", selfInfo6, middleNum6, rankNum6, allCompanyCount, true);
          commentString7 = this._getCommentString("\u6536\u73b0\u6bd4", selfInfo7, middleNum7, rankNum7, allCompanyCount);
          commentString8 = this._getCommentString("\u5e02\u76c8\u7387TTM", selfInfo8, middleNum8, rankNum8, allCompanyCount, true);
          page = "$" + stockCode + "$\n\u300aAI\u8bfb\u8d22\u62a5\u7cfb\u5217\u300b\n \u8d22\u62a5\u592a\u590d\u6742\uff1f\u8bd5\u8bd5\u667a\u80fd\u673a\u5668\u4eba\u8bfb\u8d22\u62a5\u5427\n \u58f0\u660e\uff1a\u6b64\u6587\u4e3a\u673a\u5668\u4eba\u667a\u80fd\u8f93\u51fa\uff0c\u4e0d\u4e00\u5b9a\u5bf9\uff0c\u4ec5\u4f9b\u53c2\u8003\u3002\n \u76ee\u6807\u4f01\u4e1a: " + this._balanceObj[stockCode].getStockName() + "\n \u4f01\u4e1a\u5168\u79f0\uff1a" + this._companyInfo[1] + "\n \u63a7\u80a1\u80a1\u4e1c\uff1a" + this._companyInfo[3] + "\n \u9ad8\u7ba1\uff1a" + this._companyInfo[4] + "\n \u4e3b\u8425\u6536\u5165\u767e\u5206\u6bd4(%)\uff1a" + this._companyInfo[5] + "\n \u603b\u5e02\u503c\uff1a" + utils.addBillionUnit(this._balanceObj[stockCode].getTotalMarketValue()) + "\uff0c \u4e0a\u5e02\u65f6\u95f4\uff1a " + this._profitObj[stockCode].getOnMarketTime() + " \n \u6240\u5c5e\u4e8e\u884c\u4e1a\uff1a" + this._balanceObj[stockCode].getIndustry() + "\n " + importInfo + "\n\n \u884c\u4e1a\u5e02\u503c\u524d\u5341\u4f01\u4e1a(" + StockInfoTable.getInfoTime() + ")\uff1a\n " + top10StockInfo + "\n " + this._balanceObj[stockCode].getStockName() + "\u5728\u884c\u4e1a\u4e2d\u7684\u603b\u5e02\u503c\u6392\u540d\uff1a" + this._getIndustryAverage(stockCode, "\u603b\u5e02\u503c\u6392\u540d") + "\n \u6700\u65b0\u5e74\u62a5\u65f6\u95f4\uff1a" + this._balanceObj[stockCode].getTimeTitle()[0] + "\uff0c\u7531\u4e8e\u5b63\u62a5\u6570\u636e\u5bb9\u6613\u88ab\u64cd\u63a7\uff0c\u7b49\u65b0\u7684\u5e74\u62a5\u51fa\u6765\u540e\u4f1a\u66f4\u65b0\n " + this._getStaffInfo(stockCode) + "\n \u4e00\u3001\u4e5d\u9879\u6838\u5fc3\u6307\u6807\uff1a\n 1\u3001\u6838\u5fc3\u5229\u6da6\uff1a" + selfInfo0 + "\n " + industryInfo0 + "\n \u70b9\u8bc4: " + commentString0 + "\n 2\u3001\u8fd1" + this._balanceObj[stockCode].getExistYears() + "\u5e74\u8425\u4e1a\u6536\u5165\u590d\u5408\u589e\u957f\u7387\uff1a" + selfInfo1 + "%\n " + industryInfo1 + " \n \u70b9\u8bc4\uff1a" + commentString1 + "\n 3\u3001\u8fd1" + this._balanceObj[stockCode].getExistYears() + "\u5e74\u51c0\u5229\u6da6\u590d\u5408\u589e\u957f\u7387\uff1a" + selfInfo2 + "%\uff0c \n " + industryInfo2 + " \n \u70b9\u8bc4\uff1a" + commentString2 + "\n 4\u3001\u51c0\u5229\u7387: " + selfInfo3 + "%, \n " + industryInfo3 + " \n \u70b9\u8bc4\uff1a" + commentString3 + "\n 5\u3001\u51c0\u8d44\u4ea7\u6536\u76ca\u7387\uff1a" + selfInfo4 + "%\uff0c\n " + industryInfo4 + " \n\n \u675c\u90a6\u5206\u6790\u4e00\u4e0b\uff08" + this._balanceObj[stockCode].getTimeTitle()[0] + "\uff09\uff1a\n \u51c0\u5229\u7387: " + selfInfo3 + "%, \u4e0a\u9762\u5df2\u7ecf\u5206\u6790\u8fc7\u4e86\uff0c\u8fd9\u91cc\u7565\u8fc7\n\n \u603b\u8d44\u4ea7\u5468\u8f6c\u7387: " + this._getTotalAssetsTurnoverRatio(stockCode)[0] + "%, \n " + this._getIndustryAverage(stockCode, "\u603b\u8d44\u4ea7\u5468\u8f6c\u7387")[0] + " \n\n \u8d22\u52a1\u6760\u6746: " + this._balanceObj[stockCode].getFinancialLeverage()[0] + "%\n " + this._getIndustryAverage(stockCode, "\u6760\u6746\u7387")[0] + " \n\n \u6709\u606f\u8d1f\u503a\u7387\uff1a" + this._balanceObj[stockCode].getInterestDebt()[0] + "%\n\n \u70b9\u8bc4\uff1a" + commentString4 + "\n 6\u3001\u73b0\u91d1\u5468\u8f6c\u5929\u6570\uff1a" + selfInfo5 + "\u5929\n " + industryInfo5 + " \n \u5e94\u6536\u8d26\u6b3e\u5468\u8f6c\u5929\u6570: " + this._getReceivableTurnOverDays(stockCode)[0] + "\u5929\n \u5b58\u8d27\u5468\u8f6c\u5929\u6570: " + this._getInventoryTurnoverDays(stockCode)[0] + "\u5929\n \u5e94\u4ed8\u8d26\u6b3e\u5468\u8f6c\u5929\u6570: " + this._getPayableTurnoverDays(stockCode)[0] + "\u5929\n \u70b9\u8bc4: " + commentString5 + " \n 7\u3001\u4e09\u9879\u8d39\u7528\u7387: " + selfInfo6 + "%\n " + industryInfo6 + " \n \u9500\u552e\u8d39\u7528\u7387: " + this._profitObj[stockCode].getSellingFeeRatio()[0] + "%\n \u7ba1\u7406\u8d39\u7528\u7387: " + this._profitObj[stockCode].getManageFeeRatio()[0] + "%\n \u7814\u53d1\u8d39\u7528\u7387: " + this._profitObj[stockCode].getRDFeeRatio()[0] + "%\n \u8d22\u52a1\u8d39\u7528\u7387: " + this._profitObj[stockCode].getMoneyFeeRatio()[0] + "%\n \u70b9\u8bc4: " + commentString6 + " \n 8\u3001\u6536\u73b0\u6bd4\uff1a" + selfInfo7 + "%\n " + industryInfo7 + " \n \u70b9\u8bc4\uff1a" + commentString7 + "\n 9\u3001\u5e02\u76c8\u7387TTM\uff1a" + selfInfo8 + "\n " + industryInfo8 + "\n \u70b9\u8bc4\uff1a" + this._getPEComment(stockCode) + "\n \u4e5d\u9879\u6307\u6807\u7efc\u5408\u6392\u540d\uff0cTop10\uff1a " + this._getGoodJobTopTen() + " \n \u603b\u7ed3\uff1a\u4e5d\u9879\u6307\u6807\u7efc\u5408\u6392\u540d: " + this._getGoodJobTopTen(stockCode, true) + " \u767e\u5206\u4f4d\uff1a" + Math.floor(100 * (1 - utils.getAverage(this._rankPercentObj[stockCode]))) + "%,  \u5360\u636e\u524d\u4e09\u7684\u9879\u76ee\uff1a" + JSON.stringify(goodRankItem) + "\n " + this._getLastSuggest(stockCode, Math.floor(100 * (1 - utils.getAverage(this._rankPercentObj[stockCode]))), this._getGoodJobTopTen(stockCode, true), allCompanyCount) + "\n \u4e8c\u3001\u8d44\u4ea7\u767e\u5206\u6bd4\uff1a " + this._balanceObj[stockCode].getTop10() + " \n " + topOneKey + this._getIndustryAverage(stockCode, topOneKey)[0] + "\n \u70b9\u8bc4\uff1a" + this._getAssetsComment() + "\n\n \u516c\u53f8\u7b80\u4ecb: " + this._companyInfo[6] + "\n\n \u4e3b\u8425\u4ea7\u54c1: " + this._balanceObj[stockCode].getMainBusiness() + "\n\n \u672c\u6587\u76f8\u5173\u6570\u636e\u6765\u6e90\u4e8e\u6211\u5f00\u53d1\u7684\u5c0f\u5de5\u5177\uff1a\u300aAI\u8bfb\u8d22\u62a5\u300b \n \u5982\u679c\u60f3----\u8bd5\u7528\u5de5\u5177------\x3eAI\u8bfb\u8d22\u62a5<--\uff0c\u8bf7\u70b9\u51fb\u8fd9\u91cc: https://luban7.gitee.io \n \u5982\u679c\u4e0d\u592a\u660e\u767d\u8fd9\u7c7b\u6587\u7ae0\u7684\u601d\u8def\uff0c\u53ef\u5230\u6211\u7684\u4e3b\u9875\u67e5\u770b\u300a\u8be6\u89e3-\u4e09\u5206\u949f\u901f\u8bfb\u8d22\u62a5\u7cfb\u5217\u300bhttps://xueqiu.com/7829341444/171693064\n";
          return page;
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {
    "../CompanyInfo": "CompanyInfo",
    "../SameIndustryCompany": "SameIndustryCompany",
    "../StockInfoTable": "StockInfoTable",
    "../defaultSelfSelect": "defaultSelfSelect",
    "../globalValue": "globalValue",
    "../model/BalanceSheet": "BalanceSheet",
    "../model/CashFlowStatement": "CashFlowStatement",
    "../model/ProfitStatement": "ProfitStatement",
    "../selectStock": "selectStock",
    "../tools/utils": "utils"
  } ],
  selectStock: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4df35IKzixAEID0OWbGPZgc", "selectStock");
    (function() {
      var selectStocks;
      selectStocks = [ "\u6052\u745e\u533b\u836f", "\u7f8e\u7684\u96c6\u56e2", "\u5b81\u5fb7\u65f6\u4ee3", "\u683c\u529b\u7535\u5668", "\u6d77\u87ba\u6c34\u6ce5", "\u836f\u660e\u5eb7\u5fb7", "\u7231\u5c14\u773c\u79d1", "\u516c\u725b\u96c6\u56e2", "\u4e94\u7cae\u6db2", "\u6cf0\u683c\u533b\u7597", "\u5e7f\u8054\u8fbe", "\u6069\u6377\u80a1\u4efd", "\u7518\u674e\u836f\u4e1a", "\u51ef\u83b1\u82f1", "\u91d1\u57df\u533b\u5b66", "\u6c34\u4e95\u574a", "\u826f\u54c1\u94fa\u5b50", "\u51ef\u5229\u6cf0", "\u4e0a\u6d77\u673a\u7535", "\u56fd\u74f7\u6750\u6599", "\u5065\u5eb7\u5143" ];
      module.exports = selectStocks;
    }).call(this);
    cc._RF.pop();
  }, {} ],
  selfSelect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b0adEJzXRHhLgx+6riQEY4", "selfSelect");
    (function() {
      cc.Class({
        extends: cc.Component,
        properties: {
          m_info: cc.Label,
          m_to_top_node: cc.Node,
          m_to_del_node: cc.Node,
          mainDialog: {
            default: null,
            serializable: false
          }
        },
        onLoad: function() {},
        setStockInfo: function(stockCode, stockInfo, fromPanel) {
          this._stockCode = stockCode;
          this._fromPanel = fromPanel;
          "" === stockInfo && (stockInfo = stockCode);
          this.m_info.string = stockInfo;
          if ("history" === fromPanel) {
            this.m_to_top_node.active = false;
            return this.m_to_del_node.active = false;
          }
        },
        onSelect: function() {
          return "history" === this._fromPanel ? this.mainDialog.onGetHistoryStockInfo(this._stockCode) : this.mainDialog.onGetSelectStockInfo(this._stockCode);
        },
        onDelete: function() {
          return this.mainDialog.onDeleteSelectStock(this._stockCode);
        },
        onTop: function() {
          return this.mainDialog.onMakeOneTop(this._stockCode);
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {} ],
  storage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a4f8cHpbDxE4YFv3AjvRcTI", "storage");
    (function() {
      var storage;
      storage = {
        setItem: function(name, value) {
          return cc.sys.localStorage.setItem(name, JSON.stringify(value));
        },
        getItem: function(name) {
          try {
            return JSON.parse(cc.sys.localStorage.getItem(name));
          } catch (undefined) {}
        }
      };
      module.exports = storage;
    }).call(this);
    cc._RF.pop();
  }, {} ],
  title: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "545dfClN/RIRI4TZvRKdBv7", "title");
    (function() {
      var Balance, CashFlow, Profit, title;
      CashFlow = [ "\u8d44\u6599", "\u62a5\u544a\u65e5\u671f", "\u9500\u552e\u5546\u54c1\u3001\u63d0\u4f9b\u52b3\u52a1\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u5ba2\u6237\u5b58\u6b3e\u548c\u540c\u4e1a\u5b58\u653e\u6b3e\u9879\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u5411\u4e2d\u592e\u94f6\u884c\u501f\u6b3e\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u5411\u5176\u4ed6\u91d1\u878d\u673a\u6784\u62c6\u5165\u8d44\u91d1\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u6536\u5230\u539f\u4fdd\u9669\u5408\u540c\u4fdd\u8d39\u53d6\u5f97\u7684\u73b0\u91d1(\u4e07\u5143)", "\u6536\u5230\u518d\u4fdd\u9669\u4e1a\u52a1\u73b0\u91d1\u51c0\u989d(\u4e07\u5143)", "\u4fdd\u6237\u50a8\u91d1\u53ca\u6295\u8d44\u6b3e\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u5904\u7f6e\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u6536\u53d6\u5229\u606f\u3001\u624b\u7eed\u8d39\u53ca\u4f63\u91d1\u7684\u73b0\u91d1(\u4e07\u5143)", "\u62c6\u5165\u8d44\u91d1\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u56de\u8d2d\u4e1a\u52a1\u8d44\u91d1\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u6536\u5230\u7684\u7a0e\u8d39\u8fd4\u8fd8(\u4e07\u5143)", "\u6536\u5230\u7684\u5176\u4ed6\u4e0e\u7ecf\u8425\u6d3b\u52a8\u6709\u5173\u7684\u73b0\u91d1(\u4e07\u5143)", "\u7ecf\u8425\u6d3b\u52a8\u73b0\u91d1\u6d41\u5165\u5c0f\u8ba1(\u4e07\u5143)", "\u8d2d\u4e70\u5546\u54c1\u3001\u63a5\u53d7\u52b3\u52a1\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u5ba2\u6237\u8d37\u6b3e\u53ca\u57ab\u6b3e\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u5b58\u653e\u4e2d\u592e\u94f6\u884c\u548c\u540c\u4e1a\u6b3e\u9879\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u652f\u4ed8\u539f\u4fdd\u9669\u5408\u540c\u8d54\u4ed8\u6b3e\u9879\u7684\u73b0\u91d1(\u4e07\u5143)", "\u652f\u4ed8\u5229\u606f\u3001\u624b\u7eed\u8d39\u53ca\u4f63\u91d1\u7684\u73b0\u91d1(\u4e07\u5143)", "\u652f\u4ed8\u4fdd\u5355\u7ea2\u5229\u7684\u73b0\u91d1(\u4e07\u5143)", "\u652f\u4ed8\u7ed9\u804c\u5de5\u4ee5\u53ca\u4e3a\u804c\u5de5\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u652f\u4ed8\u7684\u5404\u9879\u7a0e\u8d39(\u4e07\u5143)", "\u652f\u4ed8\u7684\u5176\u4ed6\u4e0e\u7ecf\u8425\u6d3b\u52a8\u6709\u5173\u7684\u73b0\u91d1(\u4e07\u5143)", "\u7ecf\u8425\u6d3b\u52a8\u73b0\u91d1\u6d41\u51fa\u5c0f\u8ba1(\u4e07\u5143)", "\u7ecf\u8425\u6d3b\u52a8\u4ea7\u751f\u7684\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)", "\u6536\u56de\u6295\u8d44\u6240\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u53d6\u5f97\u6295\u8d44\u6536\u76ca\u6240\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u5904\u7f6e\u56fa\u5b9a\u8d44\u4ea7\u3001\u65e0\u5f62\u8d44\u4ea7\u548c\u5176\u4ed6\u957f\u671f\u8d44\u4ea7\u6240\u6536\u56de\u7684\u73b0\u91d1\u51c0\u989d(\u4e07\u5143)", "\u5904\u7f6e\u5b50\u516c\u53f8\u53ca\u5176\u4ed6\u8425\u4e1a\u5355\u4f4d\u6536\u5230\u7684\u73b0\u91d1\u51c0\u989d(\u4e07\u5143)", "\u6536\u5230\u7684\u5176\u4ed6\u4e0e\u6295\u8d44\u6d3b\u52a8\u6709\u5173\u7684\u73b0\u91d1(\u4e07\u5143)", "\u51cf\u5c11\u8d28\u62bc\u548c\u5b9a\u671f\u5b58\u6b3e\u6240\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u6295\u8d44\u6d3b\u52a8\u73b0\u91d1\u6d41\u5165\u5c0f\u8ba1(\u4e07\u5143)", "\u8d2d\u5efa\u56fa\u5b9a\u8d44\u4ea7\u3001\u65e0\u5f62\u8d44\u4ea7\u548c\u5176\u4ed6\u957f\u671f\u8d44\u4ea7\u6240\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u6295\u8d44\u6240\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u8d28\u62bc\u8d37\u6b3e\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u53d6\u5f97\u5b50\u516c\u53f8\u53ca\u5176\u4ed6\u8425\u4e1a\u5355\u4f4d\u652f\u4ed8\u7684\u73b0\u91d1\u51c0\u989d(\u4e07\u5143)", "\u652f\u4ed8\u7684\u5176\u4ed6\u4e0e\u6295\u8d44\u6d3b\u52a8\u6709\u5173\u7684\u73b0\u91d1(\u4e07\u5143)", "\u589e\u52a0\u8d28\u62bc\u548c\u5b9a\u671f\u5b58\u6b3e\u6240\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u6295\u8d44\u6d3b\u52a8\u73b0\u91d1\u6d41\u51fa\u5c0f\u8ba1(\u4e07\u5143)", "\u6295\u8d44\u6d3b\u52a8\u4ea7\u751f\u7684\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)", "\u5438\u6536\u6295\u8d44\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u5176\u4e2d\uff1a\u5b50\u516c\u53f8\u5438\u6536\u5c11\u6570\u80a1\u4e1c\u6295\u8d44\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u53d6\u5f97\u501f\u6b3e\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u53d1\u884c\u503a\u5238\u6536\u5230\u7684\u73b0\u91d1(\u4e07\u5143)", "\u6536\u5230\u5176\u4ed6\u4e0e\u7b79\u8d44\u6d3b\u52a8\u6709\u5173\u7684\u73b0\u91d1(\u4e07\u5143)", "\u7b79\u8d44\u6d3b\u52a8\u73b0\u91d1\u6d41\u5165\u5c0f\u8ba1(\u4e07\u5143)", "\u507f\u8fd8\u503a\u52a1\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u5206\u914d\u80a1\u5229\u3001\u5229\u6da6\u6216\u507f\u4ed8\u5229\u606f\u6240\u652f\u4ed8\u7684\u73b0\u91d1(\u4e07\u5143)", "\u5176\u4e2d\uff1a\u5b50\u516c\u53f8\u652f\u4ed8\u7ed9\u5c11\u6570\u80a1\u4e1c\u7684\u80a1\u5229\u3001\u5229\u6da6(\u4e07\u5143)", "\u652f\u4ed8\u5176\u4ed6\u4e0e\u7b79\u8d44\u6d3b\u52a8\u6709\u5173\u7684\u73b0\u91d1(\u4e07\u5143)", "\u7b79\u8d44\u6d3b\u52a8\u73b0\u91d1\u6d41\u51fa\u5c0f\u8ba1(\u4e07\u5143)", "\u7b79\u8d44\u6d3b\u52a8\u4ea7\u751f\u7684\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)", "\u6c47\u7387\u53d8\u52a8\u5bf9\u73b0\u91d1\u53ca\u73b0\u91d1\u7b49\u4ef7\u7269\u7684\u5f71\u54cd(\u4e07\u5143)", "\u73b0\u91d1\u53ca\u73b0\u91d1\u7b49\u4ef7\u7269\u51c0\u589e\u52a0\u989d(\u4e07\u5143)", "\u52a0:\u671f\u521d\u73b0\u91d1\u53ca\u73b0\u91d1\u7b49\u4ef7\u7269\u4f59\u989d(\u4e07\u5143)", "\u671f\u672b\u73b0\u91d1\u53ca\u73b0\u91d1\u7b49\u4ef7\u7269\u4f59\u989d(\u4e07\u5143)", "\u51c0\u5229\u6da6(\u4e07\u5143)", "\u5c11\u6570\u80a1\u4e1c\u635f\u76ca(\u4e07\u5143)", "\u672a\u786e\u8ba4\u7684\u6295\u8d44\u635f\u5931(\u4e07\u5143)", "\u8d44\u4ea7\u51cf\u503c\u51c6\u5907(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u6298\u65e7\u3001\u6cb9\u6c14\u8d44\u4ea7\u6298\u8017\u3001\u751f\u4ea7\u6027\u7269\u8d44\u6298\u65e7(\u4e07\u5143)", "\u65e0\u5f62\u8d44\u4ea7\u644a\u9500(\u4e07\u5143)", "\u957f\u671f\u5f85\u644a\u8d39\u7528\u644a\u9500(\u4e07\u5143)", "\u5f85\u644a\u8d39\u7528\u7684\u51cf\u5c11(\u4e07\u5143)", "\u9884\u63d0\u8d39\u7528\u7684\u589e\u52a0(\u4e07\u5143)", "\u5904\u7f6e\u56fa\u5b9a\u8d44\u4ea7\u3001\u65e0\u5f62\u8d44\u4ea7\u548c\u5176\u4ed6\u957f\u671f\u8d44\u4ea7\u7684\u635f\u5931(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u62a5\u5e9f\u635f\u5931(\u4e07\u5143)", "\u516c\u5141\u4ef7\u503c\u53d8\u52a8\u635f\u5931(\u4e07\u5143)", "\u9012\u5ef6\u6536\u76ca\u589e\u52a0(\u51cf\uff1a\u51cf\u5c11)(\u5143)", "\u9884\u8ba1\u8d1f\u503a(\u4e07\u5143)", "\u8d22\u52a1\u8d39\u7528(\u4e07\u5143)", "\u6295\u8d44\u635f\u5931(\u4e07\u5143)", "\u9012\u5ef6\u6240\u5f97\u7a0e\u8d44\u4ea7\u51cf\u5c11(\u4e07\u5143)", "\u9012\u5ef6\u6240\u5f97\u7a0e\u8d1f\u503a\u589e\u52a0(\u4e07\u5143)", "\u5b58\u8d27\u7684\u51cf\u5c11(\u4e07\u5143)", "\u7ecf\u8425\u6027\u5e94\u6536\u9879\u76ee\u7684\u51cf\u5c11(\u4e07\u5143)", "\u7ecf\u8425\u6027\u5e94\u4ed8\u9879\u76ee\u7684\u589e\u52a0(\u4e07\u5143)", "\u5df2\u5b8c\u5de5\u5c1a\u672a\u7ed3\u7b97\u6b3e\u7684\u51cf\u5c11(\u51cf:\u589e\u52a0)(\u5143)", "\u5df2\u7ed3\u7b97\u5c1a\u672a\u5b8c\u5de5\u6b3e\u7684\u589e\u52a0(\u51cf:\u51cf\u5c11)(\u5143)", "\u5176\u4ed6(\u4e07\u5143)", "\u7ecf\u8425\u6d3b\u52a8\u4ea7\u751f\u73b0\u91d1\u6d41\u91cf\u51c0\u989d(\u4e07\u5143)", "\u503a\u52a1\u8f6c\u4e3a\u8d44\u672c(\u4e07\u5143)", "\u4e00\u5e74\u5185\u5230\u671f\u7684\u53ef\u8f6c\u6362\u516c\u53f8\u503a\u5238(\u4e07\u5143)", "\u878d\u8d44\u79df\u5165\u56fa\u5b9a\u8d44\u4ea7(\u4e07\u5143)", "\u73b0\u91d1\u7684\u671f\u672b\u4f59\u989d(\u4e07\u5143)", "\u73b0\u91d1\u7684\u671f\u521d\u4f59\u989d(\u4e07\u5143)", "\u73b0\u91d1\u7b49\u4ef7\u7269\u7684\u671f\u672b\u4f59\u989d(\u4e07\u5143)", "\u73b0\u91d1\u7b49\u4ef7\u7269\u7684\u671f\u521d\u4f59\u989d(\u4e07\u5143)", "\u73b0\u91d1\u53ca\u73b0\u91d1\u7b49\u4ef7\u7269\u7684\u51c0\u589e\u52a0\u989d(\u4e07\u5143)" ];
      Profit = [ "\u8d44\u6599", "\u62a5\u544a\u65e5\u671f", "\u8425\u4e1a\u603b\u6536\u5165(\u4e07\u5143)", "\u8425\u4e1a\u6536\u5165(\u4e07\u5143)", "\u5229\u606f\u6536\u5165(\u4e07\u5143)", "\u5df2\u8d5a\u4fdd\u8d39(\u4e07\u5143)", "\u624b\u7eed\u8d39\u53ca\u4f63\u91d1\u6536\u5165(\u4e07\u5143)", "\u623f\u5730\u4ea7\u9500\u552e\u6536\u5165(\u4e07\u5143)", "\u5176\u4ed6\u4e1a\u52a1\u6536\u5165(\u4e07\u5143)", "\u8425\u4e1a\u603b\u6210\u672c(\u4e07\u5143)", "\u8425\u4e1a\u6210\u672c(\u4e07\u5143)", "\u5229\u606f\u652f\u51fa(\u4e07\u5143)", "\u624b\u7eed\u8d39\u53ca\u4f63\u91d1\u652f\u51fa(\u4e07\u5143)", "\u623f\u5730\u4ea7\u9500\u552e\u6210\u672c(\u4e07\u5143)", "\u7814\u53d1\u8d39\u7528(\u4e07\u5143)", "\u9000\u4fdd\u91d1(\u4e07\u5143)", "\u8d54\u4ed8\u652f\u51fa\u51c0\u989d(\u4e07\u5143)", "\u63d0\u53d6\u4fdd\u9669\u5408\u540c\u51c6\u5907\u91d1\u51c0\u989d(\u4e07\u5143)", "\u4fdd\u5355\u7ea2\u5229\u652f\u51fa(\u4e07\u5143)", "\u5206\u4fdd\u8d39\u7528(\u4e07\u5143)", "\u5176\u4ed6\u4e1a\u52a1\u6210\u672c(\u4e07\u5143)", "\u8425\u4e1a\u7a0e\u91d1\u53ca\u9644\u52a0(\u4e07\u5143)", "\u9500\u552e\u8d39\u7528(\u4e07\u5143)", "\u7ba1\u7406\u8d39\u7528(\u4e07\u5143)", "\u8d22\u52a1\u8d39\u7528(\u4e07\u5143)", "\u8d44\u4ea7\u51cf\u503c\u635f\u5931(\u4e07\u5143)", "\u516c\u5141\u4ef7\u503c\u53d8\u52a8\u6536\u76ca(\u4e07\u5143)", "\u6295\u8d44\u6536\u76ca(\u4e07\u5143)", "\u5bf9\u8054\u8425\u4f01\u4e1a\u548c\u5408\u8425\u4f01\u4e1a\u7684\u6295\u8d44\u6536\u76ca(\u4e07\u5143)", "\u6c47\u5151\u6536\u76ca(\u4e07\u5143)", "\u671f\u8d27\u635f\u76ca(\u4e07\u5143)", "\u6258\u7ba1\u6536\u76ca(\u4e07\u5143)", "\u8865\u8d34\u6536\u5165(\u4e07\u5143)", "\u5176\u4ed6\u4e1a\u52a1\u5229\u6da6(\u4e07\u5143)", "\u8425\u4e1a\u5229\u6da6(\u4e07\u5143)", "\u8425\u4e1a\u5916\u6536\u5165(\u4e07\u5143)", "\u8425\u4e1a\u5916\u652f\u51fa(\u4e07\u5143)", "\u975e\u6d41\u52a8\u8d44\u4ea7\u5904\u7f6e\u635f\u5931(\u4e07\u5143)", "\u5229\u6da6\u603b\u989d(\u4e07\u5143)", "\u6240\u5f97\u7a0e\u8d39\u7528(\u4e07\u5143)", "\u672a\u786e\u8ba4\u6295\u8d44\u635f\u5931(\u4e07\u5143)", "\u51c0\u5229\u6da6(\u4e07\u5143)", "\u5f52\u5c5e\u4e8e\u6bcd\u516c\u53f8\u6240\u6709\u8005\u7684\u51c0\u5229\u6da6(\u4e07\u5143)", "\u88ab\u5408\u5e76\u65b9\u5728\u5408\u5e76\u524d\u5b9e\u73b0\u51c0\u5229\u6da6(\u4e07\u5143)", "\u5c11\u6570\u80a1\u4e1c\u635f\u76ca(\u4e07\u5143)", "\u57fa\u672c\u6bcf\u80a1\u6536\u76ca", "\u7a00\u91ca\u6bcf\u80a1\u6536\u76ca" ];
      Balance = [ "\u8d44\u6599", "\u62a5\u544a\u65e5\u671f", "\u8d27\u5e01\u8d44\u91d1(\u4e07\u5143)", "\u7ed3\u7b97\u5907\u4ed8\u91d1(\u4e07\u5143)", "\u62c6\u51fa\u8d44\u91d1(\u4e07\u5143)", "\u4ea4\u6613\u6027\u91d1\u878d\u8d44\u4ea7(\u4e07\u5143)", "\u884d\u751f\u91d1\u878d\u8d44\u4ea7(\u4e07\u5143)", "\u5e94\u6536\u7968\u636e(\u4e07\u5143)", "\u5e94\u6536\u8d26\u6b3e(\u4e07\u5143)", "\u9884\u4ed8\u6b3e\u9879(\u4e07\u5143)", "\u5e94\u6536\u4fdd\u8d39(\u4e07\u5143)", "\u5e94\u6536\u5206\u4fdd\u8d26\u6b3e(\u4e07\u5143)", "\u5e94\u6536\u5206\u4fdd\u5408\u540c\u51c6\u5907\u91d1(\u4e07\u5143)", "\u5e94\u6536\u5229\u606f(\u4e07\u5143)", "\u5e94\u6536\u80a1\u5229(\u4e07\u5143)", "\u5176\u4ed6\u5e94\u6536\u6b3e(\u4e07\u5143)", "\u5e94\u6536\u51fa\u53e3\u9000\u7a0e(\u4e07\u5143)", "\u5e94\u6536\u8865\u8d34\u6b3e(\u4e07\u5143)", "\u5e94\u6536\u4fdd\u8bc1\u91d1(\u4e07\u5143)", "\u5185\u90e8\u5e94\u6536\u6b3e(\u4e07\u5143)", "\u4e70\u5165\u8fd4\u552e\u91d1\u878d\u8d44\u4ea7(\u4e07\u5143)", "\u5b58\u8d27(\u4e07\u5143)", "\u5f85\u644a\u8d39\u7528(\u4e07\u5143)", "\u5f85\u5904\u7406\u6d41\u52a8\u8d44\u4ea7\u635f\u76ca(\u4e07\u5143)", "\u4e00\u5e74\u5185\u5230\u671f\u7684\u975e\u6d41\u52a8\u8d44\u4ea7(\u4e07\u5143)", "\u5176\u4ed6\u6d41\u52a8\u8d44\u4ea7(\u4e07\u5143)", "\u6d41\u52a8\u8d44\u4ea7\u5408\u8ba1(\u4e07\u5143)", "\u53d1\u653e\u8d37\u6b3e\u53ca\u57ab\u6b3e(\u4e07\u5143)", "\u53ef\u4f9b\u51fa\u552e\u91d1\u878d\u8d44\u4ea7(\u4e07\u5143)", "\u6301\u6709\u81f3\u5230\u671f\u6295\u8d44(\u4e07\u5143)", "\u957f\u671f\u5e94\u6536\u6b3e(\u4e07\u5143)", "\u957f\u671f\u80a1\u6743\u6295\u8d44(\u4e07\u5143)", "\u5176\u4ed6\u957f\u671f\u6295\u8d44(\u4e07\u5143)", "\u6295\u8d44\u6027\u623f\u5730\u4ea7(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u539f\u503c(\u4e07\u5143)", "\u7d2f\u8ba1\u6298\u65e7(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u51c0\u503c(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u51cf\u503c\u51c6\u5907(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7(\u4e07\u5143)", "\u5728\u5efa\u5de5\u7a0b(\u4e07\u5143)", "\u5de5\u7a0b\u7269\u8d44(\u4e07\u5143)", "\u56fa\u5b9a\u8d44\u4ea7\u6e05\u7406(\u4e07\u5143)", "\u751f\u4ea7\u6027\u751f\u7269\u8d44\u4ea7(\u4e07\u5143)", "\u516c\u76ca\u6027\u751f\u7269\u8d44\u4ea7(\u4e07\u5143)", "\u6cb9\u6c14\u8d44\u4ea7(\u4e07\u5143)", "\u65e0\u5f62\u8d44\u4ea7(\u4e07\u5143)", "\u5f00\u53d1\u652f\u51fa(\u4e07\u5143)", "\u5546\u8a89(\u4e07\u5143)", "\u957f\u671f\u5f85\u644a\u8d39\u7528(\u4e07\u5143)", "\u80a1\u6743\u5206\u7f6e\u6d41\u901a\u6743(\u4e07\u5143)", "\u9012\u5ef6\u6240\u5f97\u7a0e\u8d44\u4ea7(\u4e07\u5143)", "\u5176\u4ed6\u975e\u6d41\u52a8\u8d44\u4ea7(\u4e07\u5143)", "\u975e\u6d41\u52a8\u8d44\u4ea7\u5408\u8ba1(\u4e07\u5143)", "\u8d44\u4ea7\u603b\u8ba1(\u4e07\u5143)", "\u77ed\u671f\u501f\u6b3e(\u4e07\u5143)", "\u5411\u4e2d\u592e\u94f6\u884c\u501f\u6b3e(\u4e07\u5143)", "\u5438\u6536\u5b58\u6b3e\u53ca\u540c\u4e1a\u5b58\u653e(\u4e07\u5143)", "\u62c6\u5165\u8d44\u91d1(\u4e07\u5143)", "\u4ea4\u6613\u6027\u91d1\u878d\u8d1f\u503a(\u4e07\u5143)", "\u884d\u751f\u91d1\u878d\u8d1f\u503a(\u4e07\u5143)", "\u5e94\u4ed8\u7968\u636e(\u4e07\u5143)", "\u5e94\u4ed8\u8d26\u6b3e(\u4e07\u5143)", "\u9884\u6536\u8d26\u6b3e(\u4e07\u5143)", "\u5356\u51fa\u56de\u8d2d\u91d1\u878d\u8d44\u4ea7\u6b3e(\u4e07\u5143)", "\u5e94\u4ed8\u624b\u7eed\u8d39\u53ca\u4f63\u91d1(\u4e07\u5143)", "\u5e94\u4ed8\u804c\u5de5\u85aa\u916c(\u4e07\u5143)", "\u5e94\u4ea4\u7a0e\u8d39(\u4e07\u5143)", "\u5e94\u4ed8\u5229\u606f(\u4e07\u5143)", "\u5e94\u4ed8\u80a1\u5229(\u4e07\u5143)", "\u5176\u4ed6\u5e94\u4ea4\u6b3e(\u4e07\u5143)", "\u5e94\u4ed8\u4fdd\u8bc1\u91d1(\u4e07\u5143)", "\u5185\u90e8\u5e94\u4ed8\u6b3e(\u4e07\u5143)", "\u5176\u4ed6\u5e94\u4ed8\u6b3e(\u4e07\u5143)", "\u9884\u63d0\u8d39\u7528(\u4e07\u5143)", "\u9884\u8ba1\u6d41\u52a8\u8d1f\u503a(\u4e07\u5143)", "\u5e94\u4ed8\u5206\u4fdd\u8d26\u6b3e(\u4e07\u5143)", "\u4fdd\u9669\u5408\u540c\u51c6\u5907\u91d1(\u4e07\u5143)", "\u4ee3\u7406\u4e70\u5356\u8bc1\u5238\u6b3e(\u4e07\u5143)", "\u4ee3\u7406\u627f\u9500\u8bc1\u5238\u6b3e(\u4e07\u5143)", "\u56fd\u9645\u7968\u8bc1\u7ed3\u7b97(\u4e07\u5143)", "\u56fd\u5185\u7968\u8bc1\u7ed3\u7b97(\u4e07\u5143)", "\u9012\u5ef6\u6536\u76ca(\u4e07\u5143)", "\u5e94\u4ed8\u77ed\u671f\u503a\u5238(\u4e07\u5143)", "\u4e00\u5e74\u5185\u5230\u671f\u7684\u975e\u6d41\u52a8\u8d1f\u503a(\u4e07\u5143)", "\u5176\u4ed6\u6d41\u52a8\u8d1f\u503a(\u4e07\u5143)", "\u6d41\u52a8\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)", "\u957f\u671f\u501f\u6b3e(\u4e07\u5143)", "\u5e94\u4ed8\u503a\u5238(\u4e07\u5143)", "\u957f\u671f\u5e94\u4ed8\u6b3e(\u4e07\u5143)", "\u4e13\u9879\u5e94\u4ed8\u6b3e(\u4e07\u5143)", "\u9884\u8ba1\u975e\u6d41\u52a8\u8d1f\u503a(\u4e07\u5143)", "\u957f\u671f\u9012\u5ef6\u6536\u76ca(\u4e07\u5143)", "\u9012\u5ef6\u6240\u5f97\u7a0e\u8d1f\u503a(\u4e07\u5143)", "\u5176\u4ed6\u975e\u6d41\u52a8\u8d1f\u503a(\u4e07\u5143)", "\u975e\u6d41\u52a8\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)", "\u8d1f\u503a\u5408\u8ba1(\u4e07\u5143)", "\u5b9e\u6536\u8d44\u672c(\u6216\u80a1\u672c)(\u4e07\u5143)", "\u8d44\u672c\u516c\u79ef(\u4e07\u5143)", "\u51cf:\u5e93\u5b58\u80a1(\u4e07\u5143)", "\u4e13\u9879\u50a8\u5907(\u4e07\u5143)", "\u76c8\u4f59\u516c\u79ef(\u4e07\u5143)", "\u4e00\u822c\u98ce\u9669\u51c6\u5907(\u4e07\u5143)", "\u672a\u786e\u5b9a\u7684\u6295\u8d44\u635f\u5931(\u4e07\u5143)", "\u672a\u5206\u914d\u5229\u6da6(\u4e07\u5143)", "\u62df\u5206\u914d\u73b0\u91d1\u80a1\u5229(\u4e07\u5143)", "\u5916\u5e01\u62a5\u8868\u6298\u7b97\u5dee\u989d(\u4e07\u5143)", "\u5f52\u5c5e\u4e8e\u6bcd\u516c\u53f8\u80a1\u4e1c\u6743\u76ca\u5408\u8ba1(\u4e07\u5143)", "\u5c11\u6570\u80a1\u4e1c\u6743\u76ca(\u4e07\u5143)", "\u6240\u6709\u8005\u6743\u76ca(\u6216\u80a1\u4e1c\u6743\u76ca)\u5408\u8ba1(\u4e07\u5143)", "\u8d1f\u503a\u548c\u6240\u6709\u8005\u6743\u76ca(\u6216\u80a1\u4e1c\u6743\u76ca)\u603b\u8ba1(\u4e07\u5143)" ];
      title = {
        getBalanceTitle: function() {
          return Balance;
        },
        getProfitTitle: function() {
          return Profit;
        },
        getCashFlowTitle: function() {
          return CashFlow;
        }
      };
      module.exports = title;
    }).call(this);
    cc._RF.pop();
  }, {} ],
  use_reversed_rotateBy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0634cP/Ke9KtpSuXtsZ/WcT", "use_reversed_rotateBy");
    "use strict";
    cc.RotateBy._reverse = true;
    cc._RF.pop();
  }, {} ],
  "use_v2.1-2.2.1_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "31ef8PR875C8rMcwBK19nrk", "use_v2.1-2.2.1_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_isChecked = true);
    cc._RF.pop();
  }, {} ],
  utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a841A/Op9I4KAULXgKxxGg", "utils");
    (function() {
      var utils;
      utils = {
        addFengGeFu: function(key, maxLength, char) {
          var needLength;
          null == char && (char = "\u4e00");
          needLength = maxLength - key.length;
          while (needLength > 0) {
            key += char;
            needLength--;
          }
          return key;
        },
        getPercent: function(num, totalNum) {
          var percent;
          percent = (num / totalNum * 100).toFixed(2);
          return percent;
        },
        getRandomInt: function(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        },
        getRatioTable: function(leftInfo, rightInfo, param) {
          var i, index, left, len, ratio, ratioTable;
          null == param && (param = 100);
          ratioTable = [];
          for (index = i = 0, len = leftInfo.length; i < len; index = ++i) {
            left = leftInfo[index];
            ratio = (left / rightInfo[index] * param).toFixed(2);
            ratioTable.push(ratio);
          }
          return ratioTable;
        },
        getDisTable: function(leftInfo, rightInfo) {
          var disNum, disTable, i, index, left, len;
          disTable = [];
          for (index = i = 0, len = leftInfo.length; i < len; index = ++i) {
            left = leftInfo[index];
            disNum = left - rightInfo[index];
            disTable.push(disNum);
          }
          return disTable;
        },
        getDisRatioTable: function(leftInfo, rightInfo, param) {
          var i, index, left, len, ratio, ratioTable;
          null == param && (param = 100);
          ratioTable = [];
          for (index = i = 0, len = leftInfo.length; i < len; index = ++i) {
            left = leftInfo[index];
            ratio = ((left - rightInfo[index]) / rightInfo[index] * param).toFixed(2);
            isNaN(ratio) && (ratio = -1);
            ratioTable.push(ratio + "%   ");
          }
          return ratioTable;
        },
        addTable: function(leftTable, rightTable) {
          var i, index, item, len, sumTable;
          sumTable = [];
          for (index = i = 0, len = leftTable.length; i < len; index = ++i) {
            item = leftTable[index];
            sumTable.push(item + rightTable[index]);
          }
          return sumTable;
        },
        getAddRatioTable: function(dataTable) {
          var addRatio, data, i, index, len;
          addRatio = [];
          for (index = i = 0, len = dataTable.length; i < len; index = ++i) {
            data = dataTable[index];
            if (index >= dataTable.length - 1) break;
            addRatio.push(((data - dataTable[index + 1]) / dataTable[index + 1] * 100).toFixed(2));
          }
          return addRatio;
        },
        getCompoundRate: function(addRate, time) {
          return Math.exp(1 / time * Math.log(addRate));
        },
        getAverage: function(table) {
          var ave, i, len, total, value;
          total = 0;
          for (i = 0, len = table.length; i < len; i++) {
            value = table[i];
            total += parseFloat(value);
          }
          ave = (total / table.length).toFixed(2);
          return ave;
        },
        addTabInTable: function(table) {
          var i, len, newTable, value;
          newTable = [];
          for (i = 0, len = table.length; i < len; i++) {
            value = table[i];
            isNaN(value) ? newTable.push("--") : newTable.push("   [" + value + "]");
          }
          return newTable;
        },
        addTab: function(value) {
          return value + "\t\t";
        },
        getSummation: function(table) {
          var i, len, num, summation;
          summation = 0;
          for (i = 0, len = table.length; i < len; i++) {
            num = table[i];
            summation += num;
          }
          return summation;
        },
        csvToArray: function(strData, strDelimiter) {
          var arrData, arrMatches, objPattern, strMatchedDelimiter, strMatchedValue;
          strDelimiter = strDelimiter || ",";
          objPattern = new RegExp("(\\" + strDelimiter + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + strDelimiter + "\\r\\n]*))", "gi");
          arrData = [ [] ];
          arrMatches = null;
          while (arrMatches = objPattern.exec(strData)) {
            strMatchedDelimiter = arrMatches[1];
            strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter && arrData.push([]);
            strMatchedValue = arrMatches[2] ? arrMatches[2].replace(new RegExp('""', "g"), '"') : arrMatches[3];
            arrData[arrData.length - 1].push(strMatchedValue);
          }
          return arrData;
        },
        getStockTable: function(dir) {
          var stockTable, stockTableAllA, stockTableHs800, stockTableZz1000, stockTableZz500;
          stockTableHs800 = [ "SZ000001", "SZ000002", "SZ000008", "SZ000060", "SZ000063", "SZ000069", "SZ000100", "SZ000157", "SZ000166", "SZ000333", "SZ000338", "SZ000402", "SZ000413", "SZ000415", "SZ000423", "SZ000425", "SZ000503", "SZ000538", "SZ000540", "SZ000559", "SZ000568", "SZ000623", "SZ000625", "SZ000627", "SZ000630", "SZ000651", "SZ000671", "SZ000686", "SZ000709", "SZ000723", "SZ000725", "SZ000728", "SZ000738", "SZ000750", "SZ000768", "SZ000776", "SZ000783", "SZ000792", "SZ000826", "SZ000839", "SZ000858", "SZ000876", "SZ000895", "SZ000898", "SZ000938", "SZ000959", "SZ000961", "SZ000963", "SZ000983", "SZ001979", "SZ002007", "SZ002008", "SZ002024", "SZ002027", "SZ002044", "SZ002065", "SZ002074", "SZ002081", "SZ002142", "SZ002146", "SZ002153", "SZ002174", "SZ002202", "SZ002230", "SZ002236", "SZ002241", "SZ002252", "SZ002292", "SZ002294", "SZ002304", "SZ002310", "SZ002352", "SZ002385", "SZ002411", "SZ002415", "SZ002424", "SZ002426", "SZ002450", "SZ002456", "SZ002460", "SZ002465", "SZ002466", "SZ002468", "SZ002470", "SZ002475", "SZ002500", "SZ002508", "SZ002555", "SZ002558", "SZ002572", "SZ002594", "SZ002601", "SZ002602", "SZ002608", "SZ002624", "SZ002673", "SZ002714", "SZ002736", "SZ002739", "SZ002797", "SZ002831", "SZ002839", "SZ002841", "SZ300003", "SZ300015", "SZ300017", "SZ300024", "SZ300027", "SZ300033", "SZ300059", "SZ300070", "SZ300072", "SZ300122", "SZ300124", "SZ300136", "SZ300144", "SZ300251", "SZ300315", "SH600000", "SH600008", "SH600009", "SH600010", "SH600011", "SH600015", "SH600016", "SH600018", "SH600019", "SH600021", "SH600023", "SH600028", "SH600029", "SH600030", "SH600031", "SH600036", "SH600038", "SH600048", "SH600050", "SH600061", "SH600066", "SH600068", "SH600074", "SH600085", "SH600089", "SH600100", "SH600104", "SH600109", "SH600111", "SH600115", "SH600118", "SH600153", "SH600157", "SH600170", "SH600177", "SH600188", "SH600196", "SH600208", "SH600219", "SH600221", "SH600233", "SH600271", "SH600276", "SH600297", "SH600309", "SH600332", "SH600340", "SH600352", "SH600362", "SH600369", "SH600372", "SH600373", "SH600376", "SH600383", "SH600390", "SH600406", "SH600415", "SH600436", "SH600482", "SH600485", "SH600489", "SH600498", "SH600518", "SH600519", "SH600522", "SH600535", "SH600547", "SH600549", "SH600570", "SH600583", "SH600585", "SH600588", "SH600606", "SH600637", "SH600649", "SH600660", "SH600663", "SH600674", "SH600682", "SH600685", "SH600688", "SH600690", "SH600703", "SH600704", "SH600705", "SH600739", "SH600741", "SH600795", "SH600804", "SH600816", "SH600820", "SH600827", "SH600837", "SH600871", "SH600886", "SH600887", "SH600893", "SH600895", "SH600900", "SH600909", "SH600919", "SH600926", "SH600958", "SH600959", "SH600977", "SH600999", "SH601006", "SH601009", "SH601012", "SH601018", "SH601021", "SH601088", "SH601099", "SH601111", "SH601117", "SH601118", "SH601155", "SH601163", "SH601166", "SH601169", "SH601186", "SH601198", "SH601211", "SH601212", "SH601216", "SH601225", "SH601228", "SH601229", "SH601288", "SH601318", "SH601328", "SH601333", "SH601336", "SH601375", "SH601377", "SH601390", "SH601398", "SH601555", "SH601600", "SH601601", "SH601607", "SH601608", "SH601611", "SH601618", "SH601628", "SH601633", "SH601668", "SH601669", "SH601688", "SH601718", "SH601727", "SH601766", "SH601788", "SH601800", "SH601818", "SH601857", "SH601866", "SH601872", "SH601877", "SH601878", "SH601881", "SH601888", "SH601898", "SH601899", "SH601901", "SH601919", "SH601933", "SH601939", "SH601958", "SH601966", "SH601985", "SH601988", "SH601989", "SH601991", "SH601992", "SH601997", "SH601998", "SH603160", "SH603799", "SH603833", "SH603858", "SH603993", "SH600004", "SH600006", "SH600017", "SH600021", "SH600022", "SH600026", "SH600037", "SH600039", "SH600053", "SH600056", "SH600058", "SH600060", "SH600062", "SH600064", "SH600073", "SH600079", "SH600086", "SH600094", "SH600098", "SH600108", "SH600120", "SH600122", "SH600125", "SH600126", "SH600138", "SH600141", "SH600143", "SH600151", "SH600155", "SH600158", "SH600160", "SH600161", "SH600166", "SH600167", "SH600169", "SH600171", "SH600179", "SH600183", "SH600184", "SH600187", "SH600195", "SH600201", "SH600216", "SH600240", "SH600256", "SH600258", "SH600259", "SH600260", "SH600266", "SH600267", "SH600270", "SH600277", "SH600280", "SH600282", "SH600291", "SH600292", "SH600298", "SH600300", "SH600307", "SH600312", "SH600315", "SH600316", "SH600317", "SH600325", "SH600329", "SH600335", "SH600338", "SH600348", "SH600350", "SH600366", "SH600380", "SH600388", "SH600392", "SH600393", "SH600395", "SH600409", "SH600410", "SH600416", "SH600418", "SH600422", "SH600426", "SH600428", "SH600435", "SH600458", "SH600460", "SH600466", "SH600478", "SH600481", "SH600499", "SH600500", "SH600503", "SH600511", "SH600517", "SH600521", "SH600525", "SH600528", "SH600536", "SH600545", "SH600557", "SH600563", "SH600565", "SH600572", "SH600575", "SH600578", "SH600580", "SH600582", "SH600584", "SH600594", "SH600597", "SH600598", "SH600600", "SH600611", "SH600614", "SH600618", "SH600623", "SH600633", "SH600635", "SH600639", "SH600640", "SH600642", "SH600643", "SH600645", "SH600648", "SH600649", "SH600651", "SH600655", "SH600657", "SH600664", "SH600673", "SH600687", "SH600694", "SH600717", "SH600718", "SH600729", "SH600737", "SH600743", "SH600748", "SH600750", "SH600751", "SH600754", "SH600755", "SH600757", "SH600759", "SH600760", "SH600765", "SH600770", "SH600773", "SH600777", "SH600787", "SH600801", "SH600808", "SH600811", "SH600823", "SH600827", "SH600835", "SH600839", "SH600848", "SH600859", "SH600862", "SH600863", "SH600869", "SH600872", "SH600874", "SH600875", "SH600879", "SH600881", "SH600884", "SH600885", "SH600895", "SH600908", "SH600917", "SH600936", "SH600939", "SH600967", "SH600970", "SH600971", "SH600978", "SH600993", "SH600996", "SH601000", "SH601001", "SH601016", "SH601019", "SH601020", "SH601098", "SH601127", "SH601128", "SH601168", "SH601179", "SH601200", "SH601233", "SH601311", "SH601608", "SH601678", "SH601689", "SH601717", "SH601777", "SH601801", "SH601811", "SH601872", "SH601880", "SH601928", "SH601966", "SH601969", "SH603000", "SH603019", "SH603025", "SH603056", "SH603077", "SH603169", "SH603198", "SH603225", "SH603228", "SH603328", "SH603355", "SH603369", "SH603377", "SH603444", "SH603515", "SH603556", "SH603568", "SH603569", "SH603589", "SH603658", "SH603659", "SH603766", "SH603806", "SH603816", "SH603868", "SH603877", "SH603883", "SH603885", "SH603888", "SH603899", "SH603188", "SZ000006", "SZ000008", "SZ000009", "SZ000012", "SZ000021", "SZ000025", "SZ000027", "SZ000028", "SZ000031", "SZ000039", "SZ000049", "SZ000061", "SZ000062", "SZ000066", "SZ000078", "SZ000089", "SZ000090", "SZ000156", "SZ000158", "SZ000400", "SZ000401", "SZ000418", "SZ000426", "SZ000488", "SZ000501", "SZ000513", "SZ000519", "SZ000528", "SZ000536", "SZ000541", "SZ000543", "SZ000547", "SZ000552", "SZ000553", "SZ000563", "SZ000566", "SZ000572", "SZ000581", "SZ000587", "SZ000592", "SZ000596", "SZ000598", "SZ000600", "SZ000612", "SZ000636", "SZ000656", "SZ000661", "SZ000667", "SZ000681", "SZ000685", "SZ000686", "SZ000690", "SZ000703", "SZ000712", "SZ000718", "SZ000727", "SZ000729", "SZ000732", "SZ000738", "SZ000750", "SZ000758", "SZ000761", "SZ000762", "SZ000766", "SZ000778", "SZ000806", "SZ000807", "SZ000813", "SZ000825", "SZ000829", "SZ000830", "SZ000848", "SZ000860", "SZ000877", "SZ000878", "SZ000887", "SZ000926", "SZ000930", "SZ000937", "SZ000960", "SZ000969", "SZ000970", "SZ000975", "SZ000977", "SZ000979", "SZ000980", "SZ000987", "SZ000988", "SZ000990", "SZ000997", "SZ000999", "SZ001696", "SZ002002", "SZ002004", "SZ002011", "SZ002013", "SZ002019", "SZ002022", "SZ002028", "SZ002030", "SZ002038", "SZ002041", "SZ002048", "SZ002049", "SZ002051", "SZ002056", "SZ002064", "SZ002073", "SZ002078", "SZ002092", "SZ002093", "SZ002110", "SZ002118", "SZ002127", "SZ002128", "SZ002129", "SZ002131", "SZ002147", "SZ002152", "SZ002155", "SZ002174", "SZ002176", "SZ002179", "SZ002180", "SZ002183", "SZ002190", "SZ002191", "SZ002195", "SZ002212", "SZ002221", "SZ002223", "SZ002233", "SZ002242", "SZ002244", "SZ002249", "SZ002250", "SZ002251", "SZ002254", "SZ002261", "SZ002266", "SZ002268", "SZ002273", "SZ002276", "SZ002277", "SZ002280", "SZ002281", "SZ002285", "SZ002299", "SZ002302", "SZ002308", "SZ002317", "SZ002332", "SZ002340", "SZ002342", "SZ002344", "SZ002345", "SZ002353", "SZ002354", "SZ002358", "SZ002359", "SZ002366", "SZ002368", "SZ002371", "SZ002373", "SZ002375", "SZ002384", "SZ002390", "SZ002399", "SZ002400", "SZ002407", "SZ002408", "SZ002410", "SZ002414", "SZ002416", "SZ002424", "SZ002426", "SZ002428", "SZ002431", "SZ002434", "SZ002437", "SZ002439", "SZ002440", "SZ002444", "SZ002463", "SZ002465", "SZ002477", "SZ002479", "SZ002482", "SZ002489", "SZ002491", "SZ002503", "SZ002505", "SZ002506", "SZ002509", "SZ002512", "SZ002517", "SZ002544", "SZ002563", "SZ002573", "SZ002583", "SZ002588", "SZ002589", "SZ002600", "SZ002603", "SZ002635", "SZ002640", "SZ002642", "SZ002657", "SZ002663", "SZ002665", "SZ002670", "SZ002672", "SZ002681", "SZ002690", "SZ002699", "SZ002701", "SZ002707", "SZ002709", "SZ002745", "SZ002807", "SZ002815", "SZ002818", "SZ002831", "SZ002839", "SZ002841", "SZ002916", "SZ002920", "SZ300001", "SZ300002", "SZ300010", "SZ300026", "SZ300032", "SZ300039", "SZ300043", "SZ300055", "SZ300058", "SZ300088", "SZ300113", "SZ300115", "SZ300116", "SZ300133", "SZ300134", "SZ300146", "SZ300156", "SZ300159", "SZ300166", "SZ300182", "SZ300197", "SZ300199", "SZ300202", "SZ300244", "SZ300253", "SZ300257", "SZ300266", "SZ300273", "SZ300274", "SZ300287", "SZ300291", "SZ300297", "SZ300308", "SZ300315", "SZ300324", "SZ300376", "SZ300383", "SZ300418" ];
          stockTableZz1000 = [ "SZ000010", "SZ000011", "SZ000016", "SZ000018", "SZ000022", "SZ000029", "SZ000034", "SZ000035", "SZ000036", "SZ000038", "SZ000040", "SZ000042", "SZ000043", "SZ000048", "SZ000055", "SZ000058", "SZ000059", "SZ000065", "SZ000070", "SZ000088", "SZ000150", "SZ000151", "SZ000159", "SZ000404", "SZ000407", "SZ000409", "SZ000416", "SZ000429", "SZ000498", "SZ000506", "SZ000514", "SZ000516", "SZ000518", "SZ000520", "SZ000525", "SZ000532", "SZ000533", "SZ000537", "SZ000544", "SZ000545", "SZ000546", "SZ000548", "SZ000550", "SZ000551", "SZ000553", "SZ000554", "SZ000558", "SZ000560", "SZ000561", "SZ000571", "SZ000573", "SZ000576", "SZ000582", "SZ000584", "SZ000591", "SZ000601", "SZ000603", "SZ000607", "SZ000615", "SZ000626", "SZ000637", "SZ000639", "SZ000650", "SZ000657", "SZ000665", "SZ000666", "SZ000672", "SZ000673", "SZ000676", "SZ000683", "SZ000687", "SZ000688", "SZ000700", "SZ000701", "SZ000711", "SZ000717", "SZ000719", "SZ000722", "SZ000731", "SZ000733", "SZ000735", "SZ000739", "SZ000751", "SZ000752", "SZ000757", "SZ000760", "SZ000767", "SZ000782", "SZ000789", "SZ000795", "SZ000796", "SZ000797", "SZ000800", "SZ000801", "SZ000802", "SZ000811", "SZ000818", "SZ000819", "SZ000820", "SZ000821", "SZ000828", "SZ000831", "SZ000836", "SZ000837", "SZ000838", "SZ000851", "SZ000863", "SZ000869", "SZ000875", "SZ000881", "SZ000882", "SZ000885", "SZ000889", "SZ000892", "SZ000893", "SZ000899", "SZ000901", "SZ000902", "SZ000905", "SZ000910", "SZ000915", "SZ000917", "SZ000918", "SZ000920", "SZ000921", "SZ000925", "SZ000927", "SZ000928", "SZ000933", "SZ000936", "SZ000951", "SZ000952", "SZ000957", "SZ000958", "SZ000965", "SZ000967", "SZ000968", "SZ000971", "SZ000973", "SZ000976", "SZ000980", "SZ000989", "SZ000996", "SZ001896", "SZ002009", "SZ002016", "SZ002017", "SZ002023", "SZ002025", "SZ002031", "SZ002033", "SZ002035", "SZ002036", "SZ002042", "SZ002043", "SZ002047", "SZ002053", "SZ002055", "SZ002059", "SZ002060", "SZ002067", "SZ002071", "SZ002079", "SZ002080", "SZ002086", "SZ002089", "SZ002091", "SZ002094", "SZ002095", "SZ002097", "SZ002099", "SZ002100", "SZ002102", "SZ002104", "SZ002108", "SZ002110", "SZ002113", "SZ002114", "SZ002115", "SZ002117", "SZ002121", "SZ002124", "SZ002126", "SZ002130", "SZ002135", "SZ002137", "SZ002138", "SZ002139", "SZ002141", "SZ002145", "SZ002148", "SZ002151", "SZ002154", "SZ002156", "SZ002157", "SZ002166", "SZ002167", "SZ002171", "SZ002175", "SZ002177", "SZ002178", "SZ002182", "SZ002185", "SZ002192", "SZ002196", "SZ002197", "SZ002198", "SZ002203", "SZ002204", "SZ002206", "SZ002210", "SZ002212", "SZ002215", "SZ002218", "SZ002222", "SZ002224", "SZ002226", "SZ002229", "SZ002231", "SZ002232", "SZ002234", "SZ002235", "SZ002237", "SZ002239", "SZ002245", "SZ002246", "SZ002247", "SZ002253", "SZ002255", "SZ002256", "SZ002259", "SZ002260", "SZ002262", "SZ002263", "SZ002274", "SZ002279", "SZ002283", "SZ002284", "SZ002287", "SZ002288", "SZ002296", "SZ002298", "SZ002301", "SZ002302", "SZ002303", "SZ002305", "SZ002307", "SZ002313", "SZ002314", "SZ002318", "SZ002320", "SZ002321", "SZ002322", "SZ002323", "SZ002326", "SZ002329", "SZ002331", "SZ002335", "SZ002339", "SZ002341", "SZ002343", "SZ002346", "SZ002349", "SZ002351", "SZ002355", "SZ002362", "SZ002363", "SZ002364", "SZ002367", "SZ002372", "SZ002376", "SZ002378", "SZ002383", "SZ002387", "SZ002388", "SZ002389", "SZ002393", "SZ002401", "SZ002402", "SZ002406", "SZ002413", "SZ002418", "SZ002419", "SZ002421", "SZ002425", "SZ002427", "SZ002429", "SZ002430", "SZ002432", "SZ002433", "SZ002436", "SZ002443", "SZ002445", "SZ002446", "SZ002447", "SZ002448", "SZ002449", "SZ002451", "SZ002452", "SZ002453", "SZ002457", "SZ002458", "SZ002461", "SZ002462", "SZ002464", "SZ002467", "SZ002474", "SZ002476", "SZ002481", "SZ002483", "SZ002484", "SZ002488", "SZ002494", "SZ002496", "SZ002497", "SZ002499", "SZ002501", "SZ002502", "SZ002507", "SZ002509", "SZ002510", "SZ002511", "SZ002515", "SZ002516", "SZ002518", "SZ002519", "SZ002521", "SZ002522", "SZ002524", "SZ002531", "SZ002534", "SZ002535", "SZ002537", "SZ002538", "SZ002539", "SZ002542", "SZ002543", "SZ002545", "SZ002547", "SZ002550", "SZ002554", "SZ002556", "SZ002559", "SZ002562", "SZ002564", "SZ002567", "SZ002574", "SZ002575", "SZ002577", "SZ002579", "SZ002581", "SZ002582", "SZ002584", "SZ002585", "SZ002586", "SZ002590", "SZ002596", "SZ002597", "SZ002600", "SZ002604", "SZ002605", "SZ002606", "SZ002609", "SZ002610", "SZ002611", "SZ002614", "SZ002616", "SZ002617", "SZ002618", "SZ002619", "SZ002622", "SZ002625", "SZ002626", "SZ002630", "SZ002631", "SZ002636", "SZ002638", "SZ002643", "SZ002647", "SZ002648", "SZ002649", "SZ002650", "SZ002651", "SZ002655", "SZ002656", "SZ002658", "SZ002660", "SZ002662", "SZ002664", "SZ002667", "SZ002668", "SZ002675", "SZ002677", "SZ002678", "SZ002680", "SZ002684", "SZ002695", "SZ002697", "SZ002703", "SZ002711", "SZ002712", "SZ002716", "SZ002717", "SZ002721", "SZ002724", "SZ002726", "SZ002733", "SZ002737", "SZ002746", "SZ002747", "SZ002751", "SZ002752", "SZ002756", "SZ002759", "SZ002762", "SZ002766", "SZ002769", "SZ002772", "SZ002781", "SZ002782", "SZ002783", "SZ002786", "SZ002788", "SZ002790", "SZ002791", "SZ002792", "SZ002801", "SZ002802", "SZ002812", "SZ002821", "SZ002822", "SZ002850", "SZ002852", "SZ002859", "SZ002867", "SZ002872", "SZ300005", "SZ300006", "SZ300007", "SZ300008", "SZ300009", "SZ300011", "SZ300012", "SZ300014", "SZ300016", "SZ300020", "SZ300021", "SZ300028", "SZ300030", "SZ300031", "SZ300034", "SZ300036", "SZ300037", "SZ300038", "SZ300044", "SZ300045", "SZ300047", "SZ300048", "SZ300050", "SZ300051", "SZ300052", "SZ300053", "SZ300054", "SZ300056", "SZ300063", "SZ300064", "SZ300065", "SZ300066", "SZ300068", "SZ300071", "SZ300073", "SZ300074", "SZ300075", "SZ300076", "SZ300077", "SZ300078", "SZ300079", "SZ300083", "SZ300084", "SZ300085", "SZ300086", "SZ300090", "SZ300096", "SZ300097", "SZ300098", "SZ300100", "SZ300101", "SZ300102", "SZ300109", "SZ300110", "SZ300114", "SZ300118", "SZ300128", "SZ300130", "SZ300131", "SZ300135", "SZ300137", "SZ300140", "SZ300142", "SZ300145", "SZ300148", "SZ300149", "SZ300152", "SZ300157", "SZ300160", "SZ300165", "SZ300168", "SZ300170", "SZ300171", "SZ300172", "SZ300173", "SZ300175", "SZ300177", "SZ300178", "SZ300180", "SZ300183", "SZ300184", "SZ300185", "SZ300188", "SZ300191", "SZ300194", "SZ300198", "SZ300203", "SZ300205", "SZ300207", "SZ300208", "SZ300209", "SZ300212", "SZ300213", "SZ300215", "SZ300216", "SZ300219", "SZ300221", "SZ300222", "SZ300223", "SZ300224", "SZ300226", "SZ300227", "SZ300228", "SZ300229", "SZ300231", "SZ300232", "SZ300236", "SZ300237", "SZ300238", "SZ300242", "SZ300245", "SZ300248", "SZ300252", "SZ300255", "SZ300256", "SZ300262", "SZ300263", "SZ300269", "SZ300271", "SZ300276", "SZ300278", "SZ300284", "SZ300285", "SZ300288", "SZ300292", "SZ300294", "SZ300295", "SZ300299", "SZ300300", "SZ300302", "SZ300303", "SZ300304", "SZ300307", "SZ300308", "SZ300309", "SZ300310", "SZ300311", "SZ300312", "SZ300316", "SZ300317", "SZ300322", "SZ300323", "SZ300328", "SZ300332", "SZ300333", "SZ300336", "SZ300339", "SZ300343", "SZ300347", "SZ300348", "SZ300349", "SZ300350", "SZ300352", "SZ300353", "SZ300355", "SZ300356", "SZ300359", "SZ300362", "SZ300363", "SZ300364", "SZ300366", "SZ300367", "SZ300368", "SZ300369", "SZ300373", "SZ300377", "SZ300378", "SZ300379", "SZ300380", "SZ300381", "SZ300386", "SZ300388", "SZ300392", "SZ300403", "SZ300406", "SZ300409", "SZ300410", "SZ300413", "SZ300418", "SZ300419", "SZ300424", "SZ300426", "SZ300429", "SZ300431", "SZ300432", "SZ300438", "SZ300439", "SZ300440", "SZ300441", "SZ300443", "SZ300447", "SZ300449", "SZ300450", "SZ300456", "SZ300457", "SZ300458", "SZ300459", "SZ300463", "SZ300465", "SZ300467", "SZ300468", "SZ300471", "SZ300474", "SZ300476", "SZ300482", "SZ300484", "SZ300485", "SZ300494", "SZ300495", "SZ300496", "SZ300497", "SZ300502", "SZ300506", "SZ300507", "SZ300508", "SZ300511", "SZ300512", "SZ300516", "SZ300518", "SZ300520", "SZ300522", "SZ300523", "SZ300527", "SZ300528", "SZ300529", "SZ300531", "SZ300533", "SZ300558", "SZ300568", "SZ300601", "SZ300613", "SZ300616", "SZ300618", "SZ300625", "SZ300628", "SZ300633", "SZ300660", "SZ300679", "SH600007", "SH600012", "SH600020", "SH600033", "SH600035", "SH600054", "SH600057", "SH600063", "SH600067", "SH600072", "SH600075", "SH600076", "SH600082", "SH600084", "SH600090", "SH600093", "SH600096", "SH600101", "SH600103", "SH600105", "SH600106", "SH600107", "SH600110", "SH600113", "SH600114", "SH600116", "SH600119", "SH600123", "SH600129", "SH600130", "SH600132", "SH600133", "SH600135", "SH600136", "SH600162", "SH600165", "SH600172", "SH600173", "SH600175", "SH600185", "SH600190", "SH600192", "SH600193", "SH600197", "SH600206", "SH600207", "SH600209", "SH600210", "SH600217", "SH600226", "SH600227", "SH600230", "SH600231", "SH600237", "SH600239", "SH600246", "SH600252", "SH600255", "SH600258", "SH600261", "SH600269", "SH600273", "SH600278", "SH600279", "SH600283", "SH600285", "SH600288", "SH600290", "SH600303", "SH600310", "SH600313", "SH600318", "SH600320", "SH600321", "SH600322", "SH600323", "SH600326", "SH600330", "SH600331", "SH600336", "SH600337", "SH600343", "SH600354", "SH600359", "SH600360", "SH600363", "SH600381", "SH600382", "SH600386", "SH600391", "SH600399", "SH600400", "SH600405", "SH600420", "SH600446", "SH600449", "SH600456", "SH600459", "SH600467", "SH600470", "SH600477", "SH600480", "SH600486", "SH600490", "SH600491", "SH600495", "SH600501", "SH600502", "SH600507", "SH600508", "SH600512", "SH600523", "SH600526", "SH600531", "SH600533", "SH600546", "SH600548", "SH600550", "SH600552", "SH600559", "SH600562", "SH600567", "SH600568", "SH600569", "SH600571", "SH600577", "SH600590", "SH600592", "SH600595", "SH600602", "SH600604", "SH600612", "SH600616", "SH600620", "SH600621", "SH600622", "SH600624", "SH600626", "SH600629", "SH600630", "SH600634", "SH600638", "SH600641", "SH600650", "SH600652", "SH600658", "SH600662", "SH600667", "SH600668", "SH600675", "SH600676", "SH600677", "SH600681", "SH600684", "SH600686", "SH600692", "SH600693", "SH600702", "SH600707", "SH600708", "SH600711", "SH600728", "SH600730", "SH600734", "SH600735", "SH600740", "SH600742", "SH600744", "SH600745", "SH600756", "SH600758", "SH600763", "SH600764", "SH600771", "SH600775", "SH600777", "SH600779", "SH600782", "SH600783", "SH600784", "SH600789", "SH600797", "SH600798", "SH600800", "SH600803", "SH600807", "SH600812", "SH600814", "SH600818", "SH600824", "SH600828", "SH600830", "SH600836", "SH600838", "SH600843", "SH600845", "SH600846", "SH600855", "SH600856", "SH600865", "SH600868", "SH600876", "SH600963", "SH600965", "SH600973", "SH600986", "SH600987", "SH600988", "SH600990", "SH600995", "SH600997", "SH601003", "SH601007", "SH601011", "SH601015", "SH601038", "SH601058", "SH601069", "SH601101", "SH601107", "SH601116", "SH601126", "SH601137", "SH601222", "SH601339", "SH601366", "SH601388", "SH601500", "SH601566", "SH601588", "SH601595", "SH601599", "SH601636", "SH601666", "SH601700", "SH601789", "SH601799", "SH601858", "SH601882", "SH601890", "SH601900", "SH601918", "SH601952", "SH601968", "SH603003", "SH603008", "SH603010", "SH603026", "SH603043", "SH603058", "SH603063", "SH603081", "SH603098", "SH603108", "SH603111", "SH603113", "SH603116", "SH603118", "SH603126", "SH603128", "SH603166", "SH603218", "SH603227", "SH603233", "SH603258", "SH603298", "SH603299", "SH603303", "SH603305", "SH603308", "SH603313", "SH603323", "SH603337", "SH603338", "SH603339", "SH603358", "SH603368", "SH603385", "SH603393", "SH603398", "SH603421", "SH603508", "SH603517", "SH603555", "SH603579", "SH603588", "SH603600", "SH603603", "SH603609", "SH603612", "SH603618", "SH603626", "SH603636", "SH603660", "SH603669", "SH603678", "SH603686", "SH603707", "SH603708", "SH603718", "SH603727", "SH603730", "SH603758", "SH603777", "SH603779", "SH603800", "SH603803", "SH603817", "SH603839", "SH603843", "SH603861", "SH603881", "SH603885", "SH603898", "SH603900", "SH603919", "SH603920", "SH603939", "SH603958", "SH603959", "SH603979", "SH603980", "SH603989", "SH603996", "SH603997", "SH603999" ];
          stockTableZz500 = [ "SH600004", "SH600006", "SH600017", "SH600021", "SH600022", "SH600026", "SH600037", "SH600039", "SH600053", "SH600056", "SH600058", "SH600060", "SH600062", "SH600064", "SH600073", "SH600079", "SH600086", "SH600094", "SH600098", "SH600108", "SH600120", "SH600122", "SH600125", "SH600126", "SH600138", "SH600141", "SH600143", "SH600151", "SH600155", "SH600158", "SH600160", "SH600161", "SH600166", "SH600167", "SH600169", "SH600171", "SH600179", "SH600183", "SH600184", "SH600187", "SH600195", "SH600201", "SH600216", "SH600240", "SH600256", "SH600258", "SH600259", "SH600260", "SH600266", "SH600267", "SH600270", "SH600277", "SH600280", "SH600282", "SH600291", "SH600292", "SH600298", "SH600300", "SH600307", "SH600312", "SH600315", "SH600316", "SH600317", "SH600325", "SH600329", "SH600335", "SH600338", "SH600348", "SH600350", "SH600366", "SH600380", "SH600388", "SH600392", "SH600393", "SH600395", "SH600409", "SH600410", "SH600416", "SH600418", "SH600422", "SH600426", "SH600428", "SH600435", "SH600458", "SH600460", "SH600466", "SH600478", "SH600481", "SH600499", "SH600500", "SH600503", "SH600511", "SH600517", "SH600521", "SH600525", "SH600528", "SH600536", "SH600545", "SH600557", "SH600563", "SH600565", "SH600572", "SH600575", "SH600578", "SH600580", "SH600582", "SH600584", "SH600594", "SH600597", "SH600598", "SH600600", "SH600611", "SH600614", "SH600618", "SH600623", "SH600633", "SH600635", "SH600639", "SH600640", "SH600642", "SH600643", "SH600645", "SH600648", "SH600649", "SH600651", "SH600655", "SH600657", "SH600664", "SH600673", "SH600687", "SH600694", "SH600717", "SH600718", "SH600729", "SH600737", "SH600743", "SH600748", "SH600750", "SH600751", "SH600754", "SH600755", "SH600757", "SH600759", "SH600760", "SH600765", "SH600770", "SH600773", "SH600777", "SH600787", "SH600801", "SH600808", "SH600811", "SH600823", "SH600827", "SH600835", "SH600839", "SH600848", "SH600859", "SH600862", "SH600863", "SH600869", "SH600872", "SH600874", "SH600875", "SH600879", "SH600881", "SH600884", "SH600885", "SH600895", "SH600908", "SH600917", "SH600936", "SH600939", "SH600967", "SH600970", "SH600971", "SH600978", "SH600993", "SH600996", "SH601000", "SH601001", "SH601016", "SH601019", "SH601020", "SH601098", "SH601127", "SH601128", "SH601168", "SH601179", "SH601200", "SH601233", "SH601311", "SH601608", "SH601678", "SH601689", "SH601717", "SH601777", "SH601801", "SH601811", "SH601872", "SH601880", "SH601928", "SH601966", "SH601969", "SH603000", "SH603019", "SH603025", "SH603056", "SH603077", "SH603169", "SH603198", "SH603225", "SH603228", "SH603328", "SH603355", "SH603369", "SH603377", "SH603444", "SH603515", "SH603556", "SH603568", "SH603569", "SH603589", "SH603658", "SH603659", "SH603766", "SH603806", "SH603816", "SH603868", "SH603877", "SH603883", "SH603885", "SH603888", "SH603899", "SH603188", "SZ000006", "SZ000008", "SZ000009", "SZ000012", "SZ000021", "SZ000025", "SZ000027", "SZ000028", "SZ000031", "SZ000039", "SZ000049", "SZ000061", "SZ000062", "SZ000066", "SZ000078", "SZ000089", "SZ000090", "SZ000156", "SZ000158", "SZ000400", "SZ000401", "SZ000418", "SZ000426", "SZ000488", "SZ000501", "SZ000513", "SZ000519", "SZ000528", "SZ000536", "SZ000541", "SZ000543", "SZ000547", "SZ000552", "SZ000553", "SZ000563", "SZ000566", "SZ000572", "SZ000581", "SZ000587", "SZ000592", "SZ000596", "SZ000598", "SZ000600", "SZ000612", "SZ000636", "SZ000656", "SZ000661", "SZ000667", "SZ000681", "SZ000685", "SZ000686", "SZ000690", "SZ000703", "SZ000712", "SZ000718", "SZ000727", "SZ000729", "SZ000732", "SZ000738", "SZ000750", "SZ000758", "SZ000761", "SZ000762", "SZ000766", "SZ000778", "SZ000806", "SZ000807", "SZ000813", "SZ000825", "SZ000829", "SZ000830", "SZ000848", "SZ000860", "SZ000877", "SZ000878", "SZ000887", "SZ000926", "SZ000930", "SZ000937", "SZ000960", "SZ000969", "SZ000970", "SZ000975", "SZ000977", "SZ000979", "SZ000980", "SZ000987", "SZ000988", "SZ000990", "SZ000997", "SZ000999", "SZ001696", "SZ002002", "SZ002004", "SZ002011", "SZ002013", "SZ002019", "SZ002022", "SZ002028", "SZ002030", "SZ002038", "SZ002041", "SZ002048", "SZ002049", "SZ002051", "SZ002056", "SZ002064", "SZ002073", "SZ002078", "SZ002092", "SZ002093", "SZ002110", "SZ002118", "SZ002127", "SZ002128", "SZ002129", "SZ002131", "SZ002147", "SZ002152", "SZ002155", "SZ002174", "SZ002176", "SZ002179", "SZ002180", "SZ002183", "SZ002190", "SZ002191", "SZ002195", "SZ002212", "SZ002221", "SZ002223", "SZ002233", "SZ002242", "SZ002244", "SZ002249", "SZ002250", "SZ002251", "SZ002254", "SZ002261", "SZ002266", "SZ002268", "SZ002273", "SZ002276", "SZ002277", "SZ002280", "SZ002281", "SZ002285", "SZ002299", "SZ002302", "SZ002308", "SZ002317", "SZ002332", "SZ002340", "SZ002342", "SZ002344", "SZ002345", "SZ002353", "SZ002354", "SZ002358", "SZ002359", "SZ002366", "SZ002368", "SZ002371", "SZ002373", "SZ002375", "SZ002384", "SZ002390", "SZ002399", "SZ002400", "SZ002407", "SZ002408", "SZ002410", "SZ002414", "SZ002416", "SZ002424", "SZ002426", "SZ002428", "SZ002431", "SZ002434", "SZ002437", "SZ002439", "SZ002440", "SZ002444", "SZ002463", "SZ002465", "SZ002477", "SZ002479", "SZ002482", "SZ002489", "SZ002491", "SZ002503", "SZ002505", "SZ002506", "SZ002509", "SZ002512", "SZ002517", "SZ002544", "SZ002563", "SZ002573", "SZ002583", "SZ002588", "SZ002589", "SZ002600", "SZ002603", "SZ002635", "SZ002640", "SZ002642", "SZ002657", "SZ002663", "SZ002665", "SZ002670", "SZ002672", "SZ002681", "SZ002690", "SZ002699", "SZ002701", "SZ002707", "SZ002709", "SZ002745", "SZ002807", "SZ002815", "SZ002818", "SZ002831", "SZ002839", "SZ002841", "SZ002916", "SZ002920", "SZ300001", "SZ300002", "SZ300010", "SZ300026", "SZ300032", "SZ300039", "SZ300043", "SZ300055", "SZ300058", "SZ300088", "SZ300113", "SZ300115", "SZ300116", "SZ300133", "SZ300134", "SZ300146", "SZ300156", "SZ300159", "SZ300166", "SZ300182", "SZ300197", "SZ300199", "SZ300202", "SZ300244", "SZ300253", "SZ300257", "SZ300266", "SZ300273", "SZ300274", "SZ300287", "SZ300291", "SZ300297", "SZ300308", "SZ300315", "SZ300324", "SZ300376", "SZ300383", "SZ300418" ];
          stockTableAllA = [ "SH600000", "SH600004", "SH600006", "SH600007", "SH600008", "SH600009", "SH600010", "SH600011", "SH600012", "SH600015", "SH600016", "SH600017", "SH600018", "SH600019", "SH600020", "SH600021", "SH600022", "SH600023", "SH600025", "SH600026", "SH600027", "SH600028", "SH600029", "SH600030", "SH600031", "SH600033", "SH600035", "SH600036", "SH600037", "SH600038", "SH600039", "SH600048", "SH600050", "SH600051", "SH600052", "SH600053", "SH600054", "SH600055", "SH600056", "SH600057", "SH600058", "SH600059", "SH600060", "SH600061", "SH600062", "SH600063", "SH600064", "SH600066", "SH600067", "SH600068", "SH600070", "SH600071", "SH600072", "SH600073", "SH600075", "SH600076", "SH600077", "SH600078", "SH600079", "SH600080", "SH600081", "SH600082", "SH600085", "SH600086", "SH600088", "SH600089", "SH600090", "SH600093", "SH600094", "SH600095", "SH600096", "SH600097", "SH600098", "SH600099", "SH600100", "SH600101", "SH600103", "SH600104", "SH600105", "SH600106", "SH600107", "SH600108", "SH600109", "SH600110", "SH600111", "SH600113", "SH600114", "SH600115", "SH600116", "SH600117", "SH600118", "SH600120", "SH600121", "SH600123", "SH600125", "SH600126", "SH600127", "SH600128", "SH600129", "SH600130", "SH600131", "SH600132", "SH600133", "SH600135", "SH600136", "SH600137", "SH600138", "SH600139", "SH600141", "SH600143", "SH600146", "SH600148", "SH600150", "SH600151", "SH600152", "SH600153", "SH600155", "SH600156", "SH600157", "SH600158", "SH600159", "SH600160", "SH600161", "SH600162", "SH600163", "SH600165", "SH600166", "SH600167", "SH600168", "SH600169", "SH600170", "SH600171", "SH600172", "SH600173", "SH600176", "SH600177", "SH600178", "SH600180", "SH600182", "SH600183", "SH600184", "SH600185", "SH600186", "SH600187", "SH600188", "SH600189", "SH600190", "SH600191", "SH600192", "SH600195", "SH600196", "SH600197", "SH600198", "SH600199", "SH600200", "SH600201", "SH600202", "SH600203", "SH600206", "SH600207", "SH600208", "SH600210", "SH600211", "SH600213", "SH600216", "SH600217", "SH600218", "SH600219", "SH600220", "SH600221", "SH600222", "SH600223", "SH600226", "SH600227", "SH600229", "SH600230", "SH600231", "SH600232", "SH600233", "SH600235", "SH600236", "SH600237", "SH600239", "SH600242", "SH600246", "SH600248", "SH600249", "SH600250", "SH600251", "SH600252", "SH600256", "SH600257", "SH600258", "SH600259", "SH600260", "SH600261", "SH600262", "SH600266", "SH600267", "SH600268", "SH600269", "SH600271", "SH600272", "SH600273", "SH600276", "SH600277", "SH600278", "SH600279", "SH600281", "SH600282", "SH600283", "SH600284", "SH600285", "SH600287", "SH600288", "SH600291", "SH600292", "SH600293", "SH600295", "SH600297", "SH600298", "SH600299", "SH600300", "SH600302", "SH600303", "SH600305", "SH600307", "SH600308", "SH600309", "SH600310", "SH600312", "SH600313", "SH600315", "SH600316", "SH600317", "SH600318", "SH600320", "SH600321", "SH600322", "SH600323", "SH600325", "SH600326", "SH600327", "SH600328", "SH600329", "SH600330", "SH600331", "SH600332", "SH600333", "SH600335", "SH600336", "SH600337", "SH600338", "SH600339", "SH600340", "SH600343", "SH600345", "SH600346", "SH600348", "SH600350", "SH600351", "SH600352", "SH600353", "SH600355", "SH600356", "SH600359", "SH600360", "SH600361", "SH600362", "SH600363", "SH600365", "SH600366", "SH600367", "SH600368", "SH600369", "SH600370", "SH600371", "SH600372", "SH600373", "SH600375", "SH600376", "SH600377", "SH600378", "SH600379", "SH600380", "SH600381", "SH600382", "SH600383", "SH600386", "SH600387", "SH600388", "SH600389", "SH600390", "SH600391", "SH600392", "SH600393", "SH600395", "SH600396", "SH600397", "SH600398", "SH600400", "SH600403", "SH600405", "SH600406", "SH600409", "SH600410", "SH600415", "SH600418", "SH600419", "SH600420", "SH600422", "SH600425", "SH600426", "SH600428", "SH600429", "SH600433", "SH600435", "SH600436", "SH600438", "SH600439", "SH600444", "SH600446", "SH600448", "SH600449", "SH600452", "SH600455", "SH600456", "SH600458", "SH600459", "SH600460", "SH600461", "SH600463", "SH600466", "SH600467", "SH600468", "SH600469", "SH600475", "SH600476", "SH600477", "SH600478", "SH600479", "SH600480", "SH600481", "SH600482", "SH600483", "SH600486", "SH600487", "SH600488", "SH600489", "SH600490", "SH600491", "SH600493", "SH600495", "SH600496", "SH600497", "SH600498", "SH600499", "SH600500", "SH600501", "SH600502", "SH600503", "SH600505", "SH600506", "SH600507", "SH600508", "SH600509", "SH600510", "SH600511", "SH600512", "SH600513", "SH600515", "SH600516", "SH600517", "SH600519", "SH600520", "SH600521", "SH600522", "SH600523", "SH600525", "SH600526", "SH600527", "SH600528", "SH600529", "SH600531", "SH600532", "SH600533", "SH600535", "SH600536", "SH600537", "SH600538", "SH600540", "SH600543", "SH600545", "SH600546", "SH600547", "SH600548", "SH600549", "SH600550", "SH600551", "SH600552", "SH600556", "SH600557", "SH600558", "SH600559", "SH600560", "SH600561", "SH600562", "SH600563", "SH600565", "SH600566", "SH600567", "SH600568", "SH600569", "SH600570", "SH600571", "SH600572", "SH600573", "SH600575", "SH600576", "SH600577", "SH600578", "SH600579", "SH600580", "SH600581", "SH600582", "SH600583", "SH600584", "SH600585", "SH600586", "SH600587", "SH600588", "SH600589", "SH600590", "SH600592", "SH600593", "SH600594", "SH600596", "SH600597", "SH600598", "SH600599", "SH600600", "SH600601", "SH600602", "SH600603", "SH600604", "SH600605", "SH600606", "SH600609", "SH600611", "SH600612", "SH600613", "SH600615", "SH600616", "SH600617", "SH600618", "SH600619", "SH600620", "SH600621", "SH600622", "SH600623", "SH600624", "SH600626", "SH600628", "SH600629", "SH600630", "SH600633", "SH600635", "SH600636", "SH600637", "SH600638", "SH600639", "SH600640", "SH600641", "SH600642", "SH600643", "SH600644", "SH600645", "SH600647", "SH600648", "SH600649", "SH600650", "SH600653", "SH600655", "SH600657", "SH600658", "SH600660", "SH600661", "SH600662", "SH600663", "SH600664", "SH600665", "SH600667", "SH600668", "SH600671", "SH600673", "SH600674", "SH600675", "SH600676", "SH600678", "SH600679", "SH600681", "SH600682", "SH600683", "SH600684", "SH600685", "SH600686", "SH600688", "SH600689", "SH600690", "SH600691", "SH600692", "SH600693", "SH600694", "SH600695", "SH600697", "SH600699", "SH600702", "SH600703", "SH600704", "SH600705", "SH600706", "SH600707", "SH600708", "SH600710", "SH600711", "SH600712", "SH600713", "SH600714", "SH600715", "SH600716", "SH600717", "SH600718", "SH600719", "SH600720", "SH600722", "SH600723", "SH600724", "SH600726", "SH600727", "SH600728", "SH600729", "SH600730", "SH600731", "SH600732", "SH600733", "SH600734", "SH600735", "SH600736", "SH600737", "SH600738", "SH600739", "SH600740", "SH600741", "SH600742", "SH600743", "SH600744", "SH600745", "SH600746", "SH600748", "SH600749", "SH600750", "SH600751", "SH600753", "SH600754", "SH600755", "SH600756", "SH600757", "SH600758", "SH600759", "SH600760", "SH600761", "SH600763", "SH600764", "SH600765", "SH600766", "SH600768", "SH600769", "SH600770", "SH600771", "SH600773", "SH600774", "SH600775", "SH600776", "SH600777", "SH600778", "SH600779", "SH600780", "SH600782", "SH600783", "SH600784", "SH600785", "SH600787", "SH600789", "SH600790", "SH600791", "SH600792", "SH600793", "SH600794", "SH600795", "SH600796", "SH600797", "SH600798", "SH600800", "SH600801", "SH600802", "SH600803", "SH600804", "SH600805", "SH600808", "SH600809", "SH600810", "SH600811", "SH600812", "SH600814", "SH600818", "SH600819", "SH600820", "SH600822", "SH600823", "SH600824", "SH600825", "SH600826", "SH600827", "SH600828", "SH600829", "SH600830", "SH600831", "SH600833", "SH600834", "SH600835", "SH600837", "SH600838", "SH600839", "SH600841", "SH600843", "SH600844", "SH600845", "SH600846", "SH600847", "SH600848", "SH600850", "SH600851", "SH600853", "SH600854", "SH600855", "SH600857", "SH600858", "SH600859", "SH600861", "SH600862", "SH600863", "SH600864", "SH600865", "SH600866", "SH600867", "SH600868", "SH600869", "SH600871", "SH600872", "SH600873", "SH600874", "SH600875", "SH600876", "SH600879", "SH600880", "SH600881", "SH600882", "SH600883", "SH600884", "SH600885", "SH600886", "SH600887", "SH600888", "SH600889", "SH600890", "SH600893", "SH600894", "SH600895", "SH600896", "SH600897", "SH600900", "SH600901", "SH600903", "SH600908", "SH600909", "SH600917", "SH600918", "SH600919", "SH600926", "SH600928", "SH600929", "SH600933", "SH600936", "SH600939", "SH600958", "SH600959", "SH600960", "SH600961", "SH600962", "SH600963", "SH600965", "SH600966", "SH600967", "SH600968", "SH600969", "SH600970", "SH600971", "SH600973", "SH600975", "SH600976", "SH600977", "SH600979", "SH600980", "SH600981", "SH600982", "SH600983", "SH600984", "SH600985", "SH600986", "SH600987", "SH600988", "SH600989", "SH600990", "SH600992", "SH600993", "SH600995", "SH600996", "SH600997", "SH600998", "SH600999", "SH601000", "SH601001", "SH601002", "SH601003", "SH601005", "SH601006", "SH601007", "SH601008", "SH601009", "SH601010", "SH601011", "SH601012", "SH601015", "SH601016", "SH601018", "SH601019", "SH601020", "SH601021", "SH601028", "SH601038", "SH601058", "SH601066", "SH601068", "SH601069", "SH601077", "SH601086", "SH601088", "SH601098", "SH601099", "SH601100", "SH601101", "SH601106", "SH601107", "SH601108", "SH601111", "SH601116", "SH601117", "SH601118", "SH601126", "SH601127", "SH601128", "SH601137", "SH601138", "SH601139", "SH601155", "SH601158", "SH601162", "SH601163", "SH601166", "SH601168", "SH601169", "SH601177", "SH601179", "SH601186", "SH601188", "SH601198", "SH601199", "SH601200", "SH601206", "SH601208", "SH601211", "SH601212", "SH601216", "SH601218", "SH601222", "SH601225", "SH601226", "SH601228", "SH601229", "SH601231", "SH601233", "SH601236", "SH601238", "SH601288", "SH601298", "SH601311", "SH601318", "SH601319", "SH601326", "SH601328", "SH601330", "SH601333", "SH601336", "SH601339", "SH601360", "SH601366", "SH601368", "SH601369", "SH601375", "SH601377", "SH601388", "SH601390", "SH601398", "SH601500", "SH601512", "SH601515", "SH601518", "SH601519", "SH601555", "SH601566", "SH601567", "SH601577", "SH601579", "SH601588", "SH601595", "SH601598", "SH601599", "SH601600", "SH601601", "SH601606", "SH601607", "SH601608", "SH601609", "SH601611", "SH601615", "SH601616", "SH601618", "SH601619", "SH601628", "SH601633", "SH601636", "SH601658", "SH601666", "SH601668", "SH601669", "SH601677", "SH601678", "SH601688", "SH601689", "SH601696", "SH601698", "SH601699", "SH601700", "SH601717", "SH601718", "SH601727", "SH601766", "SH601777", "SH601778", "SH601788", "SH601789", "SH601798", "SH601799", "SH601800", "SH601801", "SH601808", "SH601811", "SH601816", "SH601818", "SH601828", "SH601838", "SH601857", "SH601858", "SH601860", "SH601865", "SH601866", "SH601869", "SH601872", "SH601877", "SH601878", "SH601880", "SH601881", "SH601882", "SH601886", "SH601888", "SH601890", "SH601898", "SH601899", "SH601900", "SH601901", "SH601908", "SH601916", "SH601918", "SH601919", "SH601928", "SH601929", "SH601933", "SH601939", "SH601949", "SH601952", "SH601958", "SH601965", "SH601966", "SH601968", "SH601969", "SH601975", "SH601985", "SH601988", "SH601989", "SH601990", "SH601991", "SH601992", "SH601996", "SH601997", "SH601998", "SH601999", "SH603000", "SH603001", "SH603002", "SH603003", "SH603005", "SH603006", "SH603007", "SH603008", "SH603009", "SH603010", "SH603011", "SH603012", "SH603013", "SH603015", "SH603016", "SH603017", "SH603018", "SH603019", "SH603020", "SH603021", "SH603022", "SH603023", "SH603025", "SH603026", "SH603027", "SH603028", "SH603029", "SH603030", "SH603031", "SH603032", "SH603033", "SH603035", "SH603036", "SH603037", "SH603038", "SH603039", "SH603040", "SH603041", "SH603042", "SH603043", "SH603045", "SH603050", "SH603053", "SH603055", "SH603056", "SH603058", "SH603059", "SH603060", "SH603063", "SH603066", "SH603067", "SH603068", "SH603069", "SH603076", "SH603077", "SH603078", "SH603079", "SH603080", "SH603081", "SH603083", "SH603085", "SH603086", "SH603088", "SH603089", "SH603090", "SH603093", "SH603095", "SH603096", "SH603098", "SH603099", "SH603100", "SH603101", "SH603103", "SH603105", "SH603106", "SH603108", "SH603109", "SH603110", "SH603111", "SH603113", "SH603115", "SH603116", "SH603117", "SH603118", "SH603121", "SH603123", "SH603126", "SH603127", "SH603128", "SH603129", "SH603131", "SH603133", "SH603136", "SH603138", "SH603139", "SH603156", "SH603157", "SH603158", "SH603159", "SH603160", "SH603161", "SH603165", "SH603166", "SH603167", "SH603168", "SH603169", "SH603177", "SH603178", "SH603179", "SH603180", "SH603181", "SH603183", "SH603185", "SH603186", "SH603187", "SH603189", "SH603192", "SH603195", "SH603196", "SH603197", "SH603198", "SH603199", "SH603200", "SH603203", "SH603208", "SH603212", "SH603214", "SH603217", "SH603218", "SH603220", "SH603221", "SH603222", "SH603223", "SH603225", "SH603226", "SH603227", "SH603228", "SH603229", "SH603232", "SH603233", "SH603236", "SH603238", "SH603239", "SH603256", "SH603258", "SH603259", "SH603260", "SH603266", "SH603267", "SH603268", "SH603269", "SH603277", "SH603278", "SH603279", "SH603283", "SH603286", "SH603288", "SH603289", "SH603290", "SH603297", "SH603298", "SH603299", "SH603300", "SH603301", "SH603302", "SH603303", "SH603305", "SH603306", "SH603308", "SH603309", "SH603311", "SH603313", "SH603315", "SH603316", "SH603317", "SH603318", "SH603319", "SH603320", "SH603321", "SH603322", "SH603323", "SH603326", "SH603327", "SH603328", "SH603329", "SH603330", "SH603331", "SH603332", "SH603333", "SH603335", "SH603336", "SH603337", "SH603338", "SH603339", "SH603345", "SH603348", "SH603351", "SH603353", "SH603355", "SH603356", "SH603357", "SH603358", "SH603359", "SH603360", "SH603363", "SH603365", "SH603366", "SH603367", "SH603368", "SH603369", "SH603377", "SH603378", "SH603379", "SH603380", "SH603383", "SH603385", "SH603386", "SH603387", "SH603388", "SH603390", "SH603392", "SH603393", "SH603396", "SH603398", "SH603399", "SH603416", "SH603421", "SH603429", "SH603439", "SH603444", "SH603456", "SH603458", "SH603466", "SH603477", "SH603486", "SH603488", "SH603489", "SH603496", "SH603499", "SH603500", "SH603501", "SH603505", "SH603506", "SH603507", "SH603508", "SH603515", "SH603516", "SH603517", "SH603518", "SH603519", "SH603520", "SH603527", "SH603528", "SH603530", "SH603533", "SH603535", "SH603536", "SH603538", "SH603551", "SH603556", "SH603557", "SH603558", "SH603559", "SH603566", "SH603567", "SH603568", "SH603569", "SH603577", "SH603578", "SH603579", "SH603580", "SH603583", "SH603585", "SH603586", "SH603587", "SH603588", "SH603589", "SH603590", "SH603595", "SH603596", "SH603598", "SH603599", "SH603600", "SH603601", "SH603602", "SH603603", "SH603605", "SH603606", "SH603607", "SH603608", "SH603609", "SH603610", "SH603611", "SH603612", "SH603613", "SH603615", "SH603616", "SH603617", "SH603618", "SH603619", "SH603626", "SH603628", "SH603629", "SH603630", "SH603633", "SH603636", "SH603637", "SH603638", "SH603639", "SH603648", "SH603650", "SH603655", "SH603656", "SH603657", "SH603658", "SH603659", "SH603660", "SH603661", "SH603662", "SH603663", "SH603665", "SH603666", "SH603667", "SH603668", "SH603669", "SH603676", "SH603677", "SH603678", "SH603679", "SH603680", "SH603681", "SH603682", "SH603683", "SH603685", "SH603686", "SH603687", "SH603688", "SH603689", "SH603690", "SH603693", "SH603696", "SH603697", "SH603698", "SH603699", "SH603700", "SH603701", "SH603703", "SH603706", "SH603707", "SH603708", "SH603709", "SH603711", "SH603712", "SH603713", "SH603716", "SH603717", "SH603718", "SH603719", "SH603721", "SH603722", "SH603725", "SH603726", "SH603727", "SH603728", "SH603729", "SH603730", "SH603733", "SH603737", "SH603738", "SH603739", "SH603755", "SH603757", "SH603758", "SH603766", "SH603767", "SH603768", "SH603773", "SH603776", "SH603777", "SH603778", "SH603786", "SH603787", "SH603788", "SH603789", "SH603790", "SH603797", "SH603798", "SH603799", "SH603800", "SH603801", "SH603803", "SH603806", "SH603808", "SH603809", "SH603810", "SH603811", "SH603813", "SH603815", "SH603816", "SH603817", "SH603818", "SH603819", "SH603822", "SH603823", "SH603825", "SH603826", "SH603828", "SH603829", "SH603833", "SH603838", "SH603839", "SH603843", "SH603848", "SH603855", "SH603856", "SH603858", "SH603859", "SH603860", "SH603861", "SH603863", "SH603866", "SH603867", "SH603868", "SH603869", "SH603871", "SH603876", "SH603877", "SH603878", "SH603879", "SH603880", "SH603881", "SH603882", "SH603883", "SH603885", "SH603886", "SH603887", "SH603888", "SH603889", "SH603890", "SH603893", "SH603895", "SH603896", "SH603897", "SH603898", "SH603899", "SH603900", "SH603901", "SH603903", "SH603906", "SH603908", "SH603909", "SH603912", "SH603915", "SH603916", "SH603917", "SH603918", "SH603919", "SH603920", "SH603922", "SH603926", "SH603927", "SH603928", "SH603929", "SH603933", "SH603936", "SH603937", "SH603938", "SH603939", "SH603948", "SH603949", "SH603950", "SH603955", "SH603956", "SH603958", "SH603959", "SH603960", "SH603963", "SH603966", "SH603967", "SH603968", "SH603969", "SH603970", "SH603976", "SH603977", "SH603978", "SH603979", "SH603980", "SH603982", "SH603983", "SH603985", "SH603986", "SH603987", "SH603988", "SH603989", "SH603990", "SH603991", "SH603992", "SH603993", "SH603995", "SH603997", "SH603998", "SH603999", "SH605001", "SH605166", "SH605168", "SH688001", "SH688002", "SH688003", "SH688005", "SH688006", "SH688007", "SH688008", "SH688009", "SH688010", "SH688011", "SH688012", "SH688015", "SH688016", "SH688018", "SH688019", "SH688020", "SH688021", "SH688022", "SH688023", "SH688025", "SH688026", "SH688028", "SH688029", "SH688030", "SH688033", "SH688036", "SH688037", "SH688039", "SH688051", "SH688058", "SH688066", "SH688068", "SH688078", "SH688080", "SH688081", "SH688085", "SH688086", "SH688088", "SH688089", "SH688090", "SH688096", "SH688098", "SH688099", "SH688100", "SH688101", "SH688108", "SH688111", "SH688116", "SH688118", "SH688122", "SH688123", "SH688126", "SH688128", "SH688138", "SH688139", "SH688158", "SH688159", "SH688166", "SH688168", "SH688169", "SH688177", "SH688178", "SH688181", "SH688186", "SH688188", "SH688189", "SH688196", "SH688198", "SH688199", "SH688200", "SH688202", "SH688208", "SH688218", "SH688222", "SH688228", "SH688233", "SH688258", "SH688266", "SH688268", "SH688278", "SH688288", "SH688298", "SH688299", "SH688300", "SH688310", "SH688318", "SH688321", "SH688333", "SH688357", "SH688358", "SH688363", "SH688365", "SH688366", "SH688368", "SH688369", "SH688388", "SH688389", "SH688396", "SH688398", "SH688399", "SH688466", "SH688516", "SH688566", "SH688588", "SH688598", "SZ000001", "SZ000002", "SZ000004", "SZ000005", "SZ000006", "SZ000007", "SZ000008", "SZ000009", "SZ000010", "SZ000011", "SZ000012", "SZ000014", "SZ000016", "SZ000017", "SZ000019", "SZ000020", "SZ000021", "SZ000023", "SZ000025", "SZ000026", "SZ000027", "SZ000028", "SZ000029", "SZ000030", "SZ000031", "SZ000032", "SZ000034", "SZ000035", "SZ000036", "SZ000037", "SZ000038", "SZ000039", "SZ000040", "SZ000042", "SZ000045", "SZ000046", "SZ000048", "SZ000049", "SZ000050", "SZ000055", "SZ000056", "SZ000058", "SZ000059", "SZ000060", "SZ000061", "SZ000062", "SZ000063", "SZ000065", "SZ000066", "SZ000068", "SZ000069", "SZ000070", "SZ000078", "SZ000088", "SZ000089", "SZ000090", "SZ000096", "SZ000099", "SZ000100", "SZ000150", "SZ000151", "SZ000153", "SZ000155", "SZ000156", "SZ000157", "SZ000158", "SZ000159", "SZ000166", "SZ000301", "SZ000333", "SZ000338", "SZ000400", "SZ000401", "SZ000402", "SZ000403", "SZ000404", "SZ000407", "SZ000408", "SZ000409", "SZ000410", "SZ000411", "SZ000413", "SZ000415", "SZ000416", "SZ000417", "SZ000419", "SZ000420", "SZ000421", "SZ000422", "SZ000423", "SZ000425", "SZ000426", "SZ000428", "SZ000429", "SZ000430", "SZ000488", "SZ000498", "SZ000501", "SZ000502", "SZ000503", "SZ000504", "SZ000505", "SZ000506", "SZ000507", "SZ000509", "SZ000510", "SZ000513", "SZ000514", "SZ000516", "SZ000517", "SZ000518", "SZ000519", "SZ000520", "SZ000521", "SZ000523", "SZ000524", "SZ000525", "SZ000526", "SZ000528", "SZ000529", "SZ000530", "SZ000531", "SZ000532", "SZ000533", "SZ000534", "SZ000536", "SZ000537", "SZ000538", "SZ000539", "SZ000540", "SZ000541", "SZ000543", "SZ000544", "SZ000545", "SZ000546", "SZ000547", "SZ000548", "SZ000550", "SZ000551", "SZ000552", "SZ000553", "SZ000554", "SZ000555", "SZ000557", "SZ000558", "SZ000559", "SZ000560", "SZ000561", "SZ000563", "SZ000564", "SZ000565", "SZ000566", "SZ000567", "SZ000568", "SZ000570", "SZ000571", "SZ000572", "SZ000573", "SZ000576", "SZ000581", "SZ000582", "SZ000584", "SZ000585", "SZ000586", "SZ000587", "SZ000589", "SZ000590", "SZ000591", "SZ000592", "SZ000593", "SZ000595", "SZ000596", "SZ000597", "SZ000598", "SZ000599", "SZ000600", "SZ000601", "SZ000603", "SZ000605", "SZ000606", "SZ000607", "SZ000608", "SZ000609", "SZ000610", "SZ000611", "SZ000612", "SZ000613", "SZ000615", "SZ000616", "SZ000617", "SZ000619", "SZ000620", "SZ000622", "SZ000623", "SZ000625", "SZ000626", "SZ000627", "SZ000628", "SZ000629", "SZ000630", "SZ000631", "SZ000632", "SZ000633", "SZ000635", "SZ000636", "SZ000637", "SZ000638", "SZ000639", "SZ000650", "SZ000651", "SZ000652", "SZ000655", "SZ000656", "SZ000657", "SZ000659", "SZ000661", "SZ000662", "SZ000663", "SZ000665", "SZ000666", "SZ000667", "SZ000668", "SZ000669", "SZ000671", "SZ000672", "SZ000673", "SZ000676", "SZ000677", "SZ000678", "SZ000679", "SZ000680", "SZ000681", "SZ000682", "SZ000683", "SZ000685", "SZ000686", "SZ000687", "SZ000688", "SZ000690", "SZ000691", "SZ000692", "SZ000695", "SZ000697", "SZ000698", "SZ000700", "SZ000701", "SZ000702", "SZ000703", "SZ000705", "SZ000707", "SZ000708", "SZ000709", "SZ000710", "SZ000711", "SZ000712", "SZ000713", "SZ000715", "SZ000716", "SZ000717", "SZ000718", "SZ000719", "SZ000720", "SZ000721", "SZ000722", "SZ000723", "SZ000725", "SZ000726", "SZ000727", "SZ000728", "SZ000729", "SZ000731", "SZ000732", "SZ000733", "SZ000735", "SZ000736", "SZ000737", "SZ000738", "SZ000739", "SZ000750", "SZ000751", "SZ000752", "SZ000753", "SZ000755", "SZ000756", "SZ000757", "SZ000758", "SZ000759", "SZ000760", "SZ000761", "SZ000762", "SZ000766", "SZ000767", "SZ000768", "SZ000776", "SZ000777", "SZ000778", "SZ000779", "SZ000780", "SZ000782", "SZ000783", "SZ000785", "SZ000786", "SZ000788", "SZ000789", "SZ000790", "SZ000791", "SZ000792", "SZ000793", "SZ000795", "SZ000796", "SZ000797", "SZ000798", "SZ000799", "SZ000800", "SZ000801", "SZ000802", "SZ000803", "SZ000806", "SZ000807", "SZ000809", "SZ000810", "SZ000811", "SZ000812", "SZ000813", "SZ000815", "SZ000816", "SZ000818", "SZ000819", "SZ000820", "SZ000821", "SZ000822", "SZ000823", "SZ000825", "SZ000826", "SZ000828", "SZ000829", "SZ000830", "SZ000831", "SZ000833", "SZ000835", "SZ000836", "SZ000837", "SZ000838", "SZ000839", "SZ000848", "SZ000850", "SZ000851", "SZ000852", "SZ000856", "SZ000858", "SZ000859", "SZ000860", "SZ000861", "SZ000862", "SZ000863", "SZ000868", "SZ000869", "SZ000875", "SZ000876", "SZ000877", "SZ000878", "SZ000880", "SZ000881", "SZ000882", "SZ000883", "SZ000885", "SZ000886", "SZ000887", "SZ000888", "SZ000889", "SZ000890", "SZ000892", "SZ000893", "SZ000895", "SZ000897", "SZ000898", "SZ000899", "SZ000900", "SZ000901", "SZ000902", "SZ000903", "SZ000905", "SZ000906", "SZ000908", "SZ000909", "SZ000910", "SZ000911", "SZ000912", "SZ000913", "SZ000915", "SZ000917", "SZ000918", "SZ000919", "SZ000920", "SZ000921", "SZ000922", "SZ000923", "SZ000925", "SZ000926", "SZ000927", "SZ000928", "SZ000929", "SZ000930", "SZ000931", "SZ000932", "SZ000933", "SZ000935", "SZ000936", "SZ000937", "SZ000938", "SZ000948", "SZ000949", "SZ000950", "SZ000951", "SZ000952", "SZ000953", "SZ000955", "SZ000957", "SZ000958", "SZ000959", "SZ000960", "SZ000961", "SZ000962", "SZ000963", "SZ000965", "SZ000966", "SZ000967", "SZ000968", "SZ000969", "SZ000970", "SZ000971", "SZ000972", "SZ000973", "SZ000975", "SZ000976", "SZ000977", "SZ000978", "SZ000980", "SZ000981", "SZ000982", "SZ000983", "SZ000985", "SZ000987", "SZ000988", "SZ000989", "SZ000990", "SZ000993", "SZ000996", "SZ000997", "SZ000998", "SZ000999", "SZ001696", "SZ001872", "SZ001896", "SZ001914", "SZ001965", "SZ001979", "SZ002001", "SZ002002", "SZ002003", "SZ002004", "SZ002005", "SZ002006", "SZ002007", "SZ002008", "SZ002009", "SZ002010", "SZ002011", "SZ002012", "SZ002013", "SZ002014", "SZ002015", "SZ002016", "SZ002017", "SZ002019", "SZ002020", "SZ002021", "SZ002022", "SZ002023", "SZ002024", "SZ002025", "SZ002026", "SZ002027", "SZ002028", "SZ002029", "SZ002030", "SZ002031", "SZ002032", "SZ002033", "SZ002034", "SZ002035", "SZ002036", "SZ002037", "SZ002038", "SZ002039", "SZ002040", "SZ002041", "SZ002042", "SZ002043", "SZ002044", "SZ002045", "SZ002046", "SZ002047", "SZ002048", "SZ002049", "SZ002050", "SZ002051", "SZ002052", "SZ002053", "SZ002054", "SZ002055", "SZ002056", "SZ002057", "SZ002058", "SZ002059", "SZ002060", "SZ002061", "SZ002062", "SZ002063", "SZ002064", "SZ002065", "SZ002066", "SZ002067", "SZ002068", "SZ002069", "SZ002071", "SZ002072", "SZ002073", "SZ002074", "SZ002075", "SZ002076", "SZ002077", "SZ002078", "SZ002079", "SZ002080", "SZ002081", "SZ002082", "SZ002083", "SZ002084", "SZ002085", "SZ002086", "SZ002087", "SZ002088", "SZ002089", "SZ002090", "SZ002091", "SZ002092", "SZ002093", "SZ002094", "SZ002095", "SZ002096", "SZ002097", "SZ002098", "SZ002099", "SZ002100", "SZ002101", "SZ002102", "SZ002103", "SZ002104", "SZ002105", "SZ002106", "SZ002107", "SZ002108", "SZ002109", "SZ002110", "SZ002111", "SZ002112", "SZ002113", "SZ002114", "SZ002115", "SZ002116", "SZ002117", "SZ002118", "SZ002119", "SZ002120", "SZ002121", "SZ002122", "SZ002123", "SZ002124", "SZ002125", "SZ002126", "SZ002127", "SZ002128", "SZ002129", "SZ002130", "SZ002131", "SZ002132", "SZ002133", "SZ002134", "SZ002135", "SZ002136", "SZ002137", "SZ002138", "SZ002139", "SZ002140", "SZ002141", "SZ002142", "SZ002144", "SZ002145", "SZ002146", "SZ002147", "SZ002148", "SZ002149", "SZ002150", "SZ002151", "SZ002152", "SZ002153", "SZ002154", "SZ002155", "SZ002156", "SZ002157", "SZ002158", "SZ002159", "SZ002160", "SZ002161", "SZ002162", "SZ002163", "SZ002164", "SZ002165", "SZ002166", "SZ002167", "SZ002168", "SZ002169", "SZ002170", "SZ002171", "SZ002172", "SZ002173", "SZ002174", "SZ002175", "SZ002176", "SZ002177", "SZ002178", "SZ002179", "SZ002180", "SZ002181", "SZ002182", "SZ002183", "SZ002184", "SZ002185", "SZ002186", "SZ002187", "SZ002188", "SZ002189", "SZ002190", "SZ002191", "SZ002192", "SZ002193", "SZ002194", "SZ002195", "SZ002196", "SZ002197", "SZ002198", "SZ002199", "SZ002200", "SZ002201", "SZ002202", "SZ002203", "SZ002204", "SZ002205", "SZ002206", "SZ002207", "SZ002208", "SZ002209", "SZ002210", "SZ002211", "SZ002212", "SZ002213", "SZ002214", "SZ002215", "SZ002216", "SZ002217", "SZ002218", "SZ002219", "SZ002220", "SZ002221", "SZ002222", "SZ002223", "SZ002224", "SZ002225", "SZ002226", "SZ002227", "SZ002228", "SZ002229", "SZ002230", "SZ002231", "SZ002232", "SZ002233", "SZ002234", "SZ002235", "SZ002236", "SZ002237", "SZ002238", "SZ002239", "SZ002240", "SZ002241", "SZ002242", "SZ002243", "SZ002244", "SZ002245", "SZ002246", "SZ002247", "SZ002248", "SZ002249", "SZ002250", "SZ002251", "SZ002252", "SZ002253", "SZ002254", "SZ002255", "SZ002256", "SZ002258", "SZ002259", "SZ002261", "SZ002262", "SZ002263", "SZ002264", "SZ002265", "SZ002266", "SZ002267", "SZ002268", "SZ002269", "SZ002270", "SZ002271", "SZ002272", "SZ002273", "SZ002274", "SZ002275", "SZ002276", "SZ002277", "SZ002278", "SZ002279", "SZ002280", "SZ002281", "SZ002282", "SZ002283", "SZ002284", "SZ002285", "SZ002286", "SZ002287", "SZ002288", "SZ002289", "SZ002290", "SZ002291", "SZ002292", "SZ002293", "SZ002294", "SZ002295", "SZ002296", "SZ002297", "SZ002298", "SZ002299", "SZ002300", "SZ002301", "SZ002302", "SZ002303", "SZ002304", "SZ002305", "SZ002306", "SZ002307", "SZ002308", "SZ002309", "SZ002310", "SZ002311", "SZ002312", "SZ002313", "SZ002314", "SZ002315", "SZ002316", "SZ002317", "SZ002318", "SZ002319", "SZ002320", "SZ002321", "SZ002322", "SZ002323", "SZ002324", "SZ002325", "SZ002326", "SZ002327", "SZ002328", "SZ002329", "SZ002330", "SZ002331", "SZ002332", "SZ002333", "SZ002334", "SZ002335", "SZ002336", "SZ002337", "SZ002338", "SZ002339", "SZ002340", "SZ002341", "SZ002342", "SZ002343", "SZ002344", "SZ002345", "SZ002346", "SZ002347", "SZ002348", "SZ002349", "SZ002350", "SZ002351", "SZ002352", "SZ002353", "SZ002354", "SZ002355", "SZ002356", "SZ002357", "SZ002358", "SZ002359", "SZ002360", "SZ002361", "SZ002362", "SZ002363", "SZ002364", "SZ002365", "SZ002366", "SZ002367", "SZ002368", "SZ002369", "SZ002370", "SZ002371", "SZ002372", "SZ002373", "SZ002374", "SZ002375", "SZ002376", "SZ002377", "SZ002378", "SZ002379", "SZ002380", "SZ002381", "SZ002382", "SZ002383", "SZ002384", "SZ002385", "SZ002386", "SZ002387", "SZ002388", "SZ002389", "SZ002390", "SZ002391", "SZ002392", "SZ002393", "SZ002394", "SZ002395", "SZ002396", "SZ002397", "SZ002398", "SZ002399", "SZ002400", "SZ002401", "SZ002402", "SZ002403", "SZ002404", "SZ002405", "SZ002406", "SZ002407", "SZ002408", "SZ002409", "SZ002410", "SZ002411", "SZ002412", "SZ002413", "SZ002414", "SZ002415", "SZ002416", "SZ002417", "SZ002418", "SZ002419", "SZ002420", "SZ002421", "SZ002422", "SZ002423", "SZ002424", "SZ002425", "SZ002426", "SZ002427", "SZ002428", "SZ002429", "SZ002430", "SZ002431", "SZ002432", "SZ002433", "SZ002434", "SZ002435", "SZ002436", "SZ002437", "SZ002438", "SZ002439", "SZ002440", "SZ002441", "SZ002442", "SZ002443", "SZ002444", "SZ002445", "SZ002446", "SZ002447", "SZ002448", "SZ002449", "SZ002450", "SZ002451", "SZ002452", "SZ002453", "SZ002454", "SZ002455", "SZ002456", "SZ002457", "SZ002458", "SZ002459", "SZ002460", "SZ002461", "SZ002462", "SZ002463", "SZ002464", "SZ002465", "SZ002466", "SZ002467", "SZ002468", "SZ002469", "SZ002470", "SZ002471", "SZ002472", "SZ002473", "SZ002474", "SZ002475", "SZ002476", "SZ002478", "SZ002479", "SZ002480", "SZ002481", "SZ002482", "SZ002483", "SZ002484", "SZ002485", "SZ002486", "SZ002487", "SZ002488", "SZ002489", "SZ002490", "SZ002491", "SZ002492", "SZ002493", "SZ002494", "SZ002495", "SZ002496", "SZ002497", "SZ002498", "SZ002499", "SZ002500", "SZ002501", "SZ002502", "SZ002503", "SZ002504", "SZ002505", "SZ002506", "SZ002507", "SZ002508", "SZ002509", "SZ002510", "SZ002511", "SZ002512", "SZ002513", "SZ002514", "SZ002515", "SZ002516", "SZ002517", "SZ002518", "SZ002519", "SZ002520", "SZ002521", "SZ002522", "SZ002523", "SZ002524", "SZ002526", "SZ002527", "SZ002528", "SZ002529", "SZ002530", "SZ002531", "SZ002532", "SZ002533", "SZ002534", "SZ002535", "SZ002536", "SZ002537", "SZ002538", "SZ002539", "SZ002540", "SZ002541", "SZ002542", "SZ002543", "SZ002544", "SZ002545", "SZ002546", "SZ002547", "SZ002548", "SZ002549", "SZ002550", "SZ002551", "SZ002552", "SZ002553", "SZ002554", "SZ002555", "SZ002556", "SZ002557", "SZ002558", "SZ002559", "SZ002560", "SZ002561", "SZ002562", "SZ002563", "SZ002564", "SZ002565", "SZ002566", "SZ002567", "SZ002568", "SZ002569", "SZ002570", "SZ002571", "SZ002572", "SZ002573", "SZ002574", "SZ002575", "SZ002576", "SZ002577", "SZ002578", "SZ002579", "SZ002580", "SZ002581", "SZ002582", "SZ002583", "SZ002584", "SZ002585", "SZ002586", "SZ002587", "SZ002588", "SZ002589", "SZ002590", "SZ002591", "SZ002592", "SZ002593", "SZ002594", "SZ002595", "SZ002596", "SZ002597", "SZ002598", "SZ002599", "SZ002600", "SZ002601", "SZ002602", "SZ002603", "SZ002605", "SZ002606", "SZ002607", "SZ002608", "SZ002609", "SZ002610", "SZ002611", "SZ002612", "SZ002613", "SZ002614", "SZ002615", "SZ002616", "SZ002617", "SZ002618", "SZ002619", "SZ002620", "SZ002621", "SZ002622", "SZ002623", "SZ002624", "SZ002625", "SZ002626", "SZ002627", "SZ002628", "SZ002629", "SZ002630", "SZ002631", "SZ002632", "SZ002633", "SZ002634", "SZ002635", "SZ002636", "SZ002637", "SZ002638", "SZ002639", "SZ002640", "SZ002641", "SZ002642", "SZ002643", "SZ002644", "SZ002645", "SZ002646", "SZ002647", "SZ002648", "SZ002649", "SZ002650", "SZ002651", "SZ002652", "SZ002653", "SZ002654", "SZ002655", "SZ002656", "SZ002657", "SZ002658", "SZ002659", "SZ002660", "SZ002661", "SZ002662", "SZ002663", "SZ002664", "SZ002665", "SZ002666", "SZ002667", "SZ002668", "SZ002669", "SZ002670", "SZ002671", "SZ002672", "SZ002673", "SZ002674", "SZ002675", "SZ002676", "SZ002677", "SZ002678", "SZ002679", "SZ002681", "SZ002682", "SZ002683", "SZ002684", "SZ002685", "SZ002686", "SZ002687", "SZ002688", "SZ002689", "SZ002690", "SZ002691", "SZ002692", "SZ002693", "SZ002694", "SZ002695", "SZ002696", "SZ002697", "SZ002698", "SZ002699", "SZ002700", "SZ002701", "SZ002702", "SZ002703", "SZ002705", "SZ002706", "SZ002707", "SZ002708", "SZ002709", "SZ002711", "SZ002712", "SZ002713", "SZ002714", "SZ002715", "SZ002716", "SZ002717", "SZ002718", "SZ002719", "SZ002721", "SZ002722", "SZ002723", "SZ002724", "SZ002725", "SZ002726", "SZ002727", "SZ002728", "SZ002729", "SZ002730", "SZ002731", "SZ002732", "SZ002733", "SZ002734", "SZ002735", "SZ002736", "SZ002737", "SZ002738", "SZ002739", "SZ002740", "SZ002741", "SZ002742", "SZ002743", "SZ002745", "SZ002746", "SZ002747", "SZ002748", "SZ002749", "SZ002750", "SZ002751", "SZ002752", "SZ002753", "SZ002755", "SZ002756", "SZ002757", "SZ002758", "SZ002759", "SZ002760", "SZ002761", "SZ002762", "SZ002763", "SZ002765", "SZ002766", "SZ002767", "SZ002768", "SZ002769", "SZ002770", "SZ002771", "SZ002772", "SZ002773", "SZ002774", "SZ002775", "SZ002776", "SZ002777", "SZ002778", "SZ002779", "SZ002780", "SZ002781", "SZ002782", "SZ002783", "SZ002785", "SZ002786", "SZ002787", "SZ002788", "SZ002789", "SZ002790", "SZ002791", "SZ002792", "SZ002793", "SZ002795", "SZ002796", "SZ002797", "SZ002798", "SZ002799", "SZ002800", "SZ002801", "SZ002802", "SZ002803", "SZ002805", "SZ002806", "SZ002807", "SZ002808", "SZ002809", "SZ002810", "SZ002811", "SZ002812", "SZ002813", "SZ002815", "SZ002816", "SZ002817", "SZ002818", "SZ002819", "SZ002820", "SZ002821", "SZ002822", "SZ002823", "SZ002824", "SZ002825", "SZ002826", "SZ002827", "SZ002828", "SZ002829", "SZ002830", "SZ002831", "SZ002832", "SZ002833", "SZ002835", "SZ002836", "SZ002837", "SZ002838", "SZ002839", "SZ002840", "SZ002841", "SZ002842", "SZ002843", "SZ002845", "SZ002846", "SZ002847", "SZ002848", "SZ002849", "SZ002850", "SZ002851", "SZ002852", "SZ002853", "SZ002855", "SZ002856", "SZ002857", "SZ002858", "SZ002859", "SZ002860", "SZ002861", "SZ002862", "SZ002863", "SZ002864", "SZ002865", "SZ002866", "SZ002867", "SZ002868", "SZ002869", "SZ002870", "SZ002871", "SZ002872", "SZ002873", "SZ002875", "SZ002876", "SZ002877", "SZ002878", "SZ002879", "SZ002880", "SZ002881", "SZ002882", "SZ002883", "SZ002884", "SZ002885", "SZ002886", "SZ002887", "SZ002888", "SZ002889", "SZ002890", "SZ002891", "SZ002892", "SZ002893", "SZ002895", "SZ002896", "SZ002897", "SZ002898", "SZ002899", "SZ002900", "SZ002901", "SZ002902", "SZ002903", "SZ002905", "SZ002906", "SZ002907", "SZ002908", "SZ002909", "SZ002910", "SZ002911", "SZ002912", "SZ002913", "SZ002915", "SZ002916", "SZ002917", "SZ002918", "SZ002919", "SZ002920", "SZ002921", "SZ002922", "SZ002923", "SZ002925", "SZ002926", "SZ002927", "SZ002928", "SZ002929", "SZ002930", "SZ002931", "SZ002932", "SZ002933", "SZ002935", "SZ002936", "SZ002937", "SZ002938", "SZ002939", "SZ002940", "SZ002941", "SZ002942", "SZ002943", "SZ002945", "SZ002946", "SZ002947", "SZ002948", "SZ002949", "SZ002950", "SZ002951", "SZ002952", "SZ002953", "SZ002955", "SZ002956", "SZ002957", "SZ002958", "SZ002959", "SZ002960", "SZ002961", "SZ002962", "SZ002963", "SZ002965", "SZ002966", "SZ002967", "SZ002968", "SZ002969", "SZ002970", "SZ002971", "SZ002972", "SZ002973", "SZ002975", "SZ002976", "SZ002977", "SZ002978", "SZ002979", "SZ002980", "SZ002981", "SZ002982", "SZ002983", "SZ002985", "SZ002986", "SZ002987", "SZ002988", "SZ002989", "SZ002990", "SZ003816", "SZ300001", "SZ300002", "SZ300003", "SZ300004", "SZ300005", "SZ300006", "SZ300007", "SZ300008", "SZ300009", "SZ300010", "SZ300011", "SZ300012", "SZ300013", "SZ300014", "SZ300015", "SZ300016", "SZ300017", "SZ300018", "SZ300019", "SZ300020", "SZ300021", "SZ300022", "SZ300023", "SZ300024", "SZ300025", "SZ300026", "SZ300027", "SZ300029", "SZ300030", "SZ300031", "SZ300032", "SZ300033", "SZ300034", "SZ300035", "SZ300036", "SZ300037", "SZ300038", "SZ300039", "SZ300040", "SZ300041", "SZ300042", "SZ300043", "SZ300044", "SZ300045", "SZ300046", "SZ300047", "SZ300048", "SZ300049", "SZ300050", "SZ300051", "SZ300052", "SZ300053", "SZ300054", "SZ300055", "SZ300056", "SZ300057", "SZ300058", "SZ300059", "SZ300061", "SZ300062", "SZ300063", "SZ300064", "SZ300065", "SZ300066", "SZ300067", "SZ300068", "SZ300069", "SZ300070", "SZ300071", "SZ300072", "SZ300073", "SZ300074", "SZ300075", "SZ300076", "SZ300077", "SZ300078", "SZ300079", "SZ300080", "SZ300081", "SZ300082", "SZ300083", "SZ300084", "SZ300085", "SZ300086", "SZ300087", "SZ300088", "SZ300089", "SZ300090", "SZ300091", "SZ300092", "SZ300093", "SZ300094", "SZ300095", "SZ300096", "SZ300097", "SZ300098", "SZ300099", "SZ300100", "SZ300101", "SZ300102", "SZ300103", "SZ300105", "SZ300106", "SZ300107", "SZ300108", "SZ300109", "SZ300110", "SZ300111", "SZ300112", "SZ300113", "SZ300114", "SZ300115", "SZ300116", "SZ300117", "SZ300118", "SZ300119", "SZ300120", "SZ300121", "SZ300122", "SZ300123", "SZ300124", "SZ300125", "SZ300126", "SZ300127", "SZ300128", "SZ300129", "SZ300130", "SZ300131", "SZ300132", "SZ300133", "SZ300134", "SZ300135", "SZ300136", "SZ300137", "SZ300138", "SZ300139", "SZ300140", "SZ300141", "SZ300142", "SZ300143", "SZ300144", "SZ300145", "SZ300146", "SZ300147", "SZ300148", "SZ300149", "SZ300150", "SZ300151", "SZ300152", "SZ300153", "SZ300154", "SZ300155", "SZ300156", "SZ300157", "SZ300158", "SZ300159", "SZ300160", "SZ300161", "SZ300162", "SZ300163", "SZ300164", "SZ300165", "SZ300166", "SZ300167", "SZ300168", "SZ300169", "SZ300170", "SZ300171", "SZ300172", "SZ300173", "SZ300174", "SZ300175", "SZ300176", "SZ300177", "SZ300178", "SZ300179", "SZ300180", "SZ300181", "SZ300182", "SZ300183", "SZ300184", "SZ300185", "SZ300187", "SZ300188", "SZ300189", "SZ300190", "SZ300191", "SZ300192", "SZ300193", "SZ300194", "SZ300195", "SZ300196", "SZ300197", "SZ300198", "SZ300199", "SZ300200", "SZ300201", "SZ300202", "SZ300203", "SZ300204", "SZ300205", "SZ300206", "SZ300207", "SZ300208", "SZ300209", "SZ300210", "SZ300211", "SZ300212", "SZ300213", "SZ300214", "SZ300215", "SZ300217", "SZ300218", "SZ300219", "SZ300220", "SZ300221", "SZ300222", "SZ300223", "SZ300224", "SZ300225", "SZ300226", "SZ300227", "SZ300228", "SZ300229", "SZ300230", "SZ300231", "SZ300232", "SZ300233", "SZ300234", "SZ300235", "SZ300236", "SZ300237", "SZ300238", "SZ300239", "SZ300240", "SZ300241", "SZ300242", "SZ300243", "SZ300244", "SZ300245", "SZ300246", "SZ300247", "SZ300248", "SZ300249", "SZ300250", "SZ300251", "SZ300252", "SZ300253", "SZ300254", "SZ300255", "SZ300256", "SZ300257", "SZ300258", "SZ300259", "SZ300260", "SZ300261", "SZ300262", "SZ300263", "SZ300264", "SZ300265", "SZ300266", "SZ300267", "SZ300268", "SZ300269", "SZ300270", "SZ300271", "SZ300272", "SZ300273", "SZ300274", "SZ300275", "SZ300276", "SZ300277", "SZ300278", "SZ300279", "SZ300280", "SZ300281", "SZ300282", "SZ300283", "SZ300284", "SZ300285", "SZ300286", "SZ300287", "SZ300288", "SZ300289", "SZ300290", "SZ300291", "SZ300292", "SZ300293", "SZ300294", "SZ300295", "SZ300296", "SZ300297", "SZ300298", "SZ300299", "SZ300300", "SZ300301", "SZ300302", "SZ300303", "SZ300304", "SZ300305", "SZ300306", "SZ300307", "SZ300308", "SZ300309", "SZ300310", "SZ300311", "SZ300312", "SZ300313", "SZ300314", "SZ300315", "SZ300316", "SZ300317", "SZ300318", "SZ300319", "SZ300320", "SZ300321", "SZ300322", "SZ300323", "SZ300324", "SZ300325", "SZ300326", "SZ300327", "SZ300328", "SZ300329", "SZ300330", "SZ300331", "SZ300332", "SZ300333", "SZ300334", "SZ300335", "SZ300336", "SZ300337", "SZ300338", "SZ300339", "SZ300340", "SZ300341", "SZ300342", "SZ300343", "SZ300344", "SZ300345", "SZ300346", "SZ300347", "SZ300348", "SZ300349", "SZ300350", "SZ300351", "SZ300352", "SZ300353", "SZ300354", "SZ300355", "SZ300356", "SZ300357", "SZ300358", "SZ300359", "SZ300360", "SZ300362", "SZ300363", "SZ300364", "SZ300365", "SZ300366", "SZ300367", "SZ300368", "SZ300369", "SZ300370", "SZ300371", "SZ300373", "SZ300374", "SZ300375", "SZ300376", "SZ300377", "SZ300378", "SZ300379", "SZ300380", "SZ300381", "SZ300382", "SZ300383", "SZ300384", "SZ300385", "SZ300386", "SZ300387", "SZ300388", "SZ300389", "SZ300390", "SZ300391", "SZ300392", "SZ300393", "SZ300394", "SZ300395", "SZ300396", "SZ300397", "SZ300398", "SZ300399", "SZ300400", "SZ300401", "SZ300402", "SZ300403", "SZ300404", "SZ300405", "SZ300406", "SZ300407", "SZ300408", "SZ300409", "SZ300410", "SZ300411", "SZ300412", "SZ300413", "SZ300414", "SZ300415", "SZ300416", "SZ300417", "SZ300418", "SZ300419", "SZ300420", "SZ300421", "SZ300422", "SZ300423", "SZ300424", "SZ300425", "SZ300426", "SZ300427", "SZ300428", "SZ300429", "SZ300430", "SZ300431", "SZ300432", "SZ300433", "SZ300434", "SZ300435", "SZ300436", "SZ300437", "SZ300438", "SZ300439", "SZ300440", "SZ300441", "SZ300442", "SZ300443", "SZ300444", "SZ300445", "SZ300446", "SZ300447", "SZ300448", "SZ300449", "SZ300450", "SZ300451", "SZ300452", "SZ300453", "SZ300454", "SZ300455", "SZ300456", "SZ300457", "SZ300458", "SZ300459", "SZ300460", "SZ300461", "SZ300462", "SZ300463", "SZ300464", "SZ300465", "SZ300466", "SZ300467", "SZ300468", "SZ300469", "SZ300470", "SZ300471", "SZ300472", "SZ300473", "SZ300474", "SZ300475", "SZ300476", "SZ300477", "SZ300478", "SZ300479", "SZ300480", "SZ300481", "SZ300482", "SZ300483", "SZ300484", "SZ300485", "SZ300486", "SZ300487", "SZ300488", "SZ300489", "SZ300490", "SZ300491", "SZ300492", "SZ300493", "SZ300494", "SZ300495", "SZ300496", "SZ300497", "SZ300498", "SZ300499", "SZ300500", "SZ300501", "SZ300502", "SZ300503", "SZ300504", "SZ300505", "SZ300506", "SZ300507", "SZ300508", "SZ300509", "SZ300510", "SZ300511", "SZ300512", "SZ300513", "SZ300514", "SZ300515", "SZ300516", "SZ300517", "SZ300518", "SZ300519", "SZ300520", "SZ300521", "SZ300522", "SZ300523", "SZ300525", "SZ300526", "SZ300527", "SZ300528", "SZ300529", "SZ300530", "SZ300531", "SZ300532", "SZ300533", "SZ300534", "SZ300535", "SZ300536", "SZ300537", "SZ300538", "SZ300539", "SZ300540", "SZ300541", "SZ300542", "SZ300543", "SZ300545", "SZ300546", "SZ300547", "SZ300548", "SZ300549", "SZ300550", "SZ300551", "SZ300552", "SZ300553", "SZ300554", "SZ300555", "SZ300556", "SZ300557", "SZ300558", "SZ300559", "SZ300560", "SZ300561", "SZ300562", "SZ300563", "SZ300564", "SZ300565", "SZ300566", "SZ300567", "SZ300568", "SZ300569", "SZ300570", "SZ300571", "SZ300572", "SZ300573", "SZ300575", "SZ300576", "SZ300577", "SZ300578", "SZ300579", "SZ300580", "SZ300581", "SZ300582", "SZ300583", "SZ300584", "SZ300585", "SZ300586", "SZ300587", "SZ300588", "SZ300589", "SZ300590", "SZ300591", "SZ300592", "SZ300593", "SZ300594", "SZ300595", "SZ300596", "SZ300597", "SZ300598", "SZ300599", "SZ300600", "SZ300601", "SZ300602", "SZ300603", "SZ300604", "SZ300605", "SZ300606", "SZ300607", "SZ300608", "SZ300609", "SZ300610", "SZ300611", "SZ300612", "SZ300613", "SZ300615", "SZ300616", "SZ300617", "SZ300618", "SZ300619", "SZ300620", "SZ300621", "SZ300622", "SZ300623", "SZ300624", "SZ300625", "SZ300626", "SZ300627", "SZ300628", "SZ300629", "SZ300630", "SZ300631", "SZ300632", "SZ300633", "SZ300634", "SZ300635", "SZ300636", "SZ300637", "SZ300638", "SZ300639", "SZ300640", "SZ300641", "SZ300642", "SZ300643", "SZ300644", "SZ300645", "SZ300646", "SZ300647", "SZ300648", "SZ300649", "SZ300650", "SZ300651", "SZ300652", "SZ300653", "SZ300654", "SZ300655", "SZ300656", "SZ300657", "SZ300658", "SZ300659", "SZ300660", "SZ300661", "SZ300662", "SZ300663", "SZ300664", "SZ300665", "SZ300666", "SZ300667", "SZ300668", "SZ300669", "SZ300670", "SZ300671", "SZ300672", "SZ300673", "SZ300674", "SZ300675", "SZ300676", "SZ300677", "SZ300678", "SZ300679", "SZ300680", "SZ300681", "SZ300682", "SZ300683", "SZ300684", "SZ300685", "SZ300686", "SZ300687", "SZ300688", "SZ300689", "SZ300690", "SZ300691", "SZ300692", "SZ300693", "SZ300694", "SZ300695", "SZ300696", "SZ300697", "SZ300698", "SZ300699", "SZ300700", "SZ300701", "SZ300702", "SZ300703", "SZ300705", "SZ300706", "SZ300707", "SZ300708", "SZ300709", "SZ300710", "SZ300711", "SZ300712", "SZ300713", "SZ300715", "SZ300716", "SZ300717", "SZ300718", "SZ300719", "SZ300720", "SZ300721", "SZ300722", "SZ300723", "SZ300724", "SZ300725", "SZ300726", "SZ300727", "SZ300728", "SZ300729", "SZ300730", "SZ300731", "SZ300732", "SZ300733", "SZ300735", "SZ300736", "SZ300737", "SZ300738", "SZ300739", "SZ300740", "SZ300741", "SZ300742", "SZ300743", "SZ300745", "SZ300746", "SZ300747", "SZ300748", "SZ300749", "SZ300750", "SZ300751", "SZ300752", "SZ300753", "SZ300755", "SZ300756", "SZ300757", "SZ300758", "SZ300759", "SZ300760", "SZ300761", "SZ300762", "SZ300763", "SZ300765", "SZ300766", "SZ300767", "SZ300768", "SZ300769", "SZ300770", "SZ300771", "SZ300772", "SZ300773", "SZ300775", "SZ300776", "SZ300777", "SZ300778", "SZ300779", "SZ300780", "SZ300781", "SZ300782", "SZ300783", "SZ300785", "SZ300786", "SZ300787", "SZ300788", "SZ300789", "SZ300790", "SZ300791", "SZ300792", "SZ300793", "SZ300795", "SZ300796", "SZ300797", "SZ300798", "SZ300799", "SZ300800", "SZ300801", "SZ300802", "SZ300803", "SZ300805", "SZ300806", "SZ300807", "SZ300808", "SZ300809", "SZ300810", "SZ300811", "SZ300812", "SZ300813", "SZ300815", "SZ300816", "SZ300817", "SZ300818", "SZ300819", "SZ300820", "SZ300821", "SZ300822", "SZ300823", "SZ300825", "SZ300826", "SZ300827", "SZ300828", "SZ300829", "SZ300830", "SZ300831", "SZ300832", "SZ300833", "SH600069", "SH600083", "SH600084", "SH600091", "SH600112", "SH600119", "SH600122", "SH600145", "SH600149", "SH600175", "SH600179", "SH600193", "SH600209", "SH600212", "SH600215", "SH600225", "SH600228", "SH600234", "SH600238", "SH600241", "SH600243", "SH600247", "SH600255", "SH600265", "SH600275", "SH600280", "SH600289", "SH600290", "SH600301", "SH600306", "SH600311", "SH600319", "SH600354", "SH600358", "SH600385", "SH600399", "SH600408", "SH600416", "SH600421", "SH600423", "SH600462", "SH600470", "SH600485", "SH600518", "SH600530", "SH600539", "SH600555", "SH600595", "SH600608", "SH600614", "SH600634", "SH600651", "SH600652", "SH600654", "SH600666", "SH600677", "SH600687", "SH600696", "SH600698", "SH600701", "SH600721", "SH600725", "SH600767", "SH600781", "SH600807", "SH600815", "SH600816", "SH600817", "SH600821", "SH600836", "SH600856", "SH600860", "SH600870", "SH600877", "SH600892", "SH600898", "SH600978", "SH601113", "SH601258", "SH601558", "SH603188", "SH603389", "SH603555", "SH603779", "SH603996" ];
          stockTable = [];
          switch (dir) {
           case "hs800":
            stockTable = stockTableHs800;
            break;

           case "zz1000":
            stockTable = stockTableZz1000;
            break;

           case "zz500":
            stockTable = stockTableZz500;
            break;

           case "allA":
            stockTable = stockTableAllA;
          }
          return stockTable;
        },
        getValueDillion: function(value) {
          var i, len, number, numberDillion, numberStr;
          if ("object" === typeof value) {
            numberDillion = [];
            for (i = 0, len = value.length; i < len; i++) {
              number = value[i];
              numberStr = "  [" + (parseInt(number) / 1e4).toFixed(2) + "\u4ebf]";
              numberDillion.push(numberStr);
            }
            return numberDillion;
          }
          return "[" + (parseInt(value) / 1e4).toFixed(2) + "\u4ebf]";
        },
        addBillionUnit: function(value) {
          return "[" + value + "\u4ebf]";
        },
        webCopyString: function(string) {
          var el, input, originalRange, selection, success;
          input = string + "";
          el = document.createElement("textarea");
          el.value = input;
          el.setAttribute("readonly", "");
          el.style.position = "absolute";
          el.style.left = "-9999px";
          el.style.fontSize = "12pt";
          selection = getSelection();
          originalRange = null;
          selection.rangeCount > 0 && (originalRange = selection.getRangeAt(0));
          document.body.appendChild(el);
          el.select();
          el.selectionStart = 0;
          el.selectionEnd = input.length;
          success = false;
          try {
            success = document.execCommand("copy");
          } catch (undefined) {}
          document.body.removeChild(el);
          if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
          }
          return success;
        }
      };
      module.exports = utils;
    }).call(this);
    cc._RF.pop();
  }, {} ],
  welcome: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cbd66ftY9FALIcS4HlWaK85", "welcome");
    (function() {
      var CompanyInfoTable, StockInfoTable, global, utils;
      StockInfoTable = require("../StockInfoTable");
      CompanyInfoTable = require("../CompanyInfo");
      global = require("../globalValue");
      utils = require("../tools/utils");
      cc.Class({
        extends: cc.Component,
        properties: {
          m_tips: cc.Label
        },
        update: function(dt) {},
        onLoad: function() {
          var isNoAd, openCount, ref, time, useTime;
          "undefined" !== typeof TDGA && null !== TDGA && TDGA.onEvent("welcome");
          cc.debug.setDisplayStats(false);
          "undefined" !== typeof cocosAnalytics && null !== cocosAnalytics && null != (ref = cocosAnalytics.CAEvent) && ref.onEvent({
            eventName: "\u6253\u5f00\u6b22\u8fce\u754c\u9762"
          });
          time = new Date().getTime();
          StockInfoTable.preloadCsv(time);
          CompanyInfoTable.preloadCsv(time);
          useTime = new Date().getTime() - time;
          isNoAd = cc.sys.localStorage.getItem("isNoAd") || false;
          global.isNoAd = Boolean(isNoAd);
          false === isNoAd && utils.webCopyString("\u5fae\u4fe1\u516c\u4f17\u53f7:\u5927\u718a\u732b\u6295\u8d44");
          openCount = cc.sys.localStorage.getItem("openCount") || 0;
          openCount = Number(openCount);
          if (openCount < 10) return global.isNoAd = true;
        },
        onQuery: function() {
          return cc.director.loadScene("query");
        },
        onFilter: function() {
          return cc.director.loadScene("filter");
        },
        onHelp: function() {
          return cc.director.loadScene("help");
        },
        onProfit: function() {
          return cc.director.loadScene("profit");
        },
        onExit: function() {
          return cc.director.popScene();
        }
      });
    }).call(this);
    cc._RF.pop();
  }, {
    "../CompanyInfo": "CompanyInfo",
    "../StockInfoTable": "StockInfoTable",
    "../globalValue": "globalValue",
    "../tools/utils": "utils"
  } ]
}, {}, [ "use_reversed_rotateBy", "use_v2.1-2.2.1_cc.Toggle_event", "CompanyInfo", "SameIndustryCompany", "StockInfoTable", "defaultSelfSelect", "globalValue", "BalanceSheet", "CashFlowStatement", "ProfitStatement", "TableBase", "filter", "help", "histogram", "profitPanel", "query", "selfSelect", "welcome", "selectStock", "title", "storage", "utils" ]);