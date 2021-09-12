import { APIMessage, APIMessageContentResolvable, DMChannel, Message, MessageEditOptions, MessageEmbed, NewsChannel, TextChannel } from "discord.js";

export class StatusEmbed {
    
    private message: Message | undefined;
    public embed: MessageEmbed;

    constructor(embed?: MessageEmbed) {
        this.embed = embed ?? new MessageEmbed().setTitle("Doing Task...");
    }

    setStatus(status: string) {
        this.embed.setDescription(status);
    }

    async updateStatus(status?: string) {
        if (status) this.setStatus(status)
        this.message = await this.message?.edit(this.embed);
    }

    setMessage(message: Message) {
        this.message = message
    }

    async sendInto(channel: TextChannel | NewsChannel | DMChannel) {
        this.message = await channel.send(this.embed)
    }
    async replaceEmbed(newMessage: MessageEmbed | APIMessage | APIMessageContentResolvable | MessageEditOptions) {
        await this.message?.edit(newMessage); 
    }

}