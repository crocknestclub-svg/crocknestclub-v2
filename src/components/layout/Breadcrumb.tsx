export default function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="text-sm text-gray-500 mb-4">
      {items.map((item, idx) => (
        <span key={item}>
          {item}
          {idx < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
