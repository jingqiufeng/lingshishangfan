import {Base} from '../../utils/base.js';

class Cart extends Base
{

  //构造函数
  constructor(){
    super();
    this._storageKeyName = 'cart';
  }

  /*
  * 加入到购物车
  * 如果之前没有这样的商品，则直接添加一条新的记录，数量为 counts
  * 如果有，则只将相应的数量 + counts
  * @params：
  * item 为 {obj} 商品对象
  * counts 为 {int} 商品数目
  */

  add(item,counts){

    //从缓存中取出购物车数据
    var cartData = this.getCartDataFromLocal();

    //获取是否已经存在购物车缓存数据中的结果
    var isHasInfo = this._isHasThatOne(item.id,cartData);

    //如果在购物车中没有找到这个商品，说明是新商品，那么需要把这个产品添加到缓存中去
    if(isHasInfo.index == -1){
      item.counts = counts;
      item.selectStatus =true; //添加的这个属性，是用来判断当前这个产品是否在购物车里是否被选中
      cartData.push(item);
    }else{
      cartData[isHasInfo.index].counts += counts;
    }

    //更新购物车缓存
    wx.setStorageSync(this._storageKeyName, cartData);

  }

  //从缓存中读取购物车数据
  getCartDataFromLocal(){
    var res = wx.getStorageSync(this._storageKeyName);
    if(!res){
      res = [];
    }
    return res;
  }

  //定义一个方法，用来判断传过来的信息是否已经存在购物车信息内
  //参数说明：id为商品的id，arr就是（var cartData = this.getCartDataFromLocal();）也就是缓存中的数据
  _isHasThatOne(id,arr){
    var item,result = {index:-1};

    for(let i = 0;i<arr.length; i++){
      item = arr[i];
      if(item.id == id){
        result = {
          index:1,
          data:item
        };
        break;
      }
    }

    return result;

  }

  // 计算购物车内商品总数量
  // flag true 考虑商品选择状态
  getCartTotalCounts(flag){
    var data = this.getCartDataFromLocal();

    var counts = 0;
    for (let i = 0; i < data.length; i++){
      if(flag){
        if(data[i].selectStatus){
          counts += data[i].counts;
        }
      }else{
        counts += data[i].counts;
      }
      
    }
    return counts;
  };


  //修改购物车商品数量的方法
  //params
  //id - {int} 商品id
  //counts - {int} 数目
  _changeCounts(id,counts){
    var cartData = this.getCartDataFromLocal();
    var hasInfo = this._isHasThatOne(id,cartData); //判断传入的id这个商品是否已存在

    if(hasInfo.index != -1){
      if(hasInfo.data.counts > 1){
        cartData[hasInfo.index].counts += counts;
      }
    }

    wx.setStorageSync(this._storageKeyName, cartData); //更新本地缓存

  };

  //增加商品数目
  addCounts(id){
    this._changeCounts(id,1);
  };

  cutCounts(id){
    this._changeCounts(id, -1);
  }

  //支持删除多个
  delete(ids){
    //判断传过来的是不是数组
    if(!(ids instanceof Array)){
      ids = [ids];
    }

    //从本地存储中取出购物车数据
    var cartData = this.getCartDataFromLocal();
    //遍历，然后删掉
    for(let i = 0; i<ids.length; i++){
      var hasInfo = this._isHasThatOne(ids[i],cartData);
      if(hasInfo.index != -1){
        cartData.splice(hasInfo.index,1); //删除某一组数据
      }
    }

    wx.setStorageSync(this._storageKeyName, cartData); //更新本地缓存

  }


}

export {Cart}