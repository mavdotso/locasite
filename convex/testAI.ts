import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const testAIGeneration = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; result?: any; error?: string }> => {
    try {
      console.log('Testing AI generation...');
      
      const result: any = await ctx.runAction(api.aiContentGenerator.generateBusinessContent, {
        businessData: {
          name: "Test Restaurant",
          address: "123 Test Street, Test City",
          phone: "+1234567890", 
          website: "https://test.com",
          description: "A great test restaurant",
          reviews: [
            {
              reviewer: "John Doe",
              rating: "5 stars",
              text: "Great food and service!"
            }
          ],
          rating: 4.5
        }
      });
      
      console.log('AI test successful:', Object.keys(result.content));
      return { success: true, result };
    } catch (error) {
      console.error('AI test failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
});