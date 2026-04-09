import React from "react";
import { APP_CONFIG } from "../../utils/constants";
import { Video, MessageCircle, Shield, Users } from "lucide-react";

const FeaturesGrid = () => {
  const iconMap = {
    Video: Video,
    Comments: MessageCircle,
    ShieldAlt: Shield,
    Users: Users,
  };

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  const features = APP_CONFIG.FEATURES.slice(0, 4);
  return (
    <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => {
        const Icon = iconMap[feature.icon];
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div
              className={`w-16 h-16${colorMap[feature.color]} rounded-lg flex items-center justify-center mb-4`}
            >
              {Icon && <Icon className="h-6 w-6" />}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {feature.title}
            </h4>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturesGrid;
