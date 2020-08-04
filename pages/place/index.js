// pages/place/index.js
Page({
  data: {
    placeName:'',
    remark:'',
    plantproduce:'',
    imageUrl:'',
    msg:'',
    sensors: [],
    account:'',
    placeId:'',
    entId:'',
    isClaimed:false,
    isMe:false,
    siteId:'',
    current:0
  },
  onLoad:function(o){
    var that=this;
    var account=wx.getStorageSync('userinfo').nickName;
    var entId = o.entId;
    var siteId= o.siteId;
    var placeId = o.placeId;
    that.querySensorData(placeId);
    that.setData({
     account:account,
     entId:entId,
     siteId:siteId,
     placeId:placeId
    })
  },
  onShow:function(){
    var that=this;
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/queryPlaceInfo",
      method:'GET',
      data:{
        placeId:that.data.placeId,
        userId:''
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success(res) {
        console.log(res);
        that.setData({
          placeName:res.data.placeInfos[0].name,
          remark:res.data.placeInfos[0].remark,
          plantproduce:res.data.placeInfos[0].produce,
        })
      },
    })
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/queryPlaceImage",
      method:'get',
      data:{
        placeId:that.data.placeId
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success(res){
        console.log(res);
        var imgUrl = res.data.placeImages[0].imgUrl;
        if(imgUrl){
          that.setData({
            imageUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/placeImage/'+imgUrl
          })
        }
      }
    })
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/placeIsClaim',
      method:'get',
      data:{
        placeId:that.data.placeId,
        account:that.data.account
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success(res){
        console.log(res);
        let msg = res.data.msg;
        let isMe = that.data.isMe
        let type = res.data.type;
        if(msg==="error"){
          var isClaimed = false
        }else{
          var isClaimed = true
          if(type === 1){
            isMe = true
          }
        }
        that.setData({
          msg:msg,
          isClaimed:isClaimed,
          isMe
        })
      },
    })
  },
  slide(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    });
  },
  change(e) {
    this.setData({
      current: e.detail.current
    });
    this.animation(e.detail.current * 50 + '%');
  },
  animation(index) {
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    animation.left(index).step();
    this.setData({
      animation: animation.export()
    });
  },
  claim:function(){
    var that=this;
    wx.showModal({
      title:'提示',
      content:'确定认领该地块吗？',
      success(res){
        if(res.confirm){
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/claimMsg/addClaimMsg',
            method:'get',
            data: {
              account: res.data,
              placeId:that.data.placeId,
              siteId:that.data.siteId,
              entId:that.data.entId,
              account: that.data.account
            },
            header:{
              'Content-Type': 'application/json;charset=UTF-8'
            },
            success(res){
              console.log(res)
              wx.showToast({
                title: '认领成功！',
                icon:'none'
              });
            }
          })
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/modifyPlaceInfo',
            method:'get',
            data:{
              placeId:that.data.placeId,
              name: '',
              remark: '',
              produce: '',
              good: -1,
              isClaimed:that.data.account,
            },
            header:{
              'Content-Type': 'application/json;charset=UTF-8'
            },
            success(res){
              console.log(res.data);
            }
          })
        }
      }
    })
  },
  querySensorData(placeId){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/querySensorData',
      method:'get',
      data:{
        placeIds:placeId
      },
      successs(res){
        console.log(res.data);
        let newValue = res.data;
        let dataArr = []
        for (const key in newValue) {
          switch (key) {
            case 'par': {
              dataArr.push({
                data: newValue[key].intensity,
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_rayradiation.png',
                title: '光照辐射'
              })
              break
            }
            case 'rainFall': {
              dataArr.push({
                data: newValue[key].rainFall,
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_jiangyu.png',
                title: '降雨量'
              })
              break
            }
            case 'radiation': {
              dataArr.push({
                data: newValue[key].intensity,
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_rayintensity.png',
                title: '光照强度'
              })
              break
            }
            case 'dew': {
              dataArr.push({
                data: newValue[key].temp + '℃',
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_dewtemp.png',
                title: '露水温度'
              })
              break
            }
            case 'soil': {
              dataArr.push({
                data: newValue[key].temp + '℃',
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_soiltemp.png',
                title: '土壤温度'
              })
              dataArr.push({
                data: newValue[key].hum + '%',
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_soilhumidity.png',
                title: '土壤湿度'
              })
              break
            }
            case 'air': {
              dataArr.push({
                data: newValue[key].temp + '℃',
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_airtemp.png',
                title: '空气温度'
              })
              dataArr.push({
                data: newValue[key].hum + '%',
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_airhumidity.png',
                title: '空气湿度'
              })
              break
            }
            case 'wind': {
              dataArr.push({
                data: newValue[key].speed,
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_windspeed.png',
                title: '风速'
              })
              dataArr.push({
                data: newValue[key].direction,
                tip: newValue[key].alarmType,
                icon: '/imgs/icon_winddirection.png',
                title: '风向'
              })
              break
            }
          }
        }
        that.setData({
          sensors: dataArr
        });
      }
    })
  }
})