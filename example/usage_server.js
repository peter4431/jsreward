/**
 * Created by peter4431 on 15/8/22.
 */

var reward = require("../");

var init = function(){
    var onAdd = function(userOrOther,obj){
        switch(obj.type) {
            case 1:
            case 2:
            case 3:
            {
                console.log("增加"+obj.name,obj.num,"个");
                break;
            }
            case 5:
            {
                console.log("增加"+obj.name,"(id为"+obj.id+")"+obj.num+"个");
                break;
            }
            case 7:
            {
                console.log("增加"+obj.name,"(id为"+obj.id+")第"+obj.index+"块碎片");
                break;
            }
        }
    }

    reward.addType(1,"金币",onAdd,"num");
    reward.addType(2,"钻石",onAdd,"num");
    reward.addType(3,"精力",onAdd,"num");
    reward.addType(4,"星星",onAdd,"num");
    reward.addType(5,"道具",onAdd,"id","num");
    reward.addType(6,"角色",onAdd,"id");
    reward.addType(7,"碎片",onAdd,"id","index");
    reward.addType(8,"碟片",onAdd,"id");
    reward.addType(9,"其他",onAdd,"name","url");
}

var test = function(){
    var userOrOther = "mongouser";
    reward.addReward(userOrOther,"1|1000,5|1|1,7|1|9|20");
    reward.addReward(userOrOther,"1|1000,5|1|1,[7|1|9|20-7|1|8|20]");
}

init();
test();
