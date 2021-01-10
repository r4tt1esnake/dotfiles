'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainWithDir = exports.main = void 0;
const fs = require("fs");
const path = require("path");
var cjson = require('strip-json-comments');
const generate_light_schemes = require("./generate-light-schemes");
function main() {
    mainWithDir('.');
}
exports.main = main;
function mainWithDir(workingDirectory) {
    let dir = fs.readdirSync(path.resolve(workingDirectory));
    let files = dir.filter(d => {
        return d.endsWith('.json');
    });
    files.forEach(f => {
        let json = JSON.parse(cjson(fs.readFileSync(path.resolve(workingDirectory, f), 'utf8')));
        if (!generate_light_schemes.isColorDark(json['colors']['editor.background'])) {
            json.type = 'light';
        }
        fs.writeFileSync(path.resolve(workingDirectory, f), JSON.stringify(json, null, 4));
    });
}
exports.mainWithDir = mainWithDir;
main();
//# sourceMappingURL=finish-themes.js.map