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
    if(isHasInfo == -1){
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
    var item;
    var result = {index:-1};

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
  getCartTotalCounts(){
    var data = this.getCartDataFromLocal();
    console.log(data);
    var counts = 0;
    for(let i=0; i< data[i].counts; i++){
      counts += data[i].counts;
    }
    return counts;
  }


}

export {Cart}