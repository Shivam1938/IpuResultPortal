import winston from 'winston';

// ANSI Colors for Terminal
const blue = '\x1b[34m';
const cyan = '\x1b[36m';
const reset = '\x1b[0m';

// Custom Winston Format
const customFormat = winston.format.printf(({ message }) => {
  // [USER LOG] Cyan/Blue color me custom print hoga
  return `${cyan}[USER LOG]${reset} ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new winston.transports.Console()
  ],
});

export default logger;