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
        const fields = ['field1', 'field2', 'field3', 'field4', 'field5'].map(id => document.getElementById(id).value);
        const anonymous = anonymousCheckbox.checked;
        const customName = document.getElementById('customName').value.trim();

        // Визначення імені користувача
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        let userName;
        if (anonymous) {
            userName = customName || 'Incognito';
        } else {
            userName = user ? (user.username ? `@${user.username}` : user.first_name || 'Incognito') : 'Incognito';
        }

        const data = {
            price: fields[0] || 'Не вказано',
            discount: fields[1] || 'Не вказано',
            conditions: fields[2] || 'Не вказано',
            link: fields[3] || 'Не вказано',
            comments: fields[4] || 'Не вказано',
            user_name: userName
        };

        console.log('Відправлені дані:', data);

        try {
            const response = await fetch('https://a44e-37-73-0-35.ngrok-free.app/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                const messageDiv = document.createElement('div');
                messageDiv.innerHTML = 'Ви успішно поділилися знахідкою! <a href="https://t.me/+wPfCVW-7i-w3NWYy" target="_blank">https://t.me/+wPfCVW-7i-w3NWYy</a>! Дякуємо!';
                messageDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(to bottom, #191970, #7FFFD4); color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000; font-family: "Montserrat", sans-serif;';
                document.body.appendChild(messageDiv);
                setTimeout(() => {
                    messageDiv.remove();
                }, 5000);
            } else {
                alert('Помилка: ' + result.error);
            }
        } catch (error) {
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
