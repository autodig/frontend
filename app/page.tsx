import Hero from "@/components/Landing/hero";

export default async function Home() {
  return (
    <>
      <div className="flex flex-row gap-4 items-center  justify-around ">
        <Hero />
        <div className="flex flex-col gap-4">
          <a
            href="/dashboard"
            className="text-6xl font-bold px-12 py-6 bg-autodigPrimary text-white rounded-xl hover:bg-opacity-90 transition-all"
          >
            START NOW
          </a>
        </div>
      </div>
    </>
  );
}
