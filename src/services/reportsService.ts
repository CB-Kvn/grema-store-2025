import api from "./api";

export const reportsService = {
  getOverview: async (lapseTime:string) => {
    const response = await api.get('/reports/overview',{
        params: {
            period: lapseTime,
        },  
    });
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get(`/reports/summary`);
    return response.data;
  },



};