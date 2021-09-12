import { model, Schema } from "mongoose";

const guildSchema = new Schema({
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
})

export default model('JoinedGuild', guildSchema)