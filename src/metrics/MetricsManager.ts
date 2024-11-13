import * as vscode from 'vscode';

interface SaveMetrics {
    timesSaved: number;
    timeSaved: number;
    fileTypes: Record<string, number>;  // Track file types saved
    peakHours: Record<number, number>;  // Track busy hours
}

export class MetricsManager {
    private metrics: {
        daily: SaveMetrics;
        weekly: SaveMetrics;
        monthly: SaveMetrics;
    };

    constructor(private context: vscode.ExtensionContext) {
        this.metrics = this.loadMetrics();
    }

    private loadMetrics() {
        const defaultMetrics = {
            timesSaved: 0,
            timeSaved: 0,
            fileTypes: {},
            peakHours: {}
        };

        return this.context.globalState.get('metrics', {
            daily: { ...defaultMetrics },
            weekly: { ...defaultMetrics },
            monthly: { ...defaultMetrics }
        });
    }

    private resetMetricsIfNeeded() {
        const now = new Date();
        const lastUpdate = new Date(this.context.globalState.get('lastUpdate', now.toISOString()));

        // Reset daily metrics if it's a new day
        if (now.getDate() !== lastUpdate.getDate()) {
            this.metrics.daily = {
                timesSaved: 0,
                timeSaved: 0,
                fileTypes: {},
                peakHours: {}
            };
        }

        // Reset weekly metrics if it's a new week
        if (now.getDay() < lastUpdate.getDay()) {
            this.metrics.weekly = {
                timesSaved: 0,
                timeSaved: 0,
                fileTypes: {},
                peakHours: {}
            };
        }

        // Reset monthly metrics if it's a new month
        if (now.getMonth() !== lastUpdate.getMonth()) {
            this.metrics.monthly = {
                timesSaved: 0,
                timeSaved: 0,
                fileTypes: {},
                peakHours: {}
            };
        }

        this.context.globalState.update('lastUpdate', now.toISOString());
    }

    public recordSave(fileName: string) {
        this.resetMetricsIfNeeded();

        // Increment save counts
        this.metrics.daily.timesSaved++;
        this.metrics.weekly.timesSaved++;
        this.metrics.monthly.timesSaved++;

        const saveTime = 2; // Assume 2 seconds saved per auto-save
        this.metrics.daily.timeSaved += saveTime;
        this.metrics.weekly.timeSaved += saveTime;
        this.metrics.monthly.timeSaved += saveTime;

        // Track file types
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'unknown';
        this.metrics.daily.fileTypes[fileExtension] = (this.metrics.daily.fileTypes[fileExtension] || 0) + 1;
        this.metrics.weekly.fileTypes[fileExtension] = (this.metrics.weekly.fileTypes[fileExtension] || 0) + 1;
        this.metrics.monthly.fileTypes[fileExtension] = (this.metrics.monthly.fileTypes[fileExtension] || 0) + 1;

        // Track peak hours
        const hour = new Date().getHours();
        this.metrics.daily.peakHours[hour] = (this.metrics.daily.peakHours[hour] || 0) + 1;
        this.metrics.weekly.peakHours[hour] = (this.metrics.weekly.peakHours[hour] || 0) + 1;
        this.metrics.monthly.peakHours[hour] = (this.metrics.monthly.peakHours[hour] || 0) + 1;

        this.saveMetrics();
    }

    private saveMetrics() {
        this.context.globalState.update('metrics', this.metrics);
    }

    public getMetrics() {
        this.resetMetricsIfNeeded();
        return this.metrics;
    }

    // Helper method to get most used file types
    public getMostUsedFileTypes(period: 'daily' | 'weekly' | 'monthly'): Array<{extension: string, count: number}> {
        const fileTypes = this.metrics[period].fileTypes;
        return Object.entries(fileTypes)
            .map(([extension, count]) => ({ extension, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Return top 5
    }

    // Helper method to get peak hours
    public getPeakHours(period: 'daily' | 'weekly' | 'monthly'): Array<{hour: number, count: number}> {
        const peakHours = this.metrics[period].peakHours;
        return Object.entries(peakHours)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count);
    }
}