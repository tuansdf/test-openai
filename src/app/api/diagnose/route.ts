import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

const defaultMessages: Message[] = [
  {
    role: "system",
    content:
      "1. Generate a detailed list of possible diseases and their preventive measures. 2. Avoid mentioning that you are an AI in the response. 3. Remind the user to seek professional care for a proper diagnosis and personalized advice.",
  },
];

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const diagnoseMessages = [...defaultMessages, ...messages];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: diagnoseMessages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
