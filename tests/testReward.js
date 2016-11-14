/**
 * Created by wyang on 16/11/14.
 */

describe('test reward', function () {

  it('test merge reward', function () {

    var reward = require('../');

    reward.addType(1, 'coin', 'num');
    reward.addType(3, 'diamond', 'num');
    reward.addType(4, '星星', 'num');
    reward.addType(5, '道具', 'id', 'num');
    reward.addType(6, '角色', 'id');
    reward.addType(7, '碎片', 'id', 'index');
    reward.addType(8, '碟片', 'id');
    reward.addType(9, '其他', 'name', 'url');

    reward.setCountName('num');

    var rewardStr = '1|1000,5|1|1,7|1|9|20, 1|1500,5|1|1,[7|1|9|20-7|1|8|20]';
    var rewards = reward.parseReward(rewardStr);

    console.log(JSON.stringify(rewards));
  })
})