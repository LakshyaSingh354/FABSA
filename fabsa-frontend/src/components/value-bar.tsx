interface ValueBarProps {
  value: number;
}

export const ValueBar: React.FC<ValueBarProps> = ({ value }) => {
  const percentage = ((value + 1) / 2) * 100; // Convert value to percentage

  return (
    <div className="relative w-full h-6">
      {/* Heatmap background bar */}
      <div className="h-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded-lg overflow-hidden"></div>

      {/* Marker (triangle) */}
      <div
        className="absolute top-[-2.5rem] transform -translate-x-1/2 flex flex-col items-center"
        style={{ left: `${percentage}%` }}
      >
        <span className="text-lg font-bold">{value.toFixed(2)}</span>
        <div className="w-2 h-2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
      </div>
    </div>
  );
};
