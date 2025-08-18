import React, { createContext, useContext } from 'react';

interface BottomDrawerContextValue {
  // Placeholder for future state (tabs, filters, etc.)
}

const BottomDrawerContext = createContext<BottomDrawerContextValue | undefined>(undefined);

const useBottomDrawer = () => {
  const ctx = useContext(BottomDrawerContext);
  if (!ctx) throw new Error('useBottomDrawer must be used within BottomDrawerProvider');
  return ctx;
};

const BottomDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: BottomDrawerContextValue = {};
  return <BottomDrawerContext.Provider value={value}>{children}</BottomDrawerContext.Provider>;
};

const BottomDrawerHeader: React.FC = () => (
  <div className="bottom-drawer-header">
    <h3>Tools</h3>
  </div>
);

const BottomDrawerBody: React.FC = () => (
  <div className="bottom-drawer-body">
    <div className="placeholder">Bottom Drawer (Content TBD)</div>
  </div>
);

const BottomDrawer: React.FC = () => {
  return (
    <BottomDrawerProvider>
      <div className="bottom-drawer-content">
        <BottomDrawerHeader />
        <BottomDrawerBody />
      </div>
    </BottomDrawerProvider>
  );
};

export default BottomDrawer;
export { useBottomDrawer, BottomDrawerHeader, BottomDrawerBody };
