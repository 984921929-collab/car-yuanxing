const { getGroup, joinGroup, formatRules } = require('../../utils/groups');

function minutesAgo(timestamp) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes} 分钟前加入`;
  return `${Math.round(minutes / 60)} 小时前加入`;
}

Page({
  data: {
    id: '',
    group: null,
    rules: [],
    members: [],
    percent: 0,
    full: false,
    showJoin: false,
    nickname: ''
  },

  onLoad(query) {
    this.setData({ id: query.id || '' });
    this.loadGroup();

    if (query.created) {
      wx.showToast({ title: '开团成功', icon: 'success' });
    }
  },

  onShow() {
    if (this.data.id) this.loadGroup();
  },

  loadGroup() {
    const group = getGroup(this.data.id);
    if (!group) {
      this.setData({ group: null });
      return;
    }

    this.setData({
      group,
      rules: formatRules(group),
      members: group.members.map((member) => ({
        ...member,
        initial: member.name.slice(0, 1),
        label: minutesAgo(member.joinedAt)
      })),
      percent: Math.min(100, Math.round((group.members.length / group.limit) * 100)),
      full: group.members.length >= group.limit
    });
  },

  openJoin() {
    if (this.data.full) {
      wx.showToast({ title: '人数已满', icon: 'none' });
      return;
    }
    this.setData({ showJoin: true });
  },

  closeJoin() {
    this.setData({ showJoin: false, nickname: '' });
  },

  onNicknameInput(event) {
    this.setData({ nickname: event.detail.value });
  },

  confirmJoin() {
    const name = this.data.nickname.trim();
    if (!name) {
      wx.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }

    const group = joinGroup(this.data.id, name);
    if (!group) {
      wx.showToast({ title: '开团不存在', icon: 'none' });
      return;
    }

    this.setData({ showJoin: false, nickname: '' });
    this.loadGroup();
    wx.showToast({ title: '已加入', icon: 'success' });
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  },

  onShareAppMessage() {
    const { group } = this.data;
    return {
      title: group ? `${group.title}，还差 ${Math.max(group.limit - group.members.length, 0)} 人` : '邀请你加入开团',
      path: `/pages/detail/detail?id=${this.data.id}`
    };
  }
});
