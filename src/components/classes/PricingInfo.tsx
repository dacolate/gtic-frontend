"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pricing } from "@/lib/types";
import { formatReadableDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function PricingInfo({ pricing }: { pricing: Pricing }) {
  const t = useTranslations("PricingInfo");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pricingDetails")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="font-medium text-gray-500">
              {t("registrationFee")}
            </dt>
            <dd className="text-lg font-bold">${pricing.registerFee}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">
              {t("firstInstalment")}
            </dt>
            <dd className="text-lg font-bold">${pricing.instalment1Fee}</dd>
            <dd className="text-sm text-gray-500">
              {t("dueBy")} {formatReadableDate(pricing.instalment1Deadline)}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">
              {t("secondInstalment")}
            </dt>
            <dd className="text-lg font-bold">${pricing.instalment2Fee}</dd>
            <dd className="text-sm text-gray-500">
              {t("dueBy")} {formatReadableDate(pricing.instalment2Deadline)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
