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
    array: ['品种', '种菌', '灌溉', '采收', '加工', '储存'],
    localImgSrc: '',
    index: 0,
    fungusTypeArr: [],
    fungusTypeIdArr: [],
    fungusTypeArrIndex: 0,
    plantFungusArr: [],
    plantFungusIdArr: [],
    plantFungusArrIndex: 0,
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
        that.getFungusOriginData_admin(0)
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
  formatEntData(data) {
    let that = this
    if (data.enterprise.length !== 0) {
      let goodArr = []
      let goodIdArr = []
      let warehouseArr = []
      let warehouseIdArr = []
      that.setData({
        ents: data.enterprise
      })
      that.getGood(0, goodArr, goodIdArr)
      that.getWarehouse(0, warehouseArr, warehouseIdArr)
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
  getFungusOriginData() {
    let that = this
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/origin_data/plantationAdmin_get_fungus_origin_data',
      method:'get',
      data: {
        account: that.data.userId
      },
      success(res) {
        that.formatData(res)
        that.checkData()
      }
    })
  },
  getFungusOriginData_admin(count) {
    let that = this
    if (count === that.data.siteList.length) {
      that.checkData()
      return
    }
    api.getFungusOriginData_admin({
      url:'https://www.agribigdata.net/CloudRanch/origin_data/admin_get_fungus_origin_data',
      method:'get',
      data: {
        siteId: that.data.siteList[count].siteId
      },
      success(res) {
        that.formatData(res)
        that.getFungusOriginData_admin(++count)
      }
    })
  },
  formatData(res) {
    let that = this
    let data = res.data
    let fungusTypeArr = that.data.fungusTypeArr
    let fungusTypeIdArr = that.data.fungusTypeIdArr
    let siteInfoArr = that.data.siteInfoArr
    data.fungusType_s.map(item => {
      fungusTypeArr.push(item.name)
      fungusTypeIdArr.push(item.fungusTypeId)
      siteInfoArr.push({
        siteId: item.siteId,
        placeId: item.placeId
      })
    })

    let plantFungusArr = that.data.plantFungusArr
    let plantFungusIdArr = that.data.plantFungusIdArr
    data.plantFungus.map(item => {
      plantFungusArr.push(item.plantFungusName)
      plantFungusIdArr.push(item.plantFungusId)
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
      fungusTypeArr,
      fungusTypeIdArr,
      plantFungusArr,
      plantFungusIdArr,
      harvestArr,
      harvestIdArr,
      produceArr,
      produceIdArr
    })
  },
  checkData() {
    let that = this
    if (that.data.fungusTypeArr.length === 0) {
      that.setData({
        fungusTypeArr: ['请先添加品种！'],
        fungusTypeIdArr: [-1]
      })
    }
    if (that.data.plantFungusArr.length === 0) {
      that.setData({
        plantFungusArr: ['请先添加种植信息！'],
        plantFungusIdArr: [-1]
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

    this.getSite(that.data.siteInfoArr[that.data.fungusTypeArrIndex].siteId)
    this.getPlace(that.data.siteInfoArr[that.data.fungusTypeArrIndex].placeId)
  },
  //表单提交
  formSubmit(e) {
    let type = e.currentTarget.dataset.type;
    switch (type) {
      case 'addFungusType':
        this.addFungusType(e.detail.value);
        break;
      case 'addPlantFungus':
        this.addPlantFungus(e.detail.value);
        break;
      case 'addIrrigate':
        this.addIrrigate(e.detail.value);
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
  addFungusType(value) {
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
        path: 'fungusTypeImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addFungusType',
          method:'get',
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
  addPlantFungus(value) {
    let that = this;
    let fungusTypeId = that.data.fungusTypeIdArr[that.data.fungusTypeArrIndex];
    let fungusStickNum = Number.parseInt(value.number.trim());
    let fungusStickSource = value.source.trim();
    let siteId = that.data.siteInfoArr[that.data.fungusTypeArrIndex].siteId;
    let placeId = that.data.siteInfoArr[that.data.fungusTypeArrIndex].placeId;
    // let siteId = that.data.siteList[that.data.multiIndex[0]].siteId;
    // let placeId = that.data.placeList[that.data.multiIndex[1]].placeId;
    let remark = value.remark.trim();
    let date_1 = that.data.date_1;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    let plantFungusId = util.formatNumber100(siteId) + util.formatNumber100(placeId) + util.codeDate(date_1) + util.formatNumber100(fungusTypeId);
    let plantFungusName = util.dateToString(date_1) + that.data.siteName + that.data.placeName + that.data.fungusTypeArr[that.data.fungusTypeArrIndex] + '种菌';
    // let plantFungusName = util.dateToString(date_1) + that.data.multiArray[0][that.data.multiIndex[0]] + that.data.multiArray[1][that.data.multiIndex[1]] + that.data.fungusTypeArr[that.data.fungusTypeArrIndex] + '种菌';
    if (remark === '') {
      remark = '无'
    }
    if (fungusTypeId === -1) {
      wx.showToast({
        title: '请先添加菌种！',
        icon: 'none'
      })
      return;
    }
    if (fungusStickNum === '' || fungusStickSource === '') {
      wx.showToast({
        title: '请将表格信息完善！',
        icon: 'none'
      })
      return;
    }
    if (typeof fungusStickNum !== 'number') {
      wx.showToast({
        title: '请正确填写数量！',
        icon: 'none'
      })
      return
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
        path: 'plantFungusImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addPlantFungus',
          method:'get',
          data: {
            plantFungusId,
            plantFungusName,
            fungusTypeId,
            fungusStickNum,
            fungusStickSource,
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
  addIrrigate(value) {
    let that = this;
    let volume = value.volume.trim();
    let person = value.person.trim();
    let method = value.method.trim();
    let plantId = that.data.plantFungusIdArr[that.data.plantFungusArrIndex];
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
            type: 'fungus',
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
  addHarvest(value) {
    let that = this;
    let method = value.method.trim();
    let plantId = that.data.plantFungusIdArr[that.data.plantFungusArrIndex];
    let siteId = Number.parseInt(plantId.substring(0, 3));
    let placeId = Number.parseInt(plantId.substring(3, 6));
    let fungusTypeId = Number.parseInt(plantId.substring(13, 16));
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
        type: 'fungus',
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
        api.querySite({
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
                  url:'https://www.agribigdata.net/CloudRanch/queryFungusType',
                  method:'get',
                  data: {
                    fungusTypeId,
                    account: ''
                  },
                  success(res) {
                    harvestName += res.data.FungusType[0].name + batch + '批次采收';
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
                        wx.request({
                          url:'https://www.agribigdata.net/CloudRanch/addHarvest',
                          method:'get',
                          data: {
                            harvestId,
                            harvestName,
                            harvestWay: method,
                            type: 'fungus',
                            plantId,
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
        type: 'fungus',
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
            type: 'fungus',
            account: ''
          },
          success(res) {
            let harvest = res.data.Harvest[0];
            let cropProduceName = harvest.harvestName + '_' + util.dateToString(date_1) + batch + '批次加工';
            wx.uploadFile({
              filePath:imgUrl,
              name:'file',
              url:'https://www.agribigdata.net/CloudRanch/uploadFile',
              formData: {
                account: userId,
                path: 'cropProduceImage',
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
                    type: 'fungus',
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
        type: 'fungus',
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
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/queryCropProduce',
          method:'get',
          data: {
            cropProduceId: produceId,
            harvestId: '',
            goodId: -1,
            type: 'fungus',
            account: ''
          },
          success(res) {
            console.log(res);
            let produce = res.data.CropProduce[0];
            let storageName = produce.cropProduceName + '_' + util.dateToString(date_1) + batch + '批次存储';
            wx.uploadFile({
              filePath:imgUrl,
              name:'file',
              url:'https://www.agribigdata.net/CloudRanch/uploadFile',
              formData: {
                account: userId,
                path: 'storageImage',
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
                    type: 'fungus',
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
  queryFungusType() {
    let that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryFungusType',
      method:'get',
      data: {
        fungusTypeId: -1,
        account: ''
      },
      success(res) {
        console.log(res.data);
        let fungusTypeArr = res.data.FungusType;
        let arr = fungusTypeArr.map((i) => {
          return i.name;
        });
        let index = fungusTypeArr.map((i) => {
          return i.fungusTypeId;
        });
        if (arr.length === 0) {
          arr = ['暂未添加品种！'];
          index = [-1];
        }
        that.setData({
          fungusTypeArr: arr,
          fungusTypeIdArr: index
        });
      }
    });
  },
  queryPlantFungus() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlantFungus',
      method:'get',
      data: {
        plantFungusId: '',
        fungusTypeId: -1,
        siteId: -1,
        placeId: -1,
        account: userId
      },
      success(res) {
        console.log(res.data);
        let plantFungusArr = res.data.PlantFungus;
        let arr = plantFungusArr.map((i) => {
          return i.plantFungusName;
        });
        let index = plantFungusArr.map((i) => {
          return i.plantFungusId;
        });
        if (arr.length === 0) {
          arr = ['暂未种植！'];
          index = [-1];
        }
        that.setData({
          plantFungusArr: arr,
          plantFungusIdArr: index
        });
      }
    });
  },
  queryHarvest() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryHarvest',
      method:'get',
      data: {
        harvestId: '',
        plantId: '',
        type: 'fungus',
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
        type: 'fungus',
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
      url:'https://www.agribigdata.net/CloudRanch/queryWarehouse',
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
    wx.request({
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
  bindFungusTypeChange(e) {
    let that = this;
    const index = Number.parseInt(e.detail.value)
    this.getSite(that.data.siteInfoArr[index].siteId)
    this.getPlace(that.data.siteInfoArr[index].placeId)
    this.setData({
      fungusTypeArrIndex: index
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
  bindPlantFungusChange(e) {
    this.setData({
      plantFungusArrIndex: Number.parseInt(e.detail.value)
    })
  },
  bindHarvestChange(e) {
    this.setData({
      harvestArrIndex: Number.parseInt(e.detail.value)
    })
  },
  bindProduceChange(e) {
    this.setData({
      produceArrIndex: Number.parseInt(e.detail.value)
    })
  },
  bindWarehouseChange(e) {
    this.setData({
      warehouseArrIndex: Number.parseInt(e.detail.value)
    })
  },
  bindGoodChange(e) {
    this.setData({
      goodArrIndex: Number.parseInt(e.detail.value)
    })
  }
})