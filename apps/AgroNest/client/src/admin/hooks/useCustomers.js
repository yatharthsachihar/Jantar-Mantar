import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import toast from "react-hot-toast";

export function useCustomers() {
  const queryClient = useQueryClient();

  // Query to get all customers
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => userApi.getAll().then(r => r.data),
  });

  // Mutation to update customer status
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      const updatedUser = res.data;
      if (updatedUser.isActive) {
        toast.success(`Account for "${updatedUser.fullName}" is now Active`);
      } else {
        toast.success(`Account for "${updatedUser.fullName}" is now Inactive`);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update customer status");
    },
  });

  // Mutation to soft-delete/deactivate customer
  const deactivateMutation = useMutation({
    mutationFn: (id) => userApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("Customer account deactivated successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to deactivate customer");
    },
  });

  const toggleActive = (id, isCurrentlyActive) => {
    updateMutation.mutate({ id, data: { isActive: !isCurrentlyActive } });
  };

  const removeCustomer = (id) => {
    deactivateMutation.mutate(id);
  };

  return {
    customers,
    isLoading,
    error,
    toggleActive,
    removeCustomer,
    isUpdating: updateMutation.isPending,
    isRemoving: deactivateMutation.isPending,
  };
}
