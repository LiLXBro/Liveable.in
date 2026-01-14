import dynamic from 'next/dynamic';
import VisionCarousel from '@/components/VisionCarousel';
import Mission from '@/components/Mission';
import RegistrationForm from '@/components/RegistrationForm';
import { getChampions } from './actions';

// Dynamically import map with no SSR
const ChampionsMap = dynamic(() => import('@/components/ChampionsMap'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
});

export default async function Home() {
    // Fetch champions from DB
    const champions = await getChampions();

    return (
        <main className="min-h-screen flex flex-col">
            {/* 1. Vision Carousel (Hero) */}
            <VisionCarousel />

            {/* 2. Mission Section */}
            <Mission />

            {/* 3. Map & Registration Section */}
            <section className="py-20 px-4 max-w-7xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left/Top: Interactive Map */}
                    <div className="order-1 lg:order-1">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-text-heading">Our Footprint</h2>
                            <p className="text-text-body mt-2">See where champions are rising across India.</p>
                        </div>
                        <ChampionsMap champions={champions} />
                    </div>

                    {/* Right/Bottom: Registration Form */}
                    <div className="order-2 lg:order-2">
                        <div className="mb-6 lg:hidden">
                            <h2 className="text-3xl font-bold text-text-heading">Join the Movement</h2>
                        </div>
                        <RegistrationForm />
                    </div>
                </div>
            </section>

            {/* 4. Footer (Disclaimer) */}
            <footer className="border-t border-slate-200 bg-slate-50 py-12 px-6 mt-auto">
                <div className="max-w-4xl mx-auto text-center italic text-slate-500 text-sm font-semibold">
                    “This is not an NGO, It is not registered anywhere and does not collect funds or spends any money. Any expense is borne by individuals or sponsors in furtherance of the objectives is in their individual capacity with no liability of this platform or any champion.”
                </div>
            </footer>
        </main>
    );
}
