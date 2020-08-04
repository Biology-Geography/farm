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
    array: ['品种', '入圈', '饲料', '疫苗', '检疫', '屠宰', '储存'],
    isQuar: ['是', '否'],
    isQuarIndex: 0,
    localImgSrc: '',
    index: 0,
    liveStockSpeciesArr: [],
    liveStockSpeciesIdArr: [],
    liveStockSpeciesArrIndex: 0,
    addLiveStockSpeciesArr: [],
    addLiveStockSpeciesIdArr: [],
    addLiveStockSpeciesArrIndex: 0,
    slaughterArr: [],
    slaughterIdArr: [],
    slaughterArrIndex: 0,
    warehouseArr: [],
    warehouseIdArr: [],
    warehouseArrIndex: 0,
    date_1: util.formatTime(new Date())
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
        that.getLSOriginData_admin(0)
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
      // let goodArr = []
      // let goodIdArr = []
      let warehouseArr = []
      let warehouseIdArr = []
      that.setData({
        ents: data.enterprise
      })
      // that.getGood(0, goodArr, goodIdArr)
      that.getWarehouse(0, warehouseArr, warehouseIdArr)
    }
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
  getLSOriginData() {
    let that = this
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/origin_data/plantationAdmin_get_liveStock_origin_data',
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
  getLSOriginData_admin(count) {
    let that = this
    if (count === that.data.siteList.length) {
      that.checkData()
      return
    }
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/origin_data/admin_get_liveStock_origin_data',
      method:'get',
      data: {
        siteId: that.data.siteList[count].siteId
      },
      success(res) {
        that.formatData(res)
        that.getLSOriginData_admin(++count)
      }
    })
  },
  formatData(res) {
    let that = this
    let data = res.data
    let liveStockSpeciesArr = that.data.liveStockSpeciesArr
    let liveStockSpeciesIdArr = that.data.liveStockSpeciesIdArr
    let siteInfoArr = that.data.siteInfoArr
    data.liveStockSpecies_s.map(item => {
      liveStockSpeciesArr.push(item.livestockName)
      liveStockSpeciesIdArr.push(item.livestockId)
      siteInfoArr.push({
        siteId: item.siteId,
        placeId: item.placeId
      })
    })

    let addLiveStockSpeciesArr = that.data.addLiveStockSpeciesArr
    let addLiveStockSpeciesIdArr = that.data.addLiveStockSpeciesIdArr
    data.addLiveStock.map(item => {
      addLiveStockSpeciesArr.push(item.name)
      addLiveStockSpeciesIdArr.push(item.id)
    })

    let slaughterArr = that.data.slaughterArr
    let slaughterIdArr = that.data.slaughterIdArr
    data.slaughter.map(item => {
      item.map(i => {
        slaughterArr.push(i.name)
        slaughterIdArr.push(i.id)
      })
    })

    that.setData({
      siteInfoArr,
      liveStockSpeciesArr,
      liveStockSpeciesIdArr,
      addLiveStockSpeciesArr,
      addLiveStockSpeciesIdArr,
      slaughterArr,
      slaughterIdArr
    })
  },
  checkData() {
    let that = this
    if (that.data.liveStockSpeciesArr.length === 0) {
      that.setData({
        liveStockSpeciesArr: ['请先添加品种！'],
        liveStockSpeciesIdArr: [-1]
      })
    }
    if (that.data.addLiveStockSpeciesArr.length === 0) {
      that.setData({
        addLiveStockSpeciesArr: ['请先添加入圈信息！'],
        addLiveStockSpeciesIdArr: [-1]
      })
    }
    if (that.data.slaughterArr.length === 0) {
      that.setData({
        slaughterArr: ['请先添加屠宰信息！'],
        slaughterIdArr: [-1]
      })
    }

    this.getSite(that.data.siteInfoArr[that.data.liveStockSpeciesArrIndex].siteId)
    this.getPlace(that.data.siteInfoArr[that.data.liveStockSpeciesArrIndex].placeId)
  },
  //表单提交
  formSubmit(e) {
    let type = e.currentTarget.dataset.type;
    switch (type) {
      case 'addLiveStockSpecies':
        this.addLiveStockSpecies(e.detail.value);
        break;
      case 'addAddLiveStock':
        this.addAddLiveStock(e.detail.value);
        break;
      case 'addFeed':
        this.addFeed(e.detail.value);
        break;
      case 'addYiMiao':
        this.addYiMiao(e.detail.value);
        break;
      case 'addQuarantine':
        this.addQuarantine(e.detail.value);
        break;
      case 'addSlaughter':
        this.addSlaughter(e.detail.value);
        break;
      case 'addStorage':
        this.addStorage(e.detail.value);
        break;
    }
  },
  addLiveStockSpecies(value) {
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
        path: 'liveStockSpeciesImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addLiveStockSpecies',
          method:'get',
          data: {
            livestockName: name,
            itdt,
            image,
            entId,
            siteId,
            placeId,
            userId
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
  addAddLiveStock(value) {
    let that = this;
    let number = Number.parseInt(value.number.trim());
    let speciesId = that.data.liveStockSpeciesIdArr[that.data.liveStockSpeciesArrIndex];
    let siteId = that.data.siteInfoArr[that.data.liveStockSpeciesArrIndex].siteId;
    let placeId = that.data.siteInfoArr[that.data.liveStockSpeciesArrIndex].placeId;
    // let siteId = that.data.siteList[that.data.multiIndex[0]].siteId;
    // let placeId = that.data.placeList[that.data.multiIndex[1]].placeId;
    let createDate = that.data.date_1;
    let dateCode = util.codeDate(createDate);
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    // let siteName = that.data.multiArray[0][that.data.multiIndex[0]];
    // let placeName = that.data.multiArray[1][that.data.multiIndex[1]];
    let livestock = that.data.liveStockSpeciesArr[that.data.liveStockSpeciesArrIndex];
    let name = util.dateToString(createDate) + that.data.siteName + that.data.placeName + livestock + '入圈';
    // let name = util.dateToString(createDate) + siteName + placeName + livestock + '入圈';
    let id = util.formatNumber100(siteId) + util.formatNumber100(placeId) + dateCode + util.formatNumber100(speciesId);
    if (number === '' || typeof number !== 'number') {
      wx.showToast({
        title: '请正确填写数量！',
        icon: 'none'
      })
      return;
    }
    if (speciesId === -1) {
      wx.showToast({
        title: '请先添加牲畜品种！',
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
        path: 'addLiveStockImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addAddLiveStock',
          method:'get',
          data: {
            id,
            name,
            number,
            siteId,
            placeId,
            speciesId,
            image,
            createDate,
            dateCode,
            userId
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
  addFeed(value) {
    let that = this;
    let type = value.type.trim();
    let number = value.number.trim();
    let createdate = that.data.date_1;
    let addLivestockId = that.data.addLiveStockSpeciesIdArr[that.data.addLiveStockSpeciesArrIndex];
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (addLivestockId === -1) {
      wx.showToast({
        title: '请先添加入圈信息！',
        icon: 'none'
      })
      return;
    }
    if (type === '' || number === '') {
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
        path: 'feedImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addFeed',
          method:'get',
          data: {
            number,
            type,
            image,
            addLivestockId,
            createdate,
            userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.queryFeed();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addYiMiao(value) {
    let that = this;
    let name = value.name.trim();
    let addLivestockId = that.data.addLiveStockSpeciesIdArr[that.data.addLiveStockSpeciesArrIndex];
    let createdate = that.data.date_1;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (addLivestockId === -1) {
      wx.showToast({
        title: '请先添加入圈信息！',
        icon: 'none'
      })
      return;
    }
    if (name === '') {
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
        path: 'yimiaoImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addYiMiao',
          method:'get',
          data: {
            name,
            image,
            addLivestockId,
            createdate,
            userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.queryYiMiao();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addQuarantine(value) {
    let that = this;
    let isQuar = that.data.isQuar[that.data.isQuarIndex];
    let remark = value.remark.trim();
    let createdate = that.data.date_1;
    let addLivestockId = that.data.addLiveStockSpeciesIdArr[that.data.addLiveStockSpeciesArrIndex];
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (addLivestockId === -1) {
      wx.showToast({
        title: '请先添加入圈信息！',
        icon: 'none'
      })
      return;
    }
    if (remark === '') {
      remark = '无';
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
        path: 'quarantineImage',
      },
      success(res) {
        let image = JSON.parse(res.data).fileName;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/addQuarantine',
          method:'get',
          data: {
            isQuar,
            remark,
            image,
            addLivestockId,
            createdate,
            userId
          },
          success(res) {
            console.log(res);
            if (res.data === true) {
              let pages = getCurrentPages();
              let prePage = pages[pages.length - 2];
              prePage.queryQuarantine();
              that.formitSuccess();
            }
          }
        });
      }
    });
  },
  addSlaughter(value) {
    let that = this;
    let addLivestockId = that.data.addLiveStockSpeciesIdArr[that.data.addLiveStockSpeciesArrIndex];
    let siteId = Number.parseInt(addLivestockId.substring(0, 3));
    let placeId = Number.parseInt(addLivestockId.substring(3, 6));
    let livestockId = Number.parseInt(addLivestockId.substring(13, 16));
    let createdate = that.data.date_1;
    let dateCode = util.codeDate(createdate);
    let name = util.dateToString(createdate);
    let id = addLivestockId + dateCode;
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (addLivestockId === -1) {
      wx.showToast({
        title: '请先添加入圈信息！',
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
      url:'https://www.agribigdata.net/CloudRanch/querySlaughter',
      method:'get',
      data: {
        id: -1,
        addLivestockId,
        userId: ''
      },
      success(res) {
        console.log(res.data);
        let batch = 0;
        let slaughter = res.data.Slaughter;
        if (slaughter.length === 0) {
          batch = util.formatNumber100(1);
        } else {
          batch = util.formatNumber100(Number.parseInt(slaughter[0].batch) + 1);
        }
        id += batch;
        wx,request({
          url:'https://www.agribigdata.net/CloudRanch/plantation/queryPlantation',
          method:'get',
          data: {
            siteId
          },
          success(res) {
            name += res.data.site.siteName;
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
                name += res.data.places[0].placeName;
                wx.request({
                  url:'https://www.agribigdata.net/CloudRanch/queryLiveStockSpecies',
                  method:'get',
                  data: {
                    livestockId,
                    userId: ''
                  },
                  success(res) {
                    name += res.data.LiveStockSpecies[0].livestockName + batch + '批次屠宰';
                    wx.uploadFile({
                      filePath:imgUrl,
                      name:'file',
                      url:'https://www.agribigdata.net/CloudRanch/uploadFile',
                      formData: {
                        account: userId,
                        path: 'slaughterImage',
                      },
                      success(res) {
                        let image = JSON.parse(res.data).fileName;
                        wx.request({
                          url:'https://www.agribigdata.net/CloudRanch/addSlaughter',
                          method:'get',
                          data: {
                            id,
                            name,
                            addLivestockId,
                            batch,
                            image,
                            createdate,
                            dateCode,
                            userId
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
  addStorage(value) {
    let that = this;
    let id = that.data.slaughterIdArr[that.data.slaughterArrIndex];
    let warehouseId = that.data.warehouseIdArr[that.data.warehouseArrIndex];
    let date_1 = that.data.date_1;
    let dateCode = util.codeDate(date_1);
    let userId = that.data.userId;
    let imgUrl = that.data.localImgSrc;
    if (id === -1) {
      wx.showToast({
        title: '请先添加屠宰记录！',
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
        produceId: id,
        warehouseId: -1,
        type: 'livestock',
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
        let storageId = id + dateCode + util.formatNumber100(warehouseId) + batch;
        wx.request({
          url:'https://www.agribigdata.net/CloudRanch/querySlaughter',
          method:'get',
          data: {
            id,
            addLivestockId: '',
            userId: ''
          },
          success(res) {
            console.log(res.data);
            let slaughter = res.data.Slaughter[0];
            let storageName = slaughter.name + '_' + util.dateToString(date_1) + batch + '批次存储';
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
                wx.request({
                  url:'https://www.agribigdata.net/CloudRanch/addStorage',
                  method:'get',
                  data: {
                    storageId,
                    storageName,
                    produceId: id,
                    warehouseId,
                    batch,
                    type: 'livestock',
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
  queryLiveStockSpecies() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryLiveStockSpecies',
      method:'get',
      data: {
        livestockId: '',
        userId
      },
      success(res) {
        console.log(res.data);
        let liveStockSpecies = res.data.LiveStockSpecies;
        let arr = [];
        let index = [];
        if (liveStockSpecies.length === 0) {
          arr = ['暂无品种'];
          index = [-1];
        } else {
          arr = liveStockSpecies.map((i) => {
            return i.livestockName;
          });
          index = liveStockSpecies.map((i) => {
            return i.livestockId;
          });
        }
        that.setData({
          liveStockSpeciesArr: arr,
          liveStockSpeciesIdArr: index
        });
      }
    });
  },
  queryAddLiveStock() {
    let that = this;
    let userId = this.data.userId;
    wx.reuqest({
      url:'https://www.agribigdata.net/CloudRanch/queryAddLiveStock',
      method:'get',
      data: {
        placeId: -1,
        siteId: -1,
        speciesId: -1,
        id: '',
        userId
      },
      success(res) {
        console.log(res.data);
        let addLiveStock = res.data.AddLiveStock;
        let arr = [];
        let index = [];
        if (addLiveStock.length === 0) {
          arr = ['暂无品种'];
          index = [-1];
        } else {
          arr = addLiveStock.map((i) => {
            return i.name;
          });
          index = addLiveStock.map((i) => {
            return i.id;
          });
        }
        that.setData({
          addLiveStockSpeciesArr: arr,
          addLiveStockSpeciesIdArr: index
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
  querySlaughter() {
    let that = this;
    let userId = that.data.userId;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/querySlaughter',
      method:'get',
      data: {
        id: '',
        addLivestockId: '',
        userId
      },
      success(res) {
        console.log(res.data);
        let slaughterArr = res.data.Slaughter;
        let arr = slaughterArr.map((i) => {
          return i.name;
        });
        let index = slaughterArr.map((i) => {
          return i.id;
        });
        if (arr.length === 0) {
          arr = ['暂无屠宰记录！'];
          index = [-1];
        }
        that.setData({
          slaughterArr: arr,
          slaughterIdArr: index
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
      date_1: util.formatTime(new Date())
    })
  },
  bindDateChange_1(e) {
    this.setData({
      date_1: e.detail.value
    })
  },
  bindLiveStockSpeciesChange(e) {
    let that = this;
    const index = Number.parseInt(e.detail.value)
    this.getSite(that.data.siteInfoArr[index].siteId)
    this.getPlace(that.data.siteInfoArr[index].placeId)
    this.setData({
      liveStockSpeciesArrIndex: index
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
  bindIsQuarChange(e) {
    this.setData({
      isQuarIndex: Number.parseInt(e.detail.value)
    })
  },
  bindAddLiveStockChange(e) {
    this.setData({
      addLiveStockSpeciesArrIndex: Number.parseInt(e.detail.value)
    })
  }
})