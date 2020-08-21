// pages/mypage/index.js
Page({
    data:{
        userinfo:{},
        account:""
        },
    onShow:function(){
            const userinfo = wx.getStorageSync("userinfo")
            //console.log(userinformation);
            this.setData({
              userinfo:userinfo 
            });
    },
    ToEnterprise:function(){
        wx.navigateTo({
          url: '/pages/enterprise/index',
        })
    },
    ToPlantatiton:function(){
        wx.navigateTo({
          url: '/pages/plantatiton/index',
        })
    },
    ToArea:function(){
        wx.navigateTo({
          url: '/pages/area/index',
        })
    },
    ToCrop:function(){
        wx.navigateTo({
          url: '/pages/crop/index',
        })
    },
    ToMushroom:function(){
        wx.navigateTo({
          url: '/pages/mushroom/index',
        })
    },
    ToCow:function(){
        wx.navigateTo({
          url: '/pages/cow/index',
        })
    },
    ToGoods:function(){
        wx.navigateTo({
          url: '/pages/goods/index',
        })
    },
    ToWarehouse:function(){
        wx.navigateTo({
          url: '/pages/warehouse/index',
        })
    },
    ToCertification:function(){
        wx.navigateTo({
          url: '/pages/certification/index',
        })
    },
    ToGet:function(){
        wx.navigateTo({
          url: '/pages/get/index',
        })
    },
    ToScan:function(){
      wx.scanCode({
        success(res) {
          console.log(res);
          let data = res.result;
          let url = data.substring(data.lastIndexOf('?'), data.length);
          let json = util.getQueryStringArgs(url);
          console.log(json);
          wx.navigateTo({
            url: `/pages/suyuan-detail/suyuan-detail?id=${json.id}&type=${json.type}`,
          })
        }
      })
    },
    logout:function(){
        wx.navigateTo({
          url: '/pages/logout/index',
        })
    },
    gotologin:function(){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    },
    changeimage(){
      wx.navigateTo({
        url: '/pages/edit/index',
      })
    }
})

