import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#4A3728] text-[#E8B4A8] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/tnl_beauty_/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors group"
            aria-label="Visit TNL Beauty on Instagram"
          >
            <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">@tnl_beauty_</span>
          </a>

          {/* Copyright */}
          <p className="text-sm text-[#E8B4A8]/70">
            © {new Date().getFullYear()} TNL Beauty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
