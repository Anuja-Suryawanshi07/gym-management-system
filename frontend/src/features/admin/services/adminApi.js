import axios from "../../../utils/axios";

export const getMembershipRequests = () =>
    axios.get("/admin/membership-requests");

export const updateMembershipRequestStatus = (id, status) =>
    axios.put(`/admin/membership-requests/${id}`, { status });