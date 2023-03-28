import {Command} from "./command.class";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle() {
        this.bot.start((ctx) => {
            ctx.reply('Хотите ли Вы получать уведомления каждый день?', Markup.inlineKeyboard([
                    Markup.button.callback('Да', 'yes'),
                    Markup.button.callback('Нет', 'no')
                ])
            );
        });

        this.bot.action('no', (ctx) => {
            ctx.session.isAgreeReceiveNotifications = false;

            ctx.editMessageText('Окай. Добра!');
        });
    }
}