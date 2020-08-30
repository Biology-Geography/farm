// pages/info-plantation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth:wx.getSystemInfoSync().windowWidth,
    imgUrls: [],
    sitename:'',
    siteId:'',
    entId:'',
    sitecounty:'',
    sitelocation:'',
    siteprovince:'',
    sitesquare:'',
    sitecity:'',
    siteremarks:'',
    currentIndex:0,
    places:[],
    placesId:[],
    imageUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/placeImage/'
  },
  onShow:function(){
    var that=this;
    var re = wx.getStorageSync('siteId');
    var places = wx.getStorageSync('places');
    let placesId = [];
    for(let i = 0;i < places.data.places.length;i++){
      placesId[i] = places.data.places[i].placeId; 
    }
    that.setData({
      siteId:re.data.site.siteId,
      sitename:re.data.site.siteName,
      sitecounty:re.data.site.county,
      sitelocation:re.data.site.location,
      sitecity:re.data.site.city,
      sitesquare:re.data.site.square,
      siteprovince:re.data.site.province,
      siteremarks:re.data.site.remarks,
      places:places.data.places,
      entId:re.data.site.entId,
      placesId:placesId
    })
    that.queryplaceImage(0,places);
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/querySiteImages',
      method:'get',
      data:{
        siteId:re.data.site.siteId
      },
      header:{
        'Content-Type': 'application/json'
      },
      success(res){
        console.log(res);
        var Url="https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/"
        let images = res.data.siteImages;
        if (images.length === 0) {
          images = [Url + 'noImage.png'];
        } else {
          images = images.map((i) => {
            return Url + i.image
          });
        }
        that.setData({
          imgUrls:images
        })
      }
    })
    console.log(that.data.places)
  },
  queryplaceImage(count,places){
    var that = this;
    if(count === places.data.places.length){
      that.setData({
        places:places.data.places
      })
      return;
    }
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaceImage',
      method:'get',
      data:{
        placeId:places.data.places[count].placeId
      },
      success:(res)=>{
        console.log(res.data.placeImages)
        let pimgs = res.data.placeImages;
        if(pimgs.length > 0){
          places.data.places[count].image = pimgs[0].imgUrl;
        }else{
          places.data.places[count].image = 'noImage.png';
        }
        that.queryplaceImage(++count,places);
      }
    })

  },
  click:function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: Number.parseInt(index)
    });
  },
  change:function(e){
    this.setData({
      currentIndex: e.detail.current
    });
  },
  goToPlacePage:function(e){
    var placeId = e.currentTarget.dataset.id;
    console.log(placeId)
    wx.navigateTo({
      url: '/pages/place/index?placeId='+placeId+'&siteId='+this.data.siteId+'&entId='+this.data.entId,
    })
  },
  gotositemap(){
    var that = this
    let siteId = that.data.siteId
    let placesId = that.data.placesId
    wx.navigateTo({
      url: '/pages/sitemap/index?siteId='+siteId+'&placesId='+placesId,
    })
  },
  gotoall(){
    var that = this
    let siteId = that.data.siteId
    wx.navigateTo({
      url: '/pages/panorama/index?siteId='+siteId,
    })
  },
  gotovedio(){
    var that = this
    let siteId = that.data.siteId
    wx.navigateTo({
      url: '/pages/vedio/index?siteId='+siteId,
    })
  }
})