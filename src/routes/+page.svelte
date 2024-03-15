<script>
  let result = "";
  let input = "";

  function handleSubmit() {
    getStream();
  }

  async function getStream() {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: input }],
      }),
    });
    console.log('r:',response);

   const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    while (true) {
      // @ts-ignore
      const { value, done } = await reader?.read();
      console.log("response:", done, value);
      if (done) break;
      result += `${value}<br>`;
    } 
  }
</script>

<section>
  <p class="w-full p-20">{@html result}</p>
</section>
<form on:submit={handleSubmit}>
  <input bind:value={input} />
  <button type="submit">Send</button>
</form>
