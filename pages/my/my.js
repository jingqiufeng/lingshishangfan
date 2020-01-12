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

  _getOrders: function (callback){
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
      callback && callback();
    });
  },

  //小程序提供了一个下拉到底部的方法
  onReachBottom: function () {
    if(!this.data.isLoadAll){
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  //显示订单详情
  showOrderDetailInfo: function (event){
    var id = order.getDataSet(event,'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    })
  },

  rePay: function (event) {
    var id = order.getDataSet(event,'id');
    var index = order.getDataSet(event, 'index');
    this._execPay(id,index);
  },

  _execPay: function (id,index){

    order.execPay(id,(statusCode)=>{

      if(statusCode > 0){
        var flag = statusCode == 2;

        //更新订单显示状态
        if(flag){
          this.data.orderArr[index].status = 2;
          this.setData({
            orderArr: this.data.orderArr
          });
        }

        //跳转到成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        })


      }else{
        this.showTips('支付失败','商品已下架或库存已不足');
      }

    });

  },

  //

  showTips: function (title,contont) {
    wx.showModal({
      title: title,
      content: contont,
      showCancel: false,
      success: function (res) {

      }
    })
  },

  //onshow生命周期函数，是每打开一次执行一次
  onShow: function () {

    var newOrderflag = order.hasNewOrder();
    //每一次打开my页面都去请求订单数据这样性能不好，所以加一个判断，有新订单的时候采取服务端请求
    if (newOrderflag){
      this.refresh();
    }
    
  },

  //用来每次进入my页面刷新my页面的订单数据
  refresh: function () {
    this.data.orderArr = [];
    this._getOrders(()=>{
      this.data.isLoadAll = false;
      this.data.pageIndex = 1;
      order.execSetStorageSync(false);
    });
  },

  editAddress: function (event) {
    wx.chooseAddress({

      //这个位置的this指向会发生变化，两种解决方案
      //一：var that = this; 把当前对象存在来，后面使用；
      //二：使用箭头函数
      success: (res) => {

        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          //调用address类的setAddressInfo方法拼接详细地址
          totalDetail: address.setAddressInfo(res)
        }

        this._bindAddressInfo(addressInfo);

        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            this.showTips('操作提示', '地址信息更新失败');
          }
        });

      }
    })
  },

  //绑定地址信息
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

})