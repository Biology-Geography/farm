// pages/warehouse1/index.js
Page({
  data: {
    enterprise:[],
    userId:'',
    entId:'',
    index:0,
    localImgSrc:'',
  },
  onShow:function(){
    var that=this;
    var userId=wx.getStorageSync('userinfo').nickName;
    wx.request({
      url: 'https://www.agribigdata.net/CloudRanch/account_enterprise/queryEnterprise',
      method:'get',
      data:{
        account:userId,
        page:-1,
        limit:-1
      },
      header:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success:(res)=>{
        let arr=[];
        let enterprises=res.data.enterprise;
        for(let i=0;i<enterprises.length;i++){
          arr.push(enterprises[i].entName);
        }
        that.setData({
          enterprise:arr,
          userId:userId,
          entId:enterprises[that.data.index].entId
        })
      }
    })
  },
  formSubmit(e){
    let that = this;
    let name = e.detail.value.name.trim();
    let remark = e.detail.value.brief.trim();
    let entId = that.data.entId;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc; 
    if(name === '' || remark === ''){
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
        path:'warehouseImage',
      },
      success: function(res) {
        console.log(res);
        let image=JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addWarehouse',
          data:{
            name:name,
            remark:remark,
            entId:entId,
            userId:userId,
            image:image,
            videoUrl:''
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
  formitSuccess() {
    wx.hideLoading();
    wx.showToast({
      title: '提交成功！',
    });
    wx.navigateBack({
      delta: '-1'
    });
  },
  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    }) 
    this.onShow();   
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
  delete() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消选中的图片吗？',
      success(e) {
        if (e.confirm) {
          that.setData({
            localImgSrc: ''
          });
        }
      }
    })
  }
})