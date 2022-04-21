const vscode = require("vscode");
const path = require("path");

class ProjectNoteDataProvider {
  constructor(context) {
    this.context = context;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    vscode.workspace.onDidCreateFiles(() => this.onCreateFiles());
    vscode.workspace.onDidDeleteFiles(() => this.onDeleteFiles());
    vscode.workspace.onDidRenameFiles(() => this.onRenameFiles());
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
    //console.log('Created File...');
    this.refresh();
  }

  onDeleteFiles() {
    //console.log('Deleted File...');
    this.refresh();
  }

  onRenameFiles() {
    //console.log('Renamed File...');
    this.refresh();
  }

  async convertFilesToTreeItems() {
    let projectFilesList = [];
    this.files = projectFilesList;
    let results = await vscode.workspace.findFiles('**/.vscode/*.{md,MD,mD,Md}',null,500);
    //console.log(results);
    for (const file of results) {
      const base = path.basename(file.fsPath);
      const fsPath = file.fsPath;
      const uri = file.path;
      projectFilesList.push({
        fileName: base,
        fsPath: fsPath,
        uri: uri
      });
    }
    projectFilesList.sort(compare);

    let array = [];
    this.files.forEach((element) => {
      //console.log(element);
      array.push(
        new FileTreeItem(element, vscode.TreeItemCollapsibleState.None)
      );
    });
    //console.log('PDP - convertFilesToTreeItems: ',array);
    return array;
  }
}

class FileTreeItem {
  // we must provide the property label for it to show up the tree view

  constructor(files, collapsibleState) {
    //super(fsPath, vscode.TreeItemCollapsibleState.None);
    // this.files = files;
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
    //console.log('PDP - FileTreeItem');
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

module.exports = ProjectNoteDataProvider;
