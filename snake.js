var draw = function(snakeToDraw, apple) {
    var drawableSnake = { color: "#38ef7d", pixels: snakeToDraw };
    var drawableApple = { color: "#fff", pixels: [apple] };
    var drawableObjects = [drawableSnake, drawableApple];
    CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
    switch(segment.direction) {
        case "down":
          return { top: segment.top + 1, left: segment.left };
        case "up":
          return { top: segment.top - 1, left: segment.left };
        case "right":
            return { top: segment.top, left: segment.left + 1 }
        case "left":
            return { top: segment.top, left: segment.left - 1 }
        default:
          return segment;
      }
}

var segmentFurtherForwardThan = function(index, snake) {
    if (snake[index - 1] === undefined) {
      return snake[index];
    } else {
      return snake[index - 1];
    }
}
  
var moveSnake = function(snake) {
    return snake.map(function(oldSegment, segmentIndex) {
      var newSegment = moveSegment(oldSegment);
      newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
      return newSegment;
    });
} 

var growSnake = function(snake) {
    var indexOfLastSegment = snake.length - 1;
    var lastSegment = snake[indexOfLastSegment];
    snake.push({ top: lastSegment.top, left: lastSegment.left });
    return snake;
  }

  var advanceGame = function() {
    var newSnake = moveSnake(snake);
  
    if (ate(newSnake, snake)) {
      CHUNK.endGame();
      CHUNK.flashMessage("Alas! Your snake ate itself.");
    }
  
    if (ate(newSnake, [apple])) {
      newSnake = growSnake(newSnake);
      apple = CHUNK.randomLocation();
    }
  
    if (ate(newSnake, CHUNK.gameBoundaries())) {
      CHUNK.endGame();
      CHUNK.flashMessage("Wop wop. Your snake crashed.");
    }
  
    snake = newSnake;
    draw(snake, apple);
  }

var increaseSpeed = function(oldSpeed) {
    return oldSpeed + 80;
}
  

var changeDirection = function(direction) {
    snake[0].direction = direction;
  }

  var ate = function(snake, otherThing) {
    var head = snake[0];
    return CHUNK.detectCollisionBetween([head], otherThing);
  }

var snake = [{ top: 5, left: 0, direction: "down" }, { top: 4, left: 0, direction: "down" }, { top: 3, left: 0, direction: "down" }, { top: 2, left: 0, direction: "down" }, { top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
var apple = { top: 8, left: 10 };

CHUNK.executeNTimesPerSecond(advanceGame, 10);
CHUNK.onArrowKey(changeDirection);