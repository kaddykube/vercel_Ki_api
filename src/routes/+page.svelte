<script lang="ts">
  import Spinner from "$lib/spinner.svelte";
  import { blob64 } from "../utils/blob64";
  import Radio from "$lib/Radio.svelte";

  let format = "1024x1024";
  let styleOfImage = "Comic";

  let generatedImage = "";
  let prompt = "";

  let list: {
    base64: string;
    prompt: string;
    caption: string;
  }[] = [];

  $: isLoading = false;

  function downloadImage(index: number) {
    const a = document.createElement("a");
    const blob = blob64(list[index].base64);
    var URL = window.URL.createObjectURL(blob);
    console.log(URL);
    a.href = URL;
    a.download = list[index].prompt + ".png";
    a.click();
  }

  async function generateImage() {
    if (prompt !== "") {
      isLoading = true;

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
              style: styleOfImage,
              format: format,
            },
          ],
        }),
      });

      const data = await response.json();
      console.log(data.data?.data[0]);
      if (data.data?.data[0].b64_json) {
        generatedImage = "data:image/png;base64, " + data.data?.data[0].b64_json;
        list = [
          ...list,
          {
            base64: generatedImage,
            prompt: prompt,
            caption: data.data?.data[0].revised_prompt,
          },
        ];
      }

      if (data) {
        isLoading = false;
        prompt = "";
        generatedImage = "";
      }
    }
  }
</script>

<div
  class="flex flex-col justify-end items-center relative h-[90vh] mt-[5vh] max-w-[600px] ml-[10%] border-white border rounded-2xl bg-gray-50 overflow-hidden"
>
  <div
    class="w-full flex-1 flex flex-col items-center overflow-y-auto"
  >
    {#each list as item, key}
      {#if item.base64}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={item.base64}
          alt="Generated Image"
          class="w-1/2 border rounded-2xl my-2"
        />
        <!-- button bar -->
        <div class="flex flex-row w-full flex-nowrap justify-start px-20 border-2 rounded-2xl mt-2 items-start">
          <div class="flex flex-col ml-10">
            <p>Model:</p>
            <p>dall-e-3</p>
          </div>
          <div class="flex flex-col mr-10">
            <p>Caption:</p>
            <p>{item.caption}</p>
          </div>
          <button
            on:click={() => downloadImage(key)}
            type="button"
            class=" text-white bg-[#adadad] hover:bg-[#663366] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mb-10"
            >export</button
          >
        </div>
      {/if}
    {/each}
    {#if isLoading}
      <Spinner></Spinner>
    {/if}
  </div>
  <div class="w-full mt-10 self-end flex-none border-t-2 mb-2 px-2 bg-white z-100 relative">
    <p class="px-2 mt-1">Format:</p>
    <div class="w-full flex px-2">
      <Radio bind:group={format} value={"1024x1024"}>1024x1024</Radio>
      <Radio bind:group={format} value={"1792x1024"}>1792x1024</Radio>
      <Radio bind:group={format} value={"1024x1792"}>1024x1792</Radio>
    </div>
    <p class="px-2">Style:</p>
    <div class="w-full flex px-2">
      <Radio bind:group={styleOfImage} value={"Comic"}>Comic</Radio>
      <Radio bind:group={styleOfImage} value={"3d Model"}>3D Model</Radio>
      <Radio bind:group={styleOfImage} value={"realistisch"}>Realistisch</Radio>
    </div>
    <p class="px-2">Describe your Image:</p>
    <input
      type="text"
      class=" w-full p-4 text-sm text-gray-900 border border-[#663399] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      placeholder="man on moon"
      bind:value={prompt}
    />
    <button
      on:click={generateImage}
      type="button"
      class="text-white absolute end-3.5 bottom-3.5 bg-[#663399] hover:bg-[#663366] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
      >generate Image</button
    >
  </div>
</div>
