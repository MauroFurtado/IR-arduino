import { LogEntry } from '@/hooks/useArduinoStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel = ({ logs }: LogPanelProps) => {
  const getLogTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-status-normal text-status-normal-foreground';
      case 'error':
        return 'bg-status-alert text-status-alert-foreground';
      case 'warning':
        return 'bg-status-warning text-status-warning-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Log de Eventos</CardTitle>
      </CardHeader>
    
      <CardContent>
        <ScrollArea className="h-80 w-full">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhum evento registrado
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-lg">
                    {getLogIcon(log.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {log.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.timestamp}
                    </p>
                  </div>

                  <Badge className={cn("text-xs", getLogTypeColor(log.type))}>
                    {log.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};