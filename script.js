const builtin_audio_urls = [
  "https://raw.githubusercontent.com/TWTom041/RandomSoundPlay/gh-pages/builtin_sounds/rick%20intro.mp3",
  "https://raw.githubusercontent.com/TWTom041/RandomSoundPlay/gh-pages/builtin_sounds/laugh.wav",
  "https://raw.githubusercontent.com/TWTom041/RandomSoundPlay/gh-pages/builtin_sounds/vine%20boom.mp3",
  "https://raw.githubusercontent.com/TWTom041/RandomSoundPlay/gh-pages/builtin_sounds/Ding%20Dong.mp3"
]


const audioSource = document.getElementById('audio-source');
const builtinsContainer = document.getElementById('builtins-container')
const uploadContainer = document.getElementById('upload-container');
const urlContainer = document.getElementById('url-container');
const builtinsSelector = document.getElementById('builtins-selector')
const uploadBtn = document.getElementById('upload-btn');
const audioUrl = document.getElementById('audio-url');
const minIntervalInput = document.getElementById('min-interval');
const maxIntervalInput = document.getElementById('max-interval');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const countdownDisplay = document.getElementById('countdown');

let sound = null;
let currentAudio;
let intervalId;
let timerId;

audioSource.addEventListener('change', () => {
  const selectedSource = audioSource.value;
  if (selectedSource === 'built-in') {
    builtinsContainer.style.display = 'block';
    uploadContainer.style.display = 'none';
    urlContainer.style.display = 'none';
    builtinsSelector.value = null;
  } else if (selectedSource === 'upload') {
    builtinsContainer.style.display = 'none';
    uploadContainer.style.display = 'block';
    urlContainer.style.display = 'none';
    document.getElementById('audio-upload').value = "";
  } else if (selectedSource === 'url') {
    builtinsContainer.style.display = 'none';
    uploadContainer.style.display = 'none';
    urlContainer.style.display = 'block';
    audioUrl.value = "";
  } else {
    builtinsContainer.style.display = 'none';
    uploadContainer.style.display = 'none';
    urlContainer.style.display = 'none';
    alert("Invalid audio source given.");
  }
});

builtinsSelector.addEventListener("change", () => {
  sound = builtin_audio_urls[builtinsSelector.value];
})

uploadBtn.addEventListener('click', () => {
  const uploadedFile = document.getElementById('audio-upload').files[0];
  if (uploadedFile) {
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = () => {
      sound = reader.result
    };
  }
});

audioUrl.addEventListener('keyup', () => {
  // Validate URL format (optional)
  sound = audioUrl.value;
});

playBtn.addEventListener('click', () => {
  if (!sound) {
    alert('Please upload or enter audio source first.');
    return;
  }

  playBtn.disabled = true;
  stopBtn.disabled = false;

  playRandomSound();
});

stopBtn.addEventListener('click', () => {
  playBtn.disabled = false;
  stopBtn.disabled = true;

  clearTimeout(timerId);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
});

function playRandomSound() {
  const minInterval = parseInt(minIntervalInput.value, 10);
  const maxInterval = parseInt(maxIntervalInput.value, 10);
  const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

  // const randomSoundIndex = Math.floor(Math.random() * sounds.length);
  currentAudio = new Audio(sound);

  currentAudio.addEventListener('ended', () => {
    currentAudio = null;
    playRandomSound();
  });

  setCountdown(randomInterval);
  setTimeout(() => {currentAudio.play();}, randomInterval * 1000);
}

function setCountdown(seconds) {
  let remainingSeconds = seconds;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds;

  let formattedMinutes = minutes.toString().padStart(2, '0');
  let formattedSeconds = (remainingSeconds % 60).toString().padStart(2, '0');

  countdownDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

  timerId = setInterval(() => {
    remainingSeconds--;
    formattedMinutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    formattedSeconds = (remainingSeconds % 60).toString().padStart(2, '0');
    countdownDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

    if (remainingSeconds === 0) {
      clearInterval(timerId);
    }
  }, 1000);
}
