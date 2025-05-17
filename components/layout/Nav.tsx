import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-4 items-center font-semibold">
          <Image
            src="/logo-no-background.png"
            alt="AutoDig"
            width={15}
            height={15}
          />
          <Link href={"/"} className="text-autodigPrimary">
            AUTODIG
          </Link>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>
    </nav>
  );
}
