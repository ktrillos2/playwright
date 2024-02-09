'use client';

import { FC, useMemo, useState } from "react";

interface Props {
    data: any;
}

export const usePropsPaginator = ({ data }: Props) => {
    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    const pagesPaginator = Math.ceil(data.length / rowsPerPage) || 1;

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data?.slice(start, end);
    }, [page, data]);

    return { items, page, pagesPaginator, setPage }
};
