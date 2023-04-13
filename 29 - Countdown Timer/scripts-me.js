let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]'); //select all elements with data-time attribute

function timer(seconds) {
  clearInterval(countdown);//timer function has no way to cancel themselves out.
                           // clear any existing timers

  const now = Date.now(); //get current time
  const then = now + seconds * 1000;//
  
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);//
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);//convert to minutes
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  document.title = display;//update the title of the page
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {//timestamp is the end time in milliseconds since 1970
  const end = new Date(timestamp);
  const hour = end.getHours(); // .getDate, .getMonth, .getFullYear etc
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time); //.dataset is an object that contains all the data attributes
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

//select the form of html name="customForm"
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault(); //prevent the page from reloading
  const mins = this.minutes.value; //value of the input that has name="minutes"
  
  timer(mins * 60);//timer function takes only seconds
  this.reset();
});