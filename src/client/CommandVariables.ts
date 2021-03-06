import got from 'got'
import { randomInt } from '../utils'
import type { ChatMessage } from './ChatMessage'
import type { TwurpleClient } from './TwurpleClient'

interface ChattersApiResponse {
  chatter_count: number
  chatters: {
    broadcaster: string[]
    vips: string[]
    moderators: string[]
    staff: string[]
    admins: string[]
    global_mods: string[]
    viewers: string[]
  }
}

export class CommandVariables {
  private cache: {
    chatters: string[]
  }

  constructor(
    private client: TwurpleClient,
    private msg: ChatMessage
  ) {
    this.random = this.random.bind(this)
    this.chatter = this.chatter.bind(this)
    this.cache = {
      chatters: []
    }
  }

  random(min: number, max: number) {
    return randomInt(min, max)
  }

  async chatter() {
    if (!this.cache.chatters.length) {
      const { body } = await got<ChattersApiResponse>(
        `https://tmi.twitch.tv/group/user/${this.msg.channel.name}/chatters`,
        { responseType: 'json' }
      )

      this.cache.chatters = [
        ...body.chatters.broadcaster,
        ...body.chatters.vips,
        ...body.chatters.moderators,
        ...body.chatters.viewers
      ].filter(chatter => ![...this.client.db.data.ignoreList, ...this.client.config.bots].includes(chatter))
    }

    return this.cache.chatters[this.random(0, this.cache.chatters.length - 1)]
  }
}
