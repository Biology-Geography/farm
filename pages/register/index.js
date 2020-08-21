
Page({
  data:{
    nickName:"",
    userpsd:"",
    usersex:"",
    usernum:"",
    useremail:"",
    isrepeat:true,
    sex:[{
    id:1,
    value:"男",
  },
  {
    id:2,
    value:"女",
  }]
},
  radioChange:function(e){
  const sex = this.data.sex
  for(let i = 0,len = sex.length;i < len; ++i){
    sex[i].checked = sex[i].id == e.detail.value
  }
  this.setData({
    sex
  })
},
inputname(e){
  const db = wx.cloud.database();
  db.collection('user-info').where({
    nickName:e.detail.value
  }).get({
    success:res=>{
      if(res.data.length){
        wx.showToast({
          title: '用户名重复！',
          icon:'none'
        })
        this.data.isrepeat = false
      }
    }
  })
},
//获取表单内的数据
getForm:function(e){
  var formdata=e.detail.value;
  this.setData({
    "data.nickName":formdata.nickName,
    "data.userpsd":formdata.userpsd,
    "data.usersex":formdata.usersex,
    "data.usernum":formdata.usernum,
    "data.useremail":formdata.useremail
  })
  console.log("更新data",e);
},
//将表单内的数据存入数据库
getData:function(e){
  var getdata=this.data;
  const db=wx.cloud.database();//初始化数据库
  if(this.data.isrepeat){
    db.collection("user-info").add({
      data:{
        nickName:getdata.data.nickName,
        userpsd:getdata.data.userpsd,
        usersex:getdata.data.usersex,
        usernum:getdata.data.usernum,
        useremail:getdata.data.useremail,
        userimage:'cloud://farm-intelligence.6661-farm-intelligence-1302482289/defualt.png'
      }
    }).then(res=>{
        wx.showToast({
          title: '注册成功！',
          duration:2500
        })
        wx.navigateBack({
          delta:1
        });
    }).catch(err=>{
      console.log("添加数据失败",err);
    })
  }else{
    wx.showToast({
      title: '用户名重复！注册不成功',
      icon:'none',
      duration:2000
    })
  }
}
})