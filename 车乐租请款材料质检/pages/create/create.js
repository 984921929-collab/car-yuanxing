const { createGroup } = require('../../utils/groups');

Page({
  data: {
    genderOptions: ['不限', '男', '女'],
    form: {
      title: '',
      limit: '8',
      owner: '',
      ageMin: '',
      ageMax: '',
      gender: '不限',
      heightMin: '',
      heightMax: '',
      weightMin: '',
      weightMax: '',
      customRules: ''
    }
  },

  onInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({
      [`form.${key}`]: event.detail.value
    });
  },

  selectGender(event) {
    this.setData({
      'form.gender': event.currentTarget.dataset.value
    });
  },

  submit() {
    const { form } = this.data;
    const limit = Number(form.limit);

    if (!form.title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }

    if (!Number.isInteger(limit) || limit < 2 || limit > 500) {
      wx.showToast({ title: '人数上限需为 2-500', icon: 'none' });
      return;
    }

    const group = createGroup(form);
    wx.redirectTo({
      url: `/pages/detail/detail?id=${group.id}&created=1`
    });
  }
});
