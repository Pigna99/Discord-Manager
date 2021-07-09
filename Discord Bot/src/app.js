require('dotenv').config();
const {DISCORDJS_BOT_TOKEN} = process.env;
//discord token ed id del canale discord da monitorare

const { Client, DiscordAPIError , Intents} = require('discord.js');
const client = new Client({ ws: { intents: ['GUILD_MEMBERS', 'GUILD_PRESENCES', Intents.NON_PRIVILEGED] } });
client.login(DISCORDJS_BOT_TOKEN);


//server express per socket.io
const express = require('express');
const http = require('http');
const socketIo = require ('socket.io');

const port = 4001;
const index = require("./routes/index");//prendiamo il router presente in index



//questa versione permette di monitorare solo un canale discord
//carichiamo le info sul server discord che stiamo monitorando
const sendDiscordInfoPRO = async (client, socket , discordGuild)=>{
    try{   
        const guild = await client.guilds.fetch(discordGuild);
        // console.log(guild);
        const vocalChannels = guild.channels.cache.filter(channel=>channel.type === 'voice');
        const channels= [...vocalChannels];
        let data ={//informazioni che mi servono per la App
            channelName:guild.name,
            channelId:guild.id,
            channelImg: guild.iconURL(),
            available: guild.available,
            voiceChannels:[]
        }
        for(let i=0; i< channels.length; i++){//riporta tutti gli utenti presenti sui canali
            // console.log(channels[i][1]);
            let users = [...channels[i][1].members];
            let channel = {
                name: channels[i][1].name,
                id: channels[i][1].id,
                position: channels[i][1].rawPosition,
                userLimit: channels[i][1].userLimit,
                users:[]
            }
            for(j=0; j< users.length; j++){
                // console.log(users[j][1]);
                // console.log(users[j][1].user.defaultAvatarURL);
                let user = {//.user é un USER, invece normalmente é un MEMBER GUILD
                    name: users[j][1].user.username,
                    id: users[j][1].user.id,
                    img: users[j][1].user.avatarURL(),
                    color: users[j][1].displayHexColor,
                    bot: users[j][1].user.bot,
                    voiceInfo:{
                        selfDeaf: users[j][1].voice.selfDeaf,
                        selfMute: users[j][1].voice.selfMute,
                        selfVideo: users[j][1].voice.selfVideo,
                        serverDeaf: users[j][1].voice.serverDeaf,
                        serverMute: users[j][1].voice.serverMute,
                        streaming: users[j][1].voice.streaming
                    }
                }
                channel.users.push(user);
                // console.log(users[j][1]);
            }
            data.voiceChannels.push(channel);
        }
        // console.log(data);
        socket.emit("GENERIC_INFO", data);  
        console.log("data sent");
    }catch(e){
        console.log(e);
    }
}

const sendDiscordInfoPresence = async (client, socket, discordGuild)=>{
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const members = await guild.members.fetch();
        //{user:['818808348420866050', '391256123761623050']}
        const users = [...members];
        let data=[];
        for(i=0; i<users.length; i++){
            let data_user = {
                name: users[i][1].user.username,
                nick: users[i][1].nickname,
                id: users[i][1].user.id,
                displayName: users[i][1].displayName,
                isBot: users[i][1].user.bot,
                img: users[i][1].user.avatarURL(),
                color: users[i][1].displayHexColor,
                presence: users[i][1].presence.status,
            }
            data.push(data_user);
        }
        socket.emit("USERS_STATE_INFO", data);
        console.log("Cambiamento status effettuato");
    } catch (error) {
        console.log(error);
    } 
}

const sendGuilds = (client, socket, selected)=>{
    let guilds= [];
    client.guilds.cache.each(guild=>guilds.push({name: guild.name, id:guild.id, img:guild.iconURL()}));
    socket.emit("GUILDS", {list:guilds, selected});
}

const getUser = (channels, id) =>{//funzione riporta un utente dati tutti i canali
    for(let i=0; i< channels.length; i++){
        let users = [...channels[i][1].members];
        for(let j=0; j< users.length; j++){
            if(users[j][1].user.id === id){
                return users[j][1];
            }
        }
    }
}

const getUsers = (channels, channelId)=>{
    for(let i=0; i< channels.length; i++){
        if(channels[i][1].id===channelId){
            return [...channels[i][1].members];
        }  
    }
}

const kickUser = async (client, id, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const vocalChannels = guild.channels.cache.filter(channel=>channel.type === 'voice');
        const user = getUser([...vocalChannels], id);
        user.voice.kick();
        console.log(user[j][1].user.username + " has been kicked from Vocal Channel!");
    } catch (error) {
        console.log(error);
    }
}

const deafUser = async (client, id, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const vocalChannels = guild.channels.cache.filter(channel=>channel.type === 'voice');
        const user = getUser([...vocalChannels], id);
        user.voice.setDeaf(!user.voice.serverDeaf);
        console.log(user.user.username + " has been " +(!user.voice.serverDeaf ? "deafed" : "undeafed")+ " from Vocal Channel!");
    } catch (error) {
        console.log(error);
    }
}

const muteUser = async (client, id, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const vocalChannels = guild.channels.cache.filter(channel=>channel.type === 'voice');
        const user = getUser([...vocalChannels], id);
        user.voice.setMute(!user.voice.serverMute);
        console.log(user.user.username + " has been " +(!user.voice.serverMute ? "muted" : "unmuted")+ " from Vocal Channel!");
    } catch (error) {
        console.log(error);
    }
}

const dragUser = async (client, data, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const vocalChannels = guild.channels.cache.filter(channel=>channel.type === 'voice');
        const user = getUser([...vocalChannels], data.user);
        user.voice.setChannel(data.channel);
        console.log(user.user.username + " has been moved to another Vocal Channel.");
    } catch (error) {
        console.log(error);
    }
}

const dragAll = async (client, data, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const vocalChannels = guild.channels.cache.filter(channel=>channel.type === 'voice');
        const users = getUsers([...vocalChannels], data.startChannel);
        for(let i=0; i< users.length; i++){
            users[i][1].voice.setChannel(data.endChannel);
            console.log(users[i][1].user.username + " has been moved to another Vocal Channel.");
        }
    } catch (error) {
        console.log(error);
    }
}

const getUserInfo = async (client, socket, id, discordGuild) =>{
    const guild = await client.guilds.fetch(discordGuild);
    const user = getUser([...guild.channels.cache], id);
    let data_user = {
        name: user.user.username,
        nick: user.nickname,
        id: user.user.id,
        displayName: user.displayName,
        isBot: user.user.bot,
        img: user.user.avatarURL(),
        color: user.displayHexColor,
        bannable: user.bannable,
        deleted: user.deleted,
        joinedAt: user.joinedAt,
        kickable: user.kickable,
        manageable: user.manageable,
        permissions: user.permissions,
        premiumSince: user.premiumSince,
        presence:{
            activities:user.presence.activities,
            clientStatus:user.presence.clientStatus,
            status: user.presence.status,
        },
        roles:{
            all:[...user.roles.cache],
            highest: user.roles.highest,
            highestColor: user.roles.highest.hexColor,
            hoist: user.roles.hoist,
            guildRoles:[],
            adminRole: guild.roles.highest,
        },
        info:{
            createdAt: user.user.createdAt,
            flags: user.user.flags,
            tag: user.user.tag,
        }
    }
    guild.roles.cache.each((guild)=>{
        let role = {
            id: guild.id,
            name: guild.name,
            color: guild.hexColor,
            editable: guild.editable,
            managed: guild.managed,
        }
        data_user.roles.guildRoles.push(role);
    })
    socket.emit("GRAB_USER_INFO", data_user);
}

const kickUserGuild = async (client, socket, id, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const user = getUser([...guild.channels.cache], id);
        user.kick({reason:"Kicked from Discord Manager BOT"});
        console.log(user.user.username + " has been kicked from the Guild!");
        socket.emit("USER_HAS_BEEN_KICKED", {name: user.user.username , reason: "KICKED"});
    } catch (error) {
        console.log(error);
    }
}

const banUserGuild = async (client, socket, id, discordGuild) => {
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const user = getUser([...guild.channels.cache], id);
        user.ban({reason:"Banned from Discord Manager BOT"});
        console.log(user.user.username + " has been banned from the Guild!");
        socket.emit("USER_HAS_BEEN_BANNED", {name: user.user.username, reason: "BANNED"});
    } catch (error) {
        console.log(error);
    }
}

const toggleRole = async (client, socket, data, discordGuild) =>{
    try {
        const guild = await client.guilds.fetch(discordGuild);
        const roles = getUser([...guild.channels.cache], data.user_id).roles;
        let isRoleFind = false;
        roles.cache.each(role=>{
            if(role.id === data.role_id){
                isRoleFind = true;
                console.log("role removed")
                roles.remove(role.id);
            }
        })
        if(isRoleFind === false){
            console.log("role added")
            roles.add(data.role_id)
        }
        //update user info at the end!
        setTimeout(()=>{getUserInfo(client, socket, data.user_id, discordGuild);}, 500)
    } catch (error) {
        console.log(error);
    }
}

const testInfo = async(client, socket)=>{//per testare oggetti
    
}
//FUNZIONI: da mettere in un altro documento!


const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server , { transport : ['websocket'] });

//SERVER DISCORD --------/ avviato
client.addListener('ready', (req, res)=>{//carica all'inizio
    console.log("Server Discord Avviato");

    io.on("connection", (socket)=>{
        let discordGuild = client.guilds.cache.first(1)[0].id;//select fist guild on the list
        console.log("New client REACT connected to the DISCORD BOT");
        socket.emit('HELLO', "CIAO VILLANO!");
        sendDiscordInfoPRO(client, socket, discordGuild);//mandiamo le info alla prima connessione
        sendDiscordInfoPresence(client, socket, discordGuild);
        // testInfo(client,socket);
         
        sendGuilds(client, socket, discordGuild);
        //eventi discord to manager
        client.addListener('voiceStateUpdate', (req, res)=>{//manda un messaggio ad ogni aggiornamento
            console.log("Cambiamento in corso");
            sendDiscordInfoPRO(client, socket, discordGuild);
        })
        client.addListener('presenceUpdate', (req, res)=>{//manda un messaggio ad ogni aggiornamento
            console.log("Cambiamento status in corso");
            sendDiscordInfoPresence(client, socket, discordGuild);
        })
        socket.on("disconnect", ()=>{
            console.log("Client disconnected");
        })

        //eventi manager to discord
        socket.on("CHANGE_GUILD", (id)=>{
            discordGuild=id;
            sendGuilds(client, socket, discordGuild);
            sendDiscordInfoPRO(client, socket, discordGuild);
            sendDiscordInfoPresence(client, socket, discordGuild);

        })
        socket.on("KICK", (id)=>{//per kickare un utente
            kickUser(client, id, discordGuild);
        })
        socket.on("MUTE", (id)=>{//per mutare un utente
            muteUser(client, id, discordGuild);
        })
        socket.on("DEAF", (id)=>{//per rendere sordo un utente
            deafUser(client, id, discordGuild);
        })
        socket.on("DRAG_USER", (data)=>{//for drag an user to another channel
            dragUser(client, data, discordGuild);
        })
        socket.on("DRAG_ALL", (data)=>{//drag all the user from a channel to another channel
            dragAll(client, data, discordGuild);
        })
        socket.on("GET_USER_INFO", id=>{
            getUserInfo(client, socket, id, discordGuild);
        })
        socket.on("KICK_FROM_GUILD", id=>{
            kickUserGuild(client, socket, id, discordGuild);
        })
        socket.on("BAN_FROM_GUILD", id=>{
            banUserGuild(client, socket, id, discordGuild);
        })
        socket.on("TOGGLE_ROLE", data=>{
            toggleRole(client, socket, data, discordGuild);
        })
    })
    
    server.listen(port, () => console.log(`Listening on port ${port}`));
})
//SERVER DISCORD --------

//EXPRESS + SOCKET.IO + Server DISCORD -------


