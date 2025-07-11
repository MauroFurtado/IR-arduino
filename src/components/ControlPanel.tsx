import { ArduinoStatus } from '@/hooks/useArduinoStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  status: ArduinoStatus;
  onModeChange: (mode: ArduinoStatus['modo']) => void;
  onDisableAlarm: () => void;
  isConnected: boolean;
}

export const ControlPanel = ({ status, onModeChange, onDisableAlarm, isConnected }: ControlPanelProps) => {
  const getModeButtonVariant = (mode: ArduinoStatus['modo']) => {
    if (status.modo === mode) {
      switch (mode) {
        case 'vigilante':
          return 'destructive'; // Red for vigilante mode
        case 'alerta':
          return 'default'; // Primary for alert mode
        case 'programado':
          return 'secondary'; // Secondary for scheduled mode
        default:
          return 'outline'; // Outline for disabled
      }
    }
    return 'outline';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Controles</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mode Controls */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Modo de Operação</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant={getModeButtonVariant('desativado')}
              onClick={() => onModeChange('desativado')}
              disabled={!isConnected}
              className={cn(
                "w-full",
                status.modo === 'desativado' && "bg-muted text-muted-foreground"
              )}
            >
              ⏸️ Desativado
            </Button>
            
            <Button
              variant={getModeButtonVariant('alerta')}
              onClick={() => onModeChange('alerta')}
              disabled={!isConnected}
              className={cn(
                "w-full",
                status.modo === 'alerta' && "bg-status-auto text-status-auto-foreground hover:bg-status-auto/90"
              )}
            >
              🔔 Alerta
            </Button>
            
            <Button
              variant={getModeButtonVariant('vigilante')}
              onClick={() => onModeChange('vigilante')}
              disabled={!isConnected}
              className={cn(
                "w-full",
                status.modo === 'vigilante' && "bg-status-alert text-status-alert-foreground hover:bg-status-alert/90"
              )}
            >
              👁️ Vigilante
            </Button>
            
            <Button
              variant={getModeButtonVariant('programado')}
              onClick={() => onModeChange('programado')}
              disabled={!isConnected}
              className={cn(
                "w-full",
                status.modo === 'programado' && "bg-status-warning text-status-warning-foreground hover:bg-status-warning/90"
              )}
            >
              ⏰ Programado
            </Button>
          </div>
        </div>
        
        {/* Alarm Control */}
        {status.alarme && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Controle de Alarme</label>
            <Button
              variant="destructive"
              onClick={onDisableAlarm}
              disabled={!isConnected}
              className="w-full bg-status-alert text-status-alert-foreground hover:bg-status-alert/90"
            >
              🔇 Desativar Alarme
            </Button>
          </div>
        )}
        
        {/* Connection Status */}
        {!isConnected && (
          <div className="p-3 bg-status-alert/10 border-l-4 border-status-alert rounded">
            <p className="text-sm text-status-alert font-medium">
              ⚠️ Sistema desconectado - Controles indisponíveis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};