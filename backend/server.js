import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js"
import invoiceRouter from "./routes/invoice.routes.js"
import aiRouter from "./routes/ai.routes.js"

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.send("SMART AI INVOICE")
});

// api routes

app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/ai", aiRouter);

app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})
