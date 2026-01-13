import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Users,
  Heart,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.firstname || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you for your message! We\'ll get back to you soon.', {
        position: 'top-center'
      });
      setFormData({
        name: user?.firstname || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section - Only show when not logged in */}
        {!user && (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-6">
                <MessageSquare className="h-16 w-16 text-green-300" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
                Have questions, suggestions, or need help? We're here to assist you on your journey to finding love.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">

            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

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
                    For developers interested in contributing to the project
                  </p>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Email:</p>
                    <p className="text-purple-600 font-medium">developers@marrylocal.in</p>
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
            <div className="grid lg:grid-cols-2 gap-12">

              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <Send className="h-6 w-6 mr-3 text-blue-600" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-700 font-medium">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-700 font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-1 min-h-[120px]"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
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
                    <div className="flex space-x-4">
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
