import EmployeeCreate from "@/feature/employee/EmployeeCreate";
import type { ReactNode } from "react";

export default function EmployeeCreatePage(): ReactNode {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Employee</h1>
      <EmployeeCreate />
    </div>
  );
}
