const request = require("http.js");
const URL = require("config.js").URL;



function getHotData(callback) {
  request.request({
    url: URL.hot,
    success: data => {
      callback && callback.success && callback.success(data);
    },
    fail: msg => {
      fail: callback && callback.fail && callback.fail(msg)
    }
  });
}



/**
 * 所有发布日期
 */
function getPushDay(callback) {
  request.request({
    url: URL.time,
    success: data => {
      callback.day=data[0];
      getDetailByDay(callback);
    },
    fail: msg => {
      fail: callback && callback.fail && callback.fail(msg)
    }
  });
}

/**
 * 日期列表
 */
function getListByDay(callback) {
  request.request({
    url: URL.history + callback.offset,
    success: data => {
      callback && callback.success && callback.success(data);
    },
    fail: msg => {
      fail: callback && callback.fail && callback.fail(msg)
    }
  });
}

/**
 * 分类列表
 */
function getListByCategory(callback) {
  request.request({
    url: URL.category + callback.category + "/20/" + callback.offset,
    success: data => {
      callback && callback.success && callback.success(data);
    },
    fail: msg => {
      fail: callback && callback.fail && callback.fail(msg)
    }
  });
}

/**
 * 某天详情
 */
function getDetailByDay(callback) {
  callback.day = callback.day.replace(/-/g, '/');
  request.request({
    url: URL.day + callback.day ,
    success: data => {
      callback && callback.success && callback.success(data);
    },
    fail: msg => {
      fail: callback && callback.fail && callback.fail(msg)
    }
  });
}


module.exports = {
  getHotData, getListByDay, getListByCategory, getDetailByDay, getPushDay
}