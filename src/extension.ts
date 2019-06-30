import * as vscode from 'vscode';
import * as path from 'path';

const sudo = require('sudo-prompt');
const REG_JUMP_BIN = `${path.resolve(__dirname, '../bin/regjump.exe')} "{key}"`;
const sudoOptions = {
    name: 'RegJump'
};

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('extension.reg.jumpToKey', jumpToRegKey)
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}

function jumpToRegKey(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    textEditor.selections.forEach(function (selection: vscode.Selection) {
        var document = textEditor.document;
        var line = document.lineAt(selection.anchor);
        var text = textEditor.document.getText(line.range);
        var regMatches = text.match(/\[(.*?)\]/);

        if (regMatches) {
            var command = REG_JUMP_BIN.replace("{key}", regMatches[1]);

            sudo.exec(command, sudoOptions, function (err: any, stdout: any, stderr: any) {
                if (err) {
                    console.log(err);
                    vscode.window.showErrorMessage(`RegJump faild, ${err}`);
                    return;
                }

                vscode.window.showInformationMessage("RegJump open command executed successfully !");
            });
        }
    });
}
