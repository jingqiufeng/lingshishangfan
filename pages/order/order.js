
import { Cart } from '../cart/cart.model.js';
import { Address } from '../../utils/address.js';
import { Order } from '../order/order.model.js';
var cart = new Cart();
var address = new Address();
var order = new Order();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var from = options.from;

    if(from == 'cart'){
      this._fromCart(options.account);
    }else{
      var id = options.id;
      this._fromOrder(id);
    }

  },

  _fromCart: function (account) {

    var productsArr;
    this.data.account = account;

    productsArr = cart.getCartDataFromLocal(true);

    this.setData({
      productsArr: productsArr,
      account: account,
      orderStatus: 0
    });

    //显示收货地址
    address.getAddress((res) => {
      this._bindAddressInfo(res);
    });

  },

  _fromOrder: function (id) {

    if (id) {
      //下单后，支付成功或者失败后，点击左上角返回时更新订单状态
      //所以放在noshow生命周期方法内

      order.getOrderInfoById(id, (data) => {

        this.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          }
        });

        //快照地址
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        this._bindAddressInfo(addressInfo);

      });

    }

  },

  editAddress:function(event){
    wx.chooseAddress({

      //这个位置的this指向会发生变化，两种解决方案
      //一：var that = this; 把当前对象存在来，后面使用；
      //二：使用箭头函数
      success:(res)=>{
        
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          //调用address类的setAddressInfo方法拼接详细地址
          totalDetail: address.setAddressInfo(res)
        }

        this._bindAddressInfo(addressInfo);

        //保存地址
        address.submitAddress(res,(flag)=>{
          if(!flag){
            this.showTips('操作提示','地址信息更新失败');
          }
        });

      }
    })
  },

  //绑定地址信息
  _bindAddressInfo: function (addressInfo){
    this.setData({
      addressInfo: addressInfo
    });
  },

  //封装一个提示窗口
  //param
  //title - {string} 标题
  //content - {string} 内容
  //flag - {bool} 是否跳转到“我的”页面
  showTips:function(title,content,flag){
    wx.showModel({
      title:title,
      content:content,
      showCancel:false,
      success:function(res){
        if(flag){
          wx.switchTab({
            url: '/pages/my/my',
          })
        }
      }
    });
  },

  //下单和付款
  pay:function(){
    if(!this.data.addressInfo){
      this.showTips('下单提示','请填写您的收货地址');
      return;
    }
    if(this.data.orderStatus == 0){
      this._firstTimePay();
    }else{
      this._oneMoresTimePay();
    }
  },

  //第一次支付
  _firstTimePay:function(){

    var orderInfo = [];
    var productInfo = this.data.productsArr;
    var order = new Order();

    for(let i=0;i<productInfo.length;i++){
      orderInfo.push({
        product_id:productInfo[i].id,
        count:productInfo[i].counts
      })
    }

    order.doOrder(orderInfo,(data)=>{

      //订单生成成功
      if(data.pass){
        //更新订单状态
        var id = data.order_id;
        this.data.id = id;
        //this.data.fromCartFlag = false;
        //开始支付
        this._execPay(id);
      }else{
        this._orderFail(data); //下单失败
      }

    });

  },

  //开始支付
  //params
  //id - {int}订单id
  _execPay(id){

    order.execPay(id,(statusCode)=>{

      //0:商品缺货等原因导致订单不能支付；
      //1:支付失败或者支付取消；
      //2:支付成功
      if(statusCode != 0){
        //将已经下单的商品从购物车删除
        this.deleteProducts();
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
        })
      }

    });

  },


  //将已经下单的商品从购物车删除
  deleteProducts:function(){
    var ids = [];
    var arr = this.data.productsArr;
    for(let i=0;i<arr.length;i++){
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  },


  //下单失败
  _orderFail:function(data){
    console.log("下单失败啦");
    var nameArr = [];
    var name = '';
    var str = '';
    var pArr = data.pStatusArray;

    for(let i=0;i<pArr.length;i++){
      if(!pArr[i].haveStock){
        name = pArr[i].name;
        if (name.length > 15){
          name = name.substr(0,12) + '...';
        }
        nameArr.push(name);
        if(nameArr.length >= 2){
          break;
        }
      }
    }

    str += nameArr.join('、');

    if(nameArr.length>2){
      str += '等';
    }

    str += '缺货';

    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel:false,
      success:function(res){

      }
    })

  },

  onShow: function(){

    if(this.data.id){
      this._fromOrder(this.data.id);
    }    

  }

})