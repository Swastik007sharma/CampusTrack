import {
    Github,
    Linkedin,
    Instagram,
    Twitter,
    Bell,
    LayoutDashboard,
    Mic,
    FileText,
    Lock,
    Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: "GitHub",
            href: "https://github.com/Swastik007sharma/CampusTrack",
            icon: Github,
        },
        {
            name: "Instagram",
            href: "#",
            icon: Instagram,
        },
        {
            name: "Twitter",
            href: "#",
            icon: Twitter,
        },
        {
            name: "LinkedIn",
            href: "#",
            icon: Linkedin,
        },
    ];

    const footerLinks = [
        {
            title: "Navigation",
            links: [
                { name: "Home", href: "/home", icon: Mic },
                { name: "Notifications", href: "/notifications", icon: Bell },
                { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Privacy Policy", href: "/privacy-policy", icon: Lock },
                { name: "Terms & Conditions", href: "/terms-and-conditions", icon: FileText },
                { name: "Contact", href: "mailto:project.k3925@gmail.com", icon: Mail },
            ],
        },
    ];

    return (
        <footer className={`${theme === "dark" ? "bg-gray-900 text-gray-100 border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-blue-600 mb-3">
                            CampusTrack
                        </h2>
                        <p className={`max-w-md text-sm leading-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            CampusTrack is a full-stack web application designed to help students and staff of a college report, find, and manage lost and found items on campus. The system enables seamless tracking of lost belongings, efficient moderation, and easy communication between finders and owners.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} hover:text-blue-500 transition-colors duration-200`}
                                >
                                    <social.icon className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className={`font-semibold mb-4 text-sm uppercase tracking-wide ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className={`text-sm flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            <link.icon className={`w-4 h-4 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                                            <span>{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className={`border-t mt-12 pt-6 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className={`text-center md:text-left text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            © {currentYear} CampusTrack. Made with ❤️ All rights reserved.
                        </p>
                        <div className={`flex items-center space-x-4 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-and-conditions" className="hover:text-blue-600 transition-colors">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
