import { useContext } from "react";
import { TrailerContext } from "../context/TrailerContext";

export const useTrailerContext = () => {
  const context = useContext(TrailerContext);
  if (!context) {
    throw new Error('useTrailerContext must be used within a TrailerProvider');
  }
  return context;
};
