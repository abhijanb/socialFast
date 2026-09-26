import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/env";

export const baseApi = createApi({
    baseQuery:fetchBaseQuery({baseUrl:env.API_URL,credentials:"include"}),
    endpoints:(build) => ({})
}) 