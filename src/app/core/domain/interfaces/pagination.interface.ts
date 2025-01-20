import { Pageable } from "./pageable.interface";

export interface PaginationInterface<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    last: boolean;
    size: number;
    totalElements: number;
}