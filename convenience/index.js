// require statments
const chalk = require('chalk');
const fs    = require('fs');

// parse any args passed
parseArgv(process.argv);

// import the config file
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));

// variable definitions
var path = [];

// set up input and output
var stdin  = process.stdin;
var stdout = process.stdout;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// create a space to write the menu items
createCanvas();

displayMenu(config);

// on any data into stdin
stdin.on('data', function(key){
    if (key === '\u0003') {
        // ctrl-c (end of text)
        process.exit(130);
    } else if (key === '' || key === '') {
        //     backspace      esc
        // (back one menu)
        path.pop();
    } else {
        path.push(key);
    }

    var menu = config;
    for (let i = 0; i < path.length; i++) {
        menu = menu.items[path[i]];
    }

    if (menu === undefined) {
        path.pop();
        stdout.cursorTo(0);
        stdout.clearLine();
        stdout.write(chalk.red('Key "' + key + '" has no mapping!'));
    } else {
        if (menu.items === undefined) {
            clear();
            runCommand(menu.action);
        } else {
            displayMenu(menu);
        }
    }
});

function displayMenu(menu) {
    clear();

    stdout.write(menu.title + '\n\n');

    for (const key in menu.items) {
        const item = menu.items[key];

        if (item.items === undefined) {
            // this item is an action
            stdout.write(chalk.yellow(' ' + key + ' * ' + item.title + '\n'));
        } else {
            // this item is a dir
            stdout.write(chalk.blue(' ' + key + ' > ' + item.title + '\n'));
        }
    }

    stdout.write('\n');
}

function createCanvas() {
    // fill the screen with blank lines
    for (let i = 0; i < stdout.rows - 1; i++) {
        stdout.write('\n');
    }

    // then return to the top
    stdout.cursorTo(0, 0);
}

function clear() {
    // run through the console and clear all text
    for (let i = 0; i < stdout.rows; i++) {
        stdout.cursorTo(0, i);
        stdout.clearLine();
    }

    // then return to the top
    stdout.cursorTo(0, 0);
}

function runCommand(action) {
    fs.writeFileSync('/tmp/convenience.sh', action);
    process.exit(0);
}

function parseArgv(argv) {
    var start;

    // find the first item we are interested in
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === __filename) {
            start = i+1;
            break;
        }
    }

    // run through what's left
    for (let i = 0; i < argv.length; i++) {
        var arg = argv[i];

        if (arg.slice(0, 2) === '--') { // is it a longhand arg?
            switch (arg.slice(2)) {
                default:
                    unknownArg(arg);
                    break;
            }
        } else if (arg.slice(0, 1) === '-') { // is it a shorthand one?
            for (let j = 0; j < arg.slice(1).length; j++) {
                const subArg = arg.slice(1)[j];

                switch (subArg) {
                    default:
                        unknownArg(arg);
                        break;
                }
            }
        }
    }
}

function unknownArg(arg) {
    console.log(`Bad option: ${arg}

Convenience  Copyright (C) 2018  Alice Jacka
https://git.io/fxcjE
v0.1.0

Usage: convenience [options] [command]
Help:  convenience -h`);
    process.exit(1); // exit non 0 so the tmpfile wont be executed
}