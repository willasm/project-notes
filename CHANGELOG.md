# Change Log

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->

## [1.6.0] 2024-03-28
### Fixed
- Hard coded paths were causing the extension to fail on Linux and Mac systems

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

## [1.4.0] 2022-07-25
### Fixed
- Global notes folder was not updated correctly on location change
(Thank you to sanihaq for bringing this to my attention)

## [1.3.0] 2022-07-24
### Fixed
- Extension failed to load when vscode was opened without a file loaded
(Thank you to sanihaq for bringing this to my attention)

## [1.2.1] 2022-04-22
### Added
- Renaming notes input field is now pre-filled with the current name

## [1.2.0] 2022-04-21
### Added
- Both Project notes and Global notes are now available from activity bar outline views
- Command `Project Notes: Open Note File Link`
- Screenshot of new outline views
### Removed
- The following commands have been removed as they are now available from the activity bar outline views via their respective buttons
  - Command `Project Notes: Open or Create Project Note`
  - Command `Project Notes: Open Existing Project Note (Edit Mode)`
  - Command `Project Notes: Open Existing Project Note (Preview Mode)`
  - Command `Project Notes: Open or Create Global Note`
  - Command `Project Notes: Open Existing Global Note (Edit Mode)`
  - Command `Project Notes: Open Existing Global Note (Preview Mode)`
### Updated
- Readme.md

## [1.1.1] 2022-04-08
### Fixed
- Open or Create Global Note command cancellation not handled correctly

## [1.1.0] 2022-04-07
### Added
- Snippet `tagKeyword`
- Snippet `tagProjectNote`
- Snippet `tagGlobalNote`
- Snippet `commentHiddenTitle`
- Snippet `commentKeyword`
- Snippet `commentBoxSingleLine`
- Snippet `commentBoxDblLine`
- Screenshot of some of the new snippets
### Changed
- Snippet `tagmaintitle` renamed to camelCase `tagMainTitle`
- Snippet `tagsubtitle` renamed to camelCase `tagSubTitle`
- Snippet `taghiddentitle` renamed to camelCase `tagHiddenTitle`
- Snippet `tagunderline` renamed to camelCase `tagUnderline`
- Snippet `tagstrikethrough` renamed to camelCase `tagStrikethrough`
### Fixed
- Does not highlight comments in strings now
### Updated
- Readme.md

## [1.0.1] 2022-03-31
### Changed
- Pick lists are now alpha numerically sorted
### Fixed
- Global note edit string typo for pick list
### Updated
- Readme with suggestion for "editor.quickSuggestions.comments": true
- Readme with notification about Known Issues

## [1.0.0] 2022-03-30
### Added
- New command - `Project Notes: Edit Tags Settings File`
- New command - `Project Notes: Restore Tag Settings File`
- All tag settings are now stored in `project-notes-tag-settings.json`
- Added schema json file for settings file
- Light and Dark theme aware highlighting
- New `Tags` can be added to the [settings](SETTINGS.md) file
- All `Tags` can be enabled or disabled individually in the [settings](SETTINGS.md) file
- Highlighting of user definable `Tag Blocks`
- Snippets for the pre-defined tag blocks
- Added [settings](SETTINGS.md) documentation file
- Added [Upgrading from previous versions](UPGRADING.md) documentation file
- New screenshots to reflect the new changes
### Fixed
- Highlighting in multiline comments was not working properly
- Opening project note files not adding lowercase extension files to pick list
### Changed
- Now uses text decorations for highlighting
- File link trigger `File: filename.md` has been changed to `Project File: filename.md`
- File link trigger now requires the `.MD` extension to remove any confusion on notes file format
### Removed
- Dependency on TextMateRules for syntax highlighting

## [0.0.5] 2022-02-04
### Added
- New command - `Project Notes: Set Globals Notes Folder Location`
- New command - `Project Notes: Open or Create Global Note`
- New command - `Project Notes: Open Existing Global Note (Edit Mode)`
- New command - `Project Notes: Open Existing Global Note (Preview Mode)`
- Global Note files text Highlighting
### Fixed
- File link trigger `File:` is now case insensitive - it was only triggering on lowercase

## [0.0.4] 2022-02-03
### Added
- package.json Added `"configurationDefaults"` section to remove manual settings.json editing requirement
### Changed
- Renamed extension to Project Notes + TODO Highlighter to better reflect its functions
### Removed
- Requirement to add scopes to textMateRules in settings.json
    - This is now only reqired if you want to modify the colors and styling
### Updated 
- README.md to reflect the new changes

## [0.0.3] 2022-01-21
### Removed
- Unnecessary lines from addtosettings.txt

### Updated
- package.json
- Example screenshot
- README.md

## [0.0.2] 2022-01-15
### Added
- "Project Notes: Open Existing Note (Edit Mode)" Command
- "Project Notes: Open Existing Note (Preview Mode)" Command

## [0.0.1] 2022-01-15

- Initial release