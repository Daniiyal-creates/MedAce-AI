import AppLayout from "@/components/layout/AppLayout";

/**
 * Persistent shell for all authenticated app pages. Because this layout is
 * shared by every route in the (app) group, the Navbar/Sidebar chrome is
 * mounted once and survives client-side navigation — pages only swap their
 * own content instead of re-rendering the whole frame.
 */
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
