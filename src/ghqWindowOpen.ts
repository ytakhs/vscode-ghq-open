"use strct"

import { window, QuickPickItem } from "vscode"

const ghqListCommand: string = "command ghq list --full-path"

class GhqListItem implements QuickPickItem {
  label: string
  absolutePath: string

  constructor(absolutePath: string) {
    this.label = absolutePath
    this.absolutePath = absolutePath
  }
}

import * as child_process from "child_process"

function runListCommand(): Promise<QuickPickItem[]> {
  return new Promise((resolve, reject) => {
    child_process.exec(ghqListCommand, (err, stdout, stderr) => {
      if (err) {
        const cmdError = `${err}: ${stderr}`
        reject(new Error(cmdError))
      }

      const list: GhqListItem[] = stdout.split("\n").map(l => new GhqListItem(l))

      resolve(list)
    })
  })
}

function runWindowOpenCommand(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    child_process.exec(`code ${path}`, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

export async function ghqWindowOpen() {
  let list: QuickPickItem[]

  try {
    list = await runListCommand()
  } catch (err) {
    window.showErrorMessage(err)
    return
  }

  const pickedItem = await window.showQuickPick(list)

  if (!pickedItem) {
    return
  }

  try {
    await runWindowOpenCommand((pickedItem as GhqListItem).absolutePath)
  } catch (err) {
    await window.showErrorMessage(err)
  }
}
