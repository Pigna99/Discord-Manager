DISCORD MANAGER

Discord Manager is a Web Application based on React and Node.js that lets you manage one or many Discord Guilds.
This App is based on a Discord BOT that take informations or takes action on a Guild.
The Discord BOT is connected via Socket.io to a front-end React Application that provide an intuitive UI.


How to setup:
Before start you need 2 important prerequisite:
1)Node.js
2)A discord BOT made on the Discord Developer Portal.


After you have installed node.js and you have get the Discord Bot Token, you can start!

Setup Discord BOT:
1)Open the "Discord Bot" folder via Terminal and run "npm install" to install all the dependencies.
2)Before start the bot, create a .env file and put inside "DISCORDJS_BOT_TOKEN=" followed by the Discord Bot Token. Save the File.
3)Back to Terminal, run "npm start" to Start the Discord BOT. Remember to add the BOT to the Channels you want to monitor!

Setup Discord Manager UI:
1)Open the "discord-manager" folder via Terminal and run "npm install" to install all the dependencies.
2)Start the React App local server with "npm start". After a while, a new Browser window will open and you will be in front of the Discord Manager UI.
