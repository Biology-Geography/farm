// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const util = require('../../utils/util.js');
var qqmapsdk;
Page({
    Data:{  
        markers:[],
        mapShow:false,
    },

    onLoad: function () {
      let that=this;
          wx.request({
            url:"https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation",
            method:"get",
            data:{
              account:'12345678'
            },
            header:{
              'content-type':'application/json'
            },
            success(res){
              let plantation=res.data.plantation;
              let markers=plantation.map((i)=>{
                return {
                  iconPath:"/image/dingwei.png",
                  id:i.siteId,
                  latitude:i.lat,
                  longitude:i.lng,
                  width:20,
                  height:20,
                  callout:{
                    content:`${i.county}-${i.siteName}`,
                    fontSize:17,
                    color:'#0D2F8A',
                    borderRadius:8,
                    bgColor:'#fff',
                    padding:10,
                    display:'BYCLICK'
                  }
                }
              });
              that.setData({
                markers:markers
              })
            }
          })
    },
    btnGo:function(e){
      var res=e.detail.markerId;
      wx.request({
        url:"https://www.agribigdata.net/CloudRanch/plantation/queryPlantation",
        method:"get",
        data:{
            siteId:res,
        },
        header:{
            'content-type':'application/json'
        },
        success(res){
          wx.setStorageSync('siteId', res);
            wx.navigateTo({
                url:"/pages/info-plantation/index",
            })
        }
    })
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/queryPlaces",
      method:"get",
      data:{
          "placeId":-1,
          "siteId":res,
          "limit":-1,
          "pageNumber":0,
          "type":""
      },
      header:{
          'content-type':'application/json'
      },
      success(res){
          wx.setStorageSync('places', res)
      }
  })
  },
  scan(){
    wx.scanCode({
      success(res){
        wx.scanCode({
          success(res) {
            console.log(2222, res);
            let data = res.result;
            let url = data.substring(data.lastIndexOf('?'), data.length);
            let json = util.getQueryStringArgs(url);
            console.log(json);
            wx.navigateTo({
              url: `/pages/suyuan-detail/suyuan-detail?id=${json.id}`,
            })
          }
        })
      }
    })
  }
})