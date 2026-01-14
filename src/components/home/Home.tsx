import { useNavigate } from "react-router";
import { useEffectOnce } from "react-use";

export default function Home() {
  const navigate = useNavigate();
  useEffectOnce(() => {
    async function handleNavigate() {
      await navigate({
        pathname: "/login",
      });
    }

    handleNavigate();
  });
  return <></>;
}
