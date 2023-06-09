import { ILogger } from '../common/logger';
import {AddContactDto, ContactDto} from '../dto/contact';
import { IContactRepository } from '../repositories/contact-abstract';
import {IContactService} from './contact-abstract';

export class ContactService implements IContactService {
  constructor(
    private readonly logger: ILogger,
    private readonly contactRepository: IContactRepository,
  ) {}
  async add(dto: AddContactDto): Promise<ContactDto> {
    const insertedData = await this.contactRepository.add(dto.email, dto.phoneNumber);
    this.logger.info('inserted data', insertedData)
    return {
      primaryContactId: insertedData.id,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };
  }
}
