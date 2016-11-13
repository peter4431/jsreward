# jsreward

## 约定
---
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

## 使用
---

1. 安装

    	npm install jsreward
2. 运行测试

    	node jsreward/example/usage_server.js
    	
3. 编码
			
		var reward = require("jsreward");
		var onAdd = function(obj,user){
			//处理增加物品的逻辑
		;
		
		reward.addType(1,"金币","num");
    	reward.addType(2,"钻石","num");
    	reward.addType(3,"精力","num");
    	reward.addType(4,"星星","num");
    	reward.addType(5,"道具","id","num");
    	reward.addType(6,"角色","id");
    	reward.addType(7,"碎片","id","index");
    	reward.addType(8,"碟片","id");
    	reward.addType(9,"其他","name","url");
    	
    	reward.addReward("1|1000,5|1|1,[7|1|9|20-7|1|8|20]", onAdd, user);
