import 'dotenv/config'

import '@/commands/arson'
import '@/commands/backup'
import '@/commands/restore'
import { registerCommands } from '@/libs/discord'

registerCommands().catch(console.error)
