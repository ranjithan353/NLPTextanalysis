constAPI_KEY = "weqJfOljvOGCDtwgVYgFD1bmmorCs4wnJmoMc4uYO39e";
const SCORING_URL = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/3587c96f-0213-456c-b5df-677b6b239a4b/predictions?version=2021-05-01";
const TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";

// Function to get IAM token
async function getToken() {
    try {
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": API_KEY
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting token:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Endpoint to handle prediction
app.post("/predict", async (req, res) => {
    const inputData = req.body;

    if (!inputData || !inputData.values) {
        return res.status(400).json({ error: "Invalid input data format" });
    }

    try {
        const token = await getToken();
        const payload = {
            input_data: [{
                fields: ["Name", "Author", "UserRating", "Reviews", "Price", "Year", "Genre", "CustomerReviews"],
                values: inputData.values
            }]
        };

        const response = await axios.post(SCORING_URL, payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error during prediction:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to get prediction" });
    }
});
