// Here we sort-of dependency inject our services.
// We are not using any DI tool or framework here, so we will pass the dependencies manually.

import {WinstonLogger} from './common/logger';
import ContactController from './controllers/contact';
import {ContactRepository} from './repositories/contact';
import {ContactService} from './services/contact';

export const buildContactController = () => {
  const logger = new WinstonLogger();
  const contactRepository = new ContactRepository(logger);
  const contactService = new ContactService(logger, contactRepository);
  return new ContactController(contactService);
};
