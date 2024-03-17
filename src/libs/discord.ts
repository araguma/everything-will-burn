import {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
} from 'discord.js'

import { CLIENT_ID, TOKEN } from '@/libs/constants.js'
import { CommandHandler } from '@/types.js'

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})
const rest = new REST({ version: '10' }).setToken(TOKEN)

const commands: Record<
    string,
    {
        command: SlashCommandBuilder
        handler: CommandHandler
    }
> = {}

;(async () => {
    await client
        .on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return

            const command = commands[interaction.commandName]
            if (!command) return

            try {
                await command.handler(interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                })
            }
        })
        .on('ready', (client) => {
            console.log(`Logged in as ${client.user.tag}!`)
        })
        .login(TOKEN)
})().catch(console.error)

export function addCommand(
    command: SlashCommandBuilder,
    handler: CommandHandler,
) {
    commands[command.name] = {
        command,
        handler,
    }
}

export async function registerCommands() {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: Object.values(commands).map((command) =>
            command.command.toJSON(),
        ),
    })
}
