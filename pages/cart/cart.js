import {Cart} from 'cart.model.js';
var cart = new Cart();

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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onHide: function () {
      wx.setStorageSync('cart', this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    //购物车数据
    var cartData = cart.getCartDataFromLocal();
    //选中的购物车数据
    //var countsInfo = cart.getCartDataFromLocal(true);

    var cal = this._calcTotalAccountAndCounts(cartData);

    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts:cal.selectedTypeCounts,
      account:cal.account,
      cartData:cartData
    });
    
  },

  //计算购物车选中商品的总价
  _calcTotalAccountAndCounts:function(data){
    var len = data.length;
    var account = 0; //所需要计算的总价格
    var selectedCounts = 0; //购买商品的总个数
    var selectedTypeCounts = 0; //购买商品种类的总数

    let multiple = 100;

    
    for(let i = 0; i<len; i++){

      //避免 0.05 + 0.01 = 0.060 000 000 000 000 005的问题
      if(data[i].selectStatus){
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }

    } 

    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account:account / (multiple * multiple)
    }

  },

  //购物车商品列表单选按钮事件
  toggleSelect:function(event){
    var id = cart.getDataSet(event,'id');
    var status = cart.getDataSet(event,'status');
    var index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  toggleSelectAll:function(event){
    var status = cart.getDataSet(event,'status') == 'true';

    var data = this.data.cartData;
    var len = data.length;

    for(let i = 0; i < len; i++){
      data[i].selectStatus = !status;
    }

    this._resetCartData();

  },

  //根据商品id得到 商品所在下标
  _getProductIndexById:function(id){
    var data = this.data.cartData;
    var len = data.length;

    for(let i = 0; i < len; i++){
      if(data[i].id == id){
        return i;
      }
    }

  },

  _resetCartData:function(){
    //重新计算总金额和商品总数
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData
    });
  },

  changeCounts:function(event){
    var id = cart.getDataSet(event, 'id');
    var type = cart.getDataSet(event, 'type');
    var index = this._getProductIndexById(id);
    var counts = 1;

    if(type == 'add'){
      cart.addCounts(id);
    }else{
      counts = -1;
      cart.cutCounts(id);
    }

    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  delete:function(event){
    var id = cart.getDataSet(event, 'id');
    var index = this._getProductIndexById(id);
    this.data.cartData.splice(index,1);
    this._resetCartData();
    cart.delete(id);
  }
  
})