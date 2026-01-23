import axios from "../../../utils/axios";

export const getAssignedMembers = () =>
    axios.get("/trainer/members");

export const checkInMember = (member_id) =>
    axios.post("/trainer/checkin", { member_id });

export const checkOutMember = (member_id, notes) =>
    axios.post("/trainer/checkout", { member_id, notes });