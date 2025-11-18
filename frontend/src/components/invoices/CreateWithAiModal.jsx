import { Cross, Sparkles, Undo, Undo2, Undo2Icon, UndoDot, X } from "lucide-react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import TextAreaField from "../../ui/TextAreaField";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateWithAiModal = ({isOpen, onClose}) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please add some text to generate Invoice.");
      return;
    }
    setLoading(true);
    try {
      const response = axiosInstance.post(
        API_PATHS.AI.PARSE_INVOICE_TEXT, 
        {text}
      );
      const invoiceData = await response.data;
      console.log(invoiceData);
      if(invoiceData){
        toast.success("Invoice data extracted successfully!");
        onClose();
        // navigate to create invoice page with parsed data
        navigate("/invoices/new", { state : { aiData : invoiceData}})
        setText("")
      } else {
        toast.error("Failed to Invoice from Text. Please try again later.", error.message)
      }
    } catch (error) {
      toast.error("Failed to Invoice from Text. Please try again later.")
      console.error("AI parsing error: ", error)
    } finally {
      setLoading(false);
    }
  } 
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sky-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Create Invoice with AI
            </h3>
            <Button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Paste any text that contains Invcoice details like (Client Name,
              Items, Quantity, and Prices) and AI will create Invoice.
            </p>
            <TextAreaField
              name="invoiceText"
              label="Write/Paste your Invoice Text."
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., 'Invoice for ClientCorp: 2 hours of design work at $150/hr and one logo for $500"
              rows={8}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleGenerate} isloading={loading}>
              {loading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWithAiModal