import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// This function ensures that we only create one instance of QueryClient per request
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
