<script lang="ts">
  import { importSvg } from "unplugin-svg-transformer/icons";
  import SvgIcon from "./lib/SvgIcon.svelte";

  let render: string = "";
  async function getIcon(icon: SvgName) {
    render = await importSvg(icon);
  }
  getIcon("download");
</script>

<main>
  <span>{@html render}</span>
  <SvgIcon name={"download"} />
</main>
