"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const StatusEmbed_1 = require("../StatusEmbed");
const command_1 = require("../command");
const prefixCommand = {
    name: "setprefix",
    description: "change the prefix of the server",
    usage: "setprefix <prefix>",
    exec: async (message, args, prefix) => {
        async function changePrefix(newPrefix) {
            const changePrefixEmbed = new StatusEmbed_1.StatusEmbed(new discord_js_1.MessageEmbed()
                .setTitle(`updating prefix: \`${prefix}\` → \`${newPrefix}\``)
                .setColor("#FDFDFD"));
            changePrefixEmbed.setStatus(":gear: processing...");
            await changePrefixEmbed.sendInto(message.channel);
            // .setFooter("done ⇒ <:check:314349398811475968>; working ⇒ <a:processing:585955989178810379>"));
            if (!message.guild)
                return await changePrefixEmbed.updateStatus(":x: message isn't coming from a guild");
            const guildDoc = index_1.guildCache.get(message.guild.id);
            if (!guildDoc)
                return await changePrefixEmbed.updateStatus(":x: can't find your server in the cache! Contact us if this often happens.");
            await guildDoc.set("prefix", newPrefix).save();
            const me = message.guild.me;
            const oldNick = me?.displayName.replace(/〈[^〉]*〉 */, "");
            // v1: 〈[^〉]*〉
            // v2: (?<=〈).*(?=〉)
            if (oldNick)
                await me?.setNickname(`〈${newPrefix}〉 ${oldNick}`);
            return await changePrefixEmbed.updateStatus(":white_check_mark: sucessfully updated!");
        }
        if (args.length > 1) {
            await changePrefix(args.slice(1).join(" "));
        }
        else if (!(message.channel instanceof discord_js_1.NewsChannel)) {
            message.channel.send("Please type the new prefix");
            const authorFilter = (checkMsg) => checkMsg.author.id === message.author.id;
            const newPrefixCollected = await message.channel.awaitMessages(authorFilter, { max: 1, time: 10e3, errors: [] });
            if (newPrefixCollected.size !== 1)
                await message.channel.send("Well, looks like this was just a joke.");
            else {
                const newPrefixInput = newPrefixCollected.first();
                if (newPrefixInput)
                    changePrefix(newPrefixInput.content);
            }
        }
        else {
            message.channel.send("You can't use this in a NewsChannel.");
        }
        return command_1.CommandResponse.PASS;
    }
};
exports.default = prefixCommand;
