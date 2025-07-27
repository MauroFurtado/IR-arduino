import { useState } from 'react';
import { ArduinoStatus } from '@/hooks/useArduinoStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScheduleConfigProps {
  status: ArduinoStatus;
  onScheduleUpdate: (inicio: string, fim: string) => void;
  isConnected: boolean;
}

export const ScheduleConfig = ({ status, onScheduleUpdate, isConnected }: ScheduleConfigProps) => {
  const [horarioInicio, setHorarioInicio] = useState(status.horario_inicio || '22:00');
  const [horarioFim, setHorarioFim] = useState(status.horario_fim || '06:00');

  const handleSave = () => {
    onScheduleUpdate(horarioInicio, horarioFim);
  };

  const isScheduleActive = () => {
    if (!status.horario_inicio || !status.horario_fim) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = status.horario_inicio.split(':').map(Number);
    const [endHour, endMin] = status.horario_fim.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    // Verifica se o horário cruza a meia-noite
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          ⏰ Configuração de Horário
          {status.modo === 'programado' && (
            <span className={`text-xs px-2 py-1 rounded ${
              isScheduleActive() 
                ? 'bg-status-alert text-status-alert-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {isScheduleActive() ? 'VIGILANTE ATIVO' : 'AGUARDANDO'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inicio">Início da Vigilância</Label>
            <Input
              id="inicio"
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              disabled={!isConnected}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fim">Fim da Vigilância</Label>
            <Input
              id="fim"
              type="time"
              value={horarioFim}
              onChange={(e) => setHorarioFim(e.target.value)}
              disabled={!isConnected}
            />
          </div>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={!isConnected}
          className="w-full"
        >
          💾 Salvar Horários
        </Button>
        
        {status.horario_inicio && status.horario_fim && (
          <div className="text-sm text-muted-foreground">
            <p>🕒 Vigilância ativa das {status.horario_inicio} às {status.horario_fim}</p>
            <p>Status atual: {isScheduleActive() ? '🟢 Dentro do horário' : '🔴 Fora do horário'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};