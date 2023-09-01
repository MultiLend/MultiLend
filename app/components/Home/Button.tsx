import { FC } from "react";

interface Props {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const Button: FC<Props> = ({ title, isActive, onClick }) => {
  return (
    <button
      className={`xs:inline-flex group items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900 ${
                  isActive ? "" : "opacity-50 cursor-not-allowed"
                }`}
      onClick={isActive ? onClick : undefined}
    >
      {title}
    </button>
  );
};

export default Button;
