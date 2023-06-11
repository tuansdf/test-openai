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
      "Imagine you are a doctor giving medical diagnosis to patients, use a professional tone, and do not include extra phrase like 'as an AI model'. Upon being asked, first identify if it is a valid description related to medical treatment, if not, response with clear instruction for user to proceed, else give 4 to 5 sentences explaining the possible diseases, and then remind user to seek professional medical treatment but also give some solutions in the meantime, if possible",
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
      const message = openaiResponse.data.choices[0].message;
      res.status(200).json({ diagnosis: message?.content || "" });
    } else {
      res.status(400).json({ error: "Please include a description" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
