import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface VoiceRecognitionContextType {
  activeInstanceId: string | null;
  setActiveInstance: (id: string | null) => void;
  isInstanceActive: (id: string) => boolean;
  forceStopActiveInstance: () => void;
}

const VoiceRecognitionContext = createContext<VoiceRecognitionContextType | undefined>(undefined);

export function VoiceRecognitionProvider({ children }: { children: React.ReactNode }) {
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);

  const setActiveInstance = useCallback((id: string | null) => {
    setActiveInstanceId(id);
  }, []);

  const isInstanceActive = useCallback((id: string) => {
    return activeInstanceId === id;
  }, [activeInstanceId]);

  const forceStopActiveInstance = useCallback(() => {
    if (activeInstanceId) {
      setActiveInstanceId(null);
    }
  }, [activeInstanceId]);

  // Memoizar el valor del contexto para evitar re-renders
  const contextValue = useMemo(() => ({
    activeInstanceId,
    setActiveInstance,
    isInstanceActive,
    forceStopActiveInstance
  }), [activeInstanceId, setActiveInstance, isInstanceActive, forceStopActiveInstance]);

  return (
    <VoiceRecognitionContext.Provider value={contextValue}>
      {children}
    </VoiceRecognitionContext.Provider>
  );
}

export function useVoiceRecognition() {
  const context = useContext(VoiceRecognitionContext);
  if (context === undefined) {
    throw new Error('useVoiceRecognition must be used within a VoiceRecognitionProvider');
  }
  return context;
}
