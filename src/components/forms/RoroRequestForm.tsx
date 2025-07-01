import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, MapPin, Car, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { originPorts, carriers, vehicleCategories } from '../../data/services';

interface RoroRequestFormData {
  // Shipper Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipline Info
  loadingPort: string;
  dischargePort: string;
  carrier: string;

  // Receiver Info
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;

  // Additional Info
  notifyParty: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vinNumber: string;
  titleNumber: string;
  titleState: string;
  declaredValue: string;
  vehicleCategory: string;
  vehicleCondition?: string;
}

interface Props {
  onSubmit: (data: RoroRequestFormData) => void;
  isSubmitting: boolean;
}

const RoroRequestForm: React.FC<Props> = ({ onSubmit, isSubmitting }) => {
  const location = useLocation();
  const isBooking = location.pathname.includes('/book-now');
  const { register, handleSubmit, formState: { errors } } = useForm<RoroRequestFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Shipper Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Shipper Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="firstName">First Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="firstName"
                className={`input-field pl-10 ${errors.firstName ? 'border-error' : ''}`}
                {...register('firstName', { required: 'First name is required' })}
              />
            </div>
            {errors.firstName && (
              <p className="text-error text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="lastName">Last Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                id="lastName"
                className={`input-field pl-10 ${errors.lastName ? 'border-error' : ''}`}
                {...register('lastName', { required: 'Last name is required' })}
              />
            </div>
            {errors.lastName && (
              <p className="text-error text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="phone">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="tel"
                id="phone"
                className={`input-field pl-10 ${errors.phone ? 'border-error' : ''}`}
                {...register('phone', { required: 'Phone number is required' })}
              />
            </div>
            {errors.phone && (
              <p className="text-error text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="email">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                className={`input-field pl-10 ${errors.email ? 'border-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipline Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Shipline Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="loadingPort">Loading Port *</label>
            <select
              id="loadingPort"
              className={`input-field ${errors.loadingPort ? 'border-error' : ''}`}
              {...register('loadingPort', { required: 'Loading port is required' })}
            >
              <option value="">Select loading port</option>
              {originPorts.map(port => (
                <option key={port} value={port}>{port}</option>
              ))}
            </select>
            {errors.loadingPort && (
              <p className="text-error text-sm mt-1">{errors.loadingPort.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="carrier">Carrier *</label>
            <select
              id="carrier"
              className={`input-field ${errors.carrier ? 'border-error' : ''}`}
              {...register('carrier', { required: 'Carrier is required' })}
            >
              <option value="">Select carrier</option>
              {carriers.map(carrier => (
                <option key={carrier} value={carrier}>{carrier}</option>
              ))}
            </select>
            {errors.carrier && (
              <p className="text-error text-sm mt-1">{errors.carrier.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="label" htmlFor="dischargePort">Discharge Port *</label>
            <input
              type="text"
              id="dischargePort"
              className={`input-field ${errors.dischargePort ? 'border-error' : ''}`}
              {...register('dischargePort', { required: 'Discharge port is required' })}
            />
            {errors.dischargePort && (
              <p className="text-error text-sm mt-1">{errors.dischargePort.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Receiver Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Receiver Information</h3>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="consigneeName">Consignee Name *</label>
            <input
              type="text"
              id="consigneeName"
              className={`input-field ${errors.consigneeName ? 'border-error' : ''}`}
              {...register('consigneeName', { required: 'Consignee name is required' })}
            />
            {errors.consigneeName && (
              <p className="text-error text-sm mt-1">{errors.consigneeName.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="consigneeAddress">Consignee Address *</label>
            <textarea
              id="consigneeAddress"
              className={`input-field ${errors.consigneeAddress ? 'border-error' : ''}`}
              rows={3}
              {...register('consigneeAddress', { required: 'Consignee address is required' })}
            />
            {errors.consigneeAddress && (
              <p className="text-error text-sm mt-1">{errors.consigneeAddress.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="consigneePhone">Consignee Phone *</label>
            <input
              type="tel"
              id="consigneePhone"
              className={`input-field ${errors.consigneePhone ? 'border-error' : ''}`}
              {...register('consigneePhone', { required: 'Consignee phone is required' })}
            />
            {errors.consigneePhone && (
              <p className="text-error text-sm mt-1">{errors.consigneePhone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="notifyParty">Notify Party</label>
            <input
              type="text"
              id="notifyParty"
              className="input-field"
              {...register('notifyParty')}
            />
          </div>

          <div>
            <label className="label" htmlFor="vehicleCategory">Vehicle Category *</label>
            <select
              id="vehicleCategory"
              className={`input-field ${errors.vehicleCategory ? 'border-error' : ''}`}
              {...register('vehicleCategory', { required: 'Vehicle category is required' })}
            >
              <option value="">Select vehicle category</option>
              {vehicleCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.id} ({category.name})
                </option>
              ))}
            </select>
            {errors.vehicleCategory && (
              <p className="text-error text-sm mt-1">{errors.vehicleCategory.message}</p>
            )}
          </div>
          
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
              <label className="label" htmlFor="titleNumber">Title Number *</label>
              <input
                type="text"
                id="titleNumber"
                className={`input-field ${errors.titleNumber ? 'border-error' : ''}`}
                {...register('titleNumber', { required: 'Title number is required' })}
              />
              {errors.titleNumber && (
                <p className="text-error text-sm mt-1">{errors.titleNumber.message}</p>
              )}
            </div>
            
            <div>
              <label className="label" htmlFor="titleState">Title State *</label>
              <input
                type="text"
                id="titleState"
                className={`input-field ${errors.titleState ? 'border-error' : ''}`}
                {...register('titleState', { required: 'Title state is required' })}
              />
              {errors.titleState && (
                <p className="text-error text-sm mt-1">{errors.titleState.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="label" htmlFor="declaredValue">Declared Value *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <input
                type="text"
                id="declaredValue"
                className={`input-field pl-8 ${errors.declaredValue ? 'border-error' : ''}`}
                {...register('declaredValue', { required: 'Declared value is required' })}
              />
            </div>
            {errors.declaredValue && (
              <p className="text-error text-sm mt-1">{errors.declaredValue.message}</p>
            )}
          </div>
          
          <div>
            <label className="label" htmlFor="vehicleCondition">Vehicle Condition Notes</label>
            <textarea
              id="vehicleCondition"
              className="input-field"
              rows={3}
              placeholder="Describe any existing damage or special conditions..."
              {...register('vehicleCondition')}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : isBooking ? 'Book Now' : 'Request Quote'}
      </button>
    </form>
  );
};

export default RoroRequestForm;