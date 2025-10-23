import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Using lucide-react for clean, modern icons
import { BarChart3, Bell, QrCode, Lock, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-neutral-900">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-700">✅ Attendify</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-neutral-600 hover:text-green-700 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-neutral-600 hover:text-green-700 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-neutral-600 hover:text-green-700 transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-green-700 hover:bg-green-50">
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center py-20 text-center md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-green-50 to-white"></div>
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-6xl font-extrabold tracking-tighter md:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600 pb-8">
              Attendance.
              <br />
              Simply magical.
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-neutral-600 md:text-xl">
              The effortless way to track attendance for schools, events, and
              businesses. Say goodbye to spreadsheets. Say hello to seamless,
              smart attendance.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-green-600 text-lg hover:bg-green-700 text-white"
              >
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg text-green-700 border-green-200 hover:bg-green-50">
                Request a Demo
              </Button>
            </div>
          </div>
        </section>

        {/* 3. Product Shot Section */}
        <section className="w-full py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative mx-auto h-auto w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl md:h-[600px]">
              <Image
                src="https://cdn.dribbble.com/userupload/13724222/file/original-f1bbb4adc8d607453b05d83ef05f6e52.png?resize=1504x1128&vertical=center"
                alt="Dashboard Mockup"
                height={1128}
                width={1504}
                className="rounded-3xl object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </section>

        {/* 4. Feature 1 Section (Text + Visual) */}
        <section id="features" className="w-full py-24 md:py-32">
          <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-24 md:px-6">
            <div className="flex flex-col items-start space-y-6">
              <div className="inline-block rounded-lg bg-green-100 p-3 text-green-600">
                <QrCode className="h-8 w-8" />
              </div>
              <h2 className="text-5xl font-bold tracking-tighter md:text-6xl">
                Tap. You're in.
              </h2>
              <p className="max-w-[600px] text-lg text-neutral-600 md:text-xl">
                Use QR codes, NFC, or geofencing. Checking in takes seconds,
                not minutes. Students and employees can mark their own
                presence, so you can start on time, every time.
              </p>
            </div>
            <div className="flex h-fit w-full items-center justify-center rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://cdn.dribbble.com/userupload/13724220/file/original-17ba1577277abab0e31cbc37bcd9b2a8.png?resize=1504x1128&vertical=center"
                alt="QR Scan UI"
                height={988}
                width={1504}
                className="rounded-3xl object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* 5. Feature 2 Section (Visual + Text) */}
        <section className="w-full py-24 md:py-32">
          <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-24 md:px-6">
            <div className="flex h-[500px] w-full items-center justify-center rounded-3xl overflow-hidden shadow-xl md:order-last">
              <Image
                src="https://cdn.dribbble.com/userupload/13724216/file/original-e7650fa60d5737382c64ba1575b22dab.png?resize=1504x1128&vertical=center"
                alt="Reports Dashboard"
                width={1504}
                height={1128}
                className="rounded-3xl object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col items-start space-y-6 md:order-first">
              <div className="inline-block rounded-lg bg-green-100 p-3 text-green-600">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h2 className="text-5xl font-bold tracking-tighter md:text-6xl">
                See the full story.
              </h2>
              <p className="max-w-[600px] text-lg text-neutral-600 md:text-xl">
                Real-time dashboards and automated reports show you trends, not
                just names. Instantly identify at-risk students or track team
                engagement without lifting a finger.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Secondary Features Grid */}
        <section className="w-full py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-5xl font-bold tracking-tighter md:text-6xl">
                Everything you need.
                <br />
                Nothing you don't.
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-4 group hover:scale-105 transition-transform duration-300">
                <Bell className="h-10 w-10 text-green-600" />
                <h3 className="text-2xl font-bold">Smart Notifications</h3>
                <p className="text-lg text-neutral-600">
                  Automated alerts for absences and tardiness keep everyone in
                  the loop.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 group hover:scale-105 transition-transform duration-300">
                <Users className="h-10 w-10 text-green-600" />
                <h3 className="text-2xl font-bold">Seamless Integration</h3>
                <p className="text-lg text-neutral-600">
                  Connects with your existing tools, from your LMS to your HR
                  software.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 group hover:scale-105 transition-transform duration-300">
                <Lock className="h-10 w-10 text-green-600" />
                <h3 className="text-2xl font-bold">Secure & Private</h3>
                <p className="text-lg text-neutral-600">
                  All data is encrypted, secure, and handled with privacy at
                  its core.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Testimonials Section */}
        <section id="testimonials" className="w-full bg-green-50 py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-5xl font-bold tracking-tighter md:text-6xl">
                Loved by leaders.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Testimonial 1 */}
              <div className="flex flex-col items-start rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="flex-1 text-xl font-medium italic text-neutral-700">
                  "Attendify has saved me at least 5-10 minutes at the start of
                  every single lecture. The reporting is a game-changer for
                  tracking student engagement. I can't imagine going back to
                  paper."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop"
                    width={48}
                    height={48}
                    alt="Avatar of a professor"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-neutral-900">
                      Dr. Anya Sharma
                    </p>
                    <p className="text-sm text-neutral-600">
                      Professor, Dept. of Computer Science
                    </p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="flex flex-col items-start rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="flex-1 text-xl font-medium italic text-neutral-700">
                  "We use this for our all-hands meetings and workshops. It's
                  incredibly simple to set up, and our team loves the quick QR
                  scan. The data helps us plan future events much better."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Image
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop"
                    width={48}
                    height={48}
                    alt="Avatar of a manager"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-neutral-900">David Chen</p>
                    <p className="text-sm text-neutral-600">
                      Project Manager, Innovate Inc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final CTA Section */}
        <section className="w-full py-24 md:py-40">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <h2 className="text-5xl font-bold tracking-tighter md:text-6xl">
              Try Attendify today.
            </h2>
            <p className="max-w-[600px] text-lg text-neutral-600 md:text-xl">
              Get started for free. No credit card required. Join thousands of
              educators and managers simplifying their day.
            </p>
            <Button
              size="lg"
              className="bg-green-600 text-lg hover:bg-green-700 text-white"
            >
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="w-full border-t border-neutral-200 bg-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-12 md:flex-row md:px-6">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Attendify Inc.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-neutral-600 hover:text-green-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-neutral-600 hover:text-green-700 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}