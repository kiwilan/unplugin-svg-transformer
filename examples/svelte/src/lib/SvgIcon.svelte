<script lang="ts">
  export let name: IconType;
  let svgIcon: string = "";

  async function fetchIcon(icon: IconType): Promise<string> {
    let svg = await window.importIcon(icon);
    return svg.default;
  }
  fetchIcon(name).then((svg) => (svgIcon = svg));
</script>

<div class="icon">{@html svgIcon}</div>

<style>
  .icon {
    width: 2rem;
    height: 2rem;
  }
</style>
