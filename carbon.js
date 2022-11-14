const fs = require('fs');
const { exec } = require("child_process");

const oicq = require("oicq");
const osdk = require("oicq-sdk");
const listener = new osdk.Listener();

const options = require("./config").options;

listener.event("message.group", function (event) {
    var m = event.raw_message;
    if (!m.startsWith("$carbon$")) return;

    const code = 'code.txt';
    fs.writeFile(code,
        m.replace(/^\$carbon\$(\r|\r?\n)/, ""),
        function (err) {
            if (err) return console.error(err);
        })

    exec("carbon-now code.txt -t code-img", (error, stdout, stderr) => {
        if (error) {
            console.error(`${error}`);
            event.reply("Oops! An error ocurred while decorating. Let's try again!");
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        const image = oicq.segment.image("code-img.png");
        event.reply(image);
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