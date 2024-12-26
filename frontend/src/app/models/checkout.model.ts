export interface CheckOut {
    id: string;
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowedBook: {
        id: string;
        title: string;
        author: string;
        status: string;
    };
    checkedOutDate: string;
    dueDate: string;
    returnedDate?: string;
}