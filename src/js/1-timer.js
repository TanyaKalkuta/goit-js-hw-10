// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

// підключаємо вибір дати з бібліотеки flatpickr
const btnStart = document.querySelector('[data-start]');
const inputData = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const nowData = new Date();
    // деактивуємо кнопку,якщо дата в минулому:
    btnStart.disabled = selectedDates[0] < nowData;
    // перевіряємо вибір дати:
    if (selectedDates[0] <= nowData) {
      iziToast.show({
        message: 'Please choose a date in the future',
        backgroundColor: 'red',
        position: 'topRight',
        close: true,
        messageSize: '30',
        timeout: 5000,
      });
    }
    userSelectedDate = selectedDates[0]; // зберегли дату в змінну
  },
};

flatpickr('#datetime-picker', options);

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

// Допоміжна функція для форматування двозначних чисел
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

btnStart.addEventListener('click', () => {
  if (!userSelectedDate) return;
  // Деактивуємо кнопку та інпут:
  btnStart.disabled = true;
  inputData.disabled = true;

  const intervalId = setInterval(() => {
    const nowData = new Date();
    const differenceData = userSelectedDate - nowData;
    // console.log(differenceData);

    if (differenceData <= 0) {
      clearInterval(intervalId);
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      // Інпут знову активний для вибору нової дати
      inputData.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(differenceData);

    // Оновлюємо інтерфейс таймера
    daysEl.textContent = days; // дні можуть бути > 99, тому без pad
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  }, 1000);
});

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
