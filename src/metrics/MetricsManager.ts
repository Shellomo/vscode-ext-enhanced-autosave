import * as vscode from 'vscode';

export class MetricsManager {
    private metrics: {
        daily: { timesSaved: number; timeSaved: number };
        weekly: { timesSaved: number; timeSaved: number };
        monthly: { timesSaved: number; timeSaved: number };
    };

    constructor(private context: vscode.ExtensionContext) {
        this.metrics = this.loadMetrics();
    }

    private loadMetrics() {
        return this.context.globalState.get('metrics', {
            daily: { timesSaved: 0, timeSaved: 0 },
            weekly: { timesSaved: 0, timeSaved: 0 },
            monthly: { timesSaved: 0, timeSaved: 0 }
        });
    }

    public recordSave() {
        this.metrics.daily.timesSaved++;
        this.metrics.weekly.timesSaved++;
        this.metrics.monthly.timesSaved++;

        const saveTime = 2; // Assume 2 seconds saved per auto-save
        this.metrics.daily.timeSaved += saveTime;
        this.metrics.weekly.timeSaved += saveTime;
        this.metrics.monthly.timeSaved += saveTime;

        this.saveMetrics();
    }

    private saveMetrics() {
        this.context.globalState.update('metrics', this.metrics);
    }

    public getMetrics() {
        return this.metrics;
    }
}