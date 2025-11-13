import { GoogleGenAI } from "@google/genai";
import Invoice from "../models/invoice.model.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const parseInvoiceFromText = async (req, res) => {
  console.log(req.body);

  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid 'text' in request body",
      data: null,
    });
  }

  const prompt = `
    You are a smart invoice parser. Extract the following fields from the invoice text below:
    - invoiceNumber
    - invoiceDate
    - dueDate
    - billFrom (name, address, email, phone)
    - billTo (name, address, email, phone)
    - items (description, quantity, unitPrice, taxPercent)
    - notes
    - paymentTerms

    Respond in *strict JSON format* only, without any explanation or extra text.



    Here is the text to parse:
    --- TEXT START ---
    ${text}
    --- TEXT END ---
    extract the data and provide only JSON object
    `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text;

    if (typeof responseText !== "string") {
      if (typeof response.text === "function") {
        responseText = response.text();
      } else {
        throw new Error("Could not extract text from AI response");
      }
    }

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const paresedData = JSON.parse(cleanedJson);

    res.status(200).json(paresedData);
  } catch (err) {
    console.error("AI parse error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to parse invoice from text",
      data: null,
    });
  }
};

export const getReminderEmail = async (req, res) => {
  const invoiceId = req.body.invoiceId;

  if (!invoiceId) return res.status(400).json({ error: "Missing 'invoiceId'" });

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice)
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
        data: null,
      });

    const prompt = `
    Generate a polite payment reminder email for the following invoice:
    ${JSON.stringify(invoice, null, 2)}

    The email should include:
    - Invoice number
    - Due date
    - Amount due
    - Call to action for payment

    Respond with the email only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
        reminderText: response.text,
    });
  } catch (err) {
    console.error("Email generation error:", err);
    res.status(500).json({ error: "Failed to generate reminder email" });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (!invoices || !Array.isArray(invoices) || invoices.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'invoices' array in request body" });
    }

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "paid"
    );
    const unpaidInvoices = invoices.filter(
      (invoice) => invoice.status !== "paid"
    );
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalOutstanding = unpaidInvoices.reduce(
      (acc, inv) => acc + inv.total,
      0
    );

    const dataSummary = `
        - Total number of Invoices : ${totalInvoices}
        - Total paid Invoices : ${paidInvoices.length}
        - Total unpaid/pending Invoices : ${unpaidInvoices.length}
        - Total revenue from paid Invoices : ${totalRevenue.toFixed(2)}
        - Total outstanding amount from unpaid/pending Invoices : ${totalOutstanding.toFixed(
          2
        )}
        - Recent 5 invoices: ${invoices
          .splice(0, 5)
          .map(
            (inv) =>
              `Invoice #${inv.invoiceNumber} for ${inv.total.toFixed(
                2
              )} with status ${inv.status}`
          )
          .join(", ")}        

        `;

    const prompt = `
           you are friendly and insightful financial analyst for a small business owner,
           based on the following summary of their invoice data, provide 2-3 concise and actionale insights,
           each insight should be a short string in JSON array.
           the insight should be encouraging and helpful. Do not just repeat the data.
           for example, if there is high outstanding amount, suggest sending reminders. If revenue is high, be encouraging.
           
           data summary: ${dataSummary}

           Return a valid JSON object with a single key "insights" which is an array of strings.
           Example format: { "insights" : ["Your revenue is looking strong this month!", "You have 5 overdue invoices,Consider sending reminders to get paid faster"]}
          `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response) {
      return res.status(400).json({
        message: "Unable to generate summary!",
      });
    }

    const responseText = response.text;
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json({
      success: true,
      message: "Summary generated!",
      data: parsedData,
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to generate dashboard summary" });
  }
};
