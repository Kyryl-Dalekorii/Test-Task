# Test-Task
## Description
This app allows you to check rank of any domain name. If rank < 100, domain name will turn into yellow.
Server implements caching of domains, this mitigates load on host.io server. Front-end side is covered by tests. 
## Steps to start this project
1.  Clone this repo
2.  Navigate to 'server 'folder, open terminal and type `npm i -g nodemon` to install nodemon globally, and then type `npm i` to install all necessary dependencies, then you need to install redis from [Redis official website](https://redis.io/download/). When you are done, in terminal type `nodemon server.js` to start server.
4.  Then navigate to 'client foler', open terminal and type `npm i` to install all necessary dependencies. When you are done, type `npm start`, in order to start development server.
## How to use this app.
1. In textarea that you see type domain names, separated by new line (app will not recognise domain names that are separated by comas or spaces).
2. When you are done, click on button below the textarea, after loading you will see results.
3. If button is disabled, check error messages, fix them, and try again.
4. In order to run tests open terminal and type `npx cypress open-ct`.

## Screenshot of working app
<a href="https://drive.google.com/uc?export=view&id=1NwRQU6rshon08psYovNm_wAnCvLZnUX2"><img src="https://drive.google.com/uc?export=view&id=1NwRQU6rshon08psYovNm_wAnCvLZnUX2" style="width: 650px; max-width: 100%; height: auto" title="Click to enlarge picture" />

