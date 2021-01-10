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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
var cjson = require('strip-json-comments');
function activate(context) {
    let activateThemeCommand = vscode.commands.registerCommand('base16.generator.activateTheme', function () {
        activateTheme();
    });
    let deactivateThemeCommand = vscode.commands.registerCommand('base16.generator.deactivateTheme', function () {
        deactivateTheme();
    });
    let activateAllThemesCommand = vscode.commands.registerCommand('base16.generator.activateAllThemes', function () {
        activateAllThemes();
    });
    let deactivateAllThemesCommand = vscode.commands.registerCommand('base16.generator.deactivateAllThemes', function () {
        deactivateAllThemes();
    });
    context.subscriptions.push(activateThemeCommand);
    context.subscriptions.push(deactivateThemeCommand);
    context.subscriptions.push(activateAllThemesCommand);
    context.subscriptions.push(deactivateAllThemesCommand);
}
exports.activate = activate;
function activateTheme() {
    return __awaiter(this, void 0, void 0, function* () {
        const themesDir = path.resolve(__dirname, '../../themes');
        const themes = fs.readdirSync(themesDir);
        const themesList = themes.map(t => {
            const loadedTheme = parseJson(fs.readFileSync(path.join(themesDir, t), 'utf8'));
            const item = {
                label: loadedTheme.name,
                description: t
            };
            return item;
        });
        const selectedThemes = yield vscode.window.showQuickPick(themesList, {
            ignoreFocusOut: false,
            matchOnDescription: false,
            matchOnDetail: false,
            placeHolder: 'Base16 Default Dark',
            canPickMany: true
        });
        if (!selectedThemes) {
            return;
        }
        const packageInfo = getPackageInfo();
        let numberOfThemesActivated = 0;
        for (const selectedTheme of selectedThemes) {
            const themeFile = parseJson(fs.readFileSync(path.join(themesDir, selectedTheme.description), 'utf8'));
            let themeType = 'vs-dark';
            if (themeFile.type == 'dark') {
                themeType = 'vs-dark';
            }
            else if (themeFile.type == 'light') {
                themeType = 'vs';
            }
            const theme = {
                label: selectedTheme.label,
                uiTheme: themeType,
                path: './themes/' + selectedTheme.description
            };
            packageInfo.contributes.themes.push(theme);
            numberOfThemesActivated += 1;
        }
        writePackageInfo(packageInfo);
        let restartString = '';
        if (numberOfThemesActivated == 1) {
            restartString = `${numberOfThemesActivated} Base16 theme has been activated. Please restart VSCode and then go to Preferences: Color Theme.`;
        }
        else {
            restartString = `${numberOfThemesActivated} Base16 themes have been activated. Please restart VSCode and then go to Preferences: Color Theme.`;
        }
        yield promptRestart(restartString);
    });
}
function activateAllThemes() {
    return __awaiter(this, void 0, void 0, function* () {
        const themesDir = path.resolve(__dirname, '../../themes');
        const themes = fs.readdirSync(themesDir);
        const packageInfo = getPackageInfo();
        packageInfo.contributes.themes = [];
        for (const theme of themes) {
            const themeFile = parseJson(fs.readFileSync(path.join(themesDir, theme), 'utf8'));
            let themeType = 'vs-dark';
            if (themeFile.type == 'dark') {
                themeType = 'vs-dark';
            }
            else if (themeFile.type == 'light') {
                themeType = 'vs';
            }
            const extensionTheme = {
                label: themeFile.name,
                uiTheme: themeType,
                path: './themes/' + theme
            };
            packageInfo.contributes.themes.push(extensionTheme);
        }
        writePackageInfo(packageInfo);
        yield promptRestart('All Base16 themes have been activated. Please restart VSCode and then go to Preferences: Color Theme.');
    });
}
function deactivateTheme() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageInfo = getPackageInfo();
        if (packageInfo.contributes.themes.length == 0) {
            vscode.window.showInformationMessage('No themes to deactivate.');
            return;
        }
        const activatedThemes = packageInfo.contributes.themes.map(theme => {
            let themePathSplit = theme.path.split('/');
            let themeJson = themePathSplit[themePathSplit.length - 1];
            let item = {
                label: theme.label,
                description: themeJson
            };
            return item;
        });
        const deactivatedThemes = yield vscode.window.showQuickPick(activatedThemes, {
            ignoreFocusOut: false,
            matchOnDescription: false,
            matchOnDetail: false,
            canPickMany: true
        });
        if (!deactivatedThemes) {
            return;
        }
        let numberOfThemesDeactivated = 0;
        for (const theme of deactivatedThemes) {
            for (let i = 0; i < packageInfo.contributes.themes.length; i++) {
                const packageInfoTheme = packageInfo.contributes.themes[i];
                if (packageInfoTheme.label == theme.label) {
                    packageInfo.contributes.themes.splice(i, 1);
                    i -= 1;
                    numberOfThemesDeactivated += 1;
                    break;
                }
            }
        }
        writePackageInfo(packageInfo);
        let restartString = '';
        if (numberOfThemesDeactivated == 1) {
            restartString = `${numberOfThemesDeactivated} Base16 theme has been deactivated. Please restart VSCode.`;
        }
        else {
            restartString = `${numberOfThemesDeactivated} Base16 themes have been deactivated. Please restart VSCode.`;
        }
        yield promptRestart(restartString);
    });
}
function deactivateAllThemes() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageInfo = getPackageInfo();
        if (packageInfo.contributes.themes.length == 0) {
            vscode.window.showInformationMessage('No themes to deactivate.');
            return;
        }
        packageInfo.contributes.themes = [];
        writePackageInfo(packageInfo);
        yield promptRestart('All Base16 themes have been deactivated. Please restart VSCode.');
    });
}
function getPackageInfo() {
    return parseJson(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
}
function writePackageInfo(packageInfo) {
    fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(packageInfo, null, 2));
}
function promptRestart(informationMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let reloadAction = { title: 'Reload Now' };
        let selectedAction = yield vscode.window.showInformationMessage(informationMessage, reloadAction);
        if (!selectedAction) {
            return;
        }
        if (selectedAction.title == reloadAction.title) {
            yield vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });
}
function parseJson(text) {
    return JSON.parse(cjson(text));
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map