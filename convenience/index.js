// require statments
const fs   = require('fs');
const argv = require('minimist')(process.argv.slice(2), { boolean: true });

var preloadKeys = false;
var options = {
    color: true,
    configPath: __dirname + '/config.json'
}

// parse any args passed
parseArgv(argv);

// set colors
var colors = {};

if (options.color) {
    colors = {
        error    : '\u001b[31m',
        action   : '\u001b[33m',
        directory: '\u001b[34m',
        comment  : '\u001b[37m',
        reset    : '\u001b[39m'
    };
} else {
    colors = {
        error    : '',
        action   : '',
        directory: '',
        comment  : '',
        reset    : ''
    };
}

// import the config file
const config = JSON.parse(fs.readFileSync(options.configPath, 'utf8'));

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

if (preloadKeys) {
    respondToInput(preloadKeys);
} else {
    displayMenu(config);
}

// on any data into stdin
stdin.on('data', function(keys) { respondToInput(keys) });

function respondToInput(keys) {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
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
            stdout.write(colors.error + 'Key "' + key + '" has no mapping!' + colors.reset);
        } else {
            if (menu.items === undefined) {
                clear();
                runCommand(menu.action);
            } else {
                displayMenu(menu);
            }
        }
    }
}

function displayMenu(menu) {
    clear();

    stdout.write(menu.title + '\n\n');

    for (const key in menu.items) {
        const item = menu.items[key];

        if (key === '_comment') {
            stdout.write(colors.comment + '     ' + item + '\n' + colors.reset);
        } else if (item.items === undefined) {
            // this item is an action
            stdout.write(colors.action + ' ' + key + ' * ' + item.title + '\n' + colors.reset);
        } else {
            // this item is a dir
            stdout.write(colors.directory + ' ' + key + ' > ' + item.title + '\n' + colors.reset);
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
    for (const arg in argv) {
        if (argv.hasOwnProperty(arg)) {
            if (arg === '_') {
                preloadKeys = argv._.join(' ');
                continue;
            }

            switch (arg) {
                case 'license':
                    license();
                    break;

                case 'help':
                    help();
                    break;

                case 'colorless':
                    options.color = false;
                    break;

                case 'l':
                    license();
                    break;

                case 'h':
                case '?':
                    help();
                    break;

                case 'c':
                    options.configPath = argv[arg];
                    break;

                default:
                    unknownArg(arg);
                    break;
            }
        }
    }
}

function help() {
    console.log(`Usage: c [options] [command]

Convenience  Copyright (C) 2018  Alice Jacka
v0.1.0

Command:
    command is a string or characters that convenience will use as
    a path to navigate to the corosponding directory, or perform the
    corosponding action

Options:
    -l, --license           Show the license information
    -h, -?, --help          Display this help page
    -c [path_to_config]     Specify an alternate config file
    --colorless             Run without console colors

More info, source, and issues can be found at https://git.io/fxcjE`);
process.exit(1); // exit non 0 so the tmpfile wont be executed
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

function license() {
    console.log(`Convenience v0.1.0

Convenience. A customisable menu system, for your convenience
https://github.com/non-bin/Convenience
Copyright (C) 2018  Alice Jacka  alice@jacka.net.au

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
`);
    process.exit(1); // exit non 0 so the tmpfile wont be executed
}
