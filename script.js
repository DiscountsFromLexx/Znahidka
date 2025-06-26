document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const instructionBtn = document.querySelector('.instruction-btn');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    const anonymousCheckbox = document.getElementById('anonymous');
    const customNameGroup = document.getElementById('customNameGroup');
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.querySelector('.theme-label');

    // Масив для збору логів
    const logs = [];

    // Функція для додавання логу
    const addLog = (message, data) => {
        const log = `${message}: ${JSON.stringify(data)}`;
        logs.push(log);
        console.log(log); // Залишаємо console.log для локального дебагу
    };

    // Перемикання тем
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        themeLabel.textContent = document.body.classList.contains('light-theme') ? '🔆' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        addLog('Theme Changed', { theme: localStorage.getItem('theme') });
    });

    // Завантаження збереженої теми
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
        themeLabel.textContent = '🔆';
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        themeToggle.checked = false;
        themeLabel.textContent = '🌙';
    }

    // Логування ініціалізації
    addLog('Telegram Web App', window.Telegram?.WebApp);
    addLog('User Data', window.Object?.Data);
    addLog('initData', window.Telegram?.WebApp?.initData);

    // Ініціалізація Telegram Web App
    if (window.Telegram) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp?.expand();
        addLog('WebApp initialized', { ready: true, expanded: true });
    }

    // Ініціалізація стану поля для імені
    customNameGroup.style.display = anonymousCheckbox.checked ? 'block' : 'none';
    addLog('Initial Anonymous Checkbox State', { checked: anonymousCheckbox.checked });

    // Обробка кліку на кнопку "Інструкції"
    instructionBtn.addEventListener('click', () => {
        document.getElementById('instructions').scrollIntoView({ behavior: 'smooth' });
        addLog('Instruction Button Clicked', { action: 'scroll to instructions' });
    });

    // Показ/приховування кнопки "Вгору"
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        addLog('Scroll Event', { scrollY: window.scrollY });
    });

    // Функція для прокрутки наверх
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        addLog('Scroll to top', { action: 'scroll to top' });
    };

    // Показ/приховування поля для власного імені
    anonymousCheckbox.addEventListener('change', (e) => {
        customNameGroup.style.display = e.target.checked ? 'block' : 'none';
        addLog('Anonymous Checkbox Changed', { state: e.target.checked });
    });

    // Обробка відправки форми
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fields = ['field1', 'field4', 'field5', 'field3'].map(id => document.getElementById(id).value);
        const anonymous = anonymousCheckbox.checked;
        const customName = document.getElementById('customName').value.trim();
    
        addLog('Form Submission Started', { action: 'start' });
        addLog('Anonymous', anonymous);
        addLog('Custom Name', customName);
        addLog('Form Fields', fields);
    
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        addLog('User Object', user);
    
        let userName;
        if (anonymous) {
            userName = customName || 'Incognito';
            addLog('Anonymous Mode: userName set to', userName);
        } else {
            userName = user ? (user.username ? `@${user.username}` : user.first_name || 'Incognito') : 'Incognito';
            addLog('Non-Anonymous Mode: userName set to', userName);
            addLog('Username', user?.username);
            addLog('First Name', user?.first_name);
        }
    
        const data = {
            price: fields[0] || 'Не вказано',
            link: fields[1] || 'Не вказано',
            comments: fields[2] || '',
            conditions: fields[3] || '',
            user_name: userName,
            user_id: user?.id || null,
            user_username: user?.username || null,
            user_first_name: user?.first_name || null,
            init_data: window.Telegram?.WebApp?.initData || '',
            debug_log: logs.join('\n')
        };
    
        addLog('Data to Send', data);
        addLog('Fetch URL', 'https://6f3b-34-45-121-93.ngrok-free.app/submit');
    
        try {
            const response = await fetch('https://6f3b-34-45-121-93.ngrok-free.app/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            addLog('Response Status', response.status);
            addLog('Response OK', response.ok);
            const result = await response.json();
            addLog('Response Result', result);
    
            if (response.ok && result.success) {
                alert(result.message);
            } else {
                const errorMessage = result.error || 'Невідома помилка сервера';
                addLog('Server Error', errorMessage);
                alert('Помилка: ' + errorMessage);
            }
        } catch (error) {
            addLog('Fetch Error', error.message);
            alert('Помилка при відправці: ' + error.message);
        }
    });

    // Очищення форми
    document.querySelector('.clear-btn').addEventListener('click', () => {
        form.reset();
        customNameGroup.style.display = 'none';
        anonymousCheckbox.checked = false;
        addLog('Form Cleared', { action: 'form reset' });
    });

    // Закриття клавіатури при кліку поза полями
    document.addEventListener('click', (e) => {
        if (!e.target.matches('input')) {
            document.activeElement?.blur();
            addLog('Click Outside Input', { action: 'hide keyboard' });
        }
    });
});
