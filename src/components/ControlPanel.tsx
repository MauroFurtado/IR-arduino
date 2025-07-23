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
    return status.modo === mode ? 'default' : 'outline';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Controles do Sistema</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Modo de Operação */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Modo de Operação</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant={getModeButtonVariant('desligado')}
              onClick={() => onModeChange('desligado')}
              disabled={!isConnected}
              className={cn("w-full")}
            >
              ⏸️ Desligado
            </Button>
            
            <Button
              variant={getModeButtonVariant('casa')}
              onClick={() => onModeChange('casa')}
              disabled={!isConnected}
              className={cn("w-full")}
            >
              🏠 Casa
            </Button>
            
            <Button
              variant={getModeButtonVariant('alarme')}
              onClick={() => onModeChange('alarme')}
              disabled={!isConnected}
              className={cn("w-full")}
            >
              🔔 Alarme
            </Button>
          </div>
        </div>
        
        {/* Controle do Alarme */}
        {status.alarme && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Controle de Alarme</label>
            <Button
              variant="destructive"
              onClick={onDisableAlarm}
              disabled={!isConnected}
              className="w-full"
            >
              🔇 Desativar Alarme
            </Button>
          </div>
        )}
        
        {/* Status de Conexão */}
        {!isConnected && (
          <div className="p-3 bg-red-100 border-l-4 border-red-500 rounded">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Sistema desconectado - Controles indisponíveis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
