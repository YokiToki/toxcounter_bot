# Счетчик дней без токса
## Шаблонное приложение Telegram-бота на Google Apps Script

Для локальной разработки нужно установить [https://github.com/google/clasp](https://github.com/google/clasp)
```
npm i @google/clasp -g
```

```
mv .clasp.json.example .clasp.json
```
Создать новое пустое приложение Google Apps Script [https://script.google.com/home](https://script.google.com/home) и указать `scriptId` в файле `.clasp.json`
![image](https://user-images.githubusercontent.com/1845813/59051267-a8dd1f80-88b6-11e9-928a-f3c3907b385d.png)

```
mv config.js.example config.js
```
Указать токен Telegram-бота `token` в файле `config.js`.
[https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

Указать идентификатор google-таблицы, `ssid` в файле `config.js`, используемой в качастве БД.
![image](https://user-images.githubusercontent.com/1845813/59051046-2f453180-88b6-11e9-9753-2e26546a2647.png)

```
clasp login
```

Включить API в [https://script.google.com/home/usersettings](https://script.google.com/home/usersettings)

```
clasp push
```