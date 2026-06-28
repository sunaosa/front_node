# Three\.js 大数据场景下的优化





### **几何体合并（Geometry Merging）**

1. **方案原理**：减少Draw Call次数，降低WebGL状态切换开销。

2. **实现**：
使用`BufferGeometryUtils.mergeBufferGeometries()`将多个相同材质的几何体合并为单一`BufferGeometry`。

3. **实质**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=OWZlMzE1MzA4Njg5ZGZjOWYzNjU3OWFiNjk5ZmY5ZmZfODI1ZmQyMzkxNjZkNGE5NmM3MjJiN2U2YWE2ZGJmNjlfSUQ6NzQ5MzQ3MjcxMjk3ODEzNzExNl8xNzgyNjM1ODA5OjE3ODI3MjIyMDlfVjM)

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ODkxMmEyNTcxY2EzZDg1YWIyZmRmY2Q3N2MxNjViZjdfNTMyNDFmNTdmYjAzYjk2MjFhNTdjZmEyNjRhNDMzNmNfSUQ6NzQ5MzQ3Mjk0MTk0NTI5MDc1Nl8xNzgyNjM1ODA5OjE3ODI3MjIyMDlfVjM)

4. **代码对比**：

```Plain Text
// 合并前
const mesh1 = new THREE.Mesh(geometry1, material);
const mesh2 = new THREE.Mesh(geometry2, material);

// 合并后
mergedGeometry = mergeBufferGeometries([geometry1, geometry2]);
const mergedMesh = new THREE.Mesh(mergedGeometry, material);
```

5. **性能提升**

---

### 实例化渲染（Instanced Rendering）

1. **方案原理：**

利用webgl的instancing，生成一份变化矩阵，cpu向gpu传输只需要传输一份几何体信息以及矩阵信息（位置，旋转，颜色等），减少了传输消耗并且只需要一次draw calls，并且可以通过instanceId拿到对应网格信息并修改矩阵信息利用GPU批量处理的能力来完成交互

2. **核心机制**：通过一次Draw Call渲染多个相似物体，共享几何体和材质，通过变换矩阵区分实例。

3. **Three\.js API**：

```Plain Text
// 创建实例化网格
const instanceCount = 10000;
const mesh = new THREE.InstancedMesh(geometry, material, instanceCount);
// 设置实例变换矩阵
const matrix = new THREE.Matrix4();
for (let i = 0; i < instanceCount; i++) {
    matrix.setPosition(x, y, z);
    mesh.setMatrixAt(i, matrix);
}
```

4. **实质**

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=Nzc0MDk0MjJkYTExNGU1OTdhODg1NDlmOGFkOTEyZGVfN2QzOWJjYmFlN2U1MzFmNzVkZWQ5Mzk1YzEwMTY2ODdfSUQ6NzQ5MzcyNDgxODg4NzAwMDA2NV8xNzgyNjM1ODA5OjE3ODI3MjIyMDlfVjM)

5. **扩展特性**：

    1. **实例颜色**：通过`instanceColor`属性传递RGB值

    2. **自定义属性**：使用`InstancedBufferAttribute`定义动画进度等参数。

6. **性能对比**

#### 【拓展优化】Shader

1. **原理**

    1. 定义：Shader 是 GPU 上运行的程序，用来告诉显卡“怎么画每个像素、每个顶点”。

Shader 是运行在 GPU 上的**小程序**（非常小）

用来控制 **顶点怎么变形**（位置、旋转）和 **像素怎么显示**（颜色、光照、纹理）

写出来像是一种 C 语言的简化版，叫做 **GLSL**（OpenGL Shading Language）。

2. 优化原理： gpu对于`vec3` `vec4`优化要优于`mat4`,并且只需要在cpu用Float32Array统计数据，直接传给gpu即可，减少了cpu上矩阵变化生成4\*4Float32Array 的过程。

2. **代码**

```java
const cubeMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                attribute vec3 instancePosition;
                attribute vec3 instanceColor;
                varying vec3 vColor;

                void main() {
                    vColor = instanceColor;
                    
                    // 关键修复：直接使用内置矩阵
                    vec4 worldPosition = modelMatrix * vec4(instancePosition, 1.0);
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                    
                    // 应用几何体顶点位置（重要！）
                    gl_Position += projectionMatrix * viewMatrix * vec4(position, 0.0);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
});
```

3. **实现**

**vertexShader**：每个 **顶点** 执行一次，用来控制点的位置，比如旋转、跳动、抖动等。

1. 执行变换矩阵：把 3D 坐标变成 2D 屏幕坐标

2. 实现顶点动画（如波浪、爆炸）

3. 给 `fragmentShader` 传参数（如 uv、颜色）

**fragmentShader**: 每个 **像素（片元）** 执行一次，用来决定它的**颜色**。

1. 渲染材质颜色 / 光照 / 阴影

2. 加载纹理

3. 实现特效：发光、渐变、噪声、边缘描边、火焰等

**流程**： 因为在 **GPU 渲染流程中**，`fragmentShader` 是没有办法直接访问像 `instanceColor` 这种 attribute 数据的。所以必须：attribute ➜ vertexShader ➜ varying ➜ fragmentShader。

---



### 多级细节（LOD）

**实现流程**

1. **模型预处理**：

    - 使用Blender的Decimate Modifier生成低模（面数减少50%\~90%）

    - 导出为多层级GLB文件（LOD0: 1000面, LOD1: 500面, LOD2: 100面）

2. **代码集成**：

```Plain Text
const lod = new THREE.LOD();// 添加不同距离层级的模型
lod.addLevel(highDetailModel, 50);   // 0-50单位：高模
lod.addLevel(mediumDetailModel, 150); // 50-150单位：中模
lod.addLevel(lowDetailModel, 300);  // 150-300单位：低模
scene.add(lod);
```

3. **动态更新**：
在`requestAnimationFrame`中计算相机距离并触发LOD切换：

4. javascript

5. 复制

6. function updateLOD\(\) \{
  lod\.update\(camera\);\}

**优化效果**

### 视锥体剔除（Frustum Culling）

1. **原理：**不渲染视锥体之外的物体

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MjExYjc5NjUyM2Y3MjUwMTMxMDYxYzFiNmNkODFmYWFfNDZmMDI4NjljNTU1OWZlNGYyMDFmZTM5NWZmY2VkODBfSUQ6NzQ5MzgyNDg3MjAzMDYwMTIxOF8xNzgyNjM1ODA5OjE3ODI3MjIyMDlfVjM)

2. **目的： **提高渲染性能，减少不必要的绘制。

3. **基础方案**：

    1. 默认方案\(物体包围球, 旋转后容易出现问题\)

    ```java
    // 启用内置剔除（默认已启用）
    const renderer = new THREE.WebGLRenderer();
    renderer.localClippingEnabled = true; // 增强剔除精度
    
    // 所有Mesh自动参与剔除
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
    );
    box.frustumCulled = true; // 默认即为true
    ```

    2. 手动方案精确度

    ```javascript
    const frustum = new THREE.Frustum();
    const viewProjection = new THREE.Matrix4();
    function updateFrustum() {
          viewProjection.multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
          );
          frustum.setFromProjectionMatrix(viewProjection);
     }
    function checkVisibility(mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        return frustum.intersectsBox(box);
    }// 使用updateFrustum();
    scene.traverse(child => {
        if (child.isMesh) {
            child.visible = checkVisibility(child);
        }
    });
    ```

    3. 八叉树空间加速

    原理：优先对比节点与视锥体的碰撞。

    截至条件： 最大深度限制、最小包围盒尺寸限制、当前节点内的物体数量已足够少）

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZTdjNDRhZjBjZDIyYTk0Njc3YWUzZGVjMTI3ZjcyZDJfNDJjYzFiMTU5NjRhZGJjY2FlYTI3YjVjNWM3ZGNjZTJfSUQ6NzQ5NDA5MTczNjc1Njk5NDA1MF8xNzgyNjM1ODA5OjE3ODI3MjIyMDlfVjM)

    

    ```Plain Text
    import { Octree } from 'three/examples/jsm/math/Octree';
    // 构建八叉树
    const octree = new Octree();
    octree.fromGraphNode(scene);
    // 剔除检测
    const visibleObjects = octree.search(frustum);
    scene.traverse(obj => {
      obj.visible = visibleObjects.has(obj);
      }
    );
    ```

性能影响

---

### 分块加载（Chunked Loading）

1. **原理**

分块加载技术的核心在于平衡**内存占用**、**加载速度**和**视觉连续性**。现代引擎通常采用混合策略，结合预测性预加载和后台线程处理，实现无缝的大世界体验。

2. **实现方案**

    1. 均匀网格分块（Uniform Grid）：将场景划分为大小相同的立方体区块

    2. 动态八叉树分块（Octree）：和上述相同与视锥体结合使用

    3. 层次化LOD分块（HLOD）：将远处的区块进行低模处理

    4. 流式分块（Streaming）: 从服务器拉取区块

3. **性能对比**



---

### 分帧处理（Time Slicing）

1. **原理：**

将一帧处理完成的内容通过分到多帧渲染，防止一帧渲染卡顿。

1. **性能提升**

### 相关示例

<div>
    <a :href="`${reactDemoUrl}/chunck.html`" target="_blank">Chunk Grid Example</a>
</div>
<div>
    <a :href="`${reactDemoUrl}/frame.html`" target="_blank">Three.js 逐帧渲染</a>
</div>
<div>
    <a :href="`${reactDemoUrl}/instanced.html`" target="_blank">InstancedBufferAttribute</a>
</div>
<div>
    <a :href="`${reactDemoUrl}/LOD2.html`" target="_blank">1000 Squares with LOD</a>
</div>
<div>
    <a :href="`${reactDemoUrl}/mergeBufferGeometries.html`" target="_blank">Three.js 性能对比：合并几何体 vs 独立渲染</a>
</div>

<script setup>
const reactDemoUrl = import.meta.env.VITE_THREE_DEMO
console.log('VITE_THREE_DEMO:', reactDemoUrl)
</script>



