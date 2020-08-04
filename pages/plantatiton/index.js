// pages/plantatiton/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sites:[],
    enterprises:[],
    imgUrl:"https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/"
  },
  onLoad(){
    var that = this;
    var userId = wx.getStorageSync('userinfo').nickName;
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation",
      method:"get",
      data:{
         account:userId
       },
       success:(res)=>{
         console.log(res.data);
         let sites = res.data.plantation;
         let enterprise = res.data.enterprise;
         site.map(i => {
           if( i.image === 'no'){
             i.image = imgUrl + 'noImage.png';
           }else{
             i.image = that.data.imgUrl + i.image;
           }
         });
         that.setData({
           sites:sites,
           enterprises:enterprise
         });
       }
    });
  },

})