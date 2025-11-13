import { DollarSign, FileText, Loader, Loader2, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );

        const invoices = response.data.data;
        console.log(invoices);
        
        const totalInvoices = invoices.length;
        const totalPaid = invoices
        .filter(invoice => invoice.status === "Paid")
        .reduce((acc, invoice) => acc + invoice.total, 0);
        const totalUnpaid = invoices
        .filter(invoice => invoice.status === "Unpaid")
        .reduce((acc, invoice) => acc + invoice.total, 0);

        setStats({totalInvoices, totalPaid, totalUnpaid});

        setRecentInvoices(
          invoices
          .sort((a,b)=> new Date(b.invoiceDate) - new Date(a.invoiceDate))
          .slice(0,5)
        )
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false)
      }
    };
    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "blue",
    },

    {
      icon: DollarSign,
      label: "Total Paid",
      value: stats.totalPaid.toFixed(2),
      color: "emerald",
    },

    {
      icon: DollarSign,
      label: "Total Unpaid",
      value: stats.totalUnpaid.toFixed(2),
      color: "red",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-sky-100" , text: "text-blue-600"},
    emerald: { bg: "bg-emerald-100" , text: "text-emerald-600"},
    red: { bg: "bg-red-100" , text: "text-red-600"},
  }

  if(loading) {
    return (
      <>
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-800"/>
      </div>
      </>
  )
  }

  return (
    <div className="space-y-8 mb-96 ">
      <div>
        <h2 className="text-xl font-semibold text-blue-900">
          Dashboard
        </h2>
        <p className="text-sm text-gray-600 mt-1">A quick overview of your business Finances.</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-sky-200 shadow-lg shadow-sky-100">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                  colorClasses[stat.color].bg
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${colorClasses[stat.color].text}`}
                />
              </div>
              <div className="ml-4 min-w-0">
                <div className="text-sm font-semibold truncate text-sky-600">{stat.label}</div>
                <div className="text-2xl font-bold break-words">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* All insight cards */}
      {/* Recent Invoices */}
    </div>
  );
};

export default Dashboard;
