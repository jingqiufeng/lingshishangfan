import { Base } from '../../utils/base.js';

class Order extends Base{

  constructor(){
    super();
    this._storageKeyName = 'newOrder';
  }

  //下单
  doOrder(param,callback){
    var allParams = {
      url:'order',
      type:'POST',
      data:{
        products:param
      },
      successCallback:(data)=>{
        this.execSetStorageSync(true);
        callback && callback(data);
      },
      errorCallback:()=>{

      }
    };
    this.request(allParams);
  }

  //拉起微信支付
  //params
  //orderNumber - {int} 订单id
  //return
  //callback - {obj} 回调方法，返回参数 可能值
  //0:商品缺货等原因导致订单不能支付；
  //1:支付失败或者支付取消；
  //2:支付成功
  execPay(OrderNumber,callback){
    
    var allParams ={
      url:'pay/beforehandOrder',
      type: 'POST',
      data: {
        id:OrderNumber
      },
      successCallback:(data)=>{
        var timeStamp = data.timeStamp;
        if(timeStamp){ //可以支付
          wx.requestPayment({
            timeStamp: timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success:()=>{
              callback && callback(2);
            },
            fail:()=>{
              callback && callback(1);
            }
          })
        }else{
          callback && callback(0);
        }
      }
    }

    this.request(allParams);

  }

  //获得订单的具体内容
  getOrderInfoById(id,callback){
    var allParams = {
      url:'order/' + id,
      successCallback:(data)=>{
        callback && callback(data);
      },
      errorCallback:function(){

      }
    }
    this.request(allParams);
  }

  //获取所有订单，pageIndex 从1开始
  getOrders(pageIndex,callback){
    var allParams = {
      url:'order/by_user',
      data:{page:pageIndex},
      type:'GET',
      successCallback: function (data){
        callback && callback(data);
      }
    }
    this.request(allParams);
  }

  //本地缓存 保存 / 更新
  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName, data);
  }

  //判断是否有新订单
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }

}

export {Order}