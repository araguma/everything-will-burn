import { ChatInputCommandInteraction } from 'discord.js'

export type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => void | Promise<void>

export type Backup = {
    nicknames: Record<string, string>
    channelNames: Record<string, string>
}
