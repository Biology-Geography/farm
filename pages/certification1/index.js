Page({
  data: {
    categoryArr:['商品','土壤'],
    categoryTypeArr:['good','soil'],
    objectArr:[],
    enterprise:[],
    objId:[],
    entId:[],
    localImgSrc:'',
    cindex:0,
    gindex:0,
    eindex:0,
    userId:''
  },
  onShow:function(){
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
        console.log(res.data);
        var enterprises = res.data.enterprise;
        var entIdArr = [];
        var entArr = [];
        for(let i = 0;i < enterprises.length ; i++){
          entIdArr.push(enterprises[i].entId);
          entArr.push(enterprises[i].entName);
        }
        that.setData({
          entId:entIdArr,
          enterprise:entArr,
          userId:userId
        })
        that.Get();
      },
      })
  },
  Get:function(){
    var that = this;
    if(that.data.categoryArr[that.data.cindex]==="商品"){
      wx.request({
        url:'https://www.agribigdata.net/CloudRanch/queryGood_entId',
        method:'get',
        data:{
          entId:that.data.entId[that.data.eindex]
        },
        header:{
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success:(res)=>{
          console.log(res);
          var goods = [];
          var objId = [];
          if(res.data.good.length){
            for(let i = 0 ;i < res.data.good.length;i++){
                goods.push(res.data.good[i].name);
                objId.push(res.data.good[i].id);
            }
            that.setData({
              objectArr:goods,
              objId:objId
            })
          }else{
            that.setData({
              objectArr:['暂无商品！']
            })
          }
        }
      })
    }else{
      that.setData({
        objectArr:['请选择地块！']
      })
    }
  },
  bindPickerChange1:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cindex: e.detail.value
    })
    this.Get();
  },
  bindPickerChange2:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gindex: e.detail.value
    })
  },
  bindPickerChange3:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      eindex: e.detail.value
    })
    this.Get();
  },
  formSubmit(e){
    let that = this;
    let category = that.data.categoryTypeArr[that.data.cindex];
    let objId = that.data.objId[that.data.gindex];
    let obj = that.data.objectArr[that.data.gindex];
    let name = e.detail.value.name.trim();
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if(name ===''){
      wx.showToast({
        title:"将信息填写完整！",
        icon:'none'
      })
      return
    }
    if(obj === '暂无商品！'|| obj === '请选择地块！'){
      wx.showToast({
        title:'请先添加商品或地块！',
        icon:'none'
      })
      return 
    }
    if( imgUrl === ''){
      wx.showToast({
        title:'请先选择图片！',
        icon:'none'
      })
      return
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
        path:'certificationImage'
      },
      success:(res)=>{
        console.log(res);
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:"https://www.agribigdata.net/CloudRanch/addCertification",
          method:'get',
          data:{
            certificationName:name,
            objId:objId,
            category:category,
            image:image,
            entId:that.data.entId[that.data.eindex],
            account: userId
          },
          header:{
            'Content-Type': 'application/json;charset=UTF-8'
          },
          sucsess:(res)=>{
            console.log(res.data);
            if(res.data.flag === true){
               that.formsuccess();
            }
          }
        })
      }
    })
  },
  formsuccess(){
    wx.hideLoading();
    wx.showToast({
      title: '提交成功！',
    });
    wx.navigateBack({
      delta: '-1'
    });
  },
  delete(){
    var that=this;
    wx.showModal({
      title:"提示",
      content:'确定要删除吗？',
      success:function(res){
        if(res.confirm){
          that.setData({
            localImgSrc:''
          })
        }
      }
    })
  },
  pickimg(){
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        that.setData({
          localImgSrc: res.tempFilePaths[0]
        });
      },
    })
  }
})