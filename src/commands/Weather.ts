import got from 'got'
import { TwurpleClient, BaseCommand, ChatMessage } from '../index'

interface WeatherApiResponse {
  id: number
  name: string
  main: {
    humidity: number
    temp: number
  }
  clouds: {
    all: number
  }
  wind: {
    speed: number
  }
}

export default class Weather extends BaseCommand {
  constructor(client: TwurpleClient) {
    super(client, {
      name: 'weather',
      userlevel: 'everyone',
      description: 'Поиск погоды через openweathermap.org',
      aliases: [
        'погода'
      ],
      examples: [
        '!weather <location>'
      ]
    })
  }

  async prepareRun(msg: ChatMessage, args: string[]) {
    if (args.length > 0) {
      try {
        const query = args.join('%20')
        const replaced = query.replace(/[&\/\\#,+()$~.':*?<>{}=]/g, '')

        if (query !== replaced) {
          throw new Error()
        }

        const { body } = await got<WeatherApiResponse>(
          `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_KEY}&lang=ru&units=metric&q=${query}`,
          { responseType: 'json' }
        )

        msg.reply(`${body.name} ${Math.round(body.main.temp)}°C Подробнее: https://openweathermap.org/city/${body.id}`)
      } catch (err) {
        msg.reply(`город не найден`)
      }
    } else {
      msg.reply('укажите город')
    }
  }
}