import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, Product } from '../types';


const generateProductData = (photo: { id: number; albumId: number; title: string; url: string; thumbnailUrl: string }): Product => ({
    ...photo,
    url: `https://picsum.photos/seed/${photo.id}/600/400`,
    thumbnailUrl: `https://picsum.photos/seed/${photo.id}/150/150`,
    price: Math.floor(Math.random() * 9000 + 1000) / 100, 
    stock: Math.floor(Math.random() * 100 + 1), 
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
    tagTypes: ['Users', 'Photos'],
    endpoints: (builder) => ({
        // Users (Customers)
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        getUser: builder.query<User, number>({
            query: (id) => `/users/${id}`,
        }),
        createUser: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: '/users',
                method: 'POST',
                body,
            }),
        }),
        updateUser: builder.mutation<User, Partial<User> & { id: number }>({
            query: ({ id, ...body }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body,
            }),
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
        }),

        getPhotos: builder.query<Product[], number | void>({
            query: (limit = 50) => `/photos?_limit=${limit}`,
            transformResponse: (response: Array<{ id: number; albumId: number; title: string; url: string; thumbnailUrl: string }>) =>
                response.map(generateProductData),
            providesTags: ['Photos'],
        }),

        createOrder: builder.mutation<{ id: number }, { title: string; body: string; userId: number }>({
            query: (body) => ({
                url: '/posts',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetPhotosQuery,
    useCreateOrderMutation,
} = api;
