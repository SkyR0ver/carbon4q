// Native
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Modules
const oicq = require("oicq");
const osdk = require("oicq-sdk");
const listener = new osdk.Listener();

// Handlers
const svg2imgbuf = require("./svg2imgbuf");

// Config
const options = require("./config").options;

listener.event("message.group", function (event) {
    var m = event.raw_message;
    if (!m.startsWith("$carbon$")) return;

    const code = 'code.txt';
    fs.writeFile(code,
        m.replace(/^\$carbon\$(\r|\r?\n)/, ""),
        function (err) {
            if (err) return console.error(err);
        });

    const svgpath = 'code-img.svg';
    //console.log(fs.readFileSync(path.resolve(__dirname, svgpath)).toString());

    exec("carbon-now code.txt -t code-img -p code", (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            event.reply("Oops! An error ocurred while decorating. Let's try again!");
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        svg2imgbuf(fs.readFileSync(path.resolve(__dirname, svgpath)), null, 1)
            .then(imgbuf => {
                const image = oicq.segment.image(imgbuf);
                event.reply(image);
            }).catch(e => {
                console.error(`${e}`);
                event.reply("Oops! An error ocurred while decorating. Let's try again!");
            });
    });
}, {
    include: {
        group: options.group
    }
}).event("message.group", function (event) {
    var m = event.raw_message;
    if (!m.startsWith("$help$")) return;

    event.reply(`Just add "$carbon$" before the code you want to share. e.g.
---
$carbon$
#include<stdio.h>
int main() {
    printf("Hello world");
    return 0;
}
---
Now simply send the message and wait for the image!`);
}, {
    include: {
        group: options.group
    }
});

module.exports = listener;