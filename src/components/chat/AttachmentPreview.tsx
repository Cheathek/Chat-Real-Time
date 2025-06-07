import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Attachment } from "@/types";

interface AttachmentPreviewProps {
  attachment: Attachment;
  children: React.ReactNode;
}

const AttachmentPreview = ({
  attachment,
  children,
}: AttachmentPreviewProps) => {
  const isImage = attachment.type.startsWith("image/");
  const isVideo = attachment.type.startsWith("video/");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={`
          max-w-4xl p-0 overflow-hidden
          ${
            isImage
              ? "bg-transparent border-0"
              : "bg-[#313338] border-[#3F4147]"
          }
        `}
      >
        {/* Custom close button (using Lucide X) */}
        <button
          className={`
            absolute right-2 top-2 z-50
            p-1.5 rounded-full
            bg-black/50 hover:bg-black/70
            text-white/90 hover:text-white
            transition-all
            focus:outline-none focus:ring-0
            ${isImage ? "" : "bg-[#3F4147] hover:bg-[#4E5158]"}
          `}
          onClick={(e) => {
            e.preventDefault();
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Escape" })
            );
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {isImage && (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-full max-h-[80vh] object-contain"
          />
        )}
        {isVideo && (
          <video controls className="w-full">
            <source src={attachment.url} type={attachment.type} />
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentPreview;
