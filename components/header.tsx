import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "#" },
    { name: "OUR TEAM", href: "#" },
    { name: "PROJECTS", href: "#" },
    { name: "PUBLICATIONS", href: "#" },
    { name: "RESEARCH", href: "#" },
    { name: "RESOURCES", href: "#" },
    { name: "ACTIVITIES", href: "#" },
    { name: "GALLERY", href: "#" },
    { name: "CONTACT", href: "#" },
  ];

  return (
    <header className="w-full">
      {/* Top Part: Black Background */}
      <div className="bg-black text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo and Name */}
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded">
            <Image
              src="/vercel.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-[#3b82f6]">SINGHLAB</h1>
            <p className="text-xs font-semibold tracking-widest text-[#ef4444] uppercase">Environment</p>
          </div>
        </div>

        {/* Center: Description */}
        <div className="max-w-md text-center">
          <p className="text-gray-400 text-sm leading-tight">
            Research, education, and community action for a sustainable future.
          </p>
        </div>

        {/* Right: Social Icons (Placeholder Icons) */}
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-white"><i className="text-lg">🌐</i></button>
          <button className="hover:text-white"><i className="text-lg">f</i></button>
          <button className="hover:text-white"><i className="text-lg">𝕏</i></button>
          <button className="hover:text-white"><i className="text-lg">in</i></button>
          <button className="hover:text-white"><i className="text-lg">▶</i></button>
        </div>
      </div>

      {/* Bottom Part: Blue Navigation */}
      <nav className="bg-[#2563eb] text-white">
        <div className="max-w-screen-xl mx-auto px-4 overflow-x-auto">
          <ul className="flex items-center justify-center md:justify-end gap-6 py-3 whitespace-nowrap text-[13px] font-bold">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`hover:opacity-80 transition-opacity ${link.name === "HOME" ? "text-[#f87171]" : "text-white"}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
