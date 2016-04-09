// Get the canvas context
var ctx = canvas.getContext('2d');

// Create a physics world, where bodies and constraints live
var world = new p2.World({
  gravity:[0, 0]
});

var ballMaterial = new p2.Material();
var sideMaterial = new p2.Material()

var balls = [];
function createBall(colour, pos) {
  var body = new p2.Body({
    mass: 5,
    position: pos,
    ccdSpeedThreshold: 0.5,
    damping: 0.55
  });
  var shape = new p2.Circle({ radius: 0.525, material: ballMaterial });
  body.addShape(shape);
  body.colour = colour;
  world.addBody(body);
  balls.push(body);
  return body;
}

var j = 1;
for (var i=1;i<6;i++)
  for (var j=0;j<i;j++)
    var body = createBall('red', [54.6 + (i-1)*1.05*Math.cos(Math.PI/6), 18.325 + 2*(0.525*j - 0.525*0.5*i)]);

var blue = createBall('blue', [35.7, 17.8]);
var black = createBall('black', [64.96, 17.8]);
var pink = createBall('hotpink', [53.55, 17.8]);
var green = createBall('darkgreen', [14.74, 23.64]);
var green = createBall('yellow', [14.74, 11.96]);
var green = createBall('saddlebrown', [14.74, 17.8]);
var objectball = createBall('white', [10, 17.8]);

var pockets = [];
function createPocket(pos) {
  var body = new p2.Body({
    mass: 0,
    position: pos
  });
  var shape = new p2.Circle({radius: 0.86-0.525});
  body.addShape(shape);
  body.colour = 'black';
  world.addBody(body);
  pockets.push(body);
  return body;
}

createPocket([0, 0]);
createPocket([0, 35.6]);
createPocket([35.7, -0.86]);
createPocket([35.7, 36.46]);
createPocket([71.4, 0]);
createPocket([71.4, 35.6]);

// Create an empty dynamic body
//var objectBody = new p2.Body({
//  mass: 5,
//  position: [10, 17.8],
//  ccdSpeedThreshold: 0.5,
//  damping: 0.46
//});
// Add a circle shape to the body
//var objectShape = new p2.Circle({ radius: 0.525, material: ballMaterial });
//objectBody.addShape(objectShape);

// ...and add the body to the world.
// If we don't add it to the world, it won't be simulated.
//world.addBody(objectBody);

var leftBody = new p2.Body({
  mass: 0,
  position: [-1, 17.8]
});
var leftShape = new p2.Box({width: 2, height: 32.88, material: sideMaterial});
leftBody.addShape(leftShape);
world.addBody(leftBody);

var topLeftBody = new p2.Body({
  mass: 0,
  position: [17.42, 36.6]
});
var topLeftShape = new p2.Box({width: 32.12, height: 2, material: sideMaterial});
topLeftBody.addShape(topLeftShape);
world.addBody(topLeftBody);

var topRightBody = new p2.Body({
  mass: 0,
  position: [53.98, 36.6]
});
var topRightShape = new p2.Box({width: 32.12, height: 2, material: sideMaterial});
topRightBody.addShape(topRightShape);
world.addBody(topRightBody);

var bottomLeftBody = new p2.Body({
  mass: 0,
  position: [17.42, -1]
});
var bottomLeftShape = new p2.Box({width: 32.12, height: 2, material: sideMaterial});
bottomLeftBody.addShape(bottomLeftShape);
world.addBody(bottomLeftBody);

var bottomRightBody = new p2.Body({
  mass: 0,
  position: [53.98, -1]
});
var bottomRightShape = new p2.Box({width: 32.12, height: 2, material: sideMaterial});
bottomRightBody.addShape(bottomRightShape);
world.addBody(bottomRightBody);

var rightBody = new p2.Body({
  mass: 0,
  position: [72.4, 17.8]
});
var rightShape = new p2.Box({width: 2, height: 32.88, material: sideMaterial});
rightBody.addShape(rightShape);
world.addBody(rightBody);

world.addContactMaterial(new p2.ContactMaterial(ballMaterial, ballMaterial, {
  restitution: 0.92,
  stiffness: Number.MAX_VALUE // We need infinite stiffness to get exact restitution
}));

world.addContactMaterial(new p2.ContactMaterial(ballMaterial, sideMaterial, {
  restitution: 0.70,
  stiffness: Number.MAX_VALUE // We need infinite stiffness to get exact restitution
}));

// To animate the bodies, we must step the world forward in time, using a fixed time step size.
// The World will run substeps and interpolate automatically for us, to get smooth animation.
var fixedTimeStep = 1 / 60; // seconds
var maxSubSteps = 100; // Max sub steps to catch up with the wall clock
var lastTime;

var potted = null;

world.on('beginContact', function(e) {
  if (~pockets.indexOf(e.bodyA))
    if (~balls.indexOf(e.bodyB))
      potted = e.bodyB;
  if (~pockets.indexOf(e.bodyB))
    if (~balls.indexOf(e.bodyA))
      potted = e.bodyA;
});

// Animation loop
function animate(time){
    requestAnimationFrame(animate);

    // Compute elapsed time since last render frame
    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;

    // Move bodies forward in time
    world.step(fixedTimeStep, deltaTime, maxSubSteps);

    if (potted) {
      balls.splice(balls.indexOf(potted), 1);
      world.removeBody(potted);
      potted = null;
    }

    // Clear the canvas
    ctx.fillStyle = 'forestgreen';
    ctx.fillRect(0, 0, 734, 376);

    // Mark table
    ctx.strokeStyle = '#99ff99';
    ctx.beginPath();
    ctx.moveTo(10 + 10*(14.74), 10 + 10*(0));
    ctx.lineTo(10 + 10*(14.74), 10 + 10*(35.6));
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.ellipse(10 + 10*(14.74), 10 + 10*(17.78), 10*5.84, 10*5.84, 0, Math.PI/2, 3*Math.PI/2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.ellipse(10 + 10*(35.7), 10 + 10*(17.78), 1, 1, 0, 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.ellipse(10 + 10*(71.38*3/4), 10 + 10*(17.78), 1, 1, 0, 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.ellipse(10 + 10*(71.38-6.48), 10 + 10*(17.78), 1, 1, 0, 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.ellipse(10 + 10*(14.74), 10 + 10*(17.78), 1, 1, 0, 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();

    for (var i=0;i<pockets.length;i++) {
      ctx.fillStyle = pockets[i].colour;
      ctx.beginPath();
      ctx.ellipse(10 + pockets[i].interpolatedPosition[0] * 10, -10 + 376 - pockets[i].interpolatedPosition[1] * 10, 9.03, 9.03, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }

    // Render the circle at the current interpolated position
    for (var i=0;i<balls.length;i++) {
      ctx.fillStyle = balls[i].colour;
      ctx.beginPath();
      ctx.ellipse(10 + balls[i].interpolatedPosition[0] * 10, -10 + 376 - balls[i].interpolatedPosition[1] * 10, 5, 5, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }

    if (false) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(10 + objectBody.interpolatedPosition[0] * 10, -10 + 376 - objectBody.interpolatedPosition[1] * 10, 5, 5, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }

    ctx.fillStyle = '#aa6600';
    ctx.fillRect(10 + 10*(topLeftBody.position[0]-topLeftBody.shapes[0].width/2), 356 - 10 - 10*(topLeftBody.position[1]-topLeftBody.shapes[0].height/2),
                 10*topLeftBody.shapes[0].width, 10*topLeftBody.shapes[0].height);
    ctx.fillRect(10 + 10*(topRightBody.position[0]-topRightBody.shapes[0].width/2), 356 - 10 - 10*(topRightBody.position[1]-topRightBody.shapes[0].height/2),
                 10*topRightBody.shapes[0].width, 10*topRightBody.shapes[0].height);
    ctx.fillRect(10 + 10*(bottomLeftBody.position[0]-bottomLeftBody.shapes[0].width/2), 356 - 10 - 10*(bottomLeftBody.position[1]-bottomLeftBody.shapes[0].height/2),
                 10*bottomLeftBody.shapes[0].width, 10*bottomLeftBody.shapes[0].height);
    ctx.fillRect(10 + 10*(bottomRightBody.position[0]-bottomRightBody.shapes[0].width/2), 356 - 10 - 10*(bottomRightBody.position[1]-bottomRightBody.shapes[0].height/2),
                 10*bottomRightBody.shapes[0].width, 10*bottomRightBody.shapes[0].height);
    ctx.fillRect(10 + 10*(leftBody.position[0]-leftBody.shapes[0].width/2), 10 + 10*(leftBody.position[1]-leftBody.shapes[0].height/2),
                 10*leftBody.shapes[0].width, 10*leftBody.shapes[0].height);
    ctx.fillRect(10 + 10*(rightBody.position[0]-rightBody.shapes[0].width/2), 10 + 10*(rightBody.position[1]-rightBody.shapes[0].height/2),
                 10*rightBody.shapes[0].width, 10*rightBody.shapes[0].height);

    ctx.beginPath();
    ctx.moveTo(objectball.position[0] * 10 + 10, 366 - objectball.position[1] * 10);
    ctx.lineTo(-20 + mouse[0], -20 + mouse[1]);
    ctx.stroke();
    ctx.closePath();

    lastTime = time;
}

canvas.onclick = function(e) {
  var xs = [15 * ((e.clientX-30) / 10 - objectball.position[0]), 15 * (35.6 - (e.clientY-30) / 10 - objectball.position[1])];
  objectball.applyImpulse(xs);
};

var mouse = [0, 0];
canvas.onmousemove = function(e) {
  mouse = [e.clientX, e.clientY];
};

// Start the animation loop
requestAnimationFrame(animate)
