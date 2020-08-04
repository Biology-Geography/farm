// pages/goods-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name:'',
    remark:'',
    type:'',
    img:'',
    userId:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/goodImage/'
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
      url:'https://www.agribigdata.net/CloudRanch/queryGood',
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
        let good = res.data.good[0];
        that.setData({
          name:good.name,
          remark:good.remark,
          img:that.data.imgUrl+good.img
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
            url:'https://www.agribigdata.net/CloudRanch/delGood',
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