import { Header } from '@/components/Header';
import { StatusPanel } from '@/components/StatusPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { ScheduleConfig } from '@/components/ScheduleConfig';
import { LogPanel } from '@/components/LogPanel';
import { useArduinoStatus } from '@/hooks/useArduinoStatus';

const Index = () => {
  const {
    status,
    logs,
    isConnected,
    lastUpdate,
    changeMode,
    disableAlarm,
    updateSchedule,
    refreshStatus
  } = useArduinoStatus();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        status={status}
        isConnected={isConnected}
        onRefresh={refreshStatus}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Panel - Takes full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-2">
            <StatusPanel 
              status={status}
              isConnected={isConnected}
              lastUpdate={lastUpdate}
            />
          </div>
          
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel 
              status={status}
              onModeChange={changeMode}
              onDisableAlarm={disableAlarm}
              isConnected={isConnected}
            />
          </div>
          
          {/* Schedule Config - Only show when in scheduled mode */}
          {status.modo === 'programado' && (
            <div className="lg:col-span-3">
              <ScheduleConfig
                status={status}
                onScheduleUpdate={updateSchedule}
                isConnected={isConnected}
              />
            </div>
          )}
          
          {/* Log Panel - Full width */}
          <div className="lg:col-span-3">
            <LogPanel logs={logs} />
          </div>
        </div>
      </main>
      
      {/* Emergency Alert Overlay */}
      {status.alarme && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-status-alert text-status-alert-foreground p-4 rounded-lg shadow-lg border-2 border-status-alert animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <div>
                <p className="font-bold">ALARME ATIVO</p>
                <p className="text-sm opacity-90">Sistema em estado de alerta</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
