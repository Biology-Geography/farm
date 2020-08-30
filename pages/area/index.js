// pages/area/index.js
Page({
  data: {
    Plantations:[],
    siteId:[],
    places:[],
    index:0,
  },
  onLoad: function () {
    var that = this;
    var userId = wx.getStorageSync('userinfo').nickName;
    that.queryPlantation(userId);
  },
  queryPlantation(userId){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation',
      method:'get',
      data:{
        account:userId
      },
      success(res){
        console.log(res.data);
        var Plantations = res.data.plantation;
        var siteId = Plantations.map(i =>{
          return i.siteId
        })
        Plantations = Plantations.map(i =>{
          return i.siteName
        })
        if(siteId.length !==0){
          that.queryPlaces(siteId[that.data.index]);
        }
        that.setData({
          siteId:siteId,
          Plantations:Plantations
        })
      }
    })
  },
  queryPlaces(siteid){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaces',
      method:'get',
      data:{
        placeId: -1,
        siteId:siteid,
        limit: -1,
        pageNumber: 0,
        type: ''
      },
      success(res){
        console.log(res);
        var places = res.data.places;
        that.setData({
          places:places
        })
      }
    })
  },
  bindPickerChange(e){
    var that = this;
    var index = e.detail.value;
    that.setData({
      index: index
    })
    that.queryPlaces(that.data.siteId[index])
  },
  gotoplace(e){
    var that = this;
    var placeId = e.currentTarget.dataset.placeid;
    wx.navigateTo({
      url:'/pages/place-a/index?placeId=' + placeId 
     })
  }
})