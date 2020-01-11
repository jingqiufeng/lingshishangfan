import { Base } from '../../utils/base.js';

class My extends Base{

  constructor(){
    super();
  }

  //得到用户信息
  getUserInfo(cb){
    wx.login({
      success:()=>{
        wx.getUserInfo({
          
          success:function (res) {
            typeof cb == "function" && cb(res.userInfo);
          },
          fail: function (res) {
            typeof cb == "function" && cb({
              avatarUrl:'../../imgs/icon/user@default.png',
              nickName: '可尚商城'
            });
          }

        })
      }
    })
  }

}

export {My}