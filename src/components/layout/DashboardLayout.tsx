import {
  BadgeCheck,
  Bell,
  Building,
  CalendarClock,
  CreditCard,
  Home,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Kelola Karyawan",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Divisi",
          url: "#",
        },
        {
          title: "Jabatan",
          url: "/positions",
        },
        {
          title: "Data Karyawan",
          url: "/employees",
        },
        {
          title: "Lokasi Kehadiran",
          url: "#",
        },
        {
          title: "Jadwal Hari Kerja",
          url: "#",
        },
        {
          title: "Pola Kerja",
          url: "/shifts",
        },
        {
          title: "Sanksi / Peringatan",
          url: "/employee-sanctions",
        },
      ],
    },
    {
      title: "Kehadiran",
      url: "#",
      icon: CalendarClock,
      items: [
        {
          title: "Divisi",
          url: "#",
        },
        {
          title: "Jabatan",
          url: "#",
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Perusahaan",
          url: "#",
        },
      ],
    },
  ],
};

export default function DashboardLayout(): React.ReactNode {
  const [token, setToken] = useLocalStorage("token", "");
  const navigate = useNavigate();

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Toaster richColors position="top-center" />
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <footer className="p-4 border-t flex justify-between items-center">
          <p className="text-xs">© 2025 Developed by Makaryoo.com</p>
          <div className="flex gap-x-2">
            <a
              href="https://apps.apple.com/gb/app/apple-store/id375380948"
              target="_blank"
            >
              <img src="./getin-as.png" className="w-20" alt="" />
            </a>
            <a href="https://play.google.com/store/games?hl=en" target="_blank">
              <img src="./getin-gp.png" className="w-20" alt="" />
            </a>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Building className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Makaryoo</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useEffectOnce, useLocalStorage } from "react-use";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { pathname } = useLocation();

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild = item.items?.some((sub) => isActive(sub.url));

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={hasActiveChild}
              className="group/collapsible"
            >
              {item.items ? (
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    className={`py-5 ${
                      hasActiveChild
                        ? "bg-sidebar-accent text-primary font-medium"
                        : ""
                    }`}
                    asChild
                  >
                    <SidebarMenuButton className="text-sm" tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className={`${
                              isActive(subItem.url)
                                ? "text-primary font-medium"
                                : ""
                            }`}
                            asChild
                          >
                            <Link className="text-sm" to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={`py-5 ${
                      isActive(item.url)
                        ? "bg-sidebar-accent text-primary font-medium"
                        : ""
                    }`}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { userCurrent } from "@/lib/api/user.api";
import { ModeToggle } from "../mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Toaster } from "../ui/sonner";

export function SiteHeader() {
  const user: { name: string; email: string; avatar: string } = {
    name: "Ahmad",
    email: "rifai@gmail.com",
    avatar: "aa",
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) py-8">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 ">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2 ">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Avatar className="h-8 w-8 rounded-sm cursor-pointer">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-sm text-sm">
                    CN
                  </AvatarFallback>{" "}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              // side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Link to="/logout">
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
