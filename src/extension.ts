import { ExtensionContext, commands } from "vscode"

import { ghqWindowOpen } from "./ghqWindowOpen"

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "vscode-ghq-open" is now active!')

  context.subscriptions.push(commands.registerCommand("extension.ghqWindowOpen", ghqWindowOpen))
}

export function deactivate() {}
