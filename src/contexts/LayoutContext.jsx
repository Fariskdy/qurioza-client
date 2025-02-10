import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [showDashboardLayout, setShowDashboardLayout] = useState(true);

  return (
    <LayoutContext.Provider
      value={{ showDashboardLayout, setShowDashboardLayout }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
