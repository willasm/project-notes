const vscode = require('vscode');
const path = require("path");

// ========================================================================== //
// ---=== Function Activate (Extension Activation) ===---
// ========================================================================== //
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // ========================================================================== //
    //      Activate - Register Extension Commands
    vscode.commands.registerCommand('project-notes.openorcreatenote', openOrCreateNote);
    vscode.commands.registerCommand('project-notes.browsenotesedit', browseNotesEdit);
    vscode.commands.registerCommand('project-notes.browsenotespreview', browseNotesPreview);

    // ========================================================================== //
    //      Activate - Push Subscriptions
    context.subscriptions.push(openOrCreateNote);
    context.subscriptions.push(browseNotesEdit);
    context.subscriptions.push(browseNotesPreview);

}
// ========================================================================== //
// ---=== Function openOrCreateNote - (Open or Create New Note) ===---
// ========================================================================== //
async function openOrCreateNote() {

    // ========================================================================== //
    //      openOrCreateNote - Verify Text Editor Open + Workspace Folder Exists
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('Text Editor Not Open!');
        return;
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // ========================================================================== //
    //      openOrCreateNote - Get current lines text
    const lineText = editor.document.lineAt(editor.selection.active.line).text;
    const fileregex = new RegExp(/file: *([A-Za-z0-9_-]+)/);
    var found = fileregex.test(lineText);

    // ========================================================================== //
    //      openOrCreateNote - Get Filename from comment
    if (found) {
        const filenameArray = fileregex.exec(lineText);
        var filename = filenameArray[1] + '.MD';
        // ========================================================================== //
        //      openOrCreateNote - Get current workspace folder for Filename
    } else {
        let filepath = vscode.workspace.workspaceFolders[0].uri.path;
        var filename = new String(filepath).substring(filepath.lastIndexOf('/') + 1) + '.MD';
    }

    // ========================================================================== //
    //      openOrCreateNote - Open Filename.MD
    const activeTextEditor = vscode.window.activeTextEditor;
    const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + filename;
    if (!activeTextEditor || activeTextEditor.document.fileName !== notesFilePath) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.createFile(vscode.Uri.file(notesFilePath), { overwrite: false, ignoreIfExists: true });
        await vscode.workspace.applyEdit(workspaceEdit);
        const document = await vscode.workspace.openTextDocument(notesFilePath);
        vscode.window.showTextDocument(document, { preview: true });
    } else {
        if (activeTextEditor.document.isDirty) { // Save modified file first
            const saved = await activeTextEditor.document.save();
            if (saved) {
                vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            }
        } else {
            vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        }
    }
}


// ========================================================================== //
// ---=== Function browseNotesEdit - (Open Existing Project Note in Edit Mode) ===---
// ========================================================================== //
async function browseNotesEdit() {

    // ========================================================================== //
    //      browseNotesEdit - Verify Workspace Folder Exists
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // ========================================================================== //
    //      browseNotesEdit - Initialize Quick Pick
    let items = [];
    let options = {
        placeHolder: "Select Project Note to Edit",
        title: "---=== Project Notes - View Note in Edit Mode ===---"
    };

    // ========================================================================== //
    //      browseNotesEdit - Search for Project Notes and Show Quick Pick
    let inputAsWorkspaceRelativeFolder = '.vscode';
    let glob = '**/' + inputAsWorkspaceRelativeFolder + '/*.MD';
    let results = await vscode.workspace.findFiles(glob, null, 500);
    if (results.length == 0) { // If Zero Note Files Found, Inform User and Return
        vscode.window.showWarningMessage('No Project Note Files Found!');
        return;
    }
    for (const file of results) {
        const base = path.basename(file.fsPath);
        items.push(base);
    }
    const result = await vscode.window.showQuickPick(items, options);

    // ========================================================================== //
    //      browseNotesEdit - Open Project Note File or Return if Cancelled
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + result;
    const document = await vscode.workspace.openTextDocument(notesFilePath);
    vscode.window.showTextDocument(document, { preview: false });
}


// ========================================================================== //
// ---=== Function browseNotesPreview - (Open Existing Project Note in Preview Mode) ===---
// ========================================================================== //
async function browseNotesPreview() {

    // ========================================================================== //
    //      browseNotesPreview - Verify Workspace Folder Exists
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // ========================================================================== //
    //      browseNotesPreview - Initialize Quick Pick
    let items = [];
    let options = {
        placeHolder: "Select Project Note to Edit",
        title: "---=== Project Notes - View Note in Preview Mode ===---"
    };

    // ========================================================================== //
    //      browseNotesPreview - Search for Project Notes and Show Quick Pick
    let inputAsWorkspaceRelativeFolder = '.vscode';
    let glob = '**/' + inputAsWorkspaceRelativeFolder + '/*.MD';
    let results = await vscode.workspace.findFiles(glob, null, 500);
    if (results.length == 0) { // If Zero Note Files Found, Inform User and Return
        vscode.window.showWarningMessage('No Project Note Files Found!');
        return;
    }
    for (const file of results) {
        const base = path.basename(file.fsPath);
        items.push(base);
    }
    const result = await vscode.window.showQuickPick(items, options);

    // ========================================================================== //
    //      browseNotesPreview - Open Project Note File or Return if Cancelled
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const document = vscode.Uri.file(path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + result);
    await vscode.commands.executeCommand('markdown.showPreview', document);
}


// ========================================================================== //
// ---=== Function deactivate - This Method is Called When Extension is Deactivated ===---
// ========================================================================== //
function deactivate() {}

// ========================================================================== //
// ---=== Export modules ===---
// ========================================================================== //
module.exports = {
    activate,
    deactivate
}