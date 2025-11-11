## 概念
将盒子分成一个个格子，将子元素分配占多少个格子，以及占那几个格子，来分配布局
### 容器和项目
采用网格布局的区域，称为"容器"（container）。容器内部采用网格定位的子元素，称为"项目"（item）。
```html
<div>
  <div><p>1</p></div>
  <div><p>2</p></div>
  <div><p>3</p></div>
</div>
```
上面代码中，最外层的`<div>`元素就是容器，内层的三个`<div>`元素就是项目。

注意：项目只能是容器的顶层子元素，不包含项目的子元素，比如上面代码的`<p>`元素就不是项目。Grid 布局只对项目生效。
### 行和列
容器里面的水平区域称为"行"（row），垂直区域称为"列"（column）。
![grid](.//assets/grid/grid1.png)
### 单元格
行和列的交叉处为单元格
n 行、m 列，形成 n * m 个单元格
### 网格线
划分网格线的线, n * m格子包含 n + 1 横线、m + 1 纵线
![grid](./assets/grid/grid2.png)
## 属性
### 容器属性
#### display属性 
```html
// 块网格
{
    display: grid;
}
// 行内网格
{
    display: inline-grid;
}
```
#### grid-template-columns 属性，grid-template-rows 属性
属性参数空格分开有几个就是几行或几列。
**单位**
1. 实际像素
2. 百分比
3. fr(fraction 片段)，剩余空间比例平分
4. 当连续有重复时可以使用repeat(count, size)
5. minmax 关键字 minmax(min, max),不小于min，不大于max，优先级大于min-width、max-width
6. auto关键字，计算当前元素的宽度，如果有剩余空间，自适应扩展
7. 网格线命名通过[name]
```html
{
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 100px);
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: 1fr 1fr minmax(100px, 1fr); // 最小100px
    grid-template-columns: 100px auto 100px; // auto自适应
    grid-template-columns: [col]100px [col]auto [col]100px; // auto自适应
}
```
#### grid-row-gap 属性，grid-column-gap 属性，grid-gap 属性
格子之间的间距
```html
{
    display: grid;
    grid-row-gap: 20px;//间距20px
    grid-column-gap: 30px;//间距20px
    grid-gap: 20px 30px; //上面两者合并写法
}
```
#### grid-template-areas 属性
网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。grid-template-areas属性用于定义区域。不用区域用`.`占位
```html
.container {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px 100px;
    grid-template-areas: 'a a b'
                        'c c b'
                        'd d d';
                        '. . .'
    /* 四个有用区域分别 a b c d，一个无用区域 
     注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为区域名-start，终止网格线自动命名为区域名-end。

    比如，区域名为header，则起始位置的水平网格线和垂直网格线叫做header-start，终止位置的水平网格线和垂直网格线叫做header-end。*/
}
```
#### grid-auto-flow
排列顺序：按列排还是按行