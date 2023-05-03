import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  // указываем формат имени файла
  filename: 'error-%DATE%.log',
  // указываем шаблон для даты
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxFiles: 14,
});

// логер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

// логер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    transport,
  ],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
