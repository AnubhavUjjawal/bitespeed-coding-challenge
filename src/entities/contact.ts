type linkPrecedence = 'secondary' | 'primary';

class ContactEntity {
  id: number;
  phone: string;
  email: string;
  linkedId: string;
  linkPrecedence: linkPrecedence;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export default ContactEntity;
