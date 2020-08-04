// pages/logout/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
logout:function(){
  if(wx.getStorageSync("userinformation")){
     wx.clearStorageSync("userinformation")
  }else{
    wx.clearStorageSync("userinfo")
  }
  wx.navigateBack({
    delta:1
  })
}
})