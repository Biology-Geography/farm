// pages/certification/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certification:[],
    entId:[],
    userId:[],
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/certificationImage/'
  },
  onShow(){
    var that = this;
    var userId = wx.getStorageSync('userinfo').nickName;
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
        console.log(res.data.enterprise);
        let entId = [];
        for(let i = 0;i < res.data.enterprise.length;i++){
          entId.push(res.data.enterprise[i].entId);
        }
        that.setData({
          entId:entId,
          userId:userId
        })
        console.log(that.data.entId);
        let certifications = [];
        that.getEnt(certifications);
      }
    })
  },
  getEnt(certifications){
    var that = this;
    for(let i = 0;i<that.data.entId.length;i++ ){
      wx.request({
        url: 'https://www.agribigdata.net/CloudRanch/queryCertification_entId',
        method:'get',
        data:{
          entId:that.data.entId[i]
        },
        header:{
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success:(res)=>{
          console.log(res.data.Certification)
          res.data.Certification.map((i) => {
            i.img = that.data.imgUrl + i.image;
          })
          if(res.data.Certification.length){
            for(let i = 0;i<res.data.Certification.length;i++){
                certifications.push(res.data.Certification[i]);
             }
          }
          that.setData({
            certification:certifications
          })
        }
      })
    }
  },
  gotodetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'/pages/certification-detail/index?id='+id+'&userId='+this.data.userId,
    })
  },
  addcer:function(){
    wx.navigateTo({
      url: '/pages/certification1/index',
    })
  }
})