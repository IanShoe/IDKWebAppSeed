#IDK Seed Web App

##Description

This is a web seed project using Node.js + Express and MongoDB on the backend and Twitter Bootstrap + AngularJS on the frontend. It comes bundeled with some awesome angular modules developed by the Angular UI team as well as some homegrown login and messaging modules. The seed demonstrates the use of both the login and messaging modules as well as some general layout strategies. The seed also has the beginnings of a user system that features an approval strategy on both regular user accounts and admin accounts which is persisted by mongoDB.


##Mac Instalation

Open up a terminal window and navigate to your desired directory for the project

HomeBrew - http://mxcl.github.com/homebrew/

`ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"`


NodeJS - http://nodejs.org/

`brew install nodejs`


MongoDB - http://www.mongodb.org/

`brew install mongodb`

Project - https://github.com/IanShoe/IDKWebAppSeed

`git clone https://github.com/IanShoe/IDKWebAppSeed.git`
`cd IDKWebAppSeed`
`npm install`  -Note: I currently have all the packages stored in the repo so this is unnecesary. I will remove them from repo in the future

In a seperate terminal window start mongo with `mongod`

In your first terminal window `node seed.js`