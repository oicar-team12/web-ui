import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface GroupContextType {
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  triggerShiftRefresh: () => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGroupId, setSelectedGroupIdState] = useState<string | null>(() => {
    // Initialize from localStorage
    const storedGroupId = localStorage.getItem('selectedGroupId');
    return storedGroupId || null;
  });
  const [shiftRefreshKey, setShiftRefreshKey] = useState(0);

  // Update localStorage whenever selectedGroupId changes
  useEffect(() => {
    if (selectedGroupId) {
      localStorage.setItem('selectedGroupId', selectedGroupId);
    } else {
      localStorage.removeItem('selectedGroupId');
    }
  }, [selectedGroupId]);

  const handleSetSelectedGroupId = (id: string | null) => {
    setSelectedGroupIdState(id);
  };

  const triggerShiftRefresh = () => {
    setShiftRefreshKey(prev => prev + 1);
  };

  return (
    <GroupContext.Provider value={{ selectedGroupId, setSelectedGroupId: handleSetSelectedGroupId, triggerShiftRefresh }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
