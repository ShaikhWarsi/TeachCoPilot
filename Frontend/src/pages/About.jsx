import React from 'react';
import { Brain, Target, Zap, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const About = () => {
    const values = [
        {
            icon: Target,
            title: "Precision",
            desc: "AI-powered accuracy that matches expert teacher evaluation standards.",
            color: "bg-ms-blue"
        },
        {
            icon: Zap,
            title: "Efficiency",
            desc: "Reduce grading time by 80% while maintaining quality feedback.",
            color: "bg-ms-violet"
        },
        {
            icon: Heart,
            title: "Empathy",
            desc: "We understand teaching is personal. Our AI enhances, never replaces, the human touch.",
            color: "bg-ms-green"
        },
        {
            icon: Users,
            title: "Community",
            desc: "Built with 10,000+ teachers worldwide to solve real classroom challenges.",
            color: "bg-ms-orange"
        }
    ];

    const team = [
        { name: "Dr. Sarah Chen", role: "Founder & CEO", bio: "Former educator with 15 years classroom experience. PhD in Learning Sciences from Stanford." },
        { name: "Michael Torres", role: "Head of AI", bio: "Ex-Google AI researcher. Led development of natural language understanding systems." },
        { name: "Emily Watson", role: "Chief Product Officer", bio: "Product leader with experience at Khan Academy and Coursera. Passionate about accessible education." },
        { name: "David Kim", role: "Lead Engineer", bio: "Full-stack architect who built scalable systems at Microsoft and Dropbox." }
    ];

    const milestones = [
        { year: "2023", title: "Idea Born", desc: "Teacher Copilot conceived during a hackathon in San Francisco" },
        { year: "2024", title: "Beta Launch", desc: "First 100 teachers onboarded. 95% satisfaction rate achieved." },
        { year: "2025", title: "Rapid Growth", desc: "50,000+ assignments graded. Expanded to 15 countries." },
        { year: "2026", title: "The Future", desc: "AI tutoring, personalized learning paths, and global classroom integration." }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="page-container">
                <div className="page-content max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ms-blue/10 border-2 border-ms-blue/30 mb-6">
                            <Sparkles size={16} className="text-ms-blue" />
                            <span className="text-sm font-bold text-ms-blue">Our Story</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 dark:text-white mb-6">
                            Empowering Teachers, <br />
                            <span className="text-gradient">One Assignment at a Time</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Teacher Copilot was born from a simple observation: teachers spend too much time grading 
                            and not enough time teaching. We're here to change that with AI that understands education.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 px-4 bg-ms-blue/5 dark:bg-ms-blue/10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card rotate={0} variant="colored" className="text-center py-16 px-8">
                            <Brain className="w-16 h-16 text-white mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4">
                                Our Mission
                            </h2>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                To give every teacher the power of AI-assisted feedback, making personalized 
                                education scalable and accessible. We believe great teaching should be about 
                                connection, not paperwork.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            Our Values
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The principles that guide every decision we make
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card rotate={idx % 2 === 0 ? 1 : -1} className="h-full">
                                    <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-4`}>
                                        <value.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {value.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 px-4 bg-ms-violet/5 dark:bg-ms-violet/10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            Our Journey
                        </h2>
                    </motion.div>

                    <div className="space-y-8">
                        {milestones.map((milestone, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card rotate={idx % 2 === 0 ? -1 : 1}>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="px-4 py-2 rounded-full bg-ms-blue text-white font-black text-xl">
                                            {milestone.year}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                {milestone.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-4">
                            Meet the Team
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Passionate educators, engineers, and dreamers working to transform education
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card rotate={idx % 2 === 0 ? 1 : -1} className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-ms-blue to-ms-violet flex items-center justify-center text-white font-bold text-2xl">
                                        {member.name[0]}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {member.name}
                                    </h3>
                                    <p className="text-ms-blue font-bold text-sm mb-2">{member.role}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {member.bio}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card rotate={0} variant="colored" className="text-center py-16 px-8">
                            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4">
                                Join Our Mission
                            </h2>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Be part of the education revolution. Help us empower teachers worldwide.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a 
                                    href="/careers"
                                    className="px-8 py-4 bg-white text-ms-violet font-black text-lg rounded-full border-4 border-slate-900 shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    View Careers
                                    <ArrowRight size={20} />
                                </a>
                                <a 
                                    href="/contact"
                                    className="px-8 py-4 bg-transparent text-white font-black text-lg rounded-full border-4 border-white hover:bg-white/10 transition-all flex items-center justify-center"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
