// pages/theme/theme.js
import {Theme} from 'theme.model.js';
var theme = new Theme();

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
    this.data.name = options.name;
    console.log(options);
    //this._loadData();
  },

  _loadData:function(){
    theme.getProductsData(this.data.id,(data)=>{
      console.log(data);
      this.setData({
        themeInfo:data
      });
    });
  }
})