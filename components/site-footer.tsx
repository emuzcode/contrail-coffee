export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-12">
        <div className="flex flex-col items-center gap-6">
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/chichibu.chocolate.factory?igsh=MTFvczVmZmhwOGR1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-sans text-sm font-light text-foreground shadow-sm transition-all duration-300 hover:bg-muted hover:shadow"
          >
            <img
              src="/assets/icons/Instagram_Glyph_Gradient.png"
              alt="Instagram"
              className="h-5 w-5"
            />
            <span>フォローはこちらから</span>
          </a>

          <p className="font-sans text-xs font-light text-muted-foreground">
            {"copyright\u00A9 合同会社コントレイル All Right Reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}
