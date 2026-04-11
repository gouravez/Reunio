import React from "react";
import { Plus, User } from "lucide-react";
import { APP_CONFIG } from "../../utils/constants";
import {Loader} from "lucide-react";

const ActionCard = ({ onCreateSession, onJoinSession, creating }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:translate-y-1 border border-gray-100">
        <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl mb-6 mx-auto">
          <Plus className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.TITLE}
        </h3>

        <p className="text-gray-600 mb-6 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.DESCRIPTION}
        </p>

        <button
          onClick={onCreateSession}
          disabled={creating}
          className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:[1.02]"
        >
          {creating ? (
            <span className="flex items-center justify-center">
              <Loader />
              {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.BUTTON_LOADING}
            </span>
          ) : (
            APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.HOST.BUTTON
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:translate-y-1 border border-gray-100">
        <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl mb-6 mx-auto">
          <User className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.JOIN.TITLE}
        </h3>

        <p className="text-gray-600 mb-6 text-center">
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.JOIN.DESCRIPTION}
        </p>

        <button
          onClick={onJoinSession}
          className="w-full px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:[1.02]"
        >
          {APP_CONFIG.DASHBOARD_CONTENT.ACTION_CARDS.JOIN.BUTTON}
        </button>
      </div>
    </div>
  );
};

export default ActionCard;
