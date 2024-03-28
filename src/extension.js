const vscode = require('vscode');
const path = require("path");
const fs = require("fs");
const os = require("os");
const { env } = require("process");
const { readFile } = require('fs/promises');
const ProjectProvider = require("./projectDataProvider.js");
const GlobalProvider = require("./globalDataProvider.js");

let defaultTagSettingsFile = './defaultTagSettings.json';
let defaultTagSettings = require(defaultTagSettingsFile);
let myContext;
let timeout;
let tagSettingsPath;
let tagSettingsFile;
let currentFileExt;
let commentsRegEx;
let settings = vscode.workspace.getConfiguration("project-notes");
let globalNotesFolder = settings.get("globalNotesFolder");
let localNotesFolder = settings.get("localNotesFolder");
let localNotesPath = vscode.workspace.workspaceFolders[0].uri.fsPath+path.sep+localNotesFolder;
//let newProjectNote = vscode.workspace.workspaceFolders[0].uri.fsPath+path.sep+localNotesFolder+path.sep+fileName;

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function Activate ●                             │
//  │                                                                              │
//  │                          • Update Our Decorations •                          │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function activate(context) {

    // Activate - Initialize Extension 
    myContext = context;                                    // Save Context for global access
    // Get Tag Settings Data
    tagSettingsPath = context.globalStorageUri.fsPath;      // Get Global Storage Path
    tagSettingsFile = tagSettingsPath + path.sep + 'project-notes-tag-settings.json'; // Tag settings json file
    await initTagSettingsFilePath();                        // Initialize Tag settings file and path
    tagFileData = await readFile(tagSettingsFile, 'utf-8'); // Read file into memory
    const tagFileJsonData = JSON.parse(tagFileData);        // Parse the tag settings json file
    if (globalNotesFolder.length == 0) {                    // Set default global notes location to global storage
        let globalNotesFolderUri = vscode.Uri.file(path.join(os.homedir(), path.sep, '.pnotes'));
        globalNotesFolder = globalNotesFolderUri.fsPath;
        let settings = vscode.workspace.getConfiguration("project-notes");
        settings.update("globalNotesFolder",globalNotesFolder, 1);
    };
    // Activate - Create global notes folder and Quick Tips.md if needed  
    if (!fs.existsSync(globalNotesFolder)) {
        fs.mkdirSync(globalNotesFolder, { recursive: true });
    };
    // Activate - Create local notes folder if needed  
    if (!fs.existsSync(localNotesPath)) {
        fs.mkdirSync(localNotesPath, { recursive: true });
    };

    //---- Set gutter icon, but it overwrites breakpoints so I'm leaving it out
    // tagFileJsonData.tagsArray.forEach(element => {
    //     element.decoratorOptions.gutterIconSize = "contain";
    //     element.decoratorOptions.gutterIconPath = "C:\\programming\\code\\my_code\\vscode\\project-notes\\images\\gutterIcon.png";
    // });

    // Activate - Register Project Notes Treeview Data Provider 
    const ProjectOutlineProvider = new ProjectProvider(context);
    vscode.window.registerTreeDataProvider('projectNotesTreeview', ProjectOutlineProvider);
  
    // Activate - Register Global Notes Treeview Data Provider 
    const GlobalOutlineProvider = new GlobalProvider(context, globalNotesFolder);
    vscode.window.registerTreeDataProvider('globalNotesTreeview', GlobalOutlineProvider);

    // Activate - Create Global Notes folder file watcher 
    const globalWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(globalNotesFolder), '*.{md,MD,Md,mD}'));
    globalWatcher.onDidCreate(uri => GlobalOutlineProvider.refresh()); // Listen to files/folders being created
    globalWatcher.onDidDelete(uri => GlobalOutlineProvider.refresh()); // Listen to files/folders getting deleted

    // Activate - Create Local Notes folder file watcher 
    const localWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(localNotesPath), '*.{md,MD,Md,mD}'));
    localWatcher.onDidCreate(uri => ProjectOutlineProvider.refresh()); // Listen to files/folders being created
    localWatcher.onDidDelete(uri => ProjectOutlineProvider.refresh()); // Listen to files/folders getting deleted

    // Activate - Get the extension for current file 
    getExtension();

    // Activate - Register Extension Commands 
    vscode.commands.registerCommand('project-notes.newProjectNote', newProjectNote);
    vscode.commands.registerCommand('project-notes.previewProjectNote', previewProjectNote);
    vscode.commands.registerCommand('project-notes.renameProjectNote', renameProjectNote);
    vscode.commands.registerCommand('project-notes.deleteProjectNote', deleteProjectNote);
    vscode.commands.registerCommand('project-notes.newGlobalNote', newGlobalNote);
    vscode.commands.registerCommand('project-notes.previewGlobalNote', previewGlobalNote);
    vscode.commands.registerCommand('project-notes.renameGlobalNote', renameGlobalNote);
    vscode.commands.registerCommand('project-notes.deleteGlobalNote', deleteGlobalNote);
    vscode.commands.registerCommand('project-notes.openNoteLink', openNoteLink);
    vscode.commands.registerCommand('project-notes.setNotesGlobalFolder', setNotesGlobalFolder);
    vscode.commands.registerCommand('project-notes.setNotesLocalFolder', setNotesLocalFolder);
    vscode.commands.registerCommand('project-notes.edit-settings-file', editTagSettingsFile);
    vscode.commands.registerCommand('project-notes.restore-settings-file', restoreTagSettingsFile);
    vscode.commands.registerCommand('project-notes.init-settings-file', initTagSettingsFilePath);


    // Activate - Push Subscriptions 
    context.subscriptions.push(newProjectNote);
    context.subscriptions.push(previewProjectNote);
    context.subscriptions.push(renameProjectNote);
    context.subscriptions.push(deleteProjectNote);
    context.subscriptions.push(newGlobalNote);
    context.subscriptions.push(previewGlobalNote);
    context.subscriptions.push(renameGlobalNote);
    context.subscriptions.push(deleteGlobalNote);
    context.subscriptions.push(setNotesGlobalFolder);
    context.subscriptions.push(setNotesLocalFolder);
    context.subscriptions.push(editTagSettingsFile);
    context.subscriptions.push(restoreTagSettingsFile);
    context.subscriptions.push(initTagSettingsFilePath);
    context.subscriptions.push(globalWatcher);
    context.subscriptions.push(localWatcher);

    // Activate - Get active editor 
	let activeEditor = vscode.window.activeTextEditor;

    // Activate - Set Decoration Types 
    let decorationTypes = [];
    // Activate - Tag Types Objects 
    tagFileJsonData.tagsArray.forEach(element => {
        let decorationType = vscode.window.createTextEditorDecorationType(element.decoratorOptions);
        decorationTypes.push(decorationType);
    });
    // Activate - Tag Block Types Objects 
    tagFileJsonData.tagBlocksArray.forEach(element => {
        let decorationType = vscode.window.createTextEditorDecorationType(element.decoratorOptions);
        decorationTypes.push(decorationType);
    });
    // Activate - Special Tag Types Objects 
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
    // updateDecorations - If no active editor then return 
	if (!activeEditor) {
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
        // updateDecorations - If extension supported then set comment's RegEx 
        if (extMatch) {
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
    // updateDecorations - Ignore comments in strings 
    let commentInString = /^[^'"\r\n]+(['"])[^'"]+[\r\n]/gmi
    // updateDecorations - Load active document into text buffer 
    const text = activeEditor.document.getText();

    // updateDecorations - Tags Decorations 
    let decorationOptionsArray = [];
    tagFileJsonData.tagsArray.forEach(element => {
        let decorationOptions = vscode.DecorationOptions = [];
        decorationOptionsArray.push(decorationOptions);
    });
    // updateDecorations - Tag Block Decorations 
    tagFileJsonData.tagBlocksArray.forEach(element => {
        let decorationOptions = vscode.DecorationOptions = [];
        decorationOptionsArray.push(decorationOptions);
    });
    // updateDecorations - Special Tags Decorations 
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
            // Skip comments in strings 
            let inString = commentInString.exec(commentMatch);
            if (inString !== null) {
                commentsRegEx.lastIndex = commentMatch.index + 3
                continue;
            }
                while (keywordMatch = keywordRegex.exec(commentMatch[0])) {
                    let startPosition = commentMatch.index + keywordMatch.index;
                    let endPosition = startPosition + keywordMatch[0].length;
                    for (let hoverTextIndex = 1; hoverTextIndex < 5; hoverTextIndex++) {
                        // Default to entire comment in case no match found 
                        hoverText = commentMatch[0];
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
            // Skip comments in strings 
            let inString = commentInString.exec(commentMatch);
            if (inString !== null) {
                commentsRegEx.lastIndex = commentMatch.index + 3
                continue;
            }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
        if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
        if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
        if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
        if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
        if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
       if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
       if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
        // Skip comments in strings 
        let inString = commentInString.exec(commentMatch);
       if (inString !== null) {
            commentsRegEx.lastIndex = commentMatch.index + 3
            continue;
        }
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
//  │                         ● Function newProjectNote ●                          │
//  │                                                                              │
//  │                         • Create New Project Note •                          │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function newProjectNote() {

    // newProjectNote - Prompt user for new notes name 
    let fileName = await vscode.window.showInputBox({
      placeHolder: "Enter new project note name (Extension .md is not required)",
      prompt: "Create New Project Note: "
    });
    // newProjectNote - Return if no note name entered or user pressed escape 
    if (fileName === undefined || fileName === "") {
      return;
    }

    // newProjectNote - Get full path to new local note 
    let parts = fileName.split(".");
    fileName = parts[0]+'.md';
    let newProjectNote = vscode.workspace.workspaceFolders[0].uri.fsPath+path.sep+localNotesFolder+path.sep+fileName;
  
    // newProjectNote - Create local notes folder if needed 
    let newProjectNotePath = vscode.workspace.workspaceFolders[0].uri.fsPath+path.sep+localNotesFolder;
    if (!fs.existsSync(newProjectNotePath)) {
        fs.mkdirSync(newProjectNotePath, { recursive: true });
    };

    // newProjectNote - Create New Project Note and Open for Editing  
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.createFile(vscode.Uri.file(newProjectNote), { overwrite: false, ignoreIfExists: true });
    await vscode.workspace.applyEdit(workspaceEdit);
    const document = await vscode.workspace.openTextDocument(newProjectNote);
    vscode.window.showTextDocument(document, { preview: true });

};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Function previewProjectNote ●                        │
//  │                                                                              │
//  │                    • Open Project Note in Preview Mode •                     │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function previewProjectNote() {
  
    const pathToNote = vscode.Uri.file(arguments[0].fsPath);
    await vscode.commands.executeCommand('markdown.showPreview', pathToNote);

};
  

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function renameProjectNote ●                        │
//  │                                                                              │
//  │                           • Rename Project Note •                            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function renameProjectNote() {
  
    // renameProjectNote - Prompt user for new name 
    let fileName = await vscode.window.showInputBox({
        placeHolder: "Enter new project note name (Extension .md is not required)",
        prompt: "Rename Project Note: ",
        value: path.basename(arguments[0].fsPath)
    });
    if (fileName === undefined) {
        return;
    }
    let parts = fileName.split(".");
    fileName = parts[0]+'.md';
    let newProjectNote = vscode.workspace.workspaceFolders[0].uri.fsPath+path.sep+localNotesFolder+path.sep+fileName;
    
    // renameProjectNote - Perform Rename 
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.renameFile(vscode.Uri.file(arguments[0].fsPath),vscode.Uri.file(newProjectNote), {overwrite: false, ignoreIfExists: true});
    await vscode.workspace.applyEdit(workspaceEdit);

};
  

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function deleteProjectNote ●                        │
//  │                                                                              │
//  │                           • Delete Project Note •                            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function deleteProjectNote() {
  
    // deleteProjectNote - Prompt user for confirmation 
    let fName = arguments[0].label;
    const selectedItem = await vscode.window.showWarningMessage('Delete Project Note? '+fName,'Continue','Cancel');
    if ('Continue' !== selectedItem) {
      return;
    }
    
    // deleteProjectNote - Delete the Project Note 
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.deleteFile(vscode.Uri.file(arguments[0].fsPath));
    await vscode.workspace.applyEdit(workspaceEdit);

};
  

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                          ● Function newGlobalNote ●                          │
//  │                                                                              │
//  │                    • Open Project Note in Preview Mode •                     │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function newGlobalNote() {
  
    // newGlobalNote - Prompt user for new notes name 
    let fileName = await vscode.window.showInputBox({
      placeHolder: "Enter new global note name (Extension .md is not required)",
      prompt: "Create New Global Note: "
    });
    // newGlobalNote - Return if no note name entered or user pressed escape 
    if (fileName === undefined || fileName === "") {
      return;
    }
    let parts = fileName.split(".");
    fileName = parts[0]+'.md';
    let newGlobalNote = globalNotesFolder + path.sep + fileName;
  
    // newGlobalNote - Create New Global Note and Open for Editing  
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.createFile(vscode.Uri.file(newGlobalNote), { overwrite: false, ignoreIfExists: true });
    await vscode.workspace.applyEdit(workspaceEdit);
    const document = await vscode.workspace.openTextDocument(newGlobalNote);
    vscode.window.showTextDocument(document, { preview: true });

};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function previewGlobalNote ●                        │
//  │                                                                              │
//  │                     • Open Global Note in Preview Mode •                     │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function previewGlobalNote() {
  
    const pathToNote = vscode.Uri.file(arguments[0].fsPath);
    await vscode.commands.executeCommand('markdown.showPreview', pathToNote);
  
};
  

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function renameGlobalNote ●                         │
//  │                                                                              │
//  │                            • Rename Global Note •                            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function renameGlobalNote() {
  
    // renameGlobalNote - Prompt user for new name 
    let fileName = await vscode.window.showInputBox({
        placeHolder: "Enter new global note name (Extension .md is not required)",
        prompt: "Rename Global Note: ",
        value: path.basename(arguments[0].fsPath)
    });
    if (fileName === undefined) {
        return;
    }
    let parts = fileName.split(".");
    fileName = parts[0]+'.md';
    let newGlobalNote = globalNotesFolder+path.sep+fileName;
    
    // renameGlobalNote - Perform Rename 
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.renameFile(vscode.Uri.file(arguments[0].fsPath),vscode.Uri.file(newGlobalNote), {overwrite: false, ignoreIfExists: true});
    await vscode.workspace.applyEdit(workspaceEdit);
  
};
  

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                        ● Function deleteGlobalNote ●                         │
//  │                                                                              │
//  │                            • Delete Global Note •                            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function deleteGlobalNote() {
  
    // deleteGlobalNote - Prompt user for confirmation 
    let fName = arguments[0].label;
    const selectedItem = await vscode.window.showWarningMessage('Delete Global Note? '+fName,'Continue','Cancel');
    if ('Continue' !== selectedItem) {
      return;
    }
    
    // deleteGlobalNote - Delete the Global Note 
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.deleteFile(vscode.Uri.file(arguments[0].fsPath));
    await vscode.workspace.applyEdit(workspaceEdit);

};
  

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                      ● Function promptUserForRestart ●                       │
//  │                                                                              │
//  │            • Prompt user for restart after settings file saved •             │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function promptUserForRestart() {

    // TODO: There must be a more elegant way of doing this...
    const action = 'Reload';
    await vscode.window.showInformationMessage(
            `Reload window required in order for changes to take effect.`, 'Cancel', action
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
//  │                     • Get the Current Files Extension •                      │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function getExtension() {
	let activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
        currentFileExt = "";
		return;
	}
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
    // editTagSettingsFile - Open it for editing 
    var document = await vscode.workspace.openTextDocument(tagSettingsFile);
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
    // restoreTagSettingsFile - Open it for editing 
    var document = await vscode.workspace.openTextDocument(tagSettingsFile);
    await vscode.window.showTextDocument(document);
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                     ● Function initTagSettingsFilePath ●                     │
//  │                                                                              │
//  │                  • Initialize Tag Settings File and Path •                   │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function initTagSettingsFilePath() {

    // initTagSettingsFilePath - If folder does exist then verifiy extensions files exist 
    if (fs.existsSync(tagSettingsPath)) {
        if (!fs.existsSync(tagSettingsFile)) {
            // Write new settings file if it does not exist
            fs.writeFileSync(tagSettingsFile, JSON.stringify(defaultTagSettings, null, 2));
        }
        return;
    }
    // initTagSettingsFilePath - Otherwise create folder and Tag Settings File 
    fs.mkdirSync(tagSettingsPath, { recursive: true });
    fs.writeFileSync(tagSettingsFile, JSON.stringify(defaultTagSettings, null, 2));
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
        let settings = vscode.workspace.getConfiguration("project-notes");
        settings.update("globalNotesFolder",globalNotesFolder,1);
        promptUserForRestart();
    }
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                       ● Function setNotesLocalFolder ●                       │
//  │                                                                              │
//  │                      • Set Local Notes Folder Location •                     │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function setNotesLocalFolder() {

    // setNotesLocalFolder - Get Local Notes Folder From User 
    let options = {
        placeHolder: `Current local notes folder is ${localNotesFolder}`,
        prompt: "Enter new local notes folder name",
        title: "---=== Project Notes - Set Local Notes Folder Name ===---"
    };
    const newLocalFolder = await vscode.window.showInputBox(options);

    // setNotesLocalFolder - Check if User Cancelled 
    if (!newLocalFolder) {
        return;
    }

    // setNotesLocalFolder - Save New Local Notes Folder 
    let settings = vscode.workspace.getConfiguration("project-notes");
    settings.update("localNotesFolder",newLocalFolder,1);
    promptUserForRestart();

};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                          ● Function openNoteLink ●                           │
//  │                                                                              │
//  │                       • Open Project or Global Notes •                       │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function openNoteLink() {

    // openNoteLink - Verify Text Editor Open 
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('Text Editor Not Open!');
        return;
    }

    // openNoteLink - Get current lines text 
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const lineText = editor.document.lineAt(editor.selection.active.line).text;
    const projectRegex = new RegExp(/project file: *([A-Za-z0-9_-]+.md)/i);
    const globalRegex = new RegExp(/global file: *([A-Za-z0-9_-]+.md)/i);
    var foundProjectNote = projectRegex.test(lineText);
    var foundGlobalNote = globalRegex.test(lineText);
    let notesFilePath = "";

    // openNoteLink - Get Project Note Filename from comment 
    if (foundProjectNote) {
        let filenameArray = projectRegex.exec(lineText);
        let filename = filenameArray[1];
        notesFilePath = path.join(workspaceFolders[0].uri.fsPath, './'+localNotesFolder+'/')+filename;
    }

    // openNoteLink - Get Global Note Filename from comment 
    if (foundGlobalNote) {
        let filenameArray = globalRegex.exec(lineText);
        let filename = filenameArray[1];
        notesFilePath = globalNotesFolder+path.sep+filename;
    }

    // openNoteLink - Open Project Note -or- Global Note Filename.MD if either is found 
    if (notesFilePath.length == 0) {
        vscode.window.showWarningMessage('No Project or Global file link found on this line!');
        return;
    }

    // openNoteLink - Verfiy file exists, if it does then open it 
    if (fs.existsSync(notesFilePath)) {
        // File exists in path
        vscode.workspace.openTextDocument(vscode.Uri.file(notesFilePath)).then(
            document => vscode.window.showTextDocument(document));
            return;
    };

    // openNoteLink - If it does not exist, then create it 
    const workspaceEdit = new vscode.WorkspaceEdit();
    workspaceEdit.createFile(vscode.Uri.file(notesFilePath), { overwrite: false, ignoreIfExists: true });
    await vscode.workspace.applyEdit(workspaceEdit);
    const document = await vscode.workspace.openTextDocument(notesFilePath);
    vscode.window.showTextDocument(document, { preview: true });

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