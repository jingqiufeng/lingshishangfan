// 构建请求基类
import {Config} from "../utils/config.js";
import { Token } from "../utils/token.js";

class Base{

    constructor(){

        this.baseRequestUrl = Config.restUrl;

    }

    //当noRefetch为true时，不做未授权重试机制
    request(params,noRefetch){
        var url = this.baseRequestUrl + params.url;

        if(!params.type){
            params.type = 'GET';
        }

        wx.request({
            url: url,
            data: params.data,
            method: params.type,
            header: {
                'content-type':'application/json',
                'token':wx.getStorageSync('token')
            },
            success: (res)=>{

                var code = res.statusCode.toString();
                var startChar = code.charAt(0);

                if(startChar == '2'){
                  params.successCallback && params.successCallback(res.data);
                }else{

                  if(code == '401'){

                    if(!noRefetch){
                      this._refetch(params);
                    }
                    
                  }

                  if(noRefetch){
                    params.errorCallback && params.errorCallback(res.data);
                  }
                  
                }

            },
            //fail在这里主要是指网络问题等原因请求根本没达到服务器
            fail:function (err) {

            }
        });
    }

    _refetch(params){
      var token = new Token();
      token.getTokenFromServer((token)=>{
        this.request(params,true);
      });
    }

    //获取元素上绑定的值
    getDataSet(event,key){
      return event.currentTarget.dataset[key];
    }
}

export {Base}
