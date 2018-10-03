var config = {
    'title': 'Main Menu',
    'items': {
        'a': {
            'title': 'menu a',
            'items': {
                'd': {
                    'title': 'menu d',
                    'items': {
                        'c': {
                            'title': 'action c',
                            'action': {
                                'command': 'echo',
                                'params': [
                                    'action c'
                                ]
                            }
                        }
                    }
                }
            }
        },
        'b': {
            'title': 'action b',
            'action': {
                'command': 'echo',
                'params': [
                    'action b'
                ]
            }
        }
    }
}

// export the config variable for use
module.exports = config;

/*
// define special charactor codes
const UP_ARROW    = '[A';
const DOWN_ARROW  = '[B';
const RIGHT_ARROW = '[C';
const LEFT_ARROW  = '[D';
*/
