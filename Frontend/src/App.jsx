import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loaded pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Upload = lazy(() => import("./pages/Upload"));
const Results = lazy(() => import("./pages/Results"));
const Insights = lazy(() => import("./pages/Insights"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Classroom workflow pages
const Classrooms = lazy(() => import("./pages/Classrooms"));
const ClassroomDetail = lazy(() => import("./pages/ClassroomDetail"));
const ClassroomUpload = lazy(() => import("./pages/ClassroomUpload"));
const ClassroomAnalytics = lazy(() => import("./pages/ClassroomAnalytics"));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-ms-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse">Loading...</p>
        </div>
    </div>
);

function App() {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/insights" element={<Insights />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        
                        {/* Classroom Workflow Routes */}
                        <Route path="/classrooms" element={<Classrooms />} />
                        <Route path="/classroom/:id" element={<ClassroomDetail />} />
                        <Route path="/classroom/:id/upload" element={<ClassroomUpload />} />
                        <Route path="/classroom/:id/analytics" element={<ClassroomAnalytics />} />
                        
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
