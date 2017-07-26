/**
 * jsreward
 * Copyright(c) 2015 peter4431
 * MIT Licensed
 *
 * 1. 奖励策划填写,服务端,客户端统一
 * 2. obj,收益表达字符 互转
 * 3. 多个同种奖励自动合并
 * 4. 几率奖励功能
 *
 ### 1. 收益表达式
 * 为了配置和显示处理简单,使用物品字符串表示东西的类型,id,数量等。
 * 金币-1,钻石-2,精力-3,星星-4,道具-5,角色-6,碎片-7,碟片-8,礼包-9
 * 形式为:'type|param1|param2',如下
 1|1000--金币1000
 2|1000--钻石1000个
 3|10  --精力10点
 4|6   --星星6个
 5|1|2 -- id为1的道具两个
 6|2   -- id为2的角色
 7|1|9 -- id为1的碟片的第9个碎片
 8|1   -- id为1的碟片
 9|百度|https://www.baidu.com/img/bd_logo1.png -- 名字为百度的物品

 * 策划填写
 1|1000,5|1|1,7|1|9

 * 概率掉落,最后一个可选字段表示概率
 1|1000,5|1|1,7|1|9|20 -- 金币1000，id为1的道具1个，20%几率掉落碎片1,9

 * 多个物品中随机一个
 1|1000,5|1|1,[7|1|9|20-7|1|8|20]
 -- 金币1000，id为1的道具1个，50%几率掉落碎片1,9,50%几率掉落碎片1,8,20表示权重
 */

var Reward = function(){
  this.countName;
  this.types = {};
  this.selectExp = /^\[.*?\]$/;
  this.intExp = /^[\+\-\.\d]*$/;//check is number

  this.SPLIT_SELECT = '-';
  this.SPLIT_REWARD = ',';
  this.SPLIT_PROPER = '|';this
}

var pro = Reward.prototype;

pro.addType = function (type, name, args) {
  var obj = this.types[type] = {};
  args = Array.prototype.splice.call(arguments, 2);

  obj.type = type;
  obj.name = name;
  obj.args = args;
};

/**
 * 设置定义为数量的属性名,用来合并道具
 * @param name
 */
pro.setCountName = function (name) {
  this.countName = name;
};

pro.parseValue = function (valueStr) {
  if (this.intExp.test(valueStr)) {
    return parseInt(valueStr);
  } else {
    return valueStr;
  }
};

/**
 * 解析 纯|分隔的物品,除定义的属性外允许带几率
 * */
pro.parseRewardBase = function (rewardStr) {
  if (!rewardStr) {
    return null;
  }

  var args = rewardStr.split(this.SPLIT_PROPER);
  var resultObj = {};
  var type = args[0];
  args = args.splice(1);

  var typeObj = this.types[type];
  var typeArgs = typeObj.args;

  resultObj.type = type;
  resultObj.name = typeObj.name;

  var length = Math.min(typeArgs.length, args.length);
  for (var i = 0; i < length; i++) {
    resultObj[typeArgs[i]] = this.parseValue(args[i]);
  }


  if (args.length <= typeArgs.length) {
    return resultObj;
  }

  var ratio = parseInt(args[i]) / 100;
  var mrandom = Math.random();

  if (mrandom < ratio) {
    return resultObj;
  } else {
    return null;
  }
}


/**
 * 按概率选择一个物品
 * */
pro.filterSelect = function (rewardStr) {

  if (!this.selectExp.test(rewardStr)) {
    return rewardStr;
  }

  rewardStr = rewardStr.substr(1, rewardStr.length - 2);

  var rewards = rewardStr.split(this.SPLIT_SELECT);
  var ratios = [];

  var itemStr;
  var itemRatioStr;
  var seperateIndex;
  for (var i = 0; i < rewards.length; i++) {
    itemStr = rewards[i];
    seperateIndex = itemStr.lastIndexOf(this.SPLIT_PROPER);
    itemRatioStr = itemStr.substr(seperateIndex + 1);
    rewards[i] = itemStr.substring(0, seperateIndex);

    ratios.push(parseInt(itemRatioStr));
  }

  var stairs = [];
  var sum = 0;
  for (var i = 0; i < ratios.length; i++) {
    sum = sum + ratios[i];
    stairs.push(sum);
  }

  var resultIndex;
  var mrandom = (Math.random() * sum);
  for (var i = 0; i < stairs.length; i++) {
    if (mrandom < stairs[i]) {
      resultIndex = i;
      break;
    }
  }

  return rewards[resultIndex];
}

/**
 * 过滤空格
 * */
pro.filterSpace = function (rewardStr) {
  rewardStr = rewardStr.replace(/ /g, '');
  return rewardStr;
};

/**
 * 合并奖励的数量
 * 如果调用过 setCountName 设置过数量属性,可以把其他属性都一样的奖励合并到一起
 * @param rewards 奖励数组
 */
pro.mergeCount = function (rewards) {
  // 1. 找到所有包含 countName 的奖励,
  // 2. 然后检查其他属性是否一样,一样则合并到出现的第一个

  if (!this.countName) {
    return;
  }

  var propStrs = [];

  var propStr;
  var item;
  var index;

  for (var i = 0; i < rewards.length; i++) {
    item = rewards[i];

    propStr = this.getPropStrNoCount(item);

    index = propStrs.indexOf(propStr);

    if (index === -1) {
      propStrs.push(propStr);
    } else {

      if (item.hasOwnProperty(this.countName)) {
        rewards.splice(i, 1);
        rewards[index][this.countName] += item[this.countName];
        i--;
      }
    }
  }
};

/**
 * 得到奖励的属性字符串
 */
pro.getPropStrNoCount = function (item) {

  var keys = this.types[item.type].args.concat();

  var indexOfCount = -1;

  while (indexOfCount = keys.indexOf(this.countName), indexOfCount >= 0) {
    keys.splice(indexOfCount, 1);
  }

  keys.push('type');
  keys.sort();

  var arr = [];
  keys.forEach(function (name) {
    arr.push(item[name]);
  });

  return arr.join(',');
};

/**
 * 解析,分隔的字符串
 * */
pro.parseReward = function (rewardStr) {
  rewardStr = rewardStr || '';
  rewardStr = this.filterSpace(rewardStr);
  var result = [];
  var rewards = rewardStr.split(this.SPLIT_REWARD);

  var reward;
  var itemStr;
  for (var i = 0; i < rewards.length; i++) {
    itemStr = rewards[i];

    itemStr = this.filterSelect(itemStr);
    reward = this.parseRewardBase(itemStr);
    reward && result.push(reward);
  }

  if (this.countName) {
    this.mergeCount(result);
  }

  return result;

};

/**
 * 奖励转换成字符串
 * @param rewards 奖励数组
 * @return {String}
 */
pro.rewardToStr = function (rewards) {
  var result = [];
  for (var i = 0; i < rewards.length; i++) {
    result.push(this.rewardToStrBase(rewards[i]));
  }

  return result.join(this.SPLIT_REWARD);
};

/**
 * 单个奖励转字符串
 * @param reward
 */
pro.rewardToStrBase = function (reward) {
  var keyArr = ['type'];
  keyArr = keyArr.concat(this.types[reward.type].args);
  var propArr = [];

  keyArr.forEach(function (name) {
    propArr.push(reward[name]);
  })

  return propArr.join(this.SPLIT_PROPER);
};

/**
 * 真正加到玩家身上
 * @param rewardStr 奖励字符串
 * @param oneCallback 一个obj的处理函数
 * */
pro.addReward = function (rewardStr, oneCallback, args) {
  var rewards = this.parseReward(rewardStr);

  var args = Array.prototype.splice.call(arguments, 2);

  for (var i = 0; i < rewards.length; i++) {

    if (oneCallback) {
      var margs = args.concat();
      margs.unshift(rewards[i]);
      oneCallback.apply(null, margs);
    }
  }
  return rewards;
}

module.exports = new Reward();
