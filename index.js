/**
 * jsreward
 * Copyright(c) 2015 peter4431
 * MIT Licensed
 *
 ### 1. 收益表达式
 * 为了配置和显示处理简单,使用物品字符串表示东西的类型,id,数量等。
 * 金币-1,钻石-2,精力-3,星星-4,道具-5,角色-6,碎片-7,碟片-8,礼包-9
 * 形式为:"type|param1|param2",如下
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

var REWARD = {};
REWARD.types = {};
REWARD.selectExp = /^\[.*?\]$/;
REWARD.intExp = /^\d*$/;//check is int

REWARD.SPLIT_SELECT = "-";
REWARD.SPLIT_REWARD = ",";
REWARD.SPLIT_PROPER = "|";

REWARD.addType = function(type,name,onAdd,args){
    var obj = this.types[type] = {};
    args = Array.prototype.splice.call(arguments,3);

    obj.type = type;
    obj.name = name;
    obj.onAdd = onAdd;
    obj.args = args;
}

REWARD.parseValue = function(valueStr){
    if (this.intExp.test(valueStr)){
        return parseInt(valueStr);
    }else{
        return valueStr;
    }
}

/**
 * 解析 纯|分隔的物品,除定义的属性外允许带几率
 * */
REWARD.parseRewardBase = function(rewardStr){
    if (!rewardStr){
        return null;
    }

    var args = rewardStr.split(this.SPLIT_PROPER);
    var resultObj = {};
    var type = parseInt(args[0]);
    args = args.splice(1);

    var typeObj = this.types[type];
    var typeArgs = typeObj.args;

    resultObj.type = type;
    resultObj.name = typeObj.name;

    var length = Math.min(typeArgs.length,args.length);
    for(var i=0;i<length;i++){
        resultObj[typeArgs[i]] = this.parseValue(args[i]);
    }


    if (args.length <= typeArgs.length){
        return resultObj;
    }

    var ratio = parseInt(args[i])/100;
    var mrandom = Math.random();

    if (mrandom < ratio){
        return resultObj;
    }else{
        return null;
    }
}



/**
 * 按概率选择一个物品
 * */
REWARD.filterSelect = function(rewardStr){

    if(!this.selectExp.test(rewardStr)) {
        return rewardStr;
    }

    rewardStr = rewardStr.substr(1,rewardStr.length-2);

    var rewards = rewardStr.split(this.SPLIT_SELECT);
    var ratios = [];

    var itemStr;
    var itemRatioStr;
    var seperateIndex;
    for(var i=0;i<rewards.length;i++){
        itemStr = rewards[i];
        seperateIndex = itemStr.lastIndexOf(this.SPLIT_PROPER);
        itemRatioStr = itemStr.substr(seperateIndex+1);
        rewards[i] = itemStr.substring(0,seperateIndex);

        ratios.push(parseInt(itemRatioStr));
    }

    var stairs = [];
    var sum = 0;
    for(var i=0;i<ratios.length;i++){
        sum = sum + ratios[i];
        stairs.push(sum);
    }

    var resultIndex;
    var mrandom = (Math.random()*sum);
    for(var i=0;i<stairs.length;i++){
        if(mrandom < stairs[i]){
            resultIndex = i;
        }
    }

    return rewards[resultIndex];
}

/**
 * 过滤空格
 * */
REWARD.filterSpace = function(rewardStr){
    rewardStr = rewardStr.replace(/ /g,"");
    return rewardStr;
}

/**
 * 解析,分隔的字符串
 * */
REWARD.parseReward = function(rewardStr){
    rewardStr = this.filterSpace(rewardStr);
    var result = [];
    var rewards = rewardStr.split(this.SPLIT_REWARD);

    var reward;
    var itemStr;
    for(var i=0;i<rewards.length;i++){
        itemStr = rewards[i];

        itemStr = this.filterSelect(itemStr);
        reward = this.parseRewardBase(itemStr);
        reward && result.push(reward);
    }

    return result;

}

/**
 * 真正加到玩家身上
 * */
REWARD.addReward = function(user,rewardStr){
    var rewards = this.parseReward(rewardStr);

    var onAdd;
    for(var i=0;i<rewards.length;i++){
        onAdd = this.types[rewards[i].type].onAdd;

        if(onAdd){
            onAdd(user,rewards[i]);
        }
    }
    return rewards;
}

module.exports = REWARD;
