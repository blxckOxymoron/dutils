"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildSchema = new mongoose_1.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    prefix: {
        type: String,
        default: "du!",
        required: true,
    },
    ticketChannels: [{
            type: String
        }]
});
exports.default = mongoose_1.model('JoinedGuild', guildSchema);
