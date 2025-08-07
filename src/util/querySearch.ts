import { useNavigate, useLocation } from "react-router-dom";

const useSearchQuery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    /**
     * Set a single filter in the URL
     */
    const setFilter = (
        key: string,
        value: string | string[] | null | undefined,
        config?: {
            isMultiple?: boolean;
            resetFilters?: boolean;
            resetPage?: boolean;
            clearKeys?: string[]; // 👈 NEW
        }
    ) => {
        if (!key || typeof key !== 'string') return;
        if (value == null) return;

        const values = Array.isArray(value)
            ? value.filter((v) => typeof v === 'string' && v.trim() !== '')
            : [value];

        if (values.length === 0) return;

        const isMultiple = config?.isMultiple ?? true;
        const resetFilters = config?.resetFilters ?? false;
        const resetPage = config?.resetPage ?? true;
        const clearKeys = config?.clearKeys ?? [];

        const newParams = new URLSearchParams();

        if (resetFilters) {
            values.forEach((v) => newParams.append(key, v));
        } else {
            const existingValues = params.getAll(key);

            for (const [k, v] of params.entries()) {
                if (clearKeys.includes(k)) continue;

                if (isMultiple) {
                    if (!(k === key && values.includes(v))) {
                        newParams.append(k, v);
                    }
                } else {
                    if (k !== key) {
                        newParams.append(k, v);
                    }
                }
            }

            if (isMultiple) {
                values.forEach((v) => {
                    if (!existingValues.includes(v)) {
                        newParams.append(key, v);
                    }
                });
            } else {
                newParams.set(key, values[0]);
            }
        }

        if (resetPage) {
            newParams.set("page", "1");
        } else {
            const currentPage = params.get("page");
            if (currentPage) {
                newParams.set("page", currentPage);
            }
        }

        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    /**
     * Set multiple filters at once
     */
    const setFilters = (
        filters: Record<string, string | string[] | null | undefined>,
        config?: {
            isMultiple?: boolean;
            resetFilters?: boolean;
            resetPage?: boolean;
            clearKeys?: string[]; // 👈 NEW
        }
    ) => {
        const isMultiple = config?.isMultiple ?? true;
        const resetFilters = config?.resetFilters ?? true;
        const resetPage = config?.resetPage ?? true;
        const clearKeys = config?.clearKeys ?? [];

        const newParams = new URLSearchParams();

        if (!resetFilters) {
            for (const [k, v] of params.entries()) {
                if (clearKeys.includes(k)) continue;
                newParams.append(k, v);
            }
        }

        for (const [key, rawValue] of Object.entries(filters)) {
            if (!key || rawValue == null) continue;

            const values = Array.isArray(rawValue)
                ? rawValue.filter((v) => typeof v === 'string' && v.trim() !== '')
                : [rawValue];

            if (values.length === 0) continue;

            if (isMultiple) {
                values.forEach((v) => newParams.append(key, v));
            } else {
                newParams.set(key, values[0]);
            }
        }

        if (resetPage) {
            newParams.set("page", "1");
        } else {
            const currentPage = params.get("page");
            if (currentPage) {
                newParams.set("page", currentPage);
            }
        }

        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    /**
     * Go to a specific page number
     */
    const gotoPage = (page: number) => {
        if (typeof page !== "number" || isNaN(page) || page < 1) return;

        const newParams = new URLSearchParams(location.search);
        newParams.set("page", page.toString());

        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    /**
     * Clear all filters except excluded keys
     */
    const clearFilters = (excludeKeys: string[] = []) => {
        const newParams = new URLSearchParams();

        for (const [key, value] of params.entries()) {
            if (excludeKeys.includes(key)) {
                newParams.append(key, value);
            }
        }

        if (!excludeKeys.includes("page")) {
            newParams.set("page", "1");
        }

        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    /**
     * Grouped query strings by key
     */
    const getGroupedQueries = () => {
        const grouped: Record<string, string> = {};
        for (const [key, value] of params.entries()) {
            if (!grouped[key]) {
                grouped[key] = `${key}=${value}`;
            } else {
                grouped[key] += `&${key}=${value}`;
            }
        }
        return grouped;
    };

    const page = Number(params.get("page") ?? "1");

    return {
        setFilter,
        setFilters,
        clearFilters,
        gotoPage,
        groupedQueries: getGroupedQueries(),
        params,
        page,
    };
};

export default useSearchQuery;
