const fs = require('fs');
const path = require('path');
require('dotenv').config();
const colors = require('colors');
const targetPath = './src/environments';
const filename = 'environment.ts';

const envConfigFile = `export const environment = {
    production: ${process.env.PRODUCTION === 'true'},
    firebase: {
        apiKey: '${process.env.API_KEY}',
        authDomain: '${process.env.AUTH_DOMAIN}',
        projectId: '${process.env.PROJECT_ID}',
        storageBucket: '${process.env.STORAGE_BUCKET}',
        messagingSenderId: '${process.env.MESSAGING_SENDER_ID}',
        appId: '${process.env.APP_ID}'
    }
};
`;

try {
    fs.mkdirSync(targetPath);
}
catch (e) {
    console.error(e);
}

fs.writeFileSync(path.join(targetPath, filename), envConfigFile);

console.log(colors.magenta(`Angular environment.ts file generated correctly\n`));
