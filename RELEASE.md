# Release Notes

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->

## [0.0.6] 2022-03-29
- New command - `Project Notes: Edit Tags Settings File`
- New command - `Project Notes: Restore Tag Settings File`
- All tag settings are now stored in `project-notes-tag-settings.json` file
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


For a full list of changes, please see the projects [Changelog](CHANGELOG.md) file.

I hope you enjoy using the Extension, and if you find any bugs, or would like to see a certain feature added, please feel free to contact me.

Enjoy! William
