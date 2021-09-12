"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.endConversation = exports.startConversation = exports.latestConversations = exports.askForArgument = void 0;
const discord_js_1 = require("discord.js");
const _1 = require(".");
const sentences = [
    "I need your input for `%arg%`",
    "What should I use for `%arg%`?"
];
const userFilter = (user) => {
    return (message) => message.author.id === user.id;
};
async function askForArgument(channel, user, argName, time = 30e3) {
    const sentMessage = await channel.send(sentences[Math.round(Math.random() * (sentences.length - 1))].replace("%arg%", argName));
    const responseMessage = await channel.awaitMessages(userFilter(user), { max: 1, time: time, errors: [] });
    if (responseMessage.size === 1) {
        if (responseMessage.first()?.content.trim().toLowerCase() === "cancel") {
            channel.send("Ok, i canceled the input.");
            return;
        }
        return responseMessage.first();
    }
    else {
        channel.send("Canceled input due to timeout.");
        return;
    }
}
exports.askForArgument = askForArgument;
exports.latestConversations = new Map();
function startConversation(startMessage, user) {
    exports.latestConversations.set(user.id, {
        channelId: startMessage.channel.id,
        startId: startMessage.id
    });
}
exports.startConversation = startConversation;
function endConversation(endMessage, user) {
    const newConversation = exports.latestConversations.get(user.id);
    if (!newConversation)
        return;
    newConversation.endId = endMessage.id;
    exports.latestConversations.set(user.id, newConversation);
}
exports.endConversation = endConversation;
async function deleteConversation(user, keepEmbeds = true) {
    const conversation = exports.latestConversations.get(user.id);
    if (!conversation)
        return;
    let convChannel;
    try {
        convChannel = await _1.client.channels.fetch(conversation.channelId);
        if (!(convChannel instanceof discord_js_1.TextChannel))
            return;
    }
    catch (_) {
        return;
    }
    /* --
    let convStart: Message;
    try {
        convStart = await convChannel.messages.fetch(conversation.startId);
    } catch (_) {
        return;
    }

    let convEnd: Message;
    try {
        if (!conversation.endId) return
        convEnd = await convChannel.messages.fetch(conversation.endId);
    } catch (_) {
        return;
    }
    */
    const messagesBetween = await convChannel.messages.fetch({
        before: conversation.endId,
        after: conversation.startId,
        limit: 50,
    });
    await convChannel.bulkDelete(messagesBetween.filter((val) => {
        return (val.author.id === user.id || val.author.id === user.client.user?.id) && keepEmbeds ? !(val.embeds.length > 0) : true;
    }));
}
exports.deleteConversation = deleteConversation;
