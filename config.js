

const server = 'static-app-hosting.database.windows.net';
const database = 'static-app-hosting';
const port = parseInt('1433');
const type = 'azure-active-directory-default';
const NODE_ENV = 'development';

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