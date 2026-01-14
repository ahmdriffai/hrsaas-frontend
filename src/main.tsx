import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmployeeList from "./components/employee/EmployeeList";
import Home from "./components/home/Home";
import DashboarLayout from "./components/layout/DashboardLayout";
import Layout from "./components/layout/Layout";
import NotFound from "./components/layout/NotFound";
import PositionList from "./components/position/PositionList";
import PositionVisual from "./components/position/PositionVisual";
import SanctionList from "./components/sanction/SanctionList";
import SanctionTypeList from "./components/sanction/SanctionTypeList";
import { ThemeProvider } from "./components/theme-provider";
import UserLogin from "./components/user/UserLogin";
import UserLogout from "./components/user/UserLogout";
import UserRegister from "./components/user/UserRegister";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route element={<Layout />}>
              <Route path="register" element={<UserRegister />} />
              <Route path="login" element={<UserLogin />} />
              <Route path="logout" element={<UserLogout />} />
            </Route>
            <Route element={<DashboarLayout />}>
              <Route path="dashboard" element={<p>Dashboard</p>} />
              <Route path="employees">
                <Route index element={<EmployeeList />} />
              </Route>
              <Route path="positions">
                <Route index element={<PositionList />}></Route>
                <Route path="visual" element={<PositionVisual />}></Route>
              </Route>
              <Route path="employee-sanctions">
                <Route index element={<SanctionList />}></Route>
                <Route path="types">
                  <Route index element={<SanctionTypeList />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
