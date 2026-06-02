# 逾期列表页 Axure 可编辑导入稿

文件：

- `overdue-list-axure-editable.svg`
- `overdue-list-axure-editable-v2.svg`
- `overdue-list-axure-editable-v3-text-outline.svg`

使用方式：

1. 打开 Axure。
2. Axure 9.0.03741 优先将 `overdue-list-axure-editable-v3-text-outline.svg` 拖入页面。
3. 右键 SVG，选择 `Convert SVG to Shapes`。
4. 转换后可编辑文字、矩形、标签、分割线等元素。

说明：

- 该文件按 390x900 手机画布重建逾期列表首屏。
- 主要元素使用 SVG 原生文字、矩形、线条和路径，便于导入 Axure 后拆分编辑。
- `v2` 版本去掉了 CSS class 和分组 transform，所有文字都使用绝对坐标和内联样式，适合 Axure 转换后保持文字位置。
- `v3` 版本将所有文字转成矢量轮廓路径，专门规避 Axure 9 文字堆叠问题。文字位置最稳定，但文字不再是文本框，而是可编辑形状。
- 交互未包含，仅保留视觉样式和页面结构。
