import Button from "@/components/fragment/button/button";
import Title from "@/components/layout/Title";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertTriangle,
  BriefcaseBusiness,
  Users,
  type LucideProps,
} from "lucide-react";
import type React from "react";
import { Link } from "react-router";
import { useLocalStorage } from "react-use";

type SummaryCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  loading?: boolean;
};

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  loading,
}: SummaryCardProps): React.ReactNode {
  const Icon = icon;
  return (
    <div className="border rounded-2xl p-6 space-y-2">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground">
          <Icon className="w-6 h-6 text-zinc-700" />
        </div>
        <div className="text-2xl font-bold">{loading ? "..." : value}</div>
      </div>
      <p className="text-muted-foreground text-xs">{subtitle}</p>
    </div>
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
          icon={Users}
          loading={employeeQuery.isLoading}
        />
        <SummaryCard
          title="Total Posisi"
          value={positionTotal}
          subtitle="Posisi aktif"
          icon={BriefcaseBusiness}
          loading={positionQuery.isLoading}
        />
        <SummaryCard
          title="Total Sanksi"
          value={activeSanctionTotal}
          subtitle="Catatan sanksi"
          icon={AlertTriangle}
          loading={sanctionQuery.isLoading}
        />
      </div>

      <hr />

      <div className="space-y-3">
        <div className="space-y-3">
          <h3 className="font-bold">Aksi Cepat</h3>
          <p className="text-sm">
            Akses modul utama HR management dari dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/employees">Kelola Karyawan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/positions">Kelola Posisi</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/employee-sanctions">Kelola Sanksi</Link>
          </Button>
        </div>
      </div>

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
