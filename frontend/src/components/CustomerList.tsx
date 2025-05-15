import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService, type Customer } from '../services/api';
import { CustomerForm } from './CustomerForm';
import { CustomerDataView } from './CustomerDataView';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useVirtualizer } from '@tanstack/react-virtual';

export const CustomerList: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  const rowVirtualizer = useVirtualizer({
    count: customers?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimated row height
    overscan: 5, // Number of items to render outside of the visible area
  });

  const createMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsFormOpen(false);
      toast.success('Customer created successfully!');
    },
    onError: () => {
      toast.error('Failed to create customer. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, customer }: { id: number; customer: Customer }) =>
      customerService.update(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsFormOpen(false);
      setSelectedCustomer(undefined);
      toast.success('Customer updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update customer. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete customer. Please try again.');
    },
  });

  const handleSubmit = useCallback((data: Customer) => {
    if (selectedCustomer?.id) {
      updateMutation.mutate({ id: selectedCustomer.id, customer: data });
    } else {
      createMutation.mutate(data);
    }
  }, [selectedCustomer, updateMutation, createMutation]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error loading customers. Please try again later.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <div className="flex gap-4">
          <CustomerDataView />
          <button
            onClick={() => {
              setSelectedCustomer(undefined);
              setIsFormOpen(true);
            }}
            className="btn-primary"
          >
            Add Customer
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedCustomer ? 'Edit Customer' : 'Add Customer'}
              </h3>
              <CustomerForm
                customer={selectedCustomer}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedCustomer(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div 
        ref={parentRef}
        className="bg-white shadow-md rounded-lg overflow-hidden"
        style={{ height: '600px', overflow: 'auto' }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              <td colSpan={5}>
                <div style={{ position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const customer = customers![virtualRow.index];
                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 absolute top-0 left-0 w-full"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {customer.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsFormOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => customer.id && handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}; 