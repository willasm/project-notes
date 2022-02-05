# Change Log
<!--
## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
- Global Note Files picker for View/Edit was only detecting lowercase .md
### Security
### Updated 
-->

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->

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