const HOST= "http://gank.io/api/";
var URL={
  hot: "history/content/1/1",
  history:"history/content/20/",
  category:"data/",
  day:"day/",
  time:'day/history',
}

const DEBUG_MODE=true;        //DEBUG模式
const NET_REPEAT_COUNT = 2;   //重试次数


module.exports={
  HOST,URL, DEBUG_MODE, NET_REPEAT_COUNT
}