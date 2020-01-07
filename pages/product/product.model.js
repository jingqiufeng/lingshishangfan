import {Base} from '../../utils/base.js';

class Product extends Base
{
  constructor(){
    super();
  }

  //获取产品详情
  getProductDetail(id,callback){
    var param = {
      url:'product/' + id,
      successCallback:function(res){
        console.log(callback);
        callback && callback(res);
      }
    };
    this.request(param);
  }

}

export {Product}