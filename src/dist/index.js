"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.guildCache = exports.client = void 0;
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const joinedGuild_1 = __importDefault(require("./models/joinedGuild"));
const embeds_1 = require("./embeds");
const fs_1 = __importDefault(require("fs"));
const command_1 = require("./command");
const utils_1 = require("./utils");
const StatusEmbed_1 = require("./StatusEmbed");
dotenv_1.default.config();
exports.client = new discord_js_1.Client();
exports.guildCache = new Map();
exports.commands = [];
loadCommands();
exports.client.on("ready", () => {
    exports.client.guilds.cache.forEach(async (guild) => {
        await cacheGuild(guild);
    });
});
exports.client.on("guildCreate", guild => {
    cacheGuild(guild);
});
exports.client.on("message", message => {
    if (message.author.bot)
        return;
    if (!message.guild)
        return;
    const guildDocument = exports.guildCache.get(message.guild.id);
    if (!guildDocument)
        return;
    const guildPrefix = guildDocument.get("prefix");
    if (message.content.trim().startsWith(guildPrefix)) {
        const args = message.content.trim().substr(guildPrefix.length).trim().split(/ +/);
        const commandName = args[0].toLowerCase();
        exports.commands.every(async (cmd) => {
            if (cmd.name === commandName) {
                if (cmd.conversationDelete) {
                    utils_1.startConversation(message, message.author);
                }
                const res = await cmd.exec(message, args, guildPrefix);
                if (res === command_1.CommandResponse.ERROR)
                    handleCommandError(message, args);
                if (cmd.conversationDelete) {
                    const lastMessage = message.channel.lastMessage;
                    const useLastMessage = message.channel.lastMessage !== null;
                    const deleteMsg = await message.channel.send("To delete the command conversation, react with :wastebasket: in the next 15s.");
                    utils_1.endConversation(useLastMessage ? lastMessage || deleteMsg : deleteMsg, message.author);
                    await deleteMsg.react("🗑️");
                    const filter = (reaction, user) => reaction.emoji.name === "🗑️" && user.id === message.author.id;
                    const deleteCollector = await deleteMsg.awaitReactions(filter, { max: 1, time: 15e3, errors: [] });
                    if (deleteCollector.size === 1) {
                        const delEmbed = new discord_js_1.MessageEmbed()
                            .setColor("#FDFDFD")
                            .setTimestamp(message.createdAt)
                            .setAuthor(`${message.author.username} used command \`${cmd.name}\``, message.author.avatarURL() || undefined);
                        const delStatusEmbed = new StatusEmbed_1.StatusEmbed(new discord_js_1.MessageEmbed(delEmbed));
                        delStatusEmbed.setStatus(":gear: deleting...");
                        await delStatusEmbed.sendInto(message.channel);
                        await utils_1.deleteConversation(message.author, true);
                        await message.delete();
                        await delStatusEmbed.replaceEmbed(delEmbed);
                    }
                    else {
                        await deleteMsg.delete();
                    }
                }
                return res === command_1.CommandResponse.PASS;
            }
            return true;
        });
    }
});
function handleCommandError(message, args) {
    message.channel.send(embeds_1.CMD_ERROR_EMBED);
}
function loadCommands() {
    const commandFiles = fs_1.default.readdirSync("./src/dist/commands").filter(file => file.endsWith('.js'));
    commandFiles.forEach(fname => {
        const command = require("./commands/" + fname.slice(0, -3)).default;
        if (exports.commands.indexOf(command) === -1 && command) {
            exports.commands.push(command);
        }
        else {
            console.log(`no export in file or duplicate command: ${fname}`);
        }
    });
    exports.commands.sort((a, b) => {
        const compareNames = unicodeValue(b.name) - unicodeValue(a.name);
        if (compareNames !== 0)
            return compareNames;
        return ((b.priority || 10) - (a.priority || 10)); //* descending order
    });
    console.debug(`loaded ${exports.commands.length} commands`);
}
async function cacheGuild(guild) {
    if (!exports.guildCache.has(guild.id)) {
        const guildDoc = await joinedGuild_1.default.findOne({ id: guild.id });
        if (guildDoc)
            exports.guildCache.set(guild.id, guildDoc);
        else
            await handleNewGuild(guild);
    }
}
async function handleNewGuild(guild) {
    guild.systemChannel?.send(embeds_1.ADD_EMBED);
    const newGuild = new joinedGuild_1.default({
        id: guild.id
    });
    await newGuild.save();
    exports.guildCache.set(guild.id, newGuild);
    guild.me?.setNickname(`〈${newGuild.get("prefix")}〉 DUtils`);
}
function unicodeValue(s) {
    return s.split("").reduce((res, val) => res + val.charCodeAt(0), 0);
}
process.env.BOT_TOKEN ? exports.client.login(process.env.BOT_TOKEN) : console.error("bottoken undefined");
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};
process.env.DB_CONNECT ? mongoose_1.default.connect(process.env.DB_CONNECT, dbOptions, (err) => err ? console.error(err) : console.log("Database connected")) : console.error("db connection undefined");
