$(function() {
  var unit = 15;
  var c = document.getElementById('canvas');
  var cxt = c.getContext('2d');
  /* 绘制背景  */
  function drawBackground() {
    cxt.beginPath();
    for(var i = 0; i <= c.width; i += unit) {
      cxt.moveTo(i, 0);
      cxt.lineTo(i, c.width);
    }
    for(var i = 0; i <= c.height; i += unit) {
      cxt.moveTo(0, i);
      cxt.lineTo(c.height, i);
    }
    cxt.closePath();
    cxt.strokeStyle = '#f1d2a1';
    cxt.lineWidth = 1;
    cxt.stroke();
  };
  /* 清除画布并重新绘制背景  */
  function clearDraw() {
    cxt.clearRect(0, 0, c.width, c.height);
    drawBackground();
  };
  /* 绘制点  */
  function drawPoint(point) {
    cxt.fillStyle = '#9d1e39';
    cxt.fillRect(point.x * unit, point.y * unit, unit, unit);
  };
  /* 绘制蛇  */
  function drawSnake(snake) {
    cxt.fillStyle = '#764d0c';
    for(var i in snake.points) {
      if(i !== '0') {
        cxt.fillStyle = '#a3752d';
      }
      cxt.fillRect(snake.points[i].x * unit, snake.points[i].y * unit, unit, unit);
    }
  };
  /* 点类 */
  function Point(x, y) {
    this.x = typeof x === 'undefined' ? Math.floor(Math.random() * c.width / unit) : x;
    this.y = typeof y === 'undefined' ? Math.floor(Math.random() * c.height / unit) : y;
    this.isExist = true;
  };
  /* 蛇类 */
  function Snake(x, y, leg) {
    this.x = typeof x === 'undefined' ? Math.floor(Math.random() * (c.width / unit - 10)) + 5 : x;
    this.y = typeof y === 'undefined' ? Math.floor(Math.random() * (c.height / unit - 10)) + 5 : y;
    this.leg = leg || 3;
    this.points = []; //点集
    this.direction = Math.ceil(Math.random() * 4) + 36;
    this.integral = 0; //积分
    this.isOver = false; //是否结束
    this.speed = 200; //速度
    /* 行动 */
    this.action = function(point) {
      var x = this.points[0].x;
      var y = this.points[0].y;
      switch(this.direction) {
        case 37: //左
          x--;
          break;
        case 38: //上
          y--;
          break;
        case 39: //右
          x++;
          break;
        case 40: //下
          y++;
          break;
      }
      var p = new Point(x, y);
      if(x < 0 || x > (c.width / unit - 1) || y < 0 || y > (c.height / unit - 1) || this.isBite(p)) {
        this.isOver = true;
      } else {
        if(this.eat(point)) {
          point.isExist = false;
          this.integral += 10;
        } else {
          this.points.pop();
        }
        this.points.unshift(p);
      }
      $('.integral').find('em').text(this.integral);
    };
    /* 是否吃到东西 */
    this.eat = function(point) {
      var b = false;
      if(this.points[0].x === point.x && this.points[0].y === point.y) {
        b = true;
      }
      return b;
    };
    /* 是否有重合 */
    this.isBite = function(point) {
      var b = false;
      for(var i in this.points) {
        if(this.points[i].x === point.x && this.points[i].y === point.y) {
          b = true;
        }
      }
      return b;
    };
    /* 初始化 */
    this.init = function() {
      var points = [];
      for(var i = 0; i < this.leg; i++) {
        var p;
        switch(this.direction) {
          case 37: //左
            p = new Point(this.x + i, this.y);
            break;
          case 38: //上
            p = new Point(this.x, this.y + i);
            break;
          case 39: //右
            p = new Point(this.x - i, this.y);
            break;
          case 40: //下
            p = new Point(this.x, this.y - i);
            break;
        }
        points.push(p);
      }
      this.points = points;
    };
    this.init();
  };
  /* 加速 */
  function accelerate(snake) {
    if(time > 50) {
      time = snake.speed - snake.integral / 2;
    }
    if(intervalObj) {
      clearInterval(intervalObj);
    }
    intervalObj = setInterval(anima, time);
  };
  /* 动画效果 */
  function anima() {
    snake.action(point);
    if(!point.isExist) {
      point = new Point();
    }
    accelerate(snake);
    clearDraw();
    drawSnake(snake);
    drawPoint(point);
    if(snake.isOver) {
      alert('Game Over');
      clearInterval(intervalObj);
    }
  };
  /* 初始化  */
  function init() {
    clearDraw();
    drawSnake(snake);
    drawPoint(point);
    intervalObj = setInterval(anima, time);
  }

  var snake = new Snake();
  var point = new Point();
  var intervalObj;
  var timeOutObj;
  var time = snake.speed;
  init();

  $(document).on('keydown', fun = function(e) {
    var _this = $(this);
    if(timeOutObj) {
      clearTimeout(timeOutObj);
    }
    timeOutObj = setTimeout(function() {
      if(e.which >= 37 && e.which <= 40) {
        if(Math.abs(snake.direction - e.which) !== 2) {
          _this.off('keydown');
          setTimeout(function() {
            _this.on('keydown', fun);
          }, time);
          snake.direction = e.which;
        }
      }
      if(e.which === 13) {
        if(intervalObj) {
          clearInterval(intervalObj);
        }
        if(!snake.isOver) {
          intervalObj = setInterval(anima, time);
        }
      }
      if(e.which === 32) {
        clearInterval(intervalObj);
      }
    }, 10);
  });
});