import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          name: "next/link",
          message:
            "Please import from @/i18n/routing as it is needed for localization",
          importNames: ["default"],
        },
        {
          name: "next/navigation",
          message:
            "Please import from @/i18n/routing as it is needed for localization",
          importNames: [
            "redirect",
            "permanentRedirect",
            "useRouter",
            "usePathname",
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
