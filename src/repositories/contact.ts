import ContactEntity from '../entities/contact';
import {IContactRepository} from './contact-abstract';

export class ContactRepository implements IContactRepository {
  add(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity> {
    throw new Error('Method not implemented.');
  }
  get(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity[]> {
    throw new Error('Method not implemented.');
  }
}
