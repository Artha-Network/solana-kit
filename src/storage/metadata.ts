import { z } from "zod";

export const DealMetadataSchema = z.object({
  title: z.string().max(50),
  description: z.string().max(1000),
  terms_version: z.string(),
  parties: z.object({
    buyer_contact: z.string().email().optional(),
    seller_contact: z.string().email().optional(),
  }),
  attachments: z.array(z.string().url()).optional()
});

export type DealMetadata = z.infer<typeof DealMetadataSchema>;

export function formatMetadata(data: DealMetadata): string {
  // Validate before stringifying to ensure schema compliance
  const parsed = DealMetadataSchema.parse(data);
  return JSON.stringify(parsed);
}
