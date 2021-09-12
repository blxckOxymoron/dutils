"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = require("../command");
const debugCommand = {
    name: "debug",
    priority: 0,
    description: "sends debug info about the command parameters",
    exec: (message, args, prefix) => {
        message.channel.send(new discord_js_1.MessageEmbed()
            .addField("args", args.toString(), true)
            .addField("prefix", prefix, true)
            .setFooter(`debug info for: @${message.author.username}`));
        return command_1.CommandResponse.PASS;
    }
};
exports.default = debugCommand;
