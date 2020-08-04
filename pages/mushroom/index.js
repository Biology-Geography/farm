// pages/mushroom/index.js
Page({
  data: {
    userId:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/',
    types:[],
    species:[],
    irrigation:[],
    adopt:[],
    workshop:[],
    save:[],
    menuBar:['品种','种菌','灌溉','采收','加工','存储'],
    currentIndex:0,
    siteIds:[]
  },
  onLoad(){
    var that = this;
    let userId = wx.getStorageSync('userinfo').nickName;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation',
      method:'get',
      data:{
        account:userId
      },
      success(res){
        let siteIds = res.data.plantation.map((i)=>{
          return i.siteId
        })
        that.setData({
          userId:userId,
          siteIds:siteIds
        })
        that.getFungusOriginData_admin(0)
      }
    })
  },
  getFungusOriginData_admin(count){
    var that = this;
    if(count === that.data.siteIds.length){
      return 
    }else{
      wx.request({
        url:'https://www.agribigdata.net/CloudRanch/origin_data/plantationAdmin_get_fungus_origin_data',
        method:'get',
        data:{
          siteId:that.data.siteIds[count]
        },
        success(res){
          that.formData(res)
          that.getFungusOriginData_admin(++count)
        }
      })
    }
  },
  formData(res){
    let that = this
    let data = res.data
    let types = that.data.types
    data.fungusType_s.map(i => {
      i.image = that.data.imgUrl + 'fungusTypeImage/' + i.image
    })
    types.push(data.fungusType_s)

    let species = that.data.species
    data.plantFungus.map(i => {
      i.image = that.data.imgUrl + 'plantFungusImage/' + i.image;
    })
    plantFungus.push(data.plantFungus)

    let irrigation = that.data.irrigation
    data.irrigate.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'irrigateImage/' + i.image;
      })
      irrigation.push(item)
    })
    let adopt = that.data.adopt
    data.harvest.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'harvestImage/' + i.image;
      })
      adopt.push(item)
    })
    let workshop = that.data.workshop
    data.cropProduce.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'cropProduceImage/' + i.image;
      })
      workshop.push(item)
    })
    let save = that.data.save
    data.storage.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'storageImage/' + i.image;
      })
      save.push(item)
    })
    that.setData({
      types,
      species,
      irrigation,
      adopt,
      workshop,
      save
    })
  },
  swiper(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: Number.parseInt(index)
    });
  },
  change(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },
  addtype:function(){
    wx.navigateTo({
      url: '/pages/mushroom1/index',
    })
  },
  gotoDetailPage(e){
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/Detail-Page/index?id=' + id +'&type=' + type,
    })
  }
})