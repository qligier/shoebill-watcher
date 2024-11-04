import {IgBuildLog} from "./api";

export class Pagination {

    private _currentPage: number = 1;
    private numberOfPages: number = 0;

    constructor(private readonly pageSize: number,
                private readonly logRenderer: (logs: IgBuildLog[]) => void,
                private readonly paginationRenderer: (item: PaginationItem[], pagination: Pagination) => void) {
    }

    private _logs: IgBuildLog[] = [];

    set logs(logs: IgBuildLog[]) {
        this._logs = logs;
        this.numberOfPages = Math.ceil(logs.length / this.pageSize);
        if (this._currentPage > this.numberOfPages) {
            this.page = 1;
            // The setter has called render() already
        } else {
            this.render();
        }
    }

    set page(page: number) {
        if (page < 1 || page > this.numberOfPages) {
            return;
        }
        this._currentPage = page;
        this.render();
    }

    render(): void {
        const start = (this._currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.logRenderer(this._logs.slice(start, end));

        const nbPagesToShow = 4;

        const items: PaginationItem[] = [];

        // Show the first page and the 'previous' button
        if (this._currentPage > 1) {
            items.push(new PaginationPreviousPage(this._currentPage - 1));
            items.push(new PaginationPage(1));
        }
        // If there are more than _nbPagesToShow_ pages, we need to show an ellipsis
        if (this._currentPage > (nbPagesToShow + 2)) {
            items.push(new PaginationEllipsis());
        }

        // Show the _nbPagesToShow_ pages before the current page
        for (let i = Math.max(2, this._currentPage - nbPagesToShow); i <= this._currentPage - 1; i++) {
            items.push(new PaginationPage(i));
        }

        // The current page
        items.push(new PaginationCurrentPage(this._currentPage));

        // Show the _nbPagesToShow_ pages after the current page
        for (let i = this._currentPage + 1; i <= Math.min(this._currentPage + nbPagesToShow, this.numberOfPages - 1); i++) {
            items.push(new PaginationPage(i));
        }

        // If there are more than _nbPagesToShow_ pages, we need to show an ellipsis
        if (this._currentPage < (this.numberOfPages - nbPagesToShow - 2)) {
            items.push(new PaginationEllipsis());
        }

        // Show the last page and the 'next' button
        if (this._currentPage < this.numberOfPages) {
            items.push(new PaginationPage(this.numberOfPages));
            items.push(new PaginationNextPage(this._currentPage + 1));
        }

        this.paginationRenderer(items, this);
    }
}

export class PaginationItem {
}

export class PaginationPreviousPage extends PaginationItem {
    constructor(public readonly page: number) {
        super();
    }
}

export class PaginationNextPage extends PaginationItem {
    constructor(public readonly page: number) {
        super();
    }
}

export class PaginationPage extends PaginationItem {
    constructor(public readonly page: number) {
        super();
    }
}

export class PaginationCurrentPage extends PaginationItem {
    constructor(public readonly page: number) {
        super();
    }
}

export class PaginationEllipsis extends PaginationItem {
}