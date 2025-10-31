import { build } from "esbuild";

async function main() {
  await build({
    entryPoints: ["./src/cli.ts"],
    bundle: true,
    sourcemap: "inline",
    platform: "node",
    target: "node22",
    format: "cjs",
    outfile: "bundle.cjs",
    logLevel: "info",
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
