"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusEmbed = void 0;
const discord_js_1 = require("discord.js");
class StatusEmbed {
    constructor(embed) {
        this.embed = embed ?? new discord_js_1.MessageEmbed().setTitle("Doing Task...");
    }
    setStatus(status) {
        this.embed.setDescription(status);
    }
    async updateStatus(status) {
        if (status)
            this.setStatus(status);
        this.message = await this.message?.edit(this.embed);
    }
    setMessage(message) {
        this.message = message;
    }
    async sendInto(channel) {
        this.message = await channel.send(this.embed);
    }
}
exports.StatusEmbed = StatusEmbed;
