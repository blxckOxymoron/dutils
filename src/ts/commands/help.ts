import { MessageEmbed } from "discord.js";
import { commands } from "..";
import { Command, CommandResponse } from "../command";

const helpCommand: Command = {
    name: "help",
    description: "helps you with the commands",
    usage: "help <page>",
    exec: (message, args) => {
        const helpEmbed = new MessageEmbed();
        const pageArg = args[1] || "";
        const maxPage = Math.ceil(commands.length / 25)
        const page = Math.min( pageArg.match(/\d+/) ? parseInt(pageArg) : 1, maxPage )

        helpEmbed.setTitle("Help")
        .setColor("#FDFDFD")
        .setFooter(`page: ${page}/${maxPage} | help <page>`)

        commands.slice((page-1)*25).every((command, i) => {
            helpEmbed.addField(command.usage || command.name, command.description || "no description", true)
            return i+1 < page*25
        })
        message.channel.send(helpEmbed)
        return CommandResponse.PASS
    }
}

export default helpCommand;