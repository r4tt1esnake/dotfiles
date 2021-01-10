'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isColorDark = exports.mainWithDir = exports.main = void 0;
const fs = require("fs");
const path = require("path");
var yaml = require('js-yaml');
const color = require("color");
var VersionToCreate;
(function (VersionToCreate) {
    VersionToCreate[VersionToCreate["Dark"] = 0] = "Dark";
    VersionToCreate[VersionToCreate["Light"] = 1] = "Light";
})(VersionToCreate || (VersionToCreate = {}));
let filesToDelete = [];
function main() {
    mainWithDir('.');
}
exports.main = main;
function mainWithDir(workingDirectory) {
    // read the directory
    let dir = fs.readdirSync(path.resolve(workingDirectory));
    // then filter out everything that isn't a folder
    let schemesDirs = dir.filter(d => {
        return d.indexOf('.') == -1;
    });
    schemesDirs.forEach(schemeDir => {
        console.log(`Current folder: ${schemeDir}`);
        // then for each scheme folder read the directory
        let files = fs.readdirSync(path.resolve(workingDirectory, schemeDir));
        // filter out anything that isn't a .yaml file
        let schemes = files.filter(f => {
            return f.endsWith('.yaml');
        });
        // now pair the light and dark themes up, ignore anything that seems like a weird file
        // weird files are files where base00 and base07 are either both dark or both light
        let pairings = [];
        let other = [];
        let schemesCopy = schemes.slice();
        for (let i = 0; i < schemesCopy.length; i++) {
            const scheme = schemesCopy[i];
            let pathToSchemeFolder = path.resolve(workingDirectory, schemeDir);
            let isDark = isSchemeDark(scheme, pathToSchemeFolder);
            let fileNameIsDark = null;
            let matchingSchemes = findMatchingSchemeNames(scheme, schemesCopy);
            if (isDark.isWeird) {
                if (isDark.isDark) {
                    console.log(`Scheme is dark on both ends: ${scheme}`);
                }
                else {
                    console.log(`Scheme is light on both ends: ${scheme}`);
                }
                other.push(scheme);
                schemesCopy.splice(schemesCopy.indexOf(scheme), 1);
                i--;
                continue;
            }
            if (matchingSchemes.length == 0) {
                // couldn't find any matching schemes so we probably need to create the other version
                if (isDark.isDark) {
                    pairings.push({
                        dark: scheme,
                        light: null
                    });
                }
                else {
                    pairings.push({
                        dark: null,
                        light: scheme
                    });
                }
                schemesCopy.splice(schemesCopy.indexOf(scheme), 1);
            }
            else if (matchingSchemes.length == 1) {
                // found a matching
                let matchingScheme = matchingSchemes[0];
                let matchingIsDark = isSchemeDark(matchingScheme, pathToSchemeFolder);
                if (isDark.isDark == matchingIsDark.isDark) {
                    // the file we matched to is the same theme type!
                    console.log(`WARNING: Matching may be incorrect! ${scheme} -> ${matchingScheme}`);
                }
                if (isDark.isDark) {
                    pairings.push({
                        dark: scheme,
                        light: matchingScheme
                    });
                }
                else {
                    pairings.push({
                        dark: matchingScheme,
                        light: scheme
                    });
                }
                schemesCopy.splice(schemesCopy.indexOf(scheme), 1);
                schemesCopy.splice(schemesCopy.indexOf(matchingScheme), 1);
            }
            else if (matchingSchemes.length > 1) {
                // if we match on more than one just ignore everything
                console.log(`WARNING: Found more than one matching scheme, just pushing to other.`);
                console.log(scheme);
                matchingSchemes.forEach(s => {
                    console.log(s);
                    schemesCopy.splice(schemesCopy.indexOf(s), 1);
                });
                schemesCopy.splice(schemesCopy.indexOf(scheme), 1);
            }
            // we set i to -1 here because we want to go back to the beginning of the array because we could have
            // removed items in any position of the array, we are always removing items from the array so we can't
            // infinite loop
            i = -1;
        }
        console.log('Pairings:');
        pairings.forEach(p => {
            console.log(`(${p.dark}, ${p.light})`);
        });
        console.log('Other:');
        other.forEach(p => { console.log(p); });
        // now for each pairing
        pairings.forEach(pairing => {
            let pathToSchemeFolder = path.resolve(workingDirectory, schemeDir);
            if (pairing.dark == null) {
                // create dark version from light version
                console.log(`Creating dark version from light version: ${pairing.light}`);
                pairing.dark = reverseAndPolishScheme(pairing.light, pathToSchemeFolder, true, VersionToCreate.Dark, true);
            }
            if (pairing.light == null) {
                // create light version from dark version
                console.log(`Creating light version from dark version: ${pairing.dark}`);
                pairing.light = reverseAndPolishScheme(pairing.dark, pathToSchemeFolder, true, VersionToCreate.Light, true);
            }
            // and also make sure schemes are polished
            polishScheme(pairing.light, pathToSchemeFolder, VersionToCreate.Light);
            polishScheme(pairing.dark, pathToSchemeFolder, VersionToCreate.Dark);
        });
        filesToDelete.forEach(file => {
            console.log(`Deleting ${file}`);
            fs.unlinkSync(file);
        });
        filesToDelete = [];
    });
}
exports.mainWithDir = mainWithDir;
function reverseAndPolishScheme(schemeFile, pathToSchemeFolder, reverseFile, versionToCreate, appendVersionToTitle) {
    let loadedScheme = yaml.safeLoad(fs.readFileSync(path.join(pathToSchemeFolder, schemeFile), 'utf8'));
    let strippedFileName = schemeFile.replace('-light', '').replace('-dark', '');
    let newFileName = '';
    if (reverseFile) {
        console.log(`Reversing`);
        let greyColors = [];
        for (let i = 0; i < 8; i++) {
            greyColors.push(loadedScheme['base0' + i]);
        }
        greyColors.reverse();
        for (let i = 0; i < 8; i++) {
            loadedScheme['base0' + i] = greyColors[i];
        }
    }
    if (appendVersionToTitle) {
        loadedScheme.scheme = cleanSchemeTitle(loadedScheme.scheme);
        if (versionToCreate == VersionToCreate.Dark) {
            console.log(`Appending dark to ${loadedScheme.scheme}`);
            loadedScheme['scheme'] += ' Dark';
        }
        else if (versionToCreate == VersionToCreate.Light) {
            console.log(`Appending light to ${loadedScheme.scheme}`);
            loadedScheme['scheme'] += ' Light';
        }
    }
    if (versionToCreate == VersionToCreate.Dark) {
        newFileName = appendStringToFilename(strippedFileName, '-dark');
    }
    else if (versionToCreate == VersionToCreate.Light) {
        newFileName = appendStringToFilename(strippedFileName, '-light');
    }
    console.log(`Creating new file and deleting old file: ${newFileName}`);
    fs.writeFileSync(path.join(pathToSchemeFolder, newFileName), yaml.safeDump(loadedScheme));
    if (filesToDelete.indexOf(path.join(pathToSchemeFolder, schemeFile)) == -1) {
        if (schemeFile.indexOf('-dark') == -1 && schemeFile.indexOf('-light') == -1) {
            filesToDelete.push(path.join(pathToSchemeFolder, schemeFile));
        }
    }
    return newFileName;
}
function polishScheme(schemeFile, pathToSchemeFolder, versionToCreate) {
    if (schemeFile.indexOf('-light') != -1) {
        return schemeFile;
    }
    if (schemeFile.indexOf('-dark') != -1) {
        return schemeFile;
    }
    let loadedScheme = yaml.safeLoad(fs.readFileSync(path.join(pathToSchemeFolder, schemeFile), 'utf8'));
    let strippedFileName = schemeFile.replace('-light', '').replace('-dark', '');
    let newFileName = '';
    loadedScheme.scheme = cleanSchemeTitle(loadedScheme.scheme);
    if (versionToCreate == VersionToCreate.Dark) {
        console.log(`Appending dark to ${loadedScheme.scheme}`);
        loadedScheme['scheme'] += ' Dark';
    }
    else if (versionToCreate == VersionToCreate.Light) {
        console.log(`Appending light to ${loadedScheme.scheme}`);
        loadedScheme['scheme'] += ' Light';
    }
    if (versionToCreate == VersionToCreate.Dark) {
        newFileName = appendStringToFilename(strippedFileName, '-dark');
    }
    else if (versionToCreate == VersionToCreate.Light) {
        newFileName = appendStringToFilename(strippedFileName, '-light');
    }
    console.log(`Creating new file and deleting old file: ${newFileName}`);
    fs.writeFileSync(path.join(pathToSchemeFolder, newFileName), yaml.safeDump(loadedScheme));
    if (filesToDelete.indexOf(path.join(pathToSchemeFolder, schemeFile)) == -1) {
        filesToDelete.push(path.join(pathToSchemeFolder, schemeFile));
    }
}
function cleanSchemeTitle(schemeTitle) {
    if (schemeTitle.endsWith(' Dark')) {
        schemeTitle = schemeTitle.replace(' Dark', '');
    }
    if (schemeTitle.endsWith(' Light')) {
        schemeTitle = schemeTitle.replace(' Light', '');
    }
    return schemeTitle;
}
function appendStringToFilename(filename, str) {
    let splitNumber = (filename.length - filename.lastIndexOf('.')) * -1;
    return filename.slice(0, splitNumber) + str + filename.slice(splitNumber);
}
function isSchemeDark(schemeFile, pathToSchemeFolder) {
    let loadedScheme = yaml.safeLoad(fs.readFileSync(path.join(pathToSchemeFolder, schemeFile), 'utf8'));
    let base00 = isColorDark(`#${loadedScheme.base00}`);
    let base07 = isColorDark(`#${loadedScheme.base07}`);
    let schemeProperties = {
        isDark: base00,
        isWeird: base00 == base07
    };
    return schemeProperties;
}
function isColorDark(inputColor) {
    let c = color(inputColor);
    // algorithm from https://docs.microsoft.com/en-us/windows/uwp/style/color
    return (5 * c.green() + 2 * c.red() + c.blue()) <= 8 * 128;
}
exports.isColorDark = isColorDark;
function findMatchingSchemeNames(scheme, schemes) {
    let matching = [];
    let plainSchemeName = scheme;
    if (plainSchemeName.indexOf('-light') != -1) {
        plainSchemeName = plainSchemeName.replace('-light', '');
    }
    if (plainSchemeName.indexOf('-dark') != -1) {
        plainSchemeName = plainSchemeName.replace('-dark', '');
    }
    schemes.forEach(s => {
        if (s == plainSchemeName && s != scheme) {
            matching.push(s);
            return;
        }
        let matchingPlainSchemeName = s;
        if (matchingPlainSchemeName.indexOf('-light') != -1) {
            matchingPlainSchemeName = matchingPlainSchemeName.replace('-light', '');
        }
        if (matchingPlainSchemeName.indexOf('-dark') != -1) {
            matchingPlainSchemeName = matchingPlainSchemeName.replace('-dark', '');
        }
        if (matchingPlainSchemeName == plainSchemeName && s != scheme) {
            matching.push(s);
            return;
        }
    });
    return matching;
}
main();
//# sourceMappingURL=generate-light-schemes.js.map