import { BrowserRouter, Route, Routes } from "react-router";

import NotFound from "../components/layout/NotFound";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Layout from "@/components/layout/Layout";
import SubmenuLayout from "@/components/layout/SubmenuLayout";
import UserLogin from "@/pages/auth/UserLogin";
import UserLogout from "@/pages/auth/UserLogout";
import UserRegister from "@/pages/auth/UserRegister";
import CompanyPage from "@/pages/company/CompanyPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeCreatePage from "@/pages/employee/EmployeeCreatePage";
import EmployeePage from "@/pages/employee/EmployeePage";
import OfficeLocAssignPage from "@/pages/office-location/OfficeLocAssignPage";
import OfficeLocationPage from "@/pages/office-location/OfficeLocationPage";
import PositionPage from "@/pages/position/PositionPage";
import PositionVisualPage from "@/pages/position/PositionVisualPage";
import SanctionTypePage from "@/pages/sanction/sanction-type/SanctionTypePage";
import SanctionPage from "@/pages/sanction/SanctionPage";
import ShiftAssignPage from "@/pages/shift/ShiftAssignPage";
import ShiftCreatePage from "@/pages/shift/ShiftCreatePage";
import ShiftPage from "@/pages/shift/ShiftPage";
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
            <Route path="create" element={<EmployeeCreatePage />} />
          </Route>
          <Route
            path="/companies"
            element={
              <SubmenuLayout
                tabs={[
                  { label: "Profile perusahaan", path: "/companies" },
                  { label: "Posisi", path: "/companies/positions" },
                  { label: "Divisi", path: "/companies/division" },
                ]}
              />
            }
          >
            <Route index element={<CompanyPage />}></Route>
            <Route path="positions">
              <Route index element={<PositionPage />}></Route>
              <Route path="visual" element={<PositionVisualPage />}></Route>
            </Route>
          </Route>

          <Route
            path="/attendances"
            element={
              <SubmenuLayout
                tabs={[
                  { label: "Kehadiran harian", path: "/attendances" },
                  {
                    label: "Persetujuan hehadiran",
                    path: "/attendances/approve",
                    totalData: 10,
                  },
                  {
                    label: "Shift",
                    path: "/attendances/shifts",
                  },
                  {
                    label: "Lokasi kehadiran",
                    path: "/attendances/office-locations",
                  },
                ]}
              />
            }
          >
            <Route index element={<p>Tes</p>} />
            <Route path="office-locations">
              <Route index element={<OfficeLocationPage />} />
              <Route
                path="assign-employee/:officeLocationID"
                element={<OfficeLocAssignPage />}
              />
            </Route>
            <Route path="shifts">
              <Route index element={<ShiftPage />} />
              <Route path="create" element={<ShiftCreatePage />} />
              <Route
                path="assign-employee/:shiftID"
                element={<ShiftAssignPage />}
              />
            </Route>
          </Route>
          <Route path="employee-sanctions">
            <Route index element={<SanctionPage />}></Route>
            <Route path="types">
              <Route index element={<SanctionTypePage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
