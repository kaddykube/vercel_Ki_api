<script lang="ts">
  import Spinner from "$lib/spinner.svelte";
  import { blob64 } from "../utils/blob64";
  let generatedImage = "";
  let prompt = "";

  let list: {
    base64: string;
    prompt: string;
  }[] = [];

  $: isLoading = false;

  function downloadImage(index: number) {
    const a = document.createElement("a");
    const blob = blob64(list[index].base64);
    var URL = window.URL.createObjectURL(blob);
    a.href = URL;
    // list last
    a.download = list[index].prompt + ".png";
    a.click();
  }

  async function generateImage() {
    // find out which format
    isLoading = true;

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.data?.data[0].b64_json) {
      generatedImage = "data:image/png;base64," + data.data?.data[0].b64_json;
      list = [...list, { base64: generatedImage, prompt: prompt }];
    }

    if (data) {
      isLoading = false;
      prompt = "";
      generatedImage = "";
    }
  }
</script>

<div
  class="flex flex-col justify-end items-center relative h-[90vh] mt-[5vh] max-w-[600px] ml-[10%] border-white border rounded-lg bg-gray-50"
>
  <div
    class="w-full flex-1 flex flex-col items-center justify-center overflow-y-auto"
  >
    {#each list as item, key}
      {#if item.base64}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={item.base64}
          alt="Generated Image"
          class="w-1/2 border rounded-lg"
        />
        <!-- button bar -->
        <div class="flex flex-row w-full justify-end px-20">
          <button
            on:click={() => downloadImage(key)}
            type="button"
            class=" text-white bg-[#adadad] hover:bg-[#663366] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mb-10"
            >export</button
          >
        </div>
      {/if}
    {/each}
  </div>
  {#if isLoading}
    <Spinner></Spinner>
  {/if}
  <div class="w-full mt-10 self-end flex-none">
    <input
      type="text"
      class=" w-full p-4 text-sm text-gray-900 border border-[#663399] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      placeholder="man on moon"
      bind:value={prompt}
    />
    <button
      on:click={generateImage}
      type="button"
      class="text-white absolute end-2.5 bottom-2.5 bg-[#663399] hover:bg-[#663366] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
      >generate Image</button
    >
  </div>
</div>
