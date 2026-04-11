export class CanvasDemo {
    private ctx: CanvasRenderingContext2D | null = null;
    // 方式1：使用 Path2D 对象存储路径 (推荐用于复用复杂路径)
    private trianglePath: Path2D = new Path2D();
    
    // 动画状态
    private x = 0;
    private speed = 2;
    private animationId: number | null = null;
    private width = 0;
    private height = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.initPath();
    }

    private initPath() {
        // 初始化三角形路径一次
        this.trianglePath.moveTo(50, 50);
        this.trianglePath.lineTo(150, 50);
        this.trianglePath.lineTo(100, 150);
        this.trianglePath.closePath();
    }

    /**
     * 启动动画循环
     */
    public animate() {
        if (!this.ctx) return;
        
        const loop = () => {
            // ❌ 方案1 (全量清除): 简单粗暴，但会把背景也擦掉，需要重绘背景
            // this.ctx!.clearRect(0, 0, this.width, this.height);

            // ✅ 方案2 (局部擦除 - 脏矩形): 只擦掉上一帧的紫色方块位置
            // 注意：这里擦的是上一帧的位置（还没有加 speed 之前的位置）
            // 缺点：擦除后那一块变透明了，如果下面有背景图，背景图就破了个洞
            // 但如果下面是纯白背景，这样做性能最高！
            
            // 擦除上一帧的位置 (如果不擦，就会变成长长的贪吃蛇)
            // 稍微扩大一点范围(x-1, width+2)防止留下细微残影
            this.ctx!.clearRect(50 + this.x - 1, 200 - 1, 50 + 2, 50 + 2);

            // 2. 更新状态
            this.x += this.speed;
            if (this.x > this.width - 50 || this.x < 0) {
                this.speed = -this.speed;
            }

            // 3. 只重绘紫色方块 (静态背景不用动！)
            this.ctx!.fillStyle = 'purple';
            this.ctx!.fillRect(50 + this.x, 200, 50, 50);

            // 4. 循环
            this.animationId = requestAnimationFrame(loop);
        };
        
        // 先画一次静态背景 (只画一次！以后再也不用重绘了)
        this.ctx.clearRect(0, 0, this.width, this.height); // 先全清空一次
        this.drawStaticBackground(); // 画背景

        loop();
    }

    public stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 将原来的 drawFrame 拆分
     * 专门画不动的背景
     */
    private drawStaticBackground() {
        if (!this.ctx) return;

        // --- 1. 原地复用路径 (蓝三角) ---
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke(this.trianglePath);

        // --- 2. 异地复用 (绿三角) ---
        this.ctx.save();
        this.ctx.translate(150, 0); 
        this.ctx.fillStyle = 'green';
        this.ctx.fill(this.trianglePath);
        this.ctx.restore();

        // --- 3. 函数封装 (橙三角) ---
        this.drawCustomTriangle(350, 50, 'orange');

        // --- 4. 红圆 ---
        this.ctx.beginPath();
        this.ctx.arc(550, 100, 40, 0, 2 * Math.PI); 
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }

    // 保留给外部调用看初始状态用
    public draw() {
        this.drawStaticBackground();
        // 画个初始位置的方块
        this.ctx!.fillStyle = 'purple';
        this.ctx!.fillRect(50, 200, 50, 50);
    }

    /**
     * 方式3：函数封装
     * 适合需要动态改变参数(如大小、坐标)的情况
     */
    private drawCustomTriangle(x: number, y: number, color: string) {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 100, y);
        this.ctx.lineTo(x + 50, y + 100);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}