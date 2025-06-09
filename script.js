document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const instructionBtn = document.querySelector('.instruction-btn');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    const anonymousCheckbox = document.getElementById('anonymous');
    const customNameGroup = document.getElementById('customNameGroup');

    // Логування для дебагу
    console.log('Telegram Web App:', window.Telegram?.WebApp);
    console.log('User:', window.Telegram?.WebApp?.initDataUnsafe?.user);

    // Ініціалізація Telegram Web App
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Ініціалізація стану поля для імені
    customNameGroup.style.display = anonymousCheckbox.checked ? 'block' : 'none';

    // Обробка кліку на кнопку "Інструкції"
    instructionBtn.addEventListener('click', () => {
        document.getElementById('instructions').scrollIntoView({ behavior: 'smooth' });
    });

    // Показ/приховування кнопки "Вгору"
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    // Функція для прокрутки наверх
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Показ/приховування поля для власного імені
    anonymousCheckbox.addEventListener('change', (e) => {
        customNameGroup.style.display = e.target.checked ? 'block' : 'none';
        console.log('Anonymous checkbox:', e.target.checked);
    });

    // Обробка відправки форми
    form.addEventListener('submit', async (event) => {
       event.preventDefault();
       const fields = ['price', 'discount', 'conditions', 'link', 'comments'].map(id => document.getElementById(id).value);
       const anonymous = anonymousCheckbox.checked;
       const customName = document.getElementById('customName').value.trim();

       const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
       let userName;
       if (anonymous) {
           userName = customName || 'Anon';
       } else {
           userName = user ? (user.username ? `@${user.username}` : user.first_name || 'Anon') : 'User';
       }

       const data = {
           price: fields[0],
           discount: fields[1],
           conditions: fields[2],
           link: fields[3],
           comments: fields[4],
           user_name: userName
       };

       console.log('Відправляємо дані:', data);
       console.log('Починаємо fetch до:', 'https://a44e-37-73-0-35.ngrok-free.app/submit');

       try {
           const response = await fetch('https://a44e-37-73-0-35.ngrok-free.app/submit', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(data)
           });
           console.log('Статус відповіді:', response.status);
           console.log('ОК:', response.ok);

           const result = await response.json();
           console.log('Повна відповідь сервера:', result);

           if (response.ok && result.success) {
               const messageDiv = document.createElement('div');
               messageDiv.innerHTML = result.message_html;
               document.body.appendChild(messageDiv);

               const okButton = document.getElementById('okButton');
               if (okButton) {
                   okButton.addEventListener('click', () => {
                       messageDiv.remove();
                   });
               }
           } else {
               const errorMessage = result.error || 'Невідома помилка сервера';
               console.error('Помилка сервера:', errorMessage);
               alert('Помилка: ' + errorMessage);
           }
       } catch (error) {
           console.error('Помилка fetch:', error);
           alert('Помилка при відправці: ' + error.message);
       }
   });

    // Очищення форми
    document.querySelector('.clear-btn').addEventListener('click', () => {
        form.reset();
        customNameGroup.style.display = 'none';
        anonymousCheckbox.checked = false;
        console.log('Форма очищена');
    });

    // Закриття клавіатури при кліку поза полями
    document.addEventListener('click', (e) => {
        if (!e.target.matches('input')) {
            document.activeElement?.blur();
        }
    });
});
