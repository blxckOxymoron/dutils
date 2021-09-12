"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMD_ERROR_EMBED = exports.ADD_EMBED = void 0;
const discord_js_1 = require("discord.js");
exports.ADD_EMBED = new discord_js_1.MessageEmbed()
    .setTitle(":partying_face: Thank you for adding me to your server!")
    .setTimestamp()
    .setColor("#F45886");
exports.CMD_ERROR_EMBED = new discord_js_1.MessageEmbed()
    .setTitle(":rotating_light: Error with yor command!");
