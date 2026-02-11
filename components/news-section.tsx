import FadeInSection from "./fade-in-section";

interface NewsItem {
  date: string;
  title: string;
  body: string[];
}

const newsItems: NewsItem[] = [
  {
    date: "2025.7.27",
    title: "プレオープンのお知らせ",
    body: [
      "現在、10月のプレオープンのために準備中です。",
      "営業日は不定期となっておりますので、下記のカレンダーにてご確認のうえお越しください。",
      "皆さまのお越しを心よりお待ちしております。",
    ],
  },
  {
    date: "2025.5.5",
    title: "ウェブサイト開設",
    body: [
      "Contrail Coffee & Chocolate の公式ウェブサイトを開設いたしました。",
      "最新情報はこちらのニュースページにてお知らせいたします。",
    ],
  },
  {
    date: "2025.4.1",
    title: "店舗準備中",
    body: [
      "埼玉県秩父市東町にて、コーヒーショップの開店準備を進めております。",
      "ニュージーランド発のスペシャルティコーヒーとクラフトチョコレートをお楽しみいただけるよう、準備に取り組んでおります。",
    ],
  },
];

export default function NewsSection() {
  return (
    <section className="bg-background py-16 sm:py-20 md:py-28 lg:py-36" id="news">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <FadeInSection className="mb-14 text-center sm:mb-18">
          <h2 className="font-sans text-xl font-light tracking-wide text-foreground sm:text-2xl lg:text-3xl">
            News
          </h2>
        </FadeInSection>

        <div className="flex flex-col gap-10 sm:gap-12">
          {newsItems.map((item, index) => (
            <FadeInSection key={item.date} delay={index * 100}>
              <article className="border-b border-border/60 pb-8 sm:pb-10">
                <div className="flex items-start gap-4 sm:gap-6">
                  <time className="min-w-[90px] shrink-0 font-sans text-sm font-light text-muted-foreground sm:min-w-[110px] sm:text-base">
                    {item.date}
                  </time>
                  <div className="flex-1">
                    <h3 className="mb-3 font-sans text-base font-light text-foreground sm:text-lg">
                      {item.title}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {item.body.map((paragraph, i) => (
                        <p
                          key={i}
                          className="font-sans text-sm font-light leading-relaxed text-muted-foreground sm:text-base"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
