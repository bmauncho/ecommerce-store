"use client";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";

const Summary = () => {
  const searchParams = useSearchParams();

  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success(
        items.length > 1
          ? "Orders placed successfully!"
          : "Order placed successfully!"
      );
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error(items.length > 1 ? "Orders canceled!" : "Order canceled!");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const onCheckOut = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
        email: "test@example.com",
      }
    );

    window.location = response.data.url;
  };

  return (
    <div className="mt-16 bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        {/* Empty cart message */}
        {items.length === 0 && (
          <p className="text-neutral-500">No items added to cart.</p>
        )}

        {/* Item list */}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate max-w-[65%]">
              {item.name}
            </p>
            <Currency value={item.price} />
          </div>
        ))}

        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        onClick={onCheckOut}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        CheckOut
      </Button>
    </div>
  );
};

export default Summary;
