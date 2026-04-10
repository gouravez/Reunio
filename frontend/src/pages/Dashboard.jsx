import { useAuth } from "../context/AuthContext";
import { useSession } from "../context/SessionContext";
import { ROUTES } from "../utils/constants";

import { CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import WelcomeSection from "../components/Dashboard/WelcomeSection";
import ActionCard from "../components/Dashboard/ActionCard";
import SessionList from "../components/Dashboard/SessionList";
import FeaturesGrid from "../components/Dashboard/FeaturesGrid";

const Dashboard = () => {
  const { user } = useAuth();
  const { createSession, listSessions, error, loading } = useSession();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCreateSession = async () => {
    setCreating(true);
    const result = await createSession();
    if (result.success) {
      navigate(`${ROUTES.HOST}?roomId=${result.session.roomId}`);
    }
    setCreating(false);
  };

  useEffect(() => {
    const load = async () => {
      const result = await listSessions(statusFilter);
      if (result.success) {
        setSessions(result.sessions);
      }
    };
    load();
  }, [listSessions, statusFilter]);

  const handleRejoinSession = (session) => {
    if (session.status === "active") {
      if (session.isHost) {
        navigate(`${ROUTES.HOST}?roomId=${session.roomId}`);
      } else {
        navigate(`${ROUTES.JOIN}?roomId=${session.roomId}`);
      }
    }
  };

  const handleJoinSession = () => {
    navigate(ROUTES.JOIN);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WelcomeSection username={user?.name} />

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CircleAlert className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        <ActionCard
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          creating={creating}
        />

        <FeaturesGrid />

        <SessionList
          sessions={sessions}
          loading={loading}
          onRejoinSession={handleRejoinSession}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </main>
    </div>
  );
};

export default Dashboard;
