type linkPrecedence = 'secondary' | 'primary';

class ContactEntity {
  id: number;
  phone: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: linkPrecedence;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export default ContactEntity;
