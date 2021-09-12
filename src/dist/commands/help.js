"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("..");
const command_1 = require("../command");
const helpCommand = {
    name: "help",
    description: "helps you with the commands",
    usage: "help <page>",
    exec: (message, args) => {
        const helpEmbed = new discord_js_1.MessageEmbed();
        const pageArg = args[1] || "";
        const maxPage = Math.ceil(__1.commands.length / 25);
        const page = Math.min(pageArg.match(/\d+/) ? parseInt(pageArg) : 1, maxPage);
        helpEmbed.setTitle("Help")
            .setColor("#FDFDFD")
            .setFooter(`page: ${page}/${maxPage} | help <page>`);
        __1.commands.slice((page - 1) * 25).every((command, i) => {
            helpEmbed.addField(command.usage || command.name, command.description || "no description", true);
            return i + 1 < page * 25;
        });
        message.channel.send(helpEmbed);
        return command_1.CommandResponse.PASS;
    }
};
exports.default = helpCommand;
