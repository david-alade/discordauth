const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');


const port = 5000;
var infoObj;
var usersData = null;

http.createServer((req, res) => {
  let responseCode = 404;
  let content = '404 Error';

  const urlObj = url.parse(req.url, true);

  if (urlObj.query.code) {
    const accessCode = urlObj.query.code;
    const data = new FormData();

    data.append('client_id', '719960810868441129');
    data.append('client_secret', 'j-y44H7-tb6Pd3SxYCDFzK3zQwVQfIni');
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', 'https://primecooksautofill.herokuapp.com/');
    data.append('scope', 'identify%20guilds');
    data.append('code', accessCode);

    fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: data,
		})
			.then(discordRes => discordRes.json())
			.then(info => {
        console.log(info);
				return info;
			})
			.then(info => fetch('https://discordapp.com/api/users/@me', {
				headers: {
					authorization: `${info.token_type} ${info.access_token}`,
				},
			}))
			.then(userRes => userRes.json())
      .then(data => { console.log(data);})      
      .then((data) => {
        usersData = data;
        });
      console.log(usersData);

  }

  if (urlObj.pathname === '/') {
    responseCode = 200;
    content = fs.readFileSync('UI/popup.html');
  }

  res.writeHead(responseCode, {
    'content-type': 'text/html;charset=utf-8',
  });

  res.write(content);
  res.end();
})
.listen(process.env.PORT || port)

