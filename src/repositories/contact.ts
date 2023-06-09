import {Knex} from 'knex';
import {ILogger} from '../common/logger';
import db from '../db';
import ContactEntity from '../entities/contact';
import {IContactRepository} from './contact-abstract';

export class ContactRepository implements IContactRepository {
  constructor(private readonly logger: ILogger) {}

  // reconcile contacts with same email or phone number and return primary contact id
  async reconcile(
    txn: Knex.Transaction,
    email: string | null,
    phoneNumber: string | null
  ): Promise<number | null> {
    try {
      const allMatchingContacts: ContactEntity[] = await txn
        .select('linkedId', 'id', 'createdAt', 'linkPrecedence')
        .from<ContactEntity>('contact')
        .modify(queryBuilder => {
          if (email && phoneNumber) {
            queryBuilder
              .where('email', '=', email)
              .orWhere('phone', '=', phoneNumber);
          } else if (email) {
            queryBuilder.where('email', '=', email);
          } else if (phoneNumber) {
            queryBuilder.where('phone', '=', phoneNumber);
          }
        })
        .orderBy('createdAt', 'ASC');

      if (allMatchingContacts.length === 0) {
        return null;
      }

      // push all ids and linkedIds for another query
      const ids: number[] = [];
      allMatchingContacts.forEach(contact => {
        if (contact.linkedId) {
          ids.push(contact.linkedId);
        }
        ids.push(contact.id);
      });

      // get all contacts with ids
      const allContacts: ContactEntity[] = await txn
        .select('linkedId', 'id', 'createdAt', 'linkPrecedence')
        .from<ContactEntity>('contact')
        .whereIn('id', ids)
        .orWhereIn('linkedId', ids)
        .orderBy('createdAt', 'ASC');

      // console.log('allContacts', allContacts)
      // mark the first one as primary
      const primaryContact = allContacts[0];
      await txn
        .from<ContactEntity>('contact')
        .where('id', '=', primaryContact.id)
        .update({
          linkPrecedence: 'primary',
          linkedId: null,
        });

      // mark the rest as secondary
      const idsToUpdate: number[] = [];
      for (let i = 1; i < allContacts.length; i++) {
        idsToUpdate.push(allContacts[i].id);
      }
      await txn
        .from<ContactEntity>('contact')
        .whereIn('id', idsToUpdate)
        .update({
          linkPrecedence: 'secondary',
          linkedId: primaryContact.id,
        });

      return primaryContact.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error('Error in reconcile contact', {error: error.message});
      throw error;
    }
  }

  async add(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity | void> {
    const txnProvider = db.transactionProvider({
      isolationLevel: 'serializable',
    });
    const txn = await txnProvider();
    try {
      const primaryContact = await this.reconcile(txn, email, phoneNumber);

      // if exact match found in terms of email and contact return;
      const existingContact: ContactEntity[] = await txn
        .select('*')
        .from<ContactEntity>('contact')
        .modify(queryBuilder => {
          if (email && phoneNumber) {
            queryBuilder
              .where('email', '=', email)
              .orWhere('phone', '=', phoneNumber);
          } else if (email) {
            queryBuilder.where('email', '=', email);
          } else if (phoneNumber) {
            queryBuilder.where('phone', '=', phoneNumber);
          }
        })
        .orderBy('createdAt', 'ASC');

      const emailFound = existingContact.find(
        contact => contact.email === email
      );
      const phoneFound = existingContact.find(
        contact => contact.phone === phoneNumber
      );
      if (emailFound && phoneFound) {
        this.logger.info('contact already exists', {email, phoneNumber});
        await txn.commit();
        return;
      }
      this.logger.info('adding contact', {email, phoneNumber, primaryContact});

      // insert new contact
      const contactEntity: Omit<
        ContactEntity,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
      > = {
        email,
        phone: phoneNumber,
        linkedId: primaryContact,
        linkPrecedence: primaryContact ? 'secondary' : 'primary',
      };
      const contactEntityReturned = await txn
        .insert(contactEntity)
        .into<ContactEntity>('contact')
        .returning('*');

      await txn.commit();
      return contactEntityReturned[0];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error('Error in add contact', {error: error.message});
      await txn.rollback();
      throw error;
    }
  }

  async get(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity[]> {
    // get all contacts with same email or phone number
    const contacts: ContactEntity[] = await db
      .select('linkedId', 'id', 'createdAt', 'linkPrecedence')
      .from<ContactEntity>('contact')
      .modify(queryBuilder => {
        if (email && phoneNumber) {
          queryBuilder
            .where('email', '=', email)
            .orWhere('phone', '=', phoneNumber);
        } else if (email) {
          queryBuilder.where('email', '=', email);
        } else if (phoneNumber) {
          queryBuilder.where('phone', '=', phoneNumber);
        }
      })
      .orderBy('createdAt', 'ASC');

    if (!contacts.length) {
      return [];
    }

    // if the contact is primary the linkedId is this contact's id
    // else the linkedId is this contact's linkedId

    let linkedId: number | null = null;
    if (contacts[0].linkPrecedence === 'primary') {
      linkedId = contacts[0].id;
    } else {
      linkedId = contacts[0].linkedId;
    }
    const contactsToReturn: ContactEntity[] = await db
      .select('*')
      .from<ContactEntity>('contact')
      .where('linkedId', '=', linkedId)
      .orWhere('id', '=', linkedId)
      .orderBy('createdAt', 'ASC');
    return contactsToReturn;
  }
}
