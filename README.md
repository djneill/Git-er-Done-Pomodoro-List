<img align="center" src="public/img/fitTodo.gif" alt="gif of operating app"/>

<h1 align="center">Git 'er Done Pomodoro List</h1>

To do task list that can be reordered with an integrated pomodoro timer.

Take a look at it here 👉 https://giterdonepomodoro.onrender.com/

<h2 align="center">Tech Used</h2> 
<p align="center"> HTML5, CSS3, EJS, Javascript, Bootstrap, Font Aswesome, Node.js, Express, Passport.js, MongoDB, Mongoose, MVC paradigm </p>

<h2 align="center">Goals and Accomplishments</h2>
Many of us plan out our days with a list of task that we need or want to accomplish, how often do you acctually finish that list? Maddy suggested using a Pomodoro timer to help stay on schedule, and unanimously we all thought it was a great idea. The five of us got together to build a to do list that could be reorganized and saved to a mongoDB database. We built an integrated timer that plays a soft one second alarm when the time has expired. We then used Passport.js so the user could sign into their own account securly with an authenticate hash parameter.

<h2 align="center">Optimizations</h2>

Optimized this to fit all screen sizes as best as possible. The goal was for the user to have a fluid experience on all their devices. Designed with mobile first in mind.

# Contributors

<p><img align="center" src="https://contributors-img.web.app/image?repo=djneill/Git-er-Done-Pomodoro-List"/></p>

<p>[DJ Neill](https://github.com/djneill)</p>
<p>[Adan Ayaz](https://github.com/adan-ayaz-stan)</p>
<p>[Maddy Ali](https://github.com/maddyali)</p>
<p>[Shannan Bunch](https://github.com/funbunch)</p>
<p>[Christopher Munoz](https://github.com/ChrisMunozCodes)</p>

# Getting Started

-Fork the code base, the button to fork is at the top right next to "Star".

-Then you can click on "code" and download a zip or open your terminal and `cd desktop` then `git clone URL` the url can be copied from the "code" button.

# Objectives

- Team project using MVC, model view controller, let's have fun.

# Things to add

- Create a `.env` file in the config folder and add the following as `key: value`

  - PORT: 3000
  - DB_STRING: `your database URI`

- Add these to you .gitignore file
  node_modules
  config/.env

# Install all the dependencies or node packages used for development via Terminal

`npm install`

# Packages/Dependencies used

`npm install bcrypt connect-mongo dotenv ejs express express-flash express-session mongodb mongoose morgan nodemon passport passport-local validator cors`

If it prompts and audit fix then `npm audit fix`

# Have fun testing and improving it! 😎
