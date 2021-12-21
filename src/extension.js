const vscode = require('vscode');
const path = require("path");

// ========================================================================== //
// Function Activate (Extension Activation)
// ========================================================================== //
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // ========================================================================== //
    //      Activate - Register Extension Commands
    let disposable = vscode.commands.registerCommand('project-notes.openorcreatenote', openOrCreateNote);

    // ========================================================================== //
    //      Activate - Call Initialize Extension Function
    initExtension();

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from Project Notes!');

    // ========================================================================== //
    //      Activate - Push Subscriptions
    context.subscriptions.push(disposable);
    //context.subscriptions.push(openOrCreateNote);

}
// ========================================================================== //
// ---=== Function openOrCreateNote - (Open or Create New Note) ===---
// ========================================================================== //
async function openOrCreateNote() {
    console.log("Open or Create Note");

    // ========================================================================== //
    //      openOrCreateNote - Get current lines text
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('Text Editor Not Open!');
        return;
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return;
    }

    const lineText = editor.document.lineAt(editor.selection.active.line).text;
    const fileregex = new RegExp(/file: *([A-Za-z0-9_-]+)/);
    var found = fileregex.test(lineText);
    console.log(found);
    if (found) {
        const filenameArray = fileregex.exec(lineText);
        var filename = filenameArray[1] + '.MD';
        console.log("Filename found");
        console.log(lineText);
        console.log(filename);
    } else {
        let filepath = vscode.workspace.workspaceFolders[0].uri.path;
        var filename = new String(filepath).substring(filepath.lastIndexOf('/') + 1) + '.MD';
        console.log("Filename not found - Opening ProjectName.MD note file");
        console.log(lineText);
        console.log(filename);
    }
    const activeTextEditor = vscode.window.activeTextEditor;
    const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + filename;
    console.log(notesFilePath);
    if (!activeTextEditor || activeTextEditor.document.fileName !== notesFilePath) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.createFile(vscode.Uri.file(notesFilePath), { overwrite: false, ignoreIfExists: true });
        await vscode.workspace.applyEdit(workspaceEdit);
        const document = await vscode.workspace.openTextDocument(notesFilePath);
        vscode.window.showTextDocument(document, { preview: false });
    } else {
        if (activeTextEditor.document.isDirty) {
            const saved = await activeTextEditor.document.save();
            if (saved) {
                vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            }
        } else {
            vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        }
    }
}

function initExtension() {
    console.log("Initialize Extension");

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}