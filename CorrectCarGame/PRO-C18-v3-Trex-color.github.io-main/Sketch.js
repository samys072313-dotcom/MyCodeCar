var PLAY=1;
var END=0;
var car;
var road, blocksGroup;
var conesGroup;
var road2;
var bg;
var block;
var spawnCones;
var spawnBlocks;
var spawnOver;
var gameState = PLAY;
var over;
var restart;
var scorebg;
var score = 0;
var boom;
var explosion;
var star;
var spawnStars;
var levelup;
var lastlevelupscore = 0;

function preload(){
    SUNimg=loadImage("car.jpeg");
    roadimg=loadImage("road - Copy.jpeg");
    road2img=loadImage("road - Copy.jpeg");
    blockimg=loadImage("block.jpeg");
    coneimg=loadImage("cone.jpeg");
    bgimg=loadImage("cargbg.webp");
    leftimg=loadImage("left.png");
    rightimg=loadImage("right.png");
    overimg=loadImage("gameOver.png");
    restartimg=loadImage("restart.png");
    scorebgimg=loadImage("score.jpg");
    boomimg=loadImage("boom.png");
    explosion=loadSound("barrel-exploding-soundbible.mp3");
    starimg=loadImage("star.avif");
    levelup=loadSound("collided.wav");
}
function setup(){
    createCanvas(windowWidth,windowHeight);
     bg=createSprite(800,500,1200,1200);
     road=createSprite(790,450,100,height+1000);
   road2=createSprite(796.4,1230,100,height+1000);
    car=createSprite(780,625,20,20);
    over = createSprite(800, 200, 50, 50);
    restart = createSprite(800, 400, 50, 50);
    scorebg = createSprite(178, 70, 50, 50);
    boom = createSprite(800, 500, 50, 50);
   car.addImage("img", SUNimg);
    road.addImage("img", roadimg);
    over.addImage("img", overimg);
    restart.addImage("img", restartimg);
    scorebg.addImage("img", scorebgimg);
    boom.addImage("img", boomimg);
    over.scale=2;
    restart.scale=0.2;
    scorebg.scale=0.43;
    scorebg.width=1000;
    road.x=width/2;
   road2.addImage("img", road2img);
    bg.addImage("img", bgimg);
    wallInv=createSprite(390,25,5,height+1000);
    wall2Inv=createSprite(1200,25,5,height+1000);
    left=createSprite(140,630,10,10);
    right=createSprite(1430,630,10,10);
    left.addImage("img", leftimg);
    right.addImage("img", rightimg);
    left.scale=0.6;
    right.scale=0.6;
    car.scale=1;
    road.scale=5.2;
   road2.scale=5.2;
    bg.scale=0.8;
car.depth=road2.depth;
    blocksGroup = new Group();
    conesGroup = new Group();
    starsGroup = new Group();
     
}
function draw(){
    background("gray");
    road2.depth=road.depth;
   road2.depth=road.depth+1;
   car.depth=conesGroup.depth;
   car.depth=conesGroup.depth+1;
    if (gameState===PLAY){
        car.collide(wallInv);
        car.collide(wall2Inv);
        over.visible=false;
        restart.visible=false;
        wall2Inv.visible=false;
        wallInv.visible=false;
        boom.visible=false;
        road.velocityY=7+4*score/1000;
        if (road.y>200){
    road.y=road.width/2;
    }
    if (keyDown("left")){
    car.x -= 40;
    }
    if (keyDown("right")){
    car.x += 40;
    }
    if (score%1000 == 0 && score != 0 && score !== lastlevelupscore){
         levelup.play();
         lastlevelupscore = score;
    }
    spawnBlocks();
    spawnCones();
    spawnStars();
    if (car.isTouching(starsGroup)){
        star.remove();
        score += 100;
    }
    if (blocksGroup.isTouching(car)){
        explosion.play();
        gameState = END;
    }
    if (conesGroup.isTouching(car)){
        explosion.play();
        gameState = END;
    }    
    }
    else if (gameState===END){
        over.visible=true;
        restart.visible=true;
        boom.visible=true;
        boom.depth=restart.depth-1;
        boom.x=car.x;
        road.velocityY=0;
        road2.velocityY=0;
        car.velocityX=0;
        blocksGroup.setVelocityYEach(0);
        conesGroup.setVelocityYEach(0);
        starsGroup.setVelocityYEach(0);
        if (keyDown("space")){
        reset();
        }
    }  
     drawSprites();

    fill("white");
    textSize(35);
    text("score: "+ score, 45, 73);
}
function spawnBlocks(){
    var x,y;
    var safe = false;
    while (!safe){
        x = random(-50,width -50);
        y = random(0,height -50);

        safe=true;

        for(var i=0; i<conesGroup.length; i++){
            var d=dist(x,y,conesGroup[i].position.x,conesGroup[i].position.y);
            if(d<80){
                safe=false;
                break;
            }
        }
    }
    if (frameCount%130 == 0){
     var block = createSprite(x, y, 20, 20);
   
    block.addImage("img",blockimg);
    block.scale=0.75;
   block.velocityY=7+4*score/1000;
  // block.depth=road.depth+1;
  block.depth=road2.depth;
  block.setCollider("circle", 0, 0, 5);
    road.depth=+1;
     block.lifetime = 300;

        blocksGroup.add(block);
    }
}
function spawnCones(){
    if (frameCount%180 == 0){
     var cone = createSprite(0, -100, 20, 20);
    cone.x=random(550,1000);
    cone.addImage("img", coneimg);
    cone.scale=0.5;
   cone.velocityY=7+4*score/1000;
  cone.depth=road2.depth;
    road.depth+1;
    cone.setCollider("circle", 0, 0, 5);
    conesGroup.collide(blocksGroup);
     cone.lifetime = 300;

       conesGroup.add(cone);
    }
}
function spawnStars(){
    if (frameCount%120 == 0){
      star = createSprite(0, -50, 20, 20);
    star.x=random(550,1000);
    star.addImage("img", starimg);
    star.scale=0.3;
   star.velocityY=7+4*score/1000;
  star.depth=road2.depth;
    road.depth+1;
    star.setCollider("circle", 0, 0, 5);
    starsGroup.collide(blocksGroup);
    starsGroup.collide(conesGroup);
     star.lifetime = 300;
       starsGroup.add(star);       
    }
}
function reset(){
    blocksGroup.destroyEach();
    conesGroup.destroyEach();
    starsGroup.destroyEach();
    score = 0;
    gameState = PLAY;
}