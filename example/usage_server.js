/**
 * Created by peter4431 on 15/8/22.
 */

var reward = require("../");

var init = function(){
    reward.addType(1,"金币","num");
    reward.addType(2,"钻石","num");
    reward.addType(3,"精力","num");
    reward.addType(4,"星星","num");
    reward.addType(5,"道具","id","num");
    reward.addType(6,"角色","id");
    reward.addType(7,"碎片","id","index");
    reward.addType(8,"碟片","id");
    reward.addType(9,"其他","name","url");
}

var onAdd = function(obj,userOrOther){
    var name = userOrOther?userOrOther.name:"";
    switch(parseInt(obj.type)) {
        case 1:
        case 2:
        case 3:
        {
            console.log(name+"增加"+obj.name,obj.num,"个");
            break;
        }
        case 5:
        {
            console.log(name+"增加"+obj.name,"(id为"+obj.id+")"+obj.num+"个");
            break;
        }
        case 7:
        {
            console.log(name+"增加"+obj.name,"(id为"+obj.id+")第"+obj.index+"块碎片");
            break;
        }
    }
}

var test = function(){
    reward.addReward("1|1000,5|1|1,7|1|9|20",onAdd,{name:"peter"});
    var result = reward.addReward("1|1000,5|1|1,[7|1|9|20-7|1|8|20]",onAdd,{name:"peter"});

    console.log("原始数据:");
    var raws = []
    result.forEach(function(obj){
        raws.push(obj.raw)
    })
    console.log(raws.join(","));
}

init();
test();
