import { supabase } from './supabase';

export interface Summary {
  id: string;
  user_id: string;
  transcript: string;
  summary: {
    generalPoints: string[];
    individualPoints: Record<string, string[]>;
  };
  created_at: string;
}

export const summaryService = {
  async loadSummaries(userId: string): Promise<Summary[]> {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error && !data) {
      console.error('Error loading summaries:', error);
      throw error;
    }

    return data || [];
  },

  async addSummary(userId: string, transcript: string, summary: Summary['summary']): Promise<Summary> {
    const { data, error } = await supabase
      .from('summaries')
      .insert({
        user_id: userId,
        transcript,
        summary,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving summary:', error);
      throw error;
    }

    return data;
  },

  async removeSummary(id: string): Promise<void> {
    const { error } = await supabase
      .from('summaries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting summary:', error);
      throw error;
    }
  }
}; 