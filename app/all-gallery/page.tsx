import Gallery from "@/components/gallery";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AllGalleryPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold mb-8">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <Gallery />
      </div>
    </main>
  );
}
