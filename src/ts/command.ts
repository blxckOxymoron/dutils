import { Message } from "discord.js";

export type Command = {
    name: string,
    priority?: number,
    description?: string,
    usage?: string,
    conversationDelete?: boolean,
    exec: (message: Message, args: string[], prefix: string) => CommandResponse | Promise<CommandResponse>,
}
export enum CommandResponse {
    FINISHED = "sucess",
    ERROR = "error",
    PASS = "pass"
} 