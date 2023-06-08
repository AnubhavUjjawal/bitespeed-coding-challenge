// Here we sort-of dependency inject our services.
// We are not using any DI tool or framework here, so we will pass the dependencies manually.

import ContactController from './controllers/contact';
import {ContactService} from './services/contact';

export const buildContactController = () => {
  // const contactRepository = new ContactRepository();
  const contactService = new ContactService();
  return new ContactController(contactService);
};
