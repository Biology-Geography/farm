// pages/panorama/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/overallImage/',
    panorama:[]
  },
  onLoad:function(option){
    var that = this;
    let siteId = option.siteId
    that.queryOverallsBySiteId(siteId)
  },
  queryOverallsBySiteId(siteId){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryOverallsBySiteId',
      method:'get',
      data:{
        siteId:siteId
      },
      success(res){
        console.log(res.data.overalls);
        that.setData({
          panorama:res.data.overalls
        })
      }
    })
  },
  copy(e){
    let url = e.currentTarget.dataset.url;
    wx.setClipboardData({
      data:url,
      success(res){
        wx.showToast({
          title:'复制成功！'
        })
      }
    })
  }
})