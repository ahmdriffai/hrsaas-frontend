import Title from "@/components/layout/Title";
import EmployeeContractCreate from "@/feature/employee/EmployeeContractCreate";
import type { ReactNode } from "react";

export default function EmployeeContractCreatePage(): ReactNode {
  return (
    <div>
      <Title title="Tambah data karyawan" />
      <EmployeeContractCreate />
    </div>
  );
}
