import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ArduinoStatus {
  presenca: boolean;
  alarme: boolean;
  modo: 'desligado' | 'casa' | 'alarme';
  hora: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const useArduinoStatus = () => {
  const [status, setStatus] = useState<ArduinoStatus>({
    presenca: false,
    alarme: false,
    modo: 'desligado',
    hora: new Date().toLocaleTimeString()
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]);
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: ArduinoStatus = await response.json();

      if (status.alarme !== data.alarme && data.alarme) {
        addLog('Alarme disparado!', 'error');
        toast({
          title: "⚠️ Alarme Ativado",
          description: "Movimento detectado e alarme disparou!",
          variant: "destructive"
        });
      }

      if (status.presenca !== data.presenca) {
        addLog(data.presenca ? 'Presença detectada' : 'Área livre', data.presenca ? 'success' : 'warning');
      }

      if (status.modo !== data.modo) {
        addLog(`Modo alterado para: ${data.modo}`, 'info');
      }

      setStatus(data);
      setIsConnected(true);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      setIsConnected(false);
      if (error instanceof Error) {
        addLog(`Erro de conexão: ${error.message}`, 'error');
      }
    }
  }, [status, addLog, toast]);

  const changeMode = useCallback(async (newMode: ArduinoStatus['modo']) => {
    try {
      const response = await fetch('http://localhost:3001/api/modo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo: newMode }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const nomes = {
        desligado: 'Desligado',
        casa: 'Casa',
        alarme: 'Alarme'
      };

      addLog(`Solicitação para modo: ${nomes[newMode]}`, 'info');
      toast({
        title: "Modo Alterado",
        description: `Sistema em modo ${nomes[newMode]}`,
      });

      setTimeout(fetchStatus, 500);
    } catch (error) {
      console.error('Erro ao alterar modo:', error);
      addLog(`Erro ao alterar modo: ${error}`, 'error');
      toast({
        title: "Erro",
        description: "Falha ao alterar o modo",
        variant: "destructive"
      });
    }
  }, [addLog, fetchStatus, toast]);

  const disableAlarm = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/desativar-alarme', { method: 'POST' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      addLog('Alarme desativado manualmente', 'success');
      toast({
        title: "Alarme Desativado",
        description: "O alarme foi desativado com sucesso",
      });

      setTimeout(fetchStatus, 500);
    } catch (error) {
      console.error('Erro ao desativar alarme:', error);
      addLog(`Erro ao desativar alarme: ${error}`, 'error');
      toast({
        title: "Erro",
        description: "Não foi possível desativar o alarme",
        variant: "destructive"
      });
    }
  }, [addLog, fetchStatus, toast]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    status,
    logs,
    isConnected,
    lastUpdate,
    changeMode,
    disableAlarm,
    refreshStatus: fetchStatus
  };
};
