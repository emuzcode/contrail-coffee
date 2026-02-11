import FadeInSection from "./fade-in-section";

export default function AccessSection() {
  return (
    <section className="bg-card py-16 sm:py-20 md:py-28 lg:py-36" id="access">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-12">
        <FadeInSection className="mb-14 sm:mb-18">
          <p className="font-serif text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {"御花畑で皆さまをお迎えできる日を、"}
            <br className="sm:hidden" />
            {"心よりお待ちしております。"}
          </p>
        </FadeInSection>

        {/* Map */}
        <FadeInSection className="mb-14 sm:mb-18" delay={100}>
          <div className="overflow-hidden rounded-2xl shadow-lg sm:rounded-3xl">
            <iframe
              className="h-[200px] w-full sm:h-[250px] md:h-[300px] lg:h-[400px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3232.9!2d139.0864!3d35.9906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s21-15+Higashimachi%2C+Chichibu%2C+Saitama+368-0042%2C+Japan!5e0!3m2!1sja!2sjp!4v1671234567890!5m2!1sja!2sjp"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Contrail Coffee - 21-15 Higashimachi, Chichibu"
            />
          </div>
        </FadeInSection>

        {/* Address */}
        <FadeInSection className="mb-10 sm:mb-14" delay={200}>
          <div className="flex flex-col gap-4">
            <div className="mx-auto mb-4 w-44 sm:w-52 lg:w-60">
              <img
                src="/assets/images/contrail-logo-transparent.png"
                alt="Contrail Coffee & Chocolate"
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 font-sans text-sm font-light text-muted-foreground sm:text-base lg:text-lg">
              <p>{"\u3012368-0042"}</p>
              <p>{"埼玉県秩父市東町21-15"}</p>
            </div>
            <p className="font-sans text-sm font-light text-muted-foreground sm:text-base lg:text-lg">
              {"駐車場・駐輪場なし"}
            </p>
          </div>
        </FadeInSection>

        {/* Google Maps button */}
        <FadeInSection delay={300}>
          <a
            href="https://www.google.com/maps/place/21-15+Higashimachi,+Chichibu,+Saitama+368-0042,+Japan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-sans text-sm font-light text-foreground shadow-sm transition-all duration-300 hover:bg-muted hover:shadow sm:py-3 sm:text-sm lg:text-base"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span>Google Maps で開く</span>
          </a>
        </FadeInSection>
      </div>
    </section>
  );
}
