// Native
const { exec } = require("child_process");

// Modules
const colors = require("colors");
const osdk = require("oicq-sdk");

// Handlers
const carbon = require("./carbon");
const config = require("./config");

exec("carbon-now --help", (error, stdout, stderr) => {
    if (error) {
        console.error('\nERROR: Cannot find module carbon-now-cli.\n'.red);
        console.log('Execute "npm install -g carbon-now-cli" to install module.\n');
        process.exit(1);
    }
    
    //init();
    const Bot = new osdk.Bot(config.account);
    Bot.loginByToken().catch(_ => {
        Bot.loginByQRCode().catch(e => { console.log(e) });
    })

    Bot.use(carbon);
});

