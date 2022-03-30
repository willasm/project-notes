# Change Log
<!--
## [1.0.0]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
### Updated 
-->

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->

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