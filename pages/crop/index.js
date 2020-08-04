// pages/crop/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/',
    types:[],
    species:[],
    fertilizer:[],
    irrigation:[],
    insectAttack:[],
    adopt:[],
    workshop:[],
    save:[],
    menuBar:['品种','种菌','施肥','灌溉','病虫处理','采收','加工','存储'],
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
        that.getCropOriginData_admin(0)
      }
    })
  },
  getCropOriginData_admin(count){
    var that = this;
    if(count === that.data.siteIds.length){
      return
    }else{
      wx.request({
        url:'https://www.agribigdata.net/CloudRanch/origin_data/admin_get_planting_origin_data',
        method:'get',
        data:{
          siteId:that.data.siteIds[count]
        },
        success(res){
          that.formatData(res)
          that.getCropOriginData_admin(++count)
        }
      })
    }
  },
  formatData(res){
    let that = this;
    let data = res.data
    let types = that.data.types;
    data.cropType_s.map(i=>{
      i.image = that.data.imgUrl + 'cropTypeImage/' + i.image
    })
    types.push(data.cropType_s)
    let species = that.data.species
    data.planting.map(i=>{
      i.image = that.data.imgUrl + 'plantingImage' + i.image
    })
    species.push(data.planting)
    let fertilizer = that.data.fertilizer
    data.fertilizer.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'fertilizerImage/' + i.image;
      })
      fertilizer.push(item)
    })
    let irrigation = that.data.irrigate
    data.irrigate.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'irrigateImage/' + i.image;
      })
      irrigation.push(item)
    })
    let insectAttack = that.data.insectAttack
    data.insectAttack.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'insectAttackImage/' + i.image;
      })
      insectAttack.push(item)
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
      types:types,
      species:species,
      fertilizer:fertilizer,
      insectAttack:insectAttack,
      adopt:adopt,
      workshop:workshop,
      save:save
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
  addcrop:function(){
    wx.navigateTo({
      url: '/pages/crop1/index',
    })
  },
  gotoDetailPage(e){
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url:'/pages/Detail-Page/index?id=' + id +'&type=' + type
    })
  }
})