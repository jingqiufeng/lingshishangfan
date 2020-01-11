import {Base} from 'base.js';
import {Config} from 'config.js';

class Address extends Base{

  constructor(){
    super();
  }

  setAddressInfo(res){
    var province = res.provinceName || res.province;
    var city = res.cityName || res.city;
    var country = res.countyName || res.country;
    var detail = res.detailInfo || res.detail;

    var totalDetail = city + country + detail;

    //根据省份判断是否为直辖市，如果是直辖市则拼接详细地址时不用拼接省份
    if(!this.isCenterCity(province)){
      totalDetail = province + totalDetail;
    }

    return totalDetail;

  }

  getAddress(callback){
    var param = {
      url:'address',
      successCallback:(res)=>{
        if(res){
          res.totalDetail = this.setAddressInfo(res);
          callback && callback(res);
        }
      }
    };
    this.request(param);
  }

  //判断是否为直辖市
  isCenterCity(name){
    var centerCitys = ['北京市','天津市','上海市','重庆市'];
    var flag = centerCitys.indexOf(name) >= 0;
    return flag;
  }

  //把收货地址保存到本地存储中
  submitAddress(data,callback){
    data = this._setUpAddress(data);

    var param = {
      url:'address',
      type:'POST',
      data:data,
      //定义一个成功时候的方法
      successCallback:function(res){
        callback && callback(true,res);
      },
      errorCallback:function(){
        callback && callback(false, res);
      }
    }

    this.request(param);

  }

  //因为微信自带的地址字段和数据库中的不一样，所以这里需要写一个私有方法转换
  _setUpAddress(res){
    var formData = {
      name: res.userName, //姓名
      province: res.provinceName, //省
      city: res.cityName, //市
      country:res.countyName, //县
      mobile:res.telNumber,
      detail:res.detailInfo
    }
    return formData;
  }

}

export {Address}