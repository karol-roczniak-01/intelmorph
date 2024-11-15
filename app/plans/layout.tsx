import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/">Home</Link>
        </Button>
      </div>
      {children}
    </div>
  );
}
