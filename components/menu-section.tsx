import FadeInSection from "./fade-in-section";

interface MenuItem {
  name: string;
  note?: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    title: "コーヒー / Allpress Espresso",
    items: [
      { name: "ドリップコーヒー", note: "ホット／アイス" },
      { name: "カフェラテ", note: "ホット／アイス" },
      { name: "フラットホワイト", note: "ホット" },
    ],
  },
  {
    title: "チョコレートドリンク",
    items: [
      {
        name: "ホットチョコレート／エクアドル70%（オーツドリンク）",
      },
    ],
  },
  {
    title: "オーガニックソーダ",
    items: [
      { name: "カーマコーラ" },
      { name: "ジンジャエーラ" },
      { name: "レモネード" },
    ],
  },
  {
    title: "クラフトチョコレート",
    items: [
      {
        name: "お花畑で待ち合わせ エクアドル70%（ひとくちサイズ4個入）",
      },
    ],
  },
  {
    title: "オリジナルドーナツ（不定期）",
    items: [
      {
        name: "国産100%なたね油使用チョコレートドーナツ",
        note: "オーガニック食パン三山 / 米澤製油 / CHICHIBU CHOCOLATE FACTORY",
      },
    ],
  },
];

export default function MenuSection() {
  return (
    <section className="bg-card py-16 sm:py-20 md:py-28 lg:py-36" id="menu">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <FadeInSection className="mb-16 text-center sm:mb-20">
          <div className="mx-auto mb-4 w-44 sm:w-52 lg:w-60">
            <img
              src="/assets/images/contrail-logo-transparent.png"
              alt="Contrail Coffee & Chocolate"
              className="w-full"
            />
          </div>
          <p className="text-left font-sans text-sm font-medium tracking-wider text-muted-foreground sm:text-base">
            Menu
          </p>
        </FadeInSection>

        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
          {menuData.map((category, index) => (
            <FadeInSection key={category.title} delay={index * 100}>
              <div className="border-b border-border pb-2">
                <h3 className="font-sans text-base font-medium text-foreground sm:text-lg">
                  {category.title}
                </h3>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="font-sans text-sm font-light leading-relaxed text-foreground sm:text-base"
                  >
                    <span>{item.name}</span>
                    {item.note && (
                      <span className="ml-3 text-xs text-muted-foreground sm:text-sm">
                        {item.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection className="mt-16 text-center sm:mt-20" delay={200}>
          <div className="mx-auto w-28 sm:w-32">
            <img
              src="/assets/images/kuma.png"
              alt="Contrail mascot"
              className="w-full"
            />
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
