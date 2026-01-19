import axios from "../../../utils/axios";

export const createSession = (data) =>
    axios.post("/trainer/sessions", data);

export const getTrainerSessions = () =>
    axios.get("/trainer/sessions");