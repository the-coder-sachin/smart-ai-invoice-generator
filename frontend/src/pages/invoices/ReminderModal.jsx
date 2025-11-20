import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Check, Copy, Loader2, Mail, X } from "lucide-react";
import TextAreaField from "../../ui/TextAreaField";
import Button from "../../ui/Button";

const ReminderModal = ({isOpen, onClose, invoiceId}) => {
  const [reminderText, setReminderText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(()=>{
    if(isOpen && invoiceId){
      const generateReminder = async () => {
        setLoading(true);
        setReminderText("");
        try {
          const response = await axiosInstance.post(
            API_PATHS.AI.GENERATE_REMINDER, {invoiceId}
          );
          setReminderText(response.data.reminderText);
        } catch (error) {
          toast.error("Failed to generate reminder, please try again later.");
          console.error("Failed to generate AI reminder", error);
          onClose()          
        } finally {
          setLoading(false);
        }
      };
      generateReminder();
    }
  }, [isOpen, invoiceId, onClose]);

  const handleCopyToClipBoard = () => {
    navigator.clipboard.writeText(reminderText);
    setHasCopied(true);
    toast.success("Reminder copied to clipboard!");
    setTimeout(() => {
      setHasCopied(false)
    }, 2000);
  }

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sky-800 flex items-center">
              <Mail className="w-5 h-5 mr-2"/>
              <span>AI-Generated Reminder</span>
            </h3>
            <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
              <X />
            </button>
          </div>
          {
            loading ?
            (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-sky-800"/>
              </div>
            ) : (
              <div className="space-y-4">
                <TextAreaField 
                name="reminderText"
                value={reminderText}
                readOnly 
                rows={10}
                className="text-xs"
                />
              </div>
            )
          }
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button onClick={handleCopyToClipBoard} icon={hasCopied ? Check : Copy} disabled={loading}>
              {hasCopied ? "Copied!" : "Copy Text"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReminderModal