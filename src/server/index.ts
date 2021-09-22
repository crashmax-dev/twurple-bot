import cors from 'cors'
import express, { Express } from 'express'
import twitch from './routes/twitch.router'
import { TwurpleClient } from '../client/TwurpleClient'

export class Server {
  public app: Express

  constructor(
    private client: TwurpleClient
  ) {
    this.app = express()

    this.app.disable('x-powered-by')
    this.app.use(cors())
    this.app.use(express.json())

    twitch(this.client, this.app)
  }
}