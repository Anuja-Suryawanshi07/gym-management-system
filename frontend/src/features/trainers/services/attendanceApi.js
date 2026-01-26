import axios from "../../../utils/axios";

export const getAssignedMembers = () =>
    axios.get("/trainer/members");

export const checkInMember = (memberId) =>
    axios.post("/trainer/checkin", {member_id:memberId,
 });

export const checkOutMember = (memberId) =>
    axios.post("/trainer/checkout", {member_id:memberId,
});