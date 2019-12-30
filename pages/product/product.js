// pages/product/product.js
import { Product } from 'product.model.js';
var product = new Product(); //实例化

Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:null,
      countsArray:[1,2,3,4,5,6,7,8,9,10],
      productCount:1,
      currentTabsIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this._loadData();
  },

  _loadData:function(){
    product.getProductDetail(this.data.id,(data)=>{
      this.setData({
        product:data
      });
    });
  },

  bindPickerChange:function(event){
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      productCount:selectedCount
    });
  },

  onTabsItemTap:function(event){
    var index = product.getDataSet(event,'index');
    this.setData({
      currentTabsIndex:index
    });
  }

})