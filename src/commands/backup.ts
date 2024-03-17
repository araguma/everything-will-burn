import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import { BACKUP_DIR } from '@/libs/constants.js'
import { addCommand } from '@/libs/discord.js'
import { Backup } from '@/types.js'

export type BackupOptions = {
    auto: boolean
}

addCommand(
    new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Nothing to see here'),
    (interaction) =>
        backup(interaction, {
            auto: false,
        }),
)

export async function backup(
    interaction: ChatInputCommandInteraction,
    { auto }: BackupOptions,
) {
    const guild = interaction.guild
    if (!guild) throw new Error('Guild not found')

    const backup: Backup = {
        nicknames: {},
        channelNames: {},
    }

    const members = await guild.members.fetch()
    const channels = await guild.channels.fetch()

    members.each((member) => {
        backup.nicknames[member.id] = member.nickname ?? ''
    })
    channels.each((channel) => {
        if (!channel) return
        backup.channelNames[channel.id] = channel.name
    })

    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    fs.writeFileSync(
        path.join(BACKUP_DIR, `${guild.id}${auto ? '-auto' : ''}.json`),
        JSON.stringify(backup, null, 4),
    )

    if (auto) return
    await interaction.reply({
        content: `Successfully backed up ${Object.keys(backup.nicknames).length} nicknames and ${Object.keys(backup.channelNames).length} channel names`,
        ephemeral: true,
    })
}
