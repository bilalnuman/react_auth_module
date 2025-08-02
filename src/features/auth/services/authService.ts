import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions<T> {
    endpoint: string;
    method?: ApiMethod;
    data?: T;
    showToastError?: boolean;
}

type ApiResponse<T> = {
    data: T | null;
    error: string | null;
};

export const useApi = <TRequest = any, TResponse = any>() => {
    const [data, setData] = useState<TResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const inProgress = useRef(false);

    const request = useCallback(
        async ({
            endpoint,
            method = 'POST',
            data,
            showToastError = true,
        }: ApiOptions<TRequest>): Promise<ApiResponse<TResponse>> => {
            if (inProgress.current) {
                return { data: null, error: null };
            }

            setLoading(true);
            setError(null);
            inProgress.current = true;

            try {
                const res = await fetch(endpoint, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: data ? JSON.stringify(data) : undefined,
                });

                const contentType = res.headers.get('Content-Type');
                const isJson = contentType?.includes('application/json');

                if (!res.ok) {
                    const errorText = isJson ? await res.json() : await res.text();
                    const message =
                        typeof errorText === 'string'
                            ? errorText
                            : errorText?.message || 'Something went wrong';
                    throw new Error(message);
                }

                const responseData: TResponse = isJson ? await res.json() : ({} as TResponse);
                setData(responseData);
                return { data: responseData, error: null };
            } catch (err: any) {
                const msg = err?.message || 'Unexpected error';
                setError(msg);
                if (showToastError) toast.error(msg);
                return { data: null, error: msg };
            } finally {
                setLoading(false);
                inProgress.current = false;
            }
        },
        []
    );

    return { data, error, loading, request };
};

