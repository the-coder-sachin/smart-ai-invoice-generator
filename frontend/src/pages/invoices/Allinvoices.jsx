import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useMemo } from "react";
import {
  AlertCircle,
  Edit,
  FileText,
  Loader2Icon,
  Mail,
  Plus,
  Search,
  Sparkles,
  Trash,
  Trash2,
} from "lucide-react";
import Button from "../../ui/Button";
import CreateWithAiModal from "../../components/invoices/CreateWithAiModal";
import ReminderModal from "./ReminderModal";
import moment from "moment";
import { formatIndianCurrency } from "../../utils/helper";

const Allinvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        setInvoices(
          response?.data?.data.sort(
            (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
          )
        );
      } catch (error) {
        setError("Failed to fetch Invoices!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {};

  const handleStatusChange = async (invoice) => {};

  const handleOpenReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(
        (invoice) => statusFilter === "All" || invoice.status === statusFilter
      )
      .filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.billTo.clientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
  }, [invoices, searchTerm, statusFilter]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2Icon className="w-8 h-8 animate-spin text-sky-800" />
      </div>
    );

  return (
    <div className="space-y-6">
      <CreateWithAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-sky-800 ">All Invoices</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage all your Invoices at one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsAiModalOpen(true)}
            icon={Sparkles}
          >
            Create with AI
          </Button>
          <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
            Create new Invoice
          </Button>
        </div>
      </div>
      {error && (
        <div className="p-4 rounded-lg bg-red-100 border border-red-200 ">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 mr-3 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-500 mb-1">Error:</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-sky-200 shadow-sm shadow-sky-100 rounded-lg">
        <div className="p-4 sm:p-6 border-b border-sky-200 bg-sky-50/40">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Invoice Id or Client Name"
                className="w-full h-10 pl-10 pr-4 py-2 border border-sky-100 rounded-lg bg-white text-slate-700 placeholder:slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select
                className="w-full sm:w-auto h-10 px-3 py-2 border border-sky-200 rounded-lg bg-white text-sm text-shadow-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">UnPaid</option>
              </select>
            </div>
          </div>
        </div>
        {filteredInvoices?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-sky-700" />
            </div>
            <h3 className="text-lg text-slate-600 font-medium mb-2">
              No Invoices Found.
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md">
              Your Search or Filter criteria did not match any Invoices. Try
              searching by Id or Client Name.
            </p>
            {invoices.length === 0 && (
              <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
                Create First Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="w-[90vw] md:w-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-200">
              <thead className="bg-sky-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-slate-600 uppercase tracking-wider">
                    Invoice#
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-slate-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-slate-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-slate-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-sky-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-sky-50">
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 cursor-pointer"
                    >
                      {invoice.invoiceNumber}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 cursor-pointer"
                    >
                      {invoice.billTo.clientName}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 cursor-pointer"
                    >
                      {formatIndianCurrency(invoice.total)}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 cursor-pointer"
                    >
                      {moment(invoice.dueDate).format("DD-MM-YYYY")}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : invoice.status === "Pending"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <div
                        className="flex items-center justify-start gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => handleStatusChange(invoice)}
                          isloading={statusChangeLoading === invoice._id}
                        >
                          {invoice.status === "Paid"
                            ? "Mark Unpaid"
                            : "Mark Paid"}
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => navigate(`/invoices/${invoice._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() =>
                            handleDelete(`/invoices/${invoice._id}`)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {invoice.status !== "Paid" && (
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleOpenReminderModal(invoice._id)}
                            title={"Generate Reminder"}
                          >
                            <Mail className="w-4 h-4 text-sky-800" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allinvoices;
