const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Get video from webcam
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      // DEPRECIATION:
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!`, err);
    });
}

// Paint video to canvas
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width; // set canvas to same size as video
    canvas.height = height; 
    
    // take pixels out of video and put them into canvas
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // Take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);
    
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.1;
    
        // pixels = greenScreen(pixels);
        // Put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
  // Play the sound
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');// base64 encoded string
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;// add image to link
  strip.insertBefore(link, strip.firstChild);// add link to strip
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 150] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

video.addEventListener('canplay', paintToCanvas);