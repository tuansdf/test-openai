import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type ResponseData =
  | {
      diagnosis: string;
    }
  | {
      error: string;
    };

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const messages: Message[] = [
  {
    role: "system",
    content:
      "1. Generate a detailed list of possible diseases and their preventive measures. 2. Avoid mentioning that you are an AI in the response. 3. Remind the user to seek professional care for a proper diagnosis and personalized advice.",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const { description } = req.body as { description: string };
    if (description) {
      const diagnoseMessages = [
        ...messages,
        { role: "user", content: description } as Message,
      ];
      const openaiResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: diagnoseMessages,
      });
      console.log(openaiResponse.data.usage);
      const message = openaiResponse.data.choices[0].message;
      res.status(200).json({ diagnosis: message?.content || "" });
    } else {
      res.status(400).json({ error: "Please include a description" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
