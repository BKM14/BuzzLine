// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./src/app/**/*.tsx",
    "./public/index.html",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/*/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
};


export default config;
