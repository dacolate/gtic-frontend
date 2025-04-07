// "use client";

// import { ClassTable } from "@/components/classes/ClassTable";
// import { ClassActionButton } from "@/components/classes/ClassActionButton";
// import api from "@/lib/axios";
// import { Class } from "@/lib/types";
// import { motion } from "framer-motion";
// import { useTranslations } from "next-intl";
// import React, { useEffect, useState } from "react";
// import TypingLoader from "@/components/TypingLoader";

// export default function ClassesPage() {
//   const t = useTranslations("ClassTable");
//   const [classes, setClasses] = useState<Class[]>([]); // State to store the fetched classes
//   const [isLoading, setIsLoading] = useState(true); // State to manage loading status
//   const [error, setError] = useState<string | null>(null); // State to handle errors

//   useEffect(() => {
//     // Function to fetch classes
//     const fetchClasses = async () => {
//       try {
//         setIsLoading(true); // Set loading to true before making the request
//         const response = await api.get("/classes"); // Replace with your API endpoint
//         if (response.data.success) {
//           setClasses(response.data.data); // Set the fetched classes
//         } else {
//           setError(response.data.message); // Handle API error message
//         }
//       } catch (error) {
//         console.log("error", error);
//         setError("An error occurred while fetching classes."); // Handle network or other errors
//       } finally {
//         setIsLoading(false); // Set loading to false after the request is complete
//       }
//     };

//     fetchClasses(); // Call the fetch function
//   }, []); // Empty dependency array ensures this runs only once on mount

//   if (isLoading) {
//     return <TypingLoader />; // Display loading state
//   }

//   if (error) {
//     return <div>Error: {error}</div>; // Display error state
//   }

//   console.log(classes);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="container mx-auto py-10 px-4"
//     >
//       {/* <h1 className="text-4xl font-bold mb-6 text-gray-800">Our Students</h1> */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">{t("Classes")}</h1>
//       </div>
//       <ClassActionButton />

//       <ClassTable classes={classes} />
//     </motion.div>
//   );
// }

"use client";

import { ClassTable } from "@/components/classes/ClassTable";
import { ClassActionButton } from "@/components/classes/ClassActionButton";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import TypingLoader from "@/components/TypingLoader";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { RefreshCw } from "lucide-react"; // NEW: Import refresh icon
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false, // NEW: Prevent refetch on tab switch
    },
  },
});

function ClassDataFetcher() {
  const t = useTranslations("ClassTable");
  const {
    data: classes,
    isLoading,
    error,
    refetch, // NEW: Get the refetch function from useQuery
    isRefetching, // NEW: Track refresh state
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      if (!response.data.success) throw new Error(response.data.message);
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
        <h1 className="text-3xl font-bold">{t("Classes")}</h1>
        {/* NEW: Refresh button */}
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <ClassActionButton />
      <ClassTable classes={classes || []} isRefreshing={isRefetching} />
    </motion.div>
  );
}

export default function ClassesPage() {
  // NEW: Wrap with QueryClientProvider
  return (
    <QueryClientProvider client={queryClient}>
      <ClassDataFetcher />
    </QueryClientProvider>
  );
}
