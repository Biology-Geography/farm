// pages/warehouse/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warehouses:[],
    userId:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/warehouseImage/'
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
        let warehouses=[];
        for(let i=0;i<arr.length;i++){
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/queryWarehouse_entId',
            method:'get',
            data:{
              entId:arr[i]
            },
            header:{
              'Content-Type': 'application/json;charset=UTF-8'
            },
            success:(res)=>{
              console.log(res);
              if(res.data.Warehouse.length){
                for(let i=0;i < res.data.Warehouse.length;i++){
                    warehouses.push(res.data.Warehouse[i]);
                }
              }
              that.setData({
                warehouses:warehouses,
                userId:userId
              })
              console.log(that.data.warehouses);
            }
          })
        }
      }
    })
  },
addwarehouses:function(){
  wx.navigateTo({
    url: '/pages/warehouse1/index',
  })
},
gotodetail:function(e){
  let id=e.currentTarget.dataset.id;
  let type=e.currentTarget.dataset.type;
  wx.navigateTo({
    url: '/pages/warehouse-detail/index?id='+id+'&type='+type+'&userId='+this.data.userId,
  })
}
})