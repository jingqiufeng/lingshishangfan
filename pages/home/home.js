//使用ES6的引入类的方法
import {Home} from 'home.model.js';
var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  // 定义私有函数：加载首页数据
  _loadData: function (){

    //首页加载banner数据
    var id = 1;
    home.getBannerData(id,(res)=>{
      this.setData({
        'bannerArr':res
      });
    });

    //首页加载主题数据
    home.getThemeData((res)=>{
      this.setData({
        'themeArr': res
      });
    });

    //首页加载最新产品数据
    home.getProductsData((res) => {
      this.setData({
        productsArr: res
      });
      
    });

  },

  onProductsItemTap:function(event){
    var id = home.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    });
  },

  onThemesItemTap: function (event){
    var id = home.getDataSet(event,'id');
    var name = home.getDataSet(event,'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name
    });
  }


})
