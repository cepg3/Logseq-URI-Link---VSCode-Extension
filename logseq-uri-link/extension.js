// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { DocumentLink, Range, Uri, vscode } = require('vscode');

class CustomDocumentLinkProvider {
    provideDocumentLinks(document, token) {
        const text = document.getText();
        const customLinkRegex = /\blogseq:\/\/\S*\b/g;
        let match;
        const links = [];

        while ((match = customLinkRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new Range(startPos, endPos);
            const uri = Uri.parse(match[0]);
            const link = new DocumentLink(range, uri);
            links.push(link);
        }

        return links;
    }
}

function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ scheme: 'file' }, new CustomDocumentLinkProvider()));

    context.subscriptions.push(vscode.commands.registerCommand('extension.openLink', async (uri) => {
        // Open the link with the default browser
        await vscode.env.openExternal(uri);
    }));
}

exports.activate = activate;

