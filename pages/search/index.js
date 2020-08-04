// pages/search/index.js
Page({
    data:{
        keyword:'',//input的关键字
        Id:'',//返回siteId的数值
        plantation:[],//全部基地信息数组
        record:[],//历史记录数组
        search:[],//根据搜索获取的列表
        imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/'
    },
    //显示搜索记录
    onShow:function(){
        var that=this;
        wx.request({
            url:'https://www.agribigdata.net/CloudRanch/queryHistoricalSearchRecord',
            method:"get",
            data:{ 
                "userId":'12345678'           
            },
            header:{
                'content-type':'application/json'
            },
            success(res){
                that.setData({
                    record:res.data.records
                })   
            }
        })
    },
    //获取input内的值
    inputKey:function(e){
        this.data.keyword=e.detail.value;
    },
    btnclick:function(){
        var that=this;
        //点击时添加搜索记录
        if(that.data.keyword){
            wx.request({
               url:'https://www.agribigdata.net/CloudRanch/addHistoricalSearchRecord',
               method:"get",
               data:{ 
                "keyword":that.data.keyword,
                "userId":'12345678'           
               },
               header:{
                 'content-type':'application/json'
               },
               success(res){
                console.log(res.data);
                that.onShow();
              }
            })
            var key=that.data.keyword;
            wx.request({
                url:"https://www.agribigdata.net/CloudRanch/plantation/entGetPlantation",
                method:"get",
                data:{
                   'account':'12345678'
                 },
                header:{
                   'content-type':'application/json'
                 },
                 success(res){
                     that.setData({
                        plantation:res.data.plantation,
                        keyword:key
                     })
                     res.data.plantation.map((i)=>{
                        if (i.image === '') {
                            i.image = 'noImage.png'
                          }
                     })
                     var reg=new RegExp(key);
                     var arr=[];
                     for(let i=0;i<that.data.plantation.length;i++){
                         if(that.data.plantation[i].siteName.indexOf(key)>=0){
                             arr.push(that.data.plantation[i]);
                         }
                     }
                     that.setData({
                         search:arr
                     })
                     console.log(that.data.search);
                 }
             })
        }else{//点击时获取默认的全部搜索
            wx.request({
               url:"https://www.agribigdata.net/CloudRanch/searchSites",
               method:"get",
               data:{
                  keys:''
                },
               header:{
                  'content-type':'application/json'
                },
                success(res){
                    console.log(res.data);
                    res.data.sites.map((i) => {
                      if (i.image === '') {
                        i.image = 'noImage.png'
                      }
                    });
                   that.setData({
                       plantation:res.data.sites,
                       keyword:"  默认搜索全部内容!",
                    })
                }
            })
        }

    },
    btnview:function(e){
        var that=this;
        var $data=e.currentTarget.dataset;
        that.data.Id=$data.bean.siteId
        wx.request({
            url:"https://www.agribigdata.net/CloudRanch/plantation/queryPlantation",
            method:"get",
            data:{
                "siteId":that.data.Id,
            },
            header:{
                'content-type':'application/json'
            },
            success(res){
                wx.setStorageSync('siteId', res);
                wx.navigateTo({
                    url:"/pages/info-plantation/index",
                })
            }
        })
        //这个地方是获取中间那一行字符的
        wx.request({
            url:"https://www.agribigdata.net/CloudRanch/queryPlaces",
            method:"get",
            data:{
                "placeId":-1,
                "siteId":that.data.Id,
                "limit":-1,
                "pageNumber":0,
                "type":""
            },
            header:{
                'content-type':'application/json'
            },
            success(res){
                wx.setStorageSync('places', res);
            }
        })
    },
    //删除搜素记录
    delete:function(){
        var that=this;
        wx.showModal({
            title:"提示",
            content:"确定要删除吗？",
            success:function(sm){
                if(sm.confirm){
                    wx.request({
                        url:'https://www.agribigdata.net/CloudRanch/clearRecords',
                        method:"get",
                        data:{ 
                            "userId":'12345678'           
                        },
                        header:{
                            'content-type':'application/json'
                        },
                        success(res){
                            for(let i=0;i<res.data.length;i++){
                                res.data.remove(res.data,res.data[i]);
                            }
                            that.setData({
                                record:res.data,
                            })  
                             
                        }
                    })
                }
            }
        })
    }
})