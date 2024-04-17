<script lang="ts">
  import Spinner from "$lib/spinner.svelte";
  let generatedImage = "";
  let prompt = "";

  $: isLoading = false;

  function downloadImage() {
    console.log(generatedImage);
    /// create blob / utils
    // show blob
    // download dialog
  }

  async function generateImage() {
    // find out which format
    console.log(prompt);
    isLoading = true;

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data) {
      isLoading = false;
      prompt = "";
    }
    if (data.data?.data[0].url) {
      console.log(data.data?.data[0]);
      generatedImage = data.data?.data[0].url;
    }
  }
</script>

<div class="flex flex-col justify-centeritems-center h-full m-20">
  <div class="flex flex-col justify-center items-center h-fit relative m-2">
    {#if generatedImage}
   <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={generatedImage} alt="Generated Image" class="w-1/2 border rounded-lg" />
       <!-- button bar -->
        <button
        on:click={downloadImage}
        type="button"
        class="text-white absolute end-2.5 bottom-2.5 bg-[#adadad] hover:bg-[#663366] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >export</button
      >
    {:else}
      <div
        class="flex flex-col items-center justify-center absolute text-[#663399] w-1/2"
      >
      </div>
    {/if}
    {#if isLoading}
      <Spinner></Spinner>
    {/if}
  </div>
  <div class="w-full self-end relative">
    <input
      type="text"
      class="block w-full p-4 ps-10 text-sm text-gray-900 border border-[#663399] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
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
