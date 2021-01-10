'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWithDir = exports.main = void 0;
const fs = require("fs");
const path = require("path");
var yaml = require('js-yaml');
function main() {
    mainWithDir('.');
}
exports.main = main;
function mainWithDir(workingDirectory) {
    let resolvedWorkingDirectory = path.resolve(workingDirectory);
    let dir = fs.readdirSync(resolvedWorkingDirectory);
    let schemesDirs = dir.filter(d => {
        return d.indexOf('.') == -1;
    });
    let themesList = '';
    themesList += '# Available Themes\n\n';
    schemesDirs.forEach(schemeDir => {
        let files = fs.readdirSync(path.resolve(workingDirectory, schemeDir));
        let schemes = files.filter(f => { return f.endsWith('.yaml'); });
        schemes.forEach(scheme => {
            let loadedScheme = yaml.safeLoad(fs.readFileSync(path.join(resolvedWorkingDirectory, schemeDir, scheme), 'utf8'));
            console.log(loadedScheme.scheme);
            themesList += (`${loadedScheme.scheme}  \n`);
        });
    });
    fs.writeFileSync(path.join(resolvedWorkingDirectory, 'themes.md'), themesList);
}
exports.mainWithDir = mainWithDir;
main();
//# sourceMappingURL=list-themes.js.map