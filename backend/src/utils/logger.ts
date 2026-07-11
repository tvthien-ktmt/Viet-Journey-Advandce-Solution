import winston from 'winston';

const sanitizeFormat = winston.format((info) => {
    const sanitize = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        for (const key of Object.keys(obj)) {
            if (['password', 'token', 'refreshToken', 'otp', 'cvv', 'jwt'].includes(key.toLowerCase())) {
                obj[key] = '***REDACTED***';
            } else if (typeof obj[key] === 'object') {
                sanitize(obj[key]);
            }
        }
    };
    
    // Create a deep copy to avoid mutating original objects
    const sanitizedInfo = JSON.parse(JSON.stringify(info));
    sanitize(sanitizedInfo);
    return sanitizedInfo;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        sanitizeFormat(),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export default logger;
