export default function Stars({ count = 5 }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 14 }} role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="#f59e0b">
          <path d="M8 1.3l1.8 3.7 4 .6-2.9 2.8.7 4L8 10.5 4.4 12.4l.7-4L2.2 5.6l4-.6L8 1.3z"/>
        </svg>
      ))}
    </div>
  );
}
