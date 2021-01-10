'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const rimraf = require("rimraf");
const generate_light_schemes = require("./generate-light-schemes");
const finish_themes = require("./finish-themes");
const list_themes = require("./list-themes");
const recursive_copy = require('recursive-copy');
const mkdirp = require("mkdirp");
function main() {
    // First make a working directory
    let dir = path.resolve('__dirname', '../../../working');
    if (fs.existsSync(dir)) {
        rimraf.sync(dir);
    }
    mkdirp.sync(dir);
    // Make sure builder is updated.
    let options = {
        cwd: dir,
        encoding: 'utf8'
    };
    try {
        child_process.execSync('base16-builder update', options);
    }
    catch (e) {
        printE(e);
    }
    let updatedTemplateFile = path.resolve(dir, '../../builder/templates/vscode/templates/default.mustache');
    let schemesDir = path.join(dir, 'sources/schemes');
    let themesDir = path.resolve(dir, '../../themes');
    // Copy user updated template to builder template directory
    copy(updatedTemplateFile, path.join(dir, 'sources/templates/vscode/templates/default.mustache'))
        .then(() => {
        // Generate light schemes
        generate_light_schemes.mainWithDir(schemesDir);
        // Build templates
        try {
            child_process.execSync('base16-builder build --template vscode', options);
        }
        catch (e) {
            printE(e);
        }
        // Empty the themes dir
        fs.readdirSync(themesDir).forEach(file => {
            fs.unlinkSync(path.join(themesDir, file));
        });
        // Copy themes
        return copy(path.join(dir, 'themes/vscode/themes'), themesDir);
    })
        .then(() => {
        // Finally, finish themes
        finish_themes.mainWithDir(themesDir);
        // also update themes list
        list_themes.mainWithDir(schemesDir);
        // and copy the result over to the right place
        return copy(path.join(schemesDir, 'themes.md'), path.resolve(dir, '../../themes.md'));
    })
        .then(() => {
        // garbage is bad
        rimraf.sync(dir);
        console.log('Done!');
    });
}
function copy(src, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        var options = {
            overwrite: true
        };
        yield recursive_copy(src, dest, options);
    });
}
function printE(e) {
    const err = e;
    printError(err);
}
function printError(err) {
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
    process.exit(-1);
}
main();
//# sourceMappingURL=build-themes.js.map