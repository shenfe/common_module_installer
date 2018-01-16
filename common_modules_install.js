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
        if (d === '') continue;
        if (fs.existsSync(d) && fs.statSync(d).isDirectory()) continue;
        fs.mkdirSync(d);
    }
};

ensureDir(`${feSource}`);

const syncRepo = (function () {
    let flag = false;
    return function () {
        if (flag) return;
        flag = true;
        if (fs.readdirSync(`${feSource}`).length) {
            child_process.execSync(`cd ${feSource} && git pull`);
        } else {
            child_process.execSync(`git clone git@code.ops.focus.cn:system/front-end.git ${feSource}`);
        }
    };
})();

const detectSource = s => {
    if (/^http(s)?:\/\//.test(s)) return 1;
    return 0;
};

conf.modules.forEach(mod => {
    let dir = `${ctx}${mod.target}`.split('/');
    dir.pop();
    ensureDir(dir.join('/'));
    
    let srcType = detectSource(mod.source);
    if (srcType === 0) {
        syncRepo();
        child_process.execSync(`cp -rf ${feSource}/${resDir}/${mod.source} ${ctx}${mod.target}`);
    } else if (srcType === 1) {
        child_process.execSync(`curl ${mod.source}?${Date.now()} > ${ctx}${mod.target}`);
    }
});
