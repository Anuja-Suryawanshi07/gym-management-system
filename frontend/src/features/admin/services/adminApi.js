import axios from "../../../utils/axios";

export const getMembershipRequests = () =>
  axios.get("/admin/membership-requests");

export const updateMembershipRequestStatus = (id, status) =>
  axios.put(`/admin/membership-requests/${id}`, { status });

export const deleteMember = (userId) =>
  axios.delete(`/admin/members/${userId}`);

export const getMembers = () =>
  axios.get("/admin/members");

export const getMemberById =(id) =>
  axios.get(`/admin/members/${id}`);

export const getTrainers = () => axios.get("/admin/trainers");
export const getPlans = () => axios.get("/admin/plans");

export const assignTrainerAndPlan = (userId, trainerId, planId) =>
  axios.put(`/admin/members/${userId}`, {
    assigned_trainer_id: trainerId,
    current_plan_id: planId
  });

export const updateMemberStatus = (userId, status) =>
  axios.put(`/admin/members/${userId}/status`, {
    membership_status: status
  });  