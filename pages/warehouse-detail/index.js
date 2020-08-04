Page({
  data: {
    id:'',
    name:'',
    remark:'',
    type:'',
    img:'',
    userId:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/warehouseImage/'
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var id = options.id;
    var type = options.type;
    var userId=options.userId
    that.setData({
      id:id,
      userId:userId
    })
  },
  onShow:function(){
    var that=this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryWarehouse',
      method:'get',
      data:{
        id:that.data.id,
        userId:''
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success:(res)=>{
        console.log(res.data);
        let warehouse = res.data.Warehouse[0];
        that.setData({
          name:warehouse.name,
          remark:warehouse.remark,
          img:that.data.imgUrl+warehouse.image
        })
      }
    })
  },
  delete(){
    var that=this;
    wx.showModal({
      title: '提示',
      content:"确定要删除吗？",
      success:(res)=>{
        if(res.confirm){
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/delWarehouse',
            method:'get',
            data:{
              id:'0'+that.data.id
            },
            header:{
              'Content-Type': 'application/json;charset=UTF-8'
            },
            success(res){
              wx.showToast({
                title: '删除成功',
              }),
              wx.navigateBack({
                delta:-1,
              })
            }
          })
        }
      }
    })
  }
})