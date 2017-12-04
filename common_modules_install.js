const fs = require('fs');
const path = require('path');

const child_process = require('child_process');

const conf = require('./common_modules');

const ctx = (conf.context || '.') + '/';

const feSource = './node_modules/a_unique_folder_name_for_your_common_module_repository';
const gitUrl = 'git@your-server.com:some-role/your-common-module-repository.git';

const resDir = 'path/to/module/dists';

const ensureDir = dir => {
    let dirs = dir.split('/');
    let p = [];
    while (true) {
        if (!dirs.length) break;
        p.push(dirs.shift());
        let d = p.join('/');
        if (fs.existsSync(d) && fs.statSync(d).isDirectory()) continue;
        fs.mkdirSync(d);
    }
};

ensureDir(`${feSource}`);

if (fs.readdirSync(`${feSource}`).length) {
    child_process.execSync(`cd ${feSource} && git pull`);
} else {
    child_process.execSync(`git clone ${gitUrl} ${feSource}`);
}

conf.modules.forEach(mod => {
    let dir = `${ctx}${mod.target}`.split('/');
    dir.pop();
    ensureDir(dir.join('/'));
    child_process.execSync(`cp -rf ${feSource}/${resDir}/${mod.source} ${ctx}${mod.target}`);
});
