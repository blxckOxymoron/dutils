import { Channel, Message, TextChannel, User } from "discord.js";
import { client } from ".";

const sentences = [
    "I need your input for `%arg%`",
    "What should I use for `%arg%`?"
]

const userFilter = (user: User) => {
    return (message: Message) => message.author.id === user.id;
}

export async function askForArgument(channel: TextChannel, user: User, argName: string, time = 30e3): Promise<Message | undefined> {

    const sentMessage = await channel.send(sentences[Math.round(Math.random() * (sentences.length-1))].replace("%arg%", argName))
    const responseMessage = await channel.awaitMessages(userFilter(user), {max: 1, time: time, errors: []})

    if (responseMessage.size === 1) {
        if (responseMessage.first()?.content.trim().toLowerCase() === "cancel") {
            channel.send("Ok, i canceled the input.")
            return;
        }
        return responseMessage.first();
    } else {
        channel.send("Canceled input due to timeout.")
        return;
    }
}

export type BotConversation = {
    channelId: string,
    startId: string,
    endId?: string
}

export const latestConversations = new Map<String, BotConversation>();

export function startConversation(startMessage: Message, user: User) {
    latestConversations.set(user.id, {
        channelId: startMessage.channel.id, 
        startId: startMessage.id
    })
}
export function endConversation(endMessage: Message, user: User) {
    const newConversation = latestConversations.get(user.id)
    if (!newConversation) return;
    newConversation.endId = endMessage.id;
    latestConversations.set(user.id, newConversation)
}
export async function deleteConversation(user: User, keepEmbeds = true) {
    const conversation = latestConversations.get(user.id);
    if (!conversation) return;
    
    let convChannel: Channel;
    try {
        convChannel = await client.channels.fetch(conversation.channelId)
        if (!(convChannel instanceof TextChannel)) return;
    } catch (_) {
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
    })

    await convChannel.bulkDelete(messagesBetween.filter((val) => {
        return (val.author.id === user.id || val.author.id === user.client.user?.id) && keepEmbeds ? !(val.embeds.length > 0) : true
    }))
    
}