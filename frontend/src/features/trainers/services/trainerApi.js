import axios from "../../../utils/axios";

export const createSession = (data) =>
    axios.post("/trainer/sessions", data);

export const getTrainerSessions = () =>
    axios.get("/trainer/sessions");

export const updateSession = (id, data) => 
    axios.put(`/trainer/sessions/${id}`, data);

export const updateSessionStatus = (id, status) => 
    axios.put(`/trainer/sessions/${id}/status`, { status });

export const getTrainerDashboardStats = () =>
    axios.get("/trainer/dashboard/stats");

export const getAssignedMembers = () =>
    axios.get("/trainer/members");

export const checkInMember = (member_user_id) =>
    axios.post("/trainer/checkin",{ member_user_id});

export const checkOutMember = (member_user_id, notes = null) =>
    axios.post("/trainer/checkout", { member_user_id, notes });
