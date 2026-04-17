import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GlobalComparison({ userEmission }) {
  const [data, setData] = useState({
    india: 1900,
    global: 4700,
  });

  useEffect(() => {
    // can be extended to API later
  }, []);

  // 🔥 Normalize for bars
  const max = Math.max(userEmission, data.india, data.global);

  const getWidth = (value) => (value / max) * 100;

  const getColor = (value) => {
    if (value <= data.india) return "bg-green-500";
    if (value <= data.global) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLabel = () => {
    if (userEmission <= data.india) {
      return "🌱 Excellent! You're below India average";
    }
    if (userEmission <= data.global) {
      return "👍 Good, but can improve";
    }
    return "⚠️ Above global average — take action";
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg space-y-5">

      <h3 className="text-lg font-semibold flex items-center gap-2">
        🌍 Global Comparison
      </h3>

      {/* YOU */}
      <div>
        <p className="text-sm mb-1">You ({userEmission.toFixed(0)} kg)</p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getWidth(userEmission)}%` }}
            transition={{ duration: 1 }}
            className={`h-3 rounded-full ${getColor(userEmission)}`}
          />
        </div>
      </div>

      {/* INDIA */}
      <div>
        <p className="text-sm mb-1">India Avg ({data.india} kg)</p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getWidth(data.india)}%` }}
            transition={{ duration: 1 }}
            className="bg-blue-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* GLOBAL */}
      <div>
        <p className="text-sm mb-1">Global Avg ({data.global} kg)</p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getWidth(data.global)}%` }}
            transition={{ duration: 1 }}
            className="bg-red-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* INSIGHT */}
      <div className="text-sm mt-3 font-medium text-gray-600 dark:text-gray-300">
        {getLabel()}
      </div>

    </div>
  );
}