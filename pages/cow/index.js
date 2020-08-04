// pages/cow/index.js
Page({
  data:{
    userId:'',
    types:[],
    intocircle:[],
    food:[],
    vaccum:[],
    checkinfect:[],
    kill:[],
    save:[],
    menuBar:['品种','入圈','饲料','疫苗','检疫','屠宰','存储'],
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
        that.getLSOriginData_admin(0)
      }
    })
  },
  getLSOriginData_admin(count){
    var that = this;
    if(count === that.data.siteIds.length){
      return
    }else{
      wx.request({
        url:'https://www.agribigdata.net/CloudRanch/origin_data/admin_get_liveStock_origin_data',
        method:'get',
        data:{
          siteId:that.data.siteIds[count]
        },
        success(res){
          that.formData(res)
          that.getLSOriginData_admin(++count)
        }
      })
    }
  },
  formData(res){
    let that = this
    let data = res.data
    let types = that.data.types
    data.liveStockSpecies_s.map(i => {
      i.image = that.data.imgUrl + 'liveStockSpeciesImage/' + i.image
    })
    types.push(data.liveStockSpecies_s)

    let intocircle = that.data.intocircle
    data.addLiveStock.map(i => {
      i.image = that.data.imgUrl + 'addLiveStockImage/' + i.image;
    })
    intocircle.push(data.addLiveStock)

    let food = that.data.food
    data.feed.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'feedImage/' + i.image;
      })
      food.push(item)
    })
    let vaccum = that.data.vaccum
    data.yiMiao.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'yimiaoImage/' + i.image;
      })
      vaccum.push(item)
    })
    let checkinfect = that.data.checkinfect
    data.quarantine.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'quarantineImage/' + i.image;
      })
      checkinfect.push(item)
    })
    let kill = that.data.kill
    data.slaughter.map(item => {
      item.map(i => {
        i.image = that.data.imgUrl + 'slaughterImage/' + i.image;
      })
      kill.push(item)
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
      intocircle,
      food,
      vaccum,
      checkinfect,
      kill,
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
  addcow:function(){
    wx.navigateTo({
      url: '/pages/cow1/index',
    })
  },
  getoDetailPage(e){
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/Detail-Page/index?id=' + id +"&type=" + type,
    })
  }
})