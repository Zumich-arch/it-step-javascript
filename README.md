# Домашні завдання з JavaScript

Збірка моїх ДЗ по JS в одному сайті — від першого `prompt()`/`alert()` до `Promise`, `async/await` і роботи з реальними API. Замість 14 окремих html-файлів зробив один сайт з навігацією, щоб було зручніше здавати і перевіряти.

Кожен пункт завдання можна перевірити прямо в браузері: вводите свої дані в поле, тиснете кнопку — бачите результат. Під кожним розділом є кнопка «Показати код», яка підвантажує реальний вміст відповідного `.js`-файлу.

## Зміст

| № | Розділ | Файл |
|---|--------|------|
| 01 | Вступ до JS. Змінні | `js/01-variables.js` |
| 02 | Цикли: while, do...while, for | `js/02-loops.js` |
| 03 | Рекурсія | `js/03-recursion.js` |
| 04 | Функції | `js/04-functions.js` |
| 05 | Об'єкти (авто, дріб, час) | `js/05-objects.js` |
| 06 | Масиви (покупки, чек, стилі, аудиторії) | `js/06-arrays.js` |
| 07 | ООП: Circle, HtmlElement, CssClass, HtmlBlock | `js/07-oop-html.js` |
| 08 | ООП: Marker, ExtendedDate, EmpTable | `js/08-oop-marker.js` |
| 09 | Мій список цілей (DOM, localStorage) | `js/09-goals.js` |
| 10 | Кошик покупок | `js/10-cart.js` |
| 11 | Палітра кольорів + Cookie | `js/11-colors.js` |
| 12 | Пошук фільмів — JSON, Ajax (OMDB) | `js/12-movies.js` |
| 13 | Promises, async/await | `js/13-promises.js` |
| 14 | Взаємодія із сервером (XHR/fetch) | `js/14-server.js` |

## Як запустити

Ніякої збірки не треба — чистий HTML/CSS/JS.

```bash
git clone https://github.com/Zumich-arch/<назва-репо>.git
cd <назва-репо>
```

Відкрийте `index.html` у браузері (подвійний клік або через VS Code → Live Server). Усе працює локально, без сервера.

### Розділи з реальними запитами до API

У розділах **12 (пошук фільмів)** і **14 (поради / породи собак / цитати / країни)** код реально ходить у мережу:

- **OMDB** — для пошуку фільмів потрібен свій безкоштовний ключ: https://www.omdbapi.com/apikey.aspx
- **api-ninjas** — для цитат: https://api-ninjas.com/api/quotes
- adviceslip, dog.ceo, restcountries — ключів не потребують

Поля для ключів є прямо на сторінці (попередньо підставлені тестові значення — за потреби заміните на свої).

> Якщо відкрити сайт через якийсь вбудований перегляд/пісочницю (iframe з жорсткою CSP) — ці два розділи можуть не достукатись до API. Локально в звичайному браузері все працює.

## Структура проєкту

```
.
├── index.html        — розмітка всіх 14 розділів
├── styles.css         — стилі (світла/темна тема через prefers-color-scheme)
└── js/
    ├── app.js          — сайдбар, перемикач теми, підвантаження коду
    └── 01-…14-*.js      — логіка кожного розділу окремим файлом
```

## Автор

**Lead.Team Nero Devision** — напрямок розробки ігрових серверів і модів
**CEO Days Gone: RP**

- GitHub: [github.com/Zumich-arch](https://github.com/Zumich-arch) · [github.com/Zumich-cmd](https://github.com/Zumich-cmd)
- Портфоліо: [vladislav-portfolio.pages.dev](https://vladislav-portfolio.pages.dev/)
