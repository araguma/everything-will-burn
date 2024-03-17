import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { backup } from '@/commands/backup'
import { addCommand } from '@/libs/discord'

addCommand(
    new SlashCommandBuilder()
        .setName('arson')
        .setDescription('Nothing to see here'),
    arson,
)

export async function arson(interaction: ChatInputCommandInteraction) {
    await backup(interaction, { auto: true })

    const guild = interaction.guild
    if (!guild) throw new Error('Guild not found')

    const members = await guild.members.fetch()
    const channels = await guild.channels.fetch()

    members.each((member) => {
        member
            .setNickname(
                '🔥'.repeat((member.nickname ?? member.displayName).length),
            )
            .catch(console.error)
    })
    channels.each((channel) => {
        if (!channel) return
        guild.channels
            .edit(channel.id, {
                name: '🔥'.repeat(channel.name.length),
            })
            .catch(console.error)
    })

    await interaction.reply({
        content: `bleep bloop committing arson`,
    })
}
