// pages/category/category.js
import {Category} from 'category.model.js'
var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex:0,
    loadedData:{} //用来临时存储分类数据，然后判断是否已加载过，降低频繁访问服务器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  _loadData:function(){

    category.getCatetoryType((categoryData)=>{
      this.setData({
        categoryTypeArr: categoryData
      });

      //默认显示第一个分类的产品
      category.getProductsByCategory(categoryData[0].id,(data)=>{

        var dataObj = {
          products:data,
          topImgUrl:categoryData[0].img.url,
          title:categoryData[0].name
        };

        this.setData({
          categoryProducts: dataObj
        });

        //把数据存到loadedData对象里
        this.data.loadedData[0] = dataObj;

      });

    });

  },

  //定义一个方法，用来判断是否已经加载过数据
  //参数index是每一个分类的序号
  isLoadedData:function(index){
    //根据分类序号，用对象的key来判断该类别数据是否已经存在
    if(this.data.loadedData[index]){
      return true;
    }
    return false;

  },

  changeCategory:function(event){
    var index = category.getDataSet(event,'index');
    var id = category.getDataSet(event, 'id');

    this.setData({
      currentMenuIndex:index
    });

    //如果没有加载过当前分类的商品数据
    if(!this.isLoadedData(index)){

      category.getProductsByCategory(id, (data) => {

        var dataObj = {
          products: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        };
  
        this.setData({
          categoryProducts: dataObj
        });
  
        //把数据存到loadedData对象里
        this.data.loadedData[index] = dataObj;
  
  
      });

    }else{
      // 如果加载过，直接读取
      this.setData({
        categoryProducts:this.data.loadedData[index]
      });
    }

    

  },

  //跳转到商品详情
  onProductsItemTap: function(event){

    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url:'../product/product?id=' + id
    });    

  }

})