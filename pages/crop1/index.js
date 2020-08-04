// pages/crop1/index.js
const util = require('../../utils/util.js');
Page({
  data: {
    siteName: '',
    placeName: '',
    userId:'',
    siteInfoArr: [],
    ents: [],
    entIdList: [],
    siteList: [],
    placeList: [],
    multiArray: [],
    multiIndex: [0, 0],
    array: ['品种', '种植', '施肥', '灌溉', '病虫处理', '采收', '加工', '储存'],
    localImgSrc: '',
    index: 0,
    cropTypeArr: [],
    cropTypeIdArr: [],
    cropTypeArrIndex: 0,
    plantingArr: [],
    plantingIdArr: [],
    plantingArrIndex: 0,
    goodArr: [],
    goodIdArr: [],
    goodArrIndex: 0,
    harvestArr: [],
    harvestIdArr: [],
    harvestArrIndex: 0,
    produceArr: [],
    produceIdArr: [],
    produceArrIndex: 0,
    warehouseArr: [],
    warehouseIdArr: [],
    warehouseArrIndex: 0,
    date_1: util.formatTime(new Date()),
    date_2: util.formatTime(new Date())
  },
  onLoad:function(){
    var that = this;
    var userId = wx.getStorageSync('userinfo').nickName;
    wx.request({
      url:"https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation",
      method:"get",
      data:{
         account:userId
       },
      success:(res)=>{
        console.log(res.data);
        let entIdList = res.data.enterprise.map(item => {
          return item.entId
        })
        let siteList = res.data.plantation
        let siteArr = siteList.map(item => {
          return item.siteName
        })
        that.setData({
          siteList,
          siteArr,
          entIdList,
          userId
        })
        that.queryPlaces(siteList[0].siteId)
        that.getCropOriginData_admin(0)
      }
    })
    that.getEnt()
  },
  getEnt(){
    let that = this
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/account_enterprise/queryEnterprise',
      method:'get',
      data:{
        account:that.data.userId,
        page: -1,
        limit: -1
      },
      success:(res)=>{
        console.log(res)
        that.formatEntData(res);
      }
    })
  },
  formatEntData(data){
    let that = this;
    if(data.enterprise.length){
      let goodArr = []
      let goodIdArr = []
      let warehouseArr = []
      let warehouseIdArr= []
      that.setData({
        ents:data.enterprise
      })
      that.getGood(0,goodArr,goodIdArr),
      that.getWarehouse(0,warehouseArr,warehouseIdArr)
    }
  },
  getGood(count,goodArr,goodIdArr){
    let that = this
    if(count === that.data.ents.length){
      that.setData({
        goodArr,
        goodIdArr
      })
      return
    }
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryGood_entId',
      method:'get',
      data:{
        entId:that.data.ents[count].entId
      },
      success:(res)=>{
        res.data.good.map((i)=>{
          goodArr.push(i.name)
          goodIdArr.push(i.id)
        })
        that.getGood(++count,goodArr,goodIdArr)
      }
    })
  },
  getWarehouse(count, warehouseArr, warehouseIdArr) {
    let that = this
    if (count === that.data.ents.length) {
      this.setData({
        warehouseArr,
        warehouseIdArr
      })
      return
    }
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryWarehouse_entId',
      method:'get',
      data: {
        entId: that.data.ents[count].entId
      },
      success(res) {
        res.data.Warehouse.map((i) => {
          warehouseArr.push(i.name)
          warehouseIdArr.push(i.id)
        })
        that.getWarehouse(++count, warehouseArr, warehouseIdArr)
      }
    })
  },
  getCropOriginData_admin(count) {
    let that = this
    if (count === that.data.siteList.length) {
      that.checkData()
      return
    }
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/origin_data/admin_get_fungus_origin_data',
      method:'get',
      data: {
        siteId: that.data.siteList[count].siteId
      },
      success(res) {
        that.formatData(res)
        that.getCropOriginData_admin(++count)
      }
    })
  },
  formatData(res) {
    let that = this
    let data = res.data
    let cropTypeArr = that.data.cropTypeArr
    let cropTypeIdArr = that.data.cropTypeIdArr
    let siteInfoArr = that.data.siteInfoArr
    data.cropType_s.map(item => {
      cropTypeArr.push(item.name)
      cropTypeIdArr.push(item.cropTypeId)
      siteInfoArr.push({
        siteId: item.siteId,
        placeId: item.placeId
      })
    })

    let plantingArr = that.data.plantingArr
    let plantingIdArr = that.data.plantingIdArr
    data.planting.map(item => {
      plantingArr.push(item.plantName)
      plantingIdArr.push(item.plantId)
    })

    let harvestArr = that.data.harvestArr
    let harvestIdArr = that.data.harvestIdArr
    data.harvest.map(item => {
      item.map(i => {
        harvestArr.push(i.harvestName)
        harvestIdArr.push(i.harvestId)
      })
    })

    let produceArr = that.data.produceArr
    let produceIdArr = that.data.produceIdArr
    data.cropProduce.map(item => {
      item.map(i => {
        produceArr.push(i.cropProduceName)
        produceIdArr.push(i.cropProduceId)
      })
    })

    that.setData({
      siteInfoArr,
      cropTypeArr,
      cropTypeIdArr,
      plantingArr,
      plantingIdArr,
      harvestArr,
      harvestIdArr,
      produceArr,
      produceIdArr
    })
  },
  checkData() {
    let that = this
    if (that.data.cropTypeArr.length === 0) {
      that.setData({
        cropTypeArr: ['请先添加品种！'],
        cropTypeIdArr: [-1]
      })
    }
    if (that.data.plantingArr.length === 0) {
      that.setData({
        plantingArr: ['请先添加种植信息！'],
        plantingIdArr: [-1]
      })
    }
    if (that.data.harvestArr.length === 0) {
      that.setData({
        harvestArr: ['请先添加采收信息！'],
        harvestIdArr: [-1]
      })
    }
    if (that.data.produceArr.length === 0) {
      that.setData({
        produceArr: ['请先添加加工信息！'],
        produceIdArr: [-1]
      })
    }

    this.getSite(that.data.siteInfoArr[that.data.cropTypeArrIndex].siteId)
    this.getPlace(that.data.siteInfoArr[that.data.cropTypeArrIndex].placeId)
  },
  formSubmit(e) {
    let type = e.currentTarget.dataset.type;
    switch (type) {
      case 'addCropType':
        this.addCropType(e.detail.value);
        break;
      case 'addPlanting':
        this.addPlanting(e.detail.value);
        break;
      case 'addFertilizer':
        this.addFertilizer(e.detail.value);
        break;
      case 'addIrrigate':
        this.addIrrigate(e.detail.value);
        break;
      case 'addInsectAttack':
        this.addInsectAttack(e.detail.value);
        break;
      case 'addHarvest':
        this.addHarvest(e.detail.value);
        break;
      case 'addCropProduce':
        this.addCropProduce(e.detail.value);
        break;
      case 'addStorage':
        this.addStorage(e.detail.value);
        break;
    }
  },
  addCropType(value) {
    let that = this;
    let name = value.name.trim();
    let itdt = value.itdt.trim();
    let userId = that.data.userId;
    let entId = that.data.entIdList[that.data.multiIndex[0]];
    let siteId = that.data.siteList[that.data.multiIndex[0]].siteId;
    let placeId = that.data.placeList[that.data.multiIndex[1]].placeId;
    let imgUrl = that.data.localImgSrc;
    if (name === '' || itdt === '') {
      wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      })
      return;
    }
    if (placeId === -1) {
      wx.showToast({
        title: '请选择有效的地块！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.uploadFile({
      filePath:imgUrl,
      name:'file',
      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
      formData: {
        account: userId,
        path: 'cropTypeImage',
      },
      success(res) {
        console.log(res)
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:"https://www.agribigdata.net/CloudRanch/addCropType",
          method:"get",
          data: {
            name,
            itdt,
            image,
            entId,
            siteId,
            placeId,
            account: userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.onLoad();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addPlanting(value) {
    let that = this;
    let number = Number.parseInt(value.number.trim());
    let remark = value.remark.trim();
    let cropTypeId = that.data.cropTypeIdArr[that.data.cropTypeArrIndex];
    let siteId = that.data.siteInfoArr[that.data.cropTypeArrIndex].siteId;
    let placeId = that.data.siteInfoArr[that.data.cropTypeArrIndex].placeId;
    // let siteId = that.data.siteList[that.data.multiIndex[0]].siteId;
    // let placeId = that.data.placeList[that.data.multiIndex[1]].placeId;
    let date_1 = that.data.date_1;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    let plantId = util.formatNumber100(siteId) + util.formatNumber100(placeId) + util.codeDate(date_1) + util.formatNumber100(cropTypeId);
    let plantName = util.dateToString(date_1) + that.data.siteName + that.data.placeName + that.data.cropTypeArr[that.data.cropTypeArrIndex] + '种植';
    // let plantName = util.dateToString(date_1) + that.data.multiArray[0][that.data.multiIndex[0]] + that.data.multiArray[1][that.data.multiIndex[1]] + that.data.cropTypeArr[that.data.cropTypeArrIndex] + '种植';
    if (remark === '') {
      remark = '无'
    }
    if (number === '' || typeof number !== 'number') {
      wx.showToast({
        title: '请正确填写数量！',
        icon: 'none'
      })
      return;
    }
    if (cropTypeId === -1) {
      wx.showToast({
        title: '请先添加品种！',
        icon: 'none'
      })
      return;
    }
    if (placeId === -1) {
      wx.showToast({
        title: '请选择有效的地块！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.uploadFile({
      filePath:imgUrl,
      name:'file',
      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
      formData: {
        account: userId,
        path: 'plantingImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addPlanting',
          method:'get',
          data: {
            plantId,
            plantName,
            cropTypeId,
            number,
            siteId,
            placeId,
            remark,
            createDate: date_1,
            dateCode: util.codeDate(date_1),
            image,
            account: userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.onLoad();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addFertilizer(value) {
    let that = this;
    let name = value.name.trim();
    let type = value.type.trim();
    let enterprise = value.enterprise.trim();
    let date_1 = that.data.date_1;
    let person = value.person.trim();
    let plantId = that.data.plantingIdArr[that.data.plantingArrIndex];
    let date_2 = that.data.date_2;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (plantId === -1) {
      wx.showToast({
        title: '请先种植！',
        icon: 'none'
      })
      return;
    }
    if (name === '' || type === '' || enterprise === '' || person === '') {
      wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.uploadFile({
      filePath:imgUrl,
      name:'file',
      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
      formData: {
        account: userId,
        path: 'fertilizerImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addFertilizer',
          method:'get',
          data: {
            fertilizerName: name,
            fertilizerType: type,
            produceInc: enterprise,
            fertilizerDate: date_1,
            fertilizePerson: person,
            plantId,
            createDate: date_2,
            image,
            account: userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.queryFertilizer();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addIrrigate(value) {
    let that = this;
    let volume = value.volume.trim();
    let person = value.person.trim();
    let method = value.method.trim();
    let plantId = that.data.plantingIdArr[that.data.plantingArrIndex];
    let date_1 = that.data.date_1;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (plantId === -1) {
      wx.showToast({
        title: '请先种植！',
        icon: 'none'
      })
      return;
    }
    if (volume === '' || person === '' || method === '') {
      wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
   wx.uploadFile({
      filePath:imgUrl,
      name:'file',
      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
      formData: {
        account: userId,
        path: 'irrigateImage',
      }, 
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addIrrigate',
          method:'get',
          data: {
            amount: volume,
            irrigationPerson: person,
            irrigationWay: method,
            type: 'crop',
            plantId,
            createDate: date_1,
            image,
            account: userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.queryIrrigate();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addInsectAttack(value) {
    let that = this;
    let date_1 = that.data.date_1;
    let chuliperson = value.chuliperson.trim();
    let chuliway = value.chuliway.trim();
    let plantId = that.data.plantingIdArr[that.data.plantingArrIndex];
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (plantId === -1) {
      wx.showToast({
        title: '请先种植！',
        icon: 'none'
      })
      return;
    }
    if (chuliperson === '' || chuliway === '') {
      wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.uploadFile({
      filePath:imgUrl,
      name:'file',
      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
      formData: {
        account: userId,
        path: 'insectAttackImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addInsectAttack',
          method:'get',
          data: {
            chuliperson,
            chuliway,
            plantId,
            createDate: date_1,
            image,
            account: userId,
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.queryInsectAttack();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addHarvest(value) {
    let that = this;
    let method = value.method.trim();
    let plantId = that.data.plantingIdArr[that.data.plantingArrIndex];
    let siteId = Number.parseInt(plantId.substring(0, 3));
    let placeId = Number.parseInt(plantId.substring(3, 6));
    let cropTypeId = Number.parseInt(plantId.substring(13, 16));
    let date_1 = that.data.date_1;
    let harvestName = util.dateToString(date_1);
    let harvestId = plantId + util.codeDate(date_1);
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (plantId === -1) {
      wx.showToast({
        title: '请先种植！',
        icon: 'none'
      })
      return;
    }
    if (method === '') {
      wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryHarvest',
      method:'get',
      data: {
        harvestId: '',
        plantId,
        type: 'crop',
        account: ''
      },
      success(res) {
        console.log(res.data);
        let batch = 0;
        let harvest = res.data.Harvest;
        if (harvest.length === 0) {
          batch = util.formatNumber100(1);
        } else {
          batch = util.formatNumber100(Number.parseInt(harvest[0].batch) + 1);
        }
        harvestId += batch;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/plantation/queryPlantation',
          method:'get',
          data: {
            siteId
          },
          success(res) {
            harvestName += res.data.site.siteName;
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
                harvestName += res.data.places[0].placeName;
                wx.request({
                  url:'https://www.agribigdata.net/CloudRanch/queryCropType',
                  method:'get',
                  data: {
                    cropTypeId,
                    account: ''
                  },
                  success(res) {
                    harvestName += res.data.CropType[0].name + batch + '批次采收';
                    wx.uploadFile({
                      filePath:imgUrl,
                      name:'file',
                      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
                      formData: {
                        account: userId,
                        path: 'harvestImage',
                      },
                      success(res) {
                        let image = JSON.parse(res.data).fileName;
                        api.addHarvest({
                          url:'https://www.agribigdata.net/CloudRanch/addHarvest',
                          method:'get',
                          data: {
                            harvestId,
                            harvestName,
                            harvestWay: method,
                            plantId,
                            type: 'crop',
                            createDate: date_1,
                            dateCode: util.codeDate(date_1),
                            image,
                            batch,
                            account: userId
                          },
                          success(res) {
                            console.log(res);
                            if (res.data === true) {
                              let pages = getCurrentPages();
                              let prePage = pages[pages.length - 2];
                              prePage.onLoad();
                              that.formitSuccess();
                            }
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

  },
  addCropProduce(value) {
    let that = this;
    let harvestId = that.data.harvestIdArr[that.data.harvestArrIndex];
    let goodId = that.data.goodIdArr[that.data.goodArrIndex];
    let date_1 = that.data.date_1;
    let dateCode = util.codeDate(date_1);
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (harvestId === -1) {
      wx.showToast({
        title: '请先采收！',
        icon: 'none'
      })
      return;
    }
    if (goodId === -1) {
      wx.showToast({
        title: '请先添加商品！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryCropProduce',
      method:'get',
      data: {
        cropProduceId: '',
        harvestId,
        goodId: -1,
        type: 'crop',
        account: ''
      },
      success(res) {
        let cropProduce = res.data.CropProduce;
        let batch = 0;
        if (cropProduce.length === 0) {
          batch = util.formatNumber100(1);
        } else {
          batch = util.formatNumber100(Number.parseInt(cropProduce[0].batch) + 1);
        }
        let cropProduceId = harvestId + dateCode + util.formatNumber100(goodId) + batch;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/queryHarvest',
          method:'get',
          data: {
            harvestId,
            plantId: '',
            type: 'crop',
            account: ''
          },
          success(res) {
            let harvest = res.data.Harvest[0];
            let cropProduceName = harvest.harvestName + '_' + util.dateToString(date_1) + batch + '批次加工';
            wx.uploadFile({
              filePath: imgUrl,
              name: 'file',
              url: 'https://www.agribigdata.net/CloudRanch/uploadFile',
              formData:{
                account:userId,
                path:'cropProduceImage',
              },
              success(res) {
                let image = JSON.parse(res.data).fileName;
                wx.request({
                  url:'https://www.agribigdata.net/CloudRanch/addCropProduce',
                  method:'get',
                  data: {
                    cropProduceId,
                    cropProduceName,
                    harvestId,
                    goodId,
                    batch,
                    type: 'crop',
                    createDate: date_1,
                    dateCode,
                    image,
                    account: userId
                  },
                  success(res) {
                    console.log(res);
                    if (res.data === true) {
                      let pages = getCurrentPages();
                      let prePage = pages[pages.length - 2];
                      prePage.queryCropProduce();
                      that.formitSuccess();
                    }
                  }
                });
              }
            });
          }
        });
      }
    });

  },
  addStorage(value) {
    let that = this;
    let produceId = that.data.produceIdArr[that.data.produceArrIndex];
    let warehouseId = that.data.warehouseIdArr[that.data.warehouseArrIndex];
    let date_1 = that.data.date_1;
    let dateCode = util.codeDate(date_1);
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (produceId === -1) {
      wx.showToast({
        title: '请先加工！',
        icon: 'none'
      })
      return;
    }
    if (warehouseId === -1) {
      wx.showToast({
        title: '请先添加仓库！',
        icon: 'none'
      })
      return;
    }
    if (imgUrl === '') {
      wx.showToast({
        title: '请选择图片！',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '提交中...',
    });
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryStorage',
      method:'get',
      data: {
        storageId: '',
        produceId,
        warehouseId: -1,
        type: 'crop',
        account: ''
      },
      success(res) {
        let storage = res.data.Storage;
        let batch = 0;
        if (storage.length === 0) {
          batch = util.formatNumber100(1);
        } else {
          batch = util.formatNumber100(Number.parseInt(storage[0].batch) + 1);
        }
        let storageId = produceId + dateCode + util.formatNumber100(warehouseId) + batch;
        api.queryCropProduce({
          url:'https://www.agribigdata.net/CloudRanch/queryCropProduce',
          method:'get',
          data: {
            cropProduceId: produceId,
            harvestId: '',
            goodId: -1,
            type: 'crop',
            account: ''
          },
          success(res) {
            console.log(res.data);
            let produce = res.data.CropProduce[0];
            let storageName = produce.cropProduceName + '_' + util.dateToString(date_1) + batch + '批次存储';
            wx.uploadFile({
              filePath: imgUrl,
              name: 'file',
              url: 'https://www.agribigdata.net/CloudRanch/uploadFile',
              formData:{
                account:userId,
                path:'storageImage',
              },
              success(res) {
                let image = JSON.parse(res.data).fileName;
                api.addStorage({
                  url:'https://www.agribigdata.net/CloudRanch/addStorage',
                  method:'get',
                  data: {
                    storageId,
                    storageName,
                    produceId,
                    warehouseId,
                    batch,
                    type: 'crop',
                    createDate: date_1,
                    dateCode,
                    image,
                    account: userId
                  },
                  success(res) {
                    console.log(res);
                    if (res.data === true) {
                      let pages = getCurrentPages();
                      let prePage = pages[pages.length - 2];
                      prePage.queryStorage();
                      that.formitSuccess();
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  queryCropType() {
    let that = this;
    wx.reuquest({
      url:'https://www.agribigdata.net/CloudRanch/queryCropType',
      method:'get',
      data: {
        cropTypeId: -1,
        account: ''
      },
      success(res) {
        console.log(res.data);
        let cropTypeArr = res.data.CropType;
        let arr = cropTypeArr.map((i) => {
          return i.name;
        });
        let index = cropTypeArr.map((i) => {
          return i.cropTypeId;
        });
        that.setData({
          cropTypeArr: arr,
          cropTypeIdArr: index
        });
      }
    });
  },
  queryPlanting() {
    let that = this;
    let userId = that.data.userId;
    api.queryPlanting({
      url:'https://www.agribigdata.net/CloudRanch/queryPlanting',
      method:'get',
      data: {
        plantId: '',
        cropTypeId: -1,
        siteId: -1,
        placeId: -1,
        account: userId
      },
      success(res) {
        console.log(res.data);
        let plantingArr = res.data.Planting;
        let arr = plantingArr.map((i) => {
          return i.plantName;
        });
        let index = plantingArr.map((i) => {
          return i.plantId;
        });
        if (arr.length === 0) {
          arr = ['暂未种植！'];
          index = [-1];
        }
        that.setData({
          plantingArr: arr,
          plantingIdArr: index
        });
      }
    });
  },
  queryHarvest() {
    let that = this;
    let userId = that.data.userId;
    api.queryHarvest({
      url:'https://www.agribigdata.net/CloudRanch/queryHarvest',
      method:'get',
      data: {
        harvestId: '',
        plantId: '',
        type: 'crop',
        account: userId
      },
      success(res) {
        console.log(res.data);
        let harvestArr = res.data.Harvest;
        let arr = harvestArr.map((i) => {
          return i.harvestName;
        });
        let index = harvestArr.map((i) => {
          return i.harvestId;
        });
        if (arr.length === 0) {
          arr = ['暂无地块采收！'];
          index = [-1];
        }
        that.setData({
          harvestArr: arr,
          harvestIdArr: index
        });
      }
    });
  },
  queryProduce() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryCropProduce',
      method:'get',
      data: {
        cropProduceId: '',
        harvestId: '',
        goodId: -1,
        type: 'crop',
        account: userId
      },
      success(res) {
        console.log(res.data);
        let produceArr = res.data.CropProduce;
        let arr = produceArr.map((i) => {
          return i.cropProduceName;
        });
        let index = produceArr.map((i) => {
          return i.cropProduceId;
        });
        if (arr.length === 0) {
          arr = ['暂无加工记录！'];
          index = [-1];
        }
        that.setData({
          produceArr: arr,
          produceIdArr: index
        });
      }
    });
  },
  queryWarehouse() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryWarehousee',
      method:'get',
      data: {
        id: -1,
        userId
      },
      success(res) {
        console.log(res.data);
        let warehouseArr = res.data.Warehouse;
        let arr = warehouseArr.map((i) => {
          return i.name;
        });
        let index = warehouseArr.map((i) => {
          return i.id;
        });
        if (arr.length === 0) {
          arr = ['暂未添加仓库！'];
          index = [-1];
        }
        that.setData({
          warehouseArr: arr,
          warehouseIdArr: index
        });
      }
    });
  },
  queryGood() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryGood',
      method:'get',
      data: {
        id: -1,
        userId
      },
      success(res) {
        console.log(res.data);
        let goodArr = res.data.good;
        let arr = goodArr.map((i) => {
          return i.name;
        });
        let index = goodArr.map((i) => {
          return i.id;
        });
        if (arr.length === 0) {
          arr = ['暂未添加商品！'];
          index = [-1];
        }
        that.setData({
          goodArr: arr,
          goodIdArr: index
        });
      }
    });
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
  columnchange(e) {
    let index = e.detail.value;
    if (e.detail.column == 0) {
      let siteId = this.data.siteList[index].siteId;
      this.queryPlaces(siteId);
    }
  },
  querySitesByUserId(userId) {
    let that = this;
    wa.request({
      url:'https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation',
      method:'get',
      data: {
        account: userId
      },
      success(res) {
        console.log(res.data);
        let siteList = res.data.sites;
        let siteArr = siteList.map((i) => {
          return i.siteName;
        });
        that.setData({
          siteList,
          siteArr
        });
        that.queryPlaces(siteList[0].siteId);
      }
    });
  },
  queryPlaces(siteId) {
    let that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaces',
      method:'get',
      data: {
        placeId: -1,
        siteId,
        limit: -1,
        pageNumber: 0,
        type: ''
      },
      success(res) {
        console.log(res.data);
        let placeList = res.data.places;
        let placeArr = [];
        if (placeList.length === 0) {
          placeArr = ['(当前站点暂无地块)'];
          placeList = [{
            placeId: -1
          }];
        } else {
          placeArr = placeList.map((i) => {
            return i.placeName;
          });
        }
        that.setData({
          multiArray: [that.data.siteArr, placeArr],
          placeList,
          placeArr
        });
      }
    });
  },
  pickchange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
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
  delimg() {
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
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: Number.parseInt(e.detail.value),
      localImgSrc: '',
      multiIndex: [0, 0],
      date_1: util.formatTime(new Date()),
      date_2: util.formatTime(new Date())
    })
  },
  bindDateChange_1(e) {
    this.setData({
      date_1: e.detail.value
    })
  },
  bindDateChange_2(e) {
    this.setData({
      date_2: e.detail.value
    })
  },
  bindCropTypeChange(e) {
    let that = this;
    const index = Number.parseInt(e.detail.value)
    this.getSite(that.data.siteInfoArr[index].siteId)
    this.getPlace(that.data.siteInfoArr[index].placeId)
    this.setData({
      cropTypeArrIndex: index
    })
  },
  getSite(siteId) {
    let that = this
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/plantation/queryPlantation',
      method:'get',
      data: {
        siteId
      },
      success(res) {
        console.log(res)
        that.setData({
          siteName: res.data.site.siteName
        })
      }
    })
  },
  getPlace(placeId) {
    let that = this
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
        console.log(res)
        that.setData({
          placeName: res.data.places[0].placeName
        })
      }
    })
  },
  bindPlantingChange(e) {
    this.setData({
      plantingArrIndex: Number.parseInt(e.detail.value)
    })
  },
  bindHarvestChange(e) {
    this.setData({
      harvestArrIndex: Number.parseInt(e.detail.value)
    })
  },
  bindGoodChange(e) {
    this.setData({
      goodArrIndex: Number.parseInt(e.detail.value)
    })
  }
})