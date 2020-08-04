// pages/vedio/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video:[]
  },
  onLoad:function(o){
    var that = this
    let siteId = o.siteId
    that.querySiteVideo(siteId);
  },
  querySiteVideo(siteId){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/querySiteVideo',
      method:'get',
      data:{
        siteId:siteId
      },
      success(res){
        console.log(res.data.siteVideo);
        that.setData({
          video:res.data.siteVideo
        })
      }
    })
  }
})