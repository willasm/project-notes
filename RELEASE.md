# Release Notes

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->

# Important Notes for Version 1.5.0 Update
The default location for Local Notes has been changed from `.vscode` to `.pnotes` as requested by this extensions users. The new default folder name can be changed with the command `Project Notes: Set Local Notes Folder Name`. If you have existing notes stored in your `.vscode` folder, just drag them into the new `.pnotes` folder to have them show up in the project notes list.

The default location for Global Notes has been moved from this extensions global storage location to the folder `.pnotes` in the users home folder. This only applies to new users. Existing (and new) users can always use the command `Project Notes: Set Global Notes Folder Location` to set the location to any desired location. If you would like to move your existing notes from this extensions Global Storage folder to a new location, the global storage folder is typically found at `~\.vscode\data\user-data\User\globalStorage\willasm.project-notes`.

## [1.5.0] 2022-08-15
### Added
- New command `Project Notes: Set Local Notes Folder Location`
- File System Watcher for Local Notes
- File System Watcher for Global Notes
### Changed
- Global Project Notes moved from `extensions global storage` to `.pnotes` folder in users home folder
- Local Project Notes moved from `.vscode` to `.pnotes` folder
### Removed
- Removed `UPGRADING.md` as it only applied to a much earlier version


For a full list of changes, please see the projects [Changelog](CHANGELOG.md) file.

I hope you enjoy using the Extension, and if you find any bugs, or would like to see a certain feature added, please feel free to contact me.

Enjoy! William
