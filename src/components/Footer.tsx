import { Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">TerrierTable</h3>
            <p className="text-white/80">
              Built by BU students to reduce food waste and bring people together
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:hello@sparkbytes.bu.edu" className="hover:text-white transition-colors">
                hello@sparkbytes.bu.edu
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <Button 
                size="icon" 
                variant="outline" 
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                asChild
              >
                <a href="https://instagram.com/sparkbytes" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                asChild
              >
                <a href="https://linkedin.com/company/sparkbytes" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
          <p className="mb-2">
            © 2025 Spark Bytes. A BU Spark! project.
          </p>
          <p>
            This is a student-run initiative and not officially affiliated with Boston University.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
