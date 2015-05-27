#!/usr/bin/env node

var inquirer = require('inquirer'),
    BB = require('bluebird'),
    exec = require('child_process').exec,
    fs = BB.promisifyAll(require('fs')),
    path = require('path'),
    cwd = process.cwd(),
    defaults = [
        'apt',
        'essentials',
        'git',
        'info',
        'pip'
    ],
    pga = require('commander'),
    verbose = false;

pga
    .version(require('./package.json').version)
    .option('-v, --verbose', 'Verbose output')
    .parse(process.argv);

verbose = pga.verbose;

verbose && console.log('verbose output on.');

// TODO: put version number check around this
// Hack to bump EventEmitter.defaultMaxListeners for older versions of node:
// https://github.com/joyent/node/issues/3215
var EventEmitter = require('events').EventEmitter,
    on = EventEmitter.prototype.on;
EventEmitter.prototype.on = function () {
    this._maxListeners = Infinity;
    on.apply(this, arguments);
};

inquirer
    .prompt([
        {
            name : 'roles',
            type : 'checkbox',
            message : 'Which roles do you need?',
            choices : [
                'mongo',
                'mysql',
                'nginx',
                'node',
                'oh-my-zsh',
                'php-fpm'
            ]
        }
    ], function( answers ) {

        var ansibleDir = path.join(cwd, 'ansible');
        fs
            .statAsync(ansibleDir)
            .catch(function(stat) {
                if ('ENOENT' === stat.code) {
                    return fs.mkdirAsync(ansibleDir)
                }
            })
            .then(function() {
                return createDirectories(answers);
            })
            .then(function() {
                return fs.readFileAsync(path.join(cwd, 'ansible', 'site.yml'))
            })
            .then(function(siteFile) {
                siteFile +=
                    '\n' +
                    answers.roles
                        .map(function(role) {
                            return '    - ' + role;
                        })
                        .join('\n') +
                    '\n';

                verbose && console.log('site.yml\n', siteFile);
                return siteFile;
            })
            .then(function(siteFile) {
                return fs.writeFileAsync(path.join(cwd, 'ansible', 'site.yml'), siteFile);
            })
            .then(function() {
                console.log('\n\nRoles are ready to use.\n' +
                    'You may test them out with:\n\n' +
                    '    vagrant up\n');
            })
            .catch(function(error) {
                console.log('WHOOPS:', error);
            });
    });

function createDirectories(answers) {
    var copyDirs = defaults.concat(answers.roles).map(copyDir),
        copyFiles = ['hosts', 'site.yml']
            .map(copyFile)
            .concat([
                runCommand('cp ' + path.join(__dirname, 'Vagrantfile') + ' ' + cwd)
            ]);

        return BB
            .all(copyDirs.concat(copyFiles))
            .catch(function(err) {
                console.log('something went wrong:', err);
            });
}

function copyDir(role) {
    return runCommand('cp -R ' + path.join(__dirname, 'ansible', role) + ' ' + path.join(cwd, 'ansible'));
}

function copyFile(file) {
    return runCommand('cp ' + path.join(__dirname, 'ansible', file) + ' ' + path.join(cwd, 'ansible'));
}

function runCommand(command) {
    return new BB(function(resolve, reject) {
        var childProcess;

        verbose && console.log('running:', command);
        childProcess = exec(command, {
            cwd: cwd,
            customFds: [0,1,2]
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        captureOutput(childProcess);
    });
}

function captureOutput(childProcess) {
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    return childProcess;
}
