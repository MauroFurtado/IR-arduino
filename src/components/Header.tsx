import { Button } from '@/components/ui/button';
import { ArduinoStatus } from '@/hooks/useArduinoStatus';
import { cn } from '@/lib/utils';

interface HeaderProps {
  status: ArduinoStatus;
  isConnected: boolean;
  onRefresh: () => void;
}

export const Header = ({ status, isConnected, onRefresh }: HeaderProps) => {
  const getSystemStatusColor = () => {
    if (!isConnected) return 'text-status-alert';
    if (status.alarme) return 'text-status-alert';
    if (status.modo === 'vigilante') return 'text-status-alert';
    if (status.modo === 'alerta') return 'text-status-auto';
    if (status.modo === 'programado') return 'text-status-warning';
    return 'text-muted-foreground';
  };

  const getSystemStatusText = () => {
    if (!isConnected) return 'Sistema Desconectado';
    if (status.alarme) return 'Alarme Ativo';
    if (status.modo === 'vigilante') return 'Modo Vigilante Ativo';
    if (status.modo === 'alerta') return 'Modo Alerta';
    if (status.modo === 'programado') return 'Modo Programado';
    return 'Sistema Desativado';
  };

  return (
    <header className="w-full bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
              <h1 className="text-2xl font-bold">Monitor Arduino</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-status-normal animate-pulse" : "bg-status-alert animate-pulse"
              )} />
              <span className={cn("font-medium", getSystemStatusColor())}>
                {getSystemStatusText()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={!isConnected}
              className="hidden sm:flex"
            >
              🔄 Atualizar
            </Button>
            
            {/* Mobile status indicator */}
            <div className="md:hidden flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-status-normal" : "bg-status-alert"
              )} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Mobile status text */}
        <div className="md:hidden mt-2">
          <span className={cn("text-sm font-medium", getSystemStatusColor())}>
            {getSystemStatusText()}
          </span>
        </div>
      </div>
    </header>
  );
};