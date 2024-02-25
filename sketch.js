let video;
let poseNet, ball;
let poses = [];

function setup() {
  createCanvas(windowWidth * 0.97, windowWidth * 0.75);
  video = createCapture(VIDEO);
  video.size(width, height);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  /* This sets up an event that fills the global variable "poses" with an array every time new poses are detected */
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  // Setup the p5play elements
  limbs = new Group(); // skeleton parts
  limbs.collider = "static";
  limbs.color = "blue";
  balls = new Group();
  world.gravity.y = 9;
  borders = new Group();
  borders.collider = "static";
  borders.color = "yellow";
  drawBorders();
  ball = new balls.Sprite(xSpot, ySpot, width * 0.05);
  balls.color = "red";
}

function modelReady() {
  //select("#status").html("Model Loaded");
  console.log("Model loaded")
}

function draw() {
  image(video, 0, 0, width, height);
  limbs.removeAll(); // constantly removing the limbs or they would just multiply
  drawSkeleton();
  print(balls.length);
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
  if (ball.y > height) {
    //replace ball if it falls
    balls.cull(0);
    ball = new balls.Sprite(xSpot, ySpot, width * 0.05);
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      /* Commenting out the skeleton drawing from the ml5 example:
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y); */

      // Calculating what's needed to make the limbs
      spriteX = (partA.position.x + partB.position.x) / 2;
      spriteY = (partA.position.y + partB.position.y) / 2;
      distance = dist(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
      angle = atan(
        (partA.position.y - partB.position.y) /
          (partA.position.x - partB.position.x)
      );
      // making the limbs / skeleton
      sprite = new limbs.Sprite(spriteX, spriteY, distance, width * 0.015);
      sprite.rotation = angle;
    }
  }
}

function drawBorders() {
  xSpot = width * 0.85;
  ySpot = height * 0.55;
  border = new borders.Sprite(
    xSpot,
    ySpot + height * 0.04,
    width * 0.1,
    width * 0.01
  );
  border = new borders.Sprite(
    xSpot - width * 0.05,
    ySpot,
    width * 0.01,
    height * 0.1
  );
  border = new borders.Sprite(
    xSpot + width * 0.05,
    ySpot,
    width * 0.01,
    height * 0.1
  );

  xSpot = width * 0.15;
  ySpot = height * 0.55;
  border = new borders.Sprite(
    xSpot,
    ySpot + height * 0.04,
    width * 0.1,
    width * 0.01
  );
  border = new borders.Sprite(
    xSpot - width * 0.05,
    ySpot,
    width * 0.01,
    height * 0.1
  );
  border = new borders.Sprite(
    xSpot + width * 0.05,
    ySpot,
    width * 0.01,
    height * 0.1
  );
}
