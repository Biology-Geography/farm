// pages/search-item/index.js
Page({
  data: {
    keyword:'',
    Allplantation:[],
    Someplantation:[],
    Length:0,
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/',
    localimage:"/image/moshi-B.png",
  },
  onLoad:function(option){
    var that = this
    var keyword = option.keyword;
    that.setData({
      keyword:keyword
    })
    that.getAllSites(keyword);
  },
  getAllSites(key){
    var that = this
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/searchSites',
      method:'get',
      data:{
        keys:''
      },
      success:(res)=>{
        console.log(res.data.sites);
        res.data.sites.map(i=>{
          if(i.image){
            i.image = that.data.imgUrl + i.image;
          }else{
            i.image = that.data.imgUrl + 'noImage.png'
          }
        });
        that.setData({
          Allplantation:res.data.sites,
          Length:res.data.sites.length
        })
        if(key){
          that.querySomeplantation(key,that.data.Allplantation);
        }
      }
    })
  },
  querySomeplantation(key,p){
    var that = this;
    var arr = [];
    for(let i = 0;i < p.length; i++){
      var sentence = p[i].city + p[i].county + p[i].entName + p[i].location + p[i].siteName;
      if(sentence.indexOf(key) >= 0){
        arr.push(p[i])
      }
    } 
    that.setData({
      Someplantation:arr,
      Length:arr.length
    })
    console.log(that.data.Someplantation);
  },
  gotoInfoplantation(e){
    var that = this
    var id = e.currentTarget.dataset.id;
    that.getSite(id)
    that.getPlace(id)
  },
  getSite(id){
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/plantation/queryPlantation",
      method:"get",
      data:{
          "siteId":id,
      },
      success(res){
          wx.setStorageSync('siteId', res);
          wx.navigateTo({
              url:"/pages/info-plantation/index",
          })
      }
  })
  },
  getPlace(id){
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/queryPlaces",
      method:"get",
      data:{
          "placeId":-1,
          "siteId":id,
          "limit":-1,
          "pageNumber":0,
          "type":""
      },
      success(res){
          wx.setStorageSync('places', res);
      }
   })
  }
})