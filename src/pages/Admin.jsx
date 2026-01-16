import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { adminSearchUser } from '../services/userService';
import { updateUserInfo } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { ChevronDownIcon } from 'lucide-react';

// Calculate date range for calendar (similar to register page)
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 20);
const fromYear = 1900;
const toYear = new Date().getFullYear();

function Admin() {
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    email: '',
    phonenumber: '',
    latitude: '',
    longitude: '',
    dateofbirth: '',
    age: '',
    emailverified: false,
    aadharverified: false,
    passportverified: false,
    licenseverified: false,
    termsaccepted: false,
    onetimefeespaid: false,
    onetimefeesrequired: false,
    acceptedonetimefeesamount: '',
    maxsearchdistance: '',
  });

  const isOnline = useOnlineStatus();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedSearchText = localStorage.getItem('adminSearchText');
    const savedUser = localStorage.getItem('adminUser');
    const savedFormData = localStorage.getItem('adminFormData');

    if (savedSearchText) {
      setSearchText(savedSearchText);
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save search text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminSearchText', searchText);
  }, [searchText]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [user]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast.error('Please enter search text');
      return;
    }
    setLoading(true);
    try {
      const res = await adminSearchUser(searchText.trim());
      if (res.success) {
        setUser(res.data);
        // Populate form with user data
        setFormData({
          city: res.data.city || '',
          state: res.data.state || '',
          email: res.data.email || '',
          phonenumber: res.data.phonenumber || '',
          latitude: res.data.latitude || '',
          longitude: res.data.longitude || '',
          dateofbirth: res.data.dateofbirth || '',
          age: res.data.age || '',
          emailverified: res.data.emailverified || false,
          aadharverified: res.data.aadharverified || false,
          passportverified: res.data.passportverified || false,
          licenseverified: res.data.licenseverified || false,
          termsaccepted: res.data.termsaccepted || false,
          onetimefeespaid: res.data.onetimefeespaid || false,
          onetimefeesrequired: res.data.onetimefeesrequired || false,
          acceptedonetimefeesamount: res.data.acceptedonetimefeesamount || '',
          maxsearchdistance: res.data.maxsearchdistance || '',
        });
        toast.success('User found');
      } else {
        toast.error(res.msg || 'User not found');
        setUser(null);
      }
    } catch {
      toast.error('Error searching user');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!isOnline) {
      toast.error('You are offline');
      return;
    }
    setSaving(true);
    try {
      const res = await updateUserInfo(user.userid, formData);
      if (res.success) {
        toast.success('User data updated successfully');
      } else {
        toast.error(res.msg || 'Failed to update user data');
      }
    } catch {
      toast.error('Error updating user data');
    }
    setSaving(false);
  };

  const handleClear = () => {
    setSearchText('');
    setUser(null);
    setFormData({
      city: '',
      state: '',
      email: '',
      phonenumber: '',
      latitude: '',
      longitude: '',
      dateofbirth: '',
      age: '',
      emailverified: false,
      aadharverified: false,
      passportverified: false,
      licenseverified: false,
      termsaccepted: false,
      onetimefeespaid: false,
      onetimefeesrequired: false,
      acceptedonetimefeesamount: '',
      maxsearchdistance: '',
    });
    localStorage.removeItem('adminSearchText');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminFormData');
    toast.success('Search data cleared');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email, phone, or user ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Edit User: {user.firstname} ({user.shortid})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phonenumber">Phone Number</Label>
                <Input
                  id="phonenumber"
                  value={formData.phonenumber}
                  onChange={(e) => handleInputChange('phonenumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxsearchdistance">Max Search Distance (km)</Label>
                <Input
                  id="maxsearchdistance"
                  type="number"
                  min="0"
                  value={formData.maxsearchdistance}
                  onChange={(e) => handleInputChange('maxsearchdistance', e.target.value)}
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <Label htmlFor="dateofbirth">Date of Birth</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="dateofbirth" className="w-full justify-between font-normal">
                      {formData.dateofbirth ? new Date(formData.dateofbirth).toLocaleDateString() : 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateofbirth ? new Date(formData.dateofbirth) : undefined}
                      captionLayout="dropdown"
                      toDate={maxDate}
                      fromYear={fromYear}
                      toYear={toYear}
                      onSelect={date => {
                        const dateString = date ? date.toISOString().split('T')[0] : '';
                        handleInputChange('dateofbirth', dateString);
                        // Calculate age if date is selected
                        if (date) {
                          const today = new Date();
                          let age = today.getFullYear() - date.getFullYear();
                          const monthDiff = today.getMonth() - date.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                            age--;
                          }
                          handleInputChange('age', age.toString());
                        }
                        setCalendarOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="acceptedonetimefeesamount">Accepted One Time Fees Amount</Label>
                <Input
                  id="acceptedonetimefeesamount"
                  type="number"
                  step="any"
                  value={formData.acceptedonetimefeesamount}
                  onChange={(e) => handleInputChange('acceptedonetimefeesamount', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailverified"
                  checked={formData.emailverified}
                  onCheckedChange={(checked) => handleInputChange('emailverified', checked)}
                />
                <Label htmlFor="emailverified">Email Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aadharverified"
                  checked={formData.aadharverified}
                  onCheckedChange={(checked) => handleInputChange('aadharverified', checked)}
                />
                <Label htmlFor="aadharverified">Aadhar Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="passportverified"
                  checked={formData.passportverified}
                  onCheckedChange={(checked) => handleInputChange('passportverified', checked)}
                />
                <Label htmlFor="passportverified">Passport Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="licenseverified"
                  checked={formData.licenseverified}
                  onCheckedChange={(checked) => handleInputChange('licenseverified', checked)}
                />
                <Label htmlFor="licenseverified">License Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsaccepted"
                  checked={formData.termsaccepted}
                  onCheckedChange={(checked) => handleInputChange('termsaccepted', checked)}
                />
                <Label htmlFor="termsaccepted">Terms Accepted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onetimefeespaid"
                  checked={formData.onetimefeespaid}
                  onCheckedChange={(checked) => handleInputChange('onetimefeespaid', checked)}
                />
                <Label htmlFor="onetimefeespaid">One Time Fees Paid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onetimefeesrequired"
                  checked={formData.onetimefeesrequired}
                  onCheckedChange={(checked) => handleInputChange('onetimefeesrequired', checked)}
                />
                <Label htmlFor="onetimefeesrequired">One Time Fees Required</Label>
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Admin;