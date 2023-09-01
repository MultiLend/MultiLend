import { FC } from "react";

interface Props {
  meta: {
    title: string;
    value: string;
  }[];
}

const Meta: FC<Props> = ({ meta }) => {
  return (
    <div className="flex flex-col gap-1">
      {meta.map((item) => {
        return (
          <div className="flex items-center justify-between" key={item.title}>
            <p className="text-sm font-bold">{item.title}</p>
            <p className="text-sm">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Meta;
