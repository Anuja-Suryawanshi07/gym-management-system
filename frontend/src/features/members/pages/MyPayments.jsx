import { useEffect, useState } from "react";
import { getMemberPayments } from "../services/memberApi";
import { CalendarDays, IndianRupee, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getMemberPayments();
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <p className="p-6 text-white">Loading Payments...</p>
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">My Payments</h1>
      {payments.length === 0 ? (
        <p className="text-gray-400">No payment history found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.payment_id}
              className="bg-gray-800 rounded-lg p-5 flex justify-between items-center"
            >

              {/* Left */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                {payment.plan_name || "Membership Payment"}  
              </h2>  

              <p className="flex items-center gap-2">
                <IndianRupee size={18} />
                {payment.amount}
              </p>

              <p className="flex items-center gap-2 text-gray-400">
                <CalendarDays size={18} />
                {new Date(payment.payment_date).toLocaleDateString()}
              </p>

              <p className="flex items-center gap-2 text-gray-400">
                <CreditCard size={18} />
                {payment.payment_method}
              </p>
            </div>    

            {/* Right - Status */}

            <span 
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                payment.status === "success"
                ? "bg-green-600/20 text-green-400"
                : payment.status === "pending"
                ? "bg-yellow-600/20 text-yellow-400"
                : "bg-red-600/20 text-red-400"
              }`}
            >
              {payment.status}  
            </span>  
          </div>    
          
        ))}
      </div>
      )}
    </div>
  );
}