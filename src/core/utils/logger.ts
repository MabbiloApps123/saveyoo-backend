require('dotenv').config();
import winston from "winston";
const { combine, timestamp, printf, colorize, align, json } = winston.format;

import DailyRotateFile from "winston-daily-rotate-file";
import { PRODUCTION } from "../constants";

const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
    return info.level === 'info' ? info : false;
});
const combinedFileRotateTransport = new DailyRotateFile({
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '50d',
    zippedArchive: true,
    maxSize: '20m',
    dirname: './logs/'
});
const infoFileRotateTransport = new DailyRotateFile({
    level: 'info',
    filename: 'info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '50d',
    zippedArchive: true,
    maxSize: '20m',
    dirname: './logs/',
    format: combine(infoFilter(), timestamp(), json()),
});

const errorFileRotateTransport = new DailyRotateFile({
    level: 'error',
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '50d',
    zippedArchive: true,
    maxSize: '20m',
    dirname: './logs/',
    format: combine(errorFilter(), timestamp(), json()),
});

export const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        combinedFileRotateTransport,
        infoFileRotateTransport,
        errorFileRotateTransport
    ],
});

if (process.env.NODE_ENV != PRODUCTION) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}