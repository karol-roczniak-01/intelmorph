import { create } from 'zustand';

interface UploadDialogStore {
  isOpen: boolean;
  userId: string | null;
  category: string | null;
  onOpen: (userId: string, category: string) => void;
  onClose: () => void;
}

const useUploadDialog = create<UploadDialogStore>((set) => ({
  isOpen: false, userId: null,  category: null,
  onOpen: (userId, category) => set ({isOpen: true, userId, category}),
  onClose: () => set ({isOpen: false, userId: null, category: null}),
}));

export default useUploadDialog;
