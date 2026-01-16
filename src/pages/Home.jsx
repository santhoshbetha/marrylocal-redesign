import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AboutSection } from '../components/AboutSection';
import { FAQSection } from '../components/FAQSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { useAuth } from '../context/AuthContext';

export function Home({ openLogin, setOpenLogin }) {
  const { user, profiledata } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profiledata) {
      // Redirect admin users to admin panel, others to search
      if (profiledata.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/myspace');
      }
    }
  }, [user, profiledata, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection openLogin={openLogin} setOpenLogin={setOpenLogin} />
        <FeaturesSection />
        <AboutSection />
        <FAQSection />
        <Footer />
      </main>
    </div>
  );
}
