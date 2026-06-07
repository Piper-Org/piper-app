import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QrScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (address: string) => void;
}

export function QrScannerDialog({ open, onOpenChange, onScan }: QrScannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90vw] mx-auto rounded-3xl overflow-hidden p-0 gap-0">
        <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold tracking-tight">Scan QR Code</DialogTitle>
          <DialogDescription>
            Point your camera at a Sui wallet address QR code.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-black aspect-square w-full relative">
          <Scanner 
            onScan={(result) => {
              if (result && result.length > 0) {
                // Return the first successfully scanned string
                onScan(result[0].rawValue);
              }
            }}
            onError={(error) => {
              console.error("QR Scan Error:", error);
            }}
            components={{
              audio: false, // Turn off beep sound
              tracker: true, // Show the framing guide
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
