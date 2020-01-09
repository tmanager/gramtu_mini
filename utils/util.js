const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const sendMessageEdit = (type, data) =>{
  var head, request;
  head = msgHeadMake(type);
  switch (type) {
    default:
      request = data;
      break;
  }
  request = {
    "request": request
  };
  Object.assign(request, request, head);
  var oJson = request;
  console.info(oJson);
  return JSON.stringify(oJson);
}

function msgHeadMake(type) {
  return {
    "timestamp": getTimeStamp(),
    "token": "",
    "userid": "",
    "termid": ""
  };
}

function getTimeStamp() {
  var now = new Date(),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return y.toString() + (m < 10 ? "0" + m : m) + (d < 10 ? "0" + d : d) + now.toTimeString().substr(0, 8).replace(/:/g, "");
}

const formatDateTime = datetime => {
  if (datetime.length < 14) return datetime;
  return datetime.substr(0, 4) + "/" + datetime.substr(4, 2) + "/" +
    datetime.substr(6, 2) + " " + datetime.substr(8, 2) + ":" +
    datetime.substr(10, 2) + ":" + datetime.substr(12, 2);
}

const formatDate = date => {
  if (date.length < 8) return date;
  return date.substr(0, 4) + "/" + date.substr(4, 2) + "/" +
    date.substr(6, 2);
}

const phoneCheck = phone => {
  var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
  if (phone == "" || phone == undefined) {
    return false;
  }
  if (!reg.test(phone)) {
    return false;
  }
  return true;
}
module.exports = {
  formatTime: formatTime,
  sendMessageEdit: sendMessageEdit,
  formatDateTime: formatDateTime,
  formatDate: formatDate,
  phoneCheck: phoneCheck
}
