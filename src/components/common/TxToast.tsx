import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function TxToaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg rounded-2xl p-4 gap-4",
          description: "group-[.toast]:text-slate-500",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 font-medium px-3 py-1.5 rounded-lg",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 font-medium px-3 py-1.5 rounded-lg",
          error: "group-[.toaster]:bg-rose-50 group-[.toaster]:text-rose-900 group-[.toaster]:border-rose-200",
          success: "group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-900 group-[.toaster]:border-emerald-200",
        },
      }}
      {...props}
    />
  );
}

// Helper utility for dispatching transaction-specific toasts
export const txToast = {
  success: (title: string, description?: string, explorerUrl?: string) => {
    toast.success(title, {
      description,
      action: explorerUrl ? {
        label: 'View on Explorer',
        onClick: () => window.open(explorerUrl, '_blank')
      } : undefined,
    });
  },
  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
    });
  },
  loading: (title: string, description?: string) => {
    return toast.loading(title, {
      description,
    });
  },
  dismiss: (id: string | number) => {
    toast.dismiss(id);
  }
};
