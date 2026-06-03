const { getGroups } = require('../../utils/groups');

function decorateGroup(group) {
  const percent = Math.min(100, Math.round((group.members.length / group.limit) * 100));
  return {
    ...group,
    percent,
    full: group.members.length >= group.limit,
    previewMembers: group.members.slice(0, 4).map((member) => ({
      ...member,
      initial: member.name.slice(0, 1)
    }))
  };
}

Page({
  data: {
    groups: []
  },

  onShow() {
    this.setData({
      groups: getGroups().map(decorateGroup)
    });
  },

  goCreate() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  goDetail(event) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${event.currentTarget.dataset.id}`
    });
  }
});
