// pages/enterprise/index.js
Page({
  data: {
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/enterpriseImage/',
    enterprise:[]
  },
  onShow:function(){
    var userId=wx.getStorageSync('userinfo').nickName;
    var that=this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/account_enterprise/queryEnterprise',
      method:'get',
      data:{
        account:userId,
        page: -1,
        limit: -1
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success:(res)=>{
        console.log(res);
        let enterprises=res.data.enterprise;
        enterprises.map(i=>{
          if(i.image===''){
            i.image=that.data.imgUrl+"defaultLogo.png"
          }else{
            i.image=that.data.imgUrl+i.image;
          }
        })
        that.setData({
          enterprise:enterprises
        })
        console.log(that.data.enterprise);
      }
    })
  },
  addenterprise:function(){
    wx.navigateTo({
      url: '/pages/enterprise1/index',
    })
  },
  goToEntInfoPage:function(e){
    var that=this;
    var entId=e.currentTarget.dataset.entid;
    wx.setStorageSync('entId', entId);
    wx.navigateTo({
      url: '/pages/enterprise2/index',
    })
  }
})