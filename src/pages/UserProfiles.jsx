import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { adminSearchUsers } from '../services/userService';
import { MapPin, Calendar, Phone, Mail, User, Shield, CreditCard, CheckCircle, XCircle } from 'lucide-react';

function UserProfiles() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedSearchText = localStorage.getItem('userProfilesSearchText');
    const savedUsers = localStorage.getItem('userProfilesUsers');
    const savedSelectedUser = localStorage.getItem('userProfilesSelectedUser');

    if (savedSearchText) {
      setSearchText(savedSearchText);
    }
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error parsing saved users data:', error);
      }
    }
    if (savedSelectedUser) {
      try {
        setSelectedUser(JSON.parse(savedSelectedUser));
      } catch (error) {
        console.error('Error parsing saved selected user data:', error);
      }
    }
  }, []);

  // Save search text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfilesSearchText', searchText);
  }, [searchText]);

  // Save users data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfilesUsers', JSON.stringify(users));
  }, [users]);

  // Save selected user to localStorage whenever it changes
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('userProfilesSelectedUser', JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem('userProfilesSelectedUser');
    }
  }, [selectedUser]);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast.error('Please enter search text');
      return;
    }
    setLoading(true);
    try {
      const res = await adminSearchUsers(searchText.trim());
      if (res.success) {
        setUsers(res.data);
        setSelectedUser(null); // Clear selected user when new search
        toast.success(`Found ${res.data.length} user${res.data.length !== 1 ? 's' : ''}`);
      } else {
        toast.error(res.msg || 'No users found');
        setUsers([]);
        setSelectedUser(null);
      }
    } catch {
      toast.error('Error searching users');
      setUsers([]);
      setSelectedUser(null);
    }
    setLoading(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleClear = () => {
    setSearchText('');
    setUsers([]);
    setSelectedUser(null);
    localStorage.removeItem('userProfilesSearchText');
    localStorage.removeItem('userProfilesUsers');
    localStorage.removeItem('userProfilesSelectedUser');
    toast.success('All data cleared');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === '') return 'Not set';
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile Viewer</h1>

      {/* Search Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter search text (name, email, phone, etc.) - separate multiple terms with semicolons"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Users List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.userid}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.userid === user.userid
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium text-sm">{user.firstname} {user.lastname}</div>
                    <div className="text-xs text-gray-600 truncate">{user.email}</div>
                    <div className="text-xs text-gray-500">ID: {user.shortid}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                {searchText ? 'No users found' : 'Search for users to view profiles'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}'s Profile` : 'Select a User'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">User ID:</Label>
                        <Badge variant="outline">{selectedUser.userid}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Short ID:</Label>
                        <Badge variant="secondary">{selectedUser.shortid}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Role:</Label>
                        <Badge variant={selectedUser.role === 'admin' ? 'destructive' : 'default'}>
                          {selectedUser.role || 'user'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">First Name:</Label>
                        <span>{selectedUser.firstname || 'Not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Last Name:</Label>
                        <span>{selectedUser.lastname || 'Not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Gender:</Label>
                        <span>{selectedUser.gender || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">Email:</Label>
                        <div className="flex items-center gap-2">
                          <span>{selectedUser.email || 'Not set'}</span>
                          {selectedUser.emailverified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">Phone:</Label>
                        <span>{selectedUser.phonenumber || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">Date of Birth:</Label>
                        <span>{formatDate(selectedUser.dateofbirth)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">Age:</Label>
                        <span>{selectedUser.age ? `${selectedUser.age} years` : 'Not set'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Education:</Label>
                      <span>{selectedUser.educationlevel || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Job Status:</Label>
                      <span>{selectedUser.jobstatus ? 'Employed' : 'Not employed'}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">City:</Label>
                        <span>{selectedUser.city || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium">State:</Label>
                        <span>{selectedUser.state || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Latitude:</Label>
                      <span>{selectedUser.latitude || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Longitude:</Label>
                      <span>{selectedUser.longitude || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-full">
                      <Label className="text-sm font-medium">Max Search Distance:</Label>
                      <span>{selectedUser.maxsearchdistance ? `${selectedUser.maxsearchdistance} km` : 'Not set'}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Verification Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verification Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Email:</Label>
                      {selectedUser.emailverified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Aadhar:</Label>
                      {selectedUser.aadharverified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Passport:</Label>
                      {selectedUser.passportverified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">License:</Label>
                      {selectedUser.licenseverified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment & Terms */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment & Terms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Terms Accepted:</Label>
                      {selectedUser.termsaccepted ? (
                        <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                      ) : (
                        <Badge variant="destructive">Not Accepted</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">One-time Fees Paid:</Label>
                      {selectedUser.onetimefeespaid ? (
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      ) : (
                        <Badge variant="destructive">Not Paid</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">One-time Fees Required:</Label>
                      {selectedUser.onetimefeesrequired ? (
                        <Badge className="bg-blue-100 text-blue-800">Required</Badge>
                      ) : (
                        <Badge variant="secondary">Not Required</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Fees Amount:</Label>
                      <span className="font-medium">{formatCurrency(selectedUser.acceptedonetimefeesamount)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Account Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">User State:</Label>
                      <Badge variant={selectedUser.userstate === 'active' ? 'default' : 'secondary'}>
                        {selectedUser.userstate || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Created:</Label>
                      <span>{formatDate(selectedUser.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-full">
                      <Label className="text-sm font-medium">Last Updated:</Label>
                      <span>{selectedUser.updated_at ? formatDate(selectedUser.updated_at) : 'Not available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a user from the list to view their complete profile</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserProfiles;