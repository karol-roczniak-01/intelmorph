import { createClient } from "@/utils/supabase/server";
import { Products } from "./components/plans";

export default async function Plans() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch products with their prices
  const { data: products } = await supabase
    .from('products')
    .select(`*, prices (id, product_id, unit_amount, interval)`)
    .order('name');

  // Fetch user's active subscriptions
  const { data: subscriptions } = await supabase
    .from('customers')
    .select(`subscriptions (price_id, status)`)
    .eq('user_id', user?.id)
    .single();

  return (
    <Products 
      user={user}
      products={products}
      subscriptions={subscriptions}
    />
  );
}