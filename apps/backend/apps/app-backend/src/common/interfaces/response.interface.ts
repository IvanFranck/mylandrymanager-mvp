export interface CustomResponseMetaDataInterface {
  total?: number;
  lastPage?: number;
  currentPage?: number;
  perPage?: number;
  prev?: string;
  next?: string;
}
export interface CustomResponseInterface<T> {
  message: string;
  details: T;
  meta?: CustomResponseMetaDataInterface;
}
