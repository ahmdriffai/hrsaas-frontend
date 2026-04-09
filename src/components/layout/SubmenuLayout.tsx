import clsx from "clsx";
import { Outlet, useLocation, useNavigate } from "react-router";

type Tab = {
  label: string;
  path: string;
  totalData?: number;
};

interface Props {
  tabs?: Tab[];
}
export default function SubmenuLayout({ tabs = [] }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/", 1);

  return (
    <div>
      <div className="w-full border-b mb-10">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={clsx(
                " border-black  pb-3 text-md transition-all",
                isActive(tab.path)
                  ? "text-black font-medium border-b-2"
                  : "text-gray-400 hover:text-black",
              )}
            >
              {tab.label}
              {tab.totalData! > 0 && (
                <span className="bg-destructive text-[11px] text-white p-1.5 rounded-full ms-1">
                  {tab.totalData}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conten */}
      <Outlet />
    </div>
  );
}
