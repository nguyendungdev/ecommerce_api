import { config } from 'dotenv';
if (process.env.NODE_ENV === 'production') {
   config({ path: (process.cwd(), 'config/production.env') });
} else {
   config({ path: (process.cwd(), 'config/development.env') });
}
export const databaseConfig = {
   type: process.env.DB_TYPE,
   database: process.env.DB_DATABASE,
   port: process.env.DB_PORT,
   host: process.env.DB_HOST,
   username: process.env.DB_USER,
   password: process.env.DB_PASS,
   synchronize: process.env.DB_SYNCHRONIZE,
};

export const appConfig = {
   port: process.env.APP_PORT,
};
export const googleConfig = {
   id: process.env.GOOGLE_ID,
   secret: process.env.GOOGLE_SECRET,
};

export const jwtConfig = {
   secret: process.env.JWT_SECRET,
   expiresIn: process.env.JWT_EXPIRES_IN,
};

export const emailConfirm = {
   emailService: process.env.EMAIL_SERVICE,
   emailUrl: process.env.EMAIL_CONFIRM_URL,
   emailUser: process.env.EMAIL_USER,
   emailPassword: process.env.EMAIL_PASSWORD,
   sercret: process.env.JWT_VERIFICATION_EMAIL_TOKEN_SECRET,
   expiresIn: process.env.JWT_VERIFICATION_EMAIL_TOKEN_EXPIRATION_TIME,
};
