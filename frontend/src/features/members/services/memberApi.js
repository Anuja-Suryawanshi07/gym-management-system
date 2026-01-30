import axios from "../../../utils/axios";

export const getMemberProfile = () =>
    axios.get("/member/profile");

export const getMemberSessions = () =>
    axios.get("/member/sessions");

export const getMemberAttendance = () =>
    axios.get("/member/attendance");

export const getMemberPayments = () =>
    axios.get("/member/payments");

export const renewMembership = () =>
    axios.post("/member/renew");
