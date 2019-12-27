import {Base} from "../../utils/base.js";

class Home extends Base{

    constructor(){
        //继承基类后，一定要记得调用基类的构造函数
        super();
    }

    getBannerData(id,callback){
        var params = {
            url:'banner/' + id,
            successCallback:function (res) {
                callback && callback(res.items);
            }
        }
        this.request(params);
    }

    getThemeData(callback) {
      var params = {
        url: 'theme?ids=1,2,3',
        successCallback: function (res) {
          callback && callback(res);
        }
      }
      this.request(params);
    }

    getProductsData(callback) {
      var params = {
        url: 'product/recent',
        successCallback: function (res) {
          callback && callback(res);
        }
      }
      this.request(params);
    }

}

export {Home}
