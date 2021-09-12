"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = require("../command");
const utils_1 = require("../utils");
const ticketCommand = {
    name: "ticket",
    description: "create a new ticket system on the server.",
    usage: "ticket <channel>",
    conversationDelete: true,
    exec: async (message, args) => {
        if (!(message.channel instanceof discord_js_1.TextChannel)) {
            message.channel.send("I'm sorry, but this is not a default text channel.");
            return command_1.CommandResponse.FINISHED;
        }
        let ticketChannel;
        let ticketName;
        let ticketDesctription;
        await message.channel.send("I will now walk you through the setup. Type `cancel` in any input to cancel.");
        if (message.mentions.channels.size > 0)
            ticketChannel = message.mentions.channels.first();
        if (!ticketChannel) {
            for (let i = 1; i <= 10; i++) {
                const channelInput = await utils_1.askForArgument(message.channel, message.author, "channel");
                if (!channelInput) {
                    return command_1.CommandResponse.FINISHED;
                }
                else if (channelInput.mentions.channels.size > 0) {
                    ticketChannel = channelInput.mentions.channels.first();
                    break;
                }
                else if (i === 10) {
                    message.channel.send("We tried it 10 times now. I don't think this command is the one you are looking for.");
                }
                else {
                    message.channel.send("I couldn't find a channel mention in you response. Please try again.");
                }
            }
        }
        message.channel.send(`You chose... <#${ticketChannel?.id}>!`);
        //* Name
        const nameInput = await utils_1.askForArgument(message.channel, message.author, "ticket name");
        if (!nameInput)
            return command_1.CommandResponse.FINISHED;
        ticketName = nameInput.content;
        message.channel.send(`Ok, so the ticket will be called \`${ticketName}\`.`);
        //* Desctiption
        const descriptionInput = await utils_1.askForArgument(message.channel, message.author, "ticket description");
        if (!descriptionInput)
            return command_1.CommandResponse.FINISHED;
        ticketDesctription = descriptionInput.content;
        message.channel.send(`Alright, the description is set to \`${ticketDesctription}\``);
        return command_1.CommandResponse.PASS;
    }
};
exports.default = ticketCommand;
