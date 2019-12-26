class Home {

    constructor(){

    }

    getBannerData(id){
        wx.request({
            url:'http://ygh.com/api/v1/banner/' + id,
            method:'GET',
            success:function (res) {
                console.log(res);
               return res;
            }
        });
    }

}

export {Home}
