import { useState } from "react";
import { Attachment } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AttachmentPreviewProps {
  attachment: Attachment;
}

const AttachmentPreview = ({ attachment }: AttachmentPreviewProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = attachment?.type?.startsWith("image/");
  const isVideo = attachment?.type?.startsWith("video/");

  if (!attachment || (!isImage && !isVideo)) return null;

  return (
    <>
      <div
        onClick={() => setShowPreview(true)}
        className="cursor-pointer hover:opacity-90 transition-opacity"
      >
        {isImage && (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-md max-h-48 rounded-lg object-contain"
          />
        )}
        {isVideo && (
          <div className="relative max-w-md">
            <video className="rounded-lg w-full">
              <source src={attachment.url} type={attachment.type} />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                <div className="w-0 h-0 border-l-8 border-l-black border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showPreview} onOpenChange={(open) => setShowPreview(open)}>
        <DialogContent className="bg-[#36393F] text-white border-none max-w-4xl p-2">
          <div className="mt-4">
            {isImage && (
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
            {isVideo && (
              <video
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg"
              >
                <source src={attachment.url} type={attachment.type} />
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttachmentPreview;
