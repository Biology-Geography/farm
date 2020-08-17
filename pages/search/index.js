// pages/search/index.js
Page({
    data:{
        keyword:'',//input的关键字
        record:[],//历史记录数组
        imgUrl:'https://www.agribigdata.net/image/CloudRanchFileStorage/siteImage/'
    },
    //显示搜索记录
    onShow:function(){
        var that = this;
        that.queryHistoricalSearchRecord();
    },
    queryHistoricalSearchRecord(){
        var that = this;
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
                console.log(res)
                that.setData({
                    record:res.data.records
                })   
            }
        })
    },
    //获取input内的值
    inputKey:function(e){
        this.data.keyword = e.detail.value;
    },
    btnclick:function(){
        var that = this;
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
                that.JumpTo(that.data.keyword)
              }
            })
        }else{
            var keyword = ''
            that.JumpTo(keyword);
        }

    },
    clicksearch(e){
        var keyword = e.currentTarget.dataset.record;
        var that = this;
        that.JumpTo(keyword)
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
    },
    JumpTo(key){
        wx.navigateTo({
            url: '/pages/search-item/index?keyword=' + key,
        })
    }
})