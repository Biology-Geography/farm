// pages/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    userimageUrl:'',
    userId:''
  },
  onShow(){
    var that = this;
    let userinfo = wx.getStorageSync('userinfo');
    that.setData({
      username: userinfo.nickName,
      userimageUrl: userinfo.userimage,
      userId:userinfo._id
    })
  },
  changeimage(){
    var that = this ;
    const db = wx.cloud.database();
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        const tempFilePaths = res.tempFilePaths[0];
        const name =  Math.random() * 1000000;
        const cloudPath = name + tempFilePaths.match(/\.[^.]+?$/)[0] 
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePaths
        }).then(res => {
          console.log(res.fileID);
          let fileId = res.fileID;
          db.collection("user-info").doc(that.data.userId).update({
            data:{
              userimage:fileId
            },
            success(res){
              db.collection('user-info').where({
                nickName:that.data.username
              }).get({
                success:res=>{
                  wx.setStorageSync('userinfo', res.data[0])
                  that.onShow();
                }
              })
            }
          })
        })
      },
    })
  },
  goToUserQRCodePage(){
    wx.navigateTo({
      url:'/pages/userqrcode/index?username='+this.data.username + '&userimage='+ this.data.userimageUrl
    })
  }
})