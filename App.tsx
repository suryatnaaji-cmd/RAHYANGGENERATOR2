
import React, { useState, useEffect } from 'react';
import TTSGenerator from './components/TTSGenerator';
import ImageGenerator from './components/ImageGenerator';
import VeoPromptCrafter from './components/VeoPromptCrafter';
import GoogleFlowPanel from './components/GoogleFlowPanel';
import CharacterGenerator from './components/CharacterGenerator';
import FoodDrinkGenerator from './components/FoodDrinkGenerator';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import AnimationGenerator from './components/AnimationGenerator';
import { User } from './types';
import { LogOut, Shield } from 'lucide-react';

type Page = 'ttsGenerator' | 'imageGenerator' | 'veoCrafter' | 'googleFlow' | 'characterGenerator' | 'foodDrinkGenerator' | 'adminPanel' | 'animationGenerator';

const App: React.FC = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Initialize page state from localStorage or default to 'ttsGenerator'
    const [page, setPage] = useState<Page>(() => {
        const savedPage = localStorage.getItem('currentPage');
        return (savedPage as Page) || 'ttsGenerator';
    });

    // Save current page to localStorage whenever it changes
    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('currentPage', page);
        }
    }, [page, isAuthenticated]);

    // Handle Login Logic
    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        // If admin logs in, keep them on their last page or default. 
        // If they were on adminPanel but relogged as user, force switch.
        if (user.role !== 'admin' && page === 'adminPanel') {
            setPage('ttsGenerator');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('currentPage'); // Optional: clear page history
    };

    const NavButton: React.FC<{ targetPage: Page; children: React.ReactNode }> = ({ targetPage, children }) => (
        <button
            onClick={() => setPage(targetPage)}
            className={`py-2 px-4 rounded-lg text-sm sm:text-base font-semibold transition duration-300 whitespace-nowrap
                ${page === targetPage
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/30'
                    : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300'
                }`}
        >
            {children}
        </button>
    );

    // If not authenticated, show Login Screen
    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans p-4 sm:p-8">
            <header className="text-center mb-10 pb-4 border-b-2 border-transparent relative flex flex-col items-center">
                <div className="w-full flex justify-end absolute top-0 right-0">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">
                            Hi, <span className="font-bold text-emerald-600">{currentUser?.username}</span>
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="text-xs bg-red-100 hover:bg-red-200 text-red-600 py-1 px-3 rounded-full flex items-center gap-1 transition-colors"
                        >
                            <LogOut className="w-3 h-3" /> Logout
                        </button>
                    </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-purple-600 transition duration-500 mt-6 sm:mt-0">
                    RAHYANG IMAGES GENERATOR V4.6
                </h1>
                <p className="mt-2 text-xl text-gray-600">
                    Ngonten Jadi Mudah: Gabungkan Produk, Model, dan Konsep Foto dalam Sekali Klik
                </p>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse-slow"></div>
            </header>

            <nav className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
                <NavButton targetPage="ttsGenerator">Text To Voice</NavButton>
                <NavButton targetPage="imageGenerator">Images Generator</NavButton>
                <NavButton targetPage="animationGenerator">Create Animasi</NavButton>
                <NavButton targetPage="veoCrafter">Veo 3 Prompt Crafter</NavButton>
                <NavButton targetPage="characterGenerator">Create Karakter</NavButton>
                <NavButton targetPage="foodDrinkGenerator">Generate FOOD & DRINK</NavButton>
                <NavButton targetPage="googleFlow">Google Labs Flow</NavButton>
                
                {/* Only Admin sees this button */}
                {currentUser?.role === 'admin' && (
                    <button
                        onClick={() => setPage('adminPanel')}
                        className={`py-2 px-4 rounded-lg text-sm sm:text-base font-semibold transition duration-300 flex items-center gap-2
                            ${page === 'adminPanel'
                                ? 'bg-gray-800 text-white shadow-lg shadow-gray-900/30'
                                : 'bg-gray-200/80 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        <Shield className="w-4 h-4" /> Admin Panel
                    </button>
                )}
            </nav>

            <div style={{ display: page === 'ttsGenerator' ? 'block' : 'none' }}>
                <TTSGenerator />
            </div>
            <div style={{ display: page === 'imageGenerator' ? 'block' : 'none' }}>
                <ImageGenerator />
            </div>
            <div style={{ display: page === 'animationGenerator' ? 'block' : 'none' }}>
                <AnimationGenerator />
            </div>
            <div style={{ display: page === 'veoCrafter' ? 'block' : 'none' }}>
                <VeoPromptCrafter />
            </div>
            <div style={{ display: page === 'characterGenerator' ? 'block' : 'none' }}>
                <CharacterGenerator />
            </div>
            <div style={{ display: page === 'foodDrinkGenerator' ? 'block' : 'none' }}>
                <FoodDrinkGenerator />
            </div>
            <div style={{ display: page === 'googleFlow' ? 'block' : 'none' }}>
                <GoogleFlowPanel />
            </div>
            
            {/* Admin Panel Render */}
            {currentUser?.role === 'admin' && (
                <div style={{ display: page === 'adminPanel' ? 'block' : 'none' }}>
                    <AdminPanel />
                </div>
            )}
        </div>
    );
};

export default App;
