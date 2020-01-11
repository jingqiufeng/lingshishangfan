import { My } from './my.model.js';
import { Order } from '../order/order.model.js';
import { Address } from '../../utils/address.js';
var my = new My();
var order = new Order();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
    this._getOrders();
  },

  _loadData: function () {
    my.getUserInfo((data)=>{

      this.setData({
        userInfo:data
      });

    });
  },

  _getAddressInfo: function(){
    address.getAddress((addressInfo)=>{
      this.setData({
        addressInfo: addressInfo
      });
    });
  },

  _getOrders: function (){
    order.getOrders(this.data.pageIndex,(res)=>{
      var data = res.data.data;

      if(data.length > 0){
        this.data.orderArr.push.apply(this.data.orderArr,data);
        this.setData({
          orderArr: this.data.orderArr
        });
      }else{
        this.data.isLoadAll = true;
      }
      
    });
  },

  //小程序提供了一个下拉到底部的方法
  onReachBottom: function () {
    if(!this.data.isLoadAll){
      this.data.pageIndex++;
      this._getOrders();
    }
  }

})