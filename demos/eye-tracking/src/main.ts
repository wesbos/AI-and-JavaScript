// Initialize WebGazer
const webgazer = (window as unknown as { webgazer: WebGazer }).webgazer;

// Get DOM elements
const targetsContainer = document.getElementById('targets');
const startButton = document.getElementById('startButton');
const cameraSelect = document.getElementById('cameraSelect') as HTMLSelectElement;

// Initialize camera selection
async function initializeCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    // Clear and populate the camera select dropdown
    cameraSelect.innerHTML = '';
    videoDevices.forEach(device => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Camera ${videoDevices.indexOf(device) + 1}`;
      cameraSelect.appendChild(option);
    });

    // Enable the select if we have cameras
    cameraSelect.disabled = videoDevices.length === 0;

    // If no cameras found, disable start button and show message
    if (videoDevices.length === 0) {
      startButton?.setAttribute('disabled', 'true');
      alert('No cameras found. Please connect a camera and refresh the page.');
    }
  } catch (error) {
    console.error('Error enumerating cameras:', error);
    cameraSelect.innerHTML = '<option value="">Error loading cameras</option>';
  }
}

// Request camera permissions and initialize
navigator.mediaDevices.getUserMedia({ video: true })
  .then(() => initializeCameras())
  .catch(error => {
    console.error('Error accessing camera:', error);
    cameraSelect.innerHTML = '<option value="">Camera access denied</option>';
  });

// Create calibration targets in a grid pattern
if (targetsContainer) {
  const numRows = 3;
  const numCols = 3;
  const padding = 50; // pixels from the edge

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const target = document.createElement('div');
      target.className = 'target';
      target.textContent = `${i * numCols + j + 1}`;

      // Calculate position as percentage
      const left = (j * ((100 - (padding * 2)) / (numCols - 1))) + padding;
      const top = (i * ((100 - (padding * 2)) / (numRows - 1))) + padding;

      target.style.left = `${left}%`;
      target.style.top = `${top}%`;
      targetsContainer.appendChild(target);
    }
  }
}

// Handle camera selection change
cameraSelect?.addEventListener('change', async () => {
  const selectedDeviceId = cameraSelect.value;
  if (webgazer.isReady()) {
    webgazer.pause();
    await webgazer.setVideoElementCanvas(null);

    // Reinitialize with new camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } }
      });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;

      // Create canvas and set up video drawing
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          videoElement.play();
          resolve();
        };
      });

      // Draw video to canvas
      function drawVideo() {
        if (!context) return;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideo);
      }
      drawVideo();

      await webgazer.setVideoElementCanvas(canvas);
      webgazer.resume();
    } catch (error) {
      console.error('Error switching camera:', error);
      alert('Failed to switch camera. Please try again.');
    }
  }
});

// Handle calibration start
if (startButton) {
  startButton.addEventListener('click', async () => {
    try {
      // Get the selected camera ID
      const selectedDeviceId = cameraSelect.value;

      // Configure webgazer with the selected camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
      });

      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;

      // Create canvas and set up video drawing
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          videoElement.play();
          resolve();
        };
      });

      // Draw video to canvas
      function drawVideo() {
        if (!context) return;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawVideo);
      }
      drawVideo();

      // Configure webgazer
      webgazer.setRegression('ridge');
      webgazer.setTracker('TFFacemesh');

      // Set the video canvas and begin
      await webgazer.setVideoElementCanvas(canvas);
      await webgazer.begin();

      // Hide the start button
      startButton.style.display = 'none';

      // Show the video feed and prediction points during calibration
      webgazer.showVideo(true);
      webgazer.showPredictionPoints(true);

      // Set up the gaze listener
      webgazer.setGazeListener((data: GazeData | null) => {
        if (data == null) return;

        const gazeOverlay = document.getElementById('gaze-overlay');
        if (gazeOverlay) {
          gazeOverlay.style.left = `${data.x}px`;
          gazeOverlay.style.top = `${data.y}px`;
        }
      });
    } catch (error) {
      console.error('Failed to start WebGazer:', error);
      alert('Failed to start eye tracking. Please make sure you have granted camera permissions.');
    }
  });
}
