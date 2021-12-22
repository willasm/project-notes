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

## Screenshots
Example Highlighting ....
![Example Screenshot](https://github.com/willasm/project-notes/blob/master/images/project-notes-example.pnghttps://github.com/willasm/project-notes/blob/master/images/project-notes-example.png)

## Requirements
To enable syntax highlighting you will need to add the following to your Setttings.json file.
You can [Copy these settings](AddToSetting.txt) from the file AddToSetting.MD file then paste them into your settings.json file.
````
  "editor.tokenColorCustomizations": {
    "comments": "#11bb58",
    "numbers": "#48c2a8",
    "textMateRules": [
      {
        "scope": "meta.embedded.project-notes.color-parentheses",
        "settings": {
          "foreground": "#c300dd",
          "fontStyle": "bold"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-curly",
        "settings": {
          "foreground": "#fcf950",
          "fontStyle": "bold"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-bracket",
        "settings": {
          "foreground": "#3afff5",
          "fontStyle": "bold"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-filelink",
        "settings": {
          "foreground": "#6ed3c2",
          "fontStyle": "underline"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-codeblock",
        "settings": {
          "foreground": "#21a0d3",
          "fontStyle": "italic"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-dblquote",
        "settings": {
          "foreground": "#a7e0f7",
          "fontStyle": "italic"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-singlequote",
        "settings": {
          "foreground": "#5ecaf5",
          "fontStyle": "italic"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-one",
        "settings": {
          "foreground": "#ff4040",
          "fontStyle": "bold"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-two",
        "settings": {
          "foreground": "#fffb00",
          "fontStyle": "underline"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-three",
        "settings": {
          "foreground": "#bfffac",
          "fontStyle": "italic"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-four",
        "settings": {
          "foreground": "#acf5ff",
          "fontStyle": "italic bold underline"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-todo",
        "settings": {
          "foreground": "#89daff",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-note",
        "settings": {
          "foreground": "#21bed3",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-fixme",
        "settings": {
          "foreground": "#c7743d",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-bug",
        "settings": {
          "foreground": "#f3725c",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-debug",
        "settings": {
          "foreground": "#f09036",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-hack",
        "settings": {
          "foreground": "#c83ef1",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-temp",
        "settings": {
          "foreground": "#97af8f",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-idea",
        "settings": {
          "foreground": "#f0cc2e",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-review",
        "settings": {
          "foreground": "#40bdee",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-research",
        "settings": {
          "foreground": "#7ad8f0",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-changed",
        "settings": {
          "foreground": "#f3b736",
          "fontStyle": ""
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-optimize",
        "settings": {
          "foreground": "#a6ffdd",
          "fontStyle": ""
        }
      }
    ]
  },
````

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

