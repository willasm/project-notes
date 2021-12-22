<!-- ![](https://vsmarketplacebadge.apphb.com/version-short/willasm.project-notes.svg) -->
<!-- ![](https://vsmarketplacebadge.apphb.com/installs-short/willasm.project-notes.svg) -->
<!-- ![](https://vsmarketplacebadge.apphb.com/downloads-short/willasm.project-notes.svg) -->
<!-- ![](https://vsmarketplacebadge.apphb.com/rating/willasm.project-notes.svg) -->

# project-notes
Adds inline file links to notes in markdown files.

Adds TODO syntax highlighting support to your source files.

## Features
- Link to project note files in Markdown format.
- Adds syntax highlighting in comments to the tags `TODO, NOTE, FIXME, BUG, DEBUG, HACK, TEMP, IDEA, REVIEW, RESEARCH, CHANGED, and OPTIMIZE`.
- Using the symbols - `!  @  #  $` before any word will allow you to highlight that word. This allows you to highlight words not in the list of supplied `Tags`.
- `Tags` are case insensitive.
- `Tags` trailing colon is optional.
- Comments in Parentheses, brackets and Curly braces are also highlighed.
- Comments in Backticks are also highlighted.
- Snippets support for `Tags`. [See Documentaion](https://code.visualstudio.com/docs/editor/userdefinedsnippets) for details.

## Screenshots


## Requirements
To enable syntax highlighting you will need to add the following to your Setttings.json file.


## Extension Settings
There is only one command availiable from the command pallette `Project Notes: Open or Create Note`

If you plan to use the File Link feature quite often it is recommended that you set a default key binding for the command.

## Using File Links
Create a comment in the format `// File: Filename.MD`. The `File:` portion is the trigger for highlighting the following file name.

Note that the `MD` extension is optional. The file name is styled as underlined by default (It is not an actual clickable link).

To create (or open an existing note) simply run the command `Project Notes: Open or Create Note` with the cursor anywhere on the same line as the `Filename.MD` comment. If the file already exists it will be opened in a new editor, otherwise a new file is created and opened for editing.

Running the command `Project Notes: Open or Create Note` with the cursor on any line without a `File: filename.MD` comment will create (or open) a file with the base name of the folder opened in VSCode. (Typically your projects name).

All Note Files are stored in your projects `.vscode` folder (which is created if it does not exist). You may want to ad to your `.gitignore` file `.vscode/*.MD` if you do not want Git to track your notes.

## To Do
Add snippet support.


## Known Issues
None.


## Release Notes
See the [Release Notes](RELEASE.md) for details.

