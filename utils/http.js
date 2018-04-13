const REPEAT_COUNT = require("config.js").REPEAT_COUNT;
const DEBUG = require("config.js").DEBUG_MODE;
const HOST = require("config.js").HOST;
var requestQueue = []; //请求队列

/**
 * 发起请求
 * 
 * req.url    请求地址
 * req.data   请求参数
 * req.success  服务返回的确数据，data中的数据
 * req.fail   请求失败，对象可无该方法
 */
function request(req) {
  req.repeatCount = 0;
  req.isLoding = false;
  requestQueue.push(req);
  handleRequest();
}

/**
 * 处理请求
 */
function handleRequest() {
  //取出队列第一个请求
  var req = requestQueue.shift();
  if (!req) return;

  if (DEBUG) {
    console.log("======>url:" + req.url);
  }
  //是否展示loading
  if (!req.isLoding) {
    req.isLoding = true;
    req.showLoading && wx.showLoading({
      title: ' ',
    });
  }
  //发起请求
  wx.request({
    url: HOST + req.url,
    data: {},
    header: {},
    method: "GET",
    success: function (res) {
      if (DEBUG) {
        console.log(res.data);
      }
      var data = getResultData(res);
      if (data) {
        //请求成功
        wx.hideLoading();
        req.isLoding = false;
        req.success&&req.success(data);
        //递归处理其他请求
        handleRequest();
      } else if (req.repeatCount < REPEAT_COUNT) {
        //加入队列再次请求，最多3次
        req.repeatCount++;
        requestQueue.push(req);
        //递归处理其他请求
        handleRequest();
      } else {
        //超出3次，显示错误处理
        wx.hideLoading();
        req.isLoding = false;
        handleError(res);
        req.fail && req.fail();
      }

    },
    fail: function (res) {
      if (DEBUG) {
        console.log("======>error:" + res.errMsg);
      }
      if (req.repeatCount < REPEAT_COUNT) {
        //加入队列再次请求，最多3次
        req.repeatCount++;
        requestQueue.push(req);
        //递归处理其他请求
        handleRequest();
        return;
      }

      req.fail && req.fail(res.errMsg);
      req.isLoding = false;
      wx.hideLoading();
      showErrorToast(res.errMsg);
    }

  })
}


/**
 * 处理 wxRequest 成功后返回的数据
 * 
 * 返回 服务其中 data 的数据
 */
function getResultData(res) {
  //网络错误
  if (res.statusCode != 200) {
    return;
  }
  //服务器返回 null
  var data = res.data;
  if (!data) {
    return;
  }
  //服务器返回数据处理
  if (!data.error) {
    //返回的正确数据
    return data.results;
  }
}

/**
 * 处理 wxRequest 成功后返回的数据
 * 
 * 返回 服务其中 data 的数据
 */
function handleError(res) {

  //网络错误
  if (res.statusCode != 200) {
    showErrorToast("[" + res.statusCode + "]异常");
    return;
  }
  //服务器返回 null
  var data = res.data;
  if (!data) {
    showErrorToast();
    return;
  }
  //服务器返回数据处理
  if (data.error) {
    //处理错误
    showErrorToast();
  }
}


/**
 * 错误提示
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg ? msg : "服务器异常",
    icon: "none",
    duration: 2000
  });
}



module.exports = {
  request, showErrorToast
}