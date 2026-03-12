# 3D Dimensions Documentation Pack

## 1. 文档目的

这套文档用于支持以下两类工作：

- 团队协作开发当前 `3D Dimensions` 功能
- 将当前 Demo 中的尺寸标注能力复制到几十个产品页面中

本目录不是单纯的“开发日志”，而是一套面向工程交付的文档包，覆盖：

- 架构说明
- 参数与配置规范
- 团队开发约定
- 测试与验收标准
- 多产品扩展与上线策略

## 2. 适用范围

当前适用于以下文件与页面：

- `C:\Users\tao.jiang\Documents\3D Web Project\ar-test\cabinet-viewer.html`

后续如果尺寸标注逻辑从单页中抽离为独立模块，也应继续沿用本目录中的设计原则与交付标准。

## 3. 阅读顺序

建议按以下顺序阅读：

1. [architecture.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/docs/dimensions/architecture.md)
2. [configuration-spec.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/docs/dimensions/configuration-spec.md)
3. [team-development-guide.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/docs/dimensions/team-development-guide.md)
4. [testing-and-qa.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/docs/dimensions/testing-and-qa.md)
5. [rollout-and-scale-plan.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/docs/dimensions/rollout-and-scale-plan.md)

## 4. 配套文档

历史背景与本次功能开发过程，参见：

- [DIMENSIONS_DEVELOPMENT_REPORT.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/DIMENSIONS_DEVELOPMENT_REPORT.md)
- [technical_documentation.md](C:/Users/tao.jiang/Documents/3D%20Web%20Project/ar-test/technical_documentation.md)

## 5. 当前状态

当前 `3D Dimensions` 功能已经满足以下状态：

- 手动旋转时尺寸线跟随正常
- 自动旋转时尺寸线跟随正常
- 三轴公共原点与三条轴终点均可通过参数微调
- 当前样式方案已冻结，可用于继续扩展产品

当前仍保留一项已知限制：

- 正面与背面视角下，尺寸线与模型边界的贴合感不完全一致

该限制已被接受，不作为本阶段阻塞项。

## 6. 文档维护要求

后续如果发生以下变更，必须同步更新本目录文档：

- 尺寸标注方案从 hotspot/SVG 改为其他实现
- `dimensionConfig` 参数结构发生变化
- 三轴原点选择逻辑发生变化
- 自动旋转刷新策略发生变化
- 功能从单页内联脚本抽离为模块

建议在每次合并相关 PR 时，检查本目录是否需要同步更新。
