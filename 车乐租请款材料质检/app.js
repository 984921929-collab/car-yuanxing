App({
  onLaunch() {
    const groups = wx.getStorageSync('groups');
    if (!Array.isArray(groups) || groups.length === 0) {
      wx.setStorageSync('groups', [
        {
          id: 'demo-1',
          title: '今晚羽毛球 8 人局',
          owner: '发起人',
          createdAt: Date.now() - 1000 * 60 * 18,
          limit: 8,
          ageMin: 18,
          ageMax: 35,
          gender: '不限',
          heightMin: '',
          heightMax: '',
          weightMin: '',
          weightMax: '',
          customRules: ['自带球拍', '19:30 前到场'],
          members: [
            { id: 'm1', name: '阿晨', joinedAt: Date.now() - 1000 * 60 * 14 },
            { id: 'm2', name: '小鹿', joinedAt: Date.now() - 1000 * 60 * 8 }
          ]
        }
      ]);
    }
  }
});
