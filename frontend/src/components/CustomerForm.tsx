'use client';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import type { Customer } from '../services/api';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Customer) => void;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = React.memo(({ customer, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Customer>({
    defaultValues: customer,
    mode: 'onChange'
  });

  // Debounce the form submission
  const debouncedSubmit = useCallback(
    debounce((data: Customer) => {
      try {
        onSubmit(data);
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    }, 300),
    [onSubmit]
  );

  const onSubmitForm = handleSubmit((data) => {
    debouncedSubmit(data);
  });

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { 
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' }
          })}
          className="input-field mt-1"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="input-field mt-1"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone', { 
            required: 'Phone is required',
            pattern: {
              value: /^[0-9-+() ]{10,}$/,
              message: 'Invalid phone number'
            }
          })}
          className="input-field mt-1"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          {...register('address', { 
            required: 'Address is required',
            minLength: { value: 5, message: 'Address must be at least 5 characters' }
          })}
          rows={3}
          className="input-field mt-1"
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            customer ? 'Update' : 'Create'
          )}
        </button>
      </div>
    </form>
  );
}); 