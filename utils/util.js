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

module.exports = {
  formatTime: formatTime,
  sendMessageEdit: sendMessageEdit
}
