<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { getContext } from "svelte";
  // import { ref } from "svelte";
  import { Display } from "./shared";

  export let name: string;
  export let display: Display = "inline-block";

  const defaultSSR = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><title>${name}</title><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>`;
  // const current = ref(defaultSSR);

  // const { attrs } = getContext("svelte");
  // const attributes = { ...attrs, style: { ...attrs.style } };

  // if (display !== false) {
  //   attributes.style.display = display;
  // }

  async function getSvg() {
    const wd = window as any;
    const icons = wd.iconList as Record<any, Promise<{ default: string }>>;

    let svg = await wd.importIcon(name);
    if (!svg) {
      svg = await icons.default;
    }

    // current.set(svg.default);
  }

  onMount(async () => {
    await getSvg();
  });

  // setContext("svelte", attributes);
</script>

<!-- <span {attributes} innerHTML={current} /> -->
<span />
