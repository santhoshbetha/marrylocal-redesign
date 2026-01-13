import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/Footer';
import ScrollToTop from 'react-scroll-to-top';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MapPin,
  Shield,
  Users,
  Mail,
  Share2,
  CheckCircle,
  Star,
  Globe,
  Lock
} from 'lucide-react';

export function About() {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ScrollToTop smooth />

        {/* Hero Section - Only show when not logged in */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-6">
                <Heart className="h-16 w-16 text-pink-300" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                About MarryLocal
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Connecting hearts, bridging communities, and making meaningful relationships easier than ever.
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                  <Users className="h-5 w-5 mr-2" />
                  Building Trust
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                  <Shield className="h-5 w-5 mr-2" />
                  Verified Users Only
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">

            {/* Mission Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We believe in creating lasting relationships by connecting people from the same locale.
                Love knows no boundaries of language, community, or background - only shared values and proximity matter.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

              {/* Feature 1 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <MapPin className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Location-Based Matching
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Find matches within your preferred radius (10-50km). We use GPS coordinates to show you
                    compatible partners from your state and neighboring cities.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Lock className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Privacy Control
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You control your contact information visibility. Set preferences for phone, Instagram,
                    and Facebook visibility in your settings. Email remains visible for communication.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Verified & Safe
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every user is verified. No scammers, fake profiles, duplicates, or matchmaking agents.
                    One profile per person with verified name and date of birth.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Globe className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Inclusive Platform
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    No restrictions based on language, community, or background. We focus on what truly matters -
                    shared values, compatibility, and proximity for long-term relationships.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-pink-100 rounded-full">
                      <Heart className="h-8 w-8 text-pink-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Built with Love
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Created with good intentions to help people find meaningful relationships.
                    Your suggestions are always welcome to improve and enhance the platform.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Share2 className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Community Driven
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Help us grow by sharing MarryLocal with your connections on WhatsApp, Instagram, and Facebook.
                    Together, we can help more people find their perfect match.
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Vision Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-16">
              <h3 className="text-2xl md:text-3xl font-bold mb-8">Our Vision for the Future</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">🌟</div>
                  <div className="text-blue-100">Revolutionize</div>
                  <div className="text-sm text-blue-200 mt-1">Local Matching</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">🤝</div>
                  <div className="text-blue-100">Build Trust</div>
                  <div className="text-sm text-blue-200 mt-1">Through Verification</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">💕</div>
                  <div className="text-blue-100">Create Connections</div>
                  <div className="text-sm text-blue-200 mt-1">That Last Forever</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {!user ? <Footer /> : <></>}
    </>
  );
}
