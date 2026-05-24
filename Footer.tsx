export default function Footer() {
  return (
    <footer className="text-center py-3 px-4 border-t border-dark-border/30">
      <p className="text-text-muted text-xs">
        © 2026 Faizul Karim Jarif &nbsp;·&nbsp;
        <a
          href="/terms.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-accent transition-colors"
        >
          Terms
        </a>
        {' '}·{' '}
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-accent transition-colors"
        >
          Privacy
        </a>
      </p>
      <p className="text-text-muted/60 text-[10px] mt-0.5">
        Made with ⚛️ and 🧠
      </p>
    </footer>
  );
}
