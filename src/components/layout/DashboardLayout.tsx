import { userCurrent } from "@/lib/api/user.api";
import clsx from "clsx";
import {
  Building,
  CalendarHeart,
  ClockFading,
  DoorClosed,
  Home,
  MapPinned,
  Menu,
  NotebookPen,
  Search,
  Settings2,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useEffectOnce, useLocalStorage } from "react-use";
import AppleStore from "../../assets/images/getin-as.png";
import AndroidStore from "../../assets/images/getin-gp.png";
import Logo from "../ui/logo";
import { Toaster } from "../ui/sonner";

const menuItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Perusahaan", icon: Building, path: "/companies" },
  { label: "Data karyawan", icon: Users, path: "/employees" },
  { label: "Izin & cuti", icon: NotebookPen, path: "/time-offs" },
  { label: "Kehadiran", icon: CalendarHeart, path: "/attendances" },
  { label: "Kunjungan", icon: MapPinned, path: "/visits" },
  { label: "Shift", icon: ClockFading, path: "/shifts" },
  {
    label: "Sanksi / pelanggaran",
    icon: TriangleAlert,
    path: "/employee-sanctions",
  },
  { label: "Pengaturan", icon: Settings2, path: "/settings" },

  // { label: "Log masuk & keamanan", icon: Shield },
  // { label: "Privasi", icon: Hand },
  // { label: "Notifikasi", icon: Bell },
  // { label: "Pajak", icon: Calculator },
  // { label: "Pembayaran", icon: CreditCard },
  // { label: "Bahasa & mata uang", icon: Globe },
  // { label: "Perjalanan bisnis", icon: Briefcase },
];

// const data = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: Home,
//   },
//   {
//     title: "Kelola Karyawan",
//     url: "#",
//     icon: Users,
//     items: [
//       {
//         title: "Divisi",
//         url: "#",
//       },
//       {
//         title: "Jabatan",
//         url: "/positions",
//       },
//       {
//         title: "Data karyawan",
//         url: "/employees",
//       },
//       {
//         title: "Lokasi kehadiran",
//         url: "/office-locations",
//       },
//       {
//         title: "Pola Kerja",
//         url: "/shifts",
//       },
//       {
//         title: "Sanksi / Peringatan",
//         url: "/employee-sanctions",
//       },
//     ],
//   },
//   {
//     title: "Kehadiran",
//     url: "#",
//     icon: CalendarClock,
//     items: [
//       {
//         title: "Divisi",
//         url: "#",
//       },
//       {
//         title: "Jabatan",
//         url: "#",
//       },
//     ],
//   },
//   {
//     title: "Pengaturan",
//     url: "#",
//     icon: Settings,
//     items: [
//       {
//         title: "Perusahaan",
//         url: "#",
//       },
//     ],
//   },
// ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Header({ onMenuClick, user }: { onMenuClick: () => void; user: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b-[1.5px] border-zinc-100 bg-white px-6 md:px-10 py-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-8">
        <Logo />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm">
          {user?.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={onMenuClick}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function SidebarContent() {
  const [filteredMenu, setFilteredMenu] = useState(menuItems);
  const [key, setKey] = useState<string>("");

  useEffect(() => {
    const result = menuItems.filter((el) =>
      el.label.toLowerCase().includes(key.toLowerCase()),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredMenu(result);
  }, [key]);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <div className="py-6">
      <h1 className="text-2xl font-medium mb-3 tracking-wide px-6 md:px-10">
        Menu admin
      </h1>
      <div className="px-6 md:px-10 mb-6">
        <div className="flex items-center rounded-full border border-gray-300 px-4 py-4 focus-within:border-gray-400">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            placeholder="Search menu ..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-scroll px-6 md:px-10 transition-all ease-out">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={clsx(
                "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200",
                isActive(item.path)
                  ? "bg-zinc-100 font-medium"
                  : "hover:bg-zinc-50",
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon
                className="w-6 h-6 text-zinc-700"
                strokeWidth={isActive(item.path) ? 2 : 1.5}
              />
              <span className="text-base text-zinc-800">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="border-t my-3 mx-6 md:mx-10" />

      <div className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer  hover:bg-zinc-50 transition-all mx-6 md:mx-10">
        <DoorClosed className="w-5 h-5 text-destructive" />
        <span className="text-base text-destructive">Logout</span>
      </div>
    </div>
  );
}

export default function DashboardLayout(): React.ReactNode {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useLocalStorage("token", "");
  const [user] = useLocalStorage("user", "");

  const navigate = useNavigate();

  const userLogin = JSON.parse(user ?? "");

  async function validateLogin() {
    if (!token) {
      await navigate({
        pathname: "/login",
      });
    }

    const response = await userCurrent(token ?? "");
    if (response.status === 401) {
      await navigate({
        pathname: "/login",
      });
      setToken("");
    }

    const body = await response.json();
    if (!body?.data?.role || body.data.role.toUpperCase() !== "ADMIN") {
      await navigate({
        pathname: "/not-found",
      });
      setToken("");
    }
  }

  useEffectOnce(() => {
    validateLogin();
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header onMenuClick={() => setOpen(true)} user={userLogin} />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-100 border-r-[1.5px] border-zinc-100 bg-white">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        {open && (
          <div className="fixed inset-0 z-999 flex">
            {/* Overlay */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <div className="w-72 bg-white h-full shadow-xl">
              <div className="flex items-center justify-between p-4 ">
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-scroll">
          <div className="max-w-3xl mx-auto bg-white">
            <Toaster richColors position="top-center" />
            <Outlet />
            <footer className="relative mt-10 w-full bottom-0 flex items-center justify-between px-6 py-5 text-xs text-gray-400 border-t border-gray-100">
              <p>Copyright © 2025 BW Akses+</p>
              <div className="flex gap-2 opacity-70">
                <Link
                  target="_blank"
                  to="https://play.google.com/store/apps/details?id=id.co.bankwonosobo.bwaccess&hl=id"
                >
                  <img src={AndroidStore} className="h-6" />
                </Link>
                <Link target="_blank" to="https://www.apple.com/id/app-store/">
                  <img src={AppleStore} className="h-6" />
                </Link>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
