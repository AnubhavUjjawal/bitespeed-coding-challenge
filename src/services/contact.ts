import {ILogger} from '../common/logger';
import {AddContactDto, ContactDto} from '../dto/contact';
import {IContactRepository} from '../repositories/contact-abstract';
import {IContactService} from './contact-abstract';

export class ContactService implements IContactService {
  constructor(
    private readonly logger: ILogger,
    private readonly contactRepository: IContactRepository
  ) {}
  async add(dto: AddContactDto): Promise<ContactDto> {
    const insertedData = await this.contactRepository.add(
      dto.email,
      dto.phoneNumber
    );
    this.logger.info('inserted data', {insertedData});

    const contacts = await this.contactRepository.get(
      dto.email,
      dto.phoneNumber
    );
    this.logger.info('contacts', {contacts});

    let primaryEmail: string | undefined = undefined;
    let primaryPhone: string | undefined = undefined;
    let primaryContactId = -1;

    const emailSet: Set<string> = new Set();
    const phoneSet: Set<string> = new Set();
    const secondaryContactIds: number[] = [];

    contacts.forEach(contact => {
      if (contact.linkPrecedence === 'primary') {
        primaryContactId = contact.id;
        primaryEmail = contact.email ?? undefined;
        primaryPhone = contact.phone ?? undefined;
      }
    });

    contacts.forEach(contact => {
      if (contact.linkPrecedence === 'secondary') {
        secondaryContactIds.push(contact.id);
      }
      if (contact.email && contact.email !== primaryEmail) {
        emailSet.add(contact.email);
      }
      if (contact.phone && contact.phone !== primaryPhone) {
        phoneSet.add(contact.phone);
      }
    });

    const emails = Array.from(emailSet);
    const phoneNumbers = Array.from(phoneSet);

    if (primaryEmail) {
      emails.unshift(primaryEmail);
    }
    if (primaryPhone) {
      phoneNumbers.unshift(primaryPhone);
    }

    return {
      primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds,
    };
  }
}
