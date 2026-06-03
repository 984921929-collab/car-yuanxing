const STORAGE_KEY = 'groups';

function getGroups() {
  const groups = wx.getStorageSync(STORAGE_KEY);
  return Array.isArray(groups) ? groups : [];
}

function saveGroups(groups) {
  wx.setStorageSync(STORAGE_KEY, groups);
}

function getGroup(id) {
  return getGroups().find((group) => group.id === id);
}

function saveGroup(group) {
  const groups = getGroups();
  const index = groups.findIndex((item) => item.id === group.id);
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.unshift(group);
  }
  saveGroups(groups);
  return group;
}

function createGroup(form) {
  const now = Date.now();
  const group = {
    id: `g-${now}`,
    owner: form.owner || '我',
    createdAt: now,
    title: form.title.trim(),
    limit: Number(form.limit) || 2,
    ageMin: form.ageMin,
    ageMax: form.ageMax,
    gender: form.gender,
    heightMin: form.heightMin,
    heightMax: form.heightMax,
    weightMin: form.weightMin,
    weightMax: form.weightMax,
    customRules: form.customRules
      .split('\n')
      .map((rule) => rule.trim())
      .filter(Boolean),
    members: [
      {
        id: `m-${now}`,
        name: form.owner || '团长',
        joinedAt: now
      }
    ]
  };
  return saveGroup(group);
}

function joinGroup(id, memberName) {
  const group = getGroup(id);
  if (!group) return null;

  const cleanName = memberName.trim() || '微信用户';
  const exists = group.members.some((member) => member.name === cleanName);
  if (!exists && group.members.length < group.limit) {
    group.members.push({
      id: `m-${Date.now()}`,
      name: cleanName,
      joinedAt: Date.now()
    });
    saveGroup(group);
  }
  return group;
}

function formatRules(group) {
  const rules = [];
  if (group.ageMin || group.ageMax) rules.push(`年龄 ${group.ageMin || '不限'}-${group.ageMax || '不限'}`);
  if (group.gender && group.gender !== '不限') rules.push(`性别 ${group.gender}`);
  if (group.heightMin || group.heightMax) rules.push(`身高 ${group.heightMin || '不限'}-${group.heightMax || '不限'}cm`);
  if (group.weightMin || group.weightMax) rules.push(`体重 ${group.weightMin || '不限'}-${group.weightMax || '不限'}kg`);
  return rules.concat(group.customRules || []);
}

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  joinGroup,
  formatRules
};
