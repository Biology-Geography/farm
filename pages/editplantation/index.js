// pages/editplantation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/',
    region:'',
    site:'',
    entId:'',
    siteId:'',
    images:[],
    delImgs:[],
    siteId:'',
    addImgs:[],
    show:true,
    value:''
  },
  onLoad:function(o){
    var that = this;
    var siteId = o.siteId;
    var entId = o.entId;
    that.queryPlantation(siteId);
    that.setData({
      siteId:siteId,
      entId:entId
    })
  },
  queryPlantation(siteid){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/plantation/queryPlantation',
      method:'get',
      data:{
        siteId:siteid
      },
      success: function(res) {
        console.log(res.data.site);
        let site = res.data.site;
        let region = [site.province,site.city,site.county];
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/querySiteImages',
          method:'get',
          data:{
            siteId:siteid
          },
          success:(res=>{
            console.log(res.data.siteImages);
            let imgUrl = that.data.imgUrl;
            site.image = res.data.siteImages;
            site.image = site.image.map(i =>{
              return{
                imgUrl:imgUrl + i.image,
                imgID: i.id
              }
            })
            that.setData({
              site: site,
              siteId: siteid,
              images: site.image.concat(),
              region: region,
            })
          })
        })
      }
    })
  },
  Edit(){
    var that = this;
    wx.showModal({
      title:"提示",
      content:'编辑资料？',
      success(res){
        if(res.confirm){
          that.setData({
            show:false
          })
        }
      }
    })
  },
  addImg(){
    var that = this;
    var images = that.data.images;
    wx.chooseImage({
      count: 9 - images.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        let tempFilePaths = res.tempFilePaths;
        that.data.addImgs.push(...tempFilePaths);
        tempFilePaths = tempFilePaths.map(i =>{
          return{
            imgUrl:i,
            imgID : -1
          }
        });
        images.push(...tempFilePaths);
        console.log(images);
        if(images.length === 9 ){
          wx.showToast({
            title: '最多九张！',
          })
        }
        that.setData({
          images:images
        })
      }
    })
  },
  addImage(count){
    var that = this
    var Imgs = that.data.addImgs;
    var len = Imgs.length;
    var imgUrl = Imgs[count];
    if(count === len){
      return
    }else{
      var userId = wx.getStorageSync("userinfo").nickName;
      wx.uploadFile({
        filePath: imgUrl,
        name: 'file',
        url: 'https://www.agribigdata.net/CloudRanch/uploadFile',
        formData:{
          account:userId,
          path:'siteImage',
        },
        success(res){
          let image = JSON.parse(res.data).fileName;
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/addSiteImage',
            method:'get',
            data:{
              image: image,
              siteId: that.data.siteId
            },
            success(res){
              that.addImage(++count);
            }
          })
        }
      })
    }
  },
  formSubmit(e){
    var that = this;
    wx.showModal({
      ttile: '提示',
      content:'确认修改？',
      success(res){
        if(res.confirm){
          let siteId = that.data.siteId;
          let name = e.detail.value.name.trim();
          let province = that.data.region[0];
          let city = that.data.region[1];
          let county = that.data.region[2];
          let address = e.detail.value.address.trim();
          let remarks = e.detail.value.remarks.trim();
          if(name === ''|| address === ''|| remarks === ''){
            wx.showToast({
              title: '请将内容填写完整！',
              icon:'none'
            })
            return;
          }
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/plantation/modifiyPlantation',
            method:'get',
            data:{
              siteId:siteId,
              siteName:name,
              province:province,
              city:city,
              county:county,
              location:address,
              remarks:remarks
            },
            success(res){
              wx.showToast({
                title: '修改成功！',
                icon:'none'
              });
              that.addImage(0);
              that.delImage(0);
              that.setData({
                show:true
              })
              wx.navigateBack({
                delta:1
              })
            }
          })
        }
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
deleteImage(e){
  var that = this;
  var index = e.currentTarget.dataset.index;
  var images = that.data.images;
  var addImgs = that.data.addImgs;
  var img = images[index];
  wx.showModal({
    title: '提示',
    content: '确定删除吗？',
    success(e) {
      if (e.confirm) {
        images.splice(index, 1);
        if (img.imgID === -1) {
          for (let i = 0; i < addImgs.length; i++) {
            if (img.imgUrl === addImgs[i]) {
              addImgs.splice(i, 1);//从addImgs的第i项删除，仅删除1项
            }
          }
        } else {
          that.data.delImgs.push(img.imgID);
        }
        that.setData({
          images: images,
        });
      }
    }
  })
  },
  delImage(count) {
    let that = this;
    let imgs = that.data.delImgs;
    let len = imgs.length;
    let id = imgs[count];
    if (count === len) {
      return;
    }else{
      wx.request({
        url:'https://www.agribigdata.net/CloudRanch/delSiteImage',
        method:'get',
        data: {
          id
        },
        success(res){
          that.delImage(++count);
        }
      })
    }
  },
  cancel(){
    var that = this;
    wx.showModal({
      title: '提示',
      content:'取消编辑？',
      success(res){
        if(res.confirm){
          that.setData({
            show:true
          })
        }
      }
    })
  }
})