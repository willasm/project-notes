![](https://vsmarketplacebadge.apphb.com/version-short/willasm.project-notes.svg)
![](https://vsmarketplacebadge.apphb.com/installs-short/willasm.project-notes.svg)
![](https://vsmarketplacebadge.apphb.com/downloads-short/willasm.project-notes.svg)
![](https://vsmarketplacebadge.apphb.com/rating/willasm.project-notes.svg)

# Project Notes + TODO Highlighter

Important!!! For users that are upgrading from v0.0.5 or earlier please see [Upgrading Notes File](UPGRADING.md) for important information regarding changes from the older versions..

Maintains 2 lists of notes in markdown file format. Notes are either project specific or global. Project notes are only available when that project is loaded while global notes are accessible at all times. Notes may be viewed in preview or edit modes. [Links](#using-file-links) to both project and global notes can be embedded within your source code.

Adds TODO syntax highlighting support to comments in your source files.

Note: This extension provides syntax highlighting for definable keywords within your source code. The highlighting is enabled by file extension. It has support for the following languages by file extension...

`.asm .bas .bat .c .c++ .cc .cls .cmd .coffee .cp .cpp .cppm .cs .css .cxx .dpr .go .html .ini .ixx .java .js .jsonc .jsx .kt .kts .ktm .less .m .mat .md .pas .pl .php .py .r .rlib .rs .rb .scss .sql .swift .tbs .ts .twig .txs .vue`

It is possible to [add new extensions](SETTINGS.md) to the settings file. If you are using a programming language that this extension does not support and you need assistance adding it to the settings file, please submit an issue on my [Github Issues page](https://github.com/willasm/project-notes/issues) and I will add support for it to this extension.

## Features
- Maintains 2 lists of notes, one project specific and one global.
- Insert Links to project note files inside your codes comments.
- Insert Links to global note files inside your codes comments.
- Global notes location can be set to any preferred location (uses this extensions global storage location by default).
- Adds syntax highlighting in comments to the default tags `BUG, CHANGED, DEBUG, FIXME, HACK, IDEA, NOTE, OPTIMIZE, RESEARCH, REVIEW, TEMP and TODO`.
- New `Tags` can be added to the settings file.
- Supports Light and Dark Themes.
- All `Tags` can be enabled or disabled individually in the [settings](SETTINGS.md) file.
- Highlighting of user definable `Tag Blocks` - Any text surrounded by user definable text characters.
- [Snippets](#snippets-for-tags) for the pre-defined tags and tag blocks.
- `Tags` are case insensitive.
- `Tags` trailing colon is optional.
- `Parentheses`, `brackets` and `Curly braces` in comments are also highlighed.
- `Backticks`, `"Double Quotes"` and `'Single Quotes'` in comments are also highlighted.

## Screenshots
Project and Global Note Views....

![Notes Example Screenshot](./images/NoteViews.png)

Example Highlighting Dark Theme (Dark+ default dark)....

![Dark Theme Highlighting Example Screenshot](./images/DemoDark.png)

Example Highlighting Light Theme (Light+ default light) ....

![Light Theme Highlighting Example Screenshot](./images/DemoLight.png)

## Extension Commands
These commands are availiable from the command pallette: (Windows: CTRL+Shift+P or F1) (Mac: CMD+Shift+P)

- `Project Notes: Open Note File Link`

    Opens a Project or Global Note File from a Comment File Link. [See Using File Links](#using-file-links)

- `Project Notes: Set Globals Notes Folder Location`

    Set Globals Notes Folder Location. If not set, will use this extensions global storage location.

- `Project Notes: Edit Tags Settings File`

    Opens Settings File for editing.

- `Project Notes: Restore Tag Settings File`

    Restores settings file to its default settings. (Caution! This will remove all changes you have made!)

Note: This extension does not set any default key bindings for any of these commands. Setting one for the command `Project Notes: Set Globals Notes Folder Location` is recommended if you plan to use that feature frequently.


## Using File Links
Create a comment in the format `// Project File: Filename.MD` for project notes. The `Project File:` portion is the trigger for highlighting the following file name.

Create a comment in the format `// Global File: Filename.MD` for global notes. The `Global File:` portion is the trigger for highlighting the following file name.

[Snippets](#snippets-for-tags) are included for inserting both types of note links.

Note that the `MD` extension is required. The file name is styled as underlined by default. Note that it is not an actual clickable link. Unfortunatly it is not currently possible to receive mouse click messages from vscode.

To create (or open an existing project note) simply run the command `Project Notes: Open Note File Link` with the cursor anywhere on the same line as the `Project File: Filename.MD` comment. If the file already exists it will be opened in a new editor window, otherwise a new file is created and opened for editing.

To create (or open an existing global note) simply run the command `Project Notes: Open Note File Link` with the cursor anywhere on the same line as the `Global File: Filename.MD` comment. If the file already exists it will be opened in a new editor window, otherwise a new file is created and opened for editing.

All Project Note Files are stored in your projects `.vscode` folder (which is created if it does not exist). You may want to add to your `.gitignore` file `.vscode/*.MD` if you do not want Git to track your notes.

## Changing TAG Colors and Styling

Refer to the [settings file documentation](SETTINGS.md)

## Snippets for tags
Snippets are provided for the pre-defined tags. They can be entered by typing the prefixes...

- `tagKeyword`
- `tagProjectNote`
- `tagGlobalNote`
- `tagMainTitle`
- `tagSubTitle`
- `tagHiddenTitle`
- `tagUnderline`
- `tagStrikethrough`
- `commentHiddenTitle`
- `commentKeyword`
- `commentBoxSingleLine`
- `commentBoxDblLine`

Note: To enable snippets selection menu in comments, add this line to your settings.json file.
"editor.quickSuggestions.comments": true

### How to use the snippets...

![Example gif](./images/Snippets.gif)

### More examples of how to use...

![Example gif2](./images/Snippets2.gif)

## Release Notes
See the [Release Notes](RELEASE.md) for details.

