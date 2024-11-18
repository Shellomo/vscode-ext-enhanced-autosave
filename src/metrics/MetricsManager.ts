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

    private getFileExtension(fileName: string): string {
        if (!fileName) return 'unknown';
        
        const parts = fileName.split('.');
        if (parts.length <= 1) return 'unknown';
        
        const extension = parts.pop()?.toLowerCase();
        return extension || 'unknown';
    }

    private resetMetricsIfNeeded() {
        const now = new Date();
        const lastUpdate = new Date(this.context.globalState.get('lastUpdate', now.toISOString()));

        const defaultMetrics = {
            timesSaved: 0,
            timeSaved: 0,
            fileTypes: {},
            peakHours: {}
        };

        // Reset daily metrics if it's a new day
        if (now.getDate() !== lastUpdate.getDate()) {
            this.metrics.daily = { ...defaultMetrics };
        }

        // Reset weekly metrics if it's a new week
        if (now.getDay() < lastUpdate.getDay()) {
            this.metrics.weekly = { ...defaultMetrics };
        }

        // Reset monthly metrics if it's a new month
        if (now.getMonth() !== lastUpdate.getMonth()) {
            this.metrics.monthly = { ...defaultMetrics };
        }

        this.context.globalState.update('lastUpdate', now.toISOString());
    }

    public recordSave(fileName: string) {
        try {
            if (!fileName) {
                console.warn('recordSave called with empty fileName');
                return;
            }

            this.resetMetricsIfNeeded();

            // Ensure all metric objects exist
            this.initializeMetricsIfNeeded();

            // Increment save counts
            this.metrics.daily.timesSaved++;
            this.metrics.weekly.timesSaved++;
            this.metrics.monthly.timesSaved++;

            const saveTime = 2; // Assume 2 seconds saved per auto-save
            this.metrics.daily.timeSaved += saveTime;
            this.metrics.weekly.timeSaved += saveTime;
            this.metrics.monthly.timeSaved += saveTime;

            // Track file types
            const fileExtension = this.getFileExtension(fileName);
            
            // Safely increment the file type counters
            this.metrics.daily.fileTypes[fileExtension] = (this.metrics.daily.fileTypes[fileExtension] || 0) + 1;
            this.metrics.weekly.fileTypes[fileExtension] = (this.metrics.weekly.fileTypes[fileExtension] || 0) + 1;
            this.metrics.monthly.fileTypes[fileExtension] = (this.metrics.monthly.fileTypes[fileExtension] || 0) + 1;

            // Track peak hours
            const hour = new Date().getHours();
            this.metrics.daily.peakHours[hour] = (this.metrics.daily.peakHours[hour] || 0) + 1;
            this.metrics.weekly.peakHours[hour] = (this.metrics.weekly.peakHours[hour] || 0) + 1;
            this.metrics.monthly.peakHours[hour] = (this.metrics.monthly.peakHours[hour] || 0) + 1;

            this.saveMetrics();
        } catch (error) {
            console.error('Error in recordSave:', error);
            // Optionally show error message to user
            // vscode.window.showErrorMessage(`Error recording save metrics: ${error.message}`);
        }
    }

    private initializeMetricsIfNeeded() {
        const periods: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly'];
        
        periods.forEach(period => {
            if (!this.metrics[period]) {
                this.metrics[period] = {
                    timesSaved: 0,
                    timeSaved: 0,
                    fileTypes: {},
                    peakHours: {}
                };
            }
            
            // Ensure sub-objects exist
            this.metrics[period].fileTypes = this.metrics[period].fileTypes || {};
            this.metrics[period].peakHours = this.metrics[period].peakHours || {};
        });
    }

    private saveMetrics() {
        try {
            this.context.globalState.update('metrics', this.metrics);
        } catch (error) {
            console.error('Error saving metrics:', error);
            vscode.window.showErrorMessage('Failed to save metrics');
        }
    }

    public getMetrics() {
        this.resetMetricsIfNeeded();
        return this.metrics;
    }

    public getMostUsedFileTypes(period: 'daily' | 'weekly' | 'monthly'): Array<{extension: string, count: number}> {
        try {
            if (!this.metrics[period] || !this.metrics[period].fileTypes) {
                return [];
            }

            const fileTypes = this.metrics[period].fileTypes;
            return Object.entries(fileTypes)
                .map(([extension, count]) => ({ extension, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5); // Return top 5
        } catch (error) {
            console.error('Error getting most used file types:', error);
            return [];
        }
    }

    public getPeakHours(period: 'daily' | 'weekly' | 'monthly'): Array<{hour: number, count: number}> {
        try {
            if (!this.metrics[period] || !this.metrics[period].peakHours) {
                return [];
            }

            const peakHours = this.metrics[period].peakHours;
            return Object.entries(peakHours)
                .map(([hour, count]) => ({ hour: parseInt(hour), count }))
                .sort((a, b) => b.count - a.count);
        } catch (error) {
            console.error('Error getting peak hours:', error);
            return [];
        }
    }
}