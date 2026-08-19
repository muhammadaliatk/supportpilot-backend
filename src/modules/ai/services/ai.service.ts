import { Injectable } from '@nestjs/common';
import { GeminiProvider } from '../providers/gemini.provider';

@Injectable()
export class AiService {
  constructor(private readonly geminiProvider: GeminiProvider) {}

  async generateText(prompt: string): Promise<string> {
    return this.geminiProvider.generateReply(prompt);
  }

  async generateCustomerReply(data: {
    subject: string;
    description: string;
    customer?: {
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
    } | null;
    comments?: Array<{
      message: string;
      createdAt: Date;
      user: {
        firstName: string | null;
        lastName: string | null;
      };
    }>;
  }): Promise<string> {
    const commentsText =
      data.comments && data.comments.length > 0
        ? data.comments
            .map((comment) => {
              const author =
                `${comment.user.firstName ?? ''} ${comment.user.lastName ?? ''}`.trim();

              return `[${comment.createdAt.toISOString()}] ${
                author || 'Unknown User'
              }: ${comment.message}`;
            })
            .join('\n')
        : 'No previous comments.';

    const customerName = data.customer
      ? `${data.customer.firstName ?? ''} ${
          data.customer.lastName ?? ''
        }`.trim()
      : 'Customer';

    const prompt = `
You are an AI customer support assistant for SupportPilot.

Generate the NEXT customer-facing response based on the ticket and conversation history.

Rules:
- Return ONLY the customer-facing response.
- Do not explain your reasoning.
- Do not provide multiple options.
- Do not use markdown headings.
- Be professional, helpful, and empathetic.
- Consider the complete conversation history before responding.
- Do not repeat questions that the customer has already answered.
- Do not invent customer information, account information, or system information.
- If required information is missing, ask only for information that is necessary.
- Keep the response concise and natural.
- Do not mention that you are an AI.

Customer:
${customerName}

Customer Email:
${data.customer?.email ?? 'Not available'}

Ticket Subject:
${data.subject}

Ticket Description:
${data.description}

Conversation History:
${commentsText}
`;

    return this.geminiProvider.generateReply(prompt);
  }
}
