import {Context} from "telegraf";

export interface SessionData {
    isAgreeReceiveNotifications: boolean;
    notificationInterval: string;
    notificationText: string;
}

export interface IBotContext extends Context {
    session: SessionData;
}