import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  return (
    <FormWrapper title="Community & Personal Info">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        <div>
          <Label htmlFor="language" className="py-2">Language</Label>
          <Select
            required
            name="language"
            value={language}
            onValueChange={value => {
              updateFields({ language: value.trim() });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>{getLanguages}</SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="religion" className="py-2">Religion</Label>
          <Select
            required
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
          <Select
            required
            name="community"
            value={community}
            onValueChange={value => {
              updateFields({ community: value.trim() });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>{getCommunities}</SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="economicstatus" className="py-2">Economic Status</Label>
          <Select
            required
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
