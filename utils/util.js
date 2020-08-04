const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatNumber100 = n => {
  if (n < 10) {
    return '00' + n;
  } else if (n < 100) {
    return '0' + n;
  } else {
    return n;
  }
}

const codeDate = (date) => {
  return date[2] + date[3] + date[5] + date[6] + date[8] + date[9];
}

const dateToString = (date) => {
  return date.substring(0, 4) + '年' + date.substring(5, 7) + '月' + date.substring(8, 10) + '日';
}

const showToast = (text, icon) => {
  wx.showToast({
    title: text,
    icon: icon,
    mask: true
  });
}

const geocode = (param) => {
  wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    method: 'GET',
    data: param.data || {},
    success(res) {
      param.success ? param.success(res) : console.log('请求成功！');
    },
    fail(res) {
      util.showToast('网速较慢，请稍后重试！', 'none');
    },
    complete(res) {
      if (param.complete) {
        param.complete(res);
      }
    }
  })
}

const getName = (id, type, cb) => {
  let api = require('../api/api.js');
  switch (type) {
    case 'crop':
      api.queryPlanting({
        data: {
          plantId: id,
          cropTypeId: -1,
          siteId: -1,
          placeId: -1,
          account: ''
        },
        success(res) {
          let planting = res.data.Planting;
          cb(planting[0].plantName);
        }
      });
      break;
    case 'fungus':
      api.queryPlantFungus({
        data: {
          plantFungusId: id,
          fungusTypeId: -1,
          siteId: -1,
          placeId: -1,
          account: ''
        },
        success(res) {
          console.log(res.data);
          let plantFungus = res.data.PlantFungus;
          cb(plantFungus[0].plantFungusName);
        }
      });
      break;
    case 'livestock':
      api.queryAddLiveStock({
        data: {
          placeId: -1,
          siteId: -1,
          speciesId: -1,
          id,
          userId: ''
        },
        success(res) {
          console.log(res.data);
          let addLivestockId = res.data.AddLiveStock;
          cb(addLivestockId[0].name);
        }
      });
      break;
  }
}

const getQueryStringArgs = (url) => {
  // 获取查询字符串参数，去除该字符串问号开关符号
  let qs = url.length > 0 ? url.substring(1) : "",
    args = {}, //存放所有查询字符串参数对
    items = qs.split("&"),
    len = items.length,
    name = null,
    item = [],
    value = null;
  if (qs.length == 0) {
    alert("请扫描正确的二维码！");
    return;
  };
  for (var i = 0; i < len; i++) {
    item = items[i].split("=");
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);
    args[name] = value;
  }
  return args;
}

const compressImage = (imgSrc, cb) => {
  wx.compressImage({
    src: imgSrc,
    success(res) {
      console.log(res.data);
      cb(res.data.tempFilePath);
    }
  });
}

const setLocalStorage = (arr) => {
  // arr = [
  //   ['1', '2'],
  //   ['2', '3']
  // ];
  arr.map((i) => {
    wx.setStorage({
      key: i[0],
      data: i[1],
    })
  });
}


const getLocalStorage = (arr, that, cb) => {
  // arr = ['1','2']
  arr.map((i) => {
    wx.getStorage({
      key: i,
      success(res) {
        that.setData({
          [i]: res.data //解构赋值
        });
      }
    })
  });
  if (cb !== undefined) {
    cb(that);
  }
}

module.exports = {
  showToast,
  formatTime,
  formatNumber100,
  codeDate,
  dateToString,
  geocode,
  getName,
  getQueryStringArgs,
  compressImage,
  setLocalStorage,
  getLocalStorage
}