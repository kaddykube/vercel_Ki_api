import type { RequestHandler} from "@sveltejs/kit";
import { ReplicateStream, StreamingTextResponse } from 'ai';
import Replicate from 'replicate';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
import { REPLICATE_API_TOKEN } from '$env/static/private';

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();
  console.log(messages);

  const response = await replicate.predictions.create({
    stream: true,
    version: '7b3212fbaf88310cfef07a061ce94224e82efc8403c26fc67e8f6c065de51f21',
    input: {
      prompt: experimental_buildOpenAssistantPrompt(messages),
    },
  });

  const stream = await ReplicateStream(response);

  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;