type Props = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressBar({ currentStep, totalSteps }: Props) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="top-0 left-0 z-40 w-full flex-1 transition-all duration-500">
      <div className="h-1 w-full bg-gray-200">
        <div
          className="h-1 bg-black transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
