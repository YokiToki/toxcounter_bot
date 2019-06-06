# Days counter without tox
## Telegram bot boilerplate application on Google Apps Script

For local development, you need to install [https://github.com/google/clasp ((https://github.com/google/clasp)
`` `
npm i @ google / clasp -g
`` `

`` `
mv .clasp.json.example .clasp.json
`` `
Specify a Google Apps Script empty application ID [https://script.google.com/home] ((https://script.google.com/home)
! [image] (https://user-images.githubusercontent.com/1845813/59051267-a8dd1f80-88b6-11e9-928a-f3c3907b385d.png)

`` `
mv config.js.example config.js
`` `
Specify the token of the Telegram bot token
[https://core.telegram.org/bots/api ((https://core.telegram.org/bots/api))

Specify the ID of the google-table `ssid` used in the database.
! [image] (https://user-images.githubusercontent.com/1845813/59051046-2f453180-88b6-11e9-9753-2e26546a2647.png)

`` `
clasp login
`` `

Include the API in [https://script.google.com/home/usersettings((hhtps://script.google.com/home/usersettings)

`` `
clasp push
`` `