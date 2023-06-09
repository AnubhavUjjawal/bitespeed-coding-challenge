import { ILogger } from '../common/logger';
import db from '../db';
import ContactEntity from '../entities/contact';
import {IContactRepository} from './contact-abstract';

export class ContactRepository implements IContactRepository {
  constructor(
    private readonly logger: ILogger,
  ) {}

  async add(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity> {
    const txnProvider = db.transactionProvider({
      isolationLevel: 'serializable',
    });
    const txn = await txnProvider();
    try {
      const existingEntity = await txn
        .select('linkedId', 'id', 'createdAt', 'linkPrecedence')
        .from<ContactEntity>('contact')
        .modify((queryBuilder) => {
          if (email && phoneNumber) {
            queryBuilder
            .where('email', '=', email)
            .orWhere('phone', '=', phoneNumber)
          } else if (email) {
            queryBuilder
            .where('email', '=', email)
          } else if (phoneNumber) {
            queryBuilder
            .where('phone', '=', phoneNumber)
          }
        })
        .orderBy('createdAt', 'desc')
      
      
      if (!existingEntity.length) {
        const contactEntity: Omit<ContactEntity, "id" | "createdAt" | "updatedAt" |"deletedAt"> = {
          email,
          phone: phoneNumber,
          linkedId: null,
          linkPrecedence: "primary"
        }
        const contactEntityReturned = await txn
          .insert(contactEntity)
          .into<ContactEntity>('contact')
          .returning('*')

        txn.commit();
        return contactEntityReturned[0];
      }

      existingEntity[0].linkPrecedence = "primary";
      const idsToUpdate: number[] = [];

      for (let i=1; i<existingEntity.length; i++) {
        idsToUpdate.push(existingEntity[i].id);
      }

      await txn
        .from<ContactEntity>('contact')
        .whereIn('id', idsToUpdate)
        .update({
          linkedId: existingEntity[0].id,
          linkPrecedence: "secondary"
        })

      await txn
        .from<ContactEntity>('contact')
        .where('id', '=', existingEntity[0].id)
        .update({
          linkedId: null,
          linkPrecedence: "primary"
        })

      // insert new contact
      const contactEntity: Omit<ContactEntity, "id" | "createdAt" | "updatedAt" |"deletedAt"> = {
        email,
        phone: phoneNumber,
        linkedId: existingEntity[0].id,
        linkPrecedence: "secondary"
      }
      const contactEntityReturned = await txn
        .insert(contactEntity)
        .into<ContactEntity>('contact')
        .returning('*')

      txn.commit();
      return contactEntityReturned[0];
    } catch (error: any) {
      this.logger.error('Error in add contact', { error: error.message });
      txn.rollback();
      throw error;
    }
  }

  get(
    email: string | null,
    phoneNumber: string | null
  ): Promise<ContactEntity[]> {
    throw new Error('Method not implemented.');
  }
}
