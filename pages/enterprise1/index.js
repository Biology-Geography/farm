const util = require("../../utils/util");

// pages/enterprise1/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImgSrc:'',
    region:['安徽省','合肥市','蜀山区'],
    userId:''
  },
  onLoad:function(){
    var that=this;
    if(wx.getStorageSync("userinfo")){
      var Id=wx.getStorageSync('userinfo');
        that.setData({
        userId:Id.nickName
      })
    }
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e){
    let that = this;
    let entName=e.detail.value.name.trim();
    let province=that.data.region[0];
    let city=that.data.region[1];
    let county=that.data.region[2];
    let location=e.detail.value.location.trim();
    let userId=that.data.userId;
    let imgUrl=that.data.localImgSrc;
    if(entName === '' || location === ''){
      wx.showToast({
        title: '请将信息填写完整',
        icon:"none",
      })
      return;
    }
    if(imgUrl===''){
      wx.showToast({
        title: '请提交图片！',
        icon:'none'
      })
      return;
    }
    wx.showLoading({
      title:"提交中……",
    });
    wx.uploadFile({
      filePath: imgUrl,
      name: 'file',
      url: 'https://www.agribigdata.net/CloudRanch/uploadFile',
      formData:{
        account:userId,
        path:'enterpriseImage',
      },
      success: function(res) {
        console.log(res);
        let image=JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/enterprise/addEnterprise',
          data:{
            entName:entName,
            province:province,
            city:city,
            county:county,
            location:location,
            image:image,
            account: userId
          },
          success(res){
            console.log(res.data);
            if(res.data.flag===true){
              that.formitSuccess();
            }
          }
        })
      },
      fail:function(res){
        console.log(res);
        wx.showToast({
          title: '网速较慢，稍后重试！',
          icon:'none'
        })
      }
    })
  },
  delete(){
    var that=this;
    wx.showModal({
      title:"提示",
      content:"确定要删除吗",
      success:function(sm){
        if(sm.confirm){
          that.setData({
            localImgSrc:''
          })
        }
      }
    })
  },
  pickimg(e) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          localImgSrc: res.tempFilePaths[0]
        });
      }
    })
  },

   formitSuccess(){
     wx.hideLoading();
     wx.showToast({
       title:'提交成功！',
     });
     wx.navigateBack({
       delta:-1
     })
   },
})