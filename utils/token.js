import { Config } from './config.js';

class Token
{

  //类都需要构造函数
  constructor(){
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
  }

  //验证方法
  verify(){
    var token = wx.getStorageSync('token');
    if(!token){
      //如果token不存在，则去服务器获取
      this.getTokenFromServer();
    }else{
      //如果token存在，则验证是否有效
      this._verifyFromServer(token);
    }
  }

  //从服务器获取token
  getTokenFromServer(callBack){

    //获取令牌那么就必须登录
    wx.login({
      
      success:(res) => {
        wx.request({
          url: this.tokenUrl,
          method:'POST',
          data:{
            code:res.code
          },
          success:function(res){
            wx.setStorageSync('token', res.data.token);
            callBack && callBack(res.data.token);
          }
        })
      }

    })

  }

  //从服务器验证token
  _verifyFromServer(token){
    wx.request({
      url: this.verifyUrl,
      method: 'POST',
      data:{
        token:token
      },
      success:res => {
        var valid = res.data.isValid;
        if(!valid){
          this.getTokenFromServer();
        }
      }
    })
  }

}

export { Token }