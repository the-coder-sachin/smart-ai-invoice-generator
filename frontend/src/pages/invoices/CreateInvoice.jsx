import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import InputField from "../../ui/InputField";
import TextAreaField from "../../ui/TextAreaField";
import Button from "../../ui/Button";
import { Plus, Trash, Trash2 } from "lucide-react";
import SelectField from "../../ui/SelectField";
import toast from "react-hot-toast";

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formdata, setFormdata] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.phone || "",
        phone: user?.phone || "",
      },
      billTo: {
        clientName: "",
        email: "",
        address: "",
        phone: "",
      },
      items: [
        {
          name: "",
          quantity: 1,
          unitPrice: 0,
          taxPercent: 0,
        },
      ],
      notes: "",
      paymentTerms: "Net 15",
    }
  );

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(
    !existingInvoice
  );
  

  useEffect(() => {
    const aiData = location.state?.aiData;
   
    if (aiData) {
      setFormdata((prev) => ({
        ...prev,
        invoiceDate: new Date(aiData.invoiceDate).toISOString().split("T")[0],
        billTo: {
          clientName: aiData.billTo.name || "",
          email: aiData.billTo.email || "",
          address: aiData.billTo.address || "",
          phone: aiData.billTo.phone || "",
        },
        items: aiData.items || [
          {
            name: "",
            quantity: 1,
            unitPrice: 0,
            taxPercent: 0,
          },
        ],
      }));
    }
    if (existingInvoice) {
      setFormdata({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
        dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
    } else {
      const generateNewInvoiceNumber = async () => {
        setIsGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.INVOICE.GET_ALL_INVOICES
          );
          const invoices = response.data.data;
          let maxNum = 0;
          invoices.forEach((invoice) => {
            const num = parseInt(invoice.invoiceNumber.split("-")[1]);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          });

          const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;

          setFormdata((prev) => ({
            ...prev,
            invoiceNumber: newInvoiceNumber,
          }));
        } catch (error) {
          console.error("Failed to generate Invoice number", error);
          setFormdata((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
          }));
        }
        setIsGeneratingNumber(false);
      };
      generateNewInvoiceNumber();
    }
  }, [existingInvoice]);

  const handleInputChange = (e, section, index) => {
    const { name, value} = e.target;
    if(section){
      setFormdata(prev=> ({...prev, [section] : {...prev[section] , [name]: value }}))
    } else if (index !== undefined){
      const newItems = [...formdata.items];
      newItems[index] = { ...newItems[index], [name]: value};
      setFormdata(prev => ({...prev, items: newItems}));
    } else {
      setFormdata(prev => ({...prev , [name]: value}))
    }

  };

  const handleAddItem = () => {
    setFormdata({
      ...formdata,
      items: [
        ...formdata.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formdata.items.filter((_ , i) => i !== index);
    setFormdata((prev) => ({...prev, items : newItems }))
  };

  const { subTotal, taxTotal, total } = (() => {
    let subTotal = 0,
      taxTotal = 0;
    formdata.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subTotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return { subTotal, taxTotal, total: subTotal + taxTotal };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const itemsWithTotal = formdata.items.map(item => ({
      ...item,
      total: (item.quantity || 0) * (item.unitPrice || 0) * ( 1 + (item.taxPercent || 0) / 100)
    }));
    const finalFormdata = {...formdata , items : itemsWithTotal, subTotal, taxTotal, total};

    if(onSave) {
      await onSave(finalFormdata);
    } else {
      try {
        await axiosInstance.post(
          API_PATHS.INVOICE.CREATE, finalFormdata
        );
        toast.success("Invoice created successfully!");
        navigate("/invoices")
      } catch (error) {
        console.error("Failed to create invoice", error);
        toast.error("Failed to create Invoice.")
      }
    }
    setLoading(false)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-800">
          {existingInvoice ? "Edit Invoice" : "Create Invoice"}
        </h2>
        <Button type="submit" isloading={loading || isGeneratingNumber}>
          {existingInvoice ? "Save Changes" : "Save Invoice"}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm shadow-sky-200 border border-sky-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label={"Invoice Number"}
            name={"invoiceNumber"}
            readOnly
            value={formdata.invoiceNumber}
            placeholder={isGeneratingNumber ? "Generating . . " : ""}
            disabled
          />
          <InputField
            label={"Invoice Date"}
            type="date"
            name={"invoiceDate"}
            value={formdata.invoiceDate}
            onChange={handleInputChange}
          />
          <InputField
            label={"Due Date"}
            type="date"
            name={"dueDate"}
            value={formdata.dueDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-sky-200 border border-sky-100 space-y-4">
          <h3 className="text-lg font-semibold text-sky-900 mb-2">Bill From</h3>
          <InputField
            label={"Buisness Name"}
            name="businessName"
            value={formdata.billFrom.businessName}
            onChange={(e) => {
              handleInputChange(e, "billFrom");
            }}
          />

          <InputField
            label={"Email"}
            name="email"
            type="email"
            value={formdata.billFrom.email}
            onChange={(e) => {
              handleInputChange(e, "billFrom");
            }}
          />

          <TextAreaField
            label={"Address"}
            name="address"
            value={formdata.billFrom.address}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />

          <InputField
            label="Phone"
            name="phone"
            value={formdata.billFrom.phone}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm shadow-sky-200 border border-sky-100 space-y-4">
          <h3 className="text-lg font-semibold text-sky-900 mb-2">Bill To</h3>
          <InputField
            label={"Client Name"}
            name="clientName"
            value={formdata.billTo.clientName}
            onChange={(e) => handleInputChange(e, "billTo")}
          />

          <InputField
            label={"Email"}
            name="email"
            type="email"
            value={formdata.billTo.email}
            onChange={(e) => handleInputChange(e, "billTo")}
          />

          <TextAreaField
            label={"Client Address"}
            name="address"
            value={formdata.billTo.address}
            onChange={(e) => handleInputChange(e, "billTo")}
          />

          <InputField
            label={"Client Phone"}
            name="phone"
            value={formdata.billTo.phone}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
        </div>
      </div>

      <div className="bg-white border border-sky-100 rounded-lg shadow-sm shadow-sky-200 overflow-hidden ">
        <div className="p-4 sm:p-6 border-b border-sky-100 bg-sky-50/40">
          <h3 className="text-lg font-semibold text-sky-900">Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-sky-100">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tax%
                </th>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-2 sm:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-sky-100">
              {formdata.items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-sky-50 transition-all duration-500"
                >
                  <td className="px-2 py-4 sm:px-6">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 px-3 py-2 border border-sky-100 rounded-lg bg-white text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:border-transparent"
                      placeholder="Item name"
                    />
                  </td>
                  <td className="px-2 py-4 sm:px-6">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 px-3 py-2 border border-sky-100 rounded-lg bg-white text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:border-transparent"
                      placeholder="1"
                    />
                  </td>
                  <td className="px-2 py-4 sm:px-6">
                    <input
                      type="number"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 px-3 py-2 border border-sky-100 rounded-lg bg-white text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 py-4 sm:px-6">
                    <input
                      type="number"
                      name="taxPercent"
                      value={item.taxPercent}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 px-3 py-2 border border-sky-100 rounded-lg bg-white text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-800 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-2 py-4 sm:px-6 text-sm text-slate-600">
                    $
                    {(
                      (item.quantity || 0) *
                      (item.unitPrice || 0) *
                      (1 + (item.taxPercent || 0) / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="px-2 py-4 sm:px-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="small"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 sm:p-6 border-t border-sky-200 bg-sky-50/40">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            icon={Plus}
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-sky-200 border border-sky-100 space-y-4">
          <h3 className="text-lg font-semibold text-sky-800 mb-2">
            Notes & Terms
          </h3>
          <TextAreaField
            label={"Notes"}
            name={"notes"}
            value={formdata.notes}
            onChange={handleInputChange}
          />
          <SelectField
            label={"Payment Terms"}
            name={"paymentTerms"}
            value={formdata.paymentTerms}
            onChange={handleInputChange}
            options={["Net 15", "Net 30", "Net 60", "Due on reciept"]}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm shadow-sky-200 border border-sky-100 space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-slate-700">
              <p>Subtotal:</p>
              <p>${subTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-slate-700">
              <p>Tax:</p>
              <p>${taxTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg text-slate-900 font-semibold border-t border-sky-200 pt-4 mt-4">
              <p>Total:</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
