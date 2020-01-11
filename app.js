//app.js
//引入token类
import { Token } from 'utils/token.js';

App({
  onLaunch: function () {
    
    var token = new Token();
    token.verify();
    
  }
})