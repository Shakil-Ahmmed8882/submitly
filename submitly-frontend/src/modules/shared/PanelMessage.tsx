type TPanelMessageProps = {
  title: string;
  message: string;
};

// Error and empty state of a data area (a table or a list), not of a whole page.
export function PanelMessage(props: TPanelMessageProps) {
  const { title, message } = props;
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
