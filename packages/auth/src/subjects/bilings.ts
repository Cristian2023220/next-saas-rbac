import {z} from 'zod';

export const bilingSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('export'),
  ]),
  z.literal('Billing'),
])


export type BilingSubject = z.infer<typeof bilingSubject>;