// app/plans/plans-client.tsx
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorRedirect } from "@/lib/helpers";
import { Tables } from "@/types_db";
import { getStripe } from "@/utils/stripe/client";
import { checkoutWithStripe, createStripePortal } from "@/utils/stripe/server";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface ProductsProps {
  user: User | null | undefined;
  products: ProductWithPrices[] | null;
  subscriptions: SubscriptionWithProduct | null | any;
}

export function Products({ user, products, subscriptions }: ProductsProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to check if user is subscribed to a product
  const isSubscribed = (priceId: string) => {
    return subscriptions?.subscriptions?.some(
      (sub: any) => sub.price_id === priceId && sub.status === 'active'
    );
  };

  // Create stripe checkout
  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/sign-in');
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe((price as any), currentPath);
    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }
    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(getErrorRedirect(currentPath, 'An unknown error occurred.', 'Please try again later.'));
    }
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
    setPriceIdLoading(undefined);
  };

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <div className="flex flex-col md:gap-12 md:px-24 md:py-12 gap-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="flex flex-col hover:bg-card cursor-default">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">
                  {product.name}
                </CardTitle>
                {product.prices?.some((price: any) => isSubscribed(price.id)) && (
                  <Badge className="bg-green-500">Current Plan</Badge>
                )}
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
              {product.prices?.map((price: any) => (
                <div key={price.id} className="mt-4">
                  <p className="text-2xl font-bold">
                    ${(price.unit_amount / 100).toFixed(2)}
                    <span className="text-sm font-normal">
                      /{price.interval}
                    </span>
                  </p>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              {product.prices?.map((price: any) => (
                <div key={price.id} className="w-full">
                  {isSubscribed(price.id) ? (
                    <Button 
                      onClick={handleStripePortalRequest}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      Manage
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => handleStripeCheckout(price)}
                      disabled={priceIdLoading === price.id || isSubmitting}
                    >
                      {priceIdLoading === price.id ? 'Loading...' : 'Subscribe'}
                    </Button>
                  )}
                </div>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}