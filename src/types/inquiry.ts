export type InquirySubject = 'general' | 'product' | 'bulk_order' | 'custom' | 'other';

export interface InquiryAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: InquirySubject;
  productInterest?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved' | 'closed';
  createdAt: string;
  attachments?: InquiryAttachment[];
}
