import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import { BACKUP_DIR } from '@/libs/constants.js'
import { addCommand } from '@/libs/discord.js'
import { Backup } from '@/types.js'

addCommand(
    new SlashCommandBuilder()
        .setName('restore')
        .setDescription('Nothing to see here'),
    restore,
)

export async function restore(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild
    if (!guild) throw new Error('Guild not found')

    const backup: Backup = JSON.parse(
        fs.readFileSync(path.join(BACKUP_DIR, `${guild.id}.json`), 'utf-8'),
    ) as Backup

    const members = await guild.members.fetch()
    const channels = await guild.channels.fetch()

    members.each((member) => {
        const name = backup.nicknames[member.id]
        if (name === undefined) return

        member.setNickname(name).catch(console.error)
    })
    channels.each((channel) => {
        if (!channel) return

        const name = backup.channelNames[channel.id]
        if (name === undefined) return

        guild.channels
            .edit(channel.id, {
                name,
            })
            .catch(console.error)
    })

    await interaction.reply({
        content: `Successfully restored ${Object.keys(backup.nicknames).length} nicknames and ${Object.keys(backup.channelNames).length} channel names`,
        ephemeral: true,
    })
}
