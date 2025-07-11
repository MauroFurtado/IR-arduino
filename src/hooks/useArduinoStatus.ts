import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ArduinoStatus {
  presenca: boolean;
  alarme: boolean;
  modo: 'vigilante' | 'alerta' | 'programado' | 'desativado';
  hora: string;
  horario_inicio?: string; // Para modo programado
  horario_fim?: string;    // Para modo programado
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
    modo: 'desativado',
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
    
    setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep only last 20 logs
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      // Substitua pela URL real do Arduino (ex: http://192.168.1.100)
      const response = await fetch('http://localhost:3001/api/status'); // Para teste local
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ArduinoStatus = await response.json();
      
      // Detectar mudanças importantes para logs
      if (status.alarme !== data.alarme && data.alarme) {
        addLog('Alarme ativado!', 'error');
        toast({
          title: "⚠️ Alarme Ativado",
          description: "O sistema detectou uma situação de alerta",
          variant: "destructive"
        });
      }
      
      if (status.presenca !== data.presenca) {
        addLog(data.presenca ? 'Presença detectada' : 'Presença perdida', data.presenca ? 'success' : 'warning');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modo: newMode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const modeNames = {
        'desativado': 'Desativado',
        'alerta': 'Alerta',
        'vigilante': 'Vigilante',
        'programado': 'Programado'
      };

      addLog(`Solicitação de mudança para modo: ${modeNames[newMode]}`, 'info');
      toast({
        title: "Modo Alterado",
        description: `Sistema alterado para modo ${modeNames[newMode]}`,
      });
      
      // Atualizar status imediatamente
      setTimeout(fetchStatus, 500);
      
    } catch (error) {
      console.error('Erro ao alterar modo:', error);
      addLog(`Erro ao alterar modo: ${error}`, 'error');
      toast({
        title: "Erro",
        description: "Não foi possível alterar o modo de operação",
        variant: "destructive"
      });
    }
  }, [addLog, fetchStatus, toast]);

  const updateSchedule = useCallback(async (inicio: string, fim: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/horario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ horario_inicio: inicio, horario_fim: fim }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      addLog(`Horário programado atualizado: ${inicio} às ${fim}`, 'info');
      toast({
        title: "Horário Atualizado",
        description: `Vigilância programada das ${inicio} às ${fim}`,
      });
      
      // Atualizar status imediatamente
      setTimeout(fetchStatus, 500);
      
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
      addLog(`Erro ao atualizar horário: ${error}`, 'error');
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o horário",
        variant: "destructive"
      });
    }
  }, [addLog, fetchStatus, toast]);

  const disableAlarm = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/desativar-alarme', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      addLog('Alarme desativado manualmente', 'success');
      toast({
        title: "Alarme Desativado",
        description: "O alarme foi desativado com sucesso",
      });
      
      // Atualizar status imediatamente
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
    // Buscar status inicial
    fetchStatus();
    
    // Configurar polling a cada 2 segundos
    const interval = setInterval(fetchStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    logs,
    isConnected,
    lastUpdate,
    changeMode,
    disableAlarm,
    updateSchedule,
    refreshStatus: fetchStatus
  };
};