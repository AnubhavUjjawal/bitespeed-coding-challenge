import {AddContactDto, ContactDto} from '../dto/contact';
import {IContactService} from './contact-abstract';

export class ContactService implements IContactService {
  async add(dto: AddContactDto): Promise<ContactDto> {
    throw new Error('Method not implemented.');
  }
}
