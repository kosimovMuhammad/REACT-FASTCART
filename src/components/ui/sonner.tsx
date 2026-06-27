import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="system"
    position="top-right"
    richColors
    closeButton
    toastOptions={{
      duration: 3500,
      classNames: {
        toast:
          "!font-poppins !rounded-2xl !border !border-gray-100 dark:!border-[#222] !bg-white dark:!bg-[#111] !text-black dark:!text-white !shadow-2xl !shadow-black/10",
        title: "!font-semibold !text-[14px]",
        description: "!text-gray-500 dark:!text-gray-400 !text-[13px]",
        closeButton:
          "!bg-gray-100 dark:!bg-[#222] !border-0 hover:!bg-gray-200 dark:hover:!bg-[#333]",
      },
    }}
    {...props}
  />
)

export { Toaster, toast }
