import {Command} from "./command.class";
import {NarrowedContext, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

export class SendMessageCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle() {
        this.bot.on('text', async (ctx) => {
            console.log('Бот обработал данные пользователя: message.text', new Date().toLocaleDateString());

            ctx.session.notificationText = ctx.message.text;
            await this.sendNotificationByUserInterval(ctx);
        });
    }

    async sendNotificationByUserInterval(ctx: NarrowedContext<IBotContext, { message: any, update_id: number }>) {
        const userId = ctx.update.message.chat.id;
        const message = ctx.session.notificationText;
        const interval = Number(ctx.session.notificationInterval) || 1;

        const sendMessageIfWithinTimeRange = async () => {
            const currentTime = new Date();
            const currentHour = currentTime.getHours();

            if (currentHour >= 8 && currentHour < 24) {
                console.log('Бот отправил сообщение, пользователю ' + ctx.update.message.chat.id, 'с текстом: ' + ctx.session.notificationText, new Date().toLocaleDateString());
                await ctx.telegram.sendMessage(userId, message);
            }
        };

        // Send the first message if within the specified time range
        await sendMessageIfWithinTimeRange();

        // Schedule the message to be sent every
        setInterval(async () => {
            await sendMessageIfWithinTimeRange();
        }, interval * 60 * 60 * 1000);
    }
}