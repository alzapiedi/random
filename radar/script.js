const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 500;
canvas.width = 500;
canvas.style.border = '1px solid black';

class CanvasObject {
  constructor(options = {}) {
    this.x = options.x ? options.x : options.x === 0 ? 0 : 50;
    this.y = options.y ? options.y : options.y === 0 ? 0 : 50;
    this.width = options.width || 10;
    this.height = options.height || 10;
    this.angle = options.angle || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.vr = options.vr || 0;
  }

  step(timeDelta) {
    this.x += this.vx * timeDelta;
    this.y += this.vy * timeDelta;
    this.angle += this.vr * timeDelta;
    if (this.angle > Math.PI) this.angle -= Math.PI;
  }

  setVelocity(options) {
    if (options.vx) this.vx = options.vx;
    if (options.vy) this.vy = options.vy;
    if (options.vr) this.vr = options.vr;
  }
}

class CanvasRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.objects = [];
    this.objectColor = [];
    this.animate = this.animate.bind(this);
  }

  start() {
    this.lastTime = new Date().valueOf();
    requestAnimationFrame(this.animate);
  }

  draw(object, i) {
    const { x, y, width, height, angle } = object;
    const lastObjectColor = this.objectColor[i] || this.generateColor();
    const objectColor = this.updateColor(lastObjectColor);
    this.objectColor[i] = objectColor;
    this.ctx.save();
    this.ctx.translate(x + width / 2, y + height / 2);
    this.ctx.rotate(angle);
    this.ctx.fillStyle = objectColor;
    this.ctx.fillRect(-width/2, -height/2, width, height);
    this.ctx.restore();
  }

  animate(time) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const timeDelta = time - this.lastTime;
    this.lastTime = time;
    this.objects.forEach((obj, index) => {
      obj.step(timeDelta);
      this.draw(obj, index);
    });
    requestAnimationFrame(this.animate);
  }

  addObject(obj = new CanvasObject()) {
    this.objects.push(obj);
  }

  generateColor() {
    const values = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    let string = '#';
    for (let i = 0; i < 6; i++) {
      string += values[Math.floor(Math.random() * values.length)];
    }
    return string;
  }

  updateColor(color) {
    let string = '#';
    for (let i = 1; i < 7; i++) {
      string += this.getSimilarValue(color[i]);
    }
    return string;
  }

  getSimilarValue(value) {
    const values = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    const index = values.indexOf(value);
    if (index === 0) return '1';
    if (index === 15) return 'e';
    return Math.random() > 0.5 ? values[index + 1] : values[index - 1];
  }

  addRandomSpinningSquare(size) {
    let obj = new CanvasObject({x: (500 - size) / 2, y: (500 - size) / 2, width: size, height: size, angle: Math.random() * 3, vr: (Math.random() - 0.5) / 250})
    this.addObject(obj);
  }

  makeItNasty(x = 10) {
    let size = 500;
    while (size > x) {
      this.addRandomSpinningSquare(size);
      size -= x;
    }
  }
}
let lastSize = null;
window.renderer = new CanvasRenderer(ctx);
renderer.start();
