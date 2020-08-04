// pages/goods/index.js
Page({
  data: {
    goods:[],
    userId:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/goodImage/'
  },
  onShow:function(){
    var that=this;
    var userId=wx.getStorageSync('userinfo').nickName;
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
        let enterprises = res.data.enterprise;
        var arr=[];
        for(let i=0;i<enterprises.length;i++){
          arr.push(enterprises[i].entId);
        }
        let goods=[];
        for(let i=0;i<arr.length;i++){
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/queryGood_entId',
            method:'get',
            data:{
              entId:arr[i]
            },
            header:{
              'Content-Type': 'application/json;charset=UTF-8'
            },
            success:(res)=>{
              console.log(res);
              if(res.data.good.length){
                for(let i=0;i < res.data.good.length;i++){
                    goods.push(res.data.good[i]);
                }
              }
              that.setData({
                goods:goods,
                userId:userId
              })
            }
          })
        }
      }
    })
  },
  addgoods:function(){
    wx.navigateTo({
      url: '/pages/add-goods/index'
    })
  },
  gotodetail:function(e){
    var id=e.currentTarget.dataset.id;
    var type=e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/goods-detail/index?id='+id+'&type='+type+'&userId='+this.data.userId,
    })
  }
})