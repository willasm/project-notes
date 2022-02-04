const vscode = require('vscode');
const path = require("path");
const fs = require("fs");
const os = require("os");

let myContext;
let settings = vscode.workspace.getConfiguration("project-notes");
let globalNotesFolder = settings.get("globalNotesFolder");

// ========================================================================== //
//                     ---=== [Function Activate] ===---
//                          (Extension Activation)
// ========================================================================== //
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // ========================================================================== //
    //      Activate - Initialize Extension
    myContext = context;
    
    // ========================================================================== //
    //      Activate - Register Extension Commands
    vscode.commands.registerCommand('project-notes.openorcreatenote', openOrCreateNote);
    vscode.commands.registerCommand('project-notes.notesedit', notesEdit);
    vscode.commands.registerCommand('project-notes.notespreview', notesPreview);
    vscode.commands.registerCommand('project-notes.setnotesglobalfolder', setNotesGlobalFolder);
    vscode.commands.registerCommand('project-notes.openorcreateglobalnote', openOrCreateGlobalNote);
    vscode.commands.registerCommand('project-notes.notesglobaledit', notesGlobalEdit);
    vscode.commands.registerCommand('project-notes.notesglobalpreview', notesGlobalPreview);

    // ========================================================================== //
    //      Activate - Push Subscriptions
    context.subscriptions.push(openOrCreateNote);
    context.subscriptions.push(notesEdit);
    context.subscriptions.push(notesPreview);
    context.subscriptions.push(setNotesGlobalFolder);
    context.subscriptions.push(openOrCreateGlobalNote);
    context.subscriptions.push(notesGlobalEdit);
    context.subscriptions.push(notesGlobalPreview);

}


// ========================================================================== //
//                 ---=== [Function openOrCreateNote] ===---
//                         (Open or Create New Note)
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
    const fileregex = new RegExp(/file: *([A-Za-z0-9_-]+)/i);
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
//                     ---=== [Function notesEdit] ===---
//                 (Open Existing Project Note in Edit Mode) 
// ========================================================================== //
async function notesEdit() {

    // ========================================================================== //
    //      notesEdit - Verify Workspace Folder Exists
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // ========================================================================== //
    //      notesEdit - Initialize Quick Pick
    let items = [];
    let options = {
        placeHolder: "Select Project Note to Edit",
        title: "---=== Project Notes - View Note in Edit Mode ===---"
    };

    // ========================================================================== //
    //      notesEdit - Search for Project Notes and Show Quick Pick
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
    //      notesEdit - Open Project Note File or Return if Cancelled
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + result;
    const document = await vscode.workspace.openTextDocument(notesFilePath);
    vscode.window.showTextDocument(document, { preview: false });
}


// ========================================================================== //
//                   ---=== [Function notesPreview]  ===---
//                (Open Existing Project Note in Preview Mode)
// ========================================================================== //
async function notesPreview() {

    // ========================================================================== //
    //      notesPreview - Verify Workspace Folder Exists
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // ========================================================================== //
    //      notesPreview - Initialize Quick Pick
    let items = [];
    let options = {
        placeHolder: "Select Project Note to Preview",
        title: "---=== Project Notes - View Note in Preview Mode ===---"
    };

    // ========================================================================== //
    //      notesPreview - Search for Project Notes and Show Quick Pick
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
    //      notesPreview - Open Project Note File or Return if Cancelled
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const document = vscode.Uri.file(path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + result);
    await vscode.commands.executeCommand('markdown.showPreview', document);
}

// ========================================================================== //
//               ---=== [Function setNotesGlobalFolder] ===---
//                    (Set Global Notes Folder Location)
// ========================================================================== //
async function setNotesGlobalFolder() {
    // Get Global Notes Folder From User
    const home = vscode.Uri.file(path.join(os.homedir()))
    const options = OpenDialogOptions = {
        title: "Select Folder Location for Global Notes Storage",
        defaultUri: home,
        canSelectMany: false,
        canSelectFolders: true,
        canSelectFiles: false,
        openLabel: "Select Folder for Global Notes Storage"
    };
    const folderUri = await vscode.window.showOpenDialog(options);
    if (folderUri && folderUri[0]) {
        globalNotesFolder = folderUri[0].fsPath;
        //console.log('Selected file: ' + folderUri[0].fsPath);
        console.log(globalNotesFolder);
        let settings = vscode.workspace.getConfiguration("project-notes");
        settings.update("globalNotesFolder",globalNotesFolder,1);
    }
}



// ========================================================================== //
//                 ---=== [Function openOrCreateGlobalNote] ===---
//                         (Create New Global Note)
// ========================================================================== //
async function openOrCreateGlobalNote() {
    // ========================================================================== //
    //      openOrCreateGlobalNote - Verify Text Editor Open + Global Notes Folder Exists
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('Text Editor Not Open!');
        return;
    }
    if (globalNotesFolder.length == 0) {
        vscode.window.showWarningMessage('Global Folder Location has not been defined yet.');
        return;

    }

    // ========================================================================== //
    //      openOrCreateGlobalNote - Get current lines text
    const lineText = editor.document.lineAt(editor.selection.active.line).text;
    const globalfileregex = new RegExp(/global file: *([A-Za-z0-9_-]+)/i);
    var found = globalfileregex.test(lineText);
    let fileName;
    let filePath;

    // ========================================================================== //
    //      openOrCreateGlobalNote - Get Filename from comment
    if (found) {
        const filenameArray = globalfileregex.exec(lineText);
        fileName = filenameArray[1] + '.MD';
        filePath = globalNotesFolder+'\\'+fileName;
        // ========================================================================== //
        //      openOrCreateGlobalNote - Prompt for Filename from User
    } else {
        fileName = await vscode.window.showInputBox({
        placeHolder: "Global Note Name to Open or Create",
        prompt: "Open or Create New Global Note: "
        });
        let parts = fileName.split(".");
        fileName = parts[0]+'.MD';
        filePath = globalNotesFolder+'\\'+fileName;
    }

    // ========================================================================== //
    //      openOrCreateGlobalNote - Open Filename.MD
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor || activeTextEditor.document.fileName !== filePath) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.createFile(vscode.Uri.file(filePath), { overwrite: false, ignoreIfExists: true });
        await vscode.workspace.applyEdit(workspaceEdit);
        const document = await vscode.workspace.openTextDocument(filePath);
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
//                  ---=== [Function notesGlobalEdit] ===---
//                  (Open Existing Global Note in Edit Mode)
// ========================================================================== //
async function notesGlobalEdit() {
    if (globalNotesFolder.length == 0) {
        vscode.window.showWarningMessage('Global Folder Location has not been defined yet.');
        return;
    }
    let items = [];
    let options = {
        placeHolder: "Select Global Note to Preview",
        title: "---=== Project Notes - View Global Note in Preview Mode ===---"
    };

    // ========================================================================== //
    //      notesGlobalPreview - Search for Global Notes and Show Quick Pick
    results = await vscode.workspace.findFiles(new vscode.RelativePattern(globalNotesFolder, '*.md'), '**/node_modules/**');
    if (results.length == 0) { // If Zero Note Files Found, Inform User and Return
        vscode.window.showWarningMessage('No Global Note Files Found!');
        return;
    }
    for (const file of results) {
        const base = path.basename(file.fsPath);
        items.push(base);
    }
    const result = await vscode.window.showQuickPick(items, options);

    // ========================================================================== //
    //      notesGlobalPreview - Open Global Note File or Return if Cancelled
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const notesFilePath = path.join(globalNotesFolder, '\\') + result;
    document = vscode.workspace.openTextDocument(notesFilePath);
    await vscode.window.showTextDocument(document);
}


// ========================================================================== //
//                ---=== [Function notesGlobalPreview] ===---
//                (Open Existing Global Note in Preview Mode)
// ========================================================================== //
async function notesGlobalPreview() {
    if (globalNotesFolder.length == 0) {
        vscode.window.showWarningMessage('Global Folder Location has not been defined yet.');
        return;
    }
    let items = [];
    let options = {
        placeHolder: "Select Global Note to Preview",
        title: "---=== Project Notes - View Global Note in Preview Mode ===---"
    };

    // ========================================================================== //
    //      notesGlobalPreview - Search for Global Notes and Show Quick Pick
    results = await vscode.workspace.findFiles(new vscode.RelativePattern(globalNotesFolder, '*.md'), '**/node_modules/**');
    if (results.length == 0) { // If Zero Note Files Found, Inform User and Return
        vscode.window.showWarningMessage('No Global Note Files Found!');
        return;
    }
    for (const file of results) {
        const base = path.basename(file.fsPath);
        items.push(base);
    }
    const result = await vscode.window.showQuickPick(items, options);

    // ========================================================================== //
    //      notesGlobalPreview - Open Global Note File or Return if Cancelled
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const document = vscode.Uri.file(path.join(globalNotesFolder,'/') + result);
    await vscode.commands.executeCommand('markdown.showPreview', document);
}


// ========================================================================== //
//                 ---=== [Function deactivate] ===---
//         (This Method is Called When Extension is Deactivated)
// ========================================================================== //
function deactivate() {}


// ========================================================================== //
//                       ---=== [Export modules] ===---
// ========================================================================== //
module.exports = {
    activate,
    deactivate
}