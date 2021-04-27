var path, mainCyclist, oppCyclist, bomb, children, hole, tree, restart, bgSound, outSound;
var pathImg, mainRacerImg1, mainRacerImg2, oppCyclistImg, bombImg, childrenImg, holeImg, treeImg, restartImg;
var oppCyclistPlayerObstacleGroup;

var END = 0;
var PLAY = 1;
var gameState = PLAY;

var lives = 5;

var gameStateS = 'sound';

var distance = 0;

function preload() {
  pathImg = loadImage("Road.png");
  mainRacerImg1 =   loadAnimation("mainPlayer1.png","mainPlayer2.png");
  mainRacerImg2 = loadImage("mainPlayer3.png");
  bellSound = loadSound("bell.mp3");
  oppCyclistImg = loadAnimation("Cyclist1.png", "Cyclist2.png");
  oppCyclistImg2 = loadImage("Cyclist3.png");
  bombImg = loadImage("bomb.png");
  childrenImg = loadImage("children.png");
  holeImg = loadImage("hole.png");
  treeImg = loadImage("tree.png");
  restartImg = loadImage("restart.png");
  bgSound = loadSound("bgSound.wav");
  outSound = loadSound("outSound.wav");
}

function setup() {
  
  createCanvas(500,300);
  
  // Moving background
  path = createSprite(100,150);
  path.addImage(pathImg);
  path.velocityX = -5;

  // Creating boy running
  mainCyclist = createSprite(70,150,20,20);
  mainCyclist.addAnimation("SahilRunning", mainRacerImg1);
  mainCyclist.scale = 0.07;
  
  // Creating boy running
  restart = createSprite(250,150,20,20);
  restart.addAnimation("restart", restartImg);
  restart.scale = 0.15;
  restart.visible = false;
  
  bgSound.setVolume = 0.4;
  outSound.setVolume = 0.2;
  
  // mainCyclist.debug = true;
  mainCyclist.setCollider("rectangle", -5, 0, 40, 40);
  
  oppCyclistPlayerObstacleGroup = new Group();
  
}

function draw() {
  background(0);
  
  drawSprites();
  textSize(20);
  fill(255);
  text("Distance: "+ distance + "m", 320, 30);
  text("Lives: "+ lives, 200, 30);
  
  if(gameState == PLAY) {
    path.velocityX = -(8 + 2 * distance/100);
  
    mainCyclist.y = World.mouseY;
    
    distance = distance + Math.round(getFrameRate() / 60);

    edges = createEdgeSprites();
    mainCyclist.collide(edges);
    
    if(keyDown("space")) {
      bellSound.play();
    }
    
    spawnObstacles();

    //code to reset the background
    if(path.x < 23) {
      path.x = width/2;
    } 
    
    if(gameStateS == "sound") {
      bgSound.loop();
      gameStateS = "mute";
    }
    
    if(oppCyclistPlayerObstacleGroup.isTouching(mainCyclist)) {
      lives-=1;
      oppCyclistPlayerObstacleGroup.destroyEach();
      outSound.play();
    }
    
    if(lives == 0) {
      gameState = END;
      outSound.play();
    }
  }
  
  if(gameState == END) {
    restart.visible = true;
    bgSound.stop();
    reset();
    if(mousePressedOver(restart)) {
      restart.visible = false;
      gameState = PLAY;
      oppCyclistPlayerObstacleGroup.destroyEach();
      mainCyclist.addAnimation("SahilRunning", mainRacerImg1);
      bgSound.play();
      score = 0;
      lives = 5;
    }
  }
}

function opponent() {
  oppCyclist = createSprite(1100, Math.round(random(50, 250)));
  oppCyclist.scale = 0.07;
  oppCyclist.addAnimation("opponentPlayer", oppCyclistImg);
  oppCyclist.setLifetime = 100;
  oppCyclist.velocityX = -(8 + 2 * distance/100);
  
  // if(oppCyclist.isTouching(mainCyclist)) {
  //   oppCyclist.addImage("opponentPlayer", oppCyclistImg2);
  // }
  oppCyclistPlayerObstacleGroup.add(oppCyclist);
}

function bombs() {
  bomb = createSprite(1100, Math.round(random(50, 250)));
  bomb.scale = 0.07;
  bomb.addAnimation("bomb", bombImg);
  bomb.setLifetime = 100;
  bomb.velocityX = -(8 + 2 * distance/100);
  
  oppCyclistPlayerObstacleGroup.add(bomb);
}

function childrenF() {
  children = createSprite(1100, Math.round(random(50, 250)));
  children.scale = 0.073;
  children.addAnimation("children", childrenImg);
  children.setLifetime = 100;
  children.velocityX = -(8 + 2 * distance/100);
  // children.debug = true;
  
  oppCyclistPlayerObstacleGroup.add(children);
}

function trees() {
  tree = createSprite(1100, Math.round(random(50, 250)));
  tree.scale = 0.1;
  tree.addAnimation("tree", treeImg);
  tree.setLifetime = 100;
  tree.velocityX = -(8 + 2 * distance/100);
  
  oppCyclistPlayerObstacleGroup.add(tree);
}

function spawnObstacles() {
  var rand = Math.round(random(1, 4));
  if(frameCount % 80 == 0) {
    if(rand == 1) {
      opponent();
    } else if(rand == 2) {
        bombs();
    } else if(rand == 3) {
        childrenF();
    } else if(rand == 4) {
        trees();
    }
  }
} 

function reset() {
  mainCyclist.addImage("SahilRunning", mainRacerImg2);
  path.velocityX = 0;
  oppCyclistPlayerObstacleGroup.setVelocityXEach(0);
  oppCyclistPlayerObstacleGroup.setLifeTimeEach = -1;
}