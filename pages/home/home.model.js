import {Base} from "../../utils/base.js";

class Home extends Base{

    constructor(){
        //继承基类后，一定要记得调用基类的构造函数
        super();
    }

    getBannerData(id,callBack){
        var params = {
            url:'banner/' + id,
            successCallback:function (res) {
                callBack && callBack(res.items);
            }
        }
        this.request(params);
    }

}

export {Home}
