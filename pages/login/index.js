//初始化数据库
const db = wx.cloud.database();
const accountcollection = db.collection("user-info");
let account = null;
let password = null;
Page({
     Data:{

      }, 
      inputname:function(event){
        account=event.detail.value;
      },
      inputpsd:function(event){
        password=event.detail.value;
      },
      handlelogin:function(e){
        accountcollection.get({
          success:(res)=>{
            let user=res.data;
            for(let i = 0;i < user.length;++i){
              if(account == user[i].nickName){
                if(password!= user[i].userpsd){
                  wx.showToast({
                    title: '密码错误！',
                    duration:2500
                  })
                }else{
                  wx.showToast({
                    title: '登录成功！',
                    duration:2500
                  })
                  wx.setStorageSync("userinfo",user[i]);
                  wx.switchTab({
                    url:"/pages/mypage/index",
                  })
                }
              }
            }
          }
        })
      },
      gotoregister(){
        wx.navigateTo({
          url: '/pages/register/index',
        })
      },
    handleGetUserInfo(e){
    //console.log(e);
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta:1
    });
  }
})