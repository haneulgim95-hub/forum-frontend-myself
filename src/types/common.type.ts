export type PaginationResponseType<T> = {
    size: number;
    page: number;
    total: number;
    list: T[];
}