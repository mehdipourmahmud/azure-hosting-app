
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

const server = 'static-app-hosting.database.windows.net';
const database = 'static-app-hosting';
const port = parseInt('1433');
const type = 'azure-active-directory-default';

export const config = {
    server,
    port,
    database,
    authentication: {
        type
    },
    options: {
        encrypt: true
    }
};