/* ============================================================
   script.js — логика приглашения
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. ОТКРЫТИЕ ПРИГЛАШЕНИЯ
     ---------------------------------------------------------- */
  const welcomeScreen = document.getElementById('welcome-screen');
  const openBtn       = document.getElementById('open-invitation');
  const mainContent    = document.getElementById('main-content');
  const musicToggle    = document.getElementById('music-toggle');
  const music           = document.getElementById('bg-music');

  let opened = false;

  openBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // 1. Запускаем музыку (по прямому клику пользователя — разрешено браузерами)
    music.volume = 0.6;
    music.play().catch(() => {
      // Если файл музыки ещё не добавлен или автовоспроизведение заблокировано —
      // приложение продолжает работать без звука.
    });
    musicToggle.classList.add('is-visible');
    musicToggle.classList.remove('is-paused');
    musicToggle.setAttribute('aria-pressed', 'true');

    // 2. Прячем приветственный экран
    welcomeScreen.classList.add('is-hidden');

    // 3. Показываем основной контент
    mainContent.hidden = false;

    // 4. Плавно скроллим к началу основного содержимого
    setTimeout(() => {
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);

    // 5. Запускаем анимацию появления элементов hero-секции сразу
    setTimeout(initRevealObserver, 300);

    // Блокировка повторных кликов / доступности после ухода экрана
    setTimeout(() => { welcomeScreen.style.display = 'none'; }, 1200);
  });

  /* ----------------------------------------------------------
     2. КНОПКА УПРАВЛЕНИЯ МУЗЫКОЙ
     ---------------------------------------------------------- */
  musicToggle.addEventListener('click', () => {
    musicToggle.style.transform = 'scale(.88)';
    setTimeout(() => { musicToggle.style.transform = ''; }, 160);

    if (music.paused) {
      music.play().catch(() => {});
      musicToggle.classList.remove('is-paused');
      musicToggle.setAttribute('aria-pressed', 'true');
    } else {
      music.pause();
      musicToggle.classList.add('is-paused');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  /* ----------------------------------------------------------
     3. SCROLL REVEAL — плавное появление элементов при прокрутке
     ---------------------------------------------------------- */
  let revealObserver = null;

  function initRevealObserver() {
    const items = document.querySelectorAll('.reveal');

    items.forEach(el => {
      const delay = el.getAttribute('data-delay');
      if (delay) el.style.setProperty('--d', delay);
    });

    if (revealObserver) return; // уже инициализирован

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     4. ОБРАТНЫЙ ОТСЧЁТ ДО СВАДЬБЫ
     ЗАМЕНИТЕ ДАТУ НА СВОЮ (год, месяц (0-11), день, час, минута)
     ---------------------------------------------------------- */
  const weddingDate = new Date(2026, 8, 12, 16, 0, 0).getTime(); // 15 сентября 2026, 16:00

  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      cdDays.textContent = '02';
      cdHours.textContent = '11';
      cdMinutes.textContent = '05';
      cdSeconds.textContent = '35';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    cdDays.textContent    = pad(days);
    cdHours.textContent   = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ----------------------------------------------------------
     5. ГАЛЕРЕЯ — LIGHTBOX
     ---------------------------------------------------------- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems  = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Не открываем лайтбокс, если фото ещё не заменено (плейсхолдер пуст)
      if (item.classList.contains('gallery-item--empty')) return;

      const full = item.getAttribute('data-full');
      lightboxImg.src = full;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ----------------------------------------------------------
     6. ФОРМА RSVP
     Сейчас форма ничего никуда не отправляет — только показывает
     сообщение благодарности. Чтобы подключить реальную отправку
     (например, на email, в Google Таблицу или свой backend),
     допишите логику внутри handleRsvpSubmit().
     ---------------------------------------------------------- */
  const rsvpForm   = document.getElementById('rsvp-form');
  const rsvpThanks = document.getElementById('rsvp-thanks');

  function handleRsvpSubmit(formData) {
    // ЗДЕСЬ можно добавить fetch() к своему API, например:
    // fetch('https://ваш-сервер.example/rsvp', { method: 'POST', body: JSON.stringify(formData) });
    console.log('RSVP получен:', formData);
  }

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name:       document.getElementById('guest-name').value.trim(),
      attendance: rsvpForm.querySelector('input[name="attendance"]:checked').value,
      guests:     document.getElementById('guest-count').value,
      message:    document.getElementById('guest-message').value.trim()
    };

    handleRsvpSubmit(formData);

    // Показываем благодарность и мягко скрываем форму
    rsvpThanks.hidden = false;
    rsvpForm.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(el => {
      el.disabled = true;
      el.style.opacity = '.55';
    });
  });

  /* ----------------------------------------------------------
     На случай если пользователь начинает прокрутку колесом/тачем
     до нажатия кнопки — инициализация reveal всё равно произойдёт
     сразу после открытия (см. блок 1).
     ---------------------------------------------------------- */
});
