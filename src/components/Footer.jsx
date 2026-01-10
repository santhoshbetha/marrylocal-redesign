import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Heart, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 sm:py-16 mt-14">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <img src="/logored.png" alt="Logo" className="h-8 w-8" />
              <span className="font-serif text-xl font-semibold">MarryLocal</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Find meaningful connections in your locality with freedom and choice.
            </p>
            <div className="flex space-x-4">
              <FaInstagram className="h-5 w-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer" />
              <FaFacebook className="h-5 w-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer" />
              <FaTwitter className="h-5 w-5 text-primary-foreground/60 hover:text-primary-foreground cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Useful Links</h4>
            <div className="space-y-2 text-sm">
              <div>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground">
                  Home
                </Link>
              </div>
              <div>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  About us
                </Link>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Contact
                </Link>
              </div>
              <div>
                <Link
                  to="/terms"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Terms of service
                </Link>
              </div>
              <div>
                <Link
                  to="/privacy"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <div>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Help Center
                </Link>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Report Issues
                </Link>
              </div>
              <div>
                <Link
                  to="/cancellation"
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Cancellation
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4" id="contact">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-primary-foreground/80">contact@marrylocal.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-primary-foreground/80">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Copyright MarryLocal (MEERA APPS). All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
