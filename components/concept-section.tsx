import FadeInSection from "./fade-in-section";

export default function ConceptSection() {
  return (
    <section className="relative w-full overflow-hidden bg-foreground">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/assets/images/concept-image.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-foreground/80" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <FadeInSection className="mb-16 text-center sm:mb-20 md:mb-28">
            <h2 className="mb-6 font-serif text-3xl leading-tight tracking-tight text-background sm:text-4xl md:text-5xl lg:text-6xl">
              {"Enjoy a cup of coffee"}
              <br />
              {"Have a good day"}
            </h2>
            <p className="font-sans text-base leading-relaxed text-background/80 sm:text-lg md:text-xl">
              {"Speciality coffee from New Zealand"}
              <br />
              {"Delivered to Ohanabatake"}
            </p>
          </FadeInSection>

          <FadeInSection className="text-center" delay={300}>
            <p className="font-serif text-lg leading-loose text-background/70 sm:text-xl">
              {"空を見上げるように、今日を見つめる。"}
            </p>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
