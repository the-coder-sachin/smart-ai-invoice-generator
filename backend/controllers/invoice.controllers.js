import Invoice from "../models/invoice.model.js";

// @route   POST api/invoices/
// @desc    Generate invoice
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const user = req.user;

    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice items are required",
        data: null,
      });
    }

    let subTotal = 0;
    let taxTotal = 0;
    items.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      subTotal += itemTotal;
      taxTotal += (itemTotal * (item.taxPercent || 0)) / 100;
    });

    const total = subTotal + taxTotal;

    const invoice = new Invoice({
      user,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subTotal,
      taxTotal,
      total,
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
    });
  }
};

// @route   GET api/invoices/
// @desc    Get all invoices
// @access  Private
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate("user", "email name");

    res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      data: invoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
    });
  }
};

// @route   GET api/invoices/:id
// @desc    Get single invoice by ID
// @access  Private
export const getInvoiceById = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.user.id);

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("user", "name email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
        data: null,
      });
    }
    
    // check if user is authorized to access the invoice
    if(invoice.user._id.toString() !== req.user.id){
      
        return res.status(404).json({
        success: false,
        message: "Not authorized",
        data: null,
        });

    }

    res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
    });
  }
};

// @route   PUT api/invoices/:id
// @desc    Update invoice
// @access  Private
export const updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      status,
      paymentTerms,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice items are required",
        data: null,
      });
    }

    let subTotal = 0;
    let taxTotal = 0;
    items.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      subTotal += itemTotal;
      taxTotal += (itemTotal * (item.taxPercent || 0)) / 100;
    });

    const total = subTotal + taxTotal;

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        invoiceNumber,
        invoiceDate,
        dueDate,
        billFrom,
        billTo,
        items,
        notes,
        status,
        paymentTerms,
        subTotal,
        taxTotal,
        total,
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
    });
  }
};

// @route   DELETE api/invoices/:id
// @desc    Delete invoice
// @access  Private
export const deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
      data: deletedInvoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
    });
  }
};
