// pages/enterprise2/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    entName:'',
    province:'',
    city:'',
    county:'',
    location:'',
    Logo:'',
    imageUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/enterpriseImage/'
  },
  onShow:function(){
    var that=this;
    var entId=wx.getStorageSync('entId');
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/enterprise/getEnterprise',
      method:'get',
      data:{
        entId:entId
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success:(res)=>{
        console.log(res.data);
        var media=res.data.enterprise;
        that.setData({
          entName:media.entName,
          province:media.province,
          city:media.city,
          county:media.county,
          location:media.location,
          Logo:that.data.imageUrl+media.image
        })
      }
    })
  }
})