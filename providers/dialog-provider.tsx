"use client";

import UploadDialog from "@/components/upload-dialog";
import { useEffect, useState } from "react";

const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return ( 
    <UploadDialog />
   );
}
 
export default DialogProvider;