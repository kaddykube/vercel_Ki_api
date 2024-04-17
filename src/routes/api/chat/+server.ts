import OpenAI from "openai";
import { env } from "$env/dynamic/private";
import type { RequestHandler} from "@sveltejs/kit";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY || "",
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();
  console.log(messages);

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: messages[0].content,
    n: 1,
    response_format: "url",
    style: "natural",
  });

  const attachment = {data: image};
  return new Response(JSON.stringify(attachment));;
}) satisfies RequestHandler;
