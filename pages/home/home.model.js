class Home {

    constructor(){

    }

    getBannerData(id,callBack){
        wx.request({
            url:'http://ygh.com/api/v1/banner/' + id,
            method:'GET',
            success:function (res) {
                //callBack(res);
                console.log(callBack);
            }
        });
    }

}

export {Home}
