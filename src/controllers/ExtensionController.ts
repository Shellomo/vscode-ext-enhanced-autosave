import * as vscode from 'vscode';
import { MetricsManager } from '../metrics/MetricsManager';
import { MetricsDashboard } from '../metrics/MetricsDashboard';
import { formatTime } from '../utils/formatters';
import { TelemetryService } from '../telemetry';

export class ExtensionController {
    private statusBarItem: vscode.StatusBarItem;
    private metricsButton: vscode.StatusBarItem;
    private metricsManager: MetricsManager;
    private isEnabled: boolean = true;
    private teleService: TelemetryService;

    constructor(private context: vscode.ExtensionContext) {
        this.teleService = TelemetryService.getInstance(context);
        this.metricsManager = new MetricsManager(context);
        
        // Create status bar items
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        
        this.metricsButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            99
        );
    }

    public activate() {
        // Register commands
        this.context.subscriptions.push(
            vscode.commands.registerCommand('enhancedAutosave.toggleAutoSave', 
                this.toggleAutoSave.bind(this)
            ),
            vscode.commands.registerCommand('enhancedAutosave.showMetrics', 
                this.showMetrics.bind(this)
            )
        );

        // Setup status bar
        this.statusBarItem.command = 'enhancedAutosave.toggleAutoSave';
        this.metricsButton.text = "$(graph) Metrics";
        this.metricsButton.command = 'enhancedAutosave.showMetrics';
        
        this.updateStatusBar();
        this.statusBarItem.show();
        this.metricsButton.show();

        // Register event handlers
        this.context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(
                this.onDocumentChange.bind(this)
            )
        );
    }

    private toggleAutoSave() {

        this.isEnabled = !this.isEnabled;
        this.teleService.sendToggleAutoSaveClickedEvent(true, this.isEnabled);
        this.updateStatusBar();
    }

    private showMetrics() {
        this.teleService.sendShowMetricsClickedEvent(true);
        const dashboard = new MetricsDashboard(this.context);
        dashboard.show(this.metricsManager.getMetrics());
    }

    private updateStatusBar() {
        const metrics = this.metricsManager.getMetrics();
        this.statusBarItem.text = this.isEnabled ? 
            `$(save) AutoSave On (${formatTime(metrics.daily.timeSaved)})` : 
            `$(save) AutoSave Off`;
    }

    private async onDocumentChange(event: vscode.TextDocumentChangeEvent) {
        if (!this.isEnabled) return;

        // if the document is not existing on disk, it's a new document
        if (event.document.uri.scheme === 'untitled') return;
        
        setTimeout(async () => {
            if (event.document.isDirty) {
                await event.document.save();
                this.metricsManager.recordSave(event.document.fileName);
                this.updateStatusBar();
            }
        }, 1000);
    }
}