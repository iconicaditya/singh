import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0f172a] text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
        {/* Left Column: Brand and Description */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            <span className="text-[#3b82f6]">SINGH LAB</span> | <span className="text-white">{t("ENVIRONMENT")}</span>
          </h2>
          <p className="text-sm leading-relaxed">
            {t("TAGLINE_1")}
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h3 className="text-white font-bold tracking-wider uppercase text-sm border-b-2 border-[#2563eb] inline-block pb-1">{t("QUICK_LINKS")}</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">{t("HOME")}</Link></li>
            <li><Link href="/#about" className="hover:text-white transition-colors">{t("ABOUT")}</Link></li>
            <li><Link href="/publications" className="hover:text-white transition-colors">{t("PUBLICATIONS")}</Link></li>
            <li><Link href="/our-team" className="hover:text-white transition-colors">{t("OUR_TEAM")}</Link></li>
            <li><Link href="/#contact" className="hover:text-white transition-colors">{t("CONTACT")}</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div className="space-y-6">
          <h3 className="text-white font-bold tracking-wider uppercase text-sm border-b-2 border-[#2563eb] inline-block pb-1">{t("CONTACT_INFO")}</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#3b82f6] shrink-0 mt-0.5" />
              <span>Kobe City University of Foreign Studies, Kobe, Japan</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#3b82f6] shrink-0" />
              <Link href="mailto:contact@singhlab.org" className="hover:text-white transition-colors">contact@singhlab.org</Link>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#3b82f6] shrink-0" />
              <span>+81 78-794-8111</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Find Us & Social */}
        <div className="space-y-6">
          <h3 className="text-white font-bold tracking-wider uppercase text-sm border-b-2 border-[#2563eb] inline-block pb-1">{t("FOLLOW_US")}</h3>
          <div className="rounded-lg overflow-hidden h-32 w-full grayscale contrast-125 opacity-70 hover:opacity-100 transition-opacity">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.926!2d135.0606425!3d34.6799958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000813c015ac961:0x668148a0445486eb!2sKobe%20City%20University%20of%20Foreign%20Studies!5e0!3m2!1sen!2sjp!4v1705000000000" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <Link key={i} href="#" className="bg-[#1e293b] p-2 rounded hover:bg-[#334155] hover:text-white transition-all">
                <Icon size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>{t("FOOTER_TEXT")}</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">{t("PRIVACY_POLICY")}</Link>
          <Link href="#" className="hover:text-white transition-colors">{t("TERMS_OF_USE")}</Link>
        </div>
      </div>
    </footer>
  );
}
