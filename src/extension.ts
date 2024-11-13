import * as vscode from 'vscode';
import { ExtensionController } from './controllers/ExtensionController';

export function activate(context: vscode.ExtensionContext) {
    const controller = new ExtensionController(context);
    controller.activate();
}

export function deactivate() {}