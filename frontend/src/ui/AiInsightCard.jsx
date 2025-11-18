import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Lightbulb } from "lucide-react";

const AiInsightCard = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );

        const insights = response?.data?.data?.insights ?? [];
        setInsights(insights);
      } catch (error) {
        console.error("Failed fetching Invoices Insights", error);
        setErrorMessage(error.response.data.error)
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-sm shadow-sky-100">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-300 mr-3" />
        <h3 className="text-lg font-semibold text-sky-800">AI Insights</h3>
      </div>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gradient-to-br from-sky-300 to-sky-100 rounded w-3/4"></div>
          <div className="h-4 bg-gradient-to-br from-sky-300 to-sky-100 rounded w-5/6"></div>
          <div className="h-4 bg-gradient-to-br from-sky-300 to-sky-100 rounded w-1/2"></div>
        </div>
      ) : insights.length > 0 ? (
        <ul className="space-y-3 list-disc list-inside text-slate-600 ml-3">
          {insights.map((insight, index) => (
            <li key={index} className="text-sm">
              {insight}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc list-inside">
          <li className="text-slate-600 text-sm text-center">
            {errorMessage || "No data available to generate Insights!"}
          </li>
        </ul>
      )}
    </div>
  );
};

export default AiInsightCard;
