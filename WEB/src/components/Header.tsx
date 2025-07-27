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
    if (!isConnected) return 'text-red-500';
    if (status.alarme) return 'text-red-600 font-bold';
    if (status.modo === 'alarme') return 'text-orange-500';
    if (status.modo === 'casa') return 'text-green-600';
    return 'text-gray-500';
  };

  const getSystemStatusText = () => {
    if (!isConnected) return 'Sistema Desconectado';
    if (status.alarme) return '🚨 Alarme Ativo!';
    if (status.modo === 'alarme') return 'Modo Alarme';
    if (status.modo === 'casa') return 'Modo Casa';
    return 'Sistema Desligado';
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
            A
          </div>
          <h1 className="text-xl font-semibold">Monitor Arduino</h1>
        </div>

        {/* Status e Botão */}
        <div className="mt-3 md:mt-0 flex items-center gap-4">
          {/* Status visual */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'
              )}
            />
            <span className={cn('text-sm font-medium', getSystemStatusColor())}>
              {getSystemStatusText()}
            </span>
          </div>

          {/* Botão atualizar */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={!isConnected}
            className="hidden sm:inline-flex"
          >
            🔄 Atualizar
          </Button>
        </div>
      </div>
    </header>
  );
};
