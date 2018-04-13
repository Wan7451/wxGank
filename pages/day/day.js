const presenter = require("../../utils/presenter.js");
var parser = require("../../lib/xml/dom-parser.js");
var offset = 1, isLoading;
Page({

  data: {
    items: [],
    isAdding:false,
  },


  onReady: function () {
    offset = 1;
    this.loadList();
    wx.startPullDownRefresh();
  },


  loadList() {
    if (isLoading) return;
    wx.showNavigationBarLoading();

    var that = this;
    isLoading = true;
    presenter.getListByDay({
      offset: offset,
      success: data => {
        data = this.handleData(data);
        if (offset != 1) {
          data = that.data.items.concat(data);
          this.setData({
            isAdding: false,
          });
        }
        that.setData({
          items: data,
        });
        isLoading = false;
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        offset++;
      },
      fail: msg => {
        isLoading = false;
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (offset != 1) {
          this.setData({
            isAdding: false,
          });
        }
      }
    });
  },


  handleData(data) {
    for (var i=0, len = data.length; i < len; i++) {
      var item = data[i];
      var xmlParser = new parser.DOMParser();
      var doc = xmlParser.parseFromString(item.content);
      var imgEle = doc.getElementsByTagName("img")[0];
      data[i].url = imgEle.getAttribute("src");
      data[i].time = item.updated_at.substring(0,10);
    }
    return data;
  },
  onPullDownRefresh: function () {
    this.loadList();
  },


  onReachBottom: function () {
    this.setData({
      isAdding:true,
    });
    this.loadList();
  },


  onShareAppMessage: function () {

  }
})