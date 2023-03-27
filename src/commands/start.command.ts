import {Command} from "./command.class";
import {Markup, NarrowedContext, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle() {
        this.bot.start((ctx) => {
            console.log(ctx.session);
            // ctx.reply('Приветствую Тебя, незнакомец, чувствую Твою натуру, Мошеееееник!');
            ctx.reply('Хотите ли Вы получать уведомления каждый день?', Markup.inlineKeyboard([
                    Markup.button.callback('Да', 'yes'),
                    Markup.button.callback('Нет', 'no')
                ])
            );
        });

        this.bot.action('yes', (ctx) => {
            ctx.session.isAgreeReceiveNotifications = true;

            ctx.editMessageText('Отлично, надеюсь Вы не забудите цель напоминаний!');
            ctx.reply('С каким интервалом Вы хотите получать уведомления?', Markup.inlineKeyboard([
                    Markup.button.callback('Каждый час', '1'),
                    Markup.button.callback('Каждые 3 часа', '3'),
                    Markup.button.callback('Каждые 24 часа', '24')
                ])
            );
        });

        this.setNotificationInterval('1');
        this.setNotificationInterval('3');
        this.setNotificationInterval('24');

        this.bot.action('no', (ctx) => {
            ctx.session.isAgreeReceiveNotifications = false;

            ctx.editMessageText('Окай. Добра!');
        });

        this.bot.on('text', async (ctx) => {
            console.error(ctx)
            ctx.session.notificationText = ctx.message.text;
            await this.sendNotificationByUserInterval(ctx);
        });
    }

    setNotificationInterval(result: string) {
        this.bot.action(result, (ctx) => {
            ctx.session.notificationInterval = result;

            ctx.editMessageText(result ? `Отлично, я буду отправлять уведомления каждые час!` : `Отлично, я буду отправлять уведомления каждые ${result} часа!`);
            ctx.reply('Введите текст напоминания')
        });
    }

    async sendNotificationByUserInterval(ctx: NarrowedContext<IBotContext, { message: any, update_id: number }>) {
        const userId = ctx.update.message.chat.id;
        const message = ctx.session.notificationText;
        const interval = Number(ctx.session.notificationInterval) || 1;

        const sendMessageIfWithinTimeRange = async () => {
            const currentTime = new Date();
            const currentHour = currentTime.getHours();

            if (currentHour >= 8 && currentHour < 21) {
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