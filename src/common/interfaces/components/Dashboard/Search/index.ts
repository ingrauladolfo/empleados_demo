export interface SearchProps {
    data: any[];
    filterKey: string;
    placeholder: string;
    onSearch: (filteredData: any[], term?: string) => void;
}