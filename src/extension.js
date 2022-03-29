const vscode = require('vscode');
const path = require("path");
const fs = require("fs");
const os = require("os");
const { readFile } = require('fs/promises');

let myContext;
const settings = vscode.workspace.getConfiguration("project-notes");
const globalNotesFolder = settings.get("globalNotesFolder");
const defaultTagSettingsFile = './defaultTagSettings.json';
const defaultTagSettings = require(defaultTagSettingsFile);
let timeout;
let tagSettingsPath;
let tagSettingsFile;
let currentFileExt;
let commentsRegEx;

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function Activate ●                             │
//  │                                                                              │
//  │                          • Update Our Decorations •                          │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function activate(context) {

    // Activate - Initialize Extension 
    myContext = context;                                    // Save Context
    // Get Tag Settings Data
    tagSettingsPath = context.globalStorageUri.fsPath;      // Get Global Storage Path
    tagSettingsFile = tagSettingsPath + '\\' + 'project-notes-tag-settings.json'; // Tag settings js file
    await initTagSettingsFilePath();                        // Initialize Tag settings file
    tagFileData = await readFile(tagSettingsFile, 'utf-8'); // Read file into memory
    const tagFileJsonData = JSON.parse(tagFileData);        // Parse the tag settings json file

    //---- Set gutter icon, but it overwrites breakpoints so I'm leaving it out
    // tagFileJsonData.tagsArray.forEach(element => {
    //     element.decoratorOptions.gutterIconSize = "contain";
    //     element.decoratorOptions.gutterIconPath = "C:\\programming\\code\\my_code\\vscode\\project-notes\\images\\gutterIcon.png";
    // });

    getExtension();                                         // Get the extension for current file

    // Activate - Register Extension Commands 
    vscode.commands.registerCommand('project-notes.openorcreatenote', openOrCreateNote);
    vscode.commands.registerCommand('project-notes.notesedit', notesEdit);
    vscode.commands.registerCommand('project-notes.notespreview', notesPreview);
    vscode.commands.registerCommand('project-notes.setnotesglobalfolder', setNotesGlobalFolder);
    vscode.commands.registerCommand('project-notes.openorcreateglobalnote', openOrCreateGlobalNote);
    vscode.commands.registerCommand('project-notes.notesglobaledit', notesGlobalEdit);
    vscode.commands.registerCommand('project-notes.notesglobalpreview', notesGlobalPreview);
    vscode.commands.registerCommand('project-notes.edit-settings-file', editTagSettingsFile);
    vscode.commands.registerCommand('project-notes.restore-settings-file', restoreTagSettingsFile);
    vscode.commands.registerCommand('project-notes.init-settings-file', initTagSettingsFilePath);

    // Activate - Push Subscriptions 
    context.subscriptions.push(openOrCreateNote);
    context.subscriptions.push(notesEdit);
    context.subscriptions.push(notesPreview);
    context.subscriptions.push(setNotesGlobalFolder);
    context.subscriptions.push(openOrCreateGlobalNote);
    context.subscriptions.push(notesGlobalEdit);
    context.subscriptions.push(notesGlobalPreview);
    context.subscriptions.push(editTagSettingsFile);
    context.subscriptions.push(restoreTagSettingsFile);
    context.subscriptions.push(initTagSettingsFilePath);

	let activeEditor = vscode.window.activeTextEditor;      // Get active editor

    // Activate - Set Decoration Types 
    let decorationTypes = [];
    // Tag Types Objects
    tagFileJsonData.tagsArray.forEach(element => {
        let decorationType = vscode.window.createTextEditorDecorationType(element.decoratorOptions);
        decorationTypes.push(decorationType);
    });
    // Tag Block Types Objects
    tagFileJsonData.tagBlocksArray.forEach(element => {
        let decorationType = vscode.window.createTextEditorDecorationType(element.decoratorOptions);
        decorationTypes.push(decorationType);
    });
    // Special Tag Types Objects
    tagFileJsonData.specialTagsArray.forEach(element => {
        let decorationType = vscode.window.createTextEditorDecorationType(element.decoratorOptions);
        decorationTypes.push(decorationType);
    });


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function updateDecorations ●                        │
//  │                                                                              │
//  │                          • Update Our Decorations •                          │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function updateDecorations() {
	if (!activeEditor) {                    // If no active editor then return
		return;
	}
    
    // updateDecorations - If no file extension found then return 
    if (currentFileExt === "") {
        return;
    }

    // updateDecorations - Clear previous comment Regex definition 
    commentsRegEx = "";

    // updateDecorations - Get comment symbols and set comments RegEx 
    let i = 0;
    tagFileJsonData.extensions.forEach(e => {
        let arr = tagFileJsonData.extensions[i].ext;
        const extMatch = arr.some((e) => {
            return e === currentFileExt;
        })
        if (extMatch) {                        // If extension supported then set comment's RegEx
            commentString = tagFileJsonData.extensions[i].commentsRegEx;
            commentsRegEx = new RegExp(commentString,'gmi')
        }
        i ++;
    })
    if (commentsRegEx === "") {
        return;
    }

    // updateDecorations - Search for tag matches 
    let commentMatch;
    let keywordMatch;
    const text = activeEditor.document.getText();                   // Load active document into text buffer

    // Tags Decorations
    let decorationOptionsArray = [];
    tagFileJsonData.tagsArray.forEach(element => {
        let decorationOptions = vscode.DecorationOptions = [];
        decorationOptionsArray.push(decorationOptions);
    });
    // Tag Block Decorations
    tagFileJsonData.tagBlocksArray.forEach(element => {
        let decorationOptions = vscode.DecorationOptions = [];
        decorationOptionsArray.push(decorationOptions);
    });
    // Special Tags Decorations
    tagFileJsonData.specialTagsArray.forEach(element => {
        let decorationOptions = vscode.DecorationOptions = [];
        decorationOptionsArray.push(decorationOptions);
    });

    // updateDecorations - Pre-defined Tags 
    let index = 0;
    tagFileJsonData.tagsArray.forEach(element => {
        let keyword = element.keyword
        let keywordRegex = new RegExp('\\b'+keyword+'\\b:?', 'gi');
        while (commentMatch = commentsRegEx.exec(text)) {
            while (keywordMatch = keywordRegex.exec(commentMatch[0])) {
                let startPosition = commentMatch.index + keywordMatch.index;
                let endPosition = startPosition + keywordMatch[0].length;
                for (let hoverTextIndex = 1; hoverTextIndex < 5; hoverTextIndex++) {
                    hoverText = commentMatch[0];                        // Default to entire comment in case no match found
                    if (commentMatch[hoverTextIndex] != undefined) {
                        hoverText = commentMatch[hoverTextIndex];
                        break;
                    }
                };
                let rangeStart = activeEditor.document.positionAt(startPosition);
                let rangeEnd = activeEditor.document.positionAt(endPosition);
                const decoration = { range: new vscode.Range(rangeStart, rangeEnd), hoverMessage: hoverText };
                decorationOptionsArray[index].push(decoration);
            }
        }
        if (element.isEnabled) {
            activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
        }
        index ++;
    })

    // updateDecorations - Tag Blocks - Main Title 
    tagFileJsonData.tagBlocksArray.forEach(element => {
        let regExStart = element.startText;
        let regExStartFixed = regExStart.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        let regExEnd = element.endText;
        let regExEndFixed = regExEnd.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        let tagBlockRegEx = new RegExp(regExStartFixed+'([^\r\n]+?)'+regExEndFixed,'gi');
        while (commentMatch = commentsRegEx.exec(text)) {
            while (specialMatch = tagBlockRegEx.exec(commentMatch[0])) {
                let startPosition = commentMatch.index + specialMatch.index;
                let endPosition = startPosition + specialMatch[0].length;
                let hoverText = '--== '+specialMatch[0]+' ==--';
                let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
                let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
                const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
                decorationOptionsArray[index].push(decoration);
            }
        }
        if (element.isEnabled) {
            activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
        }
        index ++;
    })

    // updateDecorations - Special Tags - File Link 
    let specialTagIndex = 0;
    let filelinkRegEx = /project file:\s*([\w\s\d!@()\-+]+.md)/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = filelinkRegEx.exec(commentMatch[0])) {
            let fileNameRegEx = new RegExp(specialMatch[1],'gi');
            let fileNameIndex = fileNameRegEx.exec(commentMatch[0]).index;
            let startPosition = commentMatch.index + fileNameIndex;
            let endPosition = startPosition + specialMatch[1].length;
            let hoverText = '--== '+specialMatch[1]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Global File Link 
    let globalFilelinkRegEx = /global file:\s*([\w\s\d!@()\-+]+.md)/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = globalFilelinkRegEx.exec(commentMatch[0])) {
            let GlobalfileNameRegEx = new RegExp(specialMatch[1],'gi');
            let GlobalfileNameIndex = GlobalfileNameRegEx.exec(commentMatch[0]).index;
            let startPosition = commentMatch.index + GlobalfileNameIndex;
            let endPosition = startPosition + specialMatch[1].length;
            let hoverText = '--== '+specialMatch[1]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Parentheses 
    let parenthesesRegEx = /(\(.+\))/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = parenthesesRegEx.exec(commentMatch[0])) {
            let startPosition = commentMatch.index + specialMatch.index;
            let endPosition = startPosition + specialMatch[0].length;
            let hoverText = '--== '+specialMatch[0]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Curly Braces 
    let curlyRegEx = /(\{.+\})/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = curlyRegEx.exec(commentMatch[0])) {
            let startPosition = commentMatch.index + specialMatch.index;
            let endPosition = startPosition + specialMatch[0].length;
            let hoverText = '--== '+specialMatch[0]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Brackets 
    let bracketRegEx = /(\[(.+)\])/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = bracketRegEx.exec(commentMatch[0])) {
            let startPosition = commentMatch.index + specialMatch.index;
            let endPosition = startPosition + specialMatch[0].length;
            let hoverText = '--== '+specialMatch[0]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Backticks 
    let backtickRegEx = /(`.*?`)/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = backtickRegEx.exec(commentMatch[0])) {
            let startPosition = commentMatch.index + specialMatch.index;
            let endPosition = startPosition + specialMatch[0].length;
            let hoverText = '--== '+specialMatch[0]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Double Quotes 
    let doubleQuotesRegEx = /(\".*?\")/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = doubleQuotesRegEx.exec(commentMatch[0])) {
            let startPosition = commentMatch.index + specialMatch.index;
            let endPosition = startPosition + specialMatch[0].length;
            let hoverText = '--== '+specialMatch[0]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

    // updateDecorations - Special Tags - Single Quotes 
    let singleQuotesRegEx = /('.*')/gi;
    while (commentMatch = commentsRegEx.exec(text)) {
        while (specialMatch = singleQuotesRegEx.exec(commentMatch[0])) {
            let startPosition = commentMatch.index + specialMatch.index;
            let endPosition = startPosition + specialMatch[0].length;
            let hoverText = '--== '+specialMatch[0]+' ==--';
            let rangeSpecialStart = activeEditor.document.positionAt(startPosition);
            let rangeSpecialEnd = activeEditor.document.positionAt(endPosition);
            const decoration = { range: new vscode.Range(rangeSpecialStart, rangeSpecialEnd), hoverMessage: hoverText };
            decorationOptionsArray[index].push(decoration);
        }
    }
    if (tagFileJsonData.specialTagsArray[specialTagIndex].isEnabled) {
        activeEditor.setDecorations(decorationTypes[index], decorationOptionsArray[index]);
    }
    index ++;
    specialTagIndex ++;

};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                    ● Function triggerUpdateDecorations ●                     │
//  │                                                                              │
//  │                    • Timer for Updating Our Decoraions •                     │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function triggerUpdateDecorations(throttle = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateDecorations, 500);
		} else {
			updateDecorations();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

    vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
            getExtension();
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);

    vscode.workspace.onDidSaveTextDocument((TextDocument) => {
        if (activeEditor && TextDocument.fileName === tagSettingsFile) {
            promptUserForRestart();
        };
    }, null, context.subscriptions);

};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                      ● Function promptUserForRestart ●                       │
//  │                                                                              │
//  │            • Prompt user for restart after settings file saved •             │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function promptUserForRestart() {

    const action = 'Reload';
    await vscode.window.showInformationMessage(
            `Reload window required in order for changes in settings file to take effect.`, 'Cancel', action
        )
        .then(selectedAction => {
        if (selectedAction === action) {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                          ● Function getExtension ●                           │
//  │                                                                              │
//  │      • Set Single and Multi-line Comment Identifiers fot Current File •      │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function getExtension() {
    var a = vscode.window.activeTextEditor.document.fileName.split(".");
    if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
        currentFileExt = "";
    } else {
    currentFileExt = a.pop().toLowerCase();
    };

};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Function editTagSettingsFile ●                       │
//  │                                                                              │
//  │                          • Edit Tag Settings File •                          │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function editTagSettingsFile() {
    initTagSettingsFilePath();
    var document = await vscode.workspace.openTextDocument(tagSettingsFile);    // Open it for editing
    await vscode.window.showTextDocument(document);
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                     ● Function restoreTagSettingsFile ●                      │
//  │                                                                              │
//  │              • Restore Tag Settings File to Default Settings •               │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function restoreTagSettingsFile() {
    fs.rmSync(tagSettingsFile);
    initTagSettingsFilePath();
    var document = await vscode.workspace.openTextDocument(tagSettingsFile);    // Open it for editing
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                     ● Function initTagSettingsFilePath ●                     │
//  │                                                                              │
//  │                  • Initialize Tag Settings File and Path •                   │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function initTagSettingsFilePath() {

    // If folder does exist then verifiy extensions files exist
    if (fs.existsSync(tagSettingsPath)) {
        if (!fs.existsSync(tagSettingsFile)) {
            // Write new settings file if it does not exist
            fs.writeFileSync(tagSettingsFile, JSON.stringify(defaultTagSettings, null, 2));
        }
        return;
    }
    fs.mkdirSync(tagSettingsPath, { recursive: true });
    fs.writeFileSync(tagSettingsFile, JSON.stringify(defaultTagSettings, null, 2));
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function openOrCreateNote ●                         │
//  │                                                                              │
//  │                 • Open Existing Project Note in Edit Mode •                  │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function openOrCreateNote() {

    // openOrCreateNote - Verify Text Editor Open + Workspace Folder Exists 
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

    // openOrCreateNote - Get current lines text 
    const lineText = editor.document.lineAt(editor.selection.active.line).text;
    const fileregex = new RegExp(/project file: *([A-Za-z0-9_-]+)/i);
    var found = fileregex.test(lineText);

    // openOrCreateNote - Get Filename from comment 
    if (found) {
        const filenameArray = fileregex.exec(lineText);
        var filename = filenameArray[1] + '.MD';
        // ========================================================================== //
        //      openOrCreateNote - Get current workspace folder for Filename
    } else {
        let filepath = vscode.workspace.workspaceFolders[0].uri.path;
        var filename = new String(filepath).substring(filepath.lastIndexOf('/') + 1) + '.MD';
    }

    // openOrCreateNote - Open Filename.MD 
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
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function notesEdit ●                            │
//  │                                                                              │
//  │                 • Open Existing Project Note in Edit Mode •                  │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function notesEdit() {

    // notesEdit - Verify Workspace Folder Exists 
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // notesEdit - Initialize Quick Pick 
    let items = [];
    let options = {
        placeHolder: "Select Project Note to Edit",
        title: "---=== Project Notes - View Note in Edit Mode ===---"
    };

    // notesEdit - Search for Project Notes and Show Quick Pick 
    let inputAsWorkspaceRelativeFolder = '.vscode';
    let glob = '**/' + inputAsWorkspaceRelativeFolder + '/*.{MD,md,Md,mD}';
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

    // notesEdit - Open Project Note File or Return if Cancelled 
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const notesFilePath = path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + result;
    const document = await vscode.workspace.openTextDocument(notesFilePath);
    vscode.window.showTextDocument(document, { preview: false });
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                          ● Function notesPreview ●                           │
//  │                                                                              │
//  │               • Open Existing Project Note in Preview Mode •                 │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function notesPreview() {

    // notesPreview - Verify Workspace Folder Exists 
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Workspace Folder Not Available!');
        return;
    }

    // notesPreview - Initialize Quick Pick 
    let items = [];
    let options = {
        placeHolder: "Select Project Note to Preview",
        title: "---=== Project Notes - View Note in Preview Mode ===---"
    };

    // notesPreview - Search for Project Notes and Show Quick Pick 
    let inputAsWorkspaceRelativeFolder = '.vscode';
    let glob = '**/' + inputAsWorkspaceRelativeFolder + '/*.{MD,md,Md,mD}';
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

    // notesPreview - Open Project Note File or Return if Cancelled 
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const document = vscode.Uri.file(path.join(workspaceFolders[0].uri.fsPath, './.vscode/') + result);
    await vscode.commands.executeCommand('markdown.showPreview', document);
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                      ● Function setNotesGlobalFolder ●                       │
//  │                                                                              │
//  │                     • Set Global Notes Folder Location •                     │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function setNotesGlobalFolder() {

    // setNotesGlobalFolder - Get Global Notes Folder From User 
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
        //console.log(globalNotesFolder);
        let settings = vscode.workspace.getConfiguration("project-notes");
        settings.update("globalNotesFolder",globalNotesFolder,1);
    }
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                     ● Function openOrCreateGlobalNote ●                      │
//  │                                                                              │
//  │                          • Create New Global Note •                          │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function openOrCreateGlobalNote() {

    // openOrCreateGlobalNote - Verify Text Editor Open + Global Notes Folder Exists 
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('Text Editor Not Open!');
        return;
    }
    if (globalNotesFolder.length == 0) {
        vscode.window.showWarningMessage('Global Folder Location has not been defined yet.');
        return;

    }

    // openOrCreateGlobalNote - Get current lines text 
    const lineText = editor.document.lineAt(editor.selection.active.line).text;
    const globalfileregex = new RegExp(/global file: *([A-Za-z0-9_-]+)/i);
    var found = globalfileregex.test(lineText);
    let fileName;
    let filePath;

    // openOrCreateGlobalNote - Get Filename from comment 
    if (found) {
        const filenameArray = globalfileregex.exec(lineText);
        fileName = filenameArray[1] + '.MD';
        filePath = globalNotesFolder+'\\'+fileName;
    
    // openOrCreateGlobalNote - Prompt for Filename from User 
    } else {
        fileName = await vscode.window.showInputBox({
        placeHolder: "Global Note Name to Open or Create",
        prompt: "Open or Create New Global Note: "
        });
        let parts = fileName.split(".");
        fileName = parts[0]+'.MD';
        filePath = globalNotesFolder+'\\'+fileName;
    }

    // openOrCreateGlobalNote - Open Filename.MD 
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
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                         ● Function notesGlobalEdit ●                         │
//  │                                                                              │
//  │                  • Open Existing Global Note in Edit Mode •                  │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function notesGlobalEdit() {

    // notesGlobalEdit - Inform User if Global Folder has not been Defined 
    if (globalNotesFolder.length == 0) {
        vscode.window.showWarningMessage('Global Folder Location has not been defined yet.');
        return;
    }
    let items = [];
    let options = {
        placeHolder: "Select Global Note to Preview",
        title: "---=== Project Notes - View Global Note in Preview Mode ===---"
    };

    // notesGlobalEdit - Search for Global Notes and Show Quick Pick 
    results = await vscode.workspace.findFiles(new vscode.RelativePattern(globalNotesFolder, '*.{md,MD,mD,Md}'));
    if (results.length == 0) { // If Zero Note Files Found, Inform User and Return
        vscode.window.showWarningMessage('No Global Note Files Found!');
        return;
    }
    for (const file of results) {
        const base = path.basename(file.fsPath);
        items.push(base);
    }
    const result = await vscode.window.showQuickPick(items, options);

    // notesGlobalEdit - Open Global Note File or Return if Cancelled 
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const notesFilePath = path.join(globalNotesFolder, '\\') + result;
    document = vscode.workspace.openTextDocument(notesFilePath);
    await vscode.window.showTextDocument(document);
};

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Function notesGlobalPreview ●                        │
//  │                                                                              │
//  │                 • Open Existing Global Note in Preview Mode •                │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
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

    // notesGlobalPreview - Search for Global Notes and Show Quick Pick 
    results = await vscode.workspace.findFiles(new vscode.RelativePattern(globalNotesFolder, '*.{md,MD,mD,Md}'));
    if (results.length == 0) { // If Zero Note Files Found, Inform User and Return
        vscode.window.showWarningMessage('No Global Note Files Found!');
        return;
    }
    for (const file of results) {
        const base = path.basename(file.fsPath);
        items.push(base);
    }
    const result = await vscode.window.showQuickPick(items, options);

    // notesGlobalPreview - Open Global Note File or Return if Cancelled 
    if (result == undefined) {
        // If Result = `undefined`, No File was Picked so Return
        return;
    }
    const document = vscode.Uri.file(path.join(globalNotesFolder,'/') + result);
    await vscode.commands.executeCommand('markdown.showPreview', document);
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                           ● Function deactivate ●                            │
//  │                                                                              │
//  │           • This Method is Called When Extension is Deactivated •            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function deactivate() {};

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                              ● Export modules ●                              │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
module.exports = {
    activate,
    deactivate
};