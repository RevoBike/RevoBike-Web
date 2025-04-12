import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t border-gray-100">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 mx-auto md:flex-row">
        <div className="text-sm text-gray-500">Copyright © 2025 RevoBike</div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
          <a
            href="/privacy-policy"
            className="hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-700 transition-colors">
            Term and conditions
          </a>
          <a href="/contact" className="hover:text-gray-700 transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/"
            aria-label="Facebook"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconBrandFacebook size={18} />
          </a>
          <a
            href="/"
            aria-label="Twitter"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconBrandTwitter size={18} />
          </a>
          <a
            href="/"
            aria-label="Instagram"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconBrandInstagram size={18} />
          </a>
          <a
            href="/"
            aria-label="YouTube"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconBrandYoutube size={18} />
          </a>
          <a
            href="/"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconBrandLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
