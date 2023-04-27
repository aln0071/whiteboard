require("dotenv").config();
const express = require("express");
const { getErrorMessage } = require("./utils");
const app = express();
const port = process.env.PORT || 3000;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());

app.get("/api/v1/chatgpt", (req, res) => {
  res.json({
    msg: "chat-gpt",
  });
});

app.post("/api/v1/chatgpt/prompt", async (req, res, next) => {
  const model = "text-davinci-003";
  const { prompt } = req.body;
  try {
    const response = await openai.createCompletion({
      model,
      prompt,
      temperature: 0,
      max_tokens: 2000,
    });
    const choice = response.data.choices[0];
    res.send({
      data: choice.text,
    });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(500);
  console.trace(err);
  res.json({ error: getErrorMessage(err) });
});

app.listen(port, () => console.log(`[chatgpt] listening on port ${port}`));
