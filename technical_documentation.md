# 3D 悬浮柜配置器 - 把手(Handle)模块开发技术档案

这份档案记录了在开发 `<model-viewer>` 3D 悬浮柜配置器时，关于把手（Handle）切换与颜色材质动态修改模块的完整开发历程、踩坑记录及解决方案。

## 1. 核心需求背景

用户可以在网页侧边栏操作：
1. **切换把手款式 (Handle Style)**: 在 “OVA 350” 和 “Wave Pull” 之间自由切换。
2. **切换把手材质 (Handle Colour)**: 切换后的把手需要能够动态应用真实物理材质贴图（如：Matte Black, Brushed Gold 等）。
3. **初始化加载**: 3D模型首次加载时，不显示 GLTF 内置的灰色材质，而是自动应用 UI 列表中选中的第一个默认材质。

---

## 2. 开发过程中遇到的问题与详细解决方案

开发把手切换逻辑时，遇到了几个典型的 3D Web 渲染与数据结构冲突的深坑。

### Bug 1: 把手模型变成“超级大物体”
* **现象**：当使用 `node.visible = true` 试图让隐藏的 OVA 把手显示出来时，把手模型突然膨胀了几百倍，破坏了整个画面。
* **原因分析**：早期的代码试图在使用 `.visible` 的同时，“重置”它的比例：`node.scale.set(1, 1, 1)`。然而，在原始的 Blender 建模中，部分组件已经被等比缩小过了（真实比例可能是 `0.001` 等）。在 Three.js 中强制将 Scale 设置为 `1` 会导致它的物理尺寸暴增。
* **解决方案**：引入了 **Scale 记忆恢复机制**。程序在首次遍历模型结构时，会读取并缓存在 `node.userData.originalScale` 中。后续切换显示把手时，只恢复为其**原始缓存的 Scale**，而非绝对值 `1`。

### Bug 2: 动画系统强制覆盖 `visible` 属性，导致把手无法隐藏
* **现象**：在切换为 Wave 把手后，试图将 OVA 把手的 `.visible` 设为 `false`，但 OVA 把手依然顽固地显示在屏幕上，导致两个把手重叠。
* **原因分析**：因为模型中带有“抽屉开关 (Drawer_Open_Close)” 的关键帧动画。Three.js 动画系统 (AnimationMixer) 原理是在每一帧**强行重写/更新**骨骼与节点的可见性和变形属性。因此即使我们在 JS 逻辑中把它设为 `false`，下一帧动画引擎立刻就把它的 `visible` 改回了 `true`。
* **解决方案**：为了避开骨骼动画引擎对 Boolean 值的反复覆写，我们将不需要显示的物体采用“绝对物理隐身”法 —— 即不仅仅设置 `.visible = false`，更重要的是将它的 Scale 强行拍为 `node.scale.set(0, 0, 0)`。这样即便动画引擎让它“显示”出来了，它的体积也是0，完美解决了模型堆叠幽灵问题。

### Bug 3: `Nova Pro Scala` 抽屉被误杀（模糊匹配引起）
* **现象**：切换把手时，整个抽屉的五金件甚至滑轨都发生了闪烁或异常隐藏。
* **原因分析**：早期的名称匹配逻辑试图用 `.includes('ova')` 来寻找 `OVA 350`。但是 `Nova Pro Scala` 抽屉的名字里包含了 `nova`，触发了全词匹配被强行处理了显隐逻辑。
* **解决方案**：收窄了靶向白名单，现在由 `MESH_NODE_MAP` 字典严格控制只寻找 `["ova350", "body1006"]` 和 `["350mmwave", "body1008"]` 这几个极具指向性的节点名称，避免污染内外部结构件。

### Bug 4: 导出 GLTF 时丢失 `Wave Pull` 节点
* **现象**：代码设置了寻找 `Body1.008` (也就是 Blender 里的 Wave 把手)，但在控制台遍历时死活找不到该节点。
* **原因分析**：通过编写 Python 脚本 (`dump_gltf.py`) 解析原始 `testmotion9.glb` 二进制文件后发现，导出的字典树里确实没有该节点。这是因为在 Blender 中导出 GLTF 时，如果某个 Collection / Mesh 的“显示器”或“相机”图标被关闭，导出器会直接省略该物体的数据块以节省空间。
* **解决方案**：在 Blender 环境中重新检查 Outliner 激活了 Wave 把手，并将其实例直接绑定至受动画约束的父骨骼下，再次导出为 `testmotion10.glb` 即可恢复节点读取。

---

## 3. 当前架构与数据结构

核心驱动主要由两组配置常量在 `js/products.js` 和 `js/materials.js` 中维护。

### 1. `MESH_NODE_MAP` (节点路由与显隐控制表)
*定义于 cabinet-viewer.html*
用于定义UI分类对应的**Three.js (GLTF)** 真实节点内部名称（已通过正则表达式做去标点及小写清洗）。
```javascript
const MESH_NODE_MAP = {
  "OVA 350": ["ova350", "body1006"],
  "Wave Pull": ["350mmwave", "body1008"]
};
```

### 2. `CATEGORY_CONFIG` (组件挂载选项表)
*定义于 js/products.js*
解耦了产品与材质，说明了每种款式拉手可选的**高清材质(Texture)**。
```javascript
const CATEGORY_CONFIG = {
    "handles": {
        "OVA 350": ["HARDWARE Black", "HARDWARE Brushed Gold", "HARDWARE Brushed Nickel", "HARDWARE Chrome"],
        "Wave Pull": ["HARDWARE Black", "HARDWARE Brushed Gold", "HARDWARE Brushed Nickel", "HARDWARE Chrome"]
    },
    ...
};
```

### 3. `MATERIAL_LIBRARY` (全局材质色卡库)
*定义于 js/materials.js*
集中管理所有动态材质资源，配合全局 **Texture Caching (纹理贴图缓存)** 技术，确保每张高清图片（如 12MB 的 Chrome贴图）在整个生命周期内只被 `await viewer.createTexture()` 读取一次，彻底消除切换卡顿和内存泄漏。
```javascript
"HARDWARE Brushed Gold": {
  "type": "texture",
  "name": "Brushed Gold",
  "texture": "./assets/textures/Hardware/HARDWARE Brushed Gold.jpg",
  "usdz": "./testmotion9.usdz", // AR Extension Source
  "roughness": 0.3              // PBR Roughness Factor
}
```

---

## 4. 重点测试用例与验证结果

| 测试内容 | 预期结果 | 实际执行结果 |
| :--- | :--- | :--- |
| **测试1: 动画进行中的把手来回切换** | 点击不同款式后，旧把手立即消失，新把手瞬间呈现，且不破坏抽屉开拉动画，不能有形变。 | **通过**。结合了 `Scale(0,0,0)` 与 `Restore Original Scale` 双轨机制，把手完美替换且跟随抽屉动画。 |
| **测试2: 多材质瞬间频繁切换（压力测试）** | 用户在四种高清 Handle Texture 之间疯狂快速来回点击，不能造成浏览器内存崩溃或者画面拉丝。 | **通过**。加入了 `textureCache` HashMap 缓存逻辑拦截网络和解析开销，实现0毫秒热切。 |
| **测试3: "与柜体同色" 同步更新响应测试** | 点击更换 Cabinet (柜体) 材质时，Top (台面) 材质必须即时更新，并且 Top UI 栏中原本选中的色块要被清除高亮，避免误导用户。 | **通过**。在 DOM 更新层增加了 `toggleCategory` 子项清除逻辑，保持 UI DOM state 与 3D 渲染表现一致。 |
| **测试4: 首屏进入初始化贴图测试** | 首屏刚载入完成 (Loading 结束瞬间)，不暴露未经渲染配置的原生材质 (模型预烘焙贴图)，必须自动刷上选中分类的第一款材质。 | **通过**。优化了 `viewer.addEventListener('load')` 的时序逻辑，引入了 50ms 延迟确保缓存与队列全部就绪后再触发 `firstHandleColor.click()` 自动配置指令。 |

*—— 记录时间: 2026年3月*
