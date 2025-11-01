import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

export default function AppProviders({ children }) {
  return <Router>{children}</Router>;
}
