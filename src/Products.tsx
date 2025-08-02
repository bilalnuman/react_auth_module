import React, { useEffect, useState } from 'react';
import { useApi } from './features/auth/services/authService';
import { useSearchParams } from 'react-router-dom';

interface Post {
    id: number;
    title: string;
    body: string;
}

const Products = () => {
    const { request, loading, isFetching, data, error } = useApi<undefined, Post[]>();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initial page from URL or 1
    const initialPage = Number(searchParams.get('page')) || 1;
    const [page, setPage] = useState(initialPage);

    // Sync URL with page state
    useEffect(() => {
        setSearchParams({ page: page.toString() });
    }, [page, setSearchParams]);

    // Fetch posts on page change, keepPreviousData true so old posts remain during loading
    useEffect(() => {
        request({
            endpoint: `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=30`,
            method: 'GET',
            keepPreviousData: true,
            showToastError: false, // Optional: avoid toast on fetch error
        });
    }, [page, request]);

    return (
        <div>
            <h2>Page: {page}</h2>

            <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
            >
                Prev
            </button>
            <button onClick={() => setPage((p) => p + 1)} disabled={loading}>
                Next
            </button>

            {loading &&  !data && <p>Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            <ul>
                {data &&
                    data.map((post) => (
                        <li key={post.id}>
                            <strong>{post.title}</strong>
                            <p>{post.body}</p>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Products;
