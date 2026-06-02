figma.showUI("<div></div>", { visible: false });

const C = {
  red: "#EF4B59",
  redSoft: "#FFF0F2",
  orange: "#FF8A00",
  orangeSoft: "#FFF6E8",
  blue: "#2878FF",
  blueSoft: "#EEF5FF",
  purple: "#7B3CFF",
  purpleSoft: "#F3EFFF",
  ink: "#20242B",
  muted: "#7D8490",
  line: "#EDF0F4",
  bg: "#F5F6F8",
  white: "#FFFFFF",
  panel: "#F8F9FB",
  green: "#168044",
  greenSoft: "#EAF8EF"
};

const customers = [
  { name: "李晓丽", status: "电催", days: 12, amount: "18,600", paid: "8/36", follower: "王玉清", followTime: "2026-05-28 18:20", owner: "唐慧峰", note: "电话已接通，客户承诺本周五前补缴。", recent: true },
  { name: "王建国", status: "实地催收", days: 38, amount: "56,200", paid: "11/48", follower: "刘敏", followTime: "2026-05-29 09:10", owner: "唐慧峰", note: "现场催收中，车辆仍在客户处正常经营。", recent: true },
  { name: "赵六", status: "收车", days: 64, amount: "94,800", paid: "6/36", follower: "陈立", followTime: "2026-05-27 16:42", owner: "董慧颖", note: "已定位车辆位置，等待收车小组现场处理。", recent: false },
  { name: "周娜", status: "诉讼", days: 96, amount: "138,500", paid: "4/36", follower: "宋佳", followTime: "2026-05-26 11:05", owner: "董慧颖", note: "诉讼资料已提交法务，等待立案反馈。", recent: false },
  { name: "沈强", status: "电催", days: 27, amount: "32,100", paid: "15/48", follower: "王玉清", followTime: "2026-05-28 14:35", owner: "唐慧峰", note: "客户资金周转紧张，建议持续跟进。", recent: false },
  { name: "陈思远", status: "实地催收", days: 45, amount: "71,600", paid: "9/36", follower: "刘敏", followTime: "2026-05-29 10:25", owner: "刘敏", note: "已预约下午上门，准备核实车辆停放位置。", recent: true },
  { name: "孙敏", status: "电催", days: 19, amount: "24,300", paid: "13/36", follower: "李雪", followTime: "2026-05-24 09:18", owner: "刘敏", note: "短信已送达，客户暂未回复。", recent: false },
  { name: "马超", status: "收车", days: 73, amount: "86,700", paid: "5/36", follower: "陈立", followTime: "2026-05-23 18:40", owner: "董慧颖", note: "车辆疑似异地使用，需继续核实轨迹。", recent: false }
];

function hexToRgb(hex) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.slice(0, 2), 16) / 255,
    g: parseInt(v.slice(2, 4), 16) / 255,
    b: parseInt(v.slice(4, 6), 16) / 255
  };
}

function solid(hex) {
  return [{ type: "SOLID", color: hexToRgb(hex) }];
}

function nodeName(node, name) {
  node.name = name;
  return node;
}

function rect(parent, name, x, y, w, h, fill, radius = 0, stroke = null) {
  const n = figma.createRectangle();
  nodeName(n, name);
  n.x = x;
  n.y = y;
  n.resize(w, h);
  n.fills = solid(fill);
  n.cornerRadius = radius;
  if (stroke) {
    n.strokes = solid(stroke);
    n.strokeWeight = 1;
  } else {
    n.strokes = [];
  }
  parent.appendChild(n);
  return n;
}

function line(parent, name, x1, y1, x2, y2, color) {
  const n = figma.createLine();
  nodeName(n, name);
  n.x = x1;
  n.y = y1;
  n.resize(Math.max(1, x2 - x1), 0);
  n.rotation = y1 === y2 ? 0 : 90;
  n.strokes = solid(color);
  n.strokeWeight = 1;
  parent.appendChild(n);
  return n;
}

function text(parent, name, x, y, value, size = 12, color = C.ink, weight = 400, w = null) {
  const n = figma.createText();
  nodeName(n, name);
  n.x = x;
  n.y = y;
  n.fontName = { family: "Microsoft YaHei", style: weight >= 700 ? "Bold" : "Regular" };
  n.fontSize = size;
  n.fills = solid(color);
  n.characters = value;
  if (w) {
    n.resize(w, n.height);
    n.textAutoResize = "HEIGHT";
  }
  parent.appendChild(n);
  return n;
}

function pill(parent, name, x, y, label, fill, color, w = null) {
  const width = w || Math.max(44, label.length * 12 + 18);
  rect(parent, `${name}/背景`, x, y, width, 23, fill, 12);
  text(parent, `${name}/文字`, x + width / 2, y + 4, label, 12, color, 700).textAlignHorizontal = "CENTER";
}

function metric(parent, x, y, w, title, value, danger = false) {
  rect(parent, `${title}/背景`, x, y, w, 44, C.panel, 5);
  text(parent, `${title}/标题`, x + 6, y + 8, title, 11, C.muted, 400);
  text(parent, `${title}/数值`, x + 6, y + 25, value, 14, danger ? C.red : C.ink, 700);
}

function statusStyle(status) {
  if (status === "实地催收") return { fill: C.blueSoft, color: C.blue, width: 64 };
  if (status === "收车") return { fill: C.orangeSoft, color: "#8A4D00", width: 54 };
  if (status === "诉讼") return { fill: C.purpleSoft, color: C.purple, width: 54 };
  return { fill: C.redSoft, color: C.red, width: 54 };
}

function card(parent, customer, x, y, index) {
  const h = 160;
  rect(parent, `客户卡片 ${index + 1}/${customer.name}`, x, y, 362, h, C.white, 6);
  rect(parent, `客户卡片 ${index + 1}/左侧风险线`, x, y, 3, h, "#FFCCD2", 2);
  text(parent, `${customer.name}/姓名`, x + 14, y + 14, customer.name, 17, C.ink, 700);
  if (customer.recent) {
    pill(parent, `${customer.name}/近2天已跟进`, x + 70, y + 9, "近2天已跟进", C.greenSoft, C.green, 72);
  }
  const st = statusStyle(customer.status);
  pill(parent, `${customer.name}/状态`, x + 362 - st.width - 14, y + 8, customer.status, st.fill, st.color, st.width);

  metric(parent, x + 14, y + 43, 96, "逾期天数", `${customer.days} 天`, true);
  metric(parent, x + 116, y + 43, 132, "逾期金额", `${customer.amount} 元`, true);
  metric(parent, x + 254, y + 43, 94, "还款期数", customer.paid, false);
  line(parent, `${customer.name}/分隔线`, x + 14, y + 96, x + 348, y + 96, C.line);

  text(parent, `${customer.name}/跟进人标签`, x + 14, y + 105, "跟进人", 12, C.muted, 400);
  text(parent, `${customer.name}/跟进人`, x + 70, y + 105, customer.follower, 12, C.ink, 700);
  text(parent, `${customer.name}/最近跟进标签`, x + 186, y + 105, "最近跟进", 12, C.muted, 400);
  text(parent, `${customer.name}/最近跟进`, x + 246, y + 105, customer.followTime, 12, C.ink, 700);
  text(parent, `${customer.name}/维护人标签`, x + 14, y + 126, "维护人", 12, C.muted, 400);
  text(parent, `${customer.name}/维护人`, x + 70, y + 126, customer.owner, 12, C.ink, 700);

  const noteFill = customer.recent ? C.orangeSoft : C.panel;
  const noteStroke = customer.recent ? "#FFE1B8" : "#EEF1F5";
  const noteTitleColor = customer.recent ? "#B56600" : C.muted;
  const noteTextColor = customer.recent ? "#553600" : "#4D5662";
  rect(parent, `${customer.name}/跟进记录背景`, x + 14, y + 125, 334, 28, noteFill, 6, noteStroke);
  text(parent, `${customer.name}/跟进记录标签`, x + 24, y + 132, "跟进记录", 12, noteTitleColor, 700);
  text(parent, `${customer.name}/跟进记录`, x + 86, y + 132, customer.note, 12, noteTextColor, 700, 245);
}

async function main() {
  await figma.loadFontAsync({ family: "Microsoft YaHei", style: "Regular" });
  await figma.loadFontAsync({ family: "Microsoft YaHei", style: "Bold" });

  const page = figma.createPage();
  page.name = "逾期列表页";
  figma.currentPage = page;

  const frame = figma.createFrame();
  frame.name = "逾期列表页 - Axure可复制";
  frame.resize(390, 1320);
  frame.fills = solid(C.bg);
  page.appendChild(frame);

  rect(frame, "状态栏背景", 0, 0, 390, 36, C.white);
  text(frame, "时间", 18, 15, "9:41", 12, "#111111", 700);
  text(frame, "网络", 330, 15, "▮▮▮ 5G ▭", 12, "#111111", 700);

  rect(frame, "标题栏背景", 0, 36, 390, 48, C.white);
  text(frame, "返回", 18, 54, "‹", 25, "#252932", 400);
  const title = text(frame, "页面标题", 0, 53, "逾期管理", 17, C.ink, 700);
  title.resize(390, title.height);
  title.textAlignHorizontal = "CENTER";
  line(frame, "标题栏分割线", 0, 84, 390, 84, C.line);

  rect(frame, "顶部统计背景", 14, 89, 362, 36, "#FAFBFC", 8, C.line);
  line(frame, "统计分割线1", 134, 89, 134, 125, C.line);
  line(frame, "统计分割线2", 255, 89, 255, 125, C.line);
  text(frame, "名下逾期客户标题", 22, 96, "名下逾期客户", 10, C.muted, 400);
  text(frame, "名下逾期客户数", 22, 109, "6", 15, C.red, 700);
  text(frame, "名下逾期客户说明", 38, 111, "含处理中客户", 10, C.orange, 700);
  text(frame, "30+逾期标题", 143, 96, "30+逾期数", 10, C.muted, 400);
  text(frame, "30+逾期数", 143, 109, "4", 15, C.ink, 700);
  text(frame, "30+逾期比例", 160, 111, "占比 67%", 10, C.orange, 700);
  text(frame, "逾期金额标题", 264, 96, "逾期总金额", 10, C.muted, 400);
  text(frame, "逾期金额", 264, 109, "411,800", 15, C.ink, 700);
  text(frame, "逾期金额单位", 327, 111, "元", 10, C.orange, 700);

  rect(frame, "搜索框", 14, 145, 270, 38, C.white, 19, "#E1E5EC");
  text(frame, "搜索图标", 25, 155, "⌕", 18, "#252932", 400);
  text(frame, "搜索占位文字", 48, 156, "客户姓名/维护人/状态/跟进人", 14, "#BDC3CE", 400);
  rect(frame, "搜索按钮", 232, 150, 47, 28, C.red, 14);
  text(frame, "搜索按钮文字", 244, 157, "搜索", 12, C.white, 700);
  rect(frame, "团队筛选按钮", 294, 150, 74, 28, "#252932", 14);
  text(frame, "团队筛选文字", 314, 157, "团队 6⌄", 12, C.white, 700);

  pill(frame, "状态筛选/全部", 14, 202, "全部 6", C.red, C.white, 73);
  pill(frame, "状态筛选/电催", 97, 202, "电催 2", C.white, "#5D6470", 67);
  pill(frame, "状态筛选/实地催收", 174, 202, "实地催收 2", C.white, "#5D6470", 91);
  pill(frame, "状态筛选/收车", 275, 202, "收车 1", C.white, "#5D6470", 67);

  let y = 248;
  customers.forEach((item, index) => {
    card(frame, item, 14, y, index);
    y += 170;
  });

  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin("逾期列表页已生成，可用 Axure Figma 插件复制到 RP。");
}

main();
