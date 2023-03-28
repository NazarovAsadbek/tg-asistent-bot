import {Command} from "./command.class";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

export class ChooseIntervalCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle() {
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
    }

    setNotificationInterval(result: string) {
        this.bot.action(result, (ctx) => {
            ctx.session.notificationInterval = result;

            ctx.editMessageText(result ? `Отлично, я буду отправлять уведомления каждые час!` : `Отлично, я буду отправлять уведомления каждые ${result} часа!`);
            ctx.reply('Введите текст напоминания')
        });
    }
}