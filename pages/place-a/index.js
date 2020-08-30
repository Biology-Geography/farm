// pages/place-a/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew:false,
    place:{},
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/placeImage/',
    Images:[],
    addImgs:[],
    delImgs:[],
    show:true
  },
  onLoad: function (options) {
    var that = this;
    var placeId = options.placeId;
    that.queryplaceImage(placeId);
    that.queryplaceInfo(placeId);
    that.setData({
      placeId
    })
  },
  queryplaceInfo(placeId){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaceInfo',
      method:'get',
      data:{
        placeId,
        userId: ''
      },
      success:(res=>{
        console.log(res);
        if(res.data.placeInfos.length === 0){
          that.queryPlaces(placeId);
        }else{
          var place = res.data.placeInfos[0];
          that.setData({
            place,
          })
        }
      })
    })
  },
  queryPlaces(placeId) {
    let that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaces',
      method:'get',
      data: {
        placeId,
        siteId: -1,
        limit: -1,
        pageNumber: 0,
        type: ''
      },
      success(res) {
        console.log(res.data);
        let p = res.data.places[0];
        let place = that.data.place;
        place.name = p.placeName;
        place.remark = '暂无简介！';
        that.setData({
          place,
          isNew:true
        });
      }
    });
  },
  queryplaceImage(placeId){
    var that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaceImage',
      method:'get',
      data:{
        placeId,
      },
      success:(res=>{
        console.log(res.data);
        var Images = res.data.placeImages;
        var imgUrl = that.data.imgUrl;
        Images = Images.map(i=>{
          return{
            imgUrl:imgUrl + i.imgUrl,
            imgID:i.imgId
          }
        });
        that.setData({
          Images
        })
      })
    })
  },
  Edit(){
    var that = this;
    wx.showModal({
      title: '提示',
      content:'确定编辑？',
      success(res){
        if(res.confirm){
          that.setData({
            show:false
          })
        }
      }
    })
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
          path:'placeImage',
        },
        success(res){
          let image = JSON.parse(res.data).fileName;
          wx.request({
            url:'https://www.agribigdata.net/CloudRanch/addPlaceImage',
            method:'get',
            data:{
              imgUrl: image,
              placeId: that.data.placeId
            },
            success(res){
              that.addImage(++count);
            }
          })
        }
      })
    }
  },
  addImg(){
    var that = this;
    var images = that.data.Images;
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
          Images:images
        })
      },
    })
  },
  deleteImage(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.Images;
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
            Images: images,
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
        url:'https://www.agribigdata.net/CloudRanch/delPlaceImage',
        method:'get',
        data: {
          imgId:id
        },
        success(res){
          that.delImage(++count);
        }
      })
    }
  },
  formSubmit(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content:'确定修改？',
      success(res){
        if(res.confirm){
          var placeId = that.data.placeId;
          var name = e.detail.value.name.trim();
          var remark = e.detail.value.remark.trim();
          if(name === ''|| remark === ''){
            wx.showToast({
              title: '请将内容填写完整！',
              icon:'none'
            })
            return;
          }
          that.updatePlace(placeId,name,'');
          if(that.data.isNew){
            that.addPlaceInfo(placeId,name,remark);
          }else{
            that.updatePlaceinfo(placeId,name,remark);
          }
          that.final();
        }
      }
    })
  },
  final(){
    var that = this;
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
  },
  updatePlace(Id,name,produce){
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/updatePlace',
      method:'get',
      data:{
        placeId:Id,
        placeName:name,
        produce:produce
      },
    })
  },
  addPlaceInfo(id,name,remark){
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/addPlaceInfo',
      method:'get',
      data:{
        placeId:id,
        name,
        produce: '',
        good: 1,
        remark,
        isClaimed: ''
      }
    })
  },
  updatePlaceinfo(id,name,remark){
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/modifyPlaceInfo',
      method:'get',
      data:{
        placeId:id,
        name,
        produce: '',
        good: 1,
        remark,
        isClaimed: ''
      }
    })
  }
})