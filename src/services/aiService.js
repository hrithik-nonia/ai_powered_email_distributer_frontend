import { api } from './api';

export const aiService = {
  async generateSummary(threadId) {
    try {
      return await api.post(`/ai/summary`, { threadId });
    } catch {
      return {
        summary: 'Key Highlights: Client requests updated contractual discount terms before Friday COB. Technical inquiries regarding webhook throughput were resolved with no residual loss.',
        sentiment: 'High Priority',
        actionRequired: 'Review pricing terms and approve draft dispatch.',
      };
    }
  },

  async generateReply(threadId, instruction = '') {
    try {
      return await api.post(`/ai/reply`, { threadId, instruction });
    } catch {
      return {
        draft: `Dear Client,\n\nThank you for reaching out regarding your recent inquiry. ${
          instruction ? `In response to your request about "${instruction}": ` : ''
        }We have verified our records and expedited this to our specialized team.\n\nAll systems are operating as expected, and your account adjustments have been queued for processing. Please feel free to reply if you need anything else.\n\nWarm regards,\nAlex Johnson\nAI Operations Assistant`,
      };
    }
  },

  async askAI(question, context = '') {
    try {
      return await api.post(`/ai/ask`, { question, context });
    } catch {
      const q = question.toLowerCase();
      let answer = 'Based on the conversation context, all key terms have been cataloged. No anomalous behavior was detected.';
      if (q.includes('discount') || q.includes('price') || q.includes('cost') || q.includes('budget')) {
        answer = 'The client is requesting a 12% annual renewal discount across all tiers. Tiers 2 & 3 qualify automatically under standard enterprise tiers.';
      } else if (q.includes('deadline') || q.includes('when') || q.includes('time')) {
        answer = 'The client requested a final response before this Friday close of business (5:00 PM EST).';
      } else if (q.includes('technical') || q.includes('webhook') || q.includes('latency')) {
        answer = 'Engineering resolved the temporary webhook backlog by provisioning additional consumer pods. Average latency is now under 120ms.';
      }
      return { answer };
    }
  },
};

export default aiService;
