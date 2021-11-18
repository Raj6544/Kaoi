import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            aliases: ['boom'],
            command: 'remove',
            description: 'removes the mentioned users',
            category: 'moderation',
            usage: `${client.config.prefix}remove [@mention | tag]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        let text = '*Action*\n\n'
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`❌ Failed to ${this.config.command}, make me ADMIN first, baka`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`Please tag the users you want to ${this.config.command}`)
        M.mentioned.forEach(async (user) => {
            // const usr = this.client.contacts[user]
            // const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (M.groupMetadata?.owner.split('@')[0] === user.split('@')[0]) {
                text += `*@${user.split('@')[0]}* is owner, baka.\n`
            }
            // check if user is Bot
            else if (this.client.user.jid === user) {
                text += `*@${user.split('@')[0]}* is me, baka.\n`
            } else {
                text += `*@${user.split('@')[0]}* is removed 🧨\n`
                await this.client.groupRemove(M.from, [user])
            }
        })
        await M.reply(`${text}`, undefined, undefined, [...M.mentioned, M.sender.jid])
    }
}
