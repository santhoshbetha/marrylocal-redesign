import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { adminGetUsersByLocation, adminGetUsersByState, adminGetUsersFromAllStates } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { states } from '../lib/states';
import { cities } from '../lib/cities';
import axios from 'axios';
import { url } from '../api';

function AdminEmailTemplates() {
  const [activeTab, setActiveTab] = useState('manual-emails');
  const [manualEmails, setManualEmails] = useState('');
  const [locationEmails, setLocationEmails] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);

  const isOnline = useOnlineStatus();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('adminEmailActiveTab');
    const savedManualEmails = localStorage.getItem('adminEmailManualEmails');
    const savedLocationEmails = localStorage.getItem('adminEmailLocationEmails');
    const savedSelectedState = localStorage.getItem('adminEmailSelectedState');
    const savedSelectedCity = localStorage.getItem('adminEmailSelectedCity');
    const savedEmailSubject = localStorage.getItem('adminEmailSubject');
    const savedEmailContent = localStorage.getItem('adminEmailContent');

    if (savedActiveTab) setActiveTab(savedActiveTab);
    if (savedManualEmails) setManualEmails(savedManualEmails);
    if (savedLocationEmails) setLocationEmails(savedLocationEmails);
    if (savedSelectedState) setSelectedState(savedSelectedState);
    if (savedSelectedCity) setSelectedCity(savedSelectedCity);
    if (savedEmailSubject) setEmailSubject(savedEmailSubject);
    if (savedEmailContent) setEmailContent(savedEmailContent);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminEmailActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminEmailManualEmails', manualEmails);
  }, [manualEmails]);

  useEffect(() => {
    localStorage.setItem('adminEmailLocationEmails', locationEmails);
  }, [locationEmails]);

  useEffect(() => {
    localStorage.setItem('adminEmailSelectedState', selectedState);
  }, [selectedState]);

  useEffect(() => {
    localStorage.setItem('adminEmailSelectedCity', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('adminEmailSubject', emailSubject);
  }, [emailSubject]);

  useEffect(() => {
    localStorage.setItem('adminEmailContent', emailContent);
  }, [emailContent]);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState) {
      if (selectedState === 'All') {
        setAvailableCities(['All Cities']);
        setSelectedCity('All Cities');
      } else {
        const filteredCities = cities
          .filter(city => city.state === selectedState)
          .map(city => city.name)
          .sort();
        setAvailableCities(['All', ...filteredCities]);
        if (selectedCity && selectedCity !== 'All' && !filteredCities.includes(selectedCity)) {
          setSelectedCity('');
        }
      }
    } else {
      setAvailableCities([]);
      setSelectedCity('');
    }
  }, [selectedState, selectedCity]);

  // Calculate recipient count for both manual emails and location emails
  useEffect(() => {
    if (activeTab === 'manual-emails' && manualEmails.trim()) {
      const emails = manualEmails.split(';').map(email => email.trim()).filter(email => email);
      setRecipientCount(emails.length);
    } else if (activeTab === 'location-based' && locationEmails.trim()) {
      const emails = locationEmails.split(';').map(email => email.trim()).filter(email => email);
      setRecipientCount(emails.length);
    } else {
      setRecipientCount(0);
    }
  }, [manualEmails, locationEmails, activeTab]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setLocationEmails(''); // Clear emails when state changes
    setRecipientCount(0);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setLocationEmails(''); // Clear emails when city changes
    setRecipientCount(0);
  };

  const handleGetEmails = async () => {
    if (!selectedState || !selectedCity) {
      toast.error('Please select both state and city first');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (selectedState === 'All') {
        res = await adminGetUsersFromAllStates();
      } else if (selectedCity === 'All') {
        res = await adminGetUsersByState(selectedState);
      } else {
        res = await adminGetUsersByLocation(selectedState, selectedCity);
      }

      if (res.success) {
        const validEmails = res.data
          .map(user => user.email)
          .filter(email => email && email.includes('@'));

        setLocationEmails(validEmails.join('; '));
        setRecipientCount(validEmails.length);
        toast.success(`Found ${validEmails.length} email addresses and populated the email field`);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const validateEmails = (emailString) => {
    const emails = emailString.split(';').map(email => email.trim()).filter(email => email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    return { emails, invalidEmails };
  };

  const getLocationRecipients = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedState === 'All') {
        res = await adminGetUsersFromAllStates();
      } else if (selectedCity === 'All') {
        res = await adminGetUsersByState(selectedState);
      } else {
        res = await adminGetUsersByLocation(selectedState, selectedCity);
      }

      if (res.success) {
        const validEmails = res.data
          .map(user => user.email)
          .filter(email => email && email.includes('@'));
        setRecipientCount(validEmails.length);
        return validEmails;
      } else {
        toast.error('Failed to fetch users');
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async (recipientEmails) => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error('Please provide both subject and content');
      return false;
    }

    if (recipientEmails.length === 0) {
      toast.error('No valid recipients found');
      return false;
    }

    setSending(true);
    try {
      const response = await axios.post(`${url}/admin/sendbulkemail`, {
        emails: recipientEmails,
        subject: emailSubject.trim(),
        content: emailContent.trim(),
      });

      if (response.data.success) {
        toast.success(`Emails sent successfully to ${recipientEmails.length} recipients`);
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send emails');
        return false;
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Error sending emails');
      return false;
    } finally {
      setSending(false);
    }
  };

  const handleSendManualEmails = async () => {
    if (!manualEmails.trim()) {
      toast.error('Please enter email addresses');
      return;
    }

    const { emails, invalidEmails } = validateEmails(manualEmails);

    if (invalidEmails.length > 0) {
      toast.error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    if (emails.length === 0) {
      toast.error('No valid email addresses found');
      return;
    }

    await sendEmails(emails);
  };

  const handleSendLocationEmails = async () => {
    if (!selectedState || !selectedCity) {
      toast.error('Please select both state and city');
      return;
    }

    if (!locationEmails.trim()) {
      toast.error('No email addresses found. Please select a location first.');
      return;
    }

    const recipientEmails = locationEmails.split(';').map(email => email.trim()).filter(email => email);
    if (recipientEmails.length > 0) {
      await sendEmails(recipientEmails);
    }
  };

  const handleClear = () => {
    setActiveTab('manual-emails');
    setManualEmails('');
    setLocationEmails('');
    setSelectedState('');
    setSelectedCity('');
    setAvailableCities([]);
    setEmailSubject('');
    setEmailContent('');
    setRecipientCount(0);
    localStorage.removeItem('adminEmailActiveTab');
    localStorage.removeItem('adminEmailManualEmails');
    localStorage.removeItem('adminEmailLocationEmails');
    localStorage.removeItem('adminEmailSelectedState');
    localStorage.removeItem('adminEmailSelectedCity');
    localStorage.removeItem('adminEmailSubject');
    localStorage.removeItem('adminEmailContent');
    toast.success('All data cleared');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Templates & Bulk Sending</h1>

      {/* Email Template Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Email Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              placeholder="Enter email subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email-content">Content</Label>
            <Textarea
              id="email-content"
              placeholder="Enter email content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipients Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recipients ({recipientCount} recipients)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual-emails">Manual Emails</TabsTrigger>
              <TabsTrigger value="location-based">Location Based</TabsTrigger>
            </TabsList>

            <TabsContent value="manual-emails" className="space-y-4">
              <div>
                <Label htmlFor="manual-emails">Email Addresses</Label>
                <Textarea
                  id="manual-emails"
                  placeholder="Enter email addresses separated by semicolons (;) - e.g., user1@example.com; user2@example.com"
                  value={manualEmails}
                  onChange={(e) => setManualEmails(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSendManualEmails}
                disabled={sending || !isOnline || !emailSubject.trim() || !emailContent.trim()}
                className="w-full"
              >
                {sending ? 'Sending...' : 'Send Emails'}
              </Button>
            </TabsContent>

            <TabsContent value="location-based" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div>
                  <Label htmlFor="state-select">State</Label>
                  <Select value={selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city-select">City</Label>
                  <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location-emails">Email Addresses</Label>
                <Textarea
                  id="location-emails"
                  placeholder="Click 'Get Email Addresses' button above to populate emails for the selected location"
                  value={locationEmails}
                  onChange={(e) => setLocationEmails(e.target.value)}
                  rows={4}
                  readOnly={false}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={getLocationRecipients}
                  disabled={loading || !selectedState || !selectedCity}
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Get Recipients Count'}
                </Button>
                <Button
                  onClick={handleGetEmails}
                  disabled={loading || !selectedState || !selectedCity}
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Get Email Addresses'}
                </Button>
                <Button
                  onClick={handleSendLocationEmails}
                  disabled={sending || !isOnline || !emailSubject.trim() || !emailContent.trim() || !selectedState || !selectedCity}
                  className="flex-1"
                >
                  {sending ? 'Sending...' : 'Send Emails'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleClear}>
          Clear All
        </Button>
      </div>
    </div>
  );
}

export default AdminEmailTemplates;