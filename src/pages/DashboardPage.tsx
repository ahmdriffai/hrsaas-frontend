import Title from "@/components/layout/Title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetEmployee } from "@/hooks/feature/use-employee";
import { useGetPosition } from "@/hooks/feature/use-position";
import { useGetSanction } from "@/hooks/feature/use-sanction";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import { AlertTriangle, BriefcaseBusiness, Users } from "lucide-react";
import type React from "react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";

type SummaryCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  loading?: boolean;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  loading,
}: SummaryCardProps): React.ReactNode {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage(): React.ReactNode {
  useDocumentTitle("Dashboard HR");
  const [token] = useLocalStorage("token", "");

  const employeeQuery = useGetEmployee(token ?? "", { page: 1, size: 100 });
  const positionQuery = useGetPosition(token ?? "", { page: 1, size: 100 });
  const sanctionQuery = useGetSanction(token ?? "", { page: 1, size: 100 });

  const employeeTotal = employeeQuery.data?.paging.total_item ?? 0;
  const positionTotal = positionQuery.data?.paging.total_item ?? 0;
  const activeSanctionTotal = sanctionQuery.data?.paging.total_item ?? 0;

  return (
    <div className="space-y-6">
      <Title title="Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Karyawan"
          value={employeeTotal}
          subtitle="Karyawan terdaftar"
          icon={<Users className="size-4" />}
          loading={employeeQuery.isLoading}
        />
        <SummaryCard
          title="Total Posisi"
          value={positionTotal}
          subtitle="Posisi aktif"
          icon={<BriefcaseBusiness className="size-4" />}
          loading={positionQuery.isLoading}
        />
        <SummaryCard
          title="Total Sanksi"
          value={activeSanctionTotal}
          subtitle="Catatan sanksi"
          icon={<AlertTriangle className="size-4" />}
          loading={sanctionQuery.isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Akses modul utama HR management dari dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/employees">Kelola Karyawan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/positions">Kelola Posisi</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/employee-sanctions">Kelola Sanksi</Link>
          </Button>
        </CardContent>
      </Card>

      {(employeeQuery.isError ||
        positionQuery.isError ||
        sanctionQuery.isError) && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Perhatian</CardTitle>
            <CardDescription>
              Sebagian data ringkasan gagal dimuat. Coba muat ulang halaman.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">Data tidak lengkap</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
