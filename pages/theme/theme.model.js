import {Base} from '../../utils/base.js';

class Theme extends Base{

  constructor() {
    //继承基类后，一定要记得调用基类的构造函数
    super();
  }

  // 获取主题下的商品列表
  // 对应主题的id号
  getProductsData(id,callback){
    var param = {
      url:'theme/' + id,
      successCallback:function(res){
        callback && callback(res);
      }
    };
    this.request(param);
  }

}

export {Theme}