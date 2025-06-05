import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Attachment } from "@/types";

interface AttachmentPreviewProps {
  attachment: Attachment;
  children: React.ReactNode;
}

const AttachmentPreview = ({
  attachment,
  children,
}: AttachmentPreviewProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl bg-[#313338] border-[#3F4147]">
        {attachment.type.startsWith("image/") && (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-full object-contain"
          />
        )}
        {attachment.type.startsWith("video/") && (
          <video controls className="w-full">
            <source src={attachment.url} type={attachment.type} />
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentPreview;
