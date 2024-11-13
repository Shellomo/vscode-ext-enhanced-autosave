import * as vscode from 'vscode';
import { formatTime } from '../utils/formatters';

export class MetricsDashboard {
    private panel: vscode.WebviewPanel | undefined;

    constructor(private context: vscode.ExtensionContext) {}

    public show(metrics: any) {
        if (this.panel) {
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel(
                'autoSaveMetrics',
                'AutoSave Metrics',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }

        this.panel.webview.html = this.getWebviewContent(metrics);
    }

    private getWebviewContent(metrics: any): string {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body { padding: 20px; }
                        .metric-card {
                            background: var(--vscode-editor-background);
                            padding: 15px;
                            margin: 10px 0;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <h1>AutoSave Metrics</h1>
                    <div class="metric-card">
                        <h2>Today</h2>
                        <p>Autosaves: ${metrics.daily.timesSaved}</p>
                        <p>Time Saved: ${formatTime(metrics.daily.timeSaved)}</p>
                    </div>
                    <div class="metric-card">
                        <h2>This Week</h2>
                        <p>Autosaves: ${metrics.weekly.timesSaved}</p>
                        <p>Time Saved: ${formatTime(metrics.weekly.timeSaved)}</p>
                    </div>
                    <div class="metric-card">
                        <h2>This Month</h2>
                        <p>Autosaves: ${metrics.monthly.timesSaved}</p>
                        <p>Time Saved: ${formatTime(metrics.monthly.timeSaved)}</p>
                    </div>
                </body>
            </html>
        `;
    }
}