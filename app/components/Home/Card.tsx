import { FC, ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const Card: FC<Props> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-4 bg-secondary rounded-xl py-4 px-8 border-2 border-outline">
      <p className="font-bold text-lg">{title}</p>
      {children}
    </div>
  );
};

export default Card;
