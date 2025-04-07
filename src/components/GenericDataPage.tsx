"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { GenericDataTable } from "./GenericDataTable";
import TypingLoader from "@/components/TypingLoader";
import { ColumnDef } from "@tanstack/react-table";
import api from "@/lib/axios";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface GenericDataPageProps<T> {
  endpoint: string;
  translationKey: string;
  columns: ColumnDef<T>[];
  additionalFilters?: React.ReactNode;
  searchColumn?: string;
  onRowClick?: (row: T) => void;
  headerButtons?: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function DataFetcher<T>({
  endpoint,
  translationKey,
  columns,
  additionalFilters,
  searchColumn,
  onRowClick,
  headerButtons,
}: GenericDataPageProps<T>) {
  const t = useTranslations(translationKey);
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await api.get(`/${endpoint}`);
      if (!response.data.success) throw new Error(response.data.message);
      console.log("bushes", response.data.data);
      return response.data.data;
    },
  });

  if (isLoading) return <TypingLoader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("Title")}</h1>
        <div className="flex gap-4">
          {headerButtons}
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            {t("Refresh")}
          </Button>
        </div>
      </div>

      <GenericDataTable
        data={data || []}
        columns={columns}
        translationKey={translationKey}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        searchColumn={searchColumn}
        additionalFilters={additionalFilters}
        onRowClick={onRowClick}
      />
    </motion.div>
  );
}

export function GenericDataPage<T>(props: GenericDataPageProps<T>) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataFetcher {...props} />
    </QueryClientProvider>
  );
}
