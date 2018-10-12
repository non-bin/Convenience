# Convenience

## Pure Convenience

Convenience is a customisable menu system, for your convenience.

## But How Do?

Add an alias to conveience/convenience.sh by adding something like

    alias c="~/Convenience/conveience/convenience.sh"

to your .bashrc or similar, then start building your config file

## Known Issues

### Alias Problem In Zsh

Aliases defined with the `alias` command in zsh, produce a weird issue where if an alias is given as a parameter, the alias is resolved. Here's an example

    // .zshrc
    alias c=". /path/to/convenience.sh "
    alias a="bad-thing"

    // zsh
    #> c a
    'bad-thing' is fed to convenience instead of 'a'

This can be prevented by using a function definition instead of an alias, have another example

    // .zshrc
    c() {
        . /path/to/convenience.sh "$@"
    }

The `"$@"` is important (including the `"`s) to actually pass the params through


## Lisence

    https://github.com/non-bin/Convenience
    Convenience. A customisable menu system, for your convenience
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
