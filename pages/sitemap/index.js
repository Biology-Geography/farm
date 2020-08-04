// pages/sitemap/index.js
Page({
  data: {
    coordinate:{
      lng:new Number(),
      lat:new Number()
    },
    polygons:[],
    placeMarkers:[]
  },
  onLoad(o){
    let siteId = o.siteId;
    let placesId = o.placesId;
    this.querySiteLocations(siteId);
    this.queryPlaceLocations(placesId);
  },
  queryPlaceLocations(placeIds){
    let that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/queryPlaceLocations',
      method:'get',
      data:{
        placeIds:placeIds
      },
      success(res){
        console.log(res);
        let array = res.data.lngLats.split('#');
        for(let i = 0;i < array.length;i++){
          that.formaLatLng(array[i]);
        }
      }
    });
  },
  querySiteLocations(siteId){
    let that = this;
    wx.request({
      url:'https://www.agribigdata.net/CloudRanch/querySiteLocations',
      method:'get',
      data:{
        siteId:siteId
      },
      success(res){
        console.log(res.data);
        let points = that.formaLatLng(res.data.lngLats);
        let coordinate = that.location(points);
        that.setData({
          coordinate:coordinate
        })
      }
    })
  },
  location(points){
    let len = points.length;
    let lngsum = 0,latsum = 0;
    for(let i = 0;i < len;i++){
      lngsum +=Number.parseFloat(points[i].longitude);
      latsum +=Number.parseFloat(points[i].latitude);
    }
    return{
      lng:lngsum/len,
      lat:latsum/len
    }
  },
  formaLatLng(s) {
    let array = s.split('@');
    let lnglat;
    let points = []; //经纬度数组
    for (let i = 0; i < array.length; i++) {
      lnglat = array[i].split(',');
      points.push({
        latitude: lnglat[1],
        longitude: lnglat[0]
      });
    }
    let polygons = this.data.polygons;
    polygons.push({
      points: points,
      strokeWidth: 3,
      strokeColor: '#ffffff'
    });
    this.setData({
      polygons: polygons
    });
    return points;
  }
})