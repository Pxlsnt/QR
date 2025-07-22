export interface Device {
  id: string;
  name: string;
  category: string;
  status: 'ready' | 'borrowed';
  img?: string;
  note?: string;
  borrower?: string;
  duedate?: string;
}

export interface BorrowData {
  action: 'borrow' | 'return' | 'add';
  id: string;
  name: string;
  category: string;
  status: string;
  img?: string;
  note?: string;
  borrower?: string;
  duedate?: string;
}