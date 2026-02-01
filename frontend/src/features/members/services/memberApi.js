import axios from "../../../utils/axios";

export const getMyPlan = () =>
    axios.get("/member/plan");

export const getMemberProfile = () =>
    axios.get("/member/profile");

export const getMySessions = () =>
    axios.get("/member/sessions");

export const getMemberAttendance = () =>
    axios.get("/member/attendance");

export const getMemberPayments = () =>
    axios.get("/member/payments");

export const renewMembership = () =>
    axios.post("/member/renew");
