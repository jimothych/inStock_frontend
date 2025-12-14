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
  baseQuery: fetchBaseQuery({ baseUrl: process.env.BACKEND_URL }),
  tagTypes: ['Receipts', 'CurrentNumProcessingDocs'],
  endpoints: (builder) => ({

    //not really using the cache per se, just handy for state refetch after deletePost
    //not gonna poll anything, just swipe up will invalidate tag, causing everything to be called again, header will also have loading bar and time since last updated

    getUserReceipts: builder.query<Receipt[], string>({
      query: (userID) => `user/receipts/${userID}`,
      providesTags: ['Receipts'],
    }),

    getCurrentNumProcessingDocs: builder.query<number, string>({
      query: (userID) => `user/currentNumProcessingDocs/${userID}`,
      providesTags: ['CurrentNumProcessingDocs'],
    }),

    deletePost: builder.mutation<number, number>({
      query(receipt_id) {
        return {
          url: `receipt/${receipt_id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Receipts'],
    }),

    uploadFiles: builder.mutation<number, { userID: number; files: FormData }>({
      query({ userID, files }) {
        return {
          url: `upload/${userID}`,
          method: 'POST',
          body: files,
        }
      },
    }),

  })
})

export const { useGetUserReceiptsQuery,
              useGetCurrentNumProcessingDocsQuery,
              useDeletePostMutation,
              useUploadFilesMutation } = api