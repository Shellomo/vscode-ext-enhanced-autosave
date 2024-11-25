import * as vscode from 'vscode';
import { ExtensionController } from './controllers/ExtensionController';
import { TelemetryService } from './telemetry';

export function activate(context: vscode.ExtensionContext) {
    const telemetryService = TelemetryService.getInstance(context);
    telemetryService.sendActivationEvent();

    const controller = new ExtensionController(context);
    controller.activate();
}

export function deactivate(
) {
    TelemetryService.getInstance(null as any).dispose();
}