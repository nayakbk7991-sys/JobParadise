
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const { default: express } = await import("express");
const { default: cookieParser } = await import("cookie-parser");
const { default: cors } = await import("cors");
const { default: connectDB } = await import("./config/db.js");
const { default: userRoute } = await import("./routes/user.route.js");
const { default: companyRoute } = await import("./routes/company.route.js");
const { default: jobRoute } = await import("./routes/job.route.js");
const { default: applicationRoute } = await import("./routes/application.route.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log("Server running at port " + PORT);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
