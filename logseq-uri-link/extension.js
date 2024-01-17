const { languages, CodeLens, Range, Uri, commands, env } = require('vscode');

class CustomCodeLensProvider {
    provideCodeLenses(document, token) {
        const text = document.getText();
        const customLinkRegex = /\blogseq:\/\/\S*\b/g;
        let match;
        const lenses = [];

        while ((match = customLinkRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new Range(startPos, endPos);
            const uri = Uri.parse(match[0]);
            const lens = new CodeLens(range, {
                title: "Open Link",
                command: "extension.openLink",
                arguments: [uri]
            });
            lenses.push(lens);
        }

        return lenses;
    }
}

function activate(context) {
    context.subscriptions.push(languages.registerCodeLensProvider({ scheme: 'file' }, new CustomCodeLensProvider()));

    context.subscriptions.push(commands.registerCommand('extension.openLink', async (uri) => {
        // Open the link with the default browser
        await env.openExternal(uri);
    }));
}

exports.activate = activate;