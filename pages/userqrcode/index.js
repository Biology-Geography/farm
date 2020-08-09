
Page({
  data: {
    userimage:'',
    user:'',
    qrCodeImageUrl: '',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/userImage/'
  },
  onLoad(o) {
    let that = this;
    let account = o.username;
    let userImage = o.userimage;
    that.setData({
        userimage:userImage
    })
    that.createAccountQR(account);
    that.queryAccountData(account);
  },
  queryAccountData(account){
    let that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/getAccountData',
      method:'get',
      data:{
        account
      },
      success:(res)=>{
        let user = res.data.accountInfo;
        that.setData({
          user
        })
      }
    })
  },
  createAccountQR(account) {
    let that = this;
    wx.request({
        url:'https://www.agribigdata.net/CloudRanch/createAccountQR',
        method:'get',
        data: {
           account
        },
      success(res) {
        console.log(res.data);
        let state = res.data;
        if (state.flag) {
          that.setData({
            qrCodeImageUrl: state.url
          });
        } else {
          wx.showToast({
            title: '请求失败',
            icon:'none'
          })
        }
      }
    });
  }
})