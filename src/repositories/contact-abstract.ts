import ContactEntity from '../entities/contact';

export interface IContactRepository {
  add(email: string | null, phoneNumber: string | null): Promise<ContactEntity>;
  get(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity[]>;
}
