/** portals/client/pages/ClientDashboard.jsx */
import { useState } from "react";
import { Car, Plus } from "lucide-react";
import { NewRequestForm } from "../components/NewRequestForm.jsx";
import { ClientJobView } from "../components/ClientJobView.jsx";

const ACTIVE = ["REPORTED", "ASSIGNED", "IN_PROGRESS", "COMPLETED"];

export function ClientDashboard({ onToast, user }) {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const activeJob = requests.find(r => ACTIVE.includes(r.status));

  const handleSuccess = (newReq) => {
    setShowForm(false);
    setRequests(prev => [newReq, ...prev]);
    onToast("Request submitted! We'll assign a technician shortly. 🚗🔧", "success");
  };

  const handleRefresh = () => setRequests(prev => [...prev]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Hello, {firstName} 👋</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {activeJob ? "Tracking your active service request." : showForm ? "Fill in the details below." : "Need roadside help? We're here 24/7."}
        </p>
      </div>

      {showForm ? (
        <NewRequestForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} defaultName={user?.name} defaultPhone={user?.phone} />
      ) : activeJob ? (
        <>
          <ClientJobView request={activeJob} onRefresh={handleRefresh} onToast={onToast} />
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            + Submit another request
          </button>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto">
            <Car size={28} className="text-amber-500" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">No active request</p>
            <p className="text-gray-500 text-sm mt-1">Our certified technicians are ready to help you right now.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            <Plus size={16} /> Request a Technician
          </button>
        </div>
      )}
    </div>
  );
}
