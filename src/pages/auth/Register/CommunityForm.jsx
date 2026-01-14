import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDownIcon } from 'lucide-react';
import { FormWrapper } from './FormWrapper';
import { languages } from '../../../lib/languages';
import { communities } from '../../../lib/communities';

const getLanguages = languages.map((language, index) => (
  <SelectItem key={index} value={language}>
    {language}
  </SelectItem>
));

const getCommunities = communities.map((community, index) => (
  <SelectItem key={index} value={community}>
    {community}
  </SelectItem>
));

export function CommunityForm({ language, religion, community, economicstatus, updateFields }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');

  const filteredCommunities = communities.filter(c => 
    c.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLanguages = languages.filter(l => 
    l.toLowerCase().includes(languageSearch.toLowerCase())
  );
  return (
    <FormWrapper title="Community & Personal Info">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        <div>
          <Label htmlFor="language" className="py-2">Language</Label>
          <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {language || 'Choose language'}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Search languages..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              <ScrollArea className="h-64">
                {filteredLanguages.map((lang, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      updateFields({ language: lang });
                      setLanguageOpen(false);
                      setLanguageSearch('');
                    }}
                  >
                    {lang}
                  </Button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="religion" className="py-2">Religion</Label>
          <Select
            name="religion"
            value={religion}
            onValueChange={value => {
              updateFields({ religion: value.trim() });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Hindu">Hindu</SelectItem>
                <SelectItem value="Muslim">Muslim</SelectItem>
                <SelectItem value="Christian">Christian</SelectItem>
                <SelectItem value="Sikh">Sikh</SelectItem>
                <SelectItem value="Parsi">Parsi</SelectItem>
                <SelectItem value="Jain">Jain</SelectItem>
                <SelectItem value="Buddhist">Buddhist</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="community" className="py-2">Community</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {community || 'Choose community'}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Search communities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              <ScrollArea className="h-64">
                {filteredCommunities.map((comm, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      updateFields({ community: comm });
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    {comm}
                  </Button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="economicstatus" className="py-2">Economic Status</Label>
          <Select
            name="economicstatus"
            value={economicstatus}
            onValueChange={value => {
              updateFields({ economicstatus: value.trim() });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Below Middleclass">Below Middleclass</SelectItem>
                <SelectItem value="Middleclass">Middleclass</SelectItem>
                <SelectItem value="Above Middleclass">Above Middleclass</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormWrapper>
  );
}
