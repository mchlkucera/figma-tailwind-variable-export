import { Banner, Button, IconWarning32, Modal, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { h } from "preact";

interface ErrorModalProps {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children?: React.ReactNode;
}

export const ErrorModal = ({ isOpen, onClose, title, children }: ErrorModalProps) => (
   <Modal open={isOpen} onCloseButtonClick={onClose} title={title}>
      <div style={{ padding: "12px", width: "380px" }}>
        {children}
         
      </div>
   </Modal>
); 