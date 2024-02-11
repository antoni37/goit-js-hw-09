'use strict';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= this.defaultDate.getTime()) {
      window.alert('Please choose a date in the future');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

options.onClose = options.onClose.bind(options);

const flatpicker = flatpickr(datePicker, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  value.days = String(value.days).padStart(2, '0');
  value.hours = String(value.hours).padStart(2, '0');
  value.minutes = String(value.minutes).padStart(2, '0');
  value.seconds = String(value.seconds).padStart(2, '0');
  return value;
}

function onStart() {
  const selectedDate = flatpicker.selectedDates[0];
  const selectedTime = selectedDate.getTime();

  const countdown = setInterval(startCountdown, 1000);

  function startCountdown() {
    const currentTime = new Date().getTime();
    const msDiff = selectedTime - currentTime;
    const dateDiff = convertMs(msDiff);

    addLeadingZero(dateDiff);

    days.textContent = dateDiff.days;
    hours.textContent = dateDiff.hours;
    minutes.textContent = dateDiff.minutes;
    seconds.textContent = dateDiff.seconds;

    if (msDiff <= 0) {
      days.textContent = '00';
      hours.textContent = '00';
      minutes.textContent = '00';
      seconds.textContent = '00';
      clearInterval(countdown);
    }
  }

  startCountdown();
}

startBtn.addEventListener('click', onStart);