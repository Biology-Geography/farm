// pages/plantatiton/index.js
Page({
  data: {
    sites:[],
    enterprises:[],
    imgUrl:"https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/"
  },
  onShow:function(){
    var that = this;
    var userId = wx.getStorageSync('userinfo').nickName;
    that.queryPlantation(userId);
  },
  queryPlantation(userId){
    var that = this;
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
         sites.map(i => {
           if( i.image === 'no'){
             i.image = that.data.imgUrl + 'noImage.png';
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
  gotoEdit(e){
    var siteId = e.currentTarget.dataset.siteid;
    var entId = e.currentTarget.dataset.entdid;
    wx.navigateTo({
      url: '/pages/editplantation/index?siteId=' + siteId + "&entId=" + entId,
    })
  }
})