# Project Notes + TODO Highlighter Upgrading Notes

## Highlighting Changes

In previous versions the highlighting was provided through the `textMateRules` section under the `editor.tokenColorCustomizations` key in the users settings.json file. This meant the user had to add the settings from the `addtosettings.md` file manually if you wished to change any of the default colors. In this version I have switched to using text decorations which eliminates that requirement alltogether. As a result of this you can now safely remove those settings (if you had already added them) as they are no longer required. You can view the [old settings](#old-settings) at the bottom of this document if you wish to remove them.

## Using Symbols `! @ # $`

Using the symbols `! @ # $` to highlight specific words has now been removed as you can now add your own `keywords` or `tag blocks` to the settings file. This has the benefit of eliminating unwanted highlighting of some words as those symbols are commonly used for other purposes. My apologies if you are currently using them in your code but it had to be done.

## Project and Global Notes

Previously the `.MD` extension was optional. This is now a requirement to remove any confusion as to what type of files the notes system uses. The trigger for `Project Notes` has also been changed from `file: filename` to `project file: filename.md` to more clearly differentiate between global and project notes.

## Old Settings

Removing these settings from your `settings.json` file is recommended. They will not cause any problems if left in but they do make your `settin.json` file much larger than it needs to be.

```
  "editor.tokenColorCustomizations": {
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
        "scope": "meta.embedded.project-notes.color-globalfilelink",
        "settings": {
          "foreground": "#6e9ad3",
          "fontStyle": "underline"
        }
      },
      {
        "scope": "meta.embedded.project-notes.color-backticks",
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
  }
```