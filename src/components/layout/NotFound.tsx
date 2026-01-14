import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import { Link } from "react-router";
import Logo from "../ui/logo";

export default function NotFound() {
  useDocumentTitle("404 Not Found");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <Logo />
      <h1 className="text-7xl font-bold">404</h1>
      <p className="text-muted-foreground">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Button asChild>
        <Link to="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  );
}
