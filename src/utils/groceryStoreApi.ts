
// This is a utility service to handle grocery store API interactions
// Currently supports mock implementation with placeholders for real API integration

import { toast } from "@/components/ui/use-toast";

// Define interfaces for the grocery store API
export interface GroceryStore {
  id: string;
  name: string;
  logo: string;
  isAvailable: boolean;
}

export interface OrderResult {
  success: boolean;
  orderId?: string;
  message: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}

// List of supported grocery stores
export const groceryStores: GroceryStore[] = [
  {
    id: "publix",
    name: "Publix",
    logo: "https://images.unsplash.com/photo-1580913428023-02c695666d61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isAvailable: true,
  },
  {
    id: "whole-foods",
    name: "Whole Foods",
    logo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isAvailable: true,
  },
  {
    id: "kroger",
    name: "Kroger",
    logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isAvailable: false,
  },
];

/**
 * Send grocery items to a selected store for ordering
 * This is currently a mock implementation
 */
export async function sendToGroceryStore(
  storeId: string,
  items: Array<{ id: string; name: string; checked: boolean }>,
): Promise<OrderResult> {
  // Mock API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Only use items that are not checked (not already purchased)
  const itemsToOrder = items.filter((item) => !item.checked);

  if (itemsToOrder.length === 0) {
    return {
      success: false,
      message: "No items to order. Please add items to your list.",
      items: [],
    };
  }

  // In a real implementation, this would make an API call to the selected grocery store
  console.log(`Sending ${itemsToOrder.length} items to ${storeId} for ordering`);

  // Mock successful response
  return {
    success: true,
    orderId: `order-${Date.now()}`,
    message: "Order successfully created!",
    items: itemsToOrder.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: 1, // Default quantity
    })),
  };
}

/**
 * Helper function to initiate an order with a grocery store
 */
export async function createGroceryOrder(
  storeId: string,
  items: Array<{ id: string; name: string; checked: boolean }>,
) {
  try {
    // Get the store
    const store = groceryStores.find((s) => s.id === storeId);
    
    if (!store) {
      toast({
        title: "Store not found",
        description: "The selected grocery store is not available.",
        variant: "destructive",
      });
      return null;
    }
    
    if (!store.isAvailable) {
      toast({
        title: "Store not available",
        description: `${store.name} integration is coming soon!`,
        variant: "destructive",
      });
      return null;
    }

    // Send items to the store
    const result = await sendToGroceryStore(storeId, items);
    
    if (result.success) {
      toast({
        title: "Order created!",
        description: `Successfully sent ${result.items.length} items to ${store.name}.`,
      });
    } else {
      toast({
        title: "Order failed",
        description: result.message,
        variant: "destructive",
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error creating grocery order:", error);
    toast({
      title: "Order failed",
      description: "There was an error creating your order. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}
