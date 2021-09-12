import { MessageEmbed } from "discord.js";
import { Command, CommandResponse } from "../command";

const debugCommand: Command = {
    name: "debug",
    priority: 0,
    description: "sends debug info about the command parameters",
    exec: (message, args, prefix) => {
        message.channel.send(new MessageEmbed()
        .addField("args", args.toString(), true)
        .addField("prefix", prefix, true)
        .setFooter(`debug info for: @${message.author.username}`))

        return CommandResponse.PASS
    }
}
export default debugCommand;