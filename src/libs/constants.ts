import path from 'node:path'

export const TOKEN =
    process.env['TOKEN'] ??
    (() => {
        throw new Error('TOKEN is not defined')
    })()

export const CLIENT_ID =
    process.env['CLIENT_ID'] ??
    (() => {
        throw new Error('CLIENT_ID is not defined')
    })()

export const BACKUP_DIR = path.join(__dirname, '../../', 'backup/')
