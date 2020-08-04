// pages/certification-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    userId:'',
    certificationName:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/certificationImage/',
    img:''
  },
  onLoad(option){
    let id = option.id;
    let userId = option.userId;
    let that = this;
    that.setData({
      id:id,
      userId:userId
    })
  },
  onShow(){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryCertification',
      method:'get',
      data:{
        certificationId:that.data.id,
        objId:'',
        category:'',
        account:'' 
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success:(res)=>{
        console.log(res.data.Certification[0]);
        that.setData({
          certificationName:res.data.Certification[0].certificationName,
          img:that.data.imgUrl + res.data.Certification[0].image
        })
      }
    })
  },
  delete(){
    var that = this
    wx.showModal({
      title: '提示',
      content:'确定要删除吗？',
      success:(res)=>{
        if(res.confirm){
          wx.request({
            url: 'https://www.agribigdata.net/CloudRanch/delCertification',
            data: {
              certificationId:that.data.id
            },
            method: 'GET',
            success: function(res){
              wx.navigateBack({
                delta: 1
              })
            },
          })
        }
      }
    })
  }
})