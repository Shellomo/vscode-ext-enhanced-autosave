import * as vscode from 'vscode';

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
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
                    <style>
                        body { 
                            padding: 20px; 
                            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                            color: var(--vscode-foreground);
                        }
                        .metrics-container {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                            gap: 20px;
                            margin-bottom: 30px;
                        }
                        .metric-card {
                            background: var(--vscode-editor-background);
                            padding: 20px;
                            border-radius: 8px;
                            border: 1px solid var(--vscode-widget-border);
                        }
                        .metric-value {
                            font-size: 24px;
                            font-weight: bold;
                            color: var(--vscode-textLink-activeForeground);
                        }
                        .metric-label {
                            font-size: 14px;
                            color: var(--vscode-descriptionForeground);
                        }
                        .chart-container {
                            margin-top: 30px;
                            padding: 20px;
                            background: var(--vscode-editor-background);
                            border-radius: 8px;
                            border: 1px solid var(--vscode-widget-border);
                        }
                        h1, h2 {
                            color: var(--vscode-foreground);
                        }
                    </style>
                </head>
                <body>
                    <h1>AutoSave Metrics Dashboard</h1>
                    
                    <div class="metrics-container">
                        <div class="metric-card">
                            <div class="metric-value">${metrics.daily.timesSaved}</div>
                            <div class="metric-label">Saves Today</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${metrics.weekly.timesSaved}</div>
                            <div class="metric-label">Saves This Week</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${metrics.monthly.timesSaved}</div>
                            <div class="metric-label">Saves This Month</div>
                        </div>
                    </div>

                    <div class="chart-container">
                        <canvas id="savesChart"></canvas>
                    </div>

                    <div class="chart-container">
                        <canvas id="timeChart"></canvas>
                    </div>

                    <script>
                        const ctx1 = document.getElementById('savesChart').getContext('2d');
                        new Chart(ctx1, {
                            type: 'bar',
                            data: {
                                labels: ['Daily', 'Weekly', 'Monthly'],
                                datasets: [{
                                    label: 'Number of Saves',
                                    data: [
                                        ${metrics.daily.timesSaved},
                                        ${metrics.weekly.timesSaved},
                                        ${metrics.monthly.timesSaved}
                                    ],
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'AutoSave Frequency'
                                    }
                                }
                            }
                        });

                        const ctx2 = document.getElementById('timeChart').getContext('2d');
                        new Chart(ctx2, {
                            type: 'line',
                            data: {
                                labels: ['Daily', 'Weekly', 'Monthly'],
                                datasets: [{
                                    label: 'Time Saved (seconds)',
                                    data: [
                                        ${metrics.daily.timeSaved},
                                        ${metrics.weekly.timeSaved},
                                        ${metrics.monthly.timeSaved}
                                    ],
                                    fill: true,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    tension: 0.3
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Time Saved Trend'
                                    }
                                }
                            }
                        });
                    </script>
                </body>
            </html>
        `;
    }
}