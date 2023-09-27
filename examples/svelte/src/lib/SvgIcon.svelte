<script lang="ts">
  import { importSvg } from "unplugin-svg-transformer/icons";

  export let name: SvgType;
  let svgIcon: string = "";

  async function fetchIcon(icon: SvgType): Promise<string> {
    return await importSvg(icon);
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
