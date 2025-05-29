import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, MapPin, Car, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface DispatchRequestFormData {
  // Shipper Info
  shipperName: string;
  shipperPhone: string;
  shipperEmail: string;

  // Pickup Details
  pickupLocationType: 'residence' | 'auction';
  pickupAddress: string;
  pickupContactName: string;
  pickupContactPhone: string;

  // Delivery Details
  deliveryLocationType: 'port' | 'residence' | 'business';
  deliveryAddress: string;
  shipline: string;

  // Vehicle Info
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vinNumber: string;
  buyerName: string;
  buyerPhone: string;
  lotNumber: string;
  isRunner: boolean;
  isCarTitleReady: boolean;
}

interface Props {
  onSubmit: (data: DispatchRequestFormData) => void;
}

const DispatchRequestForm: React.FC<Props> = ({ onSubmit }) => {
  const location = useLocation();
  const isBooking = location.pathname.includes('/book-now');
  const { register, handleSubmit, formState: { errors } } = useForm<DispatchRequestFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipper Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Shipper Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="shipperName">Shipper Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="shipperName"
                className={`input-field pl-10 ${errors.shipperName ? 'border-error' : ''}`}
                {...register('shipperName', { required: 'Shipper name is required' })}
              />
            </div>
            {errors.shipperName && (
              <p className="text-error text-sm mt-1">{errors.shipperName.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="shipperPhone">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="tel"
                id="shipperPhone"
                className={`input-field pl-10 ${errors.shipperPhone ? 'border-error' : ''}`}
                {...register('shipperPhone', { required: 'Phone number is required' })}
              />
            </div>
            {errors.shipperPhone && (
              <p className="text-error text-sm mt-1">{errors.shipperPhone.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="label" htmlFor="shipperEmail">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="email"
                id="shipperEmail"
                className={`input-field pl-10 ${errors.shipperEmail ? 'border-error' : ''}`}
                {...register('shipperEmail', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.shipperEmail && (
              <p className="text-error text-sm mt-1">{errors.shipperEmail.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pickup Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Pickup Details</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Location Type *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="residence"
                  {...register('pickupLocationType', { required: true })}
                  className="mr-2"
                />
                Residence
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="auction"
                  {...register('pickupLocationType', { required: true })}
                  className="mr-2"
                />
                Auction
              </label>
            </div>
            {errors.pickupLocationType && (
              <p className="text-error text-sm mt-1">Please select a location type</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="pickupAddress">Pickup Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="pickupAddress"
                className={`input-field pl-10 ${errors.pickupAddress ? 'border-error' : ''}`}
                {...register('pickupAddress', { required: 'Pickup address is required' })}
              />
            </div>
            {errors.pickupAddress && (
              <p className="text-error text-sm mt-1">{errors.pickupAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="pickupContactName">Contact Name *</label>
              <input
                type="text"
                id="pickupContactName"
                className={`input-field ${errors.pickupContactName ? 'border-error' : ''}`}
                {...register('pickupContactName', { required: 'Contact name is required' })}
              />
              {errors.pickupContactName && (
                <p className="text-error text-sm mt-1">{errors.pickupContactName.message}</p>
              )}
            </div>
            
            <div>
              <label className="label" htmlFor="pickupContactPhone">Contact Phone *</label>
              <input
                type="tel"
                id="pickupContactPhone"
                className={`input-field ${errors.pickupContactPhone ? 'border-error' : ''}`}
                {...register('pickupContactPhone', { required: 'Contact phone is required' })}
              />
              {errors.pickupContactPhone && (
                <p className="text-error text-sm mt-1">{errors.pickupContactPhone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Location Type *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="port"
                  {...register('deliveryLocationType', { required: true })}
                  className="mr-2"
                />
                Port
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="residence"
                  {...register('deliveryLocationType', { required: true })}
                  className="mr-2"
                />
                Residence
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="business"
                  {...register('deliveryLocationType', { required: true })}
                  className="mr-2"
                />
                Business
              </label>
            </div>
            {errors.deliveryLocationType && (
              <p className="text-error text-sm mt-1">Please select a location type</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="deliveryAddress">Delivery Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="deliveryAddress"
                className={`input-field pl-10 ${errors.deliveryAddress ? 'border-error' : ''}`}
                {...register('deliveryAddress', { required: 'Delivery address is required' })}
              />
            </div>
            {errors.deliveryAddress && (
              <p className="text-error text-sm mt-1">{errors.deliveryAddress.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="shipline">Shipping Line</label>
            <input
              type="text"
              id="shipline"
              className="input-field"
              {...register('shipline')}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Vehicle Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label" htmlFor="vehicleYear">Year *</label>
              <input
                type="text"
                id="vehicleYear"
                className={`input-field ${errors.vehicleYear ? 'border-error' : ''}`}
                {...register('vehicleYear', { required: 'Vehicle year is required' })}
              />
              {errors.vehicleYear && (
                <p className="text-error text-sm mt-1">{errors.vehicleYear.message}</p>
              )}
            </div>
            
            <div>
              <label className="label" htmlFor="vehicleMake">Make *</label>
              <input
                type="text"
                id="vehicleMake"
                className={`input-field ${errors.vehicleMake ? 'border-error' : ''}`}
                {...register('vehicleMake', { required: 'Vehicle make is required' })}
              />
              {errors.vehicleMake && (
                <p className="text-error text-sm mt-1">{errors.vehicleMake.message}</p>
              )}
            </div>
            
            <div>
              <label className="label" htmlFor="vehicleModel">Model *</label>
              <input
                type="text"
                id="vehicleModel"
                className={`input-field ${errors.vehicleModel ? 'border-error' : ''}`}
                {...register('vehicleModel', { required: 'Vehicle model is required' })}
              />
              {errors.vehicleModel && (
                <p className="text-error text-sm mt-1">{errors.vehicleModel.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="vinNumber">VIN Number *</label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="vinNumber"
                className={`input-field pl-10 ${errors.vinNumber ? 'border-error' : ''}`}
                {...register('vinNumber', { required: 'VIN number is required' })}
              />
            </div>
            {errors.vinNumber && (
              <p className="text-error text-sm mt-1">{errors.vinNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="buyerName">Buyer Name *</label>
              <input
                type="text"
                id="buyerName"
                className={`input-field ${errors.buyerName ? 'border-error' : ''}`}
                {...register('buyerName', { required: 'Buyer name is required' })}
              />
              {errors.buyerName && (
                <p className="text-error text-sm mt-1">{errors.buyerName.message}</p>
              )}
            </div>
            
            <div>
              <label className="label" htmlFor="buyerPhone">Buyer Phone *</label>
              <input
                type="tel"
                id="buyerPhone"
                className={`input-field ${errors.buyerPhone ? 'border-error' : ''}`}
                {...register('buyerPhone', { required: 'Buyer phone is required' })}
              />
              {errors.buyerPhone && (
                <p className="text-error text-sm mt-1">{errors.buyerPhone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="lotNumber">Lot Number</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="lotNumber"
                className="input-field pl-10"
                {...register('lotNumber')}
              />
            </div>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isRunner')}
              />
              <span>Vehicle is a Runner</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isCarTitleReady')}
              />
              <span>Car/Title Ready</span>
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        {isBooking ? 'Book Now' : 'Request Quote'}
      </button>
    </form>
  );
};

export default DispatchRequestForm;