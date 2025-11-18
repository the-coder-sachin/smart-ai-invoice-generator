import { DollarSign, File, FileText, IndianRupee, Loader, Loader2, Loader2Icon, Plus } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Button from "../../ui/Button";
import AiInsightCard from "../../ui/AiInsightCard";
import moment from "moment";
import { formatIndianCurrency } from "../../utils/helper";

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
      icon: IndianRupee,
      label: "Total Paid",
      value: formatIndianCurrency(stats.totalPaid.toFixed(2)),
      color: "emerald",
    },

    {
      icon: IndianRupee,
      label: "Total Unpaid",
      value: formatIndianCurrency(stats.totalUnpaid.toFixed(2)),
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
    <div className="space-y-8">
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
      <AiInsightCard/>
      {/* Recent Invoices */}
      <div className="w-full bg-white border border-sky-200 rounded-lg shadow-lg shadow-sky-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-sky-300 bg-sky-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-sky-700">
            Recent Invoices
          </h3>
          <Button variant={"ghost"} onClick={()=>navigate("/invoices")}>
            View All
          </Button>
        </div>
        {recentInvoices.length > 0 ? (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="w-full min-w-[600px] divide-y divide-sky-200">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-sky-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-sky-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-sky-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-sky-700 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sky-200">
                {recentInvoices.map(invoice => (
                  <tr key={invoice._id}
                  onClick={()=> navigate(`/invoices/${invoice._id}`)}
                  className="hover:bg-sky-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-sky-700">
                        {invoice.billTo.clientName}
                      </div>
                      <div className="text-sm text-sky-500">
                        #{invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === "Paid" ? "bg-emerald-100 text-emerald-800" : invoice.status === "Pending" ? "bg-amber-100 text-amber-500" : "bg-red-100 text-red-600" }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-500">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ): (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-sky-800 "/>
            </div>
            <h3 className="text-lg font-medium text-sky-700 mb-2">No Invoices yet</h3>
            <p className="text-slate-400 mb-6 max-w-md">You haven't created Invoices yet. Get started by creating your First Invoice.</p>
            <Button onClick={()=> navigate("/invoices/new")} icon={Plus}>
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
