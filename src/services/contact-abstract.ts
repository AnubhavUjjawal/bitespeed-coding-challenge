import {AddContactDto, ContactDto} from '../dto/contact';

export interface IContactService {
  add(dto: AddContactDto): PromiseLike<ContactDto>;
}
