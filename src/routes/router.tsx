import { BrowserRouter, Route, Routes } from "react-router";

import NotFound from "../components/layout/NotFound";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Layout from "@/components/layout/Layout";
import ShiftList from "@/feature/shift/ShiftList";
import UserLogin from "@/pages/auth/UserLogin";
import UserLogout from "@/pages/auth/UserLogout";
import UserRegister from "@/pages/auth/UserRegister";
import DashboardPage from "@/pages/DashboardPage";
import EmployeePage from "@/pages/employee/EmployeePage";
import OfficeLocationPage from "@/pages/office-location/OfficeLocationPage";
import PositionPage from "@/pages/position/PositionPage";
import PositionVisualPage from "@/pages/position/PositionVisualPage";
import SanctionTypePage from "@/pages/sanction/sanction-type/SanctionTypePage";
import SanctionPage from "@/pages/sanction/SanctionPage";
import Home from "../feature/home/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        {/* Auth Router */}
        <Route element={<Layout />}>
          <Route path="register" element={<UserRegister />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="logout" element={<UserLogout />} />
        </Route>
        {/* Dashbaorad */}
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees">
            <Route index element={<EmployeePage />} />
          </Route>
          <Route path="positions">
            <Route index element={<PositionPage />}></Route>
            <Route path="visual" element={<PositionVisualPage />}></Route>
          </Route>
          <Route path="employee-sanctions">
            <Route index element={<SanctionPage />}></Route>
            <Route path="types">
              <Route index element={<SanctionTypePage />} />
            </Route>
          </Route>
          <Route path="shifts">
            <Route index element={<ShiftList />} />
          </Route>
          <Route path="office-locations">
            <Route index element={<OfficeLocationPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
