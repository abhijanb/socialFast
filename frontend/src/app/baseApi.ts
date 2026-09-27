import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { env } from "@/core/env";
import { getServerMessage } from "@/core/getServerMessage";

const rawBaseQuery = fetchBaseQuery({ baseUrl: env.API_URL, credentials: "include" });

const locallyHandledEndpoints = new Set(["login", "register", "getProfile"]);

const baseQueryWithToast: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && !locallyHandledEndpoints.has(api.endpoint)) {
        toast.error(getServerMessage(result.error, "Something went wrong. Please try again."));
    }
    return result;
};

export const baseApi = createApi({
    baseQuery: baseQueryWithToast,
    tagTypes: ["Post", "Profile"],
    endpoints:() => ({})
}) 