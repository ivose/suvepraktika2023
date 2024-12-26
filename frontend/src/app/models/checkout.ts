import { Book } from './book';
import { BookStatus } from './book-status';

export interface CheckOut {
  id: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowedBook: Book;
  checkedOutDate: string;
  dueDate: string;
  returnedDate: string;
}
