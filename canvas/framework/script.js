const canvas = document.getElementById('canvas');
canvas.height = 600;
canvas.width = 800;
canvas.style.border = '1px solid black';
const ctx = canvas.getContext('2d');

const MathUtils = {
  objectContainsPoint(object, point) {
    return !(point.x > object.x + object.width || point.x < object.x || point.y > object.y + object.height || point.y < object.y);
  }
}

class CanvasObject {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
  }

  draw(ctx) {
    const { x, y, width, height } = this;
    ctx.fillRect(x, y, width, height);
  }
}

class MovingObject extends CanvasObject {
  constructor(options) {
    super(options);
    this.vx = options.vx;
    this.vy = options.vy;
  }

  step(timeDelta, walls) {
    this.x += this.vx * timeDelta;
    this.y += this.vy * timeDelta;
    if (walls.some(wall => wall.isIntersecting(this))) {
      this.x -= this.vx * timeDelta;
      this.y -= this.vy * timeDelta;
    }
  }
}

class Player extends MovingObject { //37 L, U, R , B
  constructor(options) {
    super(options);
    this.speed = 0.31;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.registerKeyListeners();
  }

  registerKeyListeners() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  handleKeydown(e) {
    switch (e.keyCode) {
      case 37:
        this.vx = -this.speed;
        break;
      case 38:
        this.vy = -this.speed;
        break;
      case 39:
        this.vx = this.speed;
        break;
      case 40:
        this.vy = this.speed;
        break;
      default:
        break;
    }
  }

  handleKeyup(e) {
    switch (e.keyCode) {
      case 37:
        if (this.vx === -this.speed) this.vx = 0;
        break;
      case 38:
        if (this.vy === -this.speed) this.vy = 0;
        break;
      case 39:
        if (this.vx === this.speed) this.vx = 0;
        break;
      case 40:
        if (this.vy === this.speed) this.vy = 0;
        break;
      default:
        break;
    }
  }
}

class Wall {
  constructor(options) {
    this.start = { x: options.startX, y: options.startY };
    this.finish = { x: options.finishX, y: options.finishY };
    this.thickness = 5;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.finish.x, this.finish.y);
    ctx.lineWidth = this.thickness;
    ctx.stroke();
  }

  get m() {
    if (this._m) return this._m;
    return this._m = (this.finish.y - this.start.y) / (this.finish.x - this.start.x);
  }

  get b() {
    if (this._b) return this._b;
    return this._b = this.start.y - this.start.x * this.m;
  }

  isIntersecting(object) {
    if (object.x + object.width < this.start.x && object.x + object.width < this.finish.x) return false;
    if (object.x > this.start.x && object.x > this.finish.x) return false;
    if (object.y + object.height < this.start.y && object.y + object.height < this.finish.y) return false;
    if (object.y > this.start.y && object.y > this.finish.y) return false;
    for (let x = this.start.x; x <= this.finish.x; this.start.x > this.finish.x ? x-- : x++) {
      if (MathUtils.objectContainsPoint(object, { x, y: this.m * x + this.b })) return true;
    }
    return false;
  }
}

class World {
  constructor(ctx) {
    this.ctx = ctx;
    this.objects = [];
    this.walls = [];

    this.animate = this.animate.bind(this);
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate);
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.lastTime = time;
    this.ctx.clearRect(0, 0, 800, 600);
    this.update(timeDelta);
    requestAnimationFrame(this.animate);
  }

  addObject(object) {
    this.objects.push(object);
  }

  addWall(wall) {
    this.walls.push(wall);
  }

  update(timeDelta) {
    this.objects.concat(this.walls).forEach(object => {
      object.step && object.step(timeDelta, this.walls);
      object.draw(this.ctx);
    });
  }
}

const world = new World(ctx);
const stillObject = new CanvasObject({ x: 50, y: 50, width: 25, height: 25 });
const movingObject = new MovingObject({ x: 50, y: 100, width: 25, height: 25, vx: 0, vy: 0 });
const player = new Player({ x: 50, y: 100, width: 25, height: 25, vx: 0, vy: 0 });

world.addObject(stillObject);
world.addObject(movingObject);
world.addObject(player);

world.start();
