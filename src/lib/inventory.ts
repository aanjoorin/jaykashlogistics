import { supabase } from './supabase';

interface VehicleSlot {
  id: string;
  location: string;
  status: 'available' | 'reserved' | 'occupied';
  vehicle_type: string;
  booking_ref?: string;
  updated_at: string;
}

export const checkAvailability = async (
  location: string,
  vehicleType: string,
  date: string
): Promise<boolean> => {
  try {
    const { data: slots, error } = await supabase
      .from('vehicle_slots')
      .select('*')
      .eq('location', location)
      .eq('vehicle_type', vehicleType)
      .eq('status', 'available')
      .gte('available_date', date)
      .limit(1);

    if (error) throw error;
    return slots && slots.length > 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
};

export const reserveSlot = async (
  location: string,
  vehicleType: string,
  bookingRef: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicle_slots')
      .update({
        status: 'reserved',
        booking_ref: bookingRef,
        updated_at: new Date().toISOString()
      })
      .eq('location', location)
      .eq('vehicle_type', vehicleType)
      .eq('status', 'available')
      .limit(1);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error reserving slot:', error);
    return false;
  }
};

export const releaseSlot = async (bookingRef: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicle_slots')
      .update({
        status: 'available',
        booking_ref: null,
        updated_at: new Date().toISOString()
      })
      .eq('booking_ref', bookingRef);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error releasing slot:', error);
    return false;
  }
};

export const getSlotStatus = async (bookingRef: string): Promise<VehicleSlot | null> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_slots')
      .select('*')
      .eq('booking_ref', bookingRef)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting slot status:', error);
    return null;
  }
};