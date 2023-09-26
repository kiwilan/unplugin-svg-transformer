<script lang="ts">
  import { importIcon } from "unplugin-svg-transformer/icons";
  import SvgIcon from "./lib/SvgIcon.svelte";

  let render: string = "";
  async function getIcon(icon: IconType) {
    let svg = await importIcon(icon);
    render = svg.default;
  }
  getIcon("download");
</script>

<main>
  <span>{@html render}</span>
  <SvgIcon name={"download"} />
</main>
