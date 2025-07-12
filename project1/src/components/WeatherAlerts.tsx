import React from 'react';
import { AlertTriangle, Info, AlertCircle, Zap } from 'lucide-react';

interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory' | 'emergency';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  startTime: Date;
  endTime: Date;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  className?: string;
}

export function WeatherAlerts({ alerts, className = '' }: WeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-xl p-6 text-white shadow-xl ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Info size={24} className="text-green-400" />
          <h3 className="text-xl font-bold">Weather Alerts</h3>
        </div>
        <p className="text-gray-400">No active weather alerts for this location.</p>
      </div>
    );
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return <Zap size={20} className="text-red-500" />;
      case 'high':
        return <AlertTriangle size={20} className="text-orange-500" />;
      case 'medium':
        return <AlertCircle size={20} className="text-yellow-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'border-red-500 bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-900/20';
      default:
        return 'border-blue-500 bg-blue-900/20';
    }
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 text-white shadow-xl ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <AlertTriangle size={24} className="text-red-500" />
        <h3 className="text-xl font-bold">Weather Alerts</h3>
        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.severity)}
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-2">{alert.title}</h4>
                <p className="text-gray-300 text-sm mb-3">{alert.description}</p>
                <div className="text-xs text-gray-400">
                  <p>Effective: {alert.startTime.toLocaleString()}</p>
                  <p>Expires: {alert.endTime.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}