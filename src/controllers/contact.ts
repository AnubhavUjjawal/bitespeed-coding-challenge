import {Request, Response} from 'express';
import {IContactService} from '../services/contact-abstract';
import {
  AddContactDto,
  ContactDto,
  AddContactDtoValidator,
} from '../dto/contact';
import {ErrorWithData} from '../common/error';

export default class ContactController {
  // We can dependency inject the validator here, but it makes more sense when we have a lot of validators
  // and create a geenric interface around it. For now, we will just use the validator directly.
  private readonly addContactDtoValidator: typeof AddContactDtoValidator;

  constructor(private readonly contactService: IContactService) {
    this.addContactDtoValidator = AddContactDtoValidator;
  }

  async addContact(
    req: Request<unknown, unknown, AddContactDto>,
    res: Response
  ): Promise<void> {
    const contactDto: AddContactDto = req.body;
    const validationResult = await this.addContactDtoValidator.safeParseAsync(
      contactDto
    );
    if (!validationResult.success) {
      throw new ErrorWithData(
        'invalid post data',
        validationResult.error.errors
      );
    }
    const contact: ContactDto = await this.contactService.add(contactDto);
    res.status(200).json(contact);
  }
}
