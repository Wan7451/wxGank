const presenter = require("../../utils/presenter.js");

var isLoading;
Page({
  data: {
    day: "",
    property: [],
    data: [[]],
    image: '',
  },



  onReady: function () {
    var that = this;
    presenter.getPushDay({
      success: data => {
        var property = [];
        for (var name in data) {
          if (name == '福利') { continue; }
          property.push(name);
          data[name] = that.handleData(name, data[name]);
        }
        var dataTmp = new Array();
        for (var i = 0, len = property.length; i < len; i++) {
          dataTmp.push(data[property[i]]);
        }
        var image = data['福利'][0].url;
        that.setData({
          property: property,
          data: dataTmp,
          image: image,
        });
      }
    });
  },


  handleData: function (name, data) {
    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];

      data[i].time = item.publishedAt.substring(0, 10);
      if (item.images) {
        data[i].image = item.images[0];
        data[i].shrink = true;

      }
    }
    return data;
  },


  onPullDownRefresh: function () {
    this.onReady();
  },

})
