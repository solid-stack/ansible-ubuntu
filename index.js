#!/usr/bin/env node

var inquirer = require("inquirer"),
    path = require('path');

inquirer
    .prompt([
        {
            name : 'roles',
            type : 'checkbox',
            message : 'Which roles do you need?',
            choices : [
                'elastic-search',
                'essentials',
                'git',
                'mongo',
                'mysql',
                'nginx',
                'node',
                'oh-my-zsh',
                'php-fpm',
                'pip'
            ]
        }
    ], function( answers ) {
        console.log(answers);

        answers.roles.forEach(function (role) {
            fs.readFile(path.join('ansible', role), function (err, data) {
                if (err) throw err;
                console.log(data);
            });
        });
    });