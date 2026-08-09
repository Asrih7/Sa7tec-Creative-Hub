import { CalendarDays, Clock3 } from "lucide-react";
import { Link } from "@/lib/nav";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Seo } from "@/components/Seo";
import { assetSrc } from "@/lib/assets";
import "@/rebrand.css";

const posts = [
  {
    title: "We Built a Free Platform to Learn Angular and Ace Your Next Interview",
    category: "Learning platform",
    date: "06 Jun 2026",
    read: "6 min read",
    image: "/assets/medium-projects/angular-courses-portal.png",
    href: "https://medium.com/@asrihsoufiane/i-built-a-free-platform-to-learn-angular-and-ace-your-next-interview-heres-why-you-need-it-2bd64117b2e9",
    excerpt:
      "What happens when a learning product stops collecting tutorials and starts designing a path?",
  },
  {
    title: "DeviceFrame Pro: Revolutionizing Web Development Testing",
    category: "Developer tool",
    date: "21 May 2026",
    read: "5 min read",
    image: "/assets/medium-projects/deviceframe-pro.png",
    href: "https://medium.com/@asrihsoufiane/deviceframe-pro-revolutionizing-web-development-testing-in-2026-3cfefc97c204",
    excerpt:
      "A closer look at making responsive testing faster, clearer and less frustrating for builders.",
  },
  {
    title: "Frontend Cheat Sheets: A Developer Reference Hub",
    category: "Developer resource",
    date: "02 May 2026",
    read: "4 min read",
    image: "/assets/medium-projects/frontend-cheat-sheets.png",
    href: "https://medium.com/@asrihsoufiane/frontend-cheat-sheets-your-ultimate-developer-reference-hub-260e4ee43129",
    excerpt:
      "The small reference product designed for the moments when the browser tab count gets out of control.",
  },
  {
    title: "Introducing AngularQuizMe — Learn by Doing",
    category: "Learning tools",
    date: "18 Apr 2026",
    read: "5 min read",
    image: "/assets/medium-projects/angularquizme.png",
    href: "https://medium.com/@asrihsoufiane/introducing-angularquizme-a-smarter-way-to-master-angular-through-quizzes-3a5f12ba5fd4",
    excerpt: "Why active recall, feedback and a little gamification make technical practice stick.",
  },
  {
    title: "Enhance Angular Projects with ng-payment-card-form",
    category: "UI components",
    date: "29 Mar 2026",
    read: "4 min read",
    image: "/assets/medium-projects/payment-card-form.png",
    href: "https://medium.com/@asrihsoufiane/enhance-your-angular-projects-with-ng-payment-card-form-component-6ace092ad75a",
    excerpt:
      "A reusable component built around the details that make payment forms feel trustworthy.",
  },
  {
    title: "Simplify Angular Development with NgChatbotAngular",
    category: "Chatbot integration",
    date: "14 Mar 2026",
    read: "4 min read",
    image: "/assets/medium-projects/ng-chatbot-angular.gif",
    href: "https://medium.com/@asrihsoufiane/simplify-angular-development-with-ngchatbotangular-your-chatbot-solution-cbdf87899b01",
    excerpt:
      "A practical conversation layer for products that need help to feel available at the right moment.",
  },
];

export default function Blog() {
  const [featured, ...rest] = posts;

  return (
    <PublicLayout>
      <Seo
        title="Journal | SA7TEC"
        description="Notes, case studies and product thinking from SA7TEC."
      />
      <main className="s7-journal-page">
        <section className="s7-journal-hero">
          <div className="s7-journal-container">
            <Link href="/" className="s7-journal-back">
              Back to studio
            </Link>
            <p className="s7-eyebrow">SA7TEC Journal</p>
            <h1>
              Ideas, experiments and <em>products in progress.</em>
            </h1>
            <p className="s7-journal-intro">
              Behind the screens: practical lessons, product decisions and experiments from the
              SA7TEC workbench.
            </p>
          </div>
        </section>

        <section className="s7-journal-list">
          <div className="s7-journal-container">
            <div className="s7-journal-toolbar">
              <div>
                <p className="s7-eyebrow">Latest stories</p>
                <h2>From the workbench</h2>
              </div>
              <span>{posts.length} stories · 2026</span>
            </div>

            <article className="s7-journal-featured">
              <a
                href={featured.href}
                target="_blank"
                rel="noreferrer"
                className="s7-journal-feature-image"
              >
                <img src={assetSrc(featured.image)} alt={featured.title} />
              </a>
              <div className="s7-journal-feature-copy">
                <span className="s7-journal-kicker">Featured story</span>
                <div className="s7-journal-meta">
                  <span>{featured.category}</span>
                  <span>
                    <CalendarDays size={14} />
                    {featured.date}
                  </span>
                  <span>
                    <Clock3 size={14} />
                    {featured.read}
                  </span>
                </div>
                <h2>
                  <a href={featured.href} target="_blank" rel="noreferrer">
                    {featured.title}
                  </a>
                </h2>
                <p>{featured.excerpt}</p>
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noreferrer"
                  className="s7-journal-read"
                >
                  Read article on Medium
                </a>
              </div>
            </article>

            <div className="s7-journal-grid">
              {rest.map((post) => (
                <article className="s7-journal-card" key={post.title}>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="s7-journal-card-image"
                  >
                    <img src={assetSrc(post.image)} alt={post.title} loading="lazy" />
                  </a>
                  <div className="s7-journal-card-body">
                    <div className="s7-journal-meta">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3>
                      <a href={post.href} target="_blank" rel="noreferrer">
                        {post.title}
                      </a>
                    </h3>
                    <p>{post.excerpt}</p>
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noreferrer"
                      className="s7-journal-read"
                    >
                      Read article
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="s7-journal-cta">
          <div className="s7-journal-container s7-journal-cta-inner">
            <div>
              <p className="s7-eyebrow">Have a product idea?</p>
              <h2>
                Let’s make the next <em>case study.</em>
              </h2>
            </div>
            <Link href="/contact" className="s7-button s7-button-primary">
              Start a conversation
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
