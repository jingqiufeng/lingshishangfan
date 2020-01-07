import {Base} from '../../utils/base.js';

class Category extends Base{

  constructor() {
    super();
  }

  //获取所有分类
  getCatetoryType(callback){
    var param = {
      url:'category/all',
      successCallback:function(res){
        callback && callback(res);
      }
    };
    this.request(param);
  }


  //获取某分类的商品
  getProductsByCategory(id,callback){
    var param = {
      url:'product/by_category?id=' + id,
      successCallback:function(res){
        callback && callback(res);
      }
    };
    this.request(param);
  }

}

export {Category}