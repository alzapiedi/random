const WORLD_HEIGHT = 3000;
const WORLD_WIDTH = 3000;
const CAMERA_HEIGHT = 600;
const CAMERA_WIDTH = 800;
const CAMERA_SHIFT_SPEED = 0.2;
const OBJECT_COUNT = 80;
const OBJECT_RADIUS = 10;
const PLAYER_VELOCITY = 5;

const canvas = document.getElementById('canvas');
canvas.height = CAMERA_HEIGHT;
canvas.width = CAMERA_WIDTH;
canvas.style.border = '1px solid black';

class Game {
  constructor() {
    this.player = { x: 400, y: 300, vx: 0, vy: 0 };
    this.objects = [];
    this.generateObjects(OBJECT_COUNT);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  generateObjects(objectCount) {
    let x, y;
    let generatedCount = 0;
    while (generatedCount < objectCount) {
      x = Math.round(Math.random() * (WORLD_WIDTH - 2*OBJECT_RADIUS)) + OBJECT_RADIUS;
      y = Math.round(Math.random() * (WORLD_HEIGHT - 2*OBJECT_RADIUS)) + OBJECT_RADIUS;
      if (this.objects.every(object => Math.abs(object.x - x) > OBJECT_RADIUS && Math.abs(object.y - y) > OBJECT_RADIUS)) {
        this.objects.push({ x, y });
        generatedCount++;
      }
    }
  }

  movePlayer(timeDelta) {
    console.log(timeDelta);
    this.player.x += this.player.vx * timeDelta / 20;
    this.player.y += this.player.vy * timeDelta / 20;
  }

  drawPlayer(ctx, camera) {
    if (camera) {
      const playerPosition = camera.mode === Camera.MODE_FOLLOW ? { x: CAMERA_WIDTH / 2, y: CAMERA_HEIGHT / 2 } : camera.getPositionInCamera(this.player);
      ctx.fillRect(playerPosition.x, playerPosition.y, 10, 10);
      return;
    }
    ctx.fillRect(this.player.x, this.player.y, 10, 10);
  }

  handleKeyDown(keyCode) {
    switch(keyCode) {
      case 37:
        this.player.vx = -PLAYER_VELOCITY;
        break;
      case 38:
        this.player.vy = -PLAYER_VELOCITY;
        break;
      case 39:
        this.player.vx = PLAYER_VELOCITY;
        break;
      case 40:
        this.player.vy = PLAYER_VELOCITY;
        break;
    }
  }

  handleKeyUp(keyCode) {
    switch(keyCode) {
      case 37:
        this.player.vx = 0;
        break;
      case 38:
        this.player.vy = 0;
        break;
      case 39:
        this.player.vx = 0;
        break;
      case 40:
        this.player.vy = 0;
        break;
    }
  }

  drawObjects(ctx, camera) {
    let x, y, positionInCamera;
    this.objects.forEach(object => {
      if (camera && !camera.isObjectInRange(object)) return;
      ctx.beginPath();
      if (camera) {
        positionInCamera = camera.getPositionInCamera(object);
        ctx.arc(positionInCamera.x, positionInCamera.y, OBJECT_RADIUS, 0, Math.PI * 2);
      } else {
        ctx.arc(object.x, object.y, OBJECT_RADIUS, 0, Math.PI * 2);
      }
      ctx.fill();
    });
  }

  step(ctx, camera, timeDelta) {
    this.movePlayer(timeDelta);
    this.drawObjects(ctx, camera);
    this.drawPlayer(ctx, camera);
  }
}

class Camera {
  constructor(mode) {
    if (!Camera.MODES.some(validMode => mode === validMode)) throw new Error('Invalid camera mode');
    this.mode = mode;
    this.isTransitioning = false;
    this.xDelta = 0;
    this.yDelta = 0;
    this.xMax = CAMERA_WIDTH;
    this.xMaxTarget = CAMERA_WIDTH;
    this.xMin = 0;
    this.xMinTarget = 0;
    this.yMax = CAMERA_HEIGHT;
    this.yMaxTarget = CAMERA_HEIGHT;
    this.yMin = 0;
    this.yMinTarget = 0;
  }

  isObjectInRange(object) {
    return object.x >= this.xMin && object.x <= this.xMax && object.y >= this.yMin && object.y <= this.yMax;
  }

  getPositionInCamera(object) {
    if (!this.isObjectInRange(object)) throw new Error('Object is out of camera view');
    return { x: object.x - this.xMin, y: object.y - this.yMin };
  }

  update(player) {
    switch (this.mode) {
      case Camera.MODE_FOLLOW:
        this.xMin = player.x - CAMERA_WIDTH / 2;
        this.xMax = this.xMin + CAMERA_WIDTH;
        this.yMin = player.y - CAMERA_HEIGHT / 2;
        this.yMax = this.yMin + CAMERA_HEIGHT;
        break;
      case Camera.MODE_SHIFT:
        if (this.isTransitioning) {
          this.xMin = this.xMinTarget > this.xMin ? this.xMin + ((this.xMinTarget - this.xMin) * CAMERA_SHIFT_SPEED) : this.xMin - ((this.xMin - this.xMinTarget) * CAMERA_SHIFT_SPEED);
          this.xMax = this.xMaxTarget > this.xMax ? this.xMax + ((this.xMaxTarget - this.xMax) * CAMERA_SHIFT_SPEED) : this.xMax - ((this.xMax - this.xMaxTarget) * CAMERA_SHIFT_SPEED);
          this.yMin = this.yMinTarget > this.yMin ? this.yMin + ((this.yMinTarget - this.yMin) * CAMERA_SHIFT_SPEED) : this.yMin - ((this.yMin - this.yMinTarget) * CAMERA_SHIFT_SPEED);
          this.yMax = this.yMaxTarget > this.yMax ? this.yMax + ((this.yMaxTarget - this.yMax) * CAMERA_SHIFT_SPEED) : this.yMax - ((this.yMax - this.yMaxTarget) * CAMERA_SHIFT_SPEED);
          if (Math.abs(this.xMin - this.xMinTarget) < 1 && Math.abs(this.yMin - this.yMinTarget) < 1) {
            this.xMin = this.xMinTarget;
            this.xMax = this.xMaxTarget;
            this.yMin = this.yMinTarget;
            this.yMax = this.yMaxTarget;
            this.isTransitioning = false;
          }
          return;
        }
        if (this.xMax - player.x < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.xMinTarget = this.xMin + CAMERA_WIDTH - 2 * Camera.SHIFT_THRESHOLD;
          this.xMaxTarget = this.xMinTarget + CAMERA_WIDTH;
        }
        if (player.x - this.xMin < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.xMinTarget = this.xMin - CAMERA_WIDTH + 2 * Camera.SHIFT_THRESHOLD;
          this.xMaxTarget = this.xMinTarget + CAMERA_WIDTH;
        }
        if (this.yMax - player.y < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.yMinTarget = this.yMin + CAMERA_HEIGHT - 2 * Camera.SHIFT_THRESHOLD;
          this.yMaxTarget = this.yMinTarget + CAMERA_HEIGHT;
        }
        if (player.y - this.yMin < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.yMinTarget = this.yMin - CAMERA_HEIGHT + 2 * Camera.SHIFT_THRESHOLD;
          this.yMaxTarget = this.yMinTarget + CAMERA_HEIGHT;
        }
    }
  }
}

Camera.MODE_FOLLOW = 'F';
Camera.MODE_SHIFT = 'S';
Camera.SHIFT_THRESHOLD = 75;

Camera.MODES = [
  Camera.MODE_FOLLOW,
  Camera.MODE_SHIFT
];

class CanvasGameView {
  constructor(canvas, game, camera) {
    this.ctx = canvas.getContext('2d');
    this.game = game;
    this.camera = camera;
    this.lastTime = 0;
    this.setEventListeners();
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.lastTime = time;
    this.ctx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
    if (this.camera) this.camera.update(this.game.player);
    this.game.step(this.ctx, this.camera, timeDelta);
    requestAnimationFrame(this.animate.bind(this));
  }

  setEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode > 36 && e.keyCode < 41) e.preventDefault();
      this.game.handleKeyDown(e.keyCode);
    });
    window.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.game.handleKeyUp(e.keyCode);
    });
  }
}
window.gameview = new CanvasGameView(canvas, new Game(), new Camera(Camera.MODE_SHIFT));
