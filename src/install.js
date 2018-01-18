#!/usr/bin/env node
const {exec} = require('child_process');
const fs = require('fs-extra');
const pjson = require(process.cwd() + '/package.json');
const npmModuleName = pjson.name;
const haxeModuleName = npmModuleName.substr(npmModuleName.lastIndexOf('/') + 1);
installHaxeModule(pjson.version);
console.log('npmModuleName', npmModuleName);
function installHaxeModule(version) {
    exec('cd .. && npm prefix', (prefixErr, prefixStdOut, prefixStdErr) => {
        if (!version) {
            console.log('Failed to install hacksaw-core: Couldn\'t read version from package.');
            return;
        }
        console.log('prefixStdOut:', prefixStdOut);

        const commaVersion = version.split('.').join(',').replace('\n', '');
        const parentDir = prefixStdOut.replace('\n', '') + '/';
        const npmDir = parentDir + 'node_modules/' + npmModuleName;
        console.log('parentDir:', parentDir);
        console.log('npmDir:', npmDir);
        if (!fs.pathExistsSync(npmDir)) {
            console.log('No parent module. Skipping haxelib install.');
            return;
        }

        const haxelibDir = parentDir + '.haxelib/' + haxeModuleName + '/';
        const versionDir = haxelibDir + commaVersion + '/';
        fs.ensureDirSync(versionDir);
        fs.copy(npmDir, versionDir, copyErr => {
            if (copyErr) {
                console.log('Failed to link ' + haxeModuleName + ':', copyErr);
                return;
            }
            const devPath = '.haxelib/' + haxeModuleName + '/' + commaVersion + '/';
            const devCommand = 'haxelib dev ' + haxeModuleName + ' ' + devPath;
            exec('cd ' + parentDir + ' && ' + devCommand, (haxelibErr, haxelibStdOut, haxelibStdError) => {
                if (haxelibErr) {
                    return console.log(err);
                }
                console.log('Haxe module ' + haxeModuleName + ' was installed!');
                process.exit();
            });
        });
    });
}



