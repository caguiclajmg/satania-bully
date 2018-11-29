var image = document.getElementById('img-main');
var music = document.getElementById('audio-music');
var audioSlap = document.getElementById('audio-slap');

var animations = {};
var currentAnimation = 'idle';
var currentFrame = 0;

function Point(x, y) {
    return {x: x, y: y};
}

function loadAnimationSet(name, count) {
    var frames = new Array(count);

    for(var i = 0; i < count; ++i) {
        frames[i] = new Image();
        frames[i].src = 'static/images/' + name + '/' + i + '.png';
    }

    return frames;
}

function loadAnimationSets() {
    animations['idle'] = loadAnimationSet('idle', 1);
    animations['slap-left'] = loadAnimationSet('slap-left', 4);
    animations['slap-right'] = loadAnimationSet('slap-right', 4);
}

function tick() {
    if(music.paused) music.play();

    if(currentFrame < animations[currentAnimation].length - 1) currentFrame++;
    image.src = animations[currentAnimation][currentFrame].src;
}

function actionDown(position) {
    swipeTimer = Date.now();
    swipeStartPosition = position;
}

function actionUp(position) {
    var timeDelta = Date.now() - swipeTimer;
    var positionDelta = Point(position.x - swipeStartPosition.x, position.y - swipeStartPosition.y);
    var velocity = Point(positionDelta.x / timeDelta, positionDelta.y / timeDelta);

    if(velocity.x < -0.5 && velocity.y > 0.5 && currentAnimation != 'slap-left') {
        currentAnimation = 'slap-left';
        currentFrame = 0;
        audioSlap.play();
    } else if(velocity.x > 0.5 && velocity.y < -0.5 && currentAnimation != 'slap-right') {
        currentAnimation = 'slap-right';
        currentFrame = 0;
        audioSlap.play();
    }
}

function absorbEvent(e) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

var swipeTimer = Date.now();
var swipeStartPosition = Point(0, 0);

loadAnimationSets();

image.src = animations[currentAnimation][currentFrame].src;
image.addEventListener('dragstart', function(e) { e.preventDefault(); });
image.addEventListener('contextmenu', absorbEvent);
image.addEventListener('touchstart', function(e) { actionDown(Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY)); });
image.addEventListener('touchend', function(e) { actionUp(Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY)); });
image.addEventListener('mousedown', function(e) { actionDown(Point(e.offsetX, e.offsetY)); });
image.addEventListener('mouseup', function(e) { actionUp(Point(e.offsetX, e.offsetY)); });

setInterval(tick, 75);