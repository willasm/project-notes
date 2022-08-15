const vscode = require("vscode");
const path = require("path");

class GlobalNoteDataProvider {
  constructor(context, globalNotesFolder) {
    this.context = context;
    this.globalNotesFolder = globalNotesFolder;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    vscode.workspace.onDidCreateFiles(() => this.onCreateFiles());
    vscode.workspace.onDidDeleteFiles(() => this.onDeleteFiles());
    vscode.workspace.onDidRenameFiles(() => this.onRenameFiles());
    vscode.workspace.onDidChangeConfiguration(() => {
      this.globalNotesFolder = vscode.workspace.getConfiguration('project-notes').get('globalNotesFolder');
      this.refresh();
    });
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (element) {
      return element;
    } else {
      return this.convertFilesToTreeItems();
    }
  }
  
  refresh() {
    this._onDidChangeTreeData.fire(undefined);
    //console.log("Refreshed.....");
    
  }

  onCreateFiles() {
    console.log('Created File...');
    this.refresh();
  }

  onDeleteFiles() {
    console.log('Deleted File...');
    this.refresh();
  }

  onRenameFiles() {
    //console.log('Renamed File...');
    this.refresh();
  }

  async convertFilesToTreeItems() {
    let globalFilesList = [];
    this.files = globalFilesList;
    let results = await vscode.workspace.findFiles(new vscode.RelativePattern(this.globalNotesFolder, '*.{md,MD,mD,Md}'));
    for (const file of results) {
      const base = path.basename(file.fsPath);
      const fsPath = file.fsPath;
      const uri = file.path;
      globalFilesList.push({
        fileName: base,
        fsPath: fsPath,
        uri: uri
      });
    }
    globalFilesList.sort(compare);
    
    let array = [];
    this.files.forEach((element) => {
      array.push(
        new FileTreeItem(element, vscode.TreeItemCollapsibleState.None)
      );
    });
    return array;
  }
}


class FileTreeItem {
  // Must provide the property label for it to show up the tree view
  constructor(files, collapsibleState) {
    this.collapsibleState = collapsibleState;
    this.label = `${files.fileName}`;
    this.fsPath = `${files.fsPath}`;
    this.uri = `${files.uri}`;
    this.tooltip = `${files.fsPath}`;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [files.uri]
    };
  }
}

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const fileA = a.fileName.toUpperCase();
  const fileB = b.fileName.toUpperCase();
  let comparison = 0;
  if (fileA > fileB) {
    comparison = 1;
  } else if (fileA < fileB) {
    comparison = -1;
  }
  return comparison;
}

module.exports = GlobalNoteDataProvider;
