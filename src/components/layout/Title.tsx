type Props = {
  title: string;
};

export default function Title({ title }: Props) {
  return (
    <div className="mt-4 mb-6 flex flex-col gap-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}
