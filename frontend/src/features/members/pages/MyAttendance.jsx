import { useEffect, useState } from "react";
import { getMemberAttendance } from "../services/memberApi";
import { CalendarDays, Clock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function MyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await getMemberAttendance();
        setAttendance(res.data.attendance || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <p className="p-6 text-white">Loading attendance... </p>
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">My Attendance</h1>
      {attendance.length === 0 ? (
        <p className="text-gray-400">No attendance record found.</p>
      ) : (
        <div className="space-y-4">
          {attendance.map((item) => {
            const isCompleted = !!item.check_out_time;

            return (
              <div 
                key={item.attendance_id}
                className="bg-gray-800 rounded-lg p-5 flex justify-between items-center"
              >
                {/* Left */}
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={18} /> {item.date}  
                  </p>

                  <p className="flex items-center gap-2 text-gray-400" >
                    <Clock size={18} />
                    {item.check_in_time}
                    {item.check_out_time
                      ? ` → ${item.check_out_time}`
                      : " (Checked in)"} 
                  </p> 

                  <p className="flex items-center gap-2 text-gray-400">
                    <User size={18} />
                    {item.trainer_name || "Self Training"}
                  </p>

                  {item.duration_minutes && (
                    <p className="text-gray-500 text-sm">
                      Duration: {item.duration_minutes} mins
                    </p>
                  )}
                </div>  

                {/* Right */}
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    isCompleted
                      ? "bg-green-600/20 text-green-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}
                >
                  {isCompleted ? "Completed" : "In Progress"}  
                </span> 
              </div>   
            );
          })}
        </div>  
      )}
    </div>

  );
}
