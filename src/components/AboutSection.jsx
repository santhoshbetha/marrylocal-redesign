import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AboutSection() {
  const navigate = useNavigate();

  return (
    <section id="about" className="">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                About MarryLocal
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-balance">
                Find authentic matches in the digital age
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p className="text-sm sm:text-base text-pretty">
                In today's connected world, finding genuine matches in your location shouldn't
                require jumping between multiple apps or spending thousands of rupees.
              </p>
              <p className="text-sm sm:text-base text-pretty">
                MarryLocal is designed specifically for people seeking matches around them in their
                locality, whether for marriage or long-term relationships.
              </p>
              <p className="text-sm sm:text-base text-pretty">
                Our platform serves the middle class and diverse populations across India, providing
                a safe, verified environment where you can search and connect with ease, peace, and
                confidence.
              </p>
            </div>

            <Button className="mt-6" onClick={() => navigate('/about')}>
              Learn More About Us
            </Button>
          </div>

          <div className="relative order-1 lg:order-2 hidden lg:block md:p-24">
            <img src="/diverse.png" alt="Community illustration" className="w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
