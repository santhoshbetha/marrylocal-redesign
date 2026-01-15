import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Users,
  Heart,
  Clock,
  CheckCircle
} from 'lucide-react';

export function Contact() {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section - Only show when not logged in */}
        {!user && (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-4 md:mb-6">
                <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-green-300" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                Get In Touch
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto px-2">
                Have questions, suggestions, or need help? We're here to assist you on your journey to finding love.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">

            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">

              {/* General Inquiries */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    General Inquiries
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Questions, suggestions, or feedback about MarryLocal
                  </p>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Email:</p>
                    <p className="text-blue-600 font-medium">contact@marrylocal.in</p>
                  </div>
                </CardContent>
              </Card>

              {/* Developer Support */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Developer Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For developers interested in contributing to this project
                  </p>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Email:</p>
                    <p className="text-purple-600 font-medium">developers@marrylocal.in</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <MapPin className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Our Location
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Visit our office or reach out for in-person meetings
                  </p>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Address:</p>
                    <p className="text-red-600 font-medium">Mumbai, Maharashtra, India</p>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Response Time
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We typically respond within 24-48 hours
                  </p>
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Quick Support</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form Section */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Contact Email */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <Mail className="h-6 w-6 mr-3 text-blue-600" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="mb-6">
                    <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Contact Us
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Have questions or need assistance? Reach out to us directly.
                    </p>
                  </div>
                  <a
                    href="mailto:contact@marrylocal.in"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    contact@marrylocal.in
                  </a>
                  <p className="text-sm text-gray-500 mt-4">
                    We typically respond within 24-48 hours
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="space-y-8">

                {/* FAQ Section */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Common Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">How do I report a suspicious profile?</h4>
                      <p className="text-gray-600 text-sm">Use the report button on any profile or contact us directly with the profile details.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Can I change my location settings?</h4>
                      <p className="text-gray-600 text-sm">Yes, you can update your location preferences in your profile settings anytime.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Is my data secure?</h4>
                      <p className="text-gray-600 text-sm">Absolutely. We use industry-standard encryption and never share your personal information.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Follow Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Stay connected and share MarryLocal with your friends and family.
                    </p>
                    <div className="space-x-4">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <span className="text-green-600 font-bold mr-2">WhatsApp</span>
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <span className="text-pink-600 font-bold mr-2">Instagram</span>
                        Follow
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <span className="text-blue-600 font-bold mr-2">Facebook</span>
                        Like
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mission Statement */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Our Commitment
                    </h3>
                    <p className="text-gray-600">
                      We're dedicated to creating a safe, inclusive platform where genuine connections
                      can flourish. Your trust and happiness are our top priorities.
                    </p>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </div>
      {!user ? <Footer /> : <></>}
    </>
  );
}
