import { Channel, TextChannel } from "discord.js";
import { Command, CommandResponse } from "../command";
import { askForArgument, startConversation } from "../utils";

const ticketCommand: Command = {
    name: "ticket",
    description: "create a new ticket system on the server.",
    usage: "ticket <channel>",
    conversationDelete: true,
    exec: async (message, args) => {

        if (!(message.channel instanceof TextChannel)) {
            message.channel.send("I'm sorry, but this is not a default text channel.")
            return CommandResponse.FINISHED;
        }

        let ticketChannel: Channel | undefined;
        let ticketName: string | undefined;
        let ticketDesctription: string | undefined;

        await message.channel.send("I will now walk you through the setup. Type `cancel` in any input to cancel.")
        

        if (message.mentions.channels.size > 0) ticketChannel = message.mentions.channels.first();

        if (!ticketChannel) {
            for (let i = 1; i<=10; i++) {
                const channelInput = await askForArgument(message.channel, message.author, "channel")

                if (!channelInput) {
                    return CommandResponse.FINISHED;
                } else if (channelInput.mentions.channels.size > 0 ) {
                    ticketChannel = channelInput.mentions.channels.first();
                    break;
                } else if (i === 10) {
                    message.channel.send("We tried it 10 times now. I don't think this command is the one you are looking for.")
                } else {
                    message.channel.send("I couldn't find a channel mention in you response. Please try again.")
                }
            }
        }
        message.channel.send(`You chose... <#${ticketChannel?.id}>!`)

        //* Name
        const nameInput = await askForArgument(message.channel, message.author, "ticket name")

        if (!nameInput) return CommandResponse.FINISHED;
        
        ticketName = nameInput.content;
        message.channel.send(`Ok, so the ticket will be called \`${ticketName}\`.`)
        //* Desctiption
        const descriptionInput = await askForArgument(message.channel, message.author, "ticket description")

        if (!descriptionInput) return CommandResponse.FINISHED;
        ticketDesctription = descriptionInput.content;

        message.channel.send(`Alright, the description is set to \`${ticketDesctription}\``)

        return CommandResponse.PASS
    }
} 

export default ticketCommand;