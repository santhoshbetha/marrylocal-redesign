import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { states } from '../lib/states';
import { cities } from '../lib/cities';
import { MapPin, Users, Mail, Phone, User, ChevronLeft, ChevronRight } from 'lucide-react';

function AdminUserList() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Show 10 users per page

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('adminUserListState');
    const savedCity = localStorage.getItem('adminUserListCity');
    const savedUsers = localStorage.getItem('adminUserListUsers');
    const savedCurrentPage = localStorage.getItem('adminUserListCurrentPage');

    if (savedState) {
      setSelectedState(savedState);
    }
    if (savedCity) {
      setSelectedCity(savedCity);
    }
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error parsing saved users:', error);
      }
    }
    if (savedCurrentPage) {
      setCurrentPage(parseInt(savedCurrentPage, 10) || 1);
    }
  }, []);

  // Save state and city to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminUserListState', selectedState);
  }, [selectedState]);

  useEffect(() => {
    localStorage.setItem('adminUserListCity', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('adminUserListUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('adminUserListCurrentPage', currentPage.toString());
  }, [currentPage]);

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

  const handleStateChange = (state) => {
    setSelectedState(state);
    // Don't clear users here - only clear when actually searching or clearing selection
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    // Don't clear users here - only clear when actually searching or clearing selection
  };

  const handleSearch = async () => {
    if (!selectedState || !selectedCity) {
      toast.error('Please select both state and city');
      return;
    }

    setLoading(true);
    try {
      // Import the service function we'll create
      const { adminGetUsersByLocation, adminGetUsersByState, adminGetUsersFromAllStates } = await import('../services/userService');

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
        setCurrentPage(1); // Reset to first page when new results load
        const locationText = selectedState === 'All' ? 'all states' : (selectedCity === 'All' ? `all cities in ${selectedState}` : `${selectedCity}, ${selectedState}`);
        toast.success(`Found ${res.data.length} users in ${locationText}`);
      } else {
        toast.error(res.msg || 'No users found');
        setUsers([]);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
      setUsers([]);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setSelectedState('');
    setSelectedCity('');
    setUsers([]);
    setCurrentPage(1); // Reset to first page
    localStorage.removeItem('adminUserListState');
    localStorage.removeItem('adminUserListCity');
    localStorage.removeItem('adminUserListUsers');
    localStorage.removeItem('adminUserListCurrentPage');
    toast.success('Selection cleared');
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      toast.error('No users to export');
      return;
    }

    const csvContent = [
      ['Name', 'Email', 'Phone Number', 'State', 'City'], // Header
      ...users.map(user => [
        `${user.firstname} ${user.lastname}`.trim(),
        user.email || '',
        user.phonenumber || '',
        user.state || (selectedState === 'All' ? 'All States' : selectedState),
        user.city || (selectedCity === 'All Cities' ? 'All Cities' : selectedCity)
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const locationText = selectedState === 'All' ? 'all_states' : (selectedCity === 'All' ? 'all_cities' : selectedCity.replace(/[^a-zA-Z0-9]/g, '_'));
    const stateText = selectedState === 'All' ? 'all_states' : selectedState.replace(/[^a-zA-Z0-9]/g, '_');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${locationText}_${stateText}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">User List by Location</h1>
      </div>

      {/* Selection Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="state-select">State</Label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a state" />
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

            <div className="flex-1">
              <Label htmlFor="city-select">{selectedState === 'All' ? 'Cities' : 'City'}</Label>
              <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedState === 'All' ? "All Cities" : "Select a city"} />
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
            <Button onClick={handleSearch} disabled={loading || !selectedState || !selectedCity}>
              {loading ? 'Searching...' : 'Search Users'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear Selection
            </Button>
            {users.length > 0 && (
              <Button variant="outline" onClick={exportToCSV}>
                Export to CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Users in {selectedCity === 'All' ? 'All Cities' : selectedCity}, {selectedState} ({users.length} total, page {currentPage} of {totalPages})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentUsers.map((user) => (
                <div key={user.userid} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phonenumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.emailverified && (
                      <Badge variant="secondary" className="text-xs">
                        Email ✓
                      </Badge>
                    )}
                    {user.aadharverified && (
                      <Badge variant="secondary" className="text-xs">
                        Aadhar ✓
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {users.length === 0 && !loading && selectedState && selectedCity && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No users found in {selectedCity}, {selectedState}</p>
          </CardContent>
        </Card>
      )}

  </div>
);
}

export default AdminUserList;