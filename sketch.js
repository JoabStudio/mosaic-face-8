let capture;
let buffer = []; // Declare buffer in the global scope
let maxBufferSize = 100; // Maximum buffer size
let numSegments = 5; // Number of segments to draw
let minSegmentSize = 1; // Minimum size of each segment
let maxSegmentSize = 150; // Maximum size of each segment
let blendModes = ['BLEND']; // List of blending modes

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Use the rear camera
  capture = createCapture({
    audio: false,
    video: {
      facingMode: {
        exact: "environment" // Use the primary camera (rear)
      }
    }
  });
  capture.size(windowWidth, windowHeight);
  capture.hide(); // Hide the video element
}

function draw() {
  // Draw the camera feed onto the buffer
  buffer.push(capture.get());

  // Limit the buffer size
  if (buffer.length > maxBufferSize) {
    buffer.shift();
  }

  // Randomly determine the delay for this frame
  let delayFrames = int(random(1, 5));

  // Draw random segments of the delayed frame as the background
  if (buffer.length >= delayFrames) {
    let delayedFrame = buffer[buffer.length - delayFrames];
    for (let i = 0; i < numSegments; i++) {
      let x = int(random(width));
      let y = int(random(height));
      let segmentWidth = int(random(minSegmentSize, maxSegmentSize));
      let segmentHeight = int(random(minSegmentSize, maxSegmentSize));
      let z = random(0, 20000); // Assign a random depth in the z-axis (from 0 to 1)

      let segment = delayedFrame.get(x, y, segmentWidth, segmentHeight);

      // Apply a random blending mode to the drawing
      let randomBlendMode = random(blendModes);
      blendMode(eval(randomBlendMode));

      // Apply perspective transformation
      let perspectiveFactor = map(z, 1, 5000, 1, 0); // Adjust perspective based on depth
      let perspectiveX = x - width / 2;
      let perspectiveY = y - height / 2;
      perspectiveX *= perspectiveFactor;
      perspectiveY *= perspectiveFactor;
      let transformedWidth = segmentWidth * perspectiveFactor;
      let transformedHeight = segmentHeight * perspectiveFactor;

      // Draw a white stroke around the segment
      stroke(255);
      strokeWeight(2); // Set stroke thickness
      noFill(); // Don't fill the stroke shape
      rect(perspectiveX + width / 2, perspectiveY + height / 2, transformedWidth, transformedHeight);

      // Draw the segment with the random blending mode and perspective
      image(segment, perspectiveX + width / 2, perspectiveY + height / 2, transformedWidth, transformedHeight);

      // Reset blending mode to default
      blendMode(BLEND);
    }
  }
}

function touchStarted() {
  // Check if touch input is available
  if (typeof(window.orientation) !== 'undefined') {
    // Enter fullscreen mode on touch
    let fs = fullscreen();
    fullscreen(!fs);
  }
}