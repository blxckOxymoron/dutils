import { MessageEmbed } from "discord.js";

export const ADD_EMBED = new MessageEmbed()
    .setTitle(":partying_face: Thank you for adding me to your server!")
    .setTimestamp()
    .setColor("#F45886")

export const CMD_ERROR_EMBED = new MessageEmbed()
    .setTitle(":rotating_light: Error with yor command!")