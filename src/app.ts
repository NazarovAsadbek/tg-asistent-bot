import {Telegraf} from "telegraf";
import LocalSession from "telegraf-session-local";
import {IConfigService} from "./config/config.interface";
import {ConfigService} from "./config/config.service";
import {IBotContext} from "./context/context.interface";
import {Command} from "./commands/command.class";
import {StartCommand} from "./commands/start.command";
import {ChooseIntervalCommand} from "./commands/choose-interval.command";
import {SendMessageCommand} from "./commands/send-message.command";
import {MongoClient} from 'mongodb'

class Bot {
    bot: Telegraf<IBotContext>;
    client: MongoClient;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));
        this.bot.use(
            new LocalSession({database: 'sessions.json'}).middleware()
        );
        this.client = new MongoClient(this.configService.get('MONGO_DB'));
    }

    async initDataBase() {
        try {
            // Connect to the MongoDB cluster
            await this.client.connect();

            // Make the appropriate DB calls
            await this.listDatabases(this.client);

            const dbo = this.client.db("tg-session-data");
            const myobj = { name: "Company Inc", address: "Highway 37" };
            await dbo.collection("user-request").insertOne(myobj);

            const data = await dbo.collection("user-request").findOne({});
            console.log(data)
        } catch (e) {
            console.error(e);
        } finally {
            await this.client.close();
        }
    }

    async listDatabases(client: MongoClient) {
        const databasesList = await client.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    }

    init() {
        this.commands = [
            new StartCommand(this.bot),
            new ChooseIntervalCommand(this.bot),
            new SendMessageCommand(this.bot)
        ];
        for (const command of this.commands) {
            command.handle();
        }

        this.initDataBase().catch(console.error);

        this.bot.launch();
    }
}

const bot = new Bot(new ConfigService());
bot.init();