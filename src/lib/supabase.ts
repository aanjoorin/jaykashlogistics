import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const generateQuoteReference = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `QT-${timestamp}-${random}`;
};

export const createQuote = async (quoteData: any) => {
  const reference = generateQuoteReference();
  
  const { data, error } = await supabase
    .from('quotes')
    .insert([
      {
        reference,
        customer_name: `${quoteData.firstName} ${quoteData.lastName}`,
        customer_email: quoteData.email,
        service_type: quoteData.serviceType,
        vehicle_category: quoteData.vehicleCategory,
        origin: quoteData.origin,
        destination: quoteData.destination
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getQuote = async (reference: string) => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('reference', reference)
    .single();

  if (error) throw error;
  return data;
};

export const approveQuote = async (reference: string, amount: number) => {
  const { data, error } = await supabase
    .from('quotes')
    .update({
      status: 'approved',
      amount,
      approved_at: new Date().toISOString(),
      approved_by: (await supabase.auth.getUser()).data.user?.id
    })
    .eq('reference', reference)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const rejectQuote = async (reference: string) => {
  const { error } = await supabase
    .from('quotes')
    .update({ status: 'rejected' })
    .eq('reference', reference);

  if (error) throw error;
};