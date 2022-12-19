import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from '../../blockchain/configs'
// Define a service using a base URL and expected endpoints
export const blockscoutApi = createApi({
  reducerPath: 'blockscoutApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.apiBlockscountEndpoint }),
  endpoints: (builder) => ({
    //Account

    getTxsByAddr: builder.query({
      query: (addr) => `txs/listByAccount/${addr}`,
    }),
    getTokenTransfers: builder.query({
      query: (addr) => `token-txs/xrc20?holder=${addr}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTxsByAddrQuery, useGetTokenTransfersQuery } = blockscoutApi
