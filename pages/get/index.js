// pages/get/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/placeImage/',
    userId:'',
    places:[]
  },
  onLoad(){
    var that = this;
    let userId = wx.getStorageSync('userinfo').nickName;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/userGetClaim',
      method:'get',
      data:{
        account:userId
      },
      success:(res)=>{
        console.log(res.data);
        let enterprises = res.data.enterprises;
        let places = res.data.places;
        let plantations = res.data.plantations;
        let dataArray = [];
        for(let i = 0;i < places.length;i++){
          dataArray.push({
            entName: enterprises[i].entName,
            entId: enterprises[i].entId,
            siteName: plantations[i].siteName,
            siteId: plantations[i].siteId,
            placeName: places[i].placeName,
            placeId: places[i].placeId
          })
        };
        that.setData({
          places:dataArray
        })
      }
    })
  },
  gotodetail(e){
    let placeId = e.currentTarget.dataset.placeid;
    let siteId = e.currentTarget.dataset.siteid;
    let entId = e.currentTarget.dataset.entid;
    wx.navigateTo({
      url:'/pages/place/index?placeId=' + placeId+ '&siteId=' + siteId + '&entId=' + entId,
    })
  }
})