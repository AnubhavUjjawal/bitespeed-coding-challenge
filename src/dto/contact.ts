import {z} from 'zod';

export interface AddContactDto {
  email: string | null;
  phoneNumber: string | null;
}

export const AddContactDtoValidator = z
  .object({
    email: z.string().email().nullable(),
    phoneNumber: z.number({coerce: true}).nullable(),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.email && !data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: "phoneNumber should be set if email isn't",
      });
    }
  });

export interface ContactDto {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
