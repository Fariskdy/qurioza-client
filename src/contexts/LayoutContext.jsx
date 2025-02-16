import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

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

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
