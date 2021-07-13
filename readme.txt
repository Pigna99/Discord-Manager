DISCORD MANAGER

Discord Manager is a Web Application based on React and Node.js that lets you manage one or many Discord Guilds.
This App is based on a Discord BOT that take informations or takes action on a Guild.
The Discord BOT is connected via Socket.io to a front-end React Application that provide an intuitive UI.

You can try this app here: https://discord-manager-test.netlify.app/
The Bot is hosted true Heroku: https://discord-manager-bot-test.herokuapp.com/

You can enter the Voice Channels to try all the features!
First Test Channel: https://discord.gg/GVmEDmaSc5
Second Test Channel: https://discord.gg/erqxHzJr5r
Third Test Channel: https://discord.gg/eNdCZj3KVY

How to setup:
Before start you need 2 important prerequisite:
1)Node.js
2)A discord BOT made on the Discord Developer Portal.

Note: To make the app work properly you need to toggle on the "Presence Intent" and the "Server Members Intent" in the configuration section of the BOT.
Note2: You can choose the permissions of the bot and the Role Importance on the Discord Server Settings.


After you have installed node.js and you have got the Discord Bot Token, you can start!

Setup Discord BOT:
1)Open the "Discord Bot" folder via Terminal and run "npm install" to install all the dependencies.
2)Before start the bot, create a .env file and put inside in the first line "DISCORDJS_BOT_TOKEN=" followed by the Discord Bot Token. Save the File.
3)Back to Terminal, run "npm start" to Start the Discord BOT. Remember to add the BOT to the Channels you want to monitor!


Setup Discord Manager UI:
1)Open the "discord-manager" folder via Terminal (you need to open a new shell!) and run "npm install" to install all the dependencies.
2)Start the React App local server with "npm start". After a while, a new Browser window will open and you will be in front of the Discord Manager UI.
