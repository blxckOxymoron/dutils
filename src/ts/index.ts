import { Client, Guild, Message, MessageEmbed, MessageReaction, ReactionEmoji, User } from "discord.js";
import env from "dotenv";
import mongoose, { Document } from "mongoose";
import DBGuild from "./models/joinedGuild"
import { ADD_EMBED, CMD_ERROR_EMBED } from "./embeds";
import fs from "fs";
import { Command, CommandResponse } from "./command";
import { deleteConversation, endConversation, startConversation } from "./utils";
import { StatusEmbed } from "./StatusEmbed";

env.config()
export const client = new Client();
export const guildCache = new Map<String, Document>();
export const commands: Command[] = []

loadCommands();

client.on("ready", () => {
    client.guilds.cache.forEach(async guild => {
        await cacheGuild(guild)
    })
})

client.on("guildCreate", guild => {
    cacheGuild(guild)
})

client.on("message", message => {
    if (message.author.bot) return
    if (!message.guild) return
    const guildDocument = guildCache.get(message.guild.id);
    if (!guildDocument) return
    const guildPrefix: string = guildDocument.get("prefix")

    if (message.content.trim().startsWith(guildPrefix)) {
        const args = message.content.trim().substr(guildPrefix.length).trim().split(/ +/)
        const commandName = args[0].toLowerCase()
        
        commands.every(async cmd => {
            if (cmd.name === commandName) {
                if (cmd.conversationDelete) {
                    startConversation(message, message.author);
                }

                const res = await cmd.exec(message, args, guildPrefix)

                if (res === CommandResponse.ERROR) handleCommandError(message, args)
                
                if (cmd.conversationDelete) {
                    const lastMessage = message.channel.lastMessage;
                    const useLastMessage = message.channel.lastMessage !== null;

                    const deleteMsg = await message.channel.send("To delete the command conversation, react with :wastebasket: in the next 15s.")

                    endConversation(useLastMessage ? lastMessage || deleteMsg : deleteMsg, message.author)

                    await deleteMsg.react("🗑️")
                    const filter = (reaction: MessageReaction, user: User) => reaction.emoji.name === "🗑️" && user.id === message.author.id;
                    const deleteCollector = await deleteMsg.awaitReactions(filter, {max: 1, time: 15e3, errors: []})
                    if (deleteCollector.size === 1) {

                        const delEmbed = new MessageEmbed()
                        .setColor("#FDFDFD")
                        .setTimestamp(message.createdAt)
                        .setAuthor(`${message.author.username} used command \`${cmd.name}\``, message.author.avatarURL() || undefined)

                        const delStatusEmbed = new StatusEmbed(new MessageEmbed(delEmbed))

                        delStatusEmbed.setStatus(":gear: deleting...")
                        await delStatusEmbed.sendInto(message.channel)
                        await deleteConversation(message.author, true)
                        await message.delete();
                        await delStatusEmbed.replaceEmbed(delEmbed)
                        
                    } else {
                        await deleteMsg.delete()
                    }
                }
                return res === CommandResponse.PASS
            }
            return true
        })
    }

})

function handleCommandError (message: Message, args: string[]) {
    message.channel.send(CMD_ERROR_EMBED)
}

function loadCommands () {
    const commandFiles = fs.readdirSync("./src/dist/commands").filter(file => file.endsWith('.js'));
    commandFiles.forEach(fname => {

        const command: Command = require("./commands/" + fname.slice(0, -3)).default
        if (commands.indexOf(command) === -1 && command) {
            commands.push(command)
        } else {
            console.log(`no export in file or duplicate command: ${fname}`)
        }
    })

    commands.sort((a,b) => {
        const compareNames = unicodeValue(b.name) - unicodeValue(a.name)
        if (compareNames !== 0) return compareNames
        return ((b.priority || 10) - (a.priority || 10)) //* descending order
    })

    console.debug(`loaded ${commands.length} commands`)
}

async function cacheGuild (guild: Guild) {
    
    if (!guildCache.has(guild.id)) {
        const guildDoc = await DBGuild.findOne({id: guild.id})

        if (guildDoc) guildCache.set(guild.id, guildDoc)
        else await handleNewGuild(guild)
    }
}

async function handleNewGuild (guild: Guild) {
    
    guild.systemChannel?.send(ADD_EMBED)
    const newGuild = new DBGuild({
        id: guild.id
    })
    await newGuild.save()
    guildCache.set(guild.id, newGuild)
}

function unicodeValue (s: string) {
    return s.split("").reduce((res, val) => res + val.charCodeAt(0), 0)
}

process.env.BOT_TOKEN ? client.login(process.env.BOT_TOKEN) : console.error("bottoken undefined");

const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

process.env.DB_CONNECT ? mongoose.connect(process.env.DB_CONNECT, dbOptions, () => console.log("Database connected")) : console.error("db connection undefined")