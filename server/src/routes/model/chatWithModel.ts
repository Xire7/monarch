import express from 'express';
import axios from "axios";
const router = express.Router()
router.post("/model/adjust", async (req, res) => {
  const { userMessage, resultObjectName } = req.body;
  try {
    const modelResponse = await axios.post(`http://${process.env.MODEL_SERVER}/adjust-result`, {
      instruction: userMessage,
      resultObjectName,
    });
    res.json({ updatedResult: modelResponse.data.resultObjectName }); //respond with adjusted result
  } catch (error) {
    console.error("Error adjusting model results:", error);
    res.status(500).json({ error: "Failed to adjust model results" });
  }
});

export default router;