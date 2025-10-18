import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { SocialConnect } from './components/SocialConnect';
import { PersonalizationOnboarding, type PersonalizationSettings } from './components/PersonalizationOnboarding';
import { Dashboard } from './components/Dashboard';
import { AICoCreator } from './components/AICoCreator';
import { ContentPreview } from './components/ContentPreview';
import { Scheduler } from './components/Scheduler';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import {
  LayoutDashboard,
  Sparkles,
  Eye,
  Calendar,
  BarChart3,
  Menu,
  X,
  Zap,
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react';

type View = 'dashboard' | 'creator' | 'preview' | 'scheduler' | 'analytics' | 'settings';
type OnboardingStep = 'login' | 'socialConnect' | 'personalization' | 'complete';

interface User {
  email: string;
  name: string;
  role: string;
  isNewUser?: boolean;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [personalizationSettings, setPersonalizationSettings] = useState<PersonalizationSettings>({
    theme: 'light',
    accentColor: 'blue',
    brandName: '',
    brandTone: 'friendly',
    industry: '',
    goals: ''
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [previewData, setPreviewData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // If it's a signup (new user), start onboarding flow
    if (userData.isNewUser) {
      setOnboardingStep('socialConnect');
    } else {
      // Existing user, skip onboarding
      setOnboardingStep('complete');
    }
  };

  const handleSocialConnect = (platforms: string[]) => {
    setConnectedPlatforms(platforms);
    setOnboardingStep('personalization');
  };

  const handleSkipSocialConnect = () => {
    setOnboardingStep('personalization');
  };

  const handlePersonalizationComplete = (settings: PersonalizationSettings) => {
    setPersonalizationSettings(settings);
    setOnboardingStep('complete');
  };

  const handleLogout = () => {
    setUser(null);
    setOnboardingStep('login');
    setCurrentView('dashboard');
  };

  const handleUpdateSettings = (settings: PersonalizationSettings) => {
    setPersonalizationSettings(settings);
  };

  const handleUpdatePlatforms = (platforms: string[]) => {
    setConnectedPlatforms(platforms);
  };

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Handle dark mode
    if (personalizationSettings.theme === 'dark') {
      root.classList.add('dark');
    } else if (personalizationSettings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto mode - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (personalizationSettings.theme === 'auto') {
          if (e.matches) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Apply accent color
    root.setAttribute('data-accent', personalizationSettings.accentColor);
  }, [personalizationSettings]);

  // Show login page
  if (!user || onboardingStep === 'login') {
    return (
      <>
        <Toaster />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  // Show social connect page during onboarding
  if (onboardingStep === 'socialConnect') {
    return (
      <>
        <Toaster />
        <SocialConnect 
          onComplete={handleSocialConnect}
          onSkip={handleSkipSocialConnect}
        />
      </>
    );
  }

  // Show personalization page during onboarding
  if (onboardingStep === 'personalization') {
    return (
      <>
        <Toaster />
        <PersonalizationOnboarding onComplete={handlePersonalizationComplete} />
      </>
    );
  }

  const handleNavigate = (view: View, data?: any) => {
    setCurrentView(view);
    if (data) {
      setPreviewData(data);
    }
  };

  const navigationItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'creator' as View, label: 'AI Co-Creator', icon: Sparkles },
    { id: 'preview' as View, label: 'Preview', icon: Eye },
    { id: 'scheduler' as View, label: 'Scheduler', icon: Calendar },
    { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon }
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'creator':
        return <AICoCreator onNavigate={handleNavigate} />;
      case 'preview':
        return <ContentPreview data={previewData} />;
      case 'scheduler':
        return <Scheduler />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <Settings 
            currentSettings={personalizationSettings}
            connectedPlatforms={connectedPlatforms}
            onUpdateSettings={handleUpdateSettings}
            onUpdatePlatforms={handleUpdatePlatforms}
          />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg">SparkSocial</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Social Media Automation</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            <div 
              className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm cursor-pointer hover:scale-110 transition-transform"
              onClick={() => handleNavigate('settings')}
              title="Profile & Settings"
            >
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="flex flex-col gap-2 p-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className="justify-start gap-2"
                  onClick={() => {
                    handleNavigate(item.id);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-3 rounded-lg">
              <p className="text-xs">
                <span className="text-blue-600 dark:text-blue-400">{user.name}</span> • {user.role}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 pb-16">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
