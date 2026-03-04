import { userLogout } from "@/lib/api/user.api";
import { useNavigate } from "react-router";
import { useEffectOnce, useLocalStorage } from "react-use";
import { toast } from "sonner";

export default function UserLogout() {
  const [token, setToken] = useLocalStorage("token", "");
  const navigate = useNavigate();

  async function handleLogout() {
    const response = await userLogout(token ?? "");
    const responseJson = await response.json();

    if (response.status === 200) {
      await toast.success("User logout successfully");
      setToken("");
      await navigate({
        pathname: "/login",
      });
    } else {
      await toast.error(responseJson.error);
    }
  }

  useEffectOnce(() => {
    handleLogout();
  });

  return <></>;
}
