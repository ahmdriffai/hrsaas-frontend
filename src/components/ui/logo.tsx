import type React from "react";

import LogoImg from "../../assets/images/logo.png";

export default function Logo(): React.ReactNode {
  return (
    <div className="flex justify-center items-end">
      <img src={LogoImg} alt="Logo" className={`w-37.5`} />
    </div>
  );
}
