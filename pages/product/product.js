// pages/product/product.js
import { Product } from 'product.model.js';
var product = new Product(); //实例化

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
    this.data.id = options.id;
    this._loadData();
  },

  _loadData:function(){
    product.getProductDetail(this.data.id,(data)=>{
      this.setData({
        product:data
      });
    });
  }

})