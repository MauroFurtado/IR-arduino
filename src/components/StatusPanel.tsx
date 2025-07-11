import { ArduinoStatus } from '@/hooks/useArduinoStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusPanelProps {
  status: ArduinoStatus;
  isConnected: boolean;
  lastUpdate: Date;
}

export const StatusPanel = ({ status, isConnected, lastUpdate }: StatusPanelProps) => {
  const getStatusColor = (value: boolean, isAlarm = false) => {
    if (isAlarm) {
      return value ? 'bg-status-alert text-status-alert-foreground' : 'bg-status-normal text-status-normal-foreground';
    }
    return value ? 'bg-status-normal text-status-normal-foreground' : 'bg-muted text-muted-foreground';
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'automatico':
        return 'bg-status-auto text-status-auto-foreground';
      case 'emergencia':
        return 'bg-status-alert text-status-alert-foreground';
      default:
        return 'bg-status-warning text-status-warning-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Status do Sistema</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isConnected ? "bg-status-normal animate-pulse" : "bg-status-alert"
            )} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Presença</label>
            <Badge className={getStatusColor(status.presenca)}>
              {status.presenca ? 'Detectada' : 'Ausente'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Alarme</label>
            <Badge className={getStatusColor(status.alarme, true)}>
              {status.alarme ? '🚨 Ativado' : 'Desativado'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Modo</label>
            <Badge className={getModeColor(status.modo)}>
              {status.modo.charAt(0).toUpperCase() + status.modo.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Hora Sistema</label>
            <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {status.hora}
            </div>
          </div>
        </div>
        
        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-right">
          Última atualização: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};