import Button from "@/components/fragment/button/button";
import Title from "@/components/layout/Title";
import EmployeeCreate from "@/feature/employee/EmployeeCreate";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

export default function EmployeeCreatePage(): ReactNode {
  return (
    <div>
      <Button asChild variant="third">
        <Link to="/employees">
          <ArrowLeft />
        </Link>
      </Button>
      <Title title="Tambah data karyawan" />
      <EmployeeCreate />
    </div>
  );
}
