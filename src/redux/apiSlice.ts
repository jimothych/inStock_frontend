import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// type taken straight from backend
export type Receipt = {
  receipt_id: string;
  transaction_date_time: string | null;
  price: number | null;
  unit_description: string | null;
  quantity: number | null;
  product_code: string | null;
  user_id: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: "https://in-stoc-evg9e3bpf8dnakad.northcentralus-01.azurewebsites.net" }),
  endpoints: (builder) => ({

    //not really using the cache per se, just handy for state refetch after deletePost
    //not gonna poll anything, just swipe up will invalidate tag, causing everything to be called again, header will also have loading bar and time since last updated

    getUserReceipts: builder.query<Receipt[], string>({
      query: (userID) => `user/receipts/${userID}`,
    }),

    getCurrentNumProcessingDocs: builder.query<number, string>({
      query: (userID) => `user/currentNumProcessingDocs/${userID}`,
    }),

    deleteReceiptItem: builder.mutation<number, string>({
      query(receipt_id) {
        return {
          url: `user/receipt/${receipt_id}`,
          method: 'DELETE',
        }
      },
    }),

    uploadFiles: builder.mutation<number, { userID: string; formData: FormData }>({
      query({ userID, formData }) {
        return {
          url: `upload/${userID}`,
          method: 'POST',
          body: formData,
        }
      },
    }),

  })
})

export const { useGetUserReceiptsQuery,
              useGetCurrentNumProcessingDocsQuery,
              useDeleteReceiptItemMutation,
              useUploadFilesMutation } = api