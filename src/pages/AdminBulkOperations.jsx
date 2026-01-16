import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { adminSearchUsers, adminGetUsersByLocation, adminGetUsersByState, adminGetUsersFromAllStates } from '../services/userService';
import { updateUserInfo } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { states } from '../lib/states';
import { cities } from '../lib/cities';

function AdminBulkOperations() {
  const [activeTab, setActiveTab] = useState('text-search');
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [bulkOptions, setBulkOptions] = useState({
    emailverified: false,
    aadharverified: false,
    passportverified: false,
    licenseverified: false,
    onetimefeespaid: false,
    onetimefeesrequired: false,
    acceptedonetimefeesamount: '',
  });
  const [applyOptions, setApplyOptions] = useState({
    emailverified: false,
    aadharverified: false,
    passportverified: false,
    licenseverified: false,
    onetimefeespaid: false,
    onetimefeesrequired: false,
    acceptedonetimefeesamount: false,
  });

  const isOnline = useOnlineStatus();

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('adminBulkActiveTab');
    const savedSearchText = localStorage.getItem('adminBulkSearchText');
    const savedSelectedState = localStorage.getItem('adminBulkSelectedState');
    const savedSelectedCity = localStorage.getItem('adminBulkSelectedCity');
    const savedUsers = localStorage.getItem('adminBulkUsers');
    const savedSelectedUsers = localStorage.getItem('adminBulkSelectedUsers');
    const savedBulkOptions = localStorage.getItem('adminBulkOptions');
    const savedApplyOptions = localStorage.getItem('adminBulkApplyOptions');

    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
    if (savedSearchText) {
      setSearchText(savedSearchText);
    }
    if (savedSelectedState) {
      setSelectedState(savedSelectedState);
    }
    if (savedSelectedCity) {
      setSelectedCity(savedSelectedCity);
    }
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error parsing saved users data:', error);
      }
    }
    if (savedSelectedUsers) {
      try {
        setSelectedUsers(JSON.parse(savedSelectedUsers));
      } catch (error) {
        console.error('Error parsing saved selected users data:', error);
      }
    }
    if (savedBulkOptions) {
      try {
        setBulkOptions(JSON.parse(savedBulkOptions));
      } catch (error) {
        console.error('Error parsing saved bulk options data:', error);
      }
    }
    if (savedApplyOptions) {
      try {
        setApplyOptions(JSON.parse(savedApplyOptions));
      } catch (error) {
        console.error('Error parsing saved apply options data:', error);
      }
    }
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkActiveTab', activeTab);
  }, [activeTab]);

  // Save search text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkSearchText', searchText);
  }, [searchText]);

  // Save selected state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkSelectedState', selectedState);
  }, [selectedState]);

  // Save selected city to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkSelectedCity', selectedCity);
  }, [selectedCity]);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState) {
      if (selectedState === 'All') {
        // When "All" states is selected, show "All Cities" option
        setAvailableCities(['All Cities']);
        setSelectedCity('All Cities');
      } else {
        const filteredCities = cities
          .filter(city => city.state === selectedState)
          .map(city => city.name)
          .sort();
        setAvailableCities(['All', ...filteredCities]);
        // Reset city selection if current city is not in the new state and not 'All'
        if (selectedCity && selectedCity !== 'All' && !filteredCities.includes(selectedCity)) {
          setSelectedCity('');
        }
      }
    } else {
      setAvailableCities([]);
      setSelectedCity('');
    }
  }, [selectedState, selectedCity]);

  // Save users data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkUsers', JSON.stringify(users));
  }, [users]);

  // Save selected users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkSelectedUsers', JSON.stringify(selectedUsers));
  }, [selectedUsers]);

  // Save bulk options to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkOptions', JSON.stringify(bulkOptions));
  }, [bulkOptions]);

  // Save apply options to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminBulkApplyOptions', JSON.stringify(applyOptions));
  }, [applyOptions]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setUsers([]); // Clear users when state changes
    setSelectedUsers([]);
    setCurrentPage(1);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setUsers([]); // Clear users when city changes
    setSelectedUsers([]);
    setCurrentPage(1);
  };

  const handleTextSearch = async () => {
    if (!searchText.trim()) {
      toast.error('Please enter search text');
      return;
    }
    setLoading(true);
    try {
      const res = await adminSearchUsers(searchText.trim());
      if (res.success) {
        setUsers(res.data);
        setSelectedUsers([]); // Clear selections when new search
        setCurrentPage(1); // Reset to first page
        toast.success(`Found ${res.data.length} users`);
      } else {
        toast.error(res.msg || 'No users found');
        setUsers([]);
        setSelectedUsers([]);
      }
    } catch {
      toast.error('Error searching users');
      setUsers([]);
      setSelectedUsers([]);
    }
    setLoading(false);
  };

  const handleLocationSearch = async () => {
    if (!selectedState || !selectedCity) {
      toast.error('Please select both state and city');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (selectedState === 'All') {
        // Get users from all states
        res = await adminGetUsersFromAllStates();
      } else if (selectedCity === 'All') {
        // Get users from all cities in the selected state
        res = await adminGetUsersByState(selectedState);
      } else {
        // Get users from specific city
        res = await adminGetUsersByLocation(selectedState, selectedCity);
      }

      if (res.success) {
        setUsers(res.data);
        setSelectedUsers([]); // Clear selections when new search
        setCurrentPage(1); // Reset to first page
        const locationText = selectedState === 'All' ? 'all states' : (selectedCity === 'All' ? `all cities in ${selectedState}` : `${selectedCity}, ${selectedState}`);
        toast.success(`Found ${res.data.length} users in ${locationText}`);
      } else {
        toast.error(res.msg || 'No users found');
        setUsers([]);
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
      setUsers([]);
      setSelectedUsers([]);
    }
    setLoading(false);
  };

  const handleUserSelect = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      // Select all users on current page
      const currentPageUserIds = currentUsers.map(user => user.userid);
      setSelectedUsers(prev => [...new Set([...prev, ...currentPageUserIds])]);
    } else {
      // Deselect all users on current page
      const currentPageUserIds = currentUsers.map(user => user.userid);
      setSelectedUsers(prev => prev.filter(id => !currentPageUserIds.includes(id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    if (!isOnline) {
      toast.error('You are offline');
      return;
    }

    // Check if at least one option is selected to apply
    const hasSelectedOptions = Object.values(applyOptions).some(value => value === true);
    if (!hasSelectedOptions) {
      toast.error('Please select at least one option to apply');
      return;
    }

    setUpdating(true);
    try {
      const updatePromises = selectedUsers.map(async (userId) => {
        const updateData = {};

        // Only include fields that are selected to be applied
        if (applyOptions.emailverified) updateData.emailverified = bulkOptions.emailverified;
        if (applyOptions.aadharverified) updateData.aadharverified = bulkOptions.aadharverified;
        if (applyOptions.passportverified) updateData.passportverified = bulkOptions.passportverified;
        if (applyOptions.licenseverified) updateData.licenseverified = bulkOptions.licenseverified;
        if (applyOptions.onetimefeespaid) updateData.onetimefeespaid = bulkOptions.onetimefeespaid;
        if (applyOptions.onetimefeesrequired) updateData.onetimefeesrequired = bulkOptions.onetimefeesrequired;
        if (applyOptions.acceptedonetimefeesamount) updateData.acceptedonetimefeesamount = bulkOptions.acceptedonetimefeesamount;

        return updateUserInfo(userId, updateData);
      });

      const results = await Promise.all(updatePromises);
      const successCount = results.filter(result => result.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} user${successCount > 1 ? 's' : ''}`);
        // Refresh the user list to show updated data
        if (activeTab === 'text-search' && searchText.trim()) {
          const res = await adminSearchUsers(searchText.trim());
          if (res.success) {
            setUsers(res.data);
          }
        } else if (activeTab === 'location-search' && selectedState && selectedCity) {
          let res;
          if (selectedState === 'All') {
            res = await adminGetUsersFromAllStates();
          } else if (selectedCity === 'All') {
            res = await adminGetUsersByState(selectedState);
          } else {
            res = await adminGetUsersByLocation(selectedState, selectedCity);
          }
          if (res.success) {
            setUsers(res.data);
          }
        }
      }

      if (failCount > 0) {
        toast.error(`Failed to update ${failCount} user${failCount > 1 ? 's' : ''}`);
      }

    } catch {
      toast.error('Error updating users');
    }
    setUpdating(false);
  };

  const handleClear = () => {
    setActiveTab('text-search');
    setSearchText('');
    setSelectedState('');
    setSelectedCity('');
    setAvailableCities([]);
    setUsers([]);
    setSelectedUsers([]);
    setCurrentPage(1);
    setBulkOptions({
      emailverified: false,
      aadharverified: false,
      passportverified: false,
      licenseverified: false,
      onetimefeespaid: false,
      onetimefeesrequired: false,
      acceptedonetimefeesamount: '',
    });
    setApplyOptions({
      emailverified: false,
      aadharverified: false,
      passportverified: false,
      licenseverified: false,
      onetimefeespaid: false,
      onetimefeesrequired: false,
      acceptedonetimefeesamount: false,
    });
    localStorage.removeItem('adminBulkActiveTab');
    localStorage.removeItem('adminBulkSearchText');
    localStorage.removeItem('adminBulkSelectedState');
    localStorage.removeItem('adminBulkSelectedCity');
    localStorage.removeItem('adminBulkUsers');
    localStorage.removeItem('adminBulkSelectedUsers');
    localStorage.removeItem('adminBulkOptions');
    localStorage.removeItem('adminBulkApplyOptions');
    toast.success('All data cleared');
  };

  const handleBulkOptionChange = (field, value) => {
    setBulkOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyOptionChange = (field, checked) => {
    setApplyOptions(prev => ({ ...prev, [field]: checked }));
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Clear selections when changing pages
    setSelectedUsers([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bulk User Operations</h1>

      {/* Search Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-search">Text Search</TabsTrigger>
              <TabsTrigger value="location-search">Location Search</TabsTrigger>
            </TabsList>

            <TabsContent value="text-search" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter search text (name, email, phone, etc.) - separate multiple terms with semicolons"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                />
                <Button onClick={handleTextSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="location-search" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex gap-2">
                <Button onClick={handleLocationSearch} disabled={loading || !selectedState || !selectedCity}>
                  {loading ? 'Searching...' : 'Search by Location'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Options Section */}
      {users.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Bulk Update Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-emailverified"
                  checked={applyOptions.emailverified}
                  onCheckedChange={(checked) => handleApplyOptionChange('emailverified', checked)}
                />
                <Label htmlFor="apply-emailverified">Apply Email Verified</Label>
                <Checkbox
                  id="emailverified"
                  checked={bulkOptions.emailverified}
                  onCheckedChange={(checked) => handleBulkOptionChange('emailverified', checked)}
                  disabled={!applyOptions.emailverified}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-aadharverified"
                  checked={applyOptions.aadharverified}
                  onCheckedChange={(checked) => handleApplyOptionChange('aadharverified', checked)}
                />
                <Label htmlFor="apply-aadharverified">Apply Aadhar Verified</Label>
                <Checkbox
                  id="aadharverified"
                  checked={bulkOptions.aadharverified}
                  onCheckedChange={(checked) => handleBulkOptionChange('aadharverified', checked)}
                  disabled={!applyOptions.aadharverified}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-passportverified"
                  checked={applyOptions.passportverified}
                  onCheckedChange={(checked) => handleApplyOptionChange('passportverified', checked)}
                />
                <Label htmlFor="apply-passportverified">Apply Passport Verified</Label>
                <Checkbox
                  id="passportverified"
                  checked={bulkOptions.passportverified}
                  onCheckedChange={(checked) => handleBulkOptionChange('passportverified', checked)}
                  disabled={!applyOptions.passportverified}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-licenseverified"
                  checked={applyOptions.licenseverified}
                  onCheckedChange={(checked) => handleApplyOptionChange('licenseverified', checked)}
                />
                <Label htmlFor="apply-licenseverified">Apply License Verified</Label>
                <Checkbox
                  id="licenseverified"
                  checked={bulkOptions.licenseverified}
                  onCheckedChange={(checked) => handleBulkOptionChange('licenseverified', checked)}
                  disabled={!applyOptions.licenseverified}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-onetimefeespaid"
                  checked={applyOptions.onetimefeespaid}
                  onCheckedChange={(checked) => handleApplyOptionChange('onetimefeespaid', checked)}
                />
                <Label htmlFor="apply-onetimefeespaid">Apply One-time Fees Paid</Label>
                <Checkbox
                  id="onetimefeespaid"
                  checked={bulkOptions.onetimefeespaid}
                  onCheckedChange={(checked) => handleBulkOptionChange('onetimefeespaid', checked)}
                  disabled={!applyOptions.onetimefeespaid}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-onetimefeesrequired"
                  checked={applyOptions.onetimefeesrequired}
                  onCheckedChange={(checked) => handleApplyOptionChange('onetimefeesrequired', checked)}
                />
                <Label htmlFor="apply-onetimefeesrequired">Apply One-time Fees Required</Label>
                <Checkbox
                  id="onetimefeesrequired"
                  checked={bulkOptions.onetimefeesrequired}
                  onCheckedChange={(checked) => handleBulkOptionChange('onetimefeesrequired', checked)}
                  disabled={!applyOptions.onetimefeesrequired}
                />
              </div>

              <div className="flex items-center space-x-2 col-span-full">
                <Checkbox
                  id="apply-acceptedonetimefeesamount"
                  checked={applyOptions.acceptedonetimefeesamount}
                  onCheckedChange={(checked) => handleApplyOptionChange('acceptedonetimefeesamount', checked)}
                />
                <Label htmlFor="apply-acceptedonetimefeesamount">Apply One-time Fees Amount</Label>
                <Input
                  id="acceptedonetimefeesamount"
                  type="number"
                  placeholder="Enter amount"
                  value={bulkOptions.acceptedonetimefeesamount}
                  onChange={(e) => handleBulkOptionChange('acceptedonetimefeesamount', e.target.value)}
                  disabled={!applyOptions.acceptedonetimefeesamount}
                  className="w-32"
                />
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={handleBulkUpdate} disabled={updating || selectedUsers.length === 0}>
                {updating ? 'Updating...' : `Update ${selectedUsers.length} Selected User${selectedUsers.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Users ({users.length}) - Page {currentPage} of {totalPages}</span>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">Select All (Current Page)</Label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentUsers.map((user) => (
                <div key={user.userid} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`user-${user.userid}`}
                    checked={selectedUsers.includes(user.userid)}
                    onCheckedChange={(checked) => handleUserSelect(user.userid, checked)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{user.firstname} {user.lastname}</div>
                    <div className="text-sm text-gray-600">{user.email} • {user.phonenumber}</div>
                    <div className="text-xs text-gray-500">ID: {user.shortid}</div>
                  </div>
                  <div className="flex space-x-2 text-xs">
                    <span className={`px-2 py-1 rounded ${user.emailverified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Email {user.emailverified ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-1 rounded ${user.aadharverified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Aadhar {user.aadharverified ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-1 rounded ${user.passportverified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Passport {user.passportverified ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-1 rounded ${user.licenseverified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      License {user.licenseverified ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length} users
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdminBulkOperations;