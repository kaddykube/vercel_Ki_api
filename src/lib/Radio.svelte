<script lang="ts">
  export let group: string | number | undefined;
  export let value: string | number | undefined;
</script>

<label class="border-2 p-2 m-2">
  <input type="radio" bind:group {value} class="" />
  <slot />
</label>
