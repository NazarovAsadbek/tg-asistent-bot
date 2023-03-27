import {Command} from "./command.class";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle() {
        this.bot.start((ctx) => {
            console.log(ctx.session);
            // ctx.reply('Приветствую Тебя, незнакомец, чувствую Твою натуру, Мошеееееник!');
            ctx.reply('Вам понравился курс?', Markup.inlineKeyboard([
                    Markup.button.callback('👍', 'course_like'),
                    Markup.button.callback('👎', 'course_dislike')
                ])
            );
        });

        this.bot.action('course_like', (ctx) => {
            ctx.session.courseLike = true;

            ctx.editMessageText('Спасибо за отзыв!');
        });

        this.bot.action('course_dislike', (ctx) => {
            ctx.session.courseLike = false;

            ctx.editMessageText('Спасибо за отзыв! Прости меня брат, квадрат 😔');
        });
    }
}