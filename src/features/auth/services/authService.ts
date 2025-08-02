import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions<T> {
    endpoint: string;
    method?: ApiMethod;
    data?: T;
    showToastError?: boolean;
    keepPreviousData?: boolean; // pagination/filter fetch flag
    retry?: number;
    pollInterval?: number;
}

type ApiResponse<T> = {
    data: T | null;
    error: string | null;
};

const cache = new Map<string, any>();

const serializeKey = <T>(endpoint: string, method: ApiMethod, data?: T) =>
    `${method}:${endpoint}:${data ? JSON.stringify(data) : ''}`;

export const useApi = <TRequest = any, TResponse = any>() => {
    const [data, setData] = useState<TResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const inProgress = useRef(false);
    const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelPoll = () => {
        if (pollTimer.current) {
            clearTimeout(pollTimer.current);
            pollTimer.current = null;
        }
    };

    const request = useCallback(
        async ({
            endpoint,
            method = 'POST',
            data: payload,
            showToastError = true,
            keepPreviousData = false,
            retry = 0,
            pollInterval,
        }: ApiOptions<TRequest>): Promise<ApiResponse<TResponse>> => {
            if (inProgress.current) return { data: null, error: null };

            const cacheKey = serializeKey(endpoint, method, payload);

            if (!keepPreviousData) setData(null);
            setLoading(true);
            setError(null);
            inProgress.current = true;

            // Set isFetch true only if this is a filter/pagination fetch
            setIsFetching(keepPreviousData);

            // Serve cached data immediately if available & keepPreviousData
            if (cache.has(cacheKey) && keepPreviousData) {
                setData(cache.get(cacheKey));
            }

            let attempts = 0;

            const fetchData = async (): Promise<ApiResponse<TResponse>> => {
                attempts++;
                try {
                    const res = await fetch(endpoint, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: payload ? JSON.stringify(payload) : undefined,
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
                    cache.set(cacheKey, responseData);
                    setData(responseData);
                    setError(null);
                    setLoading(false);
                    inProgress.current = false;

                    setIsFetching(false);

                    return { data: responseData, error: null };
                } catch (err: any) {
                    if (attempts <= retry) {
                        const delay = 500 * 2 ** (attempts - 1);
                        await new Promise((r) => setTimeout(r, delay));
                        return fetchData();
                    }

                    const msg = err?.message || 'Unexpected error';
                    setError(msg);
                    setLoading(false);
                    inProgress.current = false;

                    setIsFetching(false);

                    if (showToastError) toast.error(msg);
                    return { data: null, error: msg };
                }
            };

            const result = await fetchData();

            if (pollInterval && pollInterval > 0) {
                cancelPoll();
                pollTimer.current = setTimeout(() => {
                    request({
                        endpoint,
                        method,
                        data: payload,
                        showToastError,
                        keepPreviousData,
                        retry,
                        pollInterval,
                    });
                }, pollInterval);
            } else {
                cancelPoll();
            }

            return result;
        },
        []
    );

    useEffect(() => {
        return () => cancelPoll();
    }, []);

    return { data, error, loading, isFetching, request, cancelPoll };
};
