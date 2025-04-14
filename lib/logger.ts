import { supabase } from './supabase';

export async function logError(error: Error, context?: Record<string, any>) {
  try {
    await supabase.from('error_logs').insert({
      message: error.message,
      stack: error.stack,
      context: context || {},
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to log error:', e);
  }
}

export async function logInfo(message: string, context?: Record<string, any>) {
  try {
    await supabase.from('info_logs').insert({
      message,
      context: context || {},
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to log info:', e);
  }
} 