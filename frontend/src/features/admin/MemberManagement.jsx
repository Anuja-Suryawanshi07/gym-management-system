import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Filter,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState("false");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // New Member From State

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    membership_type: "Monthly",
    status: "Active",
  });

  // Fetch members from backend on load
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7000/api/users/members");
      const data = await response.json();
      if (response.ok) {
        setMembers(data.members || []);
      } else {
        throw new Error(data.message || "Failed to fetch members");
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:7000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "Member" }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: "success", message: "Member added successfully!" });
        setModalOpen(false);
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          membership_type: "Monthly",
          status: "Active",
        });
        fetchMembers(); // Refresh list
      } else {
        throw new Error(data.message || "Error creating member");
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/*Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Member Directory
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Manage and monitor your gym community
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus size={20} />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Members</p>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-3xl font-black text-gray-800">{members.length}</span>
            <span className="text-green-500 text-xs font-bold mb-1">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Now</p>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-3xl font-black text-gray-800">42</span>
            <div className="h-2 w-2 rounded-full bg-green-500 mb-2 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pending Renewals</p>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-3xl font-black text-gray-800">7</span>
            <span className="text-orange-500 text-xs font-bold mb-1">Attention</span>
          </div>
        </div>
      </div>


    {/* Filters & Search */}
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-100 rounded-xl text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all">
            <Filter size={16} />
            <span>Filters</span>
        </button>
    </div>

    {/* Main Table */}

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4 size={40}" />
                <p className="text-gray-400 font-medium">Fetching member records...</p>
            </div>
        ):(
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                        <tr>
                            <th className="px-6 py-4">Member</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredMembers.length > 0 ? filteredMembers.map((member) =>(
                        <tr key={member.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                        {member.full_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{member.full_name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: #{member.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-1">
                                    <div className="flex items-center text-xs text-gray-500 font-medium">
                                        <Mail size={12} className="mr-1.5" /> {member.email}
                                    </div>
                                    {member.phone && (
                                        <div className="flex items-center text-xs text-gray-500 font-medium">
                                        <Phone size={12} className="mr-1.5" /> {member.phone}
                                        </div>    
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-lg">
                        {member.membership_type || 'Monthly'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${
                        member.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {member.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <Users className="mx-auto text-gray-200 mb-4" size={48} />
                      <p className="text-gray-400 font-medium">No members found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Add New Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="tel"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Membership Plan</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all appearance-none font-medium text-gray-700"
                  value={formData.membership_type}
                  onChange={(e) => setFormData({...formData, membership_type: e.target.value})}
                >
                  <option value="Monthly">Monthly Pack</option>
                  <option value="Quarterly">Quarterly (3 Months)</option>
                  <option value="Annual">Annual (12 Months)</option>
                  <option value="Premium">Premium VIP</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={actionLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] mt-4"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={24} /> : <span>Confirm & Add Member</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Feedback Toasts */}
      {feedback.message && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-white font-bold animate-in slide-in-from-bottom-10 z-[100] ${
          feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({type: '', message: ''})} className="ml-4 opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;