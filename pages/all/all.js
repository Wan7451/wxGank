const presenter = require("../../utils/presenter.js");
var offset = 1, isLoading = false;
Page({
  data: {
    tabs: ["福利", "Android", "iOS", "前端", "拓展资源", "休息视频"],
    // tab切换  
    currentTab: "福利",
    items: [],
    isAdding: false,
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
      this.onReady();

    }
  },


  onPullDownRefresh: function () {
    offset = 1;
    this.loadList();

  },
  onReachBottom: function () {
    this.loadList();
  },


  onReady: function () {
    offset = 1;
    wx.startPullDownRefresh();
    this.loadList();
  },


  loadList() {
    if (isLoading) return;
    wx.showNavigationBarLoading();
    var that = this;
    var category = this.data.currentTab;
    isLoading = true;
    presenter.getListByCategory({
      category: category,
      offset: offset,
      success: data => {
        console.log(data);
        data = this.handleData(data);
        this.clearLoading();
        if (offset != 1) {
          data = that.data.items.concat(data);
        }
        that.setData({
          items: data,
        });
        isLoading = false;
        wx.hideNavigationBarLoading();
        offset++;
      },
      fail: msg => {
        isLoading = false;
        wx.hideNavigationBarLoading();
        this.clearLoading();
      }
    });
  },

  clearLoading: function () {
    if (offset == 1) {
      wx.stopPullDownRefresh();
    } else {
      //
    }

  },

  handleData: function (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      if (this.data.currentTab == "福利") {
        data[i].image = item.url;
        data[i].time = undefined;
        data[i].who = undefined;
        data[i].url = undefined;
        data[i].desc = undefined;
      } else {
        data[i].time = item.publishedAt.substring(0, 10);
        if (item.images) {
          data[i].image = item.images[0];
          data[i].shrink = true;
        }
      }
    }
    return data;
  },
})  