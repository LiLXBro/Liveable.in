import { Target, Leaf, Users } from 'lucide-react';

export default function Mission() {
    return (
        <section className="py-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-text-heading mb-12">Why We Exist</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-text-heading mb-2">Visionary Goals</h3>
                        <p className="text-text-body text-sm">To visualize and advocate for what a truly liveable Indian city looks like.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Leaf className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-text-heading mb-2">Greenfield Cities</h3>
                        <p className="text-text-body text-sm">Pushing for the development of 250 new sustainable cities across the nation.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-text-heading mb-2">Citizen Mobilization</h3>
                        <p className="text-text-body text-sm">Empowering ordinary citizens to become champions of change.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
