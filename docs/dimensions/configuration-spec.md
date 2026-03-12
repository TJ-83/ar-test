# 3D Dimensions Configuration Specification

## 1. 配置入口

当前尺寸功能的核心配置入口为：

- `dimensionConfig`

位置：

- `C:\Users\tao.jiang\Documents\3D Web Project\ar-test\cabinet-viewer.html`

## 2. 配置目标

该配置用于把“可维护的调参点”从具体绘制逻辑中分离出来。

配置项必须满足：

- 含义单一
- 修改后行为可预期
- 能支持不同产品的局部微调

## 3. 当前配置结构

```js
const dimensionConfig = {
  originWorldOffsetX: 0.02,
  originWorldOffsetY: 0.06,
  originWorldOffsetZ: -0.07,

  wEndOffsetX: -0.06,
  wEndOffsetY: 0,
  wEndOffsetZ: 0,

  hEndOffsetX: 0,
  hEndOffsetY: -0.04,
  hEndOffsetZ: 0,

  dEndOffsetX: 0,
  dEndOffsetY: 0,
  dEndOffsetZ: 0.01,

  screenShiftX: -96,
  screenShiftY: -78,
  labelOffset: 10
};
```

## 4. 配置项定义

### 4.1 原点偏移

- `originWorldOffsetX`
- `originWorldOffsetY`
- `originWorldOffsetZ`

用途：

- 控制三轴公共原点在模型 3D 空间中的位置

建议：

- 优先先调这一组，再调终点

### 4.2 宽度线终点偏移

- `wEndOffsetX`
- `wEndOffsetY`
- `wEndOffsetZ`

用途：

- 单独调整宽度线终点位置
- 主要用于控制 `W` 线长度和贴边程度

常用主调项：

- `wEndOffsetX`

### 4.3 高度线终点偏移

- `hEndOffsetX`
- `hEndOffsetY`
- `hEndOffsetZ`

用途：

- 单独调整高度线终点位置
- 主要用于控制 `H` 线长度和贴边程度

常用主调项：

- `hEndOffsetY`

### 4.4 深度线终点偏移

- `dEndOffsetX`
- `dEndOffsetY`
- `dEndOffsetZ`

用途：

- 单独调整深度线终点位置
- 主要用于控制 `D` 线长度和贴边程度

常用主调项：

- `dEndOffsetZ`

### 4.5 屏幕空间偏移

- `screenShiftX`
- `screenShiftY`

用途：

- 控制整组三轴在屏幕空间中的整体位置

说明：

- 这组参数不改变真实 3D 几何关系
- 只影响最终视觉排布

### 4.6 标签偏移

- `labelOffset`

用途：

- 控制文字离尺寸线的距离

## 5. 建议调参顺序

标准调参顺序如下：

1. `originWorldOffset*`
2. `wEndOffset* / hEndOffset* / dEndOffset*`
3. `screenShiftX / screenShiftY`
4. `labelOffset`

原因：

- 先定几何结构
- 再定每条线
- 最后做 UI 微调

## 6. 参数调整建议

### 6.1 3D 偏移步长

建议每次调整：

- `0.01` 到 `0.03`

不要一次跨太大，否则很难判断到底哪项变化起作用。

### 6.2 屏幕偏移步长

建议每次调整：

- `5` 到 `15` 像素

## 7. 多产品扩展建议

当功能扩展到几十个产品时，不建议继续把配置写死在 HTML 中。

推荐演进为：

```js
const DIMENSION_PRESETS = {
  "SOB-B-500-602": { ... },
  "SOB-B-600-602": { ... },
  "SOB-W-800-700": { ... }
};
```

然后在页面初始化时根据产品 SKU 读取对应 preset。

## 8. 配置变更要求

团队协作时，任何对 `dimensionConfig` 结构的变更都应满足：

- 更新本规范文档
- 在 PR 中明确说明变更原因
- 说明是否会影响已有产品 preset

## 9. 禁止事项

后续团队开发中，应避免以下做法：

- 在绘制函数中继续散落魔法数字
- 不写说明地直接改参数意义
- 用一个参数同时影响原点和多条线终点
- 为单个产品写一次性 if/else 特判而不沉淀为配置
