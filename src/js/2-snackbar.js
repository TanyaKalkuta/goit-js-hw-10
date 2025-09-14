// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
console.log(form);

form.addEventListener('submit', event => {
  event.preventDefault();
  const { delay, state } = event.target.elements;

  const delayMs = +delay.value;
  const statePromis = state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (statePromis === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${delayMs}ms`);
      } else {
        reject(`❌ Rejected promise in ${delayMs}ms`);
      }
    }, delayMs);
  });

  console.log(promise);

  promise
    .then(result => {
      console.log(result);
      iziToast.show({
        message: result,
        backgroundColor: 'green',
        position: 'topRight',
        close: false,
        messageSize: '30',
        timeout: 3000,
      });
    })
    .catch(reject => {
      console.log(reject);
      iziToast.show({
        message: reject,
        backgroundColor: 'red',
        position: 'topRight',
        close: false,
        messageSize: '30',
        timeout: 3000,
      });
    });
  form.reset();
});
