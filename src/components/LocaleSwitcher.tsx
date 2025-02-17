import { useLocale, useTranslations } from "next-intl";
import { Locale, routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
// import { FR, GB, DE } from "country-flag-icons/react/3x2";

interface Translations {
  label: string;
  //   flag: typeof DE;
}

const translations: Record<Locale, Translations> = {
  en: {
    label: "EN",
    // flag: GB,
  },
  fr: {
    label: "FR",
    // flag: FR,
  },
  de: {
    label: "DE",
    // flag: DE,
  },
};

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          {translations[cur].label}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
