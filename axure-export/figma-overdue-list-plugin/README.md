# Figma 逾期列表页生成插件

用途：在 Figma 中生成一个可编辑的逾期列表页 Frame，然后通过 Axure 官方 Figma 插件复制到 Axure RP 9。

## 使用步骤

1. 打开 Figma 桌面版。
2. 菜单选择 `Plugins` -> `Development` -> `Import plugin from manifest...`。
3. 选择本文件夹里的 `manifest.json`。
4. 运行插件 `车乐租-逾期列表页生成器`。
5. 插件会创建一个名为 `逾期列表页 - Axure可复制` 的 Frame。
6. 在 Figma 中安装并运行 Axure 官方插件。
7. 选中生成的 Frame，执行 `Copy Selection for RP`。
8. 回到 Axure RP 9，直接粘贴。

## 说明

- 生成内容使用 Figma 原生矩形、文字、线条等图层。
- 复制到 Axure 后比 SVG 转换更接近可编辑控件。
- 页面无交互，仅用于视觉和结构还原。
- 当前逾期列表包含 8 条客户数据，方便展示更多列表状态。
