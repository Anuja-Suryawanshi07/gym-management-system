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

export const updateMembershipDates = (userId, dates) =>
  axios.put(`/admin/members/${userId}/membershipdate`, {
    membership_start_date: dates.startDate,
    membership_end_date: dates.endDate
  });

  export const sendPaymentReminder = (userId) =>
    axios.post(`/admin/ members/${userId}/remind-payment`);

  export const getAllTrainers = () =>
    axios.get("/admin/trainers");

  export const getTrainerById = (id) =>
    axios.get(`/admin/trainers/${id}`);

  export const createTrainer = (data) =>
    axios.post("/admin/trainers", data);

  export const updateTrainer = (id, data) =>
    axios.put(`/admin/trainers/${id}`, data);

  export const deleteTrainer = (id) =>
    axios.delete(`/admin/trainers/${id}`);